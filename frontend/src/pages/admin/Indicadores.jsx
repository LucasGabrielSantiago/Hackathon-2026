import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import Loading from '../../components/common/Loading.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

function Barras({ titulo, dados, rotulo }) {
  const max = Math.max(1, ...Object.values(dados));
  return (
    <div className="rp-card">
      <p className="rp-card-titulo">{titulo}</p>
      <table className="tabela tabela-compacta">
        <thead><tr><th scope="col">{rotulo}</th><th scope="col">Kg</th></tr></thead>
        <tbody>
          {Object.entries(dados).sort((a, b) => b[1] - a[1]).map(([k, kg]) => (
            <tr key={k}>
              <td>{NOMES_MATERIAIS[k] || k}<div className="rp-progresso" aria-hidden="true"><span style={{ width: `${(kg / max) * 100}%` }} /></div></td>
              <td>{kg.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Indicadores() {
  const [municipios, setMunicipios] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [filtro, setFiltro] = useState({ municipio_id: '', bairro_id: '' });
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => { api('/locais/municipios').then((d) => setMunicipios(d.municipios)).catch(() => {}); }, []);
  useEffect(() => {
    api(`/locais/bairros${filtro.municipio_id ? `?municipio_id=${filtro.municipio_id}` : ''}`).then((d) => setBairros(d.bairros)).catch(() => {});
  }, [filtro.municipio_id]);
  useEffect(() => {
    const qs = new URLSearchParams(Object.entries(filtro).filter(([, v]) => v)).toString();
    api(`/indicadores${qs ? `?${qs}` : ''}`).then((d) => setDados(d.indice_canal_limpo)).catch((e) => setErro(e.message));
  }, [filtro]);

  return (
    <>
      <h1 className="titulo-1">Índice Canal Limpo</h1>
      <div className="grade-2">
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="mun">Município</label>
          <select className="rp-campo" id="mun" value={filtro.municipio_id} onChange={(e) => setFiltro({ municipio_id: e.target.value, bairro_id: '' })}>
            <option value="">Todos</option>{municipios.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select></div>
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="bai">Bairro</label>
          <select className="rp-campo" id="bai" value={filtro.bairro_id} onChange={(e) => setFiltro({ ...filtro, bairro_id: e.target.value })}>
            <option value="">Todos</option>{bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select></div>
      </div>
      {erro && <Alert tipo="erro" titulo="Não foi possível carregar">{erro}</Alert>}
      {!dados && !erro && <Loading />}
      {dados && (
        <>
          <div className="stats">
            <StatCard rotulo="Kg recuperados" valor={dados.ambientais.kg_recuperados.toLocaleString('pt-BR')} />
            <StatCard rotulo="Entregas" valor={dados.ambientais.entregas} />
            <StatCard rotulo="Pontos ativos" valor={dados.ambientais.pontos_ativos} />
            <StatCard rotulo="Catadores ativos" valor={dados.sociais.catadores_ativos} />
            <StatCard rotulo="Bolsa Reciclagem" valor={reais(dados.economicos.creditos_distribuidos_centavos)} />
            <StatCard rotulo="Renda a catadores" valor={reais(dados.sociais.remuneracao_catadores_centavos)} />
          </div>
          <div className="grade-responsiva">
            <Barras titulo="Kg por material" rotulo="Material" dados={dados.ambientais.kg_por_material} />
            <Barras titulo="Kg por bairro" rotulo="Bairro" dados={dados.ambientais.kg_por_bairro} />
          </div>
        </>
      )}
      <Alert tipo="aviso" titulo="Dados de demonstração">Indicadores calculados a partir de entregas fictícias. Não indicam redução de alagamentos sem estudo específico.</Alert>
    </>
  );
}
