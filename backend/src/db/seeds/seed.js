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
  { id: 6, municipio_id: 1, nome: 'Várzea' },
  { id: 7, municipio_id: 1, nome: 'Torre' },
  { id: 8, municipio_id: 2, nome: 'Rio Doce' },
];

// Preços fictícios em centavos por kg (seção 7 do CONTEXT.md)
const materiais = [
  { id: 1, nome: 'metal', categoria: 'Alumínio', preco_kg_centavos: 500, ativo: true },
  { id: 2, nome: 'plastico', categoria: 'PET/PEAD', preco_kg_centavos: 150, ativo: true },
  { id: 3, nome: 'papel', categoria: 'Papel/papelão', preco_kg_centavos: 50, ativo: true },
  { id: 4, nome: 'vidro', categoria: 'Vidro', preco_kg_centavos: 20, ativo: true },
  { id: 5, nome: 'eletronico', categoria: 'Lixo eletrônico (celulares, cabos, carregadores)', preco_kg_centavos: 100, ativo: true },
  { id: 6, nome: 'outros', categoria: 'Outros recicláveis (embalagem longa vida, isopor limpo etc.)', preco_kg_centavos: 10, ativo: true },
];

const pontos = [
  { id: 1, usuario_id: 3, nome: 'Ponto Demo Boa Viagem', endereco: 'Endereço demonstrativo', bairro_id: 1, latitude: -8.1196, longitude: -34.9012, horario: 'Seg a Sáb, 8h–17h', materiais_aceitos: ['metal', 'plastico', 'papel', 'vidro'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 2, usuario_id: null, nome: 'Ponto Demo Arruda', endereco: 'Endereço demonstrativo', bairro_id: 2, latitude: -8.0277, longitude: -34.8889, horario: 'Seg a Sex, 8h–16h', materiais_aceitos: ['metal', 'plastico'], modalidade: 'compra', aprovado: true, demo: true },
  { id: 3, usuario_id: null, nome: 'Ponto Demo São José', endereco: 'Endereço demonstrativo', bairro_id: 3, latitude: -8.0716, longitude: -34.8781, horario: 'Todos os dias, 7h–19h', materiais_aceitos: ['metal', 'plastico', 'papel'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 4, usuario_id: null, nome: 'Ponto Demo Casa Amarela', endereco: 'Endereço demonstrativo', bairro_id: 4, latitude: -8.0275, longitude: -34.9172, horario: 'Seg a Sex, 8h–17h', materiais_aceitos: ['plastico', 'papel', 'vidro', 'outros'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 5, usuario_id: null, nome: 'Ecoponto Eletrônico Demo Torre', endereco: 'Endereço demonstrativo', bairro_id: 7, latitude: -8.0498, longitude: -34.9105, horario: 'Seg a Sáb, 9h–18h', materiais_aceitos: ['eletronico'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 6, usuario_id: null, nome: 'Cooperativa Demo Várzea', endereco: 'Endereço demonstrativo', bairro_id: 6, latitude: -8.0465, longitude: -34.9598, horario: 'Seg a Sex, 7h–16h', materiais_aceitos: ['metal', 'plastico', 'papel', 'vidro', 'outros'], modalidade: 'compra', aprovado: true, demo: true },
  { id: 7, usuario_id: null, nome: 'Ponto Demo Peixinhos', endereco: 'Endereço demonstrativo', bairro_id: 5, latitude: -8.0228, longitude: -34.8716, horario: 'Ter a Sáb, 8h–15h', materiais_aceitos: ['metal', 'plastico', 'papel'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 8, usuario_id: null, nome: 'Ecoponto Eletrônico Demo Rio Doce', endereco: 'Endereço demonstrativo', bairro_id: 8, latitude: -7.9930, longitude: -34.8440, horario: 'Seg a Sex, 8h–17h', materiais_aceitos: ['eletronico', 'metal'], modalidade: 'doacao', aprovado: true, demo: true },
  { id: 9, usuario_id: 6, nome: 'Ponto do Severino (aguardando aprovação)', endereco: 'Endereço demonstrativo', bairro_id: 3, latitude: -8.0740, longitude: -34.8800, horario: 'Sáb, 8h–12h', materiais_aceitos: ['metal', 'plastico'], modalidade: 'compra', aprovado: false, demo: true },
];

// Usuários de demonstração (senha de todos: demo1234)
const usuarios = [
  { id: 1, nome: 'Admin Demo', email: 'admin@reciclape.demo', telefone: '', perfil: 'admin' },
  { id: 2, nome: 'Morador Demo', email: 'morador@reciclape.demo', telefone: '', perfil: 'morador' },
  { id: 3, nome: 'Ponto Demo', email: 'ponto@reciclape.demo', telefone: '', perfil: 'ponto' },
  { id: 4, nome: 'Catador Demo', email: 'catador@reciclape.demo', telefone: '', perfil: 'catador' },
  { id: 5, nome: 'Josefa (coletora demo)', email: 'josefa@reciclape.demo', telefone: '', perfil: 'catador' },
  { id: 6, nome: 'Severino (coletor demo)', email: 'severino@reciclape.demo', telefone: '', perfil: 'catador' },
  { id: 7, nome: 'Rita (coletora demo, aguardando aprovação)', email: 'rita@reciclape.demo', telefone: '', perfil: 'catador' },
  { id: 8, nome: 'Maria (moradora demo)', email: 'maria@reciclape.demo', telefone: '', perfil: 'morador' },
  { id: 9, nome: 'João (morador demo)', email: 'joao@reciclape.demo', telefone: '', perfil: 'morador' },
  { id: 10, nome: 'Ana (moradora demo)', email: 'ana@reciclape.demo', telefone: '', perfil: 'morador' },
  { id: 11, nome: 'Carlos (morador demo)', email: 'carlos@reciclape.demo', telefone: '', perfil: 'morador' },
];

const moradores = [
  { id: 1, usuario_id: 2, endereco: 'Endereço demonstrativo', bairro_id: 1, latitude: -8.12, longitude: -34.90 },
  { id: 2, usuario_id: 8, endereco: 'Endereço demonstrativo', bairro_id: 1, latitude: null, longitude: null },
  { id: 3, usuario_id: 9, endereco: 'Endereço demonstrativo', bairro_id: 3, latitude: null, longitude: null },
  { id: 4, usuario_id: 10, endereco: 'Endereço demonstrativo', bairro_id: 4, latitude: null, longitude: null },
  { id: 5, usuario_id: 11, endereco: 'Endereço demonstrativo', bairro_id: 7, latitude: null, longitude: null },
];

// "Catador" no código = coletor(a) de recicláveis na interface.
const catadores = [
  { id: 1, usuario_id: 4, cooperativa_id: null, raio_atuacao_km: 5, bairros: [1, 3], materiais: ['metal', 'plastico', 'papel', 'eletronico', 'outros'], disponivel: true, aprovado: true },
  { id: 2, usuario_id: 5, cooperativa_id: null, raio_atuacao_km: 4, bairros: [4, 6, 7], materiais: ['plastico', 'papel', 'vidro', 'outros'], disponivel: true, aprovado: true },
  { id: 3, usuario_id: 6, cooperativa_id: null, raio_atuacao_km: 6, bairros: [1, 3, 7], materiais: ['metal', 'eletronico'], disponivel: true, aprovado: true },
  { id: 4, usuario_id: 7, cooperativa_id: null, raio_atuacao_km: 3, bairros: [5, 8], materiais: ['plastico', 'metal'], disponivel: true, aprovado: false },
];

// Pedidos de coleta em casa AGUARDANDO RETIRADA, cada um com a foto dos materiais (pasta fotos/).
const pedidos = [
  { morador_usuario_id: 8, bairro_id: 1, janela_horario: 'Manhã (8h–12h)', foto: 'plastico.jpg', materiais_estimados: [{ material: 'plastico', quantidade_kg: 3 }] },
  { morador_usuario_id: 9, bairro_id: 3, janela_horario: 'Tarde (13h–17h)', foto: 'metal.jpg', materiais_estimados: [{ material: 'metal', quantidade_kg: 2 }] },
  { morador_usuario_id: 10, bairro_id: 4, janela_horario: 'Manhã (8h–12h)', foto: 'papel.jpg', materiais_estimados: [{ material: 'papel', quantidade_kg: 5 }] },
  { morador_usuario_id: 10, bairro_id: 4, janela_horario: 'Tarde (13h–17h)', foto: 'vidro.jpg', materiais_estimados: [{ material: 'vidro', quantidade_kg: 4 }] },
  { morador_usuario_id: 11, bairro_id: 7, janela_horario: 'Noite (18h–20h)', foto: 'eletronico.jpg', materiais_estimados: [{ material: 'eletronico', quantidade_kg: 1.5 }] },
  { morador_usuario_id: 8, bairro_id: 1, janela_horario: 'Tarde (13h–17h)', foto: 'misto.jpg', materiais_estimados: [{ material: 'plastico', quantidade_kg: 1 }, { material: 'metal', quantidade_kg: 1 }, { material: 'papel', quantidade_kg: 1 }] },
];

module.exports = { municipios, bairros, materiais, pontos, usuarios, moradores, catadores, pedidos, SENHA_DEMO: 'demo1234' };
