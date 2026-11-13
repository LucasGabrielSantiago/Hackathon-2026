require('dotenv').config({ quiet: true });

const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-nao-use-em-producao',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  frontendUrl: process.env.FRONTEND_URL || '*',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'claude-haiku-5-5',
  catadorCentavosPorKg: Number(process.env.CATADOR_CENTAVOS_POR_KG) || 80,
  qrValidadeMinutos: 30,
  uploadMaxBytes: 5 * 1024 * 1024,
};

module.exports = config;
