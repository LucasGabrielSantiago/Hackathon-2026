const jwt = require('jsonwebtoken');
const config = require('../config');

function gerarToken(usuario) {
  return jwt.sign({ sub: usuario.id, perfil: usuario.perfil, nome: usuario.nome }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) return res.status(401).json({ erro: 'NAO_AUTENTICADO', mensagem: 'Faça login para continuar.' });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.usuario = { id: payload.sub, perfil: payload.perfil, nome: payload.nome };
    return next();
  } catch {
    return res.status(401).json({ erro: 'TOKEN_INVALIDO', mensagem: 'Sessão expirada. Faça login novamente.' });
  }
}

module.exports = { gerarToken, autenticar };
