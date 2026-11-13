# Migrations

O MVP usa um repositório **em memória** (`src/db/index.js`) com dados de demonstração (`src/db/seeds/seed.js`).

Na Fase 2 (PostgreSQL), as migrations ficam nesta pasta, seguindo o modelo de dados de `docs/MODELO_DE_DADOS.md`.
Regras: preservar dados existentes, não apagar tabelas sem autorização e manter o histórico de transações.
