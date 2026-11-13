require('dotenv').config({ quiet: true });

// FRONTEND_URL aceita uma ou mais origens separadas por vírgula
// (ex.: "https://recicla-pe.vercel.app,http://localhost:5173"). Vazio = libera todas (só para desenvolvimento).
function lerOrigens(valor) {
  return String(valor || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-nao-use-em-producao',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  frontendOrigens: lerOrigens(process.env.FRONTEND_URL),
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'claude-haiku-5-5',
  catadorCentavosPorKg: Number(process.env.CATADOR_CENTAVOS_POR_KG) || 80,
  qrValidadeMinutos: 30,
  uploadMaxBytes: 5 * 1024 * 1024,
};

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}

module.exports = config;
module.exports.lerOrigens = lerOrigens;
