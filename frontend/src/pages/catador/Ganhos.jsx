import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import AvisoDemo from '../../components/AvisoDemo.jsx';
import { reais } from '../../utils/formatar.js';

export default function Ganhos() {
  const [carteira, setCarteira] = useState(null);
  useEffect(() => { api('/carteira').then(setCarteira).catch(() => {}); }, []);
  return (
    <section>
      <h1>Meus ganhos</h1>
      <div className="cartao destaque"><span>Remuneração por coletas</span><strong>{carteira ? reais(carteira.saldo_centavos) : '…'}</strong></div>
      <AvisoDemo>Valores demonstrativos. A remuneração do catador é separada da recompensa do morador.</AvisoDemo>
      <ul className="lista">
        {carteira?.extrato.map((t) => (
          <li key={t.id} className="cartao linha">
            <span>Entrega #{t.entrega_id}<br /><small>{new Date(t.criado_em).toLocaleString('pt-BR')}</small></span>
            <strong className="ok">+ {reais(t.valor_centavos)}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
