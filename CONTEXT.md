CONTEXT.md — RECICLA PE
Documento central de contexto do projeto. Deve ser consultado por qualquer IA ou desenvolvedor antes de implementar, modificar ou refatorar funcionalidades.
1. IDENTIDADE DO PROJETO
Nome oficial

Recicla PE

Conceito original

Canal Limpo.

Programa de incentivo financeiro

Bolsa Reciclagem.

Indicador de impacto

Índice Canal Limpo.

Slogan

Reciclar gera renda. Cuidar transforma cidades.

Descrição

O Recicla PE é uma plataforma digital de incentivo à reciclagem que conecta moradores, catadores, cooperativas, pontos de coleta, empresas privadas e órgãos públicos.

A plataforma permite identificar materiais recicláveis por fotografia utilizando inteligência artificial, localizar pontos de coleta, solicitar coleta em casa, registrar pesagens e gerar recompensas financeiras aos cidadãos.

O projeto tem como objetivo reduzir o descarte irregular de resíduos, fortalecer a economia circular, valorizar os catadores e contribuir para a melhoria ambiental dos municípios pernambucanos.

Origem

Projeto desenvolvido pela Equipe 2 no desafio Antena na Lama, durante o Hackathon APONTI Academy: Devs Criam com IA — REC'n'Play 2026.

Caminho escolhido: Prevenir e cuidar.

2. VISÃO E OBJETIVOS
Visão

Construir uma plataforma de referência em economia circular, reciclagem e inclusão produtiva em Pernambuco.

Começar pelo Recife, expandir para a Região Metropolitana e, futuramente, alcançar outros municípios do estado.

Objetivos principais
Facilitar o descarte correto de materiais recicláveis.
Incentivar financeiramente a participação dos moradores.
Gerar oportunidades de trabalho e renda para catadores.
Fortalecer cooperativas e pontos de coleta.
Conectar empresas e poder público à cadeia de reciclagem.
Utilizar inteligência artificial para educação ambiental.
Gerar dados para acompanhamento de resultados ambientais.
Contribuir para a redução do descarte irregular em ruas, canais e rios.
Problema que queremos resolver

Na Região Metropolitana do Recife, o descarte inadequado de resíduos contribui para a poluição urbana, entupimento de galerias, canais e rios e agravamento de problemas de alagamento.

Parte da população enfrenta dificuldades para separar materiais, encontrar pontos de coleta e transportar recicláveis.

Ao mesmo tempo, catadores e cooperativas enfrentam desafios relacionados à renda, infraestrutura e acesso a oportunidades.

O Recicla PE busca conectar esses participantes por meio da tecnologia e de incentivos econômicos.

3. IDENTIDADE E NOMENCLATURA

É obrigatório manter a seguinte nomenclatura em todo o sistema:

Nome	Significado
Recicla PE	Plataforma principal
Canal Limpo	Conceito ambiental original
Bolsa Reciclagem	Programa de incentivo financeiro
Índice Canal Limpo	Indicadores de impacto socioambiental

Não utilizar Bolsa Reciclagem como nome principal do aplicativo.

Não utilizar Recicla Recife como nome definitivo da plataforma estadual.

A plataforma deve ser desenvolvida considerando a possibilidade de expansão para diferentes municípios.

O município e o bairro devem ser dados configuráveis, nunca informações fixas no código.

4. PÚBLICOS E PERFIS DE ACESSO

O sistema deverá possuir controle de acesso baseado em perfis (RBAC).

4.1. MORADOR

É o cidadão que deseja descartar materiais recicláveis e receber recompensas.

Permissões:

Criar conta.
Fazer login.
Editar seus dados.
Fotografar resíduos.
Utilizar classificação por IA.
Consultar instruções de descarte.
Consultar valores estimados.
Visualizar pontos de coleta.
Solicitar coleta em casa.
Acompanhar pedidos.
Consultar carteira digital.
Consultar extrato.
Visualizar histórico de entregas.
Acompanhar indicadores pessoais de reciclagem.
4.2. CATADOR

É o profissional autônomo ou vinculado a uma cooperativa que realiza coleta e trabalha com materiais recicláveis.

Permissões:

