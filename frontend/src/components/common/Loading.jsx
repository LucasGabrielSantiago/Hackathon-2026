export default function Loading({ texto = 'Carregando…' }) {
  return (
    <div className="pilha" role="status" style={{ alignItems: 'center', padding: 'var(--espaco-6)' }}>
      <div className="rp-spinner" />
      <span className="sr-only">{texto}</span>
    </div>
  );
}
