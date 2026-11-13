// Cliente da API. Valores financeiros SEMPRE vêm do back-end.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const CHAVE_TOKEN = 'reciclape_token';

export function getToken() {
  try { return localStorage.getItem(CHAVE_TOKEN); } catch { return null; }
}
export function setToken(token) {
  try { token ? localStorage.setItem(CHAVE_TOKEN, token) : localStorage.removeItem(CHAVE_TOKEN); } catch { /* sem storage */ }
}

export const MSG_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Verifique sua internet e tente de novo em alguns segundos.';

async function requisitar(caminho, { metodo = 'GET', corpo, formData, headers = {} } = {}) {
  const token = getToken();
  try {
    return await fetch(BASE + caminho, {
      method: metodo,
      headers: {
        ...(formData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: formData || (corpo ? JSON.stringify(corpo) : undefined),
    });
  } catch {
    // "Failed to fetch": API fora do ar, acordando (Render) ou sem internet.
    throw new Error(MSG_SEM_CONEXAO);
  }
}

export async function api(caminho, opcoes) {
  const resp = await requisitar(caminho, opcoes);
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(dados.mensagem || 'Não foi possível concluir. Tente novamente.');
  return dados;
}

// Para imagens protegidas (foto do pedido): devolve um Blob.
export async function apiBlob(caminho) {
  const resp = await requisitar(caminho);
  if (!resp.ok) throw new Error('Não foi possível carregar a foto.');
  return resp.blob();
}
