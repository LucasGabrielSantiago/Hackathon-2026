import { QRCodeSVG } from 'qrcode.react';
import Badge from '../common/Badge.jsx';

export default function QRCodeDisplay({ codigo, titulo = 'Mostre no ponto de coleta', validade }) {
  return (
    <div className="rp-qr">
      <QRCodeSVG value={codigo} size={180} fgColor="#27332D" bgColor="#FFFFFF" title="QR Code de entrega" />
      <p className="rp-card-titulo">{titulo}</p>
      <span className="rp-qr-codigo">{codigo}</span>
      {validade && <Badge tipo="aviso">Válido até {new Date(validade).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · uso único</Badge>}
    </div>
  );
}
