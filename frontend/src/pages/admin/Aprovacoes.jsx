import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export default function Aprovacoes() {
  const [catadores, setCatadores] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setCatadores((await api('/catadores/pendentes')).catadores);
      setPontos((await api('/pontos/pendentes')).pontos);
    } catch (e) { setErro(e.message); }
  }
  useEffect(() => { carregar(); }, []);

  async function aprovar(caminho) {
    try { await api(caminho, { metodo: 'PATCH' }); carregar(); } catch (e) { setErro(e.message); }
  }

  return (
    <section>
      <h1>Aprovações</h1>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <h2>Catadores pendentes ({catadores.length})</h2>
      <ul className="lista">
        {catadores.map((c) => (
          <li key={c.id} className="cartao">
            <strong>{c.nome}</strong>
            <span>{c.email} · {c.materiais.map((m) => NOMES_MATERIAIS[m]).join(', ') || 'sem materiais informados'}</span>
            <button className="botao" type="button" onClick={() => aprovar(`/catadores/${c.id}/aprovar`)}>Aprovar</button>
          </li>
        ))}
      </ul>
      <h2>Pontos pendentes ({pontos.length})</h2>
      <ul className="lista">
        {pontos.map((p) => (
          <li key={p.id} className="cartao">
            <strong>{p.nome}</strong>
            <span>{p.endereco} · {p.modalidade === 'compra' ? 'compra' : 'doação'}</span>
            <span>{p.materiais_aceitos.map((m) => NOMES_MATERIAIS[m]).join(', ')}</span>
            <button className="botao" type="button" onClick={() => aprovar(`/pontos/${p.id}/aprovar`)}>Aprovar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
