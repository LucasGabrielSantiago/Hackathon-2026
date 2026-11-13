# syntax=docker/dockerfile:1
# ---------- Recicla PE · API (Node.js) ----------
# Multi-stage: só dependências de produção na imagem final, rodando como usuário não-root.

FROM node:25-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

FROM node:25-alpine AS runtime
ENV NODE_ENV=production \
    PORT=3001
WORKDIR /app
# Hardening: a API roda só com "node". Remove npm, npx, yarn e corepack da imagem final
# (eles traziam vulnerabilidades apontadas pelo Trivy e não são usados em produção).
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
      /usr/local/bin/yarn /usr/local/bin/yarnpkg /opt/yarn-*
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src
# Usuário sem privilégios (já existe na imagem oficial do Node)
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1
CMD ["node", "src/server.js"]
