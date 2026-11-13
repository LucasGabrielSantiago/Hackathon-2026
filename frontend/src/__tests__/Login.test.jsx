import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/publico/Login.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('Login (acessibilidade)', () => {
  it('campos têm rótulos e mostra erro da API em role=alert', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ mensagem: 'E-mail ou senha inválidos.' }) });
    render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('E-mail'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Senha'), '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha inválidos.');
  });
});

describe('Login: mensagens e recuperação de senha', () => {
  it('sem conexão com a API mostra mensagem clara, não "Failed to fetch"', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('E-mail'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Senha'), '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('Não foi possível conectar ao servidor');
    expect(alerta).not.toHaveTextContent('Failed to fetch');
  });

  it('tem link "Esqueci minha senha"', () => {
    render(<MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute('href', '/esqueci-senha');
  });
});
