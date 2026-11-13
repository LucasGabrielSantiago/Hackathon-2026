import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loading from '../../components/common/Loading.jsx';
import { StatusPedido } from '../../components/common/Badge.jsx';
import RecyclingProgress from '../../components/recycling/RecyclingProgress.jsx';
import { resumoMateriais } from './PedidosProximos.jsx';
import FotoPedido from '../../components/pedido/FotoPedido.jsx';

export default function MinhasColetas() {
  const [coletas, setColetas] = useState(null);
  const [codigos, setCodigos] = useState({});
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = () => api('/pedidos/minhas-coletas').then((d) => setColetas(d.pedidos.slice().reverse())).catch((e) => { setErro(e.message); setColetas([]); });
  useEffect(() => { carregar(); }, []);

  async function acao(caminho, corpo, sucesso) {
    setErro(''); setMsg('');
    try { await api(caminho, { metodo: 'POST', corpo }); setMsg(sucesso); carregar(); } catch (e) { setErro(e.message); }
  }

  return (
    <>
      <h1 className="titulo-1">Minhas coletas</h1>
      {erro && <Alert tipo="erro" titulo="Algo deu errado">{erro}</Alert>}
      {msg && <Alert tipo="sucesso" titulo="Pronto">{msg}</Alert>}
      {coletas === null ? <Loading /> : coletas.length === 0 ? (
        <EmptyState titulo="Você ainda não aceitou coletas" texto="Aceite um pedido na aba Pedidos." />
      ) : (
        <div className="pilha">
          {coletas.map((p) => (
            <div key={p.id} className="rp-card">
              <div className="entre"><p className="rp-card-titulo">Pedido #{p.id}</p><StatusPedido status={p.status} /></div>
              <RecyclingProgress status={p.status} />
              {p.tem_foto && <FotoPedido pedidoId={p.id} />}
              <p className="rp-card-texto"><b>{p.endereco}</b> · {p.janela_horario}</p>
              <p className="rp-card-texto">{resumoMateriais(p)}</p>
              {p.status === 'aceito' && (
                <>
                  <div className="rp-campo-grupo">
                    <label className="rp-rotulo" htmlFor={`cod-${p.id}`}>Código do QR do morador</label>
                    <input className="rp-campo" id={`cod-${p.id}`} autoCapitalize="characters" value={codigos[p.id] || ''} onChange={(e) => setCodigos({ ...codigos, [p.id]: e.target.value })} />
                  </div>
                  <button className="rp-btn rp-btn-primario rp-btn-bloco" type="button" disabled={!codigos[p.id]} onClick={() => acao(`/pedidos/${p.id}/coletar`, { codigo: codigos[p.id].trim() }, 'Coleta confirmada. Leve ao ponto para pesagem.')}>Confirmar coleta</button>
                  <button className="rp-btn rp-btn-fantasma rp-btn-bloco" type="button" onClick={() => acao(`/pedidos/${p.id}/recusar`, null, 'Pedido devolvido para outros catadores.')}>Desistir</button>
                </>
              )}
              {p.status === 'coletado' && <Alert tipo="info" titulo="Próximo passo">Informe o pedido #{p.id} no ponto de coleta para a pesagem.</Alert>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
