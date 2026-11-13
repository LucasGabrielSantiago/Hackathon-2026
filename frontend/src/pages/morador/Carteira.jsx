import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import WalletBalance from '../../components/wallet/WalletBalance.jsx';
import TransactionList from '../../components/wallet/TransactionList.jsx';
import QRCodeDisplay from '../../components/qr/QRCodeDisplay.jsx';

export default function Carteira() {
  const [carteira, setCarteira] = useState(null);
  const [kg, setKg] = useState(0);
  const [qr, setQr] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api('/carteira').then(setCarteira).catch((e) => setErro(e.message));
    api('/entregas/minhas').then((d) => setKg(d.entregas.reduce((s, e) => s + e.peso_total_gramas, 0) / 1000)).catch(() => {});
  }, []);

  async function gerarQr() {
    setErro('');
    try { setQr(await api('/entregas/qrcode', { metodo: 'POST' })); } catch (e) { setErro(e.message); }
  }

  return (
    <>
      <h1 className="titulo-1">Carteira</h1>
      <WalletBalance centavos={carteira?.saldo_centavos} kg={kg} extra={<span>Resgate em breve</span>} />
      <Alert tipo="aviso" titulo="Valores demonstrativos">{carteira?.aviso || 'Os créditos ainda não podem ser resgatados.'}</Alert>
      {qr ? <QRCodeDisplay codigo={qr.codigo} validade={qr.expira_em} /> : (
        <div className="rp-card">
          <p className="rp-card-titulo">Entregar num ponto de coleta</p>
          <p className="rp-card-texto">Gere o código e mostre ao operador na hora da pesagem.</p>
          <button className="rp-btn rp-btn-primario" type="button" onClick={gerarQr}>Gerar QR Code</button>
        </div>
      )}
      {erro && <Alert tipo="erro" titulo="Algo deu errado">{erro}</Alert>}
      <h2 className="secao">Extrato</h2>
      {carteira && carteira.extrato.length === 0 && <EmptyState titulo="Sua carteira está vazia" texto="Entregue seus recicláveis num ponto de coleta para ganhar os primeiros créditos." />}
      {carteira && carteira.extrato.length > 0 && <TransactionList transacoes={carteira.extrato} />}
    </>
  );
}
