import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampoEndereco, { ENDERECO_VAZIO } from '../components/map/CampoEndereco.jsx';
import { formatarCep, montarEndereco, linkGoogleMapsRota, distanciaM, formatarDistancia } from '../services/mapas.js';

const BAIRROS = [{ id: 1, nome: 'Boa Viagem' }, { id: 3, nome: 'São José' }];

function Teste() {
  const [v, setV] = useState(ENDERECO_VAZIO);
  return <><CampoEndereco valor={v} onChange={setV} bairros={BAIRROS} comMapa={false} /><output data-testid="saida">{JSON.stringify(v)}</output></>;
}

describe('Endereço', () => {
  it('CEP preenche rua, cidade e escolhe o bairro atendido', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ json: async () => ({ cep: '51020-000', logradouro: 'Avenida Boa Viagem', bairro: 'Boa Viagem', localidade: 'Recife', uf: 'PE' }) }));
    render(<Teste />);
    await userEvent.type(screen.getByLabelText('CEP'), '51020000');
    expect(await screen.findByDisplayValue('Avenida Boa Viagem')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro')).toHaveValue('1');
    expect(screen.getByLabelText('Cidade')).toHaveValue('Recife/PE');
    expect(global.fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/51020000/json/');
  });

  it('CEP inexistente mostra aviso', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ json: async () => ({ erro: true }) }));
    render(<Teste />);
    await userEvent.type(screen.getByLabelText('CEP'), '00000000');
    expect(await screen.findByText('CEP não encontrado.')).toBeInTheDocument();
  });

  it('funções de endereço e Google Maps', () => {
    expect(formatarCep('51020000')).toBe('51020-000');
    expect(montarEndereco({ logradouro: 'Rua A', numero: '10', complemento: 'Apto 2', bairro: 'Boa Viagem', cidade: 'Recife', uf: 'PE', cep: '51020000' }))
      .toBe('Rua A, 10 - Apto 2 · Boa Viagem · Recife/PE · CEP 51020-000');
    expect(linkGoogleMapsRota({ latitude: -8.1, longitude: -34.9 }, { latitude: -8.05, longitude: -34.91 }))
      .toBe('https://www.google.com/maps/dir/?api=1&destination=-8.1%2C-34.9&travelmode=driving&origin=-8.05%2C-34.91');
    const d = distanciaM({ latitude: -8.1196, longitude: -34.9012 }, { latitude: -8.0716, longitude: -34.8781 });
    expect(d).toBeGreaterThan(5000); expect(d).toBeLessThan(6500);
    expect(formatarDistancia(850)).toBe('850 m');
    expect(formatarDistancia(5800)).toBe('5,8 km');
  });
});

describe('Localização com tentativas', () => {
  it('sem achar o número, usa a rua e avisa que é aproximado', async () => {
    const { geocodificar } = await import('../services/mapas.js');
    const urls = [];
    global.fetch = vi.fn((url) => { urls.push(String(url)); return Promise.resolve({ json: async () => (urls.length === 1 ? [] : [{ lat: '-8.04', lon: '-34.90' }]) }); });
    const r = await geocodificar({ logradouro: 'Rua Carneiro Vilela', numero: '123', cidade: 'Recife', uf: 'PE', cep: '52050-030' }, { intervaloMs: 0 });
    expect(r).toEqual({ latitude: -8.04, longitude: -34.9, aproximado: true });
    expect(urls[0]).toContain('street=123+Rua+Carneiro+Vilela');
    expect(urls[1]).toContain('street=Rua+Carneiro+Vilela');
  });

  it('cai para o CEP e depois para o bairro', async () => {
    const { geocodificar } = await import('../services/mapas.js');
    const urls = [];
    global.fetch = vi.fn((url) => { urls.push(String(url)); return Promise.resolve({ json: async () => (urls.length < 4 ? [] : [{ lat: '-8.03', lon: '-34.89' }]) }); });
    const r = await geocodificar({ logradouro: 'Rua X', numero: '1', bairro: 'Aflitos', cidade: 'Recife', uf: 'PE', cep: '52050030' }, { intervaloMs: 0 });
    expect(r.aproximado).toBe(true);
    expect(urls[2]).toContain('postalcode=52050-030');
    expect(urls[3]).toContain('q=Aflitos%2C+Recife%2C+PE');
  });

  it('nada encontrado pede para marcar no mapa', async () => {
    const { geocodificar } = await import('../services/mapas.js');
    global.fetch = vi.fn(() => Promise.resolve({ json: async () => [] }));
    await expect(geocodificar({ logradouro: 'Rua X', cidade: 'Recife' }, { intervaloMs: 0 })).rejects.toThrow('Toque no mapa');
  });
});
