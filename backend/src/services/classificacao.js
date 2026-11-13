// Classificação de resíduos. A IA é AUXILIAR: não confirma pagamento (Regra 1).
// Sem AI_API_KEY (ou se a IA falhar), usa o classificador de reserva por palavras-chave.
const config = require('../config');

const MATERIAIS = ['plastico', 'metal', 'vidro', 'papel'];

const ORIENTACOES = {
  plastico: ['Retire o líquido restante', 'Enxágue a embalagem', 'Amasse para ocupar menos espaço'],
  metal: ['Esvazie e enxágue a lata', 'Amasse a lata', 'Cuidado com bordas cortantes'],
  vidro: ['Esvazie e enxágue', 'Não misture com vidro quebrado solto: embale em papel', 'Retire tampas de metal ou plástico'],
  papel: ['Mantenha seco e limpo', 'Desmonte as caixas', 'Papel engordurado ou molhado não é reciclável'],
};

const PALAVRAS = {
  plastico: ['garrafa pet', 'pet', 'plástico', 'plastico', 'sacola', 'pote', 'embalagem de shampoo', 'garrafa de refrigerante'],
  metal: ['lata', 'latinha', 'alumínio', 'aluminio', 'metal', 'tampa de metal', 'aço'],
  vidro: ['vidro', 'garrafa de vidro', 'pote de vidro', 'frasco'],
  papel: ['papel', 'papelão', 'papelao', 'caixa', 'jornal', 'revista', 'caderno'],
};

const NAO_RECICLAVEIS = ['pizza', 'engordurad', 'guardanapo', 'papel higiênico', 'papel higienico', 'fralda', 'isopor sujo', 'espelho', 'cerâmica', 'ceramica'];

function classificarPorTexto(texto = '') {
  const t = texto.toLowerCase();
  const naoReciclavel = NAO_RECICLAVEIS.some((p) => t.includes(p));
  let material = null;
  for (const m of MATERIAIS) {
    if (PALAVRAS[m].some((p) => t.includes(p))) { material = m; break; }
  }
  if (!material) {
    return { material: null, categoria: null, reciclavel: false, confianca: 0, orientacoes: [], observacao: 'Não foi possível identificar. Escolha o material manualmente.', fonte: 'reserva' };
  }
  return {
    material,
    categoria: null,
    reciclavel: !naoReciclavel,
    confianca: naoReciclavel ? 0.6 : 0.7,
    orientacoes: naoReciclavel ? ['Este item normalmente não é aceito na reciclagem', 'Descarte no lixo comum'] : ORIENTACOES[material],
    observacao: 'Classificação aproximada (sem IA). Confirme se o ponto de coleta aceita este material.',
    fonte: 'reserva',
  };
}

const PROMPT = `Você classifica resíduos para um app de reciclagem em Pernambuco.
Responda SOMENTE com JSON válido, sem texto extra, no formato:
{"material":"plastico|metal|vidro|papel|nenhum","categoria":"string curta","reciclavel":true,"confianca":0.0,"orientacoes":["até 3 frases curtas"],"observacao":"string curta"}
Use linguagem simples. Se não tiver certeza, use confianca baixa. Lembre que nem todo objeto desses materiais é reciclável (ex.: papel engordurado).`;

function normalizar(bruto) {
  const material = MATERIAIS.includes(bruto?.material) ? bruto.material : null;
  const confianca = Math.max(0, Math.min(1, Number(bruto?.confianca) || 0));
  return {
    material,
    categoria: typeof bruto?.categoria === 'string' ? bruto.categoria.slice(0, 60) : null,
    reciclavel: Boolean(bruto?.reciclavel) && material !== null,
    confianca,
    orientacoes: Array.isArray(bruto?.orientacoes) ? bruto.orientacoes.slice(0, 3).map(String) : [],
    observacao: confianca < 0.6
      ? 'Classificação pouco confiável. Confira o material antes de entregar.'
      : (typeof bruto?.observacao === 'string' ? bruto.observacao : 'Confirme se o ponto de coleta aceita este material.'),
    fonte: 'ia',
  };
}

async function classificarComIA({ imagemBase64, mimeType, texto }) {
  const content = [];
  if (imagemBase64) content.push({ type: 'image', source: { type: 'base64', media_type: mimeType, data: imagemBase64 } });
  content.push({ type: 'text', text: texto ? `Descrição do usuário: ${texto}` : 'Classifique o resíduo da imagem.' });

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': config.aiApiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: config.aiModel, max_tokens: 400, system: PROMPT, messages: [{ role: 'user', content }] }),
    signal: AbortSignal.timeout(20000),
  });
  if (!resp.ok) throw new Error(`IA respondeu ${resp.status}`);
  const data = await resp.json();
  const textoResposta = data.content?.find((c) => c.type === 'text')?.text || '';
  const json = textoResposta.slice(textoResposta.indexOf('{'), textoResposta.lastIndexOf('}') + 1);
  return normalizar(JSON.parse(json));
}

async function classificar(entrada, { usarIA = Boolean(config.aiApiKey) } = {}) {
  if (usarIA) {
    try {
      return await classificarComIA(entrada);
    } catch (erro) {
      console.warn('[classificacao] IA indisponível, usando reserva:', erro.message);
    }
  }
  const resultado = classificarPorTexto(entrada.texto);
  if (!entrada.texto && entrada.imagemBase64) {
    resultado.observacao = 'IA indisponível no momento. Descreva o item ou escolha o material manualmente.';
  }
  return resultado;
}

module.exports = { classificar, classificarPorTexto, normalizar, ORIENTACOES };
