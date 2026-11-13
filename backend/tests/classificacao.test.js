const test = require('node:test');
const assert = require('node:assert');
const { classificarPorTexto, normalizar, classificar } = require('../src/services/classificacao');

test('classificador de reserva identifica lata como metal', () => {
  const r = classificarPorTexto('latinha de refrigerante');
  assert.strictEqual(r.material, 'metal');
  assert.strictEqual(r.reciclavel, true);
});

test('caixa de pizza engordurada não é reciclável', () => {
  const r = classificarPorTexto('caixa de pizza engordurada');
  assert.strictEqual(r.material, 'papel');
  assert.strictEqual(r.reciclavel, false);
});

test('resposta da IA é normalizada e baixa confiança gera aviso', () => {
  const r = normalizar({ material: 'plastico', reciclavel: true, confianca: 0.3, orientacoes: ['a', 'b', 'c', 'd'] });
  assert.strictEqual(r.orientacoes.length, 3);
  assert.match(r.observacao, /pouco confiável/);
  assert.strictEqual(normalizar({ material: 'isopor', reciclavel: true }).reciclavel, false);
});

test('sem chave de IA, usa a reserva', async () => {
  const r = await classificar({ texto: 'garrafa pet' }, { usarIA: false });
  assert.strictEqual(r.fonte, 'reserva');
  assert.strictEqual(r.material, 'plastico');
});
