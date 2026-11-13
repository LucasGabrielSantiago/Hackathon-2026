// Repositório EM MEMÓRIA para o MVP do hackathon.
// Os dados são reiniciados quando o servidor reinicia.
// Fase 2: trocar por PostgreSQL (ver db/migrations) mantendo a mesma interface.
const bcrypt = require('bcryptjs');
const seed = require('./seeds/seed');

let db;

function clone(v) { return JSON.parse(JSON.stringify(v)); }

function reset({ comSeed = true } = {}) {
  const senhaHash = bcrypt.hashSync(seed.SENHA_DEMO, 8);
  db = {
    municipios: comSeed ? clone(seed.municipios) : [],
    bairros: comSeed ? clone(seed.bairros) : [],
    materiais: comSeed ? clone(seed.materiais) : [],
    usuarios: comSeed ? seed.usuarios.map((u) => ({ ...u, senha_hash: senhaHash, criado_em: new Date().toISOString() })) : [],
    moradores: comSeed ? clone(seed.moradores) : [],
    catadores: comSeed ? clone(seed.catadores) : [],
    cooperativas: [],
    pontos: comSeed ? clone(seed.pontos) : [],
    pedidos: [],
    entregas: [],
    itensEntrega: [],
    transacoes: [],
    qrcodes: [],
    auditoria: [],
  };
  return db;
}

function getDb() {
  if (!db) reset();
  return db;
}

function proximoId(colecao) {
  const lista = getDb()[colecao];
  return lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
}

function inserir(colecao, registro) {
  const novo = { id: proximoId(colecao), ...registro };
  getDb()[colecao].push(novo);
  return novo;
}

module.exports = { getDb, reset, inserir, proximoId };
