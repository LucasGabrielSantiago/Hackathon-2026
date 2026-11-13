const express = require('express');
const { getDb } = require('../db');
const { autenticar } = require('../middlewares/auth');
const transacoes = require('../services/transacoes');

const router = express.Router();

router.get('/', autenticar, (req, res) => {
  const lista = getDb().transacoes;
  res.json({
    saldo_centavos: transacoes.saldo(lista, req.usuario.id),
    extrato: transacoes.extrato(lista, req.usuario.id).map(({ chave_idempotencia, ...t }) => t),
    demo: true,
    aviso: 'Créditos demonstrativos: ainda não podem ser resgatados.',
  });
});

module.exports = router;
