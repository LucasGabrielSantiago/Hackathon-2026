// Limite de requisições por IP (express-rate-limit). Protege a API contra abuso e
// contra o envio em massa de fotos e posições.
const { rateLimit } = require('express-rate-limit');

const resposta = { erro: 'MUITAS_REQUISICOES', mensagem: 'Muitas requisições. Aguarde um pouco e tente de novo.' };
const criar = (limit, windowMs = 60 * 1000) => rateLimit({
  windowMs, limit, standardHeaders: 'draft-8', legacyHeaders: false, message: resposta,
});

// Geral: 300 por minuto (o acompanhamento consulta a cada 5 s, cerca de 12 por minuto).
const limiteGeral = criar(Number(process.env.LIMITE_GERAL_POR_MIN) || 300);
// Pedidos: criar pedido com foto, foto, localização e acompanhamento.
const limitePedidos = criar(Number(process.env.LIMITE_PEDIDOS_POR_MIN) || 120);

module.exports = { limiteGeral, limitePedidos };
