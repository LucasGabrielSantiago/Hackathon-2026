import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import Icon from '../../components/common/Icon.jsx';
import WalletBalance from '../../components/wallet/WalletBalance.jsx';
import ImpactCard from '../../components/dashboard/ImpactCard.jsx';
import { StatusPedido } from '../../components/common/Badge.jsx';
import { reais } from '../../utils/formatar.js';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [saldo, setSaldo] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    api('/carteira').then((d) => setSaldo(d.saldo_centavos)).catch(() => {});
    api('/entregas/minhas').then((d) => setEntregas(d.entregas)).catch(() => {});
    api('/pedidos/meus').then((d) => setPedidos(d.pedidos)).catch(() => {});
  }, []);

  const kg = entregas.reduce((s, e) => s + e.peso_total_gramas, 0) / 1000;
  const atividades = [
    ...entregas.map((e) => ({ id: `e${e.id}`, quando: e.criado_em, titulo: `Entrega no ${e.ponto || 'ponto'}`, valor: <span className="rp-credito">+ {reais(e.recompensa_centavos)}</span> })),
    ...pedidos.map((p) => ({ id: `p${p.id}`, quando: p.criado_em, titulo: `Pedido de coleta #${p.id}`, valor: <StatusPedido status={p.status} /> })),
  ].sort((a, b) => (a.quando < b.quando ? 1 : -1)).slice(0, 4);

  return (
    <>
      <h1 className="titulo-2">Olá, {usuario?.nome?.split(' ')[0]}</h1>
      <WalletBalance centavos={saldo} kg={kg} extra={<Link to="/morador/carteira" style={{ color: 'var(--verde-50)' }}>Ver extrato</Link>} />
      <ImpactCard kg={kg} />
      <h2 className="secao">O que você quer fazer?</h2>
      <div className="grade-2">
        <Link className="atalho" to="/morador/classificar"><Icon name="camera" />Classificar resíduo</Link>
        <Link className="atalho" to="/morador/mapa"><Icon name="pin" />Pontos de coleta</Link>
        <Link className="atalho" to="/morador/coleta"><Icon name="truck" />Pedir coleta em casa</Link>
        <Link className="atalho" to="/morador/carteira?gerar=1"><Icon name="scan" />Gerar QR Code</Link>
      </div>
      {atividades.length > 0 && (
        <>
          <h2 className="secao">Atividade recente</h2>
          <ul className="rp-atividade">
            {atividades.map((a) => (
              <li key={a.id}><span>{a.titulo}<small>{new Date(a.quando).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</small></span>{a.valor}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
