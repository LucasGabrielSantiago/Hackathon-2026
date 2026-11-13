const ETAPAS = [['aberto', 'Pedido'], ['aceito', 'Aceito'], ['coletado', 'Coletado'], ['entregue', 'Entregue']];

export default function RecyclingProgress({ status }) {
  const atual = ETAPAS.findIndex(([s]) => s === status);
  return (
    <div className="rp-progresso" aria-label={`Etapa atual: ${ETAPAS[atual]?.[1] || status}`}>
      {ETAPAS.map(([s, rotulo], i) => (
        <span key={s} className={`rp-progresso-etapa${i <= atual ? ' rp-progresso-feito' : ''}`}>{rotulo}</span>
      ))}
    </div>
  );
}
