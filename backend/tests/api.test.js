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
// PNG 1x1 válido, usado como foto dos materiais nos testes.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

async function criarPedido(token, { comFoto = true, bairro_id = 1, materiais = [{ material: 'metal', quantidade_kg: 1 }], destino = null } = {}) {
  const fd = new FormData();
  if (destino) { fd.append('latitude', String(destino[0])); fd.append('longitude', String(destino[1])); fd.append('cep', '51020-000'); }
  fd.append('materiais_estimados', JSON.stringify(materiais));
  fd.append('endereco', 'Rua Y, 10');
  fd.append('bairro_id', String(bairro_id));
  fd.append('janela_horario', 'manhã');
  if (comFoto) fd.append('foto', new Blob([PNG], { type: 'image/png' }), 'foto.png');
  const resp = await fetch(`${base}/pedidos`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: fd });
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

  const ped = await criarPedido(morador);
  assert.strictEqual(ped.status, 201);
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

test('API envia cabeçalhos de segurança e esconde o framework', async () => {
  const resp = await fetch(`${base}/health`);
  assert.strictEqual(resp.headers.get('x-powered-by'), null);
  assert.strictEqual(resp.headers.get('x-content-type-options'), 'nosniff');
  assert.ok(resp.headers.get('content-security-policy'));
});

