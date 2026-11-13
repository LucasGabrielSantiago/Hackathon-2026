// Fala de quilos entregues; nunca afirma redução de alagamento.
export default function ImpactCard({ kg }) {
  return (
    <div className="rp-impacto">
      <span className="rp-impacto-valor">{kg.toLocaleString('pt-BR')} kg</span>
      <span className="rp-impacto-texto">de recicláveis que você entregou e não foram parar no canal</span>
    </div>
  );
}
