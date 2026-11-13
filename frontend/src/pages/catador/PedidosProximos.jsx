import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS, NOMES_STATUS } from '../../utils/formatar.js';

export default function PedidosProximos() {
  const [proximos, setProximos] = useState([]);
  const [minhas, setMinhas] = useState([]);
  const [codigos, setCodigos] = useState({});
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  async function carregar() {
    setErro('');
    try {
      setProximos((await api('/pedidos/proximos')).pedidos);
      setMinhas((await api('/pedidos/minhas-coletas')).pedidos);
    } catch (e) { setErro(e.message); }
  }
  useEffect(() => { carregar(); }, []);

  async function acao(caminho, corpo, sucesso) {
    setErro(''); setMsg('');
    try { await api(caminho, { metodo: 'POST', corpo }); setMsg(sucesso); carregar(); } catch (e) { setErro(e.message); }
  }

  const resumo = (p) => p.materiais_estimados.map((m) => `${NOMES_MATERIAIS[m.material]} ${m.quantidade_kg} kg`).join(', ');

  return (
    <section>
      <h1>Pedidos de coleta</h1>
      {erro && <p className="erro" role="alert">{erro}</p>}
      {msg && <p className="ok" role="status">{msg}</p>}

      <h2>Perto de você</h2>
      {proximos.length === 0 && <p>Nenhum pedido aberto no momento.</p>}
      <ul className="lista">
        {proximos.map((p) => (
          <li key={p.id} className="cartao">
            <strong>#{p.id} · {p.bairro}</strong>
            <span>{resumo(p)} · {p.janela_horario}</span>
            <button className="botao" type="button" onClick={() => acao(`/pedidos/${p.id}/aceitar`, null, 'Pedido aceito! O endereço aparece em “Minhas coletas”.')}>Aceitar</button>
          </li>
        ))}
      </ul>

      <h2>Minhas coletas</h2>
      <ul className="lista">
        {minhas.map((p) => (
          <li key={p.id} className="cartao">
            <strong>#{p.id} · {NOMES_STATUS[p.status]}</strong>
            <span>{p.endereco} · {p.janela_horario}</span>
            <span>{resumo(p)}</span>
            {p.status === 'aceito' && (
              <>
                <label htmlFor={`cod-${p.id}`}>Código do QR do morador</label>
                <input id={`cod-${p.id}`} value={codigos[p.id] || ''} onChange={(e) => setCodigos({ ...codigos, [p.id]: e.target.value })} />
                <div className="acoes">
                  <button className="botao" type="button" onClick={() => acao(`/pedidos/${p.id}/coletar`, { codigo: codigos[p.id] }, 'Coleta confirmada. Leve ao ponto para pesagem.')}>Confirmar coleta</button>
                  <button className="botao secundario" type="button" onClick={() => acao(`/pedidos/${p.id}/recusar`, null, 'Pedido devolvido.')}>Desistir</button>
                </div>
              </>
            )}
            {p.status === 'coletado' && <small>Informe o pedido #{p.id} no ponto de coleta para a pesagem.</small>}
          </li>
        ))}
      </ul>
    </section>
  );
}
