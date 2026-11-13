import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { reais } from '../../utils/formatar.js';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [saldo, setSaldo] = useState(null);
  const [kg, setKg] = useState(0);

  useEffect(() => {
    api('/carteira').then((d) => setSaldo(d.saldo_centavos)).catch(() => {});
    api('/entregas/minhas').then((d) => setKg(d.entregas.reduce((s, e) => s + e.peso_total_gramas, 0) / 1000)).catch(() => {});
  }, []);

  return (
    <section>
      <h1>Olá, {usuario?.nome?.split(' ')[0]}!</h1>
      <div className="grade">
        <div className="cartao destaque"><span>Bolsa Reciclagem</span><strong>{saldo === null ? '…' : reais(saldo)}</strong></div>
        <div className="cartao destaque azul-fundo"><span>Meu impacto</span><strong>{kg.toLocaleString('pt-BR')} kg</strong><small>que não foram para o canal</small></div>
      </div>
      <div className="grade">
        <Link className="cartao atalho" to="/morador/classificar">📸 Classificar resíduo</Link>
        <Link className="cartao atalho" to="/morador/mapa">🗺️ Pontos de coleta</Link>
        <Link className="cartao atalho" to="/morador/coleta">🚚 Pedir coleta em casa</Link>
        <Link className="cartao atalho" to="/morador/carteira">👛 Carteira e QR Code</Link>
      </div>
    </section>
  );
}
