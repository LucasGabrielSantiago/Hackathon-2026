# Guia de desenvolvimento — Recicla PE

Como baixar o projeto, rodar na sua máquina (com e sem Docker), testar e enviar alterações.

> Os comandos estão para o **PowerShell (Windows)**. Quando o comando for diferente no Linux ou no macOS, a versão aparece logo abaixo.

---

## 1. Pré-requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| [Git](https://git-scm.com/downloads) | qualquer recente | Baixar e versionar o código |
| [Node.js](https://nodejs.org/) | **22.12 ou maior** (LTS) | Rodar sem Docker |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | qualquer recente | Rodar com Docker (opcional) |
| VS Code | — | Editor sugerido |

Confira as versões:

```powershell
git --version
node --version      # precisa ser v22.12.0 ou maior
docker --version    # só se for usar Docker
```

---

## 2. Baixar o projeto

### Clone completo (recomendado)

Baixa todas as branches. É o que você precisa para seguir o Gitflow (`develop`, `feat/*`, `hotfix/*`).

```powershell
git clone https://github.com/LucasGabrielSantiago/Hackathon-2026.git
cd Hackathon-2026
git checkout develop
```

### Clone de uma branch só

Útil para só **rodar** ou **revisar** uma branch específica, sem baixar o resto:

```powershell
git clone -b <nome-da-branch> --single-branch https://github.com/LucasGabrielSantiago/Hackathon-2026.git
```

Exemplos:

```powershell
# versão em produção
git clone -b main --single-branch https://github.com/LucasGabrielSantiago/Hackathon-2026.git

# versão em desenvolvimento
git clone -b develop --single-branch https://github.com/LucasGabrielSantiago/Hackathon-2026.git
```

| Parte do comando | O que faz |
|---|---|
| `-b <nome-da-branch>` | Já entra nessa branch depois de clonar |
| `--single-branch` | Baixa **só** essa branch; as outras não vêm |
| `--depth 1` (opcional) | Baixa só o último commit (mais rápido, sem histórico) |

> ⚠️ Com `--single-branch`, o `git checkout develop` e o `git pull` de outras branches **não funcionam**, porque o Git não sabe que elas existem. Para passar a ver todas:
>
> ```powershell
> git remote set-branches origin "*"
> git fetch origin
> git checkout develop
> ```
>
> Se usou `--depth 1`, rode também `git fetch --unshallow` antes de criar branches e abrir PRs.

---

## 3. Rodar **sem Docker** (modo desenvolvimento)

Back-end e front-end rodam em **dois terminais** separados e recarregam sozinhos quando você salva um arquivo.

### Terminal 1 — API (back-end)

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```
Linux/macOS: `cp .env.example .env`

Pronto quando aparecer `Recicla PE API rodando em http://localhost:3001`.
Teste: http://localhost:3001/api/health → `{"status":"ok","app":"Recicla PE"}`

### Terminal 2 — App (front-end)

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```
Linux/macOS: `cp .env.example .env`

Abra **http://localhost:5173**. Para ver como no celular: `F12` → ícone de dispositivo (ou `Ctrl+Shift+M`) → escolha um iPhone ou Android.

### O que cada `.env` faz

| Arquivo | Variável | Valor local |
|---|---|---|
| `backend/.env` | `JWT_SECRET` | Qualquer texto em desenvolvimento |
| `backend/.env` | `FRONTEND_URL` | `http://localhost:5173` |
| `backend/.env` | `AI_API_KEY` | Vazio (usa o classificador de reserva) |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:3001/api` |

> 🔒 Os arquivos `.env` **nunca** vão para o Git. Não cole chaves reais em issues, PRs ou chats.

### Parar

`Ctrl + C` em cada terminal.

---

## 4. Rodar **com Docker**

Sobe as mesmas imagens que vão para produção (containers sem root, somente leitura e com healthcheck). Não precisa de Node instalado.

```powershell
# na raiz do projeto (pasta Hackathon-2026)
copy .env.example .env
```

Abra o `.env` da **raiz** e preencha o `JWT_SECRET` com um valor longo. Para gerar um:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Depois:

```powershell
docker compose up --build
```

| Serviço | Endereço |
|---|---|
| App | http://localhost:8080 |
| API | http://localhost:3001/api/health |

### Comandos úteis

| Comando | O que faz |
|---|---|
| `docker compose up --build -d` | Sobe em segundo plano |
| `docker compose ps` | Mostra os containers e se estão `healthy` |
| `docker compose logs -f backend` | Acompanha os logs da API |
| `docker compose down` | Para e remove os containers |
| `docker compose build --no-cache` | Reconstrói do zero (após mudar dependências) |

> No Docker, o código **não** recarrega sozinho: depois de alterar algo, rode `docker compose up --build` de novo. Para programar no dia a dia, prefira o modo sem Docker. Use o Docker para conferir se o build de produção funciona.

---

## 5. Com Docker × sem Docker

| | Sem Docker | Com Docker |
|---|---|---|
| Precisa de | Node 22.12+ | Docker Desktop |
| App em | http://localhost:5173 | http://localhost:8080 |
| `.env` usados | `backend/.env` e `frontend/.env` | `.env` da **raiz** |
| Recarrega ao salvar | Sim | Não (refaça o build) |
| Melhor para | Programar | Testar o build de produção |

---

## 6. Entrar no app

Senha de todas as contas: `demo1234`

| Perfil | E-mail |
|---|---|
| Morador | morador@reciclape.demo |
| Coletor(a) de recicláveis | catador@reciclape.demo |
| Ponto de coleta | ponto@reciclape.demo |
| Admin | admin@reciclape.demo |

> Sem `DATABASE_URL`, a API local guarda os dados em `backend/.dados-local.json` (fora do Git): contas, pedidos e QR Codes **continuam** quando o `npm run dev` reinicia a API ao salvar um arquivo. Para voltar aos dados de demonstração, pare a API e apague esse arquivo. `DADOS_LOCAIS=off` deixa tudo só em memória.

---

## 7. Testes

Rode antes de todo commit:

```powershell
cd backend;  npm test
cd ../frontend;  npm test;  npm run build
```

O CI no GitHub roda os mesmos comandos, mais as verificações de segurança (Gitleaks, npm audit, Hadolint, Trivy e CodeQL).

---

## 8. Fluxo de trabalho (Gitflow)

```powershell
git checkout develop
git pull
git checkout -b feat/nome-curto      # ex.: feat/mapa-filtros

# ... programe, teste ...

git add <arquivos>                   # evite "git add ." para não subir arquivos soltos
git commit -m "feat: descrição curta"
git push -u origin feat/nome-curto
```

Abra o Pull Request **para `develop`**:
`https://github.com/LucasGabrielSantiago/Hackathon-2026/compare/develop...feat/nome-curto?expand=1`

- Só faça o merge com o CI e o DevSecOps passando.
- A `main` só recebe PRs vindos de `develop` (release) ou de `hotfix/*`.
- Padrão de commits e regras: [CONTRIBUTING.md](../CONTRIBUTING.md). Detalhes do pipeline: [DEVOPS.md](./DEVOPS.md).

---

## 9. Problemas comuns

| Mensagem ou sintoma | Causa | Solução |
|---|---|---|
| `fatal: not a git repository` | Você está fora da pasta do projeto | `cd` até a pasta `Hackathon-2026` (a que tem a pasta `.git`) |
| `Port 5173 is in use, trying another one...` | Outro `npm run dev` ainda aberto | Feche o terminal antigo ou use a porta que o Vite mostrar |
| `EADDRINUSE :::3001` | A API já está rodando (ou o Docker está usando a porta) | Feche o outro terminal ou rode `docker compose down` |
| Login dá "Failed to fetch" ou erro de CORS | `FRONTEND_URL` não inclui o endereço do front | No `backend/.env`, use `FRONTEND_URL=http://localhost:5173` (vários separados por vírgula) |
| `Defina JWT_SECRET no arquivo .env` | `.env` da raiz sem segredo (Docker) | Preencha `JWT_SECRET` no `.env` da **raiz**, não no `backend/.env` |
| Erro de versão do Node / `engines` | Node abaixo de 22.12 | Instale o Node LTS atual |
| QR Code "inválido" na pesagem | Dados locais apagados (arquivo `.dados-local.json` removido) | Gere um novo QR Code |
| Conta criada dá "E-mail ou senha inválidos" | A conta foi criada em outra API (local × produção) ou os dados locais foram apagados | Crie a conta de novo no mesmo ambiente em que vai entrar |
| Primeiro acesso ao app publicado demora | A API no Render "dorme" sem uso | Espere 30–50 s e tente de novo |
