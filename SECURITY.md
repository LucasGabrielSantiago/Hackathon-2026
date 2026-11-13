# Política de segurança — Recicla PE

## Como reportar uma vulnerabilidade

Não abra issue pública. Envie um e-mail para a equipe (`<inserir e-mail da equipe>`) com a descrição, os passos para reproduzir e o impacto.

## O que já aplicamos

**Código e aplicação**
- Senhas com hash (bcrypt), JWT com expiração, controle de acesso por perfil (RBAC)
- Limite de tentativas de login
- Cabeçalhos de segurança: Helmet na API e CSP/X-Frame-Options no Nginx (Docker) e na Vercel (`vercel.json`)
- CORS restrito às origens de `FRONTEND_URL`
- API não inicia em produção sem `JWT_SECRET` (no Render ele é gerado automaticamente)
- Valores financeiros calculados só no back-end, com idempotência e livro de transações
- Imagens enviadas para a IA não são armazenadas; endereço do morador oculto até o catador aceitar (LGPD)

**Segredos**
- `.env` fora do Git; só `.env.example` sem valores reais
- `docker compose` não sobe sem `JWT_SECRET`
- Chave da IA só no back-end
- Varredura de segredos com Gitleaks no CI

**Containers**
- Imagens multi-stage, só dependências de produção
- Imagem da API sem npm, npx, yarn e corepack (só o `node`)
- Usuário não-root (`node` e `nginx`), sistema de arquivos somente leitura, `cap_drop: ALL`, `no-new-privileges`
- Healthcheck nos dois serviços

**Pipeline (GitHub Actions)**
- `npm audit` bloqueando vulnerabilidades altas/críticas
- Hadolint nos Dockerfiles
- Trivy nas imagens
- CodeQL (análise estática)
- Dependabot semanal para npm, Docker e Actions
