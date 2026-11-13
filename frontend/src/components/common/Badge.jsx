// Selo de status: a cor nunca fala sozinha, sempre há texto.
export default function Badge({ tipo = 'neutro', children }) {
  return <span className={`rp-selo rp-selo-${tipo}`}>{children}</span>;
}

const STATUS_PEDIDO = {
  aberto: ['aviso', 'Aguardando catador'],
  aceito: ['info', 'Catador a caminho'],
  coletado: ['neutro', 'Coletado'],
  entregue: ['sucesso', 'Entregue no ponto'],
  cancelado: ['erro', 'Cancelado'],
};

export function StatusPedido({ status }) {
  const [tipo, texto] = STATUS_PEDIDO[status] || ['neutro', status];
  return <Badge tipo={tipo}>{texto}</Badge>;
}
