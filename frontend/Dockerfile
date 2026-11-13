# syntax=docker/dockerfile:1
# ---------- Recicla PE · Front-end (React + Vite) ----------
# Build com Node e entrega com Nginx sem privilégios (porta 8080, usuário não-root).

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
# URL da API embutida no build (variável pública do Vite, nunca colocar segredo aqui)
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Linha estável do Nginx (sem root). O Dependabot avisa quando a imagem base atualizar.
FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
# Aplica as correções de segurança mais recentes do Alpine (ex.: OpenSSL, curl, brotli) e volta para o usuário sem privilégios
USER root
# hadolint ignore=DL3017,DL3018
RUN apk upgrade --no-cache
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
