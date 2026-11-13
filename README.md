# ♻️ Recicla PE

<p align="center"><img src="frontend/public/logo.svg" alt="Logo Recicla PE" width="90" /></p>

> **Reciclar gera renda. Cuidar transforma cidades.**
> Solução do desafio **Antena na Lama** — Hackathon APONTI Academy: Devs Criam com IA (REC'n'Play 2026)
> **Equipe 2** · Caminho escolhido: **Prevenir e cuidar**

🔗 **App (Vercel):** https://hackathon-2026-theta-eight.vercel.app
🔗 **API (Render):** https://recicla-pe-api.onrender.com/api/health
🚀 Como publicar: [docs/DEPLOY.md](./docs/DEPLOY.md)
🎥 **Demo / Pitch:** `<inserir-link>`

| Nome | O que é |
|---|---|
| **Recicla PE** | A plataforma (pensada para todo o estado de Pernambuco) |
| **Recicla Recife** | A iniciativa no primeiro município piloto |
| **Bolsa Reciclagem** | O programa de incentivo financeiro (créditos por kg) |
| **Índice Canal Limpo** | Os indicadores de impacto socioambiental |

📘 O contexto completo do projeto (regras de negócio, perfis, modelo de dados) está no **[CONTEXT.md](./CONTEXT.md)**. A especificação visual está em **[docs/FRONTEND_DESIGN.md](./docs/FRONTEND_DESIGN.md)**.

---

## 🗂️ Cartão da Ideia

| Campo | Resposta |
|---|---|
| **Equipe** | Equipe 2: Ícalo Ricardo, Lucas Gabriel Santiago, Maria Lucília e Niedja Brasil · Validador: Caio B. Alves |
| **Caminho** | Prevenir e cuidar |
| **Nossa ideia em uma frase** | Criamos um aplicativo que facilita o descarte adequado do lixo reciclável para toda a população, com recompensa por kg e coleta em casa feita por catadores cadastrados. |
| **Público principal** | Toda a população da Região Metropolitana do Recife |
| **O que ouvimos do validador** | A grande quantidade de lixo descartado no meio ambiente traz consequências predatórias para o próprio ambiente, e falta local disponível para o descarte adequado. Com isso, o descarte inadequado contribui para os alagamentos. |
| **Dados que vamos usar** | Referência: o sistema de coleta e reciclagem da Noruega (retorno de embalagens com recompensa). Dados fictícios para a demonstração; fontes públicas em pesquisa (Prefeitura do Recife/Emlurb, ecoestações). |
| **Indicador de resultado** | Quantidade de lixo coletado por bairro, mês a mês — o **Índice Canal Limpo**. |

---

## 🌧️ O problema

Na Região Metropolitana do Recife, o lixo descartado de forma irregular entope galerias, canais e rios e piora os alagamentos. Só em 2026 a Emlurb já tirou mais de 21 mil toneladas de lixo de 40 canais do Recife.

Boa parte da população não sabe separar o lixo, não tem um ponto de entrega perto e não vê vantagem em separar. Ao mesmo tempo, os catadores enfrentam baixa renda e pouco acesso a oportunidades.

## 💡 A solução

O **Recicla PE** conecta moradores, catadores, pontos de coleta e poder público:

1. 📸 O morador **fotografa o resíduo** e a IA diz qual é o material, se é reciclável e como preparar.
2. 🗺️ Ele **entrega num ponto de coleta** do mapa ou **pede a coleta em casa** para um catador cadastrado.
3. ⚖️ O ponto **pesa o material** e confirma a entrega por QR Code.
4. 💰 O morador recebe créditos da **Bolsa Reciclagem**, e o catador recebe **sua remuneração à parte**.
5. 📊 Tudo vira dado no **Índice Canal Limpo**, por bairro e por município.

O catador também pode **cadastrar o próprio ponto de coleta**, recebendo doações ou comprando material.

> Lixo no lugar certo não vai parar no canal.

---

## 👥 Perfis no MVP

| Perfil | O que faz |
|---|---|
| **Morador** | Classifica resíduos, vê o mapa, pede coleta, gera QR Code de entrega, acompanha a carteira |
| **Catador** | Vê pedidos próximos (após aprovação), aceita, confirma a coleta, cadastra ponto próprio, acompanha ganhos |
| **Ponto de coleta** | Registra a pesagem e confirma a entrega |
| **Admin** | Aprova catadores e pontos, gerencia preços e vê o Índice Canal Limpo |

