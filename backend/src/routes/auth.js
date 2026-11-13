const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { getDb, inserir } = require('../db');
const { gerarToken, autenticar } = require('../middlewares/auth');
const { limitarLogin } = require('../middlewares/limiteLogin');
const { ErroNegocio } = require('../services/erros');

const router = express.Router();
const PERFIS_CADASTRO = ['morador', 'catador', 'ponto']; // admin/gestor não se autocadastram
// Partes do domínio sem ponto: cada caractere só casa de um jeito (sem backtracking lento).
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]{1,63}(?:\.[^\s@.]{1,63}){1,4}$/;
const emailValido = (email) => typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email);

function publico(u) {
  const { senha_hash, ...resto } = u;
  return resto;
}

router.post('/cadastro', (req, res) => {
  const { nome, email, telefone = '', senha, perfil = 'morador', bairro_id, endereco = '' } = req.body || {};
  if (!nome || String(nome).trim().length < 2) throw new ErroNegocio('NOME_INVALIDO', 'Informe seu nome.');
  if (!emailValido(email)) throw new ErroNegocio('EMAIL_INVALIDO', 'E-mail inválido.');
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
    // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
    throw new ErroNegocio('CREDENCIAIS_INVALIDAS', 'E-mail ou senha inválidos.', 401);
  }
  res.json({ usuario: publico(usuario), token: gerarToken(usuario) });
});

// Recuperação de senha. Resposta sempre igual (não revela se o e-mail existe).
// O token vale 30 min, é de uso único e só o hash fica guardado.
// Sem serviço de e-mail no MVP: o link aparece na resposta APENAS fora de produção
// (ou com RECUPERACAO_LINK_DEMO=true) para demonstração; em produção vai por e-mail na Fase 2.
const MSG_RECUPERACAO = 'Se este e-mail estiver cadastrado, você vai receber as instruções para criar uma nova senha.';
const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

router.post('/esqueci-senha', limitarLogin, (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  if (!emailValido(email)) throw new ErroNegocio('EMAIL_INVALIDO', 'E-mail inválido.');
  const db = getDb();
  const usuario = db.usuarios.find((u) => u.email === email);
  const resposta = { mensagem: MSG_RECUPERACAO };
  if (usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    db.recuperacoesSenha.forEach((r) => { if (r.usuario_id === usuario.id) r.usado_em = r.usado_em || new Date().toISOString(); });
    db.recuperacoesSenha.push({ usuario_id: usuario.id, token_hash: hashToken(token), expira_em: new Date(Date.now() + 30 * 60000).toISOString(), usado_em: null });
    if (config.recuperacaoLinkDemo) resposta.link_demo = `/redefinir-senha?token=${token}`;
  }
  res.json(resposta);
});

router.post('/redefinir-senha', limitarLogin, (req, res) => {
  const { token, senha } = req.body || {};
  if (!senha || String(senha).length < 8) throw new ErroNegocio('SENHA_FRACA', 'A senha precisa ter ao menos 8 caracteres.');
  const db = getDb();
  const registro = token && db.recuperacoesSenha.find((r) => r.token_hash === hashToken(String(token)));
  if (!registro || registro.usado_em || new Date(registro.expira_em) < new Date()) {
    throw new ErroNegocio('LINK_INVALIDO', 'Link inválido ou expirado. Peça um novo em "Esqueci minha senha".');
  }
  const usuario = db.usuarios.find((u) => u.id === registro.usuario_id);
  usuario.senha_hash = bcrypt.hashSync(String(senha), 10);
  registro.usado_em = new Date().toISOString();
  res.json({ mensagem: 'Senha alterada. Entre com a nova senha.' });
});

router.get('/me', autenticar, (req, res) => {
  const usuario = getDb().usuarios.find((u) => u.id === req.usuario.id);
  if (!usuario) throw new ErroNegocio('NAO_ENCONTRADO', 'Usuário não encontrado.', 404);
  const catador = getDb().catadores.find((c) => c.usuario_id === usuario.id);
  res.json({ usuario: publico(usuario), catador: catador || null });
});

module.exports = router;
