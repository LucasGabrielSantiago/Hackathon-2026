import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loading from '../../components/common/Loading.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { reais } from '../../utils/formatar.js';

export default function Entregas() {
  const [entregas, setEntregas] = useState(null);
  const [erro, setErro] = useState('');
  useEffect(() => { api('/entregas/ponto').then((d) => setEntregas(d.entregas.slice().reverse())).catch((e) => { setErro(e.message); setEntregas([]); }); }, []);

  const kg = (entregas || []).reduce((s, e) => s + e.peso_total_gramas, 0) / 1000;

  return (
    <>
      <h1 className="titulo-1">Entregas recebidas</h1>
      {erro && <Alert tipo="erro" titulo="Não foi possível carregar">{erro}</Alert>}
      {entregas === null ? <Loading /> : (
        <>
          <div className="grade-2">
            <StatCard rotulo="Entregas" valor={entregas.length} />
            <StatCard rotulo="Kg recebidos" valor={kg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} />
          </div>
          {entregas.length === 0 ? <EmptyState titulo="Nenhuma entrega ainda" texto="As pesagens confirmadas aparecem aqui." /> : (
            <ul className="rp-atividade">
              {entregas.map((e) => (
                <li key={e.id}>
                  <span>Entrega #{e.id}{e.pedido_id ? ` · pedido #${e.pedido_id}` : ''}<small>{new Date(e.criado_em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} · {(e.peso_total_gramas / 1000).toLocaleString('pt-BR')} kg</small></span>
                  <span className="rp-credito">{reais(e.recompensa_centavos)}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
