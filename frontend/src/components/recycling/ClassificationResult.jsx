import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

export default function ClassificationResult({ resultado, preco }) {
  if (!resultado.material) {
    return (
      <div className="rp-resultado" aria-live="polite">
        <p className="rp-card-titulo">Não identificamos o material</p>
        <p className="rp-card-texto">{resultado.observacao}</p>
      </div>
    );
  }
  const pct = Math.round(resultado.confianca * 100);
  return (
    <div className="rp-resultado" aria-live="polite">
      <div className="entre">
        <p className="rp-card-titulo">{NOMES_MATERIAIS[resultado.material]}{resultado.categoria ? ` · ${resultado.categoria}` : ''}</p>
        {resultado.reciclavel ? <Badge tipo="sucesso">Reciclável</Badge> : <Badge tipo="erro">Não reciclável</Badge>}
      </div>
      <div>
        <div className="entre apoio"><span>Confiança{resultado.fonte === 'reserva' ? ' (sem IA)' : ' da IA'}</span><b style={{ color: 'var(--cinza-900)' }}>{pct}%</b></div>
        <div className="rp-confianca"><div style={{ width: `${pct}%` }} /></div>
      </div>
      {resultado.orientacoes.length > 0 && <ol className="rp-passos">{resultado.orientacoes.map((o) => <li key={o}>{o}</li>)}</ol>}
      {preco && resultado.reciclavel && (
        <p className="rp-card-texto">Referência: <b style={{ color: 'var(--verde-700)' }}>{reais(preco.preco_kg_centavos)}/kg</b>. O valor final sai da pesagem no ponto.</p>
      )}
      <p className="rp-card-texto">{resultado.observacao}</p>
      <div className="linha">
        <Link className="rp-btn rp-btn-primario" style={{ flex: 1 }} to="/morador/mapa">Ver pontos</Link>
        <Link className="rp-btn rp-btn-secundario" style={{ flex: 1 }} to="/morador/coleta">Pedir coleta</Link>
      </div>
    </div>
  );
}
