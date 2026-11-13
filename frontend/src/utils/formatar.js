export function reais(centavos = 0) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const NOMES_MATERIAIS = { plastico: 'Plástico', metal: 'Metal', vidro: 'Vidro', papel: 'Papel/papelão' };

export const NOMES_STATUS = { aberto: 'Aguardando catador', aceito: 'Catador a caminho', coletado: 'Coletado', entregue: 'Entregue no ponto', cancelado: 'Cancelado' };
