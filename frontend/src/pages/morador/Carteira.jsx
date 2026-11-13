import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api.js';
import AvisoDemo from '../../components/AvisoDemo.jsx';
import { reais } from '../../utils/formatar.js';

const ORIGENS = { bolsa_reciclagem: 'Bolsa Reciclagem', remuneracao_catador: 'Remuneração de coleta', resgate: 'Resgate' };

export default function Carteira() {
  const [carteira, setCarteira] = useState(null);
  const [qr, setQr] = useState(null);
  const [erro, setErro] = useState('');

  const carregar = () => api('/carteira').then(setCarteira).catch((e) => setErro(e.message));
  useEffect(() => { carregar(); }, []);

  async function gerarQr() {
    setErro('');
    try { setQr(await api('/entregas/qrcode', { metodo: 'POST' })); } catch (e) { setErro(e.message); }
  }

  return (
    <section>
      <h1>Carteira</h1>
      <div className="cartao destaque"><span>Saldo Bolsa Reciclagem</span><strong>{carteira ? reais(carteira.saldo_centavos) : '…'}</strong></div>
      <AvisoDemo>{carteira?.aviso || 'Créditos demonstrativos.'}</AvisoDemo>

      <div className="cartao">
        <h2>Entregar no ponto</h2>
        <p>Gere o código e mostre ao operador do ponto na hora da pesagem.</p>
        <button className="botao" type="button" onClick={gerarQr}>Gerar QR Code</button>
        {qr && (
          <div className="qr">
            <QRCodeSVG value={qr.codigo} size={180} />
            <code>{qr.codigo}</code>
            <small>Válido até {new Date(qr.expira_em).toLocaleTimeString('pt-BR')}</small>
          </div>
        )}
        {erro && <p className="erro" role="alert">{erro}</p>}
      </div>

      <h2>Extrato</h2>
      {carteira?.extrato.length === 0 && <p>Nenhuma movimentação ainda.</p>}
      <ul className="lista">
        {carteira?.extrato.map((t) => (
          <li key={t.id} className="cartao linha">
            <span>{ORIGENS[t.origem] || t.origem}<br /><small>{new Date(t.criado_em).toLocaleString('pt-BR')}</small></span>
            <strong className={t.tipo === 'credito' ? 'ok' : 'erro'}>{t.tipo === 'credito' ? '+' : '−'} {reais(t.valor_centavos)}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
