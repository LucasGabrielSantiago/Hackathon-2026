const { ErroNegocio } = require('../services/erros');

// eslint-disable-next-line no-unused-vars
function tratarErros(err, req, res, next) {
  if (err instanceof ErroNegocio) return res.status(err.status).json({ erro: err.codigo, mensagem: err.message });
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ erro: 'ARQUIVO_GRANDE', mensagem: 'Imagem acima de 5 MB.' });
  console.error(err);
  return res.status(500).json({ erro: 'ERRO_INTERNO', mensagem: 'Erro inesperado. Tente novamente.' });
}

module.exports = { tratarErros };
