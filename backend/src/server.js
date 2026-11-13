const config = require('./config');
const { criarApp } = require('./app');
const path = require('path');
const persistencia = require('./db/persistencia');

// Sem DATABASE_URL e fora de produção: guarda num arquivo local (DADOS_LOCAIS=off desliga).
const arquivoLocal = process.env.NODE_ENV !== 'production' && process.env.DADOS_LOCAIS !== 'off'
  ? path.resolve(__dirname, '..', process.env.DADOS_LOCAIS || '.dados-local.json')
  : undefined;

async function iniciar() {
  try {
    await persistencia.iniciar(process.env.DATABASE_URL, { arquivo: arquivoLocal });
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
