import { lazy, Suspense, useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import Alert from '../common/Alert.jsx';

const MapaPercurso = lazy(() => import('../map/MapaPercurso.jsx'));
const INTERVALO_MS = 5000;

// Tela do morador: quem aceitou e por onde o coletor está vindo (atualiza a cada 5 s).
export default function AcompanharColeta({ pedidoId }) {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    let ativo = true;
    const buscar = () => api(`/pedidos/${pedidoId}/acompanhamento`).then((d) => ativo && setDados(d)).catch(() => {});
    buscar();
    const t = setInterval(buscar, INTERVALO_MS);
    return () => { ativo = false; clearInterval(t); };
  }, [pedidoId]);

  if (!dados || dados.status !== 'aceito') return null;
  const hora = dados.aceito_em && new Date(dados.aceito_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const atualizado = dados.coletor_posicao && Math.round((Date.now() - new Date(dados.coletor_posicao.atualizado_em)) / 1000);

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-2)' }}>
      <Alert tipo="sucesso" titulo={`${dados.coletor_nome || 'Um coletor'} aceitou sua coleta${hora ? ` às ${hora}` : ''}`}>
        {dados.coletor_posicao ? `Está a caminho. Posição atualizada há ${atualizado} s.` : 'Assim que sair, você acompanha o percurso aqui.'}
      </Alert>
      <Suspense fallback={<p className="apoio">Carregando mapa…</p>}>
        <MapaPercurso destino={dados.destino} coletor={dados.coletor_posicao} rotuloColetor={dados.coletor_nome} />
      </Suspense>
    </div>
  );
}
