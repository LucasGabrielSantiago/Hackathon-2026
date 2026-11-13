// Limitação simples de tentativas de login (em memória): 10 tentativas por 15 min por IP + e-mail.
const JANELA_MS = 15 * 60 * 1000;
const MAX = 10;
const tentativas = new Map();

function limitarLogin(req, res, next) {
  const chave = `${req.ip}:${(req.body?.email || '').toLowerCase()}`;
  const agora = Date.now();
  const registro = tentativas.get(chave) || { qtd: 0, inicio: agora };
  if (agora - registro.inicio > JANELA_MS) { registro.qtd = 0; registro.inicio = agora; }
  registro.qtd += 1;
  tentativas.set(chave, registro);
  if (registro.qtd > MAX) return res.status(429).json({ erro: 'MUITAS_TENTATIVAS', mensagem: 'Muitas tentativas. Aguarde alguns minutos.' });
  return next();
}

module.exports = { limitarLogin, _reset: () => tentativas.clear() };
