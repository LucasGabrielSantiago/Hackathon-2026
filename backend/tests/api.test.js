// Testes de integração: sobem a API numa porta aleatória e usam fetch (Node 18+).
const test = require('node:test');
const assert = require('node:assert');
const { criarApp } = require('../src/app');
const { reset, getDb } = require('../src/db');
const { calcularIndicadores } = require('../src/services/indicadores');

let server; let base;

test.before(async () => {
  reset();
  server = criarApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
test.after(() => server.close());

async function api(caminho, { metodo = 'GET', corpo, token, headers = {} } = {}) {
  const resp = await fetch(base + caminho, {
    method: metodo,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  return { status: resp.status, body: await resp.json() };
}
const login = async (email) => (await api('/auth/login', { metodo: 'POST', corpo: { email, senha: 'demo1234' } })).body.token;

test('cadastro e login de morador', async () => {
  const cad = await api('/auth/cadastro', { metodo: 'POST', corpo: { nome: 'Ana', email: 'ana@teste.com', senha: '12345678', perfil: 'morador', bairro_id: 1 } });
  assert.strictEqual(cad.status, 201);
  assert.ok(cad.body.token);
  assert.strictEqual(cad.body.usuario.senha_hash, undefined);
  const log = await api('/auth/login', { metodo: 'POST', corpo: { email: 'ana@teste.com', senha: '12345678' } });
  assert.strictEqual(log.status, 200);
  const errado = await api('/auth/login', { metodo: 'POST', corpo: { email: 'ana@teste.com', senha: 'errada123' } });
  assert.strictEqual(errado.status, 401);
});

test('ninguém se cadastra como admin', async () => {
  const r = await api('/auth/cadastro', { metodo: 'POST', corpo: { nome: 'X', email: 'x@teste.com', senha: '12345678', perfil: 'admin' } });
  assert.strictEqual(r.status, 400);
});

test('controle de acesso: morador não acessa indicadores nem aprova pontos', async () => {
  const token = await login('morador@reciclape.demo');
  assert.strictEqual((await api('/indicadores', { token })).status, 403);
  assert.strictEqual((await api('/pontos/1/aprovar', { metodo: 'PATCH', token })).status, 403);
  assert.strictEqual((await api('/carteira')).status, 401);
});

test('catador pendente não vê pedidos até ser aprovado pelo admin', async () => {
  const cad = await api('/auth/cadastro', { metodo: 'POST', corpo: { nome: 'João', email: 'joao@teste.com', senha: '12345678', perfil: 'catador', bairros: [1] } });
  const token = cad.body.token;
  assert.strictEqual((await api('/pedidos/proximos', { token })).status, 403);
  const admin = await login('admin@reciclape.demo');
  const pendentes = await api('/catadores/pendentes', { token: admin });
  const id = pendentes.body.catadores.find((c) => c.email === 'joao@teste.com').id;
  await api(`/catadores/${id}/aprovar`, { metodo: 'PATCH', token: admin });
  assert.strictEqual((await api('/pedidos/proximos', { token })).status, 200);
});

test('ponto novo fica pendente e só aparece no mapa depois de aprovado', async () => {
  const catador = await login('catador@reciclape.demo');
  const novo = await api('/pontos', { metodo: 'POST', token: catador, corpo: { nome: 'Ponto do João', endereco: 'Rua X', bairro_id: 1, latitude: -8.1, longitude: -34.9, materiais_aceitos: ['metal'], modalidade: 'compra' } });
  assert.strictEqual(novo.status, 201);
  const antes = await api('/pontos');
  assert.ok(!antes.body.pontos.some((p) => p.id === novo.body.ponto.id));
  const admin = await login('admin@reciclape.demo');
  await api(`/pontos/${novo.body.ponto.id}/aprovar`, { metodo: 'PATCH', token: admin });
  const depois = await api('/pontos');
  assert.ok(depois.body.pontos.some((p) => p.id === novo.body.ponto.id));
});

test('ponto sem localização ou sem material é rejeitado', async () => {
  const catador = await login('catador@reciclape.demo');
  const r = await api('/pontos', { metodo: 'POST', token: catador, corpo: { nome: 'P', endereco: 'R', bairro_id: 1, materiais_aceitos: [], modalidade: 'doacao' } });
  assert.strictEqual(r.status, 400);
});

test('entrega direta: QR do morador gera crédito uma vez só', async () => {
  const morador = await login('morador@reciclape.demo');
  const ponto = await login('ponto@reciclape.demo');
  const { body: { codigo } } = await api('/entregas/qrcode', { metodo: 'POST', token: morador });
  const itens = [{ material: 'metal', peso_kg: 2 }, { material: 'plastico', peso_kg: 1 }];
  const r = await api('/entregas', { metodo: 'POST', token: ponto, corpo: { codigo, itens } });
  assert.strictEqual(r.status, 201);
  assert.strictEqual(r.body.entrega.recompensa_centavos, 1150);
  const repetida = await api('/entregas', { metodo: 'POST', token: ponto, corpo: { codigo, itens } });
  assert.strictEqual(repetida.status, 409);
  const carteira = await api('/carteira', { token: morador });
  assert.strictEqual(carteira.body.saldo_centavos, 1150);
});

test('morador não pode registrar pesagem nem definir valores', async () => {
  const morador = await login('morador@reciclape.demo');
  const r = await api('/entregas', { metodo: 'POST', token: morador, corpo: { codigo: 'x', itens: [{ material: 'metal', peso_kg: 99 }] } });
  assert.strictEqual(r.status, 403);
});

test('coleta em casa: catador e morador recebem valores separados', async () => {
  const db = getDb();
  const morador = await login('morador@reciclape.demo');
  const catador = await login('catador@reciclape.demo');
  const ponto = await login('ponto@reciclape.demo');
  const saldoAntes = (await api('/carteira', { token: morador })).body.saldo_centavos;

  const ped = await api('/pedidos', { metodo: 'POST', token: morador, corpo: { materiais_estimados: [{ material: 'metal', quantidade_kg: 1 }], endereco: 'Rua Y, 10', bairro_id: 1, janela_horario: 'manhã' } });
  const id = ped.body.pedido.id;
  const proximos = await api('/pedidos/proximos', { token: catador });
  assert.strictEqual(proximos.body.pedidos.find((p) => p.id === id).endereco, undefined, 'endereço oculto antes de aceitar');
  await api(`/pedidos/${id}/aceitar`, { metodo: 'POST', token: catador });
  await api(`/pedidos/${id}/coletar`, { metodo: 'POST', token: catador, corpo: { codigo: ped.body.pedido.qr_code } });
  const r = await api('/entregas', { metodo: 'POST', token: ponto, corpo: { pedido_id: id, itens: [{ material: 'metal', peso_kg: 1 }] } });
  assert.strictEqual(r.status, 201);
  assert.strictEqual(r.body.entrega.recompensa_centavos, 500);
  assert.strictEqual(r.body.entrega.remuneracao_catador_centavos, 80);
  assert.strictEqual((await api('/carteira', { token: morador })).body.saldo_centavos, saldoAntes + 500);
  assert.strictEqual((await api('/carteira', { token: catador })).body.saldo_centavos, 80);
  assert.strictEqual(db.pedidos.find((p) => p.id === id).status, 'entregue');
});

test('indicadores filtram por município e bairro', async () => {
  const db = getDb();
  const recife = calcularIndicadores(db, { municipioId: 1 });
  const olinda = calcularIndicadores(db, { municipioId: 2 });
  const boaViagem = calcularIndicadores(db, { bairroId: 1 });
  assert.ok(recife.ambientais.kg_recuperados > 0);
  assert.strictEqual(olinda.ambientais.kg_recuperados, 0);
  assert.strictEqual(boaViagem.ambientais.kg_recuperados, recife.ambientais.kg_recuperados);
  const admin = await login('admin@reciclape.demo');
  const r = await api('/indicadores?municipio_id=1', { token: admin });
  assert.strictEqual(r.status, 200);
});