Criar cadastro.
Informar área de atuação.
Informar bairros atendidos.
Informar materiais coletados.
Informar disponibilidade.
Visualizar pedidos próximos.
Aceitar ou recusar pedidos.
Iniciar coleta.
Confirmar coleta.
Acompanhar remuneração.
Consultar histórico.
Solicitar cadastro de ponto próprio de coleta.

O catador deve passar por aprovação administrativa antes de acessar funcionalidades operacionais.

4.3. COOPERATIVA

Organização responsável pelo recebimento, triagem, armazenamento e comercialização de materiais recicláveis.

Permissões:

Gerenciar cadastro institucional.
Gerenciar seus integrantes, conforme autorização.
Cadastrar pontos de recebimento.
Registrar pesagens.
Registrar materiais recebidos.
Consultar histórico de entregas.
Consultar relatórios.
Acompanhar valores de comercialização.
4.4. PONTO DE COLETA

Pode ser:

Ecoestação.
Cooperativa.
Comércio parceiro.
Associação comunitária.
Ponto independente de catador.

Permissões:

Receber materiais.
Identificar entregas.
Registrar peso por material.
Confirmar recebimento.
Gerar registros de entrega.
Consultar histórico.
Consultar materiais aceitos.

Todo ponto deve possuir endereço, localização e aprovação administrativa.

4.5. EMPRESA PARCEIRA

Organização que patrocina campanhas, financia incentivos, compra materiais ou participa de iniciativas de logística reversa.

Funcionalidades planejadas:

Visualizar campanhas.
Acompanhar orçamento de patrocínio.
Consultar indicadores agregados.
Acompanhar materiais recuperados.
Consultar relatórios socioambientais.
Acompanhar utilização dos recursos destinados às campanhas.

Não permitir acesso a dados pessoais de moradores sem autorização e fundamento legal.

4.6. ADMINISTRADOR

Responsável pela gestão da plataforma.

Permissões:

Gerenciar usuários.
Aprovar catadores.
Aprovar cooperativas.
Aprovar pontos de coleta.
Gerenciar materiais.
Gerenciar preços por quilograma.
Gerenciar campanhas.
Gerenciar patrocinadores.
Consultar entregas.
Consultar transações.
Gerar relatórios.
Gerenciar configurações.
Acompanhar indicadores.
4.7. GESTOR PÚBLICO

Perfil planejado para representantes de prefeituras e órgãos estaduais.

Permissões:

Consultar indicadores do município autorizado.
Visualizar dados agregados por bairro.
Acompanhar quantidade de materiais recuperados.
Consultar pontos de coleta.
Consultar relatórios.
Acompanhar campanhas públicas.

O gestor público não deve ter acesso administrativo irrestrito ao sistema.

5. REGRAS FUNDAMENTAIS DO NEGÓCIO

Estas regras são obrigatórias e devem ser respeitadas em toda implementação.

Regra 1 — A IA não determina pagamentos

A inteligência artificial apenas identifica materiais e fornece estimativas.

O valor definitivo depende da pesagem real.

Regra 2 — Toda recompensa precisa de uma entrega validada

Nenhum crédito pode ser gerado apenas pela classificação de uma fotografia.

É obrigatório existir uma entrega registrada e validada.

Regra 3 — O peso real é a referência financeira

O valor da recompensa será calculado utilizando o peso registrado no ponto de coleta.

Regra 4 — O catador recebe pelo trabalho

A remuneração do catador deve ser independente da recompensa destinada ao morador.

Não reduzir automaticamente o pagamento profissional do catador para financiar o cashback do morador.

Regra 5 — QR Code não pode ser reutilizado

Cada código de validação deve possuir identificador único e controle de utilização.

Códigos inválidos, expirados ou já utilizados não podem gerar créditos.

Regra 6 — Toda transação precisa de histórico

As operações financeiras devem ser registradas em um livro de transações.

Não alterar diretamente o saldo sem registrar a operação correspondente.

Regra 7 — Pontos de coleta precisam de aprovação

Um ponto não aprovado não pode aparecer como ponto oficial ativo no mapa.

Regra 8 — Catadores precisam de aprovação

Cadastros pendentes não podem receber pedidos operacionais.

Regra 9 — O sistema deve permitir expansão geográfica

Não limitar o projeto ao Recife.

Todos os registros geográficos devem permitir identificação de município, bairro e localização.

Regra 10 — Segurança e privacidade

