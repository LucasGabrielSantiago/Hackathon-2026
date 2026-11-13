import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import WalletBalance from '../../components/wallet/WalletBalance.jsx';
import TransactionList from '../../components/wallet/TransactionList.jsx';

export default function Ganhos() {
  const [carteira, setCarteira] = useState(null);
  useEffect(() => { api('/carteira').then(setCarteira).catch(() => {}); }, []);
  return (
    <>
      <h1 className="titulo-1">Meus ganhos</h1>
      <WalletBalance rotulo="Remuneração por coletas" centavos={carteira?.saldo_centavos} extra={<span>R$ 0,80 por kg entregue</span>} />
      <Alert tipo="aviso" titulo="Valores demonstrativos">Sua remuneração de coletor é separada da recompensa do morador.</Alert>
      <h2 className="secao">Extrato</h2>
      {carteira && carteira.extrato.length === 0 && <EmptyState titulo="Nenhum ganho ainda" texto="Conclua uma coleta e leve ao ponto para receber." />}
      {carteira && carteira.extrato.length > 0 && <TransactionList transacoes={carteira.extrato} />}
    </>
  );
}
