import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ICONE_LOCAL } from './icones.js';
import { CENTRO_RECIFE } from '../../services/mapas.js';

function Centralizar({ pos }) {
  const map = useMap();
  useEffect(() => { if (pos) map.setView([pos.latitude, pos.longitude], Math.max(map.getZoom(), 16)); }, [pos?.latitude, pos?.longitude]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function CliqueNoMapa({ onChange }) {
  useMapEvents({ click: (e) => onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng }) });
  return null;
}

// Mapa para conferir o endereço: toque no mapa ou arraste o pino para ajustar.
export default function SeletorLocal({ valor, onChange }) {
  const centro = valor || CENTRO_RECIFE;
  return (
    <MapContainer center={[centro.latitude, centro.longitude]} zoom={valor ? 16 : 12} className="mapa-leaflet mapa-pequeno" scrollWheelZoom={false} aria-label="Mapa para ajustar a localização">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Centralizar pos={valor} />
      <CliqueNoMapa onChange={onChange} />
      {valor && (
        <Marker
          position={[valor.latitude, valor.longitude]}
          icon={ICONE_LOCAL}
          draggable
          eventHandlers={{ dragend: (e) => { const p = e.target.getLatLng(); onChange({ latitude: p.lat, longitude: p.lng }); } }}
        />
      )}
    </MapContainer>
  );
}
