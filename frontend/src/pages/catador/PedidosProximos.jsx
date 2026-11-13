import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loading from '../../components/common/Loading.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export const resumoMateriais = (p) => p.materiais_estimados.map((m) => `${NOMES_MATERIAIS[m.material]} ${m.quantidade_kg} kg`).join(' · ');

export default function PedidosProximos() {
  const [proximos, setProximos] = useState(null);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = () => api('/pedidos/proximos').then((d) => setProximos(d.pedidos)).catch((e) => { setErro(e.message); setProximos([]); });
  useEffect(() => { carregar(); }, []);

  async function aceitar(id) {
    setErro(''); setMsg('');
    try { await api(`/pedidos/${id}/aceitar`, { metodo: 'POST' }); setMsg('O endereço aparece em Minhas coletas.'); carregar(); } catch (e) { setErro(e.message); }
  }

  return (
    <>
      <h1 className="titulo-1">Pedidos perto de você</h1>
      {erro && <Alert tipo="erro" titulo="Algo deu errado">{erro}</Alert>}
      {msg && <Alert tipo="sucesso" titulo="Pedido aceito">{msg} <Link to="/catador/coletas">Ver coletas</Link></Alert>}
      {proximos === null ? <Loading /> : proximos.length === 0 ? (
        <EmptyState titulo="Nenhum pedido aberto agora" texto="Quando um morador do seu bairro pedir coleta, ele aparece aqui." />
      ) : (
        <div className="pilha">
          {proximos.map((p) => (
            <div key={p.id} className="rp-card">
              <div className="entre"><p className="rp-card-titulo">#{p.id} · {p.bairro}</p><Badge tipo="aviso">Aberto</Badge></div>
              <p className="rp-card-texto">{resumoMateriais(p)}</p>
              <p className="rp-card-texto">{p.janela_horario}</p>
              <button className="rp-btn rp-btn-primario rp-btn-bloco" type="button" onClick={() => aceitar(p.id)}>Aceitar coleta</button>
            </div>
          ))}
        </div>
      )}
      <p className="apoio">O endereço completo só aparece depois que você aceita.</p>
    </>
  );
}
