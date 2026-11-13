// Fluxo da coleta em casa: aberto → aceito → coletado → entregue (ou cancelado).
const { ErroNegocio } = require('./erros');

const TRANSICOES = {
  aberto: ['aceito', 'cancelado'],
  aceito: ['coletado', 'aberto', 'cancelado'], // 'aberto' = catador recusou/desistiu
  coletado: ['entregue'],
  entregue: [],
  cancelado: [],
};

function podeTransicionar(de, para) {
  return (TRANSICOES[de] || []).includes(para);
}

function transicionar(pedido, para) {
  if (!podeTransicionar(pedido.status, para)) {
    throw new ErroNegocio('STATUS_INVALIDO', `Não é possível mudar o pedido de "${pedido.status}" para "${para}".`, 409);
  }
  pedido.status = para;
  pedido.atualizado_em = new Date().toISOString();
  return pedido;
}

module.exports = { TRANSICOES, podeTransicionar, transicionar };
