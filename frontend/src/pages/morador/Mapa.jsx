import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import CollectionMap from '../../components/map/CollectionMap.jsx';
import CollectionPointCard from '../../components/map/CollectionPointCard.jsx';
import MapFilters from '../../components/map/MapFilters.jsx';
import Alert from '../../components/common/Alert.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loading from '../../components/common/Loading.jsx';

export default function Mapa() {
  const [pontos, setPontos] = useState(null);
  const [material, setMaterial] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    setPontos(null);
    api(`/pontos${material ? `?material=${material}` : ''}`).then((d) => setPontos(d.pontos)).catch((e) => { setErro(e.message); setPontos([]); });
  }, [material]);

  return (
    <>
      <h1 className="titulo-1">Pontos de coleta</h1>
      <MapFilters valor={material} onChange={setMaterial} />
      {erro && <Alert tipo="erro" titulo="Não foi possível carregar os pontos">{erro}</Alert>}
      {pontos === null ? <Loading /> : (
        <>
          <CollectionMap pontos={pontos} />
          {pontos.length === 0 && <EmptyState titulo="Nenhum ponto para esse material" texto="Tente outro filtro ou peça a coleta em casa." acao={<Link className="rp-btn rp-btn-primario" to="/morador/coleta">Pedir coleta</Link>} />}
          <div className="pilha">
            {pontos.map((p) => (
              <CollectionPointCard key={p.id} ponto={p} acao={<Link className="rp-btn rp-btn-secundario" to="/morador/carteira?gerar=1">Gerar QR para entregar</Link>} />
            ))}
          </div>
          {pontos.some((p) => p.demo) && <Alert tipo="aviso" titulo="Pontos de demonstração">Os pontos marcados como Demonstração são fictícios.</Alert>}
        </>
      )}
    </>
  );
}
