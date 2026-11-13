const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb, inserir } = require('../db');
const { gerarToken, autenticar } = require('../middlewares/auth');
const { limitarLogin } = require('../middlewares/limiteLogin');
const { ErroNegocio } = require('../services/erros');

const router = express.Router();
const PERFIS_CADASTRO = ['morador', 'catador', 'ponto']; // admin/gestor não se autocadastram
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publico(u) {
  const { senha_hash, ...resto } = u;
  return resto;
}

router.post('/cadastro', (req, res) => {
  const { nome, email, telefone = '', senha, perfil = 'morador', bairro_id, endereco = '' } = req.body || {};
  if (!nome || String(nome).trim().length < 2) throw new ErroNegocio('NOME_INVALIDO', 'Informe seu nome.');
  if (!EMAIL_RE.test(email || '')) throw new ErroNegocio('EMAIL_INVALIDO', 'E-mail inválido.');
  if (!senha || String(senha).length < 8) throw new ErroNegocio('SENHA_FRACA', 'A senha precisa ter ao menos 8 caracteres.');
  if (!PERFIS_CADASTRO.includes(perfil)) throw new ErroNegocio('PERFIL_INVALIDO', 'Perfil inválido.');

  const db = getDb();
  const emailNorm = email.toLowerCase().trim();
  if (db.usuarios.some((u) => u.email === emailNorm)) throw new ErroNegocio('EMAIL_EM_USO', 'E-mail já cadastrado.', 409);

  const usuario = inserir('usuarios', {
    nome: String(nome).trim(), email: emailNorm, telefone, perfil,
    senha_hash: bcrypt.hashSync(senha, 10), criado_em: new Date().toISOString(),
  });

  if (perfil === 'morador') {
    inserir('moradores', { usuario_id: usuario.id, endereco, bairro_id: bairro_id ?? null, latitude: null, longitude: null });
  }
  if (perfil === 'catador') {
    const { raio_atuacao_km = 3, bairros = [], materiais = [] } = req.body;
    // Regra 8: catador começa NÃO aprovado.
    inserir('catadores', { usuario_id: usuario.id, cooperativa_id: null, raio_atuacao_km, bairros, materiais, disponivel: true, aprovado: false });
  }

  res.status(201).json({ usuario: publico(usuario), token: gerarToken(usuario) });
});

router.post('/login', limitarLogin, (req, res) => {
  const { email, senha } = req.body || {};
  const usuario = getDb().usuarios.find((u) => u.email === String(email || '').toLowerCase().trim());
  if (!usuario || !bcrypt.compareSync(String(senha || ''), usuario.senha_hash)) {
    throw new ErroNegocio('CREDENCIAIS_INVALIDAS', 'E-mail ou senha incorretos.', 401);
  }
  res.json({ usuario: publico(usuario), token: gerarToken(usuario) });
});

router.get('/me', autenticar, (req, res) => {
  const usuario = getDb().usuarios.find((u) => u.id === req.usuario.id);
  if (!usuario) throw new ErroNegocio('NAO_ENCONTRADO', 'Usuário não encontrado.', 404);
  const catador = getDb().catadores.find((c) => c.usuario_id === usuario.id);
  res.json({ usuario: publico(usuario), catador: catador || null });
});

module.exports = router;
