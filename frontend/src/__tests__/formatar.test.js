import { reais } from '../utils/formatar.js';

describe('formatação', () => {
  it('converte centavos em reais', () => {
    expect(reais(1150).replace(/\s/g, ' ')).toBe('R$ 11,50');
    expect(reais(0).replace(/\s/g, ' ')).toBe('R$ 0,00');
  });
});