Planejados (Fase 2+): cooperativa, empresa parceira e gestor público.

---

## 🏗️ Estrutura do repositório

```
├── CONTEXT.md              # contexto e regras do projeto (ler primeiro)
├── CONTRIBUTING.md         # como contribuir
├── SECURITY.md             # política de segurança
├── docker-compose.yml      # ambiente local com Docker
├── render.yaml             # deploy da API no Render (infraestrutura como código)
├── docs/                   # arquitetura, regras, modelo de dados, roadmap, DevOps, design do front
├── .github/                # CI, DevSecOps e Dependabot
├── backend/                # Node.js + Express (API REST)
│   ├── src/
│   │   ├── app.js          # monta a API (usado pelos testes)
│   │   ├── server.js       # inicia o servidor
│   │   ├── config/         # variáveis de ambiente
│   │   ├── middlewares/    # JWT, perfis (RBAC), erros, limite de login
│   │   ├── routes/         # auth, pontos, catadores, pedidos, entregas, carteira, classificar, indicadores
│   │   ├── services/       # regras de negócio (recompensa, QR Code, status, transações, IA)
│   │   └── db/             # repositório em memória + seeds de demonstração
│   └── tests/              # node:test
└── frontend/               # React 18 + Vite
    └── src/
        ├── services/api.js # chamadas à API
        ├── context/        # login e perfil do usuário
        ├── components/     # Layout, Mapa, RotaProtegida, AvisoDemo
        ├── pages/          # publico/, morador/, catador/, ponto/, admin/
        └── __tests__/      # Vitest + Testing Library
```

Detalhes em [docs/ARQUITETURA.md](./docs/ARQUITETURA.md).

| Camada | Tecnologia |
|---|---|
| Front-end | React 18, Vite, React Router 7, Leaflet (mapa), qrcode.react, CSS mobile-first acessível |
| Back-end | Node.js, Express, JWT, bcrypt, Multer (upload em memória) |
| Banco | Em memória no MVP (com seeds de demonstração) → PostgreSQL na Fase 2 |
| IA | API multimodal de visão (opcional) + classificador de reserva por texto |
| Testes | node:test (back-end) · Vitest + React Testing Library (front-end) |
| DevOps | Docker (multi-stage, não-root), Docker Compose, GitHub Actions, Gitflow |
| DevSecOps | Helmet, Gitleaks, npm audit, Hadolint, Trivy, CodeQL, Dependabot |
| Deploy | Vercel (front, `frontend/vercel.json`) · Render (API, `render.yaml`) |

---

## 🚀 Como rodar localmente

Pré-requisito: **Node.js 22.12+** (ou só o Docker Desktop, ver abaixo).
📗 Guia completo (clone de uma branch, Docker × sem Docker, Gitflow e problemas comuns): **[docs/DESENVOLVIMENTO.md](./docs/DESENVOLVIMENTO.md)**

### 0. Baixar o código
```bash
git clone https://github.com/LucasGabrielSantiago/Hackathon-2026.git
cd Hackathon-2026
git checkout develop

# ou só uma branch (ex.: a versão em produção):
git clone -b main --single-branch https://github.com/LucasGabrielSantiago/Hackathon-2026.git
```

### 1. Back-end
```bash
cd backend
npm install
cp .env.example .env        # Windows PowerShell: copy .env.example .env
npm run dev                 # http://localhost:3001/api/health
```

### 2. Front-end (outro terminal)
```bash
cd frontend
npm install
cp .env.example .env        # Windows PowerShell: copy .env.example .env
npm run dev                 # http://localhost:5173
```

### Com Docker

```bash
copy .env.example .env      # defina JWT_SECRET no .env
docker compose up --build   # app: http://localhost:8080 · API: http://localhost:3001/api/health
```

Containers sem root, somente leitura e com healthcheck. Detalhes em [docs/DEVOPS.md](./docs/DEVOPS.md) e [SECURITY.md](./SECURITY.md).

### Contas de demonstração

Senha de todas: `demo1234`

