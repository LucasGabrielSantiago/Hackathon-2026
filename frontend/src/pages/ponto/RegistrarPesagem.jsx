import { useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

const novaLinha = () => ({ material: 'plastico', peso_kg: '' });
const numero = (v) => Number(String(v).replace(',', '.'));

export default function RegistrarPesagem() {
  const [modo, setModo] = useState('qr');
  const [codigo, setCodigo] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [itens, setItens] = useState([novaLinha()]);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudarItem = (i, campo, valor) => setItens(itens.map((it, j) => (j === i ? { ...it, [campo]: valor } : it)));
  const totalKg = itens.reduce((s, i) => s + (numero(i.peso_kg) || 0), 0);

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setResultado(null); setEnviando(true);
    const corpo = {
      ...(modo === 'qr' ? { codigo: codigo.trim() } : { pedido_id: Number(pedidoId) }),
      itens: itens.filter((i) => numero(i.peso_kg) > 0).map((i) => ({ material: i.material, peso_kg: numero(i.peso_kg) })),
    };
    try {
      // Idempotency-Key evita crédito duplicado se o botão for tocado duas vezes.
      const r = await api('/entregas', { metodo: 'POST', corpo, headers: { 'Idempotency-Key': crypto.randomUUID() } });
      setResultado(r); setCodigo(''); setPedidoId(''); setItens([novaLinha()]);
    } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  return (
    <>
      <h1 className="titulo-1">Receber entrega</h1>
      <div className="rp-abas" role="tablist">
        <button type="button" role="tab" aria-selected={modo === 'qr'} className={`rp-aba${modo === 'qr' ? ' rp-aba-ativa' : ''}`} onClick={() => setModo('qr')}>QR do morador</button>
        <button type="button" role="tab" aria-selected={modo === 'pedido'} className={`rp-aba${modo === 'pedido' ? ' rp-aba-ativa' : ''}`} onClick={() => setModo('pedido')}>Coleta do catador</button>
      </div>
      <form className="pilha" onSubmit={enviar}>
        {modo === 'qr' ? (
          <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="codigo">Código do QR do morador</label>
            <input className="rp-campo" id="codigo" autoCapitalize="characters" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
            <span className="rp-ajuda">Cada código vale para uma única entrega.</span></div>
        ) : (
          <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="pedido">Número do pedido</label>
            <input className="rp-campo" id="pedido" type="number" min="1" inputMode="numeric" value={pedidoId} onChange={(e) => setPedidoId(e.target.value)} required /></div>
        )}
        <fieldset className="rp-card">
          <legend className="rp-rotulo">Pesagem</legend>
          {itens.map((it, i) => (
            <div key={i} className="balanca">
              <label htmlFor={`mat-${i}`} className="sr-only">Material</label>
              <select className="rp-campo" id={`mat-${i}`} value={it.material} onChange={(e) => mudarItem(i, 'material', e.target.value)}>
                {Object.entries(NOMES_MATERIAIS).map(([m, r]) => <option key={m} value={m}>{r}</option>)}
              </select>
              <label htmlFor={`peso-${i}`} className="sr-only">Peso em kg</label>
              <input className="rp-campo" id={`peso-${i}`} inputMode="decimal" placeholder="kg" value={it.peso_kg} onChange={(e) => mudarItem(i, 'peso_kg', e.target.value)} />
            </div>
          ))}
          <button className="rp-btn rp-btn-fantasma" type="button" onClick={() => setItens([...itens, novaLinha()])}>+ Adicionar material</button>
          <div className="total"><span>Total</span><b>{totalKg.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} kg</b></div>
        </fieldset>
        {erro && <Alert tipo="erro" titulo="Não foi possível registrar">{erro}</Alert>}
        <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando || totalKg <= 0}>{enviando ? 'Registrando…' : 'Confirmar entrega'}</button>
      </form>

      {resultado && (
        <div className="rp-card resultado-ok" role="status">
          <p className="rp-card-titulo">Entrega #{resultado.entrega.id} confirmada</p>
          <p className="rp-card-texto">{(resultado.entrega.peso_total_gramas / 1000).toLocaleString('pt-BR')} kg pesados</p>
          <div className="total"><span>Bolsa Reciclagem (morador)</span><b className="rp-credito">{reais(resultado.entrega.recompensa_centavos)}</b></div>
          {resultado.entrega.remuneracao_catador_centavos !== undefined && (
            <div className="total"><span>Remuneração do catador</span><b>{reais(resultado.entrega.remuneracao_catador_centavos)}</b></div>
          )}
        </div>
      )}
    </>
  );
}
