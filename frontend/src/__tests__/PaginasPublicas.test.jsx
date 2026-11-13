import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EsqueciSenha from '../pages/publico/EsqueciSenha.jsx';
import Termos from '../pages/publico/Termos.jsx';
import Privacidade from '../pages/publico/Privacidade.jsx';
import Cadastro from '../pages/publico/Cadastro.jsx';
import SolicitarColeta from '../pages/morador/SolicitarColeta.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

const ok = (corpo) => Promise.resolve({ ok: true, status: 200, json: async () => corpo });

describe('Páginas públicas', () => {
  it('esqueci minha senha mostra a mensagem genérica da API', async () => {
    global.fetch = vi.fn(() => ok({ mensagem: 'Se este e-mail estiver cadastrado, você vai receber as instruções para criar uma nova senha.' }));
    render(<MemoryRouter><EsqueciSenha /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('E-mail'), 'a@b.com');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar link' }));
    expect(await screen.findByText(/Se este e-mail estiver cadastrado/)).toBeInTheDocument();
  });

  it('termos e privacidade têm título e citam a LGPD', () => {
    render(<MemoryRouter><Termos /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Termos de uso' })).toBeInTheDocument();
    render(<MemoryRouter><Privacidade /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1, name: 'Política de privacidade' })).toBeInTheDocument();
    expect(screen.getAllByText(/LGPD/).length).toBeGreaterThan(0);
  });

  it('cadastro usa "Coletor(a) de recicláveis" e liga para termos e privacidade', () => {
    global.fetch = vi.fn(() => ok({ municipios: [], bairros: [] }));
    render(<MemoryRouter><AuthProvider><Cadastro /></AuthProvider></MemoryRouter>);
    expect(screen.getByLabelText('Coletor(a) de recicláveis')).toBeInTheDocument();
    expect(screen.queryByText(/Catador/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'termos de uso' })).toHaveAttribute('href', '/termos');
    expect(screen.getByRole('link', { name: 'política de privacidade' })).toHaveAttribute('href', '/privacidade');
  });

  it('pedido de coleta sem foto não é enviado', async () => {
    global.fetch = vi.fn((url) => ok(String(url).includes('bairros') ? { bairros: [{ id: 1, nome: 'Boa Viagem' }] } : { pedidos: [] }));
    render(<MemoryRouter><SolicitarColeta /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText('Lixo eletrônico'), '2');
    await userEvent.type(screen.getByLabelText('Endereço'), 'Rua A, 1');
    await userEvent.selectOptions(await screen.findByLabelText('Bairro'), '1');
    await userEvent.click(screen.getByRole('button', { name: 'Solicitar coleta' }));
    expect(await screen.findByText(/Envie uma foto dos materiais/)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining('/pedidos'), expect.objectContaining({ method: 'POST' }));
  });
});
