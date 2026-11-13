import { reais } from '../../utils/formatar.js';

export default function WalletBalance({ rotulo = 'Saldo Bolsa Reciclagem', centavos, kg, extra }) {
  return (
    <div className="rp-saldo">
      <span className="rp-saldo-rotulo">{rotulo}</span>
      <span className="rp-saldo-valor">{centavos === null || centavos === undefined ? '…' : reais(centavos)}</span>
      <div className="rp-saldo-rodape">
        <span>{kg !== undefined ? `${kg.toLocaleString('pt-BR')} kg reciclados` : ''}</span>
        {extra}
      </div>
    </div>
  );
}
