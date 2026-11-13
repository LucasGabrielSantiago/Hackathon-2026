import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ICONE_CASA, ICONE_COLETOR } from './icones.js';
import { calcularRota, distanciaM, formatarDistancia, formatarDuracao, linkGoogleMapsRota } from '../../services/mapas.js';

function Enquadrar({ pontos }) {
  const map = useMap();
  const chave = pontos.map((p) => p.join(',')).join('|');
  useEffect(() => { if (pontos.length > 1) map.fitBounds(pontos, { padding: [30, 30] }); }, [chave]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// Mostra a casa do morador (C), o coletor (R) e o caminho entre os dois.
export default function MapaPercurso({ destino, coletor, rotuloColetor = 'Coletor' }) {
  const [rota, setRota] = useState(null);
  const chaveColetor = coletor ? `${coletor.latitude.toFixed(4)},${coletor.longitude.toFixed(4)}` : '';

  useEffect(() => {
    if (!coletor || !destino) { setRota(null); return; }
    let ativo = true;
    calcularRota(coletor, destino).then((r) => ativo && setRota(r)).catch(() => ativo && setRota(null));
    return () => { ativo = false; };
  }, [chaveColetor, destino?.latitude, destino?.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!destino) return <p className="apoio">Endereço sem localização no mapa.</p>;
  const casa = [destino.latitude, destino.longitude];
  const pos = coletor ? [coletor.latitude, coletor.longitude] : null;
  const linha = rota?.pontos || (pos ? [pos, casa] : []);
  const distancia = rota?.distanciaM ?? (coletor ? distanciaM(coletor, destino) : null);

  return (
    <div className="pilha" style={{ gap: 'var(--espaco-2)' }}>
      <MapContainer center={casa} zoom={15} className="mapa-leaflet mapa-pequeno" scrollWheelZoom={false} aria-label="Mapa do percurso do coletor">
        <TileLayer attribution="&copy; OpenStreetMap · rotas OSRM" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={casa} icon={ICONE_CASA} title="Endereço da coleta" />
        {pos && <Marker position={pos} icon={ICONE_COLETOR} title={rotuloColetor} />}
        {linha.length > 1 && <Polyline positions={linha} pathOptions={{ color: '#0F6A86', weight: 5, opacity: 0.8, dashArray: rota ? null : '6 8' }} />}
        <Enquadrar pontos={pos ? [pos, casa] : [casa]} />
      </MapContainer>
      <div className="entre apoio">
        <span>
          {distancia != null
            ? <>A <b>{formatarDistancia(distancia)}</b>{rota && <> · cerca de <b>{formatarDuracao(rota.duracaoS)}</b></>}</>
            : 'Aguardando a localização do coletor…'}
        </span>
        <a href={linkGoogleMapsRota(destino, coletor)} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a>
      </div>
    </div>
  );
}
