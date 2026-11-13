const express = require('express');
const cors = require('cors');
const config = require('./config');
const { tratarErros } = require('./middlewares/erros');

// Express 4 não captura erros lançados em handlers assíncronos; os síncronos chegam ao tratarErros.
function criarApp() {
  const app = express();
  app.use(cors({ origin: config.frontendUrl === '*' ? true : config.frontendUrl }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Recicla PE' }));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/locais', require('./routes/locais'));
  app.use('/api/materiais', require('./routes/materiais'));
  app.use('/api/pontos', require('./routes/pontos').router);
  app.use('/api/catadores', require('./routes/catadores'));
  app.use('/api/pedidos', require('./routes/pedidos'));
  app.use('/api/entregas', require('./routes/entregas'));
  app.use('/api/carteira', require('./routes/carteira'));
  app.use('/api/classificar', require('./routes/classificar'));
  app.use('/api/indicadores', require('./routes/indicadores'));

  app.use((req, res) => res.status(404).json({ erro: 'NAO_ENCONTRADO', mensagem: 'Rota não encontrada.' }));
  app.use(tratarErros);
  return app;
}

module.exports = { criarApp };