Aplicar princípios da LGPD, controle de acesso, proteção de credenciais e minimização de dados pessoais.

6. FLUXOS PRINCIPAIS
6.1. Classificação de resíduos
Morador acessa a área de classificação.
Fotografa um material.
A imagem é enviada ao back-end.
O back-end consulta a API multimodal.
A IA identifica o material provável.
O sistema apresenta classificação, orientações e nível de confiança.
O aplicativo mostra o preço de referência por quilograma.
O usuário pode encontrar pontos de coleta ou solicitar coleta.

Materiais iniciais:

Plástico.
Metal.
Vidro.
Papel e papelão.

A classificação deve considerar que nem todo objeto feito desses materiais é necessariamente reciclável em qualquer estrutura de coleta.

6.2. Entrega direta
Morador encontra um ponto de coleta.
Solicita ou apresenta um QR Code de identificação da entrega.
O ponto identifica o morador.
O operador registra o peso por material.
O sistema calcula os valores.
O operador confirma a entrega.
O sistema registra a transação.
A carteira recebe o crédito correspondente.
6.3. Coleta em casa
Morador informa os materiais.
Informa quantidade estimada.
Informa endereço.
Escolhe uma janela de horário.
Sistema disponibiliza o pedido para catadores próximos.
Catador aceita.
Catador realiza a coleta.
Material é encaminhado para ponto autorizado.
Ponto registra a pesagem.
Sistema calcula a remuneração e a recompensa.
Carteiras recebem os créditos correspondentes.
6.4. Cadastro de ponto próprio
Catador solicita cadastro.
Informa nome e endereço.
Informa localização.
Informa horário.
Informa materiais aceitos.
Informa modalidade de recebimento: doação ou compra.
Administrador avalia.
Após aprovação, o ponto aparece no mapa.
7. BOLSA RECICLAGEM

A Bolsa Reciclagem é o programa de incentivo financeiro do Recicla PE.

Seu objetivo é estimular a participação da população na coleta seletiva.

Valores demonstrativos
Material	Preço fictício por kg
Alumínio	R$ 5,00
Plástico PET/PEAD	R$ 1,50
Papel/papelão	R$ 0,50
Vidro	R$ 0,20

Os valores devem ser armazenados no banco de dados e gerenciados pelo administrador.

Nunca deixar preços financeiros importantes fixos em componentes do front-end.

Fórmula de cálculo

Valor bruto:

valor = peso_kg × preco_por_kg

Exemplo:

Material: alumínio.
Peso: 2 kg.
Preço: R$ 5,00/kg.
Valor: R$ 10,00.
Carteira digital

A carteira deve possuir:

Saldo disponível.
Histórico de créditos.
Histórico de débitos.
Identificação da entrega.
Data da transação.
Tipo de transação.
Status.
Origem do recurso.
Regras financeiras
Utilizar valores monetários com precisão decimal.
Evitar cálculos financeiros com ponto flutuante sem controle de precisão.
Registrar transações de forma auditável.
Impedir duplicidade de créditos.
Implementar idempotência nas operações de confirmação.
Não permitir saldo negativo, salvo se uma regra formal futura justificar.
Separar créditos demonstrativos de créditos reais.
Formas futuras de utilização
Pix.
Cupons.
Descontos.
Benefícios de empresas parceiras.

A integração financeira real dependerá de estrutura e parceiros adequados.

8. MODELO DE FINANCIAMENTO

O projeto possui quatro fontes principais de financiamento:

Governo e prefeituras.
Empresas patrocinadoras.
Programas de logística reversa.
Comercialização de materiais recicláveis.
Distribuição demonstrativa de patrocínio

Exemplo de orçamento mensal de R$ 10.000:

Destinação	Valor
Recompensas dos moradores	R$ 5.000
Incentivos complementares aos catadores	R$ 2.000
Operação e logística	R$ 2.000
Educação ambiental	R$ 1.000

Esses números são apenas exemplos para simulação.

O sistema deverá permitir campanhas com orçamento, vigência, patrocinador e regras próprias.

Não considerar patrocínios como dinheiro efetivamente disponível antes da confirmação financeira.

9. PARCERIAS E EXPANSÃO

O Recicla PE deve ser desenvolvido pensando em integração com:

Governo de Pernambuco

