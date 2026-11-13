const express = require('express');
const { reset } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const persistencia = require('../db/persistencia');

const router = express.Router();

// Volta tudo aos dados de demonstração (útil antes de uma apresentação).
router.post('/resetar-demo', autenticar, exigirPerfil('admin'), async (req, res, next) => {
  try {
    reset();
    await persistencia.gravar();
    res.json({ mensagem: 'Dados de demonstração restaurados.', persistido: persistencia.ativa() });
  } catch (e) { next(e); }
});

router.get('/status', autenticar, exigirPerfil('admin'), (req, res) => {
  res.json({ persistencia: persistencia.modo() });
});

module.exports = router;
