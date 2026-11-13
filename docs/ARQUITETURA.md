# Arquitetura — Recicla PE

Visão completa: [CONTEXT.md §12](../CONTEXT.md).

```
frontend/ (React 18 + Vite, Vercel)  ──HTTP/JSON──►  backend/ (Node.js + Express, Render)
                                                      ├── src/routes       → rotas REST (/api/...)
                                                      ├── src/middlewares  → JWT, RBAC, erros, limite de login
                                                      ├── src/services     → regras de negócio puras (testáveis)
                                                      └── src/db           → repositório em memória (MVP) → PostgreSQL (Fase 2)
                                                                └── API multimodal de IA (opcional, com reserva)
```

## Decisões do MVP

| Decisão | Motivo |
|---|---|
| **Express** no lugar do `http` puro do repositório base | JWT, RBAC, upload de imagem e ~25 rotas ficariam muito verbosos sem framework |
| **Banco em memória** com seed de demonstração | Prazo do hackathon. A interface de `src/db` permite trocar por PostgreSQL sem mexer nas rotas |
| **Valores em centavos e pesos em gramas** (inteiros) | Evita erro de ponto flutuante em cálculos financeiros |
| **IA com classificador de reserva** | O app continua funcionando sem chave de API ou se a IA cair |
| **QR Code digitado/colado** no MVP | Leitura por câmera fica para a Fase 2 |

## Principais rotas

| Método | Rota | Perfil |
|---|---|---|
| POST | `/api/auth/cadastro`, `/api/auth/login` | público |
| GET | `/api/pontos` (aprovados) · `/api/materiais` · `/api/locais/*` | público |
| POST | `/api/classificar` (imagem e/ou texto) | logado |
| POST | `/api/pedidos` · GET `/api/pedidos/meus` | morador |
| POST | `/api/entregas/qrcode` · GET `/api/carteira` | morador |
| GET | `/api/pedidos/proximos` · POST `/api/pedidos/:id/aceitar` · `/coletar` · `/recusar` | catador aprovado |
| POST | `/api/pontos` (fica pendente) | catador, ponto |
| POST | `/api/entregas` (pesagem) | ponto, admin |
| PATCH | `/api/catadores/:id/aprovar` · `/api/pontos/:id/aprovar` · PUT `/api/materiais/:id/preco` | admin |
| GET | `/api/indicadores?municipio_id=&bairro_id=` | admin, gestor público, empresa |