Possíveis interlocutores:

Secretaria estadual responsável pelo meio ambiente.
Secretaria de Desenvolvimento Econômico.
CPRH.
Órgãos estaduais de inclusão produtiva.
Prefeitura do Recife

Possíveis interlocutores:

Emlurb.
Órgãos municipais de meio ambiente.
Secretarias de educação.
Secretarias de desenvolvimento social.
Áreas de inovação e tecnologia.
Empresas privadas

Potenciais parceiros para prospecção:

Neoenergia Pernambuco.
Heineken.
Coca-Cola.
Tetra Pak.
Ambipar.
Comércio local.
Indústrias recicladoras.

Nenhuma dessas instituições deve ser apresentada no sistema ou na documentação como parceira confirmada sem acordo formal.

Expansão territorial

Primeiro município: Recife.

Expansão planejada:

Olinda.
Jaboatão dos Guararapes.
Paulista.
Camaragibe.
São Lourenço da Mata.
Abreu e Lima.

O banco de dados deve permitir múltiplos municípios e bairros desde o início.

10. INTELIGÊNCIA ARTIFICIAL

A IA possui função auxiliar.

Funcionalidades
Classificação de materiais por fotografia.
Orientação sobre separação.
Orientação sobre limpeza e preparação.
Educação ambiental.
Estimativa de quantidade e valor.
Assistente virtual de reciclagem.
Regras para a integração
A chave da API fica exclusivamente no back-end.
Nunca expor chaves no front-end.
Validar tipo e tamanho dos arquivos.
Tratar erros e indisponibilidade da API.
Limitar tamanho das imagens.
Não aceitar respostas da IA como confirmação financeira.
Informar quando a classificação não for confiável.
Não armazenar imagens desnecessariamente.
Resposta esperada da classificação

Exemplo de estrutura:

json
{
  "material": "plastico",
  "categoria": "PET",
  "reciclavel": true,
  "confianca": 0.94,
  "orientacoes": [
    "Retire o líquido restante",
    "Enxágue a embalagem",
    "Separe a tampa conforme as regras locais"
  ],
  "observacao": "Confirme se o ponto de coleta aceita este material."
}


Essa estrutura é uma referência para a implementação, não uma resposta garantida do provedor de IA.

11. INDICADORES — ÍNDICE CANAL LIMPO

O sistema deverá disponibilizar indicadores ambientais, sociais e econômicos.

Indicadores ambientais
Quilogramas recuperados.
Quilogramas por material.
Quilogramas por bairro.
Quilogramas por município.
Pontos ativos.
Entregas realizadas.
Indicadores sociais
Moradores cadastrados.
Moradores ativos.
Catadores cadastrados.
Catadores ativos.
Cooperativas participantes.
Remuneração gerada para catadores.
Indicadores econômicos
Créditos distribuídos.
Recursos patrocinados.
Valores comercializados.
Custo operacional por quilograma.
Orçamento das campanhas.
Painel administrativo

Filtros:

Período.
Município.
Bairro.
Material.
Ponto de coleta.
Cooperativa.

Os dados exibidos como resultados reais devem vir do banco de dados.

Dados fictícios devem ser identificados visualmente como demonstração.

A plataforma não deve afirmar que determinada quantidade de reciclagem causou redução de alagamentos sem estudos e dados que sustentem essa conclusão.

12. ARQUITETURA TECNOLÓGICA

A arquitetura inicialmente planejada é:

Front-end
React 18.
Vite.
JavaScript ou TypeScript, conforme o padrão efetivamente adotado no repositório.
CSS responsivo.
Leaflet.
Biblioteca de QR Code.
Vitest.
React Testing Library.
Back-end
Node.js.
API REST.
Autenticação JWT.
Validação de dados.
Controle de acesso por perfil.
Integração com API multimodal.
Banco de dados

PostgreSQL.

Infraestrutura
GitHub.
GitHub Actions.
Vercel para front-end.
Render para back-end.

A IA deve verificar os arquivos existentes antes de alterar ou adicionar dependências.

Não substituir tecnologias já implementadas sem justificativa técnica e autorização.

13. MODELO DE DADOS

Entidades principais:

text
Usuario
- id
- nome
- email
- telefone
- senha_hash
- perfil
- criado_em

