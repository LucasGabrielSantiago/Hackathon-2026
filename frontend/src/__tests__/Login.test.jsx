import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/publico/Login.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('Login (acessibilidade)', () => {
  it('campos têm rótulos e mostra erro da API em role=alert', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ mensagem: 'E-mail ou senha incorretos.' }) });
    render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('E-mail'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Senha'), '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha incorretos.');
  });
});
