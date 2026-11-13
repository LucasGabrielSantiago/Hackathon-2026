// Persistência do MVP: a API trabalha em memória (src/db) e guarda uma cópia de
// todos os dados numa linha JSONB do PostgreSQL (Neon). Sem DATABASE_URL, só memória.
// Sem banco, no desenvolvimento local, guarda num arquivo JSON (.dados-local.json) para
// as contas criadas não sumirem quando o `node --watch` reinicia a API.
// Limitação conhecida: uma única instância da API (o caso do Render gratuito).
const fs = require('fs');
const { getDb, substituir } = require('./index');

const ATRASO_MS = 1500;
let pool = null;
let arquivo = null;
let timer = null;
let salvando = Promise.resolve();

// Buffers (fotos) viram base64 para caber no JSON.
function serializar(db) {
  const fotos = Object.fromEntries(Object.entries(db.fotosPedidos || {}).map(([id, f]) => [id, { mime: f.mime, base64: f.dados.toString('base64') }]));
  return { ...db, fotosPedidos: fotos };
}

function desserializar(dados) {
  const fotos = Object.fromEntries(Object.entries(dados.fotosPedidos || {}).map(([id, f]) => [id, { mime: f.mime, dados: Buffer.from(f.base64, 'base64') }]));
  return { ...dados, fotosPedidos: fotos };
}

function iniciarArquivo(caminho) {
  arquivo = caminho;
  if (fs.existsSync(caminho)) {
    substituir(desserializar(JSON.parse(fs.readFileSync(caminho, 'utf8'))));
    console.log(`[persistencia] dados locais carregados de ${caminho}`);
  } else {
    gravar();
    console.log(`[persistencia] dados locais em ${caminho} (apague o arquivo para voltar aos dados de demonstração)`);
  }
  return true;
}

async function iniciar(url = process.env.DATABASE_URL, { arquivo: caminhoArquivo } = {}) {
  if (!url && caminhoArquivo) return iniciarArquivo(caminhoArquivo);
  if (!url) { console.log('[persistencia] sem DATABASE_URL: dados só em memória'); return false; }
  const { Pool } = require('pg');
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url); // Postgres local (Docker) sem SSL; Neon com SSL
  pool = new Pool({ connectionString: url, max: 2, ssl: local ? false : { rejectUnauthorized: true }, connectionTimeoutMillis: 10000 });
  await pool.query('CREATE TABLE IF NOT EXISTS recicla_estado (id int PRIMARY KEY, dados jsonb NOT NULL, atualizado_em timestamptz NOT NULL DEFAULT now())');
  const { rows } = await pool.query('SELECT dados FROM recicla_estado WHERE id = 1');
  if (rows[0]) {
    substituir(desserializar(rows[0].dados));
    console.log('[persistencia] dados carregados do banco');
  } else {
    await gravar();
    console.log('[persistencia] banco vazio: dados de demonstração gravados');
  }
  return true;
}

function gravar() {
  if (arquivo) {
    try { fs.writeFileSync(arquivo, JSON.stringify(serializar(getDb()))); } catch (e) { console.error('[persistencia] falha ao salvar arquivo:', e.message); }
    return Promise.resolve();
  }
  if (!pool) return Promise.resolve();
  const json = JSON.stringify(serializar(getDb()));
  salvando = salvando.then(() => pool.query(
    'INSERT INTO recicla_estado (id, dados, atualizado_em) VALUES (1, $1::jsonb, now()) ON CONFLICT (id) DO UPDATE SET dados = EXCLUDED.dados, atualizado_em = now()',
    [json],
  )).catch((e) => console.error('[persistencia] falha ao salvar:', e.message));
  return salvando;
}

// Agenda um salvamento (junta várias alterações seguidas num só).
function agendar() {
  if (!pool && !arquivo) return;
  clearTimeout(timer);
  timer = setTimeout(gravar, ATRASO_MS);
}

async function encerrar() {
  clearTimeout(timer);
  if (pool) { await gravar(); await pool.end(); pool = null; }
  if (arquivo) { gravar(); arquivo = null; }
}

// Middleware: toda requisição que altera dados e deu certo agenda o salvamento.
function salvarAposAlteracao(req, res, next) {
  if (req.method !== 'GET') res.on('finish', () => { if (res.statusCode < 400) agendar(); });
  next();
}

const ativa = () => Boolean(pool || arquivo);
const modo = () => (pool ? 'postgres' : arquivo ? 'arquivo' : 'memoria');

module.exports = { iniciar, agendar, gravar, encerrar, salvarAposAlteracao, serializar, desserializar, ativa, modo };
