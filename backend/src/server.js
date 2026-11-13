const config = require('./config');
const { criarApp } = require('./app');
const persistencia = require('./db/persistencia');

async function iniciar() {
  try {
    await persistencia.iniciar();
  } catch (e) {
    // Banco fora do ar não derruba o app: segue em memória.
    console.error('[persistencia] não foi possível conectar, seguindo só em memória:', e.message);
  }
  const server = criarApp().listen(config.port, () => {
    console.log(`Recicla PE API rodando em http://localhost:${config.port}`);
  });
  const desligar = async () => {
    server.close();
    await persistencia.encerrar().catch(() => {});
    process.exit(0);
  };
  process.on('SIGTERM', desligar);
  process.on('SIGINT', desligar);
}

iniciar();
