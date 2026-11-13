// Cliente da API. Valores financeiros SEMPRE vêm do back-end.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const CHAVE_TOKEN = 'reciclape_token';

export function getToken() {
  try { return localStorage.getItem(CHAVE_TOKEN); } catch { return null; }
}
export function setToken(token) {
  try { token ? localStorage.setItem(CHAVE_TOKEN, token) : localStorage.removeItem(CHAVE_TOKEN); } catch { /* sem storage */ }
}

export async function api(caminho, { metodo = 'GET', corpo, formData, headers = {} } = {}) {
  const token = getToken();
  const resp = await fetch(BASE + caminho, {
    method: metodo,
    headers: {
      ...(formData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: formData || (corpo ? JSON.stringify(corpo) : undefined),
  });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(dados.mensagem || 'Não foi possível concluir. Tente novamente.');
  return dados;
}
