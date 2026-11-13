import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import { StatusPedido } from '../../components/common/Badge.jsx';
import RecyclingProgress from '../../components/recycling/RecyclingProgress.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

const JANELAS = ['Manhã (8h–12h)', 'Tarde (13h–17h)', 'Noite (18h–20h)'];

export default function SolicitarColeta() {
  const [bairros, setBairros] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ endereco: '', bairro_id: '', janela_horario: JANELAS[0] });
  const [qtd, setQtd] = useState({ plastico: '', metal: '', vidro: '', papel: '' });
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregar = () => api('/pedidos/meus').then((d) => setPedidos(d.pedidos.slice().reverse())).catch(() => {});
  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)).catch(() => {}); carregar(); }, []);

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setMsg(''); setEnviando(true);
    const materiais_estimados = Object.entries(qtd).filter(([, v]) => Number(String(v).replace(',', '.')) > 0)
      .map(([material, v]) => ({ material, quantidade_kg: Number(String(v).replace(',', '.')) }));
    try {
      await api('/pedidos', { metodo: 'POST', corpo: { ...form, bairro_id: Number(form.bairro_id), materiais_estimados } });
      setMsg('Avisaremos quando um catador aceitar.');
      setQtd({ plastico: '', metal: '', vidro: '', papel: '' });
      carregar();
    } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  const ativos = pedidos.filter((p) => !['entregue', 'cancelado'].includes(p.status));

  return (
    <>
      <h1 className="titulo-1">Pedir coleta em casa</h1>
      {ativos.map((p) => (
        <div key={p.id} className="rp-card">
          <div className="entre"><p className="rp-card-titulo">Pedido #{p.id}</p><StatusPedido status={p.status} /></div>
          <RecyclingProgress status={p.status} />
          <p className="rp-card-texto">{p.materiais_estimados.map((m) => `${NOMES_MATERIAIS[m.material]} ${m.quantidade_kg} kg`).join(' · ')} · {p.janela_horario}</p>
          {p.status === 'aceito' && (
            <div className="rp-qr" style={{ padding: 'var(--espaco-4)' }}>
              <QRCodeSVG value={p.qr_code} size={150} title="QR Code do pedido" />
              <p className="rp-card-texto">Mostre este código ao catador na coleta.</p>
              <span className="rp-qr-codigo">{p.qr_code}</span>
            </div>
          )}
        </div>
      ))}

      <h2 className="secao">Novo pedido</h2>
      <form className="pilha" onSubmit={enviar}>
        <fieldset className="rp-card">
          <legend className="rp-rotulo">Quantidade estimada (kg)</legend>
          {Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <div key={m} className="balanca">
              <label className="rp-opcao" htmlFor={`qtd-${m}`}>{r}</label>
              <input className="rp-campo" id={`qtd-${m}`} inputMode="decimal" placeholder="0" value={qtd[m]} onChange={(e) => setQtd({ ...qtd, [m]: e.target.value })} />
            </div>
          ))}
        </fieldset>
        <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor="endereco">Endereço</label>
          <input className="rp-campo" id="endereco" autoComplete="street-address" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} required />
          <span className="rp-ajuda">Só o catador que aceitar o pedido vê o endereço.</span>
        </div>
        <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor="bairro">Bairro</label>
          <select className="rp-campo" id="bairro" value={form.bairro_id} onChange={(e) => setForm({ ...form, bairro_id: e.target.value })} required>
            <option value="">Selecione</option>{bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select>
        </div>
        <fieldset className="rp-campo-grupo" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="rp-rotulo">Horário</legend>
          <div className="rp-chips">{JANELAS.map((j) => (
            <button key={j} type="button" className={`rp-chip${form.janela_horario === j ? ' rp-chip-ativo' : ''}`} aria-pressed={form.janela_horario === j} onClick={() => setForm({ ...form, janela_horario: j })}>{j}</button>
          ))}</div>
        </fieldset>
        {erro && <Alert tipo="erro" titulo="Não foi possível enviar o pedido">{erro}</Alert>}
        {msg && <Alert tipo="sucesso" titulo="Pedido enviado">{msg}</Alert>}
        <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Solicitar coleta'}</button>
      </form>
    </>
  );
}
