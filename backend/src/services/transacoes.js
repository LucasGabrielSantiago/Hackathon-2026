// Regra 6: livro de transações. O saldo é SEMPRE derivado das transações (nunca alterado direto).
// Idempotência: a mesma chave nunca gera dois créditos.
const { ErroNegocio } = require('./erros');

function registrar(lista, { usuarioId, valorCentavos, tipo, origem, entregaId = null, campanhaId = null, chaveIdempotencia, demo = true }) {
  if (!chaveIdempotencia) throw new ErroNegocio('SEM_IDEMPOTENCIA', 'Chave de idempotência obrigatória.');
  const existente = lista.find((t) => t.chave_idempotencia === chaveIdempotencia);
  if (existente) return { transacao: existente, duplicada: true };
  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) throw new ErroNegocio('VALOR_INVALIDO', 'Valor deve ser inteiro positivo em centavos.');
  if (!['credito', 'debito'].includes(tipo)) throw new ErroNegocio('TIPO_INVALIDO', 'Tipo deve ser crédito ou débito.');
  if (tipo === 'debito' && saldo(lista, usuarioId) < valorCentavos) throw new ErroNegocio('SALDO_INSUFICIENTE', 'Saldo insuficiente.');

  const transacao = {
    id: lista.length + 1,
    usuario_id: usuarioId,
    entrega_id: entregaId,
    campanha_id: campanhaId,
    valor_centavos: valorCentavos,
    tipo,
    origem, // 'bolsa_reciclagem' | 'remuneracao_catador' | 'resgate'
    status: 'confirmada',
    demo, // Separar créditos demonstrativos de reais
    chave_idempotencia: chaveIdempotencia,
    criado_em: new Date().toISOString(),
  };
  lista.push(transacao);
  return { transacao, duplicada: false };
}

function saldo(lista, usuarioId) {
  return lista
    .filter((t) => t.usuario_id === usuarioId && t.status === 'confirmada')
    .reduce((s, t) => s + (t.tipo === 'credito' ? t.valor_centavos : -t.valor_centavos), 0);
}

function extrato(lista, usuarioId) {
  return lista.filter((t) => t.usuario_id === usuarioId).sort((a, b) => b.id - a.id);
}

module.exports = { registrar, saldo, extrato };
