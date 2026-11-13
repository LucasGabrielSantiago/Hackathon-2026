const test = require('node:test');
const assert = require('node:assert');
const { reset, getDb, substituir } = require('../src/db');
const persistencia = require('../src/db/persistencia');

test('sem DATABASE_URL a API segue só em memória', async () => {
  assert.strictEqual(await persistencia.iniciar(''), false);
  assert.strictEqual(persistencia.ativa(), false);
});

test('dados com fotos sobrevivem à ida e volta do JSON do banco', () => {
  reset();
  const original = getDb();
  const json = JSON.parse(JSON.stringify(persistencia.serializar(original)));
  assert.strictEqual(typeof json.fotosPedidos[1].base64, 'string');
  substituir(persistencia.desserializar(json));
  const volta = getDb();
  assert.ok(Buffer.isBuffer(volta.fotosPedidos[1].dados));
  assert.ok(volta.fotosPedidos[1].dados.equals(original.fotosPedidos[1].dados));
  assert.strictEqual(volta.pedidos.length, original.pedidos.length);
  assert.strictEqual(volta.usuarios[0].senha_hash, original.usuarios[0].senha_hash);
});

test('carregar dados antigos completa coleções novas do código', () => {
  substituir({ usuarios: [], pedidos: [] });
  assert.deepStrictEqual(getDb().recuperacoesSenha, []);
  assert.deepStrictEqual(getDb().fotosPedidos, {});
  reset();
});