test('CORS: sem FRONTEND_URL configurado (desenvolvimento) aceita a origem', async () => {
  const resp = await fetch(`${base}/health`, { headers: { Origin: 'http://localhost:5173' } });
  assert.strictEqual(resp.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});

test('login com e-mail inexistente ou senha errada dá a mesma mensagem', async () => {
  const semConta = await api('/auth/login', { metodo: 'POST', corpo: { email: 'ninguem@teste.com', senha: 'qualquer1' } });
  const senhaErrada = await api('/auth/login', { metodo: 'POST', corpo: { email: 'morador@reciclape.demo', senha: 'errada123' } });
  assert.strictEqual(semConta.status, 401);
  assert.strictEqual(semConta.body.mensagem, 'E-mail ou senha inválidos.');
  assert.strictEqual(senhaErrada.body.mensagem, semConta.body.mensagem);
});

test('esqueci minha senha: link de uso único troca a senha', async () => {
  const inexistente = await api('/auth/esqueci-senha', { metodo: 'POST', corpo: { email: 'ninguem@teste.com' } });
  const existente = await api('/auth/esqueci-senha', { metodo: 'POST', corpo: { email: 'maria@reciclape.demo' } });
  assert.strictEqual(inexistente.status, 200);
  assert.strictEqual(inexistente.body.mensagem, existente.body.mensagem, 'não revela se o e-mail existe');
  assert.strictEqual(inexistente.body.link_demo, undefined);
  const token = new URLSearchParams(existente.body.link_demo.split('?')[1]).get('token');
  assert.ok(!getDb().recuperacoesSenha.some((r) => r.token_hash === token), 'guarda só o hash');
  const curta = await api('/auth/redefinir-senha', { metodo: 'POST', corpo: { token, senha: '123' } });
  assert.strictEqual(curta.status, 400);
  const ok = await api('/auth/redefinir-senha', { metodo: 'POST', corpo: { token, senha: 'novaSenha123' } });
  assert.strictEqual(ok.status, 200);
  const deNovo = await api('/auth/redefinir-senha', { metodo: 'POST', corpo: { token, senha: 'outraSenha123' } });
  assert.strictEqual(deNovo.status, 400, 'link é de uso único');
  assert.strictEqual((await api('/auth/login', { metodo: 'POST', corpo: { email: 'maria@reciclape.demo', senha: 'novaSenha123' } })).status, 200);
});

test('pedido de coleta exige foto dos materiais', async () => {
  const morador = await login('morador@reciclape.demo');
  const sem = await criarPedido(morador, { comFoto: false });
  assert.strictEqual(sem.status, 400);
  assert.strictEqual(sem.body.erro, 'FOTO_OBRIGATORIA');
  const eletronico = await criarPedido(morador, { materiais: [{ material: 'eletronico', quantidade_kg: 2 }] });
  assert.strictEqual(eletronico.status, 201, 'lixo eletrônico é aceito');
  const invalido = await criarPedido(morador, { materiais: [{ material: 'radioativo', quantidade_kg: 1 }] });
  assert.strictEqual(invalido.status, 400);
});

test('foto do pedido: só morador dono, admin e coletor que atende o bairro', async () => {
  const morador = await login('morador@reciclape.demo');
  const ped = await criarPedido(morador, { bairro_id: 1 });
  const id = ped.body.pedido.id;
  const foto = async (email) => (await fetch(`${base}/pedidos/${id}/foto`, { headers: { authorization: `Bearer ${await login(email)}` } }));
  const doMorador = await foto('morador@reciclape.demo');
  assert.strictEqual(doMorador.status, 200);
  assert.strictEqual(doMorador.headers.get('content-type'), 'image/png');
  assert.strictEqual((await foto('catador@reciclape.demo')).status, 200, 'coletor de Boa Viagem vê');
  assert.strictEqual((await foto('josefa@reciclape.demo')).status, 403, 'coletora de outro bairro não vê');
  assert.strictEqual((await foto('rita@reciclape.demo')).status, 403, 'coletora pendente não vê');
  assert.strictEqual((await foto('joao@reciclape.demo')).status, 403, 'outro morador não vê');
  assert.strictEqual((await foto('admin@reciclape.demo')).status, 200);
});

test('dados de demonstração: pedidos aguardando retirada com foto e sem endereço exposto', async () => {
  const catador = await login('catador@reciclape.demo');
  const r = await api('/pedidos/proximos', { token: catador });
  const demo = r.body.pedidos.filter((p) => p.demo);
  assert.ok(demo.length >= 3, 'coletor de Boa Viagem e São José vê pedidos de demonstração');
  assert.ok(demo.every((p) => p.tem_foto && p.endereco === undefined && p.qr_code === undefined));
  const materiais = (await api('/materiais')).body.materiais.map((m) => m.nome);
  assert.ok(materiais.includes('eletronico') && materiais.includes('outros'));
});

test('acompanhamento: morador vê quem aceitou e a posição do coletor só a caminho', async () => {
  const morador = await login('morador@reciclape.demo');
  const coletor = await login('catador@reciclape.demo');
  const outro = await login('severino@reciclape.demo');
  const ped = await criarPedido(morador, { bairro_id: 1, destino: [-8.1196, -34.9012] });
  const id = ped.body.pedido.id;
  assert.strictEqual(ped.body.pedido.cep, '51020000');

  const antes = (await api('/pedidos/proximos', { token: coletor })).body.pedidos.find((p) => p.id === id);
  assert.strictEqual(antes.latitude, undefined, 'coordenada exata escondida antes do aceite');

  assert.strictEqual((await api(`/pedidos/${id}/localizacao`, { metodo: 'POST', token: coletor, corpo: { latitude: -8.1, longitude: -34.9 } })).status, 403, 'só depois de aceitar');
  await api(`/pedidos/${id}/aceitar`, { metodo: 'POST', token: coletor });
  assert.strictEqual((await api(`/pedidos/${id}/localizacao`, { metodo: 'POST', token: outro, corpo: { latitude: -8.1, longitude: -34.9 } })).status, 403, 'outro coletor não envia');
  assert.strictEqual((await api(`/pedidos/${id}/localizacao`, { metodo: 'POST', token: coletor, corpo: { latitude: 200, longitude: 0 } })).status, 400);
  assert.strictEqual((await api(`/pedidos/${id}/localizacao`, { metodo: 'POST', token: coletor, corpo: { latitude: -8.1, longitude: -34.9 } })).status, 200);

  const acomp = await api(`/pedidos/${id}/acompanhamento`, { token: morador });
  assert.strictEqual(acomp.status, 200);
  assert.strictEqual(acomp.body.status, 'aceito');
  assert.strictEqual(acomp.body.coletor_nome, 'Coletor');
  assert.deepStrictEqual(acomp.body.destino, { latitude: -8.1196, longitude: -34.9012 });
  assert.strictEqual(acomp.body.coletor_posicao.latitude, -8.1);
  assert.strictEqual((await api(`/pedidos/${id}/acompanhamento`, { token: await login('joao@reciclape.demo') })).status, 403, 'outro morador não acompanha');
  const meus = (await api('/pedidos/meus', { token: morador })).body.pedidos.find((p) => p.id === id);
  assert.strictEqual(meus.coletor_nome, 'Coletor');

  await api(`/pedidos/${id}/coletar`, { metodo: 'POST', token: coletor, corpo: { codigo: ped.body.pedido.qr_code } });
  assert.strictEqual((await api(`/pedidos/${id}/acompanhamento`, { token: morador })).body.coletor_posicao, null, 'para de compartilhar após a coleta');
});

test('ponto aceita lixo eletrônico e exige localização', async () => {
  const coletor = await login('catador@reciclape.demo');
  const base = { nome: 'Ecoponto Teste', endereco: 'Rua A, 1', bairro_id: 1, materiais_aceitos: ['eletronico'], modalidade: 'doacao' };
  assert.strictEqual((await api('/pontos', { metodo: 'POST', token: coletor, corpo: base })).body.erro, 'LOCALIZACAO_INVALIDA');
  const ok = await api('/pontos', { metodo: 'POST', token: coletor, corpo: { ...base, latitude: -8.12, longitude: -34.9, cep: '51020-000' } });
  assert.strictEqual(ok.status, 201);
  assert.strictEqual(ok.body.ponto.cep, '51020000');
});
