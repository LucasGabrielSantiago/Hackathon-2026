import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

function renderizar(rota = '/') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AuthProvider><App /></AuthProvider>
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('mostra a página inicial com nome e slogan do Recicla PE', () => {
    renderizar();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Recicla PE');
    expect(screen.getByText(/Reciclar gera renda/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Criar conta' })).toBeInTheDocument();
  });

  it('redireciona para o login quem não está autenticado', () => {
    renderizar('/morador/carteira');
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
  });
});
