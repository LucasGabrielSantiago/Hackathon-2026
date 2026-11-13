import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icone = L.icon({ iconUrl: '/logo.svg', iconSize: [28, 30], iconAnchor: [14, 30], popupAnchor: [0, -28] });

export default function CollectionMap({ pontos, centro = [-8.0476, -34.877] }) {
  return (
    <MapContainer center={centro} zoom={12} className="mapa-leaflet" scrollWheelZoom={false} aria-label="Mapa dos pontos de coleta">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pontos.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]} icon={icone}>
          <Popup><strong>{p.nome}</strong><br />{p.bairro} · {p.horario}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
