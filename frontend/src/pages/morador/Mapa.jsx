import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import MapaPontos from '../../components/MapaPontos.jsx';
import AvisoDemo from '../../components/AvisoDemo.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export default function Mapa() {
  const [pontos, setPontos] = useState([]);
  const [material, setMaterial] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    api(`/pontos${material ? `?material=${material}` : ''}`).then((d) => setPontos(d.pontos)).catch((e) => setErro(e.message));
  }, [material]);

  return (
    <section>
      <h1>Pontos de coleta</h1>
      <label htmlFor="filtro">Material</label>
      <select id="filtro" value={material} onChange={(e) => setMaterial(e.target.value)}>
        <option value="">Todos</option>
        {Object.entries(NOMES_MATERIAIS).map(([m, r]) => <option key={m} value={m}>{r}</option>)}
      </select>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <MapaPontos pontos={pontos} />
      <ul className="lista">
        {pontos.map((p) => (
          <li key={p.id} className="cartao">
            <strong>{p.nome}</strong> {p.demo && <span className="selo">demo</span>}
            <span>{p.bairro} · {p.horario}</span>
            <span>{p.materiais_aceitos.map((m) => NOMES_MATERIAIS[m]).join(', ')} · {p.modalidade === 'compra' ? 'compra' : 'doação'}</span>
          </li>
        ))}
      </ul>
      <AvisoDemo>Pontos marcados como “demo” são fictícios.</AvisoDemo>
    </section>
  );
}
