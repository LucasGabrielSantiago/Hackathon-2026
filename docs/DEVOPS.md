# DevOps — Recicla PE

## Fluxo de branches (Gitflow)

```
main      ← versão estável (deploy de produção). Só recebe merge de develop/release/hotfix.
develop   ← integração. Toda feature entra aqui por Pull Request.
feat/*    ← uma branch por funcionalidade, criada a partir de develop.
fix/*     ← correções, a partir de develop.
hotfix/*  ← correção urgente em produção, a partir de main (volta para main e develop).
```

Exemplo:

```bash
git checkout develop
git pull
git checkout -b feat/docker-devsecops
# ...trabalho, commits...
git push -u origin feat/docker-devsecops
# abrir PR: feat/docker-devsecops → develop
```

Regras sugeridas no GitHub (Settings → Branches → proteção de `main` e `develop`):
- Exigir Pull Request
- Exigir CI verde (jobs de `CI - Recicla PE` e `DevSecOps - Recicla PE`)
- Bloquear push direto e force push

## Rodando com Docker

Pré-requisito: Docker Desktop.

```bash
copy .env.example .env      # Linux/Mac: cp .env.example .env
# edite o .env e defina JWT_SECRET
docker compose up --build
```

- App: http://localhost:8080
- API: http://localhost:3001/api/health

Parar: `docker compose down`

## Rodando sem Docker

Node.js **22.12+**. Ver o README.

## Pipelines

| Workflow | O que faz |
|---|---|
| `ci.yml` | Testes do back-end, testes e build do front-end |
| `devsecops.yml` | Gitleaks, `npm audit`, Hadolint, build + Trivy das imagens, CodeQL |
| `dependabot.yml` | PRs semanais de atualização para `develop` |
