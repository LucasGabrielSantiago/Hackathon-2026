// Registro de pesagem e geração de créditos (Regras 1–6).
const config = require('../config');
const { ErroNegocio } = require('./erros');
const { calcularEntrega, calcularRemuneracaoCatador } = require('./recompensa');
const { transicionar, entregarPeloMorador } = require('./pedidoStatus');
const qr = require('./qrcode');
const transacoes = require('./transacoes');

function proximoId(lista) {
  return lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
}

/**
 * Registra uma entrega pesada no ponto.
 * - Direta: { codigo } = QR de entrega do morador.
 * - Coleta em casa trazida pelo coletor: { pedidoId } = pedido "coletado".
 * - Coleta em casa trazida pelo próprio morador: { pedidoId, codigo } = pedido "aberto" + QR do pedido.
 */
function registrarEntrega(db, { pontoId, operadorId, itens, codigo, pedidoId, chaveIdempotencia, agora = new Date() }) {
  if (chaveIdempotencia) {
    const existente = db.entregas.find((e) => e.chave_idempotencia === chaveIdempotencia);
    if (existente) return { entrega: existente, duplicada: true };
  }
  const ponto = db.pontos.find((p) => p.id === pontoId);
  if (!ponto || !ponto.aprovado) throw new ErroNegocio('PONTO_NAO_APROVADO', 'Ponto de coleta não aprovado.', 403);

  // 1) Calcula ANTES de consumir o QR, para não queimar o código se a pesagem estiver errada.
  const calculo = calcularEntrega(itens, db.materiais);
  const naoAceitos = calculo.itens.filter((i) => !ponto.materiais_aceitos.includes(i.material));
  if (naoAceitos.length) throw new ErroNegocio('MATERIAL_NAO_ACEITO', `Este ponto não aceita: ${naoAceitos.map((i) => i.material).join(', ')}`);

  let moradorUsuarioId; let catadorUsuarioId = null; let pedido = null; let entreguePor = 'morador';
  if (pedidoId) {
    pedido = db.pedidos.find((p) => p.id === pedidoId);
    if (!pedido) throw new ErroNegocio('NAO_ENCONTRADO', 'Pedido não encontrado.', 404);
    moradorUsuarioId = pedido.morador_usuario_id;
    if (pedido.status === 'coletado') {
      // O coletor buscou na casa e trouxe: basta o número do pedido.
      catadorUsuarioId = pedido.catador_usuario_id;
      entreguePor = 'coletor';
    } else if (pedido.status === 'aberto') {
      // Ninguém aceitou e o próprio morador trouxe: confere o QR do pedido (só ele tem).
      if (!codigo) throw new ErroNegocio('QR_OBRIGATORIO', 'Quando o próprio morador traz o material, leia também o QR Code do pedido.');
      const registro = qr.validar(db.qrcodes, codigo, { tipo: 'pedido', agora });
      if (registro.referencia_id !== pedido.id) throw new ErroNegocio('QR_INVALIDO', 'Este QR Code não é deste pedido.');
    } else if (pedido.status === 'aceito') {
      throw new ErroNegocio('COLETOR_A_CAMINHO', 'Um coletor aceitou este pedido. Ele precisa confirmar a coleta (ou desistir) antes da entrega.', 409);
    } else {
      throw new ErroNegocio('STATUS_INVALIDO', `Este pedido já está ${pedido.status === 'entregue' ? 'entregue' : 'cancelado'}.`, 409);
    }
  } else {
    const registro = qr.consumir(db.qrcodes, codigo, { tipo: 'entrega', agora });
    moradorUsuarioId = registro.usuario_id;
  }

  const entrega = {
    id: proximoId(db.entregas),
    morador_usuario_id: moradorUsuarioId,
    catador_usuario_id: catadorUsuarioId,
    ponto_id: ponto.id,
    pedido_id: pedido?.id ?? null,
    entregue_por: entreguePor,
    operador_id: operadorId,
    peso_total_gramas: calculo.peso_total_gramas,
    recompensa_centavos: calculo.total_centavos,
    status: 'confirmada',
    chave_idempotencia: chaveIdempotencia || null,
    criado_em: agora.toISOString(),
  };
  db.entregas.push(entrega);
  calculo.itens.forEach((i) => db.itensEntrega.push({ id: proximoId(db.itensEntrega), entrega_id: entrega.id, ...i }));

  // 2) Bolsa Reciclagem para o morador.
  if (calculo.total_centavos > 0) {
    transacoes.registrar(db.transacoes, {
      usuarioId: moradorUsuarioId, valorCentavos: calculo.total_centavos, tipo: 'credito',
      origem: 'bolsa_reciclagem', entregaId: entrega.id, chaveIdempotencia: `entrega:${entrega.id}:morador`,
    });
  }
  // 3) Remuneração do catador, SEPARADA e sem descontar do morador (Regra 4).
  if (catadorUsuarioId) {
    const remuneracao = calcularRemuneracaoCatador(calculo.peso_total_gramas, config.catadorCentavosPorKg);
    entrega.remuneracao_catador_centavos = remuneracao;
    if (remuneracao > 0) {
      transacoes.registrar(db.transacoes, {
        usuarioId: catadorUsuarioId, valorCentavos: remuneracao, tipo: 'credito',
        origem: 'remuneracao_catador', entregaId: entrega.id, chaveIdempotencia: `entrega:${entrega.id}:catador`,
      });
    }
    transicionar(pedido, 'entregue');
  } else if (pedido) {
    qr.consumir(db.qrcodes, codigo, { tipo: 'pedido', agora });
    entregarPeloMorador(pedido);
  }

  return { entrega, itens: calculo.itens, duplicada: false };
}

module.exports = { registrarEntrega };
