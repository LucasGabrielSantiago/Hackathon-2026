const test = require('node:test');
const assert = require('node:assert');
const qr = require('../src/services/qrcode');

test('QR válido é consumido uma única vez', () => {
  const lista = [];
  const { codigo } = qr.gerarCodigo(lista, { tipo: 'entrega', usuarioId: 1 });
  assert.strictEqual(qr.consumir(lista, codigo, { tipo: 'entrega' }).usuario_id, 1);
  assert.throws(() => qr.consumir(lista, codigo, { tipo: 'entrega' }), /já utilizado/);
});

test('QR expirado não é aceito', () => {
  const lista = [];
  const agora = new Date('2026-11-13T10:00:00Z');
  const { codigo } = qr.gerarCodigo(lista, { tipo: 'entrega', usuarioId: 1, validadeMinutos: 30, agora });
  assert.throws(() => qr.consumir(lista, codigo, { tipo: 'entrega', agora: new Date('2026-11-13T10:31:00Z') }), /expirado/);
});

test('QR inexistente ou de outro tipo é inválido', () => {
  const lista = [];
  const { codigo } = qr.gerarCodigo(lista, { tipo: 'pedido', usuarioId: 1 });
  assert.throws(() => qr.consumir(lista, 'nao-existe'), /inválido/);
  assert.throws(() => qr.consumir(lista, codigo, { tipo: 'entrega' }), /inválido/);
});

test('códigos gerados são únicos', () => {
  const lista = [];
  const a = qr.gerarCodigo(lista, { tipo: 'entrega', usuarioId: 1 });
  const b = qr.gerarCodigo(lista, { tipo: 'entrega', usuarioId: 1 });
  assert.notStrictEqual(a.codigo, b.codigo);
});
