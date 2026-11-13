# Modelo de dados — Recicla PE

Modelo completo: [CONTEXT.md §13](../CONTEXT.md).

No MVP as coleções ficam em memória (`backend/src/db/index.js`) com os mesmos nomes de campo do modelo.

Diferenças do MVP em relação ao CONTEXT.md:

- Valores em `*_centavos` (inteiro) e pesos em `peso_gramas` (inteiro).
- `Carteira.saldo` não é armazenado: é calculado a partir de `transacoes` (livro de transações).
- Coleção `qrcodes` (código, tipo, referência, validade, `usado_em`).
- Coleção `auditoria` para ações administrativas (aprovações e alteração de preços).
- Ainda não implementados: `Cooperativa`, `Patrocinador`, `Campanha` (Fase 2/3).
