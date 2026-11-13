const test = require('node:test');
const assert = require('node:assert');
const t = require('../src/services/transacoes');

test('saldo é derivado do livro de transações', () => {
  const lista = [];
  t.registrar(lista, { usuarioId: 1, valorCentavos: 1000, tipo: 'credito', origem: 'bolsa_reciclagem', chaveIdempotencia: 'a' });
  t.registrar(lista, { usuarioId: 1, valorCentavos: 300, tipo: 'debito', origem: 'resgate', chaveIdempotencia: 'b' });
  assert.strictEqual(t.saldo(lista, 1), 700);
  assert.strictEqual(t.extrato(lista, 1).length, 2);
});

test('mesma chave de idempotência não gera crédito duplicado', () => {
  const lista = [];
  const dados = { usuarioId: 1, valorCentavos: 500, tipo: 'credito', origem: 'bolsa_reciclagem', chaveIdempotencia: 'entrega:1:morador' };
  t.registrar(lista, dados);
  const segunda = t.registrar(lista, dados);
  assert.strictEqual(segunda.duplicada, true);
  assert.strictEqual(t.saldo(lista, 1), 500);
});

test('não permite saldo negativo', () => {
  assert.throws(() => t.registrar([], { usuarioId: 1, valorCentavos: 100, tipo: 'debito', origem: 'resgate', chaveIdempotencia: 'x' }), /Saldo insuficiente/);
});

test('valor deve ser inteiro em centavos', () => {
  assert.throws(() => t.registrar([], { usuarioId: 1, valorCentavos: 1.5, tipo: 'credito', origem: 'x', chaveIdempotencia: 'y' }), /inteiro/);
});
