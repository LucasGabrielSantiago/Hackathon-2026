import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carteira from '../pages/morador/Carteira.jsx';
import SolicitarColeta from '../pages/morador/SolicitarColeta.jsx';

const resposta = (corpo) => ({ ok: true, status: 200, json: async () => corpo });

function mockApi(rotas) {
  global.fetch = vi.fn((url) => {
    const chave = Object.keys(rotas).find((r) => String(url).includes(r));
    return Promise.resolve(resposta(chave ? rotas[chave] : {}));
  });
}

describe('QR Codes', () => {
  it('atalho ?gerar=1 já mostra o QR de entrega na carteira', async () => {
    mockApi({
      '/entregas/qrcode': { codigo: 'COD-ENTREGA-1', expira_em: new Date(Date.now() + 3600e3).toISOString() },
      '/entregas/minhas': { entregas: [] },
      '/carteira': { saldo_centavos: 0, extrato: [] },
    });
    render(<MemoryRouter initialEntries={['/morador/carteira?gerar=1']}><Carteira /></MemoryRouter>);
    expect(await screen.findByText('COD-ENTREGA-1')).toBeInTheDocument();
    expect(screen.getByTitle('QR Code de entrega')).toBeInTheDocument();
  });

  it('pedido de coleta aberto já mostra o QR para o coletor', async () => {
    mockApi({
      '/pedidos/meus': { pedidos: [{ id: 7, status: 'aberto', qr_code: 'COD-PEDIDO-7', janela_horario: 'Manhã', materiais_estimados: [{ material: 'plastico', quantidade_kg: 3 }] }] },
      '/locais/bairros': { bairros: [] },
    });
    render(<MemoryRouter><SolicitarColeta /></MemoryRouter>);
    expect(await screen.findByText('COD-PEDIDO-7')).toBeInTheDocument();
    expect(screen.getByTitle('QR Code do pedido')).toBeInTheDocument();
  });
});
