import L from 'leaflet';

const pino = (cor, letra) => L.divIcon({
  className: 'pino-mapa',
  html: `<span style="background:${cor}"><b>${letra}</b></span>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

export const ICONE_CASA = pino('#116437', 'C');
export const ICONE_COLETOR = pino('#0F6A86', 'R');
export const ICONE_LOCAL = pino('#116437', '');
