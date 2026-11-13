const SIMBOLO = { sucesso: '✓', erro: '!', aviso: '!', info: 'i' };
const COR = {
  sucesso: { background: 'var(--verde-500)', color: 'var(--branco)' },
  erro: { background: 'var(--vermelho-500)', color: 'var(--branco)' },
  aviso: { background: 'var(--amarelo-500)', color: 'var(--cinza-900)' },
  info: { background: 'var(--azul-500)', color: 'var(--branco)' },
};

// tipo: sucesso | erro | aviso | info
export default function Alert({ tipo = 'info', titulo, children }) {
  const role = tipo === 'erro' ? 'alert' : 'status';
  return (
    <div className={`rp-alerta rp-alerta-${tipo}`} role={role}>
      <span className="rp-icone" style={COR[tipo]} aria-hidden="true">{SIMBOLO[tipo]}</span>
      <div>{titulo && <b>{titulo}</b>}{children}</div>
    </div>
  );
}