Municipio
- id
- nome
- estado
- codigo_ibge

Bairro
- id
- municipio_id
- nome

Morador
- id
- usuario_id
- endereco
- bairro_id
- latitude
- longitude

Catador
- id
- usuario_id
- cooperativa_id
- raio_atuacao_km
- bairros
- materiais
- disponivel
- aprovado

Cooperativa
- id
- nome
- cnpj
- endereco
- responsavel
- aprovado

PontoColeta
- id
- usuario_id
- cooperativa_id
- nome
- endereco
- bairro_id
- latitude
- longitude
- horario
- materiais_aceitos
- modalidade
- aprovado

Material
- id
- nome
- categoria
- preco_kg
- ativo

PedidoColeta
- id
- morador_id
- catador_id
- endereco
- janela_horario
- status
- qr_code

Entrega
- id
- morador_id
- catador_id
- ponto_id
- pedido_id
- status
- criado_em

ItemEntrega
- id
- entrega_id
- material_id
- peso_kg
- preco_aplicado
- valor

Carteira
- id
- usuario_id
- saldo

Transacao
- id
- usuario_id
- entrega_id
- campanha_id
- valor
- tipo
- status
- criado_em

Patrocinador
- id
- nome
- tipo
- status

Campanha
- id
- patrocinador_id
- nome
- orcamento
- inicio
- fim
- status


O modelo pode ser evoluído conforme as necessidades reais, mantendo integridade referencial e histórico financeiro.

14. SEGURANÇA

A segurança é requisito obrigatório.

Implementar:

Senhas com hash seguro.
JWT com expiração.
Controle de acesso por perfil.
Validação de todas as entradas.
Proteção de rotas.
Proteção de variáveis de ambiente.
Limitação de tentativas de autenticação.
Proteção contra duplicidade de transações.
Validação de QR Code.
Auditoria de operações administrativas.
Controle de acesso a endereços e dados pessoais.
Conformidade com princípios da LGPD.

Nunca:

Armazenar senhas em texto puro.
Expor tokens ou chaves secretas.
Permitir que o front-end determine valores financeiros.
Permitir que moradores alterem pesagens.
Permitir que usuários comuns aprovem seus próprios cadastros.
Creditar recompensas sem confirmação válida.
15. EXPERIÊNCIA DO USUÁRIO

O aplicativo deve ser:

Mobile-first.
Responsivo.
Simples de utilizar.
Acessível.
Visualmente moderno.
Adequado para pessoas com diferentes níveis de familiaridade digital.
Diretrizes visuais

Identidade visual sugerida:

Verde: sustentabilidade e reciclagem.
Azul: água, canais e cuidado ambiental.
Branco: clareza e simplicidade.
Cinza: elementos secundários.
Interface

Utilizar:

Cards objetivos.
Ícones intuitivos.
Botões com boa área de toque.
Formulários simples.
Mensagens claras.
Indicadores visuais de status.
Mapas fáceis de utilizar.
Feedback de carregamento e erros.

Evitar:

Telas excessivamente carregadas.
Textos longos em botões.
Informações financeiras ambíguas.
Funcionalidades sem ação real.
Dados fictícios apresentados como reais.
16. ESTRUTURA SUGERIDA DE TELAS
Área pública
Página inicial.
Apresentação do projeto.
Como funciona.
Benefícios da reciclagem.
Cadastro.
Login.
Área do morador
Dashboard.
Classificar resíduo.
Mapa de coleta.
Solicitar coleta.
Meus pedidos.
Carteira.
Extrato.
Histórico.
Meu impacto.
Área do catador
Dashboard.
Pedidos próximos.
Detalhes do pedido.
Minhas coletas.
Confirmar coleta.
Meus pontos.
Meus ganhos.
Histórico.
Área da cooperativa/ponto
Dashboard.
Receber entrega.
Registrar pesagem.
Consultar entregas.
Gerenciar materiais.
Relatórios.
Área administrativa
Dashboard geral.
Usuários.
Catadores.
Cooperativas.
Pontos.
Materiais.
Preços.
Entregas.
Transações.
Patrocinadores.
Campanhas.
Indicadores.
Configurações.
Área de parceiros públicos e privados
Painel institucional.
Indicadores agregados.
Campanhas.
Relatórios.
Acompanhamento de metas.
17. TESTES OBRIGATÓRIOS

