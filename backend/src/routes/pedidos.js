// Coleta em casa (seção 6.3 do CONTEXT.md).
const express = require('express');
const multer = require('multer');
const config = require('../config');
const { getDb, inserir } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { ErroNegocio } = require('../services/erros');
const { transicionar } = require('../services/pedidoStatus');
const qr = require('../services/qrcode');

const router = express.Router();
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

// A foto dos materiais é obrigatória: o coletor vê o que vai buscar antes de aceitar.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxBytes, files: 1 },
  fileFilter: (req, file, cb) => (TIPOS_FOTO.includes(file.mimetype)
    ? cb(null, true)
    : cb(new ErroNegocio('TIPO_INVALIDO', 'Envie a foto em JPG, PNG ou WEBP.'))),
});

function coordenada(lat, lng) {
  const a = Number(lat); const b = Number(lng);
  if (lat === undefined || lat === '' || lng === undefined || lng === '') return null;
  if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 90 || Math.abs(b) > 180) throw new ErroNegocio('LOCALIZACAO_INVALIDA', 'Localização inválida.');
  return { latitude: a, longitude: b };
}

const nomeUsuario = (db, id) => db.usuarios.find((u) => u.id === id)?.nome?.split(' ')[0] ?? null;

function lerMateriais(valor) {
  if (typeof valor !== 'string') return valor;
  try { return JSON.parse(valor); } catch { return null; }
}

function catadorAprovado(db, usuarioId) {
  const catador = db.catadores.find((c) => c.usuario_id === usuarioId);
  // Regra 8: cadastro pendente não recebe pedidos.
  if (!catador || !catador.aprovado) throw new ErroNegocio('CATADOR_PENDENTE', 'Seu cadastro ainda está em análise.', 403);
  return catador;
}

function buscarPedido(db, id) {
  const pedido = db.pedidos.find((p) => p.id === Number(id));
  if (!pedido) throw new ErroNegocio('NAO_ENCONTRADO', 'Pedido não encontrado.', 404);
  return pedido;
}

router.post('/', autenticar, exigirPerfil('morador'), upload.single('foto'), (req, res) => {
  const db = getDb();
  const { endereco, bairro_id, janela_horario, cep = '', latitude, longitude } = req.body || {};
  const destino = coordenada(latitude, longitude);
  const materiais_estimados = lerMateriais(req.body?.materiais_estimados);
  const MATERIAIS = db.materiais.filter((m) => m.ativo).map((m) => m.nome);
  if (!req.file) throw new ErroNegocio('FOTO_OBRIGATORIA', 'Envie uma foto dos materiais para o coletor saber o que vai buscar.');
  if (!Array.isArray(materiais_estimados) || materiais_estimados.length === 0 || !materiais_estimados.every((m) => MATERIAIS.includes(m.material) && Number(m.quantidade_kg) > 0)) {
    throw new ErroNegocio('MATERIAIS_INVALIDOS', 'Informe os materiais e a quantidade estimada.');
  }
  if (!endereco) throw new ErroNegocio('ENDERECO_OBRIGATORIO', 'Informe o endereço da coleta.');
  if (!db.bairros.some((b) => b.id === Number(bairro_id))) throw new ErroNegocio('BAIRRO_INVALIDO', 'Bairro inválido.');
  if (!janela_horario) throw new ErroNegocio('HORARIO_OBRIGATORIO', 'Escolha uma janela de horário.');

  const morador = db.moradores.find((m) => m.usuario_id === req.usuario.id);
  const pedido = inserir('pedidos', {
    morador_id: morador?.id ?? null, morador_usuario_id: req.usuario.id, catador_id: null, catador_usuario_id: null,
    endereco: String(endereco).slice(0, 200), bairro_id: Number(bairro_id), janela_horario: String(janela_horario).slice(0, 40),
    materiais_estimados: materiais_estimados.map((m) => ({ material: m.material, quantidade_kg: Number(m.quantidade_kg) })),
    cep: String(cep).replace(/\D/g, '').slice(0, 8), latitude: destino?.latitude ?? null, longitude: destino?.longitude ?? null,
    status: 'aberto', tem_foto: true, criado_em: new Date().toISOString(),
  });
  db.fotosPedidos[pedido.id] = { mime: req.file.mimetype, dados: req.file.buffer };
  // QR do pedido: o catador confirma a coleta lendo este código na casa do morador.
  const codigo = qr.gerarCodigo(db.qrcodes, { tipo: 'pedido', referenciaId: pedido.id, usuarioId: req.usuario.id, validadeMinutos: 7 * 24 * 60 });
  pedido.qr_code = codigo.codigo;
  res.status(201).json({ pedido });
});

router.get('/meus', autenticar, exigirPerfil('morador'), (req, res) => {
  const db = getDb();
  const pedidos = db.pedidos
    .filter((p) => p.morador_usuario_id === req.usuario.id)
    .map(({ coletor_posicao, ...p }) => ({ ...p, coletor_nome: nomeUsuario(db, p.catador_usuario_id) }));
  res.json({ pedidos });
});

// Endereço completo só é exibido ao catador DEPOIS de aceitar (minimização de dados — LGPD).
router.get('/proximos', autenticar, exigirPerfil('catador'), (req, res) => {
  const db = getDb();
  const catador = catadorAprovado(db, req.usuario.id);
  const pedidos = db.pedidos
    .filter((p) => p.status === 'aberto' && (catador.bairros.length === 0 || catador.bairros.includes(p.bairro_id)))
    .map(({ endereco, qr_code, morador_usuario_id, latitude, longitude, cep, coletor_posicao, ...resto }) => ({ ...resto, bairro: db.bairros.find((b) => b.id === resto.bairro_id)?.nome }));
  res.json({ pedidos });
});

