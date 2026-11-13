import { reais } from '../../utils/formatar.js';

const ORIGENS = { bolsa_reciclagem: 'Bolsa Reciclagem', remuneracao_catador: 'Remuneração de coleta', resgate: 'Resgate' };

export default function TransactionList({ transacoes }) {
  return (
    <div className="rp-card" style={{ padding: '4px 16px' }}>
      {transacoes.map((t) => (
        <div key={t.id} className="rp-transacao">
          <span className="rp-transacao-texto">
            {ORIGENS[t.origem] || t.origem}
            <small>{t.entrega_id ? `Entrega #${t.entrega_id} · ` : ''}{new Date(t.criado_em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</small>
          </span>
          <span className={t.tipo === 'credito' ? 'rp-credito' : 'rp-debito'}>{t.tipo === 'credito' ? '+' : '−'} {reais(t.valor_centavos)}</span>
        </div>
      ))}
    </div>
  );
}
