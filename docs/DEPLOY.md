# Deploy — Recicla PE

| Parte | Onde | Branch | Configuração |
|---|---|---|---|
| API (back-end) | **Render** (plano free) | `main` | [`render.yaml`](../render.yaml) |
| App (front-end) | **Vercel** (Hobby) | `main` | [`frontend/vercel.json`](../frontend/vercel.json) |

A ordem importa: **primeiro a API** (para ter a URL), **depois o front**, e por fim liberar o CORS.

---

## 1. API no Render

1. Acesse https://render.com e entre com o GitHub.
2. **New → Blueprint** → escolha o repositório `Hackathon-2026` → **Apply**.
   O Render lê o `render.yaml` e cria o serviço `recicla-pe-api` (Node 22, pasta `backend`, health check em `/api/health`).
   O `JWT_SECRET` é gerado automaticamente.
3. Quando o deploy terminar, copie a URL. A nossa é `https://recicla-pe-api.onrender.com`.
4. Teste: `https://recicla-pe-api.onrender.com/api/health` → `{"status":"ok","app":"Recicla PE"}`.

> Plano free: o serviço **dorme depois de ~15 min sem acesso** e a primeira requisição demora ~1 min. Como os dados do MVP ficam em memória, **ao dormir/reiniciar tudo volta aos dados de demonstração**. Para evitar, configure o monitor do passo 4.

## 2. Front-end na Vercel

1. Acesse https://vercel.com e entre com o GitHub.
2. **Add New → Project** → importe `Hackathon-2026`.
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (detectado pelo `vercel.json`)
   - **Environment Variables:** `VITE_API_URL` = `https://recicla-pe-api.onrender.com/api` (a URL do passo 1 + `/api`), tipo **Config** (não Secret: variáveis `VITE_` são públicas)
   - Mesmo sem essa variável, o build usa `frontend/.env.production`, que já aponta para a API de produção
4. **Deploy**. Copie a URL. A nossa é `https://hackathon-2026-theta-eight.vercel.app`.
5. Em **Settings → Git**, confirme que a **Production Branch** é `main`.

> `VITE_API_URL` é embutida no build. Se a URL da API mudar, altere a variável e faça **Redeploy**.

## 3. Liberar o CORS na API

No Render → `recicla-pe-api` → **Environment** → `FRONTEND_URL`:

```
https://hackathon-2026-theta-eight.vercel.app,http://localhost:5173
```

Para aceitar mais de uma origem, separe por vírgula (ex.: incluir `http://localhost:5173`). Salve: o Render reinicia a API.

## 4. Manter a API acordada (monitoramento)

O plano free do Render desliga a API depois de ~15 min sem requisições. Para evitar isso, um monitor externo chama o health check a cada 5 minutos, o que também serve de **monitoramento de disponibilidade** (avisa por e-mail se a API cair).

**UptimeRobot (gratuito):**

1. Crie uma conta em https://uptimerobot.com.
2. **New Monitor** → tipo **HTTP(s)**.
3. URL: `https://recicla-pe-api.onrender.com/api/health`
4. Intervalo: **5 minutes** → **Create Monitor**.

Alternativa equivalente: https://cron-job.org (job a cada 10 min para a mesma URL).

Observações:
- Uma única API ligada 24h cabe nas 750 horas/mês do plano free do Render.
- Um **novo deploy** ou reinício ainda zera os dados de demonstração (dados em memória até a Fase 2 com PostgreSQL).
- GitHub Actions agendado **não** é confiável para isso: o `schedule` pode atrasar mais de 15 minutos.
- Sem dormir e sem o monitor: plano pago **Starter** do Render.

## 5. Conferir

- [ ] `https://<api>/api/health` responde `ok`
- [ ] O app abre na URL da Vercel, inclusive no celular
- [ ] Login com `morador@reciclape.demo` / `demo1234` funciona (se falhar, revise `FRONTEND_URL` e `VITE_API_URL`)
- [ ] Mapa carrega os pontos
- [ ] Monitor do UptimeRobot ativo (API não dorme)
- [ ] Links atualizados no README (seção do topo)

## Fluxo de publicação (Gitflow)

```
feat/*  →  PR para develop  →  PR develop → main  →  Render e Vercel publicam automaticamente
```

Pull Requests para `develop` geram **Preview Deployments** na Vercel (URL temporária). Esses previews só conseguem falar com a API se a URL deles estiver em `FRONTEND_URL`.

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| "Failed to fetch" / erro de rede no login | CORS ou `VITE_API_URL` errada | Conferir `FRONTEND_URL` no Render e `VITE_API_URL` na Vercel (com `/api` no final) e redeploy |
| App chama `localhost:3001` em produção | Build feito antes da variável existir, ou aba antiga aberta | Redeploy na Vercel e recarregar com Ctrl+Shift+R |
| 401 no login demo | Senha digitada errada | A senha das contas demo é `demo1234` (8 caracteres) |
| Primeira requisição muito lenta | API dormindo (plano free) | Configurar o monitor do passo 4 |
| Dados sumiram | API reiniciou (dados em memória) | Esperado no MVP; PostgreSQL resolve na Fase 2 |
| 404 ao recarregar uma página | Falta de rewrite para SPA | Já resolvido no `vercel.json` |
| Build falha por versão do Node | Node < 22.12 | Em Vercel → Settings → Node.js Version: 22.x |


## Persistência (Neon)

O MVP guarda os dados em memória e salva uma cópia de tudo numa linha JSONB do PostgreSQL a cada alteração (`backend/src/db/persistencia.js`). Ao iniciar, a API carrega essa cópia. Se o banco estiver fora do ar, a API sobe só em memória.

1. Crie um projeto gratuito em [neon.tech](https://neon.tech) (região **AWS US East / N. Virginia**, a mesma do Render).
2. Em **Connect**, copie a connection string (`postgresql://...sslmode=require`).
3. No Render → `recicla-pe-api` → **Environment** → **Add Environment Variable**: `DATABASE_URL` = a connection string. Salve (o Render faz o redeploy).
4. Nos logs do Render deve aparecer `[persistencia] banco vazio: dados de demonstração gravados` (primeira vez) ou `[persistencia] dados carregados do banco`.

> 🔒 A connection string tem usuário e senha: é **segredo**. Nunca no Git, em issue, PR ou chat. Se vazar, gere outra senha no Neon (Roles → Reset password) e atualize no Render.

Limites conhecidos: uma única instância da API (o plano gratuito do Render) e 1 GB no Neon gratuito. As fotos são reduzidas no celular antes do envio. Próximo passo: tabelas relacionais com migrations (ver `docs/MODELO_DE_DADOS.md`).