| Perfil | E-mail |
|---|---|
| Morador | morador@reciclape.demo |
| Catador (já aprovado) | catador@reciclape.demo |
| Ponto de coleta | ponto@reciclape.demo |
| Admin | admin@reciclape.demo |

> ⚠️ O MVP guarda os dados **em memória**: ao reiniciar o back-end, tudo volta ao estado inicial de demonstração.

### Roteiro de demonstração

1. **Morador**: Classificar → "latinha de refrigerante" → Carteira → **Gerar QR Code** (copie o código).
2. **Ponto**: Registrar pesagem → cole o código → Metal 2 kg → **Confirmar** → R$ 10,00 para o morador.
3. **Morador**: Pedir coleta em casa.
4. **Catador**: Aceitar o pedido → digitar o código do QR que aparece na tela "Pedir coleta" do morador → Confirmar coleta.
5. **Ponto**: Registrar pesagem → Coleta em casa → número do pedido → morador e catador recebem valores separados.
6. **Admin**: Índice Canal Limpo filtrado por município e bairro.

### Documentação

| Documento | Conteúdo |
|---|---|
| [CONTEXT.md](./CONTEXT.md) | Contexto, regras de negócio, perfis e modelo de dados |
| [docs/ARQUITETURA.md](./docs/ARQUITETURA.md) | Arquitetura, decisões e rotas da API |
| [docs/REGRAS_DE_NEGOCIO.md](./docs/REGRAS_DE_NEGOCIO.md) | Onde cada regra está implementada e testada |
| [docs/MODELO_DE_DADOS.md](./docs/MODELO_DE_DADOS.md) | Modelo de dados do MVP |
| [docs/FRONTEND_DESIGN.md](./docs/FRONTEND_DESIGN.md) | Especificação visual do front-end |
| [docs/DESENVOLVIMENTO.md](./docs/DESENVOLVIMENTO.md) | Clonar, rodar com e sem Docker, testar e abrir PR |
| [docs/DEVOPS.md](./docs/DEVOPS.md) | Gitflow, Docker e pipelines |
| [docs/DEPLOY.md](./docs/DEPLOY.md) | Passo a passo do deploy (Render + Vercel) |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Fases do projeto |
| [SECURITY.md](./SECURITY.md) | Política de segurança |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Como contribuir |

### Variáveis de ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `JWT_SECRET` | back-end | Segredo para assinar os tokens |
| `FRONTEND_URL` | back-end | Origens permitidas no CORS, separadas por vírgula (URL da Vercel em produção) |
| `AI_API_KEY` | back-end | Chave da API de IA (opcional; sem ela usa o classificador de reserva) |
| `AI_MODEL` | back-end | Modelo de IA usado na classificação |
| `CATADOR_CENTAVOS_POR_KG` | back-end | Remuneração demo do catador por kg |
| `VITE_API_URL` | front-end | URL da API (ex.: `https://<app>.onrender.com/api`) |

---

## 💸 Bolsa Reciclagem

`valor = peso_kg × preço_por_kg`, calculado **no back-end** com o peso registrado no ponto.

| Material | Preço por kg (fictício) |
|---|---|
| Alumínio | R$ 5,00 |
| Plástico PET/PEAD | R$ 1,50 |
| Papel/papelão | R$ 0,50 |
| Vidro | R$ 0,20 |

- A **remuneração do catador é separada** e não reduz a recompensa do morador.
- Todo crédito vem de uma **entrega validada** e fica registrado no **livro de transações**.
- QR Codes são de **uso único** e expiram.

**De onde viria o dinheiro:** governo e prefeituras, empresas patrocinadoras, programas de logística reversa e venda dos recicláveis pelas cooperativas. Empresas citadas no CONTEXT.md são **potenciais** parceiras, não parcerias confirmadas.

---

## 🤖 Onde a IA entra no produto

| Funcionalidade | Como funciona |
|---|---|
| **Classificação por foto** | A foto vai para o back-end, que consulta uma API multimodal e devolve material, se é reciclável, nível de confiança e como preparar |
| **Plano B** | Sem chave de API ou com a IA fora do ar, um classificador por palavras-chave responde a partir da descrição |
| **Educação ambiental** | Orientações em linguagem simples, inclusive para itens que **não** são recicláveis (ex.: caixa de pizza engordurada) |

