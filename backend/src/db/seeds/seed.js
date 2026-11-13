// Dados DEMONSTRATIVOS (fictícios). Devem aparecer marcados como demonstração na interface.
const municipios = [
  { id: 1, nome: 'Recife', estado: 'PE', codigo_ibge: '2611606', iniciativa: 'Recicla Recife' },
  { id: 2, nome: 'Olinda', estado: 'PE', codigo_ibge: '2609600', iniciativa: null },
];

const bairros = [
  { id: 1, municipio_id: 1, nome: 'Boa Viagem' },
  { id: 2, municipio_id: 1, nome: 'Arruda' },
  { id: 3, municipio_id: 1, nome: 'São José' },
  { id: 4, municipio_id: 1, nome: 'Casa Amarela' },
  { id: 5, municipio_id: 2, nome: 'Peixinhos' },
];

// Preços fictícios em centavos por kg (seção 7 do CONTEXT.md)
const materiais = [
  { id: 1, nome: 'metal', categoria: 'Alumínio', preco_kg_centavos: 500, ativo: true },
  { id: 2, nome: 'plastico', categoria: 'PET/PEAD', preco_kg_centavos: 150, ativo: true },
  { id: 3, nome: 'papel', categoria: 'Papel/papelão', preco_kg_centavos: 50, ativo: true },
  { id: 4, nome: 'vidro', categoria: 'Vidro', preco_kg_centavos: 20, ativo: true },
];

const pontos = [
  { id: 1, usuario_id: 3, nome: 'Ponto Demo Boa Viagem', endereco: 'Endereço demonstrativo', bairro_id: 1, latitude: -8.1196, longitude: -34.9012, horario: 'Seg a Sáb, 8h–17h', materiais_aceitos: ['metal', 'plastico', 'papel', 'vidro'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 2, usuario_id: null, nome: 'Ponto Demo Arruda', endereco: 'Endereço demonstrativo', bairro_id: 2, latitude: -8.0277, longitude: -34.8889, horario: 'Seg a Sex, 8h–16h', materiais_aceitos: ['metal', 'plastico'], modalidade: 'compra', aprovado: true, demo: true },
  { id: 3, usuario_id: null, nome: 'Ponto Demo São José', endereco: 'Endereço demonstrativo', bairro_id: 3, latitude: -8.0716, longitude: -34.8781, horario: 'Todos os dias, 7h–19h', materiais_aceitos: ['metal', 'plastico', 'papel'], modalidade: 'doacao', aprovado: true, demo: true },
];

// Usuários de demonstração (senha de todos: demo1234)
const usuarios = [
  { id: 1, nome: 'Admin Demo', email: 'admin@reciclape.demo', telefone: '', perfil: 'admin' },
  { id: 2, nome: 'Morador Demo', email: 'morador@reciclape.demo', telefone: '', perfil: 'morador' },
  { id: 3, nome: 'Ponto Demo', email: 'ponto@reciclape.demo', telefone: '', perfil: 'ponto' },
  { id: 4, nome: 'Catador Demo', email: 'catador@reciclape.demo', telefone: '', perfil: 'catador' },
];

const moradores = [{ id: 1, usuario_id: 2, endereco: 'Endereço demonstrativo', bairro_id: 1, latitude: -8.12, longitude: -34.90 }];
const catadores = [{ id: 1, usuario_id: 4, cooperativa_id: null, raio_atuacao_km: 5, bairros: [1, 3], materiais: ['metal', 'plastico', 'papel'], disponivel: true, aprovado: true }];

module.exports = { municipios, bairros, materiais, pontos, usuarios, moradores, catadores, SENHA_DEMO: 'demo1234' };
