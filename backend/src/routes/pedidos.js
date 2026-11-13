// Coleta em casa (seção 6.3 do CONTEXT.md).
const express = require('express');
const { getDb, inserir } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { ErroNegocio } = require('../services/erros');
const { transicionar } = require('../services/pedidoStatus');
const qr = require('../services/qrcode');

const router = express.Router();
const MATERIAIS = ['plastico', 'metal', 'vidro', 'papel'];

function catadorAprovado(db, usuarioId) {
  const catador = db.catadores.find((c) => c.usuario_id === usuarioId);
  // Regra 8: cadastro pendente não recebe pedidos.
  if (!catador || !catador.aprovado) throw new ErroNegocio('CATADOR_PENDENTE', 'Seu cadastro ainda está em análise.', 403);
  return catador;
}

function buscarPedido(db, id) {
  const pedido = db.pedidos.find((p) => p.id === Number(id));
  if (!pedido) throw new ErroNegocio('NAO_ENCONTRADO', 'Pedido não encontrado.', 404);
  return pedido;
}

router.post('/', autenticar, exigirPerfil('morador'), (req, res) => {
  const db = getDb();
  const { materiais_estimados, endereco, bairro_id, janela_horario } = req.body || {};
  if (!Array.isArray(materiais_estimados) || materiais_estimados.length === 0 || !materiais_estimados.every((m) => MATERIAIS.includes(m.material) && Number(m.quantidade_kg) > 0)) {
    throw new ErroNegocio('MATERIAIS_INVALIDOS', 'Informe os materiais e a quantidade estimada.');
  }
  if (!endereco) throw new ErroNegocio('ENDERECO_OBRIGATORIO', 'Informe o endereço da coleta.');
  if (!db.bairros.some((b) => b.id === Number(bairro_id))) throw new ErroNegocio('BAIRRO_INVALIDO', 'Bairro inválido.');
  if (!janela_horario) throw new ErroNegocio('HORARIO_OBRIGATORIO', 'Escolha uma janela de horário.');

  const morador = db.moradores.find((m) => m.usuario_id === req.usuario.id);
  const pedido = inserir('pedidos', {
    morador_id: morador?.id ?? null, morador_usuario_id: req.usuario.id, catador_id: null, catador_usuario_id: null,
    endereco, bairro_id: Number(bairro_id), janela_horario, materiais_estimados, status: 'aberto', criado_em: new Date().toISOString(),
  });
  // QR do pedido: o catador confirma a coleta lendo este código na casa do morador.
  const codigo = qr.gerarCodigo(db.qrcodes, { tipo: 'pedido', referenciaId: pedido.id, usuarioId: req.usuario.id, validadeMinutos: 7 * 24 * 60 });
  pedido.qr_code = codigo.codigo;
  res.status(201).json({ pedido });
});

router.get('/meus', autenticar, exigirPerfil('morador'), (req, res) => {
  res.json({ pedidos: getDb().pedidos.filter((p) => p.morador_usuario_id === req.usuario.id) });
});

// Endereço completo só é exibido ao catador DEPOIS de aceitar (minimização de dados — LGPD).
router.get('/proximos', autenticar, exigirPerfil('catador'), (req, res) => {
  const db = getDb();
  const catador = catadorAprovado(db, req.usuario.id);
  const pedidos = db.pedidos
    .filter((p) => p.status === 'aberto' && (catador.bairros.length === 0 || catador.bairros.includes(p.bairro_id)))
    .map(({ endereco, qr_code, morador_usuario_id, ...resto }) => ({ ...resto, bairro: db.bairros.find((b) => b.id === resto.bairro_id)?.nome }));
  res.json({ pedidos });
});

router.get('/minhas-coletas', autenticar, exigirPerfil('catador'), (req, res) => {
  const pedidos = getDb().pedidos
    .filter((p) => p.catador_usuario_id === req.usuario.id)
    .map(({ qr_code, ...resto }) => resto);
  res.json({ pedidos });
});

router.post('/:id/aceitar', autenticar, exigirPerfil('catador'), (req, res) => {
  const db = getDb();
  const catador = catadorAprovado(db, req.usuario.id);
  const pedido = buscarPedido(db, req.params.id);
  transicionar(pedido, 'aceito');
  pedido.catador_id = catador.id;
  pedido.catador_usuario_id = req.usuario.id;
  const { qr_code, ...resto } = pedido;
  res.json({ pedido: resto });
});

router.post('/:id/recusar', autenticar, exigirPerfil('catador'), (req, res) => {
  const pedido = buscarPedido(getDb(), req.params.id);
  if (pedido.catador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não está com você.', 403);
  transicionar(pedido, 'aberto');
  pedido.catador_id = null;
  pedido.catador_usuario_id = null;
  res.json({ mensagem: 'Pedido devolvido para a fila.' });
});

router.post('/:id/coletar', autenticar, exigirPerfil('catador'), (req, res) => {
  const db = getDb();
  const pedido = buscarPedido(db, req.params.id);
  if (pedido.catador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não está com você.', 403);
  const registro = qr.validar(db.qrcodes, req.body?.codigo, { tipo: 'pedido' });
  if (registro.referencia_id !== pedido.id) throw new ErroNegocio('QR_INVALIDO', 'QR Code não pertence a este pedido.');
  transicionar(pedido, 'coletado');
  qr.consumir(db.qrcodes, req.body.codigo, { tipo: 'pedido' });
  const { qr_code, ...resto } = pedido;
  res.json({ pedido: resto, mensagem: 'Coleta confirmada. Leve o material a um ponto autorizado para pesagem.' });
});

router.post('/:id/cancelar', autenticar, exigirPerfil('morador'), (req, res) => {
  const pedido = buscarPedido(getDb(), req.params.id);
  if (pedido.morador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não é seu.', 403);
  transicionar(pedido, 'cancelado');
  res.json({ pedido });
});

module.exports = router;