**Cuidados:** a IA não confirma pagamento; a chave fica só no back-end; a imagem não é armazenada; resultados com baixa confiança mostram aviso.

---

## 📈 Índice Canal Limpo

Indicadores por município, bairro e material: kg recuperados, entregas, pontos ativos, moradores e catadores ativos, créditos distribuídos e renda gerada para catadores.

Como saber se funciona: comparar, mês a mês e bairro a bairro, o que chega pelo app com o que a coleta pública recolhe nas ruas e nos canais. **A redução de alagamentos é um impacto a ser medido ao longo do tempo, não algo que o app garante sozinho.**

---

## 🧪 Testes e CI

```bash
cd backend && npm test                      # 33 testes
cd frontend && npm test && npm run build    # 4 testes + build
```

O GitHub Actions roda os testes e o pipeline de DevSecOps (Gitleaks, `npm audit`, Hadolint, Trivy e CodeQL) a cada push e PR em `main` e `develop`.

| Área | O que é testado |
|---|---|
| Recompensa | valor = peso × preço, centavos sem erro de ponto flutuante, pesos inválidos |
| QR Code | uso único, expiração, tipo errado, códigos únicos |
| Pedidos | ordem aberto → aceito → coletado → entregue |
| Transações | saldo pelo livro, idempotência, sem saldo negativo |
| Classificação | reserva por texto, item não reciclável, normalização da resposta da IA |
| API | cadastro/login, perfis (RBAC), aprovação de catador e ponto, entrega direta, coleta em casa com valores separados, indicadores por município/bairro |
| Front-end | página inicial, rota protegida, acessibilidade do login, formatação em reais |

---

## 🧠 Uso de IA no desenvolvimento

> Seção exigida pelo edital: onde a IA foi usada e onde foi corrigida.

| Onde usamos | Ferramenta | O que foi gerado | O que corrigimos / validamos |
|---|---|---|---|
| Ideação, README e CONTEXT.md | Claude | Estrutura do documento, fluxos e modelo de dados | Ajustamos os fluxos com o validador, incluímos o ponto próprio do catador e separamos a remuneração do catador do cashback do morador |
| Estrutura inicial do projeto | Claude | Esqueleto do back-end (Express, services, testes) e do front-end (páginas por perfil) | `<preencher: o que a equipe revisou/corrigiu>` |
| Back-end | `<ferramenta>` | `<ex.: rotas de cadastro>` | `<ex.: faltava validação de perfil>` |
| Front-end | `<ferramenta>` | `<ex.: tela do mapa>` | `<ex.: layout quebrava no celular>` |
| Prompt de classificação | `<ferramenta>` | Prompt de visão | `<ex.: confundia vidro com plástico transparente>` |

---

## 🗣️ Validação com o validador

**Validador:** Caio B. Alves (Movimento Pró-Criança)

**O que ouvimos:** a grande quantidade de lixo descartado no meio ambiente traz consequências predatórias para o próprio ambiente, e falta local disponível para o descarte adequado do lixo. Com isso, o descarte inadequado contribui para os alagamentos.

**Como isso mudou a solução:**
- Além dos pontos de coleta, incluímos a **coleta em casa** pelos catadores, para quem não tem um ponto perto.
- Permitimos que o **catador crie o próprio ponto de coleta**, aumentando os locais de descarte nos bairros.

---

## 🔭 Próximos passos

Veja [docs/ROADMAP.md](./docs/ROADMAP.md): PostgreSQL, leitura de QR pela câmera, cooperativas e campanhas, painéis para prefeituras e empresas, resgate via Pix, mapa de descarte irregular e expansão para Olinda, Jaboatão, Paulista, Camaragibe, São Lourenço da Mata e Abreu e Lima.

---

## 👩‍💻 Equipe

**Equipe 2**

| Nome | Papel |
|---|---|
| Ícalo Ricardo | Desenvolvedor |
| Lucas Gabriel Santiago | DevOps / Testes |
| Maria Lucília | Desenvolvedora |
| Niedja Brasil | Desenvolvedora |
| Caio B. Alves | Validador — Movimento Pró-Criança |

---

<p align="center">Recicla PE · Hackathon APONTI Academy · REC'n'Play 2026 · Recife-PE</p>
