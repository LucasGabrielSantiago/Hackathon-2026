// Endereços e rotas sem chave de API:
// - ViaCEP: CEP -> rua, bairro, cidade
// - Nominatim (OpenStreetMap): endereço -> coordenadas (até 1 consulta por segundo)
// - OSRM: rota de carro entre dois pontos (servidor de demonstração)
// - Google Maps URLs: abre a navegação no app do Google Maps (sem chave)

export const CENTRO_RECIFE = { latitude: -8.0476, longitude: -34.877 };

export const somenteDigitos = (v = '') => String(v).replace(/\D/g, '');
export const formatarCep = (v = '') => somenteDigitos(v).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');

export async function buscarCep(cep) {
  const limpo = somenteDigitos(cep);
  if (limpo.length !== 8) throw new Error('O CEP precisa ter 8 números.');
  let dados;
  try { dados = await (await fetch(`https://viacep.com.br/ws/${limpo}/json/`)).json(); } catch { throw new Error('Não foi possível consultar o CEP agora. Preencha o endereço manualmente.'); }
  if (dados.erro) throw new Error('CEP não encontrado.');
  return { cep: formatarCep(limpo), logradouro: dados.logradouro || '', bairro: dados.bairro || '', cidade: dados.localidade || '', uf: dados.uf || '' };
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function nominatim(params) {
  const base = new URLSearchParams({ format: 'jsonv2', limit: '1', countrycodes: 'br', 'accept-language': 'pt-BR' });
  Object.entries(params).forEach(([k, v]) => v && base.set(k, v));
  const lista = await (await fetch(`https://nominatim.openstreetmap.org/search?${base}`)).json();
  return lista?.[0] ? { latitude: Number(lista[0].lat), longitude: Number(lista[0].lon) } : null;
}

// Tenta do mais preciso ao mais genérico. Muitas casas não têm número no OpenStreetMap,
// então a rua sem número, o CEP ou o bairro dão um ponto aproximado para ajustar no mapa.
// Respeita o limite do Nominatim (1 consulta por segundo).
export async function geocodificar({ logradouro, numero, bairro, cidade, uf, cep }, { intervaloMs = 1100 } = {}) {
  const tentativas = [
    logradouro && numero && { street: `${numero} ${logradouro}`, city: cidade, state: uf },
    logradouro && { street: logradouro, city: cidade, state: uf },
    somenteDigitos(cep).length === 8 && { postalcode: formatarCep(cep), country: 'Brasil' },
    bairro && cidade && { q: `${bairro}, ${cidade}${uf ? `, ${uf}` : ''}` },
  ].filter(Boolean);
  if (tentativas.length === 0) throw new Error('Informe o CEP ou a rua.');
  for (let i = 0; i < tentativas.length; i += 1) {
    if (i > 0) await esperar(intervaloMs);
    let achou;
    try { achou = await nominatim(tentativas[i]); } catch { throw new Error('Não foi possível localizar o endereço agora. Marque o local no mapa.'); }
    if (achou) return { ...achou, aproximado: i > 0 };
  }
  throw new Error('Endereço não encontrado no mapa. Toque no mapa para marcar o local.');
}

export async function calcularRota(origem, destino) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origem.longitude},${origem.latitude};${destino.longitude},${destino.latitude}?overview=full&geometries=geojson`;
  const dados = await (await fetch(url)).json();
  const rota = dados.routes?.[0];
  if (dados.code !== 'Ok' || !rota) throw new Error('Rota indisponível.');
  return {
    pontos: rota.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanciaM: rota.distance,
    duracaoS: rota.duration,
  };
}

// Distância em linha reta (metros), usada quando a rota não está disponível.
export function distanciaM(a, b) {
  const r = 6371000; const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude); const dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

export const formatarDistancia = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`);
export const formatarDuracao = (s) => (s < 60 ? 'menos de 1 min' : `${Math.round(s / 60)} min`);

export function montarEndereco({ logradouro, numero, complemento, bairro, cidade, uf, cep }) {
  const linha1 = [logradouro, numero].filter(Boolean).join(', ');
  return [linha1 + (complemento ? ` - ${complemento}` : ''), bairro, [cidade, uf].filter(Boolean).join('/'), cep && `CEP ${formatarCep(cep)}`]
    .filter(Boolean).join(' · ');
}

export function linkGoogleMapsRota(destino, origem) {
  const p = new URLSearchParams({ api: '1', destination: `${destino.latitude},${destino.longitude}`, travelmode: 'driving' });
  if (origem) p.set('origin', `${origem.latitude},${origem.longitude}`);
  return `https://www.google.com/maps/dir/?${p}`;
}

export const linkGoogleMapsLocal = (pos) => `https://www.google.com/maps/search/?api=1&query=${pos.latitude},${pos.longitude}`;
