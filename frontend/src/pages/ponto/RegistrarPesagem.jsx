import { useState } from 'react';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

const novaLinha = () => ({ material: 'plastico', peso_kg: '' });

export default function RegistrarPesagem() {
  const [modo, setModo] = useState('qr');
  const [codigo, setCodigo] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [itens, setItens] = useState([novaLinha()]);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mudarItem = (i, campo, valor) => setItens(itens.map((it, j) => (j === i ? { ...it, [campo]: valor } : it)));

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setResultado(null); setEnviando(true);
    const corpo = {
      ...(modo === 'qr' ? { codigo: codigo.trim() } : { pedido_id: Number(pedidoId) }),
      itens: itens.filter((i) => Number(i.peso_kg) > 0).map((i) => ({ material: i.material, peso_kg: Number(i.peso_kg) })),
    };
    try {
      // Idempotency-Key evita crédito duplicado se o botão for clicado duas vezes.
      const r = await api('/entregas', { metodo: 'POST', corpo, headers: { 'Idempotency-Key': crypto.randomUUID() } });
      setResultado(r); setCodigo(''); setPedidoId(''); setItens([novaLinha()]);
    } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  return (
    <section>
      <h1>Registrar pesagem</h1>
      <form className="cartao formulario" onSubmit={enviar}>
        <fieldset>
          <legend>Tipo de entrega</legend>
          <label className="opcao"><input type="radio" name="modo" checked={modo === 'qr'} onChange={() => setModo('qr')} /> Morador no ponto (QR Code)</label>
          <label className="opcao"><input type="radio" name="modo" checked={modo === 'pedido'} onChange={() => setModo('pedido')} /> Coleta em casa (catador)</label>
        </fieldset>
        {modo === 'qr' ? (
          <>
            <label htmlFor="codigo">Código do QR do morador</label>
            <input id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
          </>
        ) : (
          <>
            <label htmlFor="pedido">Número do pedido</label>
            <input id="pedido" type="number" min="1" value={pedidoId} onChange={(e) => setPedidoId(e.target.value)} required />
          </>
        )}
        <fieldset>
          <legend>Materiais pesados</legend>
          {itens.map((it, i) => (
            <div key={i} className="linha">
              <label htmlFor={`mat-${i}`} className="sr-only">Material</label>
              <select id={`mat-${i}`} value={it.material} onChange={(e) => mudarItem(i, 'material', e.target.value)}>
                {Object.entries(NOMES_MATERIAIS).map(([m, r]) => <option key={m} value={m}>{r}</option>)}
              </select>
              <label htmlFor={`peso-${i}`} className="sr-only">Peso em kg</label>
              <input id={`peso-${i}`} type="number" min="0" step="0.001" inputMode="decimal" placeholder="kg" value={it.peso_kg} onChange={(e) => mudarItem(i, 'peso_kg', e.target.value)} />
            </div>
          ))}
          <button className="botao-texto" type="button" onClick={() => setItens([...itens, novaLinha()])}>+ Adicionar material</button>
        </fieldset>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="botao" type="submit" disabled={enviando}>{enviando ? 'Registrando…' : 'Confirmar entrega'}</button>
      </form>

      {resultado && (
        <div className="cartao resultado" role="status">
          <h2>Entrega #{resultado.entrega.id} confirmada</h2>
          <p>Peso total: {(resultado.entrega.peso_total_gramas / 1000).toLocaleString('pt-BR')} kg</p>
          <p>Bolsa Reciclagem (morador): <strong>{reais(resultado.entrega.recompensa_centavos)}</strong></p>
          {resultado.entrega.remuneracao_catador_centavos !== undefined && (
            <p>Remuneração do catador: <strong>{reais(resultado.entrega.remuneracao_catador_centavos)}</strong></p>
          )}
        </div>
      )}
    </section>
  );
}
