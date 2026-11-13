import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export default function Aprovacoes() {
  const [catadores, setCatadores] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  async function carregar() {
    try {
      setCatadores((await api('/catadores/pendentes')).catadores);
      setPontos((await api('/pontos/pendentes')).pontos);
    } catch (e) { setErro(e.message); }
  }
  useEffect(() => { carregar(); }, []);

  async function aprovar(caminho) {
    setErro('');
    try { await api(caminho, { metodo: 'PATCH' }); carregar(); } catch (e) { setErro(e.message); }
  }

  async function restaurarDemo() {
    if (!window.confirm('Apagar tudo o que foi criado e voltar aos dados de demonstração?')) return;
    setErro('');
    try { setAviso((await api('/admin/resetar-demo', { metodo: 'POST' })).mensagem); carregar(); } catch (e) { setErro(e.message); }
  }

  return (
    <>
      <h1 className="titulo-1">Aprovações</h1>
      {aviso && <Alert tipo="sucesso" titulo="Pronto">{aviso}</Alert>}
      {erro && <Alert tipo="erro" titulo="Algo deu errado">{erro}</Alert>}
      <h2 className="secao">Coletores pendentes <Badge tipo="aviso">{catadores.length}</Badge></h2>
      {catadores.length === 0 ? <EmptyState titulo="Tudo em dia" texto="Nenhum coletor aguardando aprovação." /> : (
        <div className="grade-responsiva">{catadores.map((c) => (
          <div key={c.id} className="rp-card">
            <p className="rp-card-titulo">{c.nome}</p>
            <p className="rp-card-texto">{c.email}</p>
            <p className="rp-card-texto">{c.materiais.map((m) => NOMES_MATERIAIS[m]).join(', ') || 'Sem materiais informados'}</p>
            <button className="rp-btn rp-btn-primario" type="button" onClick={() => aprovar(`/catadores/${c.id}/aprovar`)}>Aprovar</button>
          </div>
        ))}</div>
      )}
      <h2 className="secao">Pontos pendentes <Badge tipo="aviso">{pontos.length}</Badge></h2>
      {pontos.length === 0 ? <EmptyState titulo="Tudo em dia" texto="Nenhum ponto aguardando aprovação." /> : (
        <div className="grade-responsiva">{pontos.map((p) => (
          <div key={p.id} className="rp-card">
            <div className="entre"><p className="rp-card-titulo">{p.nome}</p><Badge tipo="info">{p.modalidade === 'compra' ? 'Compra' : 'Doação'}</Badge></div>
            <p className="rp-card-texto">{p.endereco}</p>
            <p className="rp-card-texto">{p.materiais_aceitos.map((m) => NOMES_MATERIAIS[m]).join(', ')}</p>
            <button className="rp-btn rp-btn-primario" type="button" onClick={() => aprovar(`/pontos/${p.id}/aprovar`)}>Aprovar</button>
          </div>
        ))}</div>
      )}
      <div className="rp-card">
        <p className="rp-card-titulo">Dados de demonstração</p>
        <p className="rp-card-texto">Apaga cadastros, pedidos e entregas criados e volta aos dados iniciais. Use antes de uma apresentação.</p>
        <button className="rp-btn rp-btn-fantasma" type="button" onClick={restaurarDemo}>Restaurar dados de demonstração</button>
      </div>
    </>
  );
}
