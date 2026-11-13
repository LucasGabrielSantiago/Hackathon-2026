const express = require('express');
const multer = require('multer');
const config = require('../config');
const { autenticar } = require('../middlewares/auth');
const { ErroNegocio } = require('../services/erros');
const { classificar } = require('../services/classificacao');

const router = express.Router();
const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

// Imagem fica só em memória durante a requisição: não é armazenada (LGPD).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxBytes },
  fileFilter: (req, file, cb) => (TIPOS.includes(file.mimetype)
    ? cb(null, true)
    : cb(new ErroNegocio('TIPO_INVALIDO', 'Envie uma imagem JPG, PNG ou WEBP.'))),
});

router.post('/', autenticar, upload.single('imagem'), async (req, res, next) => {
  try {
    const texto = (req.body?.texto || '').slice(0, 300);
    if (!req.file && !texto) throw new ErroNegocio('SEM_ENTRADA', 'Envie uma foto ou descreva o item.');
    const resultado = await classificar({
      imagemBase64: req.file?.buffer.toString('base64'),
      mimeType: req.file?.mimetype,
      texto,
    });
    res.json(resultado);
  } catch (e) { next(e); }
});

module.exports = router;
