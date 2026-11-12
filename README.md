# ♻️ Canal Limpo

> **Lixo no lugar certo não vai parar no canal.**
> Solução do desafio **Antena na Lama** — Hackathon APONTI Academy: Devs Criam com IA (REC'n'Play 2026)
> Caminho escolhido: **Prevenir e cuidar**

🔗 **Deploy:** `https://<inserir-url-do-deploy>`
🎥 **Demo / Pitch:** `<inserir-link>`

---

## 📌 Sumário

- [O problema](#-o-problema)
- [A solução](#-a-solução)
- [Perfis de usuário](#-perfis-de-usuário)
- [Fluxos principais](#-fluxos-principais)
- [Funcionalidades](#-funcionalidades)
- [Recompensa (cashback)](#-recompensa-cashback)
- [Onde a IA entra](#-onde-a-ia-entra)
- [Arquitetura e stack](#-arquitetura-e-stack)
- [Modelo de dados](#-modelo-de-dados)
- [Como rodar localmente](#-como-rodar-localmente)
- [Testes e CI](#-testes-e-ci)
- [Uso de IA no desenvolvimento](#-uso-de-ia-no-desenvolvimento)
- [Validação com o(a) validador(a)](#-validação-com-oa-validadora)
- [Próximos passos](#-próximos-passos)
- [Equipe](#-equipe)

---

## 🌧️ O problema

Na Região Metropolitana do Recife, todo ano a chuva forte vira alagamento, e um dos motivos é o **lixo descartado de forma irregular**, que entope galerias, canais e rios. Só em 2026 a Emlurb já tirou mais de 21 mil toneladas de lixo de 40 canais do Recife.

Boa parte dos moradores:

- **não sabe separar** o lixo (o que é reciclável, como preparar, o que tem valor);
- **não sabe onde entregar**, ou o ponto de coleta fica longe;
- **não vê vantagem** em separar e levar o lixo.

## 💡 A solução

O **Canal Limpo** é um app de celular (PWA) que **incentiva o morador a separar e entregar seus recicláveis**, com **recompensa em dinheiro/cashback por kg** de cada material.

O morador tem duas opções:

1. **Levar até um ponto de coleta** cadastrado; ou
2. **Pedir a coleta em casa** para um(a) **catador(a)/trabalhador(a) de material reciclável** cadastrado(a) na plataforma.

A IA ajuda o morador a **identificar e separar o resíduo por foto** e a **estimar o valor** antes da entrega.

> Cada quilo que chega no ponto de coleta é um quilo a menos no canal.

---

## 👥 Perfis de usuário

| Perfil | Quem é | O que faz no app |
|---|---|---|
| **Morador(a)** | Qualquer pessoa da RMR | Classifica o lixo com a IA, encontra pontos, entrega ou agenda coleta em casa e acumula cashback |
| **Catador(a) / Coletor(a)** | Trabalhador(a) de material reciclável, autônomo(a) ou de cooperativa | Recebe pedidos de coleta perto dele(a), busca na casa do morador, leva ao ponto e é remunerado(a) |
| **Ponto de coleta** | Ecoestação, cooperativa, comércio parceiro ou associação de bairro | Confere e pesa o material, confirma a entrega por QR code e libera o crédito |
| **Admin** | Equipe do projeto | Gerencia a tabela de preços por kg, aprova cadastros de pontos e catadores e acompanha os indicadores |

---

## 🔄 Fluxos principais

### 1. Entrega direta no ponto de coleta

```
Morador fotografa o resíduo
  → IA identifica o material (plástico, metal, vidro, papel) e explica como preparar
  → App mostra o valor estimado e os pontos de coleta mais próximos no mapa
  → Morador vai ao ponto e mostra seu QR code
  → Ponto pesa o material por tipo e registra no app
  → Cashback creditado na carteira do morador
```

### 2. Coleta em casa pelo catador

```
Morador cria um pedido de coleta (tipos de material, peso estimado, endereço, janela de horário)
  → Catadores próximos recebem o pedido e um deles aceita
  → Catador busca o material na casa do morador e confirma pelo QR code do pedido
  → Catador leva o material até um ponto de coleta
  → Ponto pesa e confirma a entrega
  → Crédito é dividido: parte para o morador e parte para o catador
```

> A pesagem **sempre** acontece no ponto de coleta. Isso evita fraude e garante que o valor pago corresponde ao material que realmente chegou.

---

## ✨ Funcionalidades

### Cadastro e autenticação
- [ ] Cadastro de **morador**: nome, telefone/e-mail, endereço/bairro e senha
- [ ] Cadastro de **catador(a)**: nome, telefone, área de atuação (bairros/raio), cooperativa (opcional), materiais que coleta e disponibilidade
- [ ] Cadastro de **ponto de coleta**: nome, endereço, localização (lat/long), horário de funcionamento, materiais aceitos e responsável
- [ ] Login com perfil (morador / catador / ponto / admin)
- [ ] Aprovação de catadores e pontos pelo admin

### Morador
- [ ] 📸 **Classificação por foto com IA** + instruções de preparo
- [ ] 💰 Estimativa de valor pela tabela de preço por kg
- [ ] 🗺️ Mapa dos pontos de coleta mais próximos
- [ ] 🚚 Pedido de coleta em casa
- [ ] 👛 Carteira: saldo, extrato e histórico de entregas
- [ ] 🌊 Painel de impacto: "você evitou X kg de lixo nos canais"

### Catador(a)
- [ ] Lista/mapa de pedidos de coleta próximos
- [ ] Aceitar, iniciar e concluir coleta (com QR code)
- [ ] Ganhos e histórico

### Ponto de coleta
- [ ] Leitura do QR code do morador ou do pedido
- [ ] Registro do peso por tipo de material
- [ ] Confirmação da entrega (gera o crédito)

### Admin
- [ ] Tabela de preços por kg (plástico, metal, vidro, papel)
- [ ] Gestão de cadastros
- [ ] Indicadores: kg coletado por bairro e por material, usuários ativos

---

## 💸 Recompensa (cashback)

O valor é calculado **por kg de cada material**, a partir de uma tabela configurável:

| Material | Valor por kg (exemplo) |
|---|---|
| Metal (alumínio) | R$ 5,00 |
| Plástico (PET/PEAD) | R$ 1,50 |
| Papel/papelão | R$ 0,50 |
| Vidro | R$ 0,20 |

> ⚠️ Valores **fictícios**, só para demonstração. Na versão real eles seguem o preço de compra das cooperativas e recicladoras.

**Divisão na coleta em casa (proposta):** 70% para o catador e 30% para o morador. Quem trabalha mais recebe mais, e o morador continua tendo incentivo.

**De onde vem o dinheiro?**
- Venda do material para cooperativas e recicladoras;
- Parcerias com programas que já existem (ex.: o Vale Luz, da Neoenergia Pernambuco);
- Cupons e descontos do comércio local;
- Apoio de prefeituras e empresas (ESG / logística reversa).

---

## 🤖 Onde a IA entra

| Funcionalidade | Como a IA é usada |
|---|---|
| **Classificação por foto** | Um modelo de visão identifica o material do resíduo e retorna tipo, se é reciclável e como preparar (lavar, amassar, separar a tampa) |
| **Educação contextual** | Explica em linguagem simples por que aquele item não deve ir para a rua ou para o canal |
| **Estimativa de peso/valor** | Sugere um peso aproximado a partir da foto e da quantidade informada (o valor final sempre vem da pesagem no ponto) |
| *(futuro)* **Denúncia de lixo em canal** | Foto + localização → IA classifica o tipo de descarte → mapa de calor para a prefeitura |

**Cuidados éticos:**
- A IA **não decide pagamentos**: o crédito só é liberado depois da pesagem real no ponto de coleta.
- Fotos não são guardadas além do necessário para a classificação (LGPD).
- Quando a IA não tem certeza, o app mostra a dúvida e pede confirmação do usuário.

---

## 🏗️ Arquitetura e stack

```
┌──────────────────────────┐        ┌──────────────────────────┐
│  Frontend (PWA mobile)   │  HTTP  │        Backend API       │
│  Next.js + TypeScript    │ ─────► │   FastAPI (Python)       │
│  Tailwind · Leaflet      │        │   Auth JWT · Regras      │
└──────────────────────────┘        └──────┬──────────┬────────┘
                                           │          │
                                    ┌──────▼───┐  ┌───▼──────────┐
                                    │PostgreSQL│  │ API de visão │
                                    │          │  │ (LLM com IA) │
                                    └──────────┘  └──────────────┘
```

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Leaflet (mapa), leitor de QR code |
| Backend | Python, FastAPI, SQLAlchemy, Pydantic |
| Banco | PostgreSQL |
| IA | API de LLM multimodal (visão) |
| Testes | Pytest (backend) · Vitest/Jest (frontend) |
| CI/CD | GitHub Actions |
| Deploy | `<Vercel / Render / Railway>` |

---

## 🗃️ Modelo de dados

```
Usuario (id, nome, email, telefone, senha_hash, perfil[morador|catador|ponto|admin], criado_em)

Morador (id, usuario_id, endereco, bairro, lat, lng, saldo)

Catador (id, usuario_id, cooperativa, raio_atuacao_km, bairros[], materiais[], disponivel, aprovado)

PontoColeta (id, usuario_id, nome, endereco, lat, lng, horario, materiais_aceitos[], aprovado)

Material (id, nome[plastico|metal|vidro|papel], preco_kg)

PedidoColeta (id, morador_id, catador_id?, endereco, janela_horario,
              materiais_estimados[], status[aberto|aceito|coletado|entregue|cancelado], qr_code)

Entrega (id, morador_id, catador_id?, ponto_id, pedido_id?, criado_em)

ItemEntrega (id, entrega_id, material_id, peso_kg, valor)

Transacao (id, usuario_id, entrega_id, valor, tipo[credito|resgate], criado_em)
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 20+
- Python 3.11+
- PostgreSQL (ou Docker)

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # preencha DATABASE_URL e AI_API_KEY
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local       # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Acesse `http://localhost:3000` (de preferência no modo mobile do navegador).

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `AI_API_KEY` | Chave da API de IA de visão |
| `JWT_SECRET` | Segredo para assinar os tokens |
| `NEXT_PUBLIC_API_URL` | URL do backend |

---

## 🧪 Testes e CI

Testes automatizados que rodam no **GitHub Actions** a cada push/PR:

| # | Teste | O que valida |
|---|---|---|
| 1 | `test_calculo_cashback` | Valor total = Σ (peso × preço/kg) de cada material |
| 2 | `test_divisao_coleta_domiciliar` | Divisão catador/morador (70/30) soma exatamente o total |
| 3 | `test_validacao_qr_code` | QR inválido, expirado ou já usado não gera crédito |
| 4 | `test_fluxo_status_pedido` | O pedido só avança na ordem aberto → aceito → coletado → entregue |
| 5 | `test_cadastro_ponto_coleta` | Cadastro exige localização e pelo menos um material aceito |

```bash
cd backend && pytest
cd frontend && npm test
```

---

## 🧠 Uso de IA no desenvolvimento

> Seção exigida pelo edital: onde a IA foi usada e onde foi corrigida.

| Onde usamos | Ferramenta | O que foi gerado | O que corrigimos / validamos |
|---|---|---|---|
| Ideação e escrita do README | `<ferramenta>` | Estrutura do documento e fluxos | Ajustamos os fluxos com o validador e revisamos os dados |
| Backend | `<ferramenta>` | `<ex.: rotas de cadastro>` | `<ex.: faltava validação de perfil>` |
| Frontend | `<ferramenta>` | `<ex.: tela do mapa>` | `<ex.: layout quebrava no celular>` |
| Prompt de classificação | `<ferramenta>` | Prompt de visão | `<ex.: confundia vidro com plástico transparente; adicionamos exemplos>` |

---

## 🗣️ Validação com o(a) validador(a)

Perguntas que levamos para o(a) validador(a) do Movimento Pró-Criança:

- Na sua comunidade, as pessoas sabem onde fica um ponto de coleta?
- Que recompensa motivaria de verdade? (dinheiro, crédito de celular, passagem, desconto no comércio)
- Os catadores do bairro usariam um app para receber pedidos?
- Faz mais sentido levar ao ponto ou pedir a coleta em casa?

**O que aprendemos:** `<preencher após a conversa>`

---

## 🔭 Próximos passos

- Integração com máquinas de coleta automática (reverse vending) nos pontos
- Denúncia de lixo em canais com mapa de calor para Emlurb e Defesa Civil
- Alerta de chuva: "chuva forte prevista, entregue seus recicláveis hoje"
- Resgate de saldo por Pix e parcerias com o comércio local
- Ranking de bairros e escolas

---

## 👩‍💻 Equipe

| Nome | Papel | GitHub |
|---|---|---|
| `<nome>` | Back-end | `@<usuario>` |
| `<nome>` | Front-end | `@<usuario>` |
| `Lucas Gabriel Santiago` | DevOps / Testes | `@<usuario>` |
| `<nome>` | Dados / IA | `@<usuario>` |
| `<nome>` | Validador(a) — Movimento Pró-Criança | — |

---

<p align="center">Feito no Hackathon APONTI Academy · REC'n'Play 2026 · Recife-PE</p>
