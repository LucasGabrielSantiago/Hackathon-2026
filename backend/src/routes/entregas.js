const express = require('express');
const { getDb } = require('../db');
const config = require('../config');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { ErroNegocio } = require('../services/erros');
const qr = require('../services/qrcode');
const { registrarEntrega } = require('../services/entregas');

const router = express.Router();

// Morador gera um QR de identificação para entregar no ponto.
router.post('/qrcode', autenticar, exigirPerfil('morador'), (req, res) => {
  const registro = qr.gerarCodigo(getDb().qrcodes, { tipo: 'entrega', usuarioId: req.usuario.id, validadeMinutos: config.qrValidadeMinutos });
  res.status(201).json({ codigo: registro.codigo, expira_em: registro.expira_em });
});

// Ponto (ou admin) registra a pesagem. O VALOR é calculado aqui, nunca vem do front-end.
router.post('/', autenticar, exigirPerfil('ponto', 'admin'), (req, res) => {
  const db = getDb();
  const { codigo, pedido_id, itens, ponto_id } = req.body || {};
  if (!codigo && !pedido_id) throw new ErroNegocio('IDENTIFICACAO_OBRIGATORIA', 'Leia o QR Code do morador ou informe o pedido.');

  let pontoId;
  if (req.usuario.perfil === 'ponto') {
    const ponto = db.pontos.find((p) => p.usuario_id === req.usuario.id && p.aprovado);
    if (!ponto) throw new ErroNegocio('PONTO_NAO_APROVADO', 'Seu ponto ainda não foi aprovado.', 403);
    pontoId = ponto.id;
  } else {
    pontoId = Number(ponto_id);
  }

  const resultado = registrarEntrega(db, {
    pontoId, operadorId: req.usuario.id, itens, codigo,
    pedidoId: pedido_id ? Number(pedido_id) : null,
    chaveIdempotencia: req.get('Idempotency-Key') || null,
  });
  res.status(resultado.duplicada ? 200 : 201).json(resultado);
});

router.get('/minhas', autenticar, exigirPerfil('morador'), (req, res) => {
  const db = getDb();
  const entregas = db.entregas.filter((e) => e.morador_usuario_id === req.usuario.id)
    .map((e) => ({ ...e, itens: db.itensEntrega.filter((i) => i.entrega_id === e.id), ponto: db.pontos.find((p) => p.id === e.ponto_id)?.nome }));
  res.json({ entregas });
});

router.get('/ponto', autenticar, exigirPerfil('ponto'), (req, res) => {
  const db = getDb();
  const meusPontos = db.pontos.filter((p) => p.usuario_id === req.usuario.id).map((p) => p.id);
  res.json({ entregas: db.entregas.filter((e) => meusPontos.includes(e.ponto_id)) });
});

module.exports = router;
