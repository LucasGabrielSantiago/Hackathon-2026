# Como contribuir — Recicla PE

1. **Leia o [CONTEXT.md](./CONTEXT.md)** antes de implementar qualquer coisa. As regras de negócio dele têm prioridade.
2. Atualize sua cópia: `git pull` antes de começar.
3. Crie uma branch por funcionalidade: `git checkout -b feat/nome-curto`.
4. Teste localmente antes de abrir PR:
   ```bash
   cd backend && npm test
   cd ../frontend && npm test && npm run build
   ```
5. Abra um Pull Request para `main`. O CI precisa passar.

## Padrão de commits

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
test: testes
chore: configuração, dependências
refactor: mudança de código sem alterar comportamento
```

## Regras rápidas

- Valores financeiros só no back-end, sempre em **centavos (inteiros)**.
- Nenhum crédito sem entrega pesada e validada.
- Dados fictícios sempre marcados como **demonstração**.
- Nunca commitar `.env` nem chaves de API.
- Registrar no README (seção "Uso de IA no desenvolvimento") onde a IA foi usada e o que foi corrigido.
