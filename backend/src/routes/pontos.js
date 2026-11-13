const express = require('express');
const { getDb, inserir } = require('../db');
const { autenticar } = require('../middlewares/auth');
const { exigirPerfil } = require('../middlewares/rbac');
const { ErroNegocio } = require('../services/erros');

const router = express.Router();
const MATERIAIS_VALIDOS = ['plastico', 'metal', 'vidro', 'papel'];

function validarPonto(body, db) {
  const { nome, endereco, bairro_id, latitude, longitude, horario, materiais_aceitos, modalidade } = body || {};
  if (!nome || !endereco) throw new ErroNegocio('DADOS_INCOMPLETOS', 'Informe nome e endereço.');
  if (!db.bairros.some((b) => b.id === Number(bairro_id))) throw new ErroNegocio('BAIRRO_INVALIDO', 'Bairro inválido.');
  const lat = Number(latitude); const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    throw new ErroNegocio('LOCALIZACAO_INVALIDA', 'Informe a localização do ponto.');
  }
  if (!Array.isArray(materiais_aceitos) || materiais_aceitos.length === 0 || !materiais_aceitos.every((m) => MATERIAIS_VALIDOS.includes(m))) {
    throw new ErroNegocio('MATERIAIS_INVALIDOS', 'Informe ao menos um material aceito.');
  }
  if (!['doacao', 'compra'].includes(modalidade)) throw new ErroNegocio('MODALIDADE_INVALIDA', 'Modalidade deve ser doação ou compra.');
  return { nome, endereco, bairro_id: Number(bairro_id), latitude: lat, longitude: lng, horario: horario || '', materiais_aceitos, modalidade };
}

// Público: só pontos APROVADOS aparecem no mapa (Regra 7). Filtros por município/bairro/material.
router.get('/', (req, res) => {
  const db = getDb();
  const { municipio_id, bairro_id, material } = req.query;
  const pontos = db.pontos.filter((p) => {
    if (!p.aprovado) return false;
    const bairro = db.bairros.find((b) => b.id === p.bairro_id);
    if (municipio_id && bairro?.municipio_id !== Number(municipio_id)) return false;
    if (bairro_id && p.bairro_id !== Number(bairro_id)) return false;
    if (material && !p.materiais_aceitos.includes(material)) return false;
    return true;
  }).map((p) => ({ ...p, bairro: db.bairros.find((b) => b.id === p.bairro_id)?.nome }));
  res.json({ pontos });
});

// Catador, ponto ou admin solicitam cadastro. Sempre começa PENDENTE.
router.post('/', autenticar, exigirPerfil('catador', 'ponto', 'admin'), (req, res) => {
  const db = getDb();
  const dados = validarPonto(req.body, db);
  const catador = db.catadores.find((c) => c.usuario_id === req.usuario.id);
  const ponto = inserir('pontos', { ...dados, usuario_id: req.usuario.id, catador_id: catador?.id ?? null, aprovado: false, demo: false });
  res.status(201).json({ ponto, mensagem: 'Ponto enviado para aprovação.' });
});

router.get('/meus', autenticar, exigirPerfil('catador', 'ponto'), (req, res) => {
  res.json({ pontos: getDb().pontos.filter((p) => p.usuario_id === req.usuario.id) });
});

router.get('/pendentes', autenticar, exigirPerfil('admin'), (req, res) => {
  res.json({ pontos: getDb().pontos.filter((p) => !p.aprovado) });
});

router.patch('/:id/aprovar', autenticar, exigirPerfil('admin'), (req, res) => {
  const db = getDb();
  const ponto = db.pontos.find((p) => p.id === Number(req.params.id));
  if (!ponto) throw new ErroNegocio('NAO_ENCONTRADO', 'Ponto não encontrado.', 404);
  ponto.aprovado = true;
  db.auditoria.push({ acao: 'aprovar_ponto', usuario_id: req.usuario.id, ponto_id: ponto.id, em: new Date().toISOString() });
  res.json({ ponto });
});

module.exports = { router, validarPonto };
