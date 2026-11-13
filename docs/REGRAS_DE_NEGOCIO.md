# Regras de negócio — Recicla PE

Fonte oficial: [CONTEXT.md §5 e §7](../CONTEXT.md). Onde cada regra está implementada:

| Regra | Implementação | Teste |
|---|---|---|
| 1. IA não determina pagamentos | `services/classificacao.js` só retorna sugestão | `classificacao.test.js` |
| 2. Recompensa só com entrega validada | `services/entregas.js` | `api.test.js` |
| 3. Peso real é a referência | `services/recompensa.js` (valor = peso × preço do banco) | `recompensa.test.js` |
| 4. Catador recebe à parte | `calcularRemuneracaoCatador` + transação separada | `recompensa.test.js`, `api.test.js` |
| 5. QR Code de uso único | `services/qrcode.js` | `qrcode.test.js` |
| 6. Livro de transações + idempotência | `services/transacoes.js` | `transacoes.test.js` |
| 7. Ponto precisa de aprovação | `routes/pontos.js` | `api.test.js` |
| 8. Catador precisa de aprovação | `routes/pedidos.js` (`catadorAprovado`) | `api.test.js` |
| 9. Expansão geográfica | `municipios` + `bairros` no seed, filtros por município/bairro | `api.test.js` |
| 10. Segurança e LGPD | bcrypt, JWT com expiração, RBAC, limite de login, endereço oculto antes do aceite, imagem não armazenada | `api.test.js` |

## Valores demonstrativos

| Material | Preço por kg |
|---|---|
| Alumínio | R$ 5,00 |
| Plástico PET/PEAD | R$ 1,50 |
| Papel/papelão | R$ 0,50 |
| Vidro | R$ 0,20 |

Remuneração do catador (demo): R$ 0,80 por kg coletado (`CATADOR_CENTAVOS_POR_KG`), sem descontar do morador.
