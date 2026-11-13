const express = require('express');
const { getDb } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { ErroNegocio } = require('../services/erros');

const router = express.Router();

router.get('/pendentes', autenticar, exigirPerfil('admin'), (req, res) => {
  const db = getDb();
  const pendentes = db.catadores.filter((c) => !c.aprovado).map((c) => {
    const u = db.usuarios.find((x) => x.id === c.usuario_id);
    return { ...c, nome: u?.nome, email: u?.email };
  });
  res.json({ catadores: pendentes });
});

router.patch('/:id/aprovar', autenticar, exigirPerfil('admin'), (req, res) => {
  const db = getDb();
  const catador = db.catadores.find((c) => c.id === Number(req.params.id));
  if (!catador) throw new ErroNegocio('NAO_ENCONTRADO', 'Catador não encontrado.', 404);
  catador.aprovado = true;
  db.auditoria.push({ acao: 'aprovar_catador', usuario_id: req.usuario.id, catador_id: catador.id, em: new Date().toISOString() });
  res.json({ catador });
});

module.exports = router;
