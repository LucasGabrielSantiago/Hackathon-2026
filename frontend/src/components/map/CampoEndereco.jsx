import { lazy, Suspense, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { buscarCep, enderecoPorCoordenadas, formatarCep, geocodificar, somenteDigitos } from '../../services/mapas.js';

const SeletorLocal = lazy(() => import('./SeletorLocal.jsx'));

export const ENDERECO_VAZIO = { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', bairro_id: '', cidade: '', uf: '', latitude: null, longitude: null };

const normalizar = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Endereço completo para todo o sistema: CEP preenche a rua, o número localiza no mapa
// e o pino pode ser ajustado. Ninguém precisa digitar latitude e longitude.
export default function CampoEndereco({ valor, onChange, bairros = [], comMapa = true, comBairro = true, obrigatorio = true, id = 'end' }) {
  const [aviso, setAviso] = useState('');
  const [buscando, setBuscando] = useState(false);
  const mudar = (parcial) => onChange({ ...valor, ...parcial });

  async function aoMudarCep(e) {
    const cep = formatarCep(e.target.value);
    mudar({ cep });
    if (somenteDigitos(cep).length !== 8) return;
    setAviso(''); setBuscando(true);
    try {
      const r = await buscarCep(cep);
      const bairro = bairros.find((b) => normalizar(b.nome) === normalizar(r.bairro));
      const novo = { ...valor, ...r, bairro_id: bairro ? String(bairro.id) : valor.bairro_id };
      onChange(novo);
      setAviso(bairro ? '' : `Bairro "${r.bairro}" ainda não atendido. Escolha o mais próximo.`);
      if (comMapa && r.logradouro) await localizar(novo);
    } catch (err) { setAviso(err.message); } finally { setBuscando(false); }
  }

  async function localizar(base = valor) {
    if (!base.logradouro && somenteDigitos(base.cep).length !== 8) { setAviso('Informe o CEP ou a rua.'); return; }
    setBuscando(true);
    try {
      const { aproximado, ...pos } = await geocodificar(base);
      onChange({ ...base, ...pos });
      setAviso(aproximado ? 'Localização aproximada: arraste o pino até a porta da casa.' : '');
    } catch (err) { setAviso(err.message); } finally { setBuscando(false); }
  }

  // Preenche rua, número, bairro, cidade e CEP a partir de um ponto (GPS ou pino).
  // `sobrescrever` = true no botão de GPS; ao mexer no pino só completa o que está vazio.
  async function preencherPorPonto(base, pos, sobrescrever) {
    setBuscando(true);
    try {
      const r = await enderecoPorCoordenadas(pos);
      const bairro = bairros.find((b) => normalizar(b.nome) === normalizar(r.bairro));
      const campos = Object.fromEntries(Object.entries(r).filter(([k, v]) => v && (sobrescrever || !base[k])));
      const bairroId = bairro && (sobrescrever || !base.bairro_id) ? { bairro_id: String(bairro.id) } : {};
      onChange({ ...base, ...campos, ...bairroId, ...pos });
      const faltando = [!r.numero && 'o número', !bairro && comBairro && 'o bairro'].filter(Boolean);
      setAviso(faltando.length ? `Endereço preenchido pela localização. Confira e informe ${faltando.join(' e ')}.` : 'Endereço preenchido pela localização. Confira os dados e o pino.');
    } catch (err) { onChange({ ...base, ...pos }); setAviso(err.message); } finally { setBuscando(false); }
  }

  function minhaLocalizacao() {
    if (!navigator.geolocation) { setAviso('Seu aparelho não informa a localização.'); return; }
    setAviso('Buscando sua localização…');
    navigator.geolocation.getCurrentPosition(
      (p) => preencherPorPonto(valor, { latitude: p.coords.latitude, longitude: p.coords.longitude }, true),
      () => setAviso('Permita o acesso à localização ou marque o local no mapa.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function moverPino(pos) {
    if (!valor.logradouro) { preencherPorPonto(valor, pos, false); return; }
    mudar(pos); setAviso('');
  }

  return (
    <fieldset className="rp-card pilha" style={{ gap: 'var(--espaco-3)' }}>
      <legend className="rp-rotulo">Endereço</legend>
      <button className="rp-btn rp-btn-secundario rp-btn-bloco" type="button" onClick={minhaLocalizacao} disabled={buscando}>
        <Icon name="pin" />{buscando ? 'Buscando…' : 'Usar minha localização'}
      </button>
      <span className="rp-ajuda">Preenche rua, número, bairro e CEP pelo GPS. Ou digite o CEP abaixo.</span>
      <div className="grade-2">
        <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor={`${id}-cep`}>CEP</label>
          <input className="rp-campo" id={`${id}-cep`} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={valor.cep} onChange={aoMudarCep} />
        </div>
        <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor={`${id}-numero`}>Número</label>
          <input className="rp-campo" id={`${id}-numero`} inputMode="numeric" value={valor.numero} onChange={(e) => mudar({ numero: e.target.value })} onBlur={() => comMapa && valor.logradouro && localizar()} required={obrigatorio} />
        </div>
      </div>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor={`${id}-rua`}>Rua</label>
        <input className="rp-campo" id={`${id}-rua`} autoComplete="address-line1" value={valor.logradouro} onChange={(e) => mudar({ logradouro: e.target.value })} required={obrigatorio} />
      </div>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor={`${id}-compl`}>Complemento (opcional)</label>
        <input className="rp-campo" id={`${id}-compl`} autoComplete="address-line2" placeholder="Apto, bloco, ponto de referência" value={valor.complemento} onChange={(e) => mudar({ complemento: e.target.value })} />
      </div>
      <div className="grade-2">
        {comBairro && <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor={`${id}-bairro`}>Bairro</label>
          <select className="rp-campo" id={`${id}-bairro`} value={valor.bairro_id} onChange={(e) => mudar({ bairro_id: e.target.value })} required={obrigatorio}>
            <option value="">Selecione</option>{bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select>
        </div>}
        <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor={`${id}-cidade`}>Cidade</label>
          <input className="rp-campo" id={`${id}-cidade`} value={[valor.cidade, valor.uf].filter(Boolean).join('/')} onChange={(e) => { const [cidade, uf = ''] = e.target.value.split('/'); mudar({ cidade, uf }); }} placeholder="Recife/PE" />
        </div>
      </div>
      {comMapa && (
        <>
          <button className="rp-btn rp-btn-fantasma rp-btn-bloco" type="button" onClick={() => localizar()} disabled={buscando}>{buscando ? 'Buscando…' : 'Localizar no mapa pelo endereço'}</button>
          <Suspense fallback={<p className="apoio">Carregando mapa…</p>}>
            <SeletorLocal valor={valor.latitude != null ? { latitude: valor.latitude, longitude: valor.longitude } : null} onChange={moverPino} />
          </Suspense>
          <span className="rp-ajuda">{valor.latitude != null ? 'Confira o pino. Se estiver no lugar errado, arraste ou toque no ponto certo.' : 'Preencha o CEP e o número para marcar no mapa.'}</span>
        </>
      )}
      {aviso && <p className="rp-ajuda" role="status">{aviso}</p>}
    </fieldset>
  );
}
