// Repositório EM MEMÓRIA para o MVP do hackathon.
// Os dados são reiniciados quando o servidor reinicia.
// Fase 2: trocar por PostgreSQL (ver db/migrations) mantendo a mesma interface.
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const seed = require('./seeds/seed');
const qr = require('../services/qrcode');

const PASTA_FOTOS = path.join(__dirname, 'seeds', 'fotos');

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
    fotosPedidos: {}, // pedido_id -> { mime, dados (Buffer) }; fora do JSON do pedido
    recuperacoesSenha: [],
    entregas: [],
    itensEntrega: [],
    transacoes: [],
    qrcodes: [],
    auditoria: [],
  };
  if (comSeed) carregarPedidosDemo();
  return db;
}

// Pedidos aguardando retirada, com foto e QR Code, para a demonstração.
function carregarPedidosDemo() {
  seed.pedidos.forEach((p, i) => {
    const pedido = {
      id: i + 1, morador_id: db.moradores.find((m) => m.usuario_id === p.morador_usuario_id)?.id ?? null,
      morador_usuario_id: p.morador_usuario_id, catador_id: null, catador_usuario_id: null,
      endereco: `Endereço demonstrativo, ${100 + i}`, bairro_id: p.bairro_id, janela_horario: p.janela_horario,
      cep: '', latitude: p.latitude ?? null, longitude: p.longitude ?? null,
      materiais_estimados: p.materiais_estimados, status: 'aberto', tem_foto: true, demo: true,
      criado_em: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    };
    db.pedidos.push(pedido);
    db.fotosPedidos[pedido.id] = { mime: 'image/jpeg', dados: fs.readFileSync(path.join(PASTA_FOTOS, p.foto)) };
    pedido.qr_code = qr.gerarCodigo(db.qrcodes, { tipo: 'pedido', referenciaId: pedido.id, usuarioId: p.morador_usuario_id, validadeMinutos: 7 * 24 * 60 }).codigo;
  });
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
