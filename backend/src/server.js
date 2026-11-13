const config = require('./config');
const { criarApp } = require('./app');

criarApp().listen(config.port, () => {
  console.log(`Recicla PE API rodando em http://localhost:${config.port}`);
});
