import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { api } from '../../services/api.js';
import { calcularRota, linkGoogleMapsRota } from '../../services/mapas.js';

const MapaPercurso = lazy(() => import('../map/MapaPercurso.jsx'));
const ENVIO_MIN_MS = 8000;

// Tela do coletor: compartilha a posição com o morador enquanto vai até a coleta.
export default function RotaColetor({ pedido }) {
  const destino = pedido.latitude != null ? { latitude: pedido.latitude, longitude: pedido.longitude } : null;
  const [posicao, setPosicao] = useState(null);
  const [modo, setModo] = useState('parado'); // parado | gps | simulando
  const [aviso, setAviso] = useState('');
  const watchRef = useRef(null);
  const simRef = useRef(null);
  const ultimoEnvio = useRef(0);

  const enviar = (pos, forcar = false) => {
    setPosicao(pos);
    if (!forcar && Date.now() - ultimoEnvio.current < ENVIO_MIN_MS) return;
    ultimoEnvio.current = Date.now();
    api(`/pedidos/${pedido.id}/localizacao`, { metodo: 'POST', corpo: pos }).catch((e) => setAviso(e.message));
  };

  const parar = () => {
    if (watchRef.current != null) navigator.geolocation?.clearWatch(watchRef.current);
    if (simRef.current) clearInterval(simRef.current);
    watchRef.current = null; simRef.current = null; setModo('parado');
  };
  useEffect(() => parar, []); // eslint-disable-line react-hooks/exhaustive-deps

  function compartilhar() {
    if (!navigator.geolocation) { setAviso('Seu aparelho não informa a localização.'); return; }
    parar(); setAviso(''); setModo('gps');
    watchRef.current = navigator.geolocation.watchPosition(
      (p) => enviar({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      () => { setAviso('Permita o acesso à localização para o morador acompanhar.'); parar(); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }

  // Demonstração: sai de ~2 km e percorre a rota real até o endereço.
  async function simular() {
    if (!destino) return;
    parar(); setAviso(''); setModo('simulando');
    const partida = { latitude: destino.latitude + 0.012, longitude: destino.longitude - 0.012 };
    let pontos;
    try { pontos = (await calcularRota(partida, destino)).pontos; } catch { pontos = [[partida.latitude, partida.longitude], [destino.latitude, destino.longitude]]; }
    const passos = Math.min(20, pontos.length);
    const trajeto = Array.from({ length: passos }, (_, i) => pontos[Math.round((i * (pontos.length - 1)) / (passos - 1))]);
    let i = 0;
    enviar({ latitude: trajeto[0][0], longitude: trajeto[0][1] }, true);
    simRef.current = setInterval(() => {
      i += 1;
      if (i >= trajeto.length) { parar(); setAviso('Chegou ao endereço. Peça o QR Code ao morador.'); return; }
      enviar({ latitude: trajeto[i][0], longitude: trajeto[i][1] }, true);
    }, 3000);
  }

  if (!destino) return <p className="apoio">Endereço sem localização no mapa.</p>;
  return (
    <div className="pilha" style={{ gap: 'var(--espaco-2)' }}>
      <Suspense fallback={<p className="apoio">Carregando mapa…</p>}>
        <MapaPercurso destino={destino} coletor={posicao} rotuloColetor="Você" />
      </Suspense>
      <a className="rp-btn rp-btn-primario rp-btn-bloco" href={linkGoogleMapsRota(destino, posicao)} target="_blank" rel="noopener noreferrer">Navegar com o Google Maps</a>
      {modo === 'parado' ? (
        <div className="linha">
          <button className="rp-btn rp-btn-secundario" type="button" onClick={compartilhar} style={{ flex: 1 }}>Compartilhar minha localização</button>
          <button className="rp-btn rp-btn-fantasma" type="button" onClick={simular} style={{ flex: 1 }}>Simular trajeto (demo)</button>
        </div>
      ) : (
        <button className="rp-btn rp-btn-fantasma rp-btn-bloco" type="button" onClick={parar}>
          {modo === 'gps' ? 'Parar de compartilhar a localização' : 'Parar simulação'}
        </button>
      )}
      <p className="rp-ajuda" role="status">{aviso || (modo === 'gps' ? 'O morador está vendo você no mapa.' : modo === 'simulando' ? 'Simulando o percurso para a demonstração…' : 'O morador só vê sua posição enquanto você está a caminho.')}</p>
    </div>
  );
}