Criar testes automatizados para:

Cadastro de usuário.
Autenticação.
Controle de acesso.
Cadastro de catador.
Aprovação de catador.
Cadastro de ponto.
Aprovação de ponto.
Classificação de materiais.
Cálculo de recompensa.
Registro de pesagem.
Validação de QR Code.
Transição de status dos pedidos.
Registro de transações.
Prevenção de créditos duplicados.
Separação de remuneração do catador e recompensa do morador.
Filtros de indicadores por município e bairro.
18. ROADMAP
Fase 1 — MVP

Prioridade máxima:

Cadastro e login.
Perfis de usuário.
Cadastro de catadores.
Cadastro de pontos.
Classificação de resíduos por IA.
Mapa de pontos.
Solicitação de coleta.
Registro de pesagem.
Cálculo demonstrativo de recompensas.
Carteira demonstrativa.
Painel administrativo.
Fase 2 — Operação piloto
Validação com cooperativas.
Testes em bairros selecionados.
QR Code operacional.
Integração financeira adequada.
Campanhas patrocinadas.
Relatórios de impacto.
Fase 3 — Parcerias
Integração institucional com prefeitura.
Prospecção de empresas.
Programas de logística reversa.
Painéis para parceiros.
Ampliação territorial.
Fase 4 — Expansão
Outros municípios.
Integração com políticas estaduais.
Resgate via Pix.
Mapa de descarte irregular.
Alertas ambientais.
Integração com equipamentos automatizados.
19. DIRETRIZES OBRIGATÓRIAS PARA A IA DE PROGRAMAÇÃO

Ao trabalhar neste projeto, siga rigorosamente estas orientações:

Antes de começar
Leia este arquivo CONTEXT.md.
Analise a estrutura atual do repositório.
Leia o package.json e as dependências existentes.
Identifique funcionalidades já implementadas.
Identifique funcionalidades incompletas.
Não recrie componentes que já existem.
Não altere tecnologias sem necessidade.
Durante o desenvolvimento
Preserve a identidade Recicla PE.
Respeite os perfis e permissões.
Implemente as regras de negócio descritas neste documento.
Mantenha front-end e back-end separados conforme a arquitetura existente.
Não coloque regras financeiras críticas exclusivamente no front-end.
Não simule integrações reais sem deixar explícito que são simulações.
Não invente dados de parceiros.
Não invente resultados ambientais.
Não exponha informações sensíveis.
Escreva código organizado, reutilizável e testável.
Ao implementar funcionalidades

Para cada funcionalidade:

Explique brevemente o que será implementado.
Identifique os arquivos envolvidos.
Verifique se existe implementação anterior.
Implemente a funcionalidade completa.
Crie ou atualize os testes.
Verifique os possíveis erros.
Atualize a documentação quando necessário.
Ao modificar o banco de dados
Preservar dados existentes.
Utilizar migrations.
Não apagar tabelas sem autorização.
Criar relacionamentos consistentes.
Garantir integridade financeira.
Registrar histórico das transações.
Ao finalizar cada tarefa

Informar:

O que foi implementado.
Quais arquivos foram modificados.
Quais dependências foram adicionadas.
Quais testes foram executados.
Quais problemas permanecem.
O que ainda precisa ser implementado.
Regra de prioridade

Se houver conflito entre uma sugestão da IA e as regras deste documento, prevalecem as regras de negócio deste documento.

Se uma decisão técnica importante não estiver definida, apresentar opções e solicitar confirmação antes de realizar mudanças estruturais.

20. PRINCÍPIO CENTRAL DO PROJETO

O Recicla PE não é apenas um aplicativo para localizar pontos de reciclagem.

É uma plataforma de conexão entre:

Pessoas que querem descartar corretamente.
Catadores que precisam de oportunidades e valorização.
Cooperativas que trabalham com reciclagem.
Empresas que precisam participar da economia circular.
Prefeituras que precisam melhorar a gestão dos resíduos.
Governo que pode incentivar políticas ambientais.

A tecnologia deve facilitar essa conexão, gerar transparência e permitir que os resultados sejam medidos.

RECICLA PE — Reciclar gera renda. Cuidar transforma cidades.

Documento de contexto do projeto. Manter atualizado conforme a evolução do produto.