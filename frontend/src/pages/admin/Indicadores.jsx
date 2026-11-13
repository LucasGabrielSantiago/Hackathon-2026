import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import AvisoDemo from '../../components/AvisoDemo.jsx';
import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

export default function Indicadores() {
  const [municipios, setMunicipios] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [filtro, setFiltro] = useState({ municipio_id: '', bairro_id: '' });
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => { api('/locais/municipios').then((d) => setMunicipios(d.municipios)); }, []);
  useEffect(() => {
    api(`/locais/bairros${filtro.municipio_id ? `?municipio_id=${filtro.municipio_id}` : ''}`).then((d) => setBairros(d.bairros));
  }, [filtro.municipio_id]);
  useEffect(() => {
    const qs = new URLSearchParams(Object.entries(filtro).filter(([, v]) => v)).toString();
    api(`/indicadores${qs ? `?${qs}` : ''}`).then((d) => setDados(d.indice_canal_limpo)).catch((e) => setErro(e.message));
  }, [filtro]);

  return (
    <section>
      <h1>Índice Canal Limpo</h1>
      <div className="linha">
        <label htmlFor="mun">Município</label>
        <select id="mun" value={filtro.municipio_id} onChange={(e) => setFiltro({ municipio_id: e.target.value, bairro_id: '' })}>
          <option value="">Todos</option>
          {municipios.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
        </select>
        <label htmlFor="bai">Bairro</label>
        <select id="bai" value={filtro.bairro_id} onChange={(e) => setFiltro({ ...filtro, bairro_id: e.target.value })}>
          <option value="">Todos</option>
          {bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
      </div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      {dados && (
        <>
          <div className="grade">
            <div className="cartao destaque"><span>Kg recuperados</span><strong>{dados.ambientais.kg_recuperados.toLocaleString('pt-BR')}</strong></div>
            <div className="cartao destaque"><span>Entregas</span><strong>{dados.ambientais.entregas}</strong></div>
            <div className="cartao destaque"><span>Pontos ativos</span><strong>{dados.ambientais.pontos_ativos}</strong></div>
            <div className="cartao destaque"><span>Catadores ativos</span><strong>{dados.sociais.catadores_ativos}</strong></div>
            <div className="cartao destaque"><span>Bolsa Reciclagem distribuída</span><strong>{reais(dados.economicos.creditos_distribuidos_centavos)}</strong></div>
            <div className="cartao destaque"><span>Renda gerada a catadores</span><strong>{reais(dados.sociais.remuneracao_catadores_centavos)}</strong></div>
          </div>
          <h2>Kg por material</h2>
          <ul className="lista">
            {Object.entries(dados.ambientais.kg_por_material).map(([m, kg]) => <li key={m} className="cartao linha"><span>{NOMES_MATERIAIS[m]}</span><strong>{kg.toLocaleString('pt-BR')} kg</strong></li>)}
          </ul>
          <h2>Kg por bairro</h2>
          <ul className="lista">
            {Object.entries(dados.ambientais.kg_por_bairro).map(([b, kg]) => <li key={b} className="cartao linha"><span>{b}</span><strong>{kg.toLocaleString('pt-BR')} kg</strong></li>)}
          </ul>
        </>
      )}
      <AvisoDemo>Indicadores calculados a partir de entregas de demonstração. Não indicam redução de alagamentos sem estudo específico.</AvisoDemo>
    </section>
  );
}
