import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS, NOMES_STATUS } from '../../utils/formatar.js';

const JANELAS = ['Manhã (8h–12h)', 'Tarde (13h–17h)', 'Noite (18h–20h)'];

export default function SolicitarColeta() {
  const [bairros, setBairros] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ endereco: '', bairro_id: '', janela_horario: JANELAS[0] });
  const [qtd, setQtd] = useState({ plastico: '', metal: '', vidro: '', papel: '' });
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');

  const carregar = () => api('/pedidos/meus').then((d) => setPedidos(d.pedidos)).catch(() => {});
  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)); carregar(); }, []);

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setMsg('');
    const materiais_estimados = Object.entries(qtd).filter(([, v]) => Number(v) > 0).map(([material, v]) => ({ material, quantidade_kg: Number(v) }));
    try {
      await api('/pedidos', { metodo: 'POST', corpo: { ...form, bairro_id: Number(form.bairro_id), materiais_estimados } });
      setMsg('Pedido enviado! Avisaremos quando um catador aceitar.');
      carregar();
    } catch (err) { setErro(err.message); }
  }

  return (
    <section>
      <h1>Pedir coleta em casa</h1>
      <form className="cartao formulario" onSubmit={enviar}>
        <fieldset>
          <legend>Quantidade estimada (kg)</legend>
          {Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <div key={m} className="linha">
              <label htmlFor={`qtd-${m}`}>{r}</label>
              <input id={`qtd-${m}`} type="number" min="0" step="0.1" inputMode="decimal" value={qtd[m]} onChange={(e) => setQtd({ ...qtd, [m]: e.target.value })} />
            </div>
          ))}
        </fieldset>
        <label htmlFor="endereco">Endereço</label>
        <input id="endereco" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} required autoComplete="street-address" />
        <label htmlFor="bairro">Bairro</label>
        <select id="bairro" value={form.bairro_id} onChange={(e) => setForm({ ...form, bairro_id: e.target.value })} required>
          <option value="">Selecione</option>
          {bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
        <label htmlFor="janela">Horário</label>
        <select id="janela" value={form.janela_horario} onChange={(e) => setForm({ ...form, janela_horario: e.target.value })}>
          {JANELAS.map((j) => <option key={j}>{j}</option>)}
        </select>
        {erro && <p className="erro" role="alert">{erro}</p>}
        {msg && <p className="ok" role="status">{msg}</p>}
        <button className="botao" type="submit">Solicitar coleta</button>
      </form>

      <h2>Meus pedidos</h2>
      <ul className="lista">
        {pedidos.map((p) => (
          <li key={p.id} className="cartao">
            <strong>Pedido #{p.id} · {NOMES_STATUS[p.status]}</strong>
            <span>{p.materiais_estimados.map((m) => `${NOMES_MATERIAIS[m.material]} ${m.quantidade_kg} kg`).join(', ')}</span>
            {p.status === 'aceito' && (
              <div className="qr">
                <p>Mostre este código ao catador na coleta:</p>
                <QRCodeSVG value={p.qr_code} size={160} />
                <code>{p.qr_code}</code>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
