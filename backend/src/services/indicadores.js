// Índice Canal Limpo — indicadores agregados (sem dados pessoais).
function calcularIndicadores(db, { municipioId, bairroId, inicio, fim } = {}) {
  const bairroDoPonto = (pontoId) => db.bairros.find((b) => b.id === db.pontos.find((p) => p.id === pontoId)?.bairro_id);

  const entregas = db.entregas.filter((e) => {
    const bairro = bairroDoPonto(e.ponto_id);
    if (municipioId && bairro?.municipio_id !== municipioId) return false;
    if (bairroId && bairro?.id !== bairroId) return false;
    if (inicio && e.criado_em < inicio) return false;
    if (fim && e.criado_em > fim) return false;
    return true;
  });
  const ids = new Set(entregas.map((e) => e.id));
  const itens = db.itensEntrega.filter((i) => ids.has(i.entrega_id));

  const kgPorMaterial = {};
  itens.forEach((i) => { kgPorMaterial[i.material] = (kgPorMaterial[i.material] || 0) + i.peso_gramas / 1000; });

  const kgPorBairro = {};
  entregas.forEach((e) => {
    const nome = bairroDoPonto(e.ponto_id)?.nome || 'Sem bairro';
    kgPorBairro[nome] = (kgPorBairro[nome] || 0) + e.peso_total_gramas / 1000;
  });

  const transacoesEntregas = db.transacoes.filter((t) => ids.has(t.entrega_id));
  const soma = (origem) => transacoesEntregas.filter((t) => t.origem === origem).reduce((s, t) => s + t.valor_centavos, 0);

  return {
    ambientais: {
      kg_recuperados: entregas.reduce((s, e) => s + e.peso_total_gramas, 0) / 1000,
      kg_por_material: kgPorMaterial,
      kg_por_bairro: kgPorBairro,
      entregas: entregas.length,
      pontos_ativos: db.pontos.filter((p) => p.aprovado).length,
    },
    sociais: {
      moradores_cadastrados: db.usuarios.filter((u) => u.perfil === 'morador').length,
      moradores_ativos: new Set(entregas.map((e) => e.morador_usuario_id)).size,
      catadores_cadastrados: db.catadores.length,
      catadores_ativos: new Set(entregas.map((e) => e.catador_usuario_id).filter(Boolean)).size,
      remuneracao_catadores_centavos: soma('remuneracao_catador'),
    },
    economicos: {
      creditos_distribuidos_centavos: soma('bolsa_reciclagem'),
    },
  };
}

module.exports = { calcularIndicadores };
