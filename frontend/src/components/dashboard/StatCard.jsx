export default function StatCard({ rotulo, valor, variacao }) {
  return (
    <div className="rp-stat">
      <span className="rp-stat-rotulo">{rotulo}</span>
      <span className="rp-stat-valor">{valor}</span>
      {variacao && <span className="rp-stat-variacao">{variacao}</span>}
    </div>
  );
}
