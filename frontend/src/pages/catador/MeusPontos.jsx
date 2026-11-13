import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import Badge from '../../components/common/Badge.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';
import CampoEndereco, { ENDERECO_VAZIO } from '../../components/map/CampoEndereco.jsx';
import { montarEndereco } from '../../services/mapas.js';

const VAZIO = { nome: '', horario: '', materiais_aceitos: [], modalidade: 'doacao' };

export default function MeusPontos() {
  const [bairros, setBairros] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = () => api('/pontos/meus').then((d) => setPontos(d.pontos)).catch(() => {});
  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)).catch(() => {}); carregar(); }, []);

  const mudar = (c) => (e) => setForm({ ...form, [c]: e.target.value });
  const alternar = (m) => setForm({ ...form, materiais_aceitos: form.materiais_aceitos.includes(m) ? form.materiais_aceitos.filter((x) => x !== m) : [...form.materiais_aceitos, m] });

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setMsg('');
    try {
      if (endereco.latitude == null) throw new Error('Localize o endereço do ponto no mapa.');
      const r = await api('/pontos', { metodo: 'POST', corpo: { ...form, endereco: montarEndereco(endereco), cep: endereco.cep, bairro_id: Number(endereco.bairro_id), latitude: endereco.latitude, longitude: endereco.longitude } });
      setMsg(r.mensagem); setForm(VAZIO); setEndereco(ENDERECO_VAZIO); carregar();
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
        <CampoEndereco valor={endereco} onChange={(e) => { setEndereco(e); setErro(''); }} bairros={bairros} id="ponto" />
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
