import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import Badge from '../../components/common/Badge.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

const VAZIO = { nome: '', endereco: '', bairro_id: '', latitude: '', longitude: '', horario: '', materiais_aceitos: [], modalidade: 'doacao' };

export default function MeusPontos() {
  const [bairros, setBairros] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = () => api('/pontos/meus').then((d) => setPontos(d.pontos)).catch(() => {});
  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)).catch(() => {}); carregar(); }, []);

  const mudar = (c) => (e) => setForm({ ...form, [c]: e.target.value });
  const alternar = (m) => setForm({ ...form, materiais_aceitos: form.materiais_aceitos.includes(m) ? form.materiais_aceitos.filter((x) => x !== m) : [...form.materiais_aceitos, m] });

  function usarMinhaLocalizacao() {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => setErro('Não foi possível obter a localização. Digite as coordenadas.'),
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
    <>
      <h1 className="titulo-1">Meus pontos</h1>
      {pontos.map((p) => (
        <div key={p.id} className="rp-card">
          <div className="entre"><p className="rp-card-titulo">{p.nome}</p>
            {p.aprovado ? <Badge tipo="sucesso">Aprovado</Badge> : <Badge tipo="aviso">Aguardando aprovação</Badge>}</div>
          <p className="rp-card-texto">{p.endereco}</p>
        </div>
      ))}

      <h2 className="secao">Cadastrar novo ponto</h2>
      <form className="pilha" onSubmit={enviar}>
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="nome">Nome do ponto</label><input className="rp-campo" id="nome" value={form.nome} onChange={mudar('nome')} required /></div>
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="endereco">Endereço</label><input className="rp-campo" id="endereco" value={form.endereco} onChange={mudar('endereco')} required /></div>
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="bairro">Bairro</label>
          <select className="rp-campo" id="bairro" value={form.bairro_id} onChange={mudar('bairro_id')} required>
            <option value="">Selecione</option>{bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select></div>
        <button className="rp-btn rp-btn-secundario rp-btn-bloco" type="button" onClick={usarMinhaLocalizacao}>Usar minha localização</button>
        <div className="grade-2">
          <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="lat">Latitude</label><input className="rp-campo" id="lat" value={form.latitude} onChange={mudar('latitude')} required inputMode="decimal" /></div>
          <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="lng">Longitude</label><input className="rp-campo" id="lng" value={form.longitude} onChange={mudar('longitude')} required inputMode="decimal" /></div>
        </div>
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="horario">Horário de funcionamento</label><input className="rp-campo" id="horario" value={form.horario} onChange={mudar('horario')} placeholder="Seg a Sex, 8h–17h" /></div>
        <fieldset className="rp-card">
          <legend className="rp-rotulo">Materiais aceitos</legend>
          <div className="grade-2">{Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <label key={m} className="rp-opcao"><input type="checkbox" checked={form.materiais_aceitos.includes(m)} onChange={() => alternar(m)} /> {r}</label>
          ))}</div>
        </fieldset>
        <fieldset className="rp-card">
          <legend className="rp-rotulo">Modalidade</legend>
          <label className="rp-opcao"><input type="radio" name="modalidade" value="doacao" checked={form.modalidade === 'doacao'} onChange={mudar('modalidade')} /> Recebo doações</label>
          <label className="rp-opcao"><input type="radio" name="modalidade" value="compra" checked={form.modalidade === 'compra'} onChange={mudar('modalidade')} /> Compro material</label>
        </fieldset>
        {erro && <Alert tipo="erro" titulo="Não foi possível cadastrar">{erro}</Alert>}
        {msg && <Alert tipo="sucesso" titulo="Ponto enviado">{msg}</Alert>}
        <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit">Enviar para aprovação</button>
      </form>
    </>
  );
}
