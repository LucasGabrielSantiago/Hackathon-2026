FRONTEND_DESIGN.md — RECICLA PE
Documento oficial de especificação visual e funcional do Front-end do Recicla PE.

Este documento orienta desenvolvedores e ferramentas de IA na construção das interfaces do sistema.

Antes de desenvolver qualquer tela, consultar também o CONTEXT.md na raiz do projeto.

1. IDENTIDADE VISUAL DO PROJETO
1.1. Identidade

Nome: Recicla PE

Programa de incentivo: Bolsa Reciclagem

Conceito ambiental: Canal Limpo

Slogan: Reciclar gera renda. Cuidar transforma cidades.

Símbolo: três setas da reciclagem formando um ciclo (tons de verde #168548, #116437 e #1F9D57) com uma folha azul (#168AAD) no centro, unindo reciclagem, ecologia e a água dos canais.
Arquivos: frontend/public/logo.svg (com folha, para cabeçalho, documentação e marcador do mapa) e frontend/public/favicon.svg (só as setas, legível em 16 px).
Não usar o símbolo sobre fundo verde escuro sem uma área branca ao redor.

1.2. Objetivo visual

O Recicla PE deve transmitir:

Sustentabilidade.
Tecnologia.
Confiança.
Inclusão social.
Modernidade.
Transparência financeira.
Responsabilidade ambiental.

A interface deve ser simples o suficiente para qualquer pessoa utilizar, independentemente de sua familiaridade com tecnologia.

1.3. Paleta de cores
Cor	Código	Aplicação
Verde principal	#168548	Botões e elementos principais
Verde escuro	#116437	Cabeçalhos e destaques
Verde claro	#E7F5EC	Fundos e cards
Azul	#168AAD	Água e indicadores ambientais
Azul claro	#E7F4FA	Informações secundárias
Branco	#FFFFFF	Fundo principal
Cinza claro	#F4F6F5	Fundo de seções
Cinza escuro	#27332D	Textos
Vermelho	#DC4545	Erros e alertas
Amarelo	#F2B544	Avisos e pendências
1.4. Tipografia

Preferência:

Inter.
Poppins para títulos, se já estiver disponível no projeto.
Fontes com boa legibilidade em dispositivos móveis.
1.5. Elementos visuais

Utilizar:

Ícones intuitivos.
Cards com bordas arredondadas.
Sombras discretas.
Botões de fácil identificação.
Gráficos simples.
Mapas interativos.
Ilustrações relacionadas à reciclagem.
Indicadores de progresso.
Feedback visual de ações.

Evitar:

Excesso de cores.
Animações desnecessárias.
Telas muito carregadas.
Textos excessivamente pequenos.
Botões sem função.
Informações financeiras confusas.
2. DIRETRIZES GERAIS DO FRONT-END
2.1. Responsividade

O sistema deve funcionar em:

Smartphones Android.
iPhones.
Tablets.
Notebooks.
Computadores desktop.

A prioridade é o desenvolvimento mobile-first.

Resoluções de referência:

Dispositivo	Largura
Celular pequeno	320px
Celular padrão	375px
Celular grande	430px
Tablet	768px
Notebook	1366px
Desktop	1920px
2.2. Navegação

A navegação deve mudar conforme o perfil autenticado.

Perfis:

Morador.
Catador.
Cooperativa.
Ponto de coleta.
Administrador.
Gestor público.
Empresa parceira.

Não apresentar menus de administração para moradores.

2.3. Componentes reutilizáveis

Criar componentes compartilhados:

text
components/
├── layout/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── BottomNavigation.jsx
│   ├── Footer.jsx
│   └── PageContainer.jsx
│
├── common/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Modal.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Loading.jsx
│   ├── EmptyState.jsx
│   └── Alert.jsx
│
├── dashboard/
│   ├── StatCard.jsx
│   ├── ImpactCard.jsx
│   ├── ChartCard.jsx
│   └── ActivityList.jsx
│
├── recycling/
│   ├── MaterialCard.jsx
│   ├── ClassificationResult.jsx
│   ├── MaterialPrice.jsx
│   └── RecyclingProgress.jsx
│
├── map/
│   ├── CollectionMap.jsx
│   ├── CollectionPointCard.jsx
│   └── MapFilters.jsx
│
├── wallet/
│   ├── WalletBalance.jsx
│   ├── TransactionList.jsx
│   └── TransactionCard.jsx
│
└── qr/
    ├── QRScanner.jsx
    └── QRCodeDisplay.jsx

3. TELAS PÚBLICAS
TELA 01 — Página inicial

Rota: /

Objetivo: apresentar a plataforma e incentivar o cadastro.

Estrutura visual
Header com logotipo Recicla PE.
Menu institucional.
Banner principal.
Texto de apresentação.
Botões de cadastro e login.
Seção Como funciona.
Seção Bolsa Reciclagem.
Indicadores ambientais.
Seção para catadores.
Seção para empresas parceiras.
Rodapé institucional.
Banner principal

Título:

Reciclar gera renda. Cuidar transforma cidades.

Descrição:

Separe seus recicláveis, encontre pontos de coleta ou solicite a retirada em casa e receba recompensas pela sua participação.

Botões:

Começar agora.
Como funciona.
Referência visual
text
┌──────────────────────────────────┐
│ ♻ RECICLA PE      Entrar  Criar  │
├──────────────────────────────────┤
│                                  │
│  RECICLAR GERA RENDA             │
│  CUIDAR TRANSFORMA CIDADES       │
│                                  │
│  Transforme seus recicláveis     │
│  em oportunidades.               │
│                                  │
│  [ COMEÇAR AGORA ]               │
│                                  │
│      [Ilustração ambiental]      │
│                                  │
├──────────────────────────────────┤
│       COMO FUNCIONA              │
│                                  │
│  📸 Identifique                  │
│  📍 Encontre                     │
│  💰 Receba                       │
│                                  │
├──────────────────────────────────┤
│      BOLSA RECICLAGEM            │
│      Reciclar também gera renda  │
└──────────────────────────────────┘

TELA 02 — Login

Rota: /login

Componentes
Logotipo.
Campo e-mail ou telefone.
Campo senha.
Botão entrar.
Link recuperar senha.
Link criar conta.
Mensagens de validação.
Referência visual
text
┌──────────────────────────────────┐
│                                  │
│          ♻ RECICLA PE            │
│                                  │
│        Bem-vindo de volta!       │
│                                  │
│  E-mail ou telefone              │
│  [________________________]      │
│                                  │
│  Senha                           │
│  [________________________]      │
│                                  │
│  Esqueceu sua senha?             │
│                                  │
│  [          ENTRAR          ]    │
│                                  │
│  Não possui conta? Cadastre-se   │
│                                  │
└──────────────────────────────────┘

TELA 03 — Cadastro

Rota: /cadastro

Campos
Nome completo.
E-mail.
Telefone.
Senha.
Confirmar senha.
Município.
Bairro.
Endereço.
Perfil de usuário.
Aceite dos termos.
Perfis disponíveis
Morador.
Catador.
Cooperativa.
Ponto de coleta.

A seleção de perfil deve direcionar para o formulário complementar correspondente.

4. ÁREA DO MORADOR
TELA

> ⚠️ **Documento incompleto:** a partir da seção 4 (Área do Morador) o conteúdo ainda precisa ser colado aqui.
