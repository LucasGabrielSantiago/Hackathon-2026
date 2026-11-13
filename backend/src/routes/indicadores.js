const express = require('express');
const { getDb } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { calcularIndicadores } = require('../services/indicadores');

const router = express.Router();

router.get('/', autenticar, exigirPerfil('admin', 'gestor_publico', 'empresa'), (req, res) => {
  const { municipio_id, bairro_id, inicio, fim } = req.query;
  res.json({
    indice_canal_limpo: calcularIndicadores(getDb(), {
      municipioId: municipio_id ? Number(municipio_id) : undefined,
      bairroId: bairro_id ? Number(bairro_id) : undefined,
      inicio, fim,
    }),
    demo: true,
  });
});

module.exports = router;