router.get('/minhas-coletas', autenticar, exigirPerfil('catador'), (req, res) => {
  const pedidos = getDb().pedidos
    .filter((p) => p.catador_usuario_id === req.usuario.id)
    .map(({ qr_code, ...resto }) => resto);
  res.json({ pedidos });
});

// Foto do pedido: o morador dono, o admin e coletores aprovados que atendem o bairro (ou que aceitaram o pedido).
router.get('/:id/foto', autenticar, (req, res) => {
  const db = getDb();
  const pedido = buscarPedido(db, req.params.id);
  const foto = db.fotosPedidos[pedido.id];
  if (!foto) throw new ErroNegocio('NAO_ENCONTRADO', 'Pedido sem foto.', 404);
  const { id, perfil } = req.usuario;
  let pode = perfil === 'admin' || pedido.morador_usuario_id === id || pedido.catador_usuario_id === id;
  if (!pode && perfil === 'catador' && pedido.status === 'aberto') {
    const catador = db.catadores.find((c) => c.usuario_id === id);
    pode = Boolean(catador?.aprovado) && (catador.bairros.length === 0 || catador.bairros.includes(pedido.bairro_id));
  }
  if (!pode) throw new ErroNegocio('SEM_PERMISSAO', 'Você não pode ver esta foto.', 403);
  res.set({ 'Content-Type': foto.mime, 'Cache-Control': 'private, no-store', 'Content-Disposition': 'inline' });
  res.send(foto.dados);
});

router.post('/:id/aceitar', autenticar, exigirPerfil('catador'), (req, res) => {
  const db = getDb();
  const catador = catadorAprovado(db, req.usuario.id);
  const pedido = buscarPedido(db, req.params.id);
  transicionar(pedido, 'aceito');
  pedido.catador_id = catador.id;
  pedido.catador_usuario_id = req.usuario.id;
  pedido.aceito_em = new Date().toISOString();
  pedido.coletor_posicao = null;
  const { qr_code, ...resto } = pedido;
  res.json({ pedido: resto });
});

router.post('/:id/recusar', autenticar, exigirPerfil('catador'), (req, res) => {
  const pedido = buscarPedido(getDb(), req.params.id);
  if (pedido.catador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não está com você.', 403);
  transicionar(pedido, 'aberto');
  pedido.catador_id = null;
  pedido.catador_usuario_id = null;
  pedido.aceito_em = null;
  pedido.coletor_posicao = null;
  res.json({ mensagem: 'Pedido devolvido para a fila.' });
});

router.post('/:id/coletar', autenticar, exigirPerfil('catador'), (req, res) => {
  const db = getDb();
  const pedido = buscarPedido(db, req.params.id);
  if (pedido.catador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não está com você.', 403);
  const registro = qr.validar(db.qrcodes, req.body?.codigo, { tipo: 'pedido' });
  if (registro.referencia_id !== pedido.id) throw new ErroNegocio('QR_INVALIDO', 'QR Code não pertence a este pedido.');
  transicionar(pedido, 'coletado');
  pedido.coletor_posicao = null; // para de compartilhar a localização depois da coleta (LGPD)
  qr.consumir(db.qrcodes, req.body.codigo, { tipo: 'pedido' });
  const { qr_code, ...resto } = pedido;
  res.json({ pedido: resto, mensagem: 'Coleta confirmada. Leve o material a um ponto autorizado para pesagem.' });
});

// Coletor que aceitou envia a própria posição enquanto vai até o morador.
router.post('/:id/localizacao', autenticar, exigirPerfil('catador'), (req, res) => {
  const pedido = buscarPedido(getDb(), req.params.id);
  if (pedido.catador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não está com você.', 403);
  if (pedido.status !== 'aceito') throw new ErroNegocio('PEDIDO_FORA_DE_ROTA', 'A localização só é compartilhada a caminho da coleta.', 409);
  const pos = coordenada(req.body?.latitude, req.body?.longitude);
  if (!pos) throw new ErroNegocio('LOCALIZACAO_INVALIDA', 'Localização inválida.');
  pedido.coletor_posicao = { ...pos, atualizado_em: new Date().toISOString() };
  res.json({ ok: true });
});

// Acompanhamento: morador dono, coletor do pedido ou admin.
router.get('/:id/acompanhamento', autenticar, (req, res) => {
  const db = getDb();
  const pedido = buscarPedido(db, req.params.id);
  const { id, perfil } = req.usuario;
  if (!(perfil === 'admin' || pedido.morador_usuario_id === id || pedido.catador_usuario_id === id)) {
    throw new ErroNegocio('SEM_PERMISSAO', 'Você não pode acompanhar este pedido.', 403);
  }
  res.json({
    status: pedido.status,
    aceito_em: pedido.aceito_em || null,
    coletor_nome: nomeUsuario(db, pedido.catador_usuario_id),
    destino: pedido.latitude != null ? { latitude: pedido.latitude, longitude: pedido.longitude } : null,
    coletor_posicao: pedido.status === 'aceito' ? pedido.coletor_posicao || null : null,
  });
});

router.post('/:id/cancelar', autenticar, exigirPerfil('morador'), (req, res) => {
  const pedido = buscarPedido(getDb(), req.params.id);
  if (pedido.morador_usuario_id !== req.usuario.id) throw new ErroNegocio('SEM_PERMISSAO', 'Pedido não é seu.', 403);
  transicionar(pedido, 'cancelado');
  res.json({ pedido });
});

module.exports = router;
