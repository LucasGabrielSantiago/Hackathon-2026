// Regras 1, 3 e 4 do CONTEXT.md.
// Todos os valores em CENTAVOS (inteiros) e pesos em GRAMAS (inteiros) para evitar erro de ponto flutuante.
const { ErroNegocio } = require('./erros');

function kgParaGramas(pesoKg) {
  const n = Number(pesoKg);
  if (!Number.isFinite(n) || n <= 0) throw new ErroNegocio('PESO_INVALIDO', 'Peso deve ser maior que zero.');
  if (n > 1000) throw new ErroNegocio('PESO_INVALIDO', 'Peso acima do limite de 1000 kg por item.');
  return Math.round(n * 1000);
}

// valor = peso_kg × preco_por_kg
function calcularValorItem(pesoGramas, precoKgCentavos) {
  if (!Number.isInteger(pesoGramas) || pesoGramas <= 0) throw new ErroNegocio('PESO_INVALIDO', 'Peso inválido.');
  if (!Number.isInteger(precoKgCentavos) || precoKgCentavos < 0) throw new ErroNegocio('PRECO_INVALIDO', 'Preço inválido.');
  return Math.round((pesoGramas * precoKgCentavos) / 1000);
}

// itens: [{ material: 'metal', peso_kg: 2 }]; materiais: tabela vinda do banco (nunca do front-end)
function calcularEntrega(itens, materiais) {
  if (!Array.isArray(itens) || itens.length === 0) throw new ErroNegocio('SEM_ITENS', 'Informe ao menos um material pesado.');
  const detalhados = itens.map((item) => {
    const material = materiais.find((m) => m.nome === item.material && m.ativo);
    if (!material) throw new ErroNegocio('MATERIAL_INVALIDO', `Material não aceito: ${item.material}`);
    const peso_gramas = kgParaGramas(item.peso_kg);
    return {
      material_id: material.id,
      material: material.nome,
      peso_gramas,
      preco_aplicado_centavos: material.preco_kg_centavos,
      valor_centavos: calcularValorItem(peso_gramas, material.preco_kg_centavos),
    };
  });
  const total_centavos = detalhados.reduce((s, i) => s + i.valor_centavos, 0);
  const peso_total_gramas = detalhados.reduce((s, i) => s + i.peso_gramas, 0);
  return { itens: detalhados, total_centavos, peso_total_gramas };
}

// Regra 4: remuneração do catador é calculada à parte e NÃO sai da recompensa do morador.
function calcularRemuneracaoCatador(pesoTotalGramas, centavosPorKg) {
  return calcularValorItem(pesoTotalGramas, centavosPorKg);
}

function formatarReais(centavos) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

module.exports = { kgParaGramas, calcularValorItem, calcularEntrega, calcularRemuneracaoCatador, formatarReais };
