import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NOMES_MATERIAIS } from '../utils/formatar.js';

// Ícone próprio (evita o problema dos ícones padrão do Leaflet com o Vite).
const icone = L.icon({ iconUrl: '/logo.svg', iconSize: [28, 30], iconAnchor: [14, 30], popupAnchor: [0, -28] });

export default function MapaPontos({ pontos, centro = [-8.0476, -34.877] }) {
  return (
    <MapContainer center={centro} zoom={12} className="mapa" scrollWheelZoom={false}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pontos.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]} icon={icone}>
          <Popup>
            <strong>{p.nome}</strong><br />
            {p.bairro} · {p.horario}<br />
            {p.materiais_aceitos.map((m) => NOMES_MATERIAIS[m]).join(', ')}<br />
            {p.modalidade === 'compra' ? 'Compra material' : 'Recebe doações'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
