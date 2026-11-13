const test = require('node:test');
const assert = require('node:assert');
const { transicionar, podeTransicionar } = require('../src/services/pedidoStatus');

test('pedido segue aberto → aceito → coletado → entregue', () => {
  const p = { status: 'aberto' };
  ['aceito', 'coletado', 'entregue'].forEach((s) => transicionar(p, s));
  assert.strictEqual(p.status, 'entregue');
});

test('não é possível pular etapas', () => {
  assert.throws(() => transicionar({ status: 'aberto' }, 'entregue'), /Não é possível/);
  assert.throws(() => transicionar({ status: 'aceito' }, 'entregue'), /Não é possível/);
});

test('pedido entregue ou cancelado não muda mais', () => {
  assert.strictEqual(podeTransicionar('entregue', 'aberto'), false);
  assert.strictEqual(podeTransicionar('cancelado', 'aberto'), false);
});
