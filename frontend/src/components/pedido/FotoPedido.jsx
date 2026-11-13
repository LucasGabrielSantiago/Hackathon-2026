import { useEffect, useRef, useState } from 'react';
import { apiBlob } from '../../services/api.js';

// Foto dos materiais de um pedido. Vem da API com o token do usuário e é desenhada
// num canvas: a imagem nunca vira src/URL no DOM.
export default function FotoPedido({ pedidoId, alt = 'Foto dos materiais do pedido' }) {
  const canvasRef = useRef(null);
  const [estado, setEstado] = useState('carregando');

  useEffect(() => {
    let ativo = true;
    apiBlob(`/pedidos/${pedidoId}/foto`)
      .then((blob) => createImageBitmap(blob))
      .then((bmp) => {
        if (!ativo || !canvasRef.current) return;
        const escala = Math.min(1, 720 / bmp.width);
        const canvas = canvasRef.current;
        canvas.width = Math.round(bmp.width * escala);
        canvas.height = Math.round(bmp.height * escala);
        canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
        bmp.close();
        setEstado('ok');
      })
      .catch(() => ativo && setEstado('erro'));
    return () => { ativo = false; };
  }, [pedidoId]);

  return (
    <div className="foto-pedido">
      <canvas ref={canvasRef} role="img" aria-label={alt} hidden={estado !== 'ok'} />
      {estado === 'carregando' && <p className="apoio">Carregando foto…</p>}
      {estado === 'erro' && <p className="apoio">Foto indisponível.</p>}
    </div>
  );
}
