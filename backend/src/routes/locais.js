const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/municipios', (req, res) => res.json({ municipios: getDb().municipios }));

router.get('/bairros', (req, res) => {
  const municipioId = req.query.municipio_id ? Number(req.query.municipio_id) : null;
  const bairros = getDb().bairros.filter((b) => !municipioId || b.municipio_id === municipioId);
  res.json({ bairros });
});

module.exports = router;
