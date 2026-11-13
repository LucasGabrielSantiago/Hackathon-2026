const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { limiteGeral } = require('./middlewares/limiteRequisicoes');
const { salvarAposAlteracao } = require('./db/persistencia');
const config = require('./config');
const { tratarErros } = require('./middlewares/erros');

// Express 4 não captura erros lançados em handlers assíncronos; os síncronos chegam ao tratarErros.
function criarApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // atrás do proxy do Render/Docker, para o IP real no limite de login
  app.use(helmet());
  app.use(cors({
    origin(origem, callback) {
      // Sem Origin (curl, health check) ou lista vazia (desenvolvimento): libera.
      if (!origem || config.frontendOrigens.length === 0 || config.frontendOrigens.includes(origem)) return callback(null, true);
      return callback(null, false);
    },
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use('/api', limiteGeral);
  app.use('/api', salvarAposAlteracao);

  app.get('/', (req, res) => res.json({
    app: 'Recicla PE API',
    mensagem: 'A API responde em /api. O aplicativo roda no front-end (http://localhost:5173 em desenvolvimento).',
    saude: '/api/health',
  }));
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
  app.use('/api/admin', require('./routes/admin'));

  app.use((req, res) => res.status(404).json({ erro: 'NAO_ENCONTRADO', mensagem: 'Rota não encontrada.' }));
  app.use(tratarErros);
  return app;
}

module.exports = { criarApp };
