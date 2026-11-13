import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

const VAZIO = { nome: '', endereco: '', bairro_id: '', latitude: '', longitude: '', horario: '', materiais_aceitos: [], modalidade: 'doacao' };

export default function MeusPontos() {
  const [bairros, setBairros] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = () => api('/pontos/meus').then((d) => setPontos(d.pontos)).catch(() => {});
  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)); carregar(); }, []);

  const mudar = (c) => (e) => setForm({ ...form, [c]: e.target.value });
  const alternar = (m) => setForm({ ...form, materiais_aceitos: form.materiais_aceitos.includes(m) ? form.materiais_aceitos.filter((x) => x !== m) : [...form.materiais_aceitos, m] });

  function usarMinhaLocalizacao() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => setErro('Não foi possível obter a localização.'),
    );
  }

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setMsg('');
    try {
      const r = await api('/pontos', { metodo: 'POST', corpo: { ...form, bairro_id: Number(form.bairro_id), latitude: Number(form.latitude), longitude: Number(form.longitude) } });
      setMsg(r.mensagem); setForm(VAZIO); carregar();
    } catch (err) { setErro(err.message); }
  }

  return (
    <section>
      <h1>Meus pontos de coleta</h1>
      <ul className="lista">
        {pontos.map((p) => (
          <li key={p.id} className="cartao">
            <strong>{p.nome}</strong>
            <span className={p.aprovado ? 'ok' : 'nota'}>{p.aprovado ? 'Aprovado — visível no mapa' : 'Aguardando aprovação'}</span>
          </li>
        ))}
      </ul>

      <form className="cartao formulario" onSubmit={enviar}>
        <h2>Cadastrar novo ponto</h2>
        <label htmlFor="nome">Nome do ponto</label>
        <input id="nome" value={form.nome} onChange={mudar('nome')} required />
        <label htmlFor="endereco">Endereço</label>
        <input id="endereco" value={form.endereco} onChange={mudar('endereco')} required />
        <label htmlFor="bairro">Bairro</label>
        <select id="bairro" value={form.bairro_id} onChange={mudar('bairro_id')} required>
          <option value="">Selecione</option>
          {bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
        <button className="botao secundario" type="button" onClick={usarMinhaLocalizacao}>📍 Usar minha localização</button>
        <div className="linha">
          <label htmlFor="lat">Latitude</label>
          <input id="lat" value={form.latitude} onChange={mudar('latitude')} required inputMode="decimal" />
          <label htmlFor="lng">Longitude</label>
          <input id="lng" value={form.longitude} onChange={mudar('longitude')} required inputMode="decimal" />
        </div>
        <label htmlFor="horario">Horário de funcionamento</label>
        <input id="horario" value={form.horario} onChange={mudar('horario')} placeholder="Ex.: Seg a Sex, 8h–17h" />
        <fieldset>
          <legend>Materiais aceitos</legend>
          {Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <label key={m} className="opcao"><input type="checkbox" checked={form.materiais_aceitos.includes(m)} onChange={() => alternar(m)} /> {r}</label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Modalidade</legend>
          <label className="opcao"><input type="radio" name="modalidade" value="doacao" checked={form.modalidade === 'doacao'} onChange={mudar('modalidade')} /> Recebo doações</label>
          <label className="opcao"><input type="radio" name="modalidade" value="compra" checked={form.modalidade === 'compra'} onChange={mudar('modalidade')} /> Compro material</label>
        </fieldset>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {msg && <p className="ok" role="status">{msg}</p>}
        <button className="botao" type="submit">Enviar para aprovação</button>
      </form>
    </section>
  );
}
