const test = require('node:test');
const assert = require('node:assert');
const { calcularEntrega, calcularValorItem, calcularRemuneracaoCatador, kgParaGramas } = require('../src/services/recompensa');
const { materiais } = require('../src/db/seeds/seed');

test('valor = peso × preço: 2 kg de alumínio a R$ 5,00/kg = R$ 10,00', () => {
  const r = calcularEntrega([{ material: 'metal', peso_kg: 2 }], materiais);
  assert.strictEqual(r.total_centavos, 1000);
});

test('soma de vários materiais sem erro de ponto flutuante', () => {
  const r = calcularEntrega([
    { material: 'plastico', peso_kg: 0.1 },
    { material: 'plastico', peso_kg: 0.2 },
    { material: 'vidro', peso_kg: 3.333 },
  ], materiais);
  assert.strictEqual(r.total_centavos, 15 + 30 + 67);
  assert.ok(Number.isInteger(r.total_centavos));
});

test('peso zero, negativo ou inválido é rejeitado', () => {
  assert.throws(() => kgParaGramas(0), /Peso/);
  assert.throws(() => kgParaGramas(-1), /Peso/);
  assert.throws(() => kgParaGramas('abc'), /Peso/);
});

test('material inexistente é rejeitado', () => {
  assert.throws(() => calcularEntrega([{ material: 'isopor', peso_kg: 1 }], materiais), /Material não aceito/);
});

test('remuneração do catador é calculada à parte e não reduz a recompensa do morador', () => {
  const r = calcularEntrega([{ material: 'metal', peso_kg: 2 }], materiais);
  const catador = calcularRemuneracaoCatador(r.peso_total_gramas, 80);
  assert.strictEqual(catador, 160);
  assert.strictEqual(r.total_centavos, 1000);
  assert.strictEqual(calcularValorItem(1500, 100), 150);
});
