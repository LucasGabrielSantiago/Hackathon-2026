const express = require('express');
const { getDb } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { ErroNegocio } = require('../services/erros');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ materiais: getDb().materiais.filter((m) => m.ativo), demo: true });
});

// Preços só podem ser alterados pelo admin, com auditoria.
router.put('/:id/preco', autenticar, exigirPerfil('admin'), (req, res) => {
  const db = getDb();
  const material = db.materiais.find((m) => m.id === Number(req.params.id));
  if (!material) throw new ErroNegocio('NAO_ENCONTRADO', 'Material não encontrado.', 404);
  const novo = Number(req.body?.preco_kg_centavos);
  if (!Number.isInteger(novo) || novo < 0) throw new ErroNegocio('PRECO_INVALIDO', 'Preço deve ser inteiro em centavos.');
  db.auditoria.push({ acao: 'alterar_preco', usuario_id: req.usuario.id, material_id: material.id, de: material.preco_kg_centavos, para: novo, em: new Date().toISOString() });
  material.preco_kg_centavos = novo;
  res.json({ material });
});

module.exports = router;
