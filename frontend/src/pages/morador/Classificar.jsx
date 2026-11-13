import { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api.js';
import Icon from '../../components/common/Icon.jsx';
import Alert from '../../components/common/Alert.jsx';
import ClassificationResult from '../../components/recycling/ClassificationResult.jsx';

const MAX_BYTES = 5 * 1024 * 1024;

export default function Classificar() {
  const [arquivo, setArquivo] = useState(null);
  const [temPrevia, setTemPrevia] = useState(false);
  const canvasRef = useRef(null);
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState(null);
  const [materiais, setMateriais] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => { api('/materiais').then((d) => setMateriais(d.materiais)).catch(() => {}); }, []);

  function escolher(e) {
    const f = e.target.files?.[0];
    setErro('');
    if (!f) return;
    if (f.size > MAX_BYTES) { setErro('A imagem passa de 5 MB. Tire outra foto ou escolha uma menor.'); return; }
    setArquivo(f);
    desenharPrevia(f);
  }

  // Prévia desenhada num canvas: o arquivo do usuário nunca vira src/URL no DOM.
  async function desenharPrevia(f) {
    try {
      const bmp = await createImageBitmap(f);
      const canvas = canvasRef.current;
      const escala = Math.min(1, 720 / bmp.width);
      canvas.width = Math.round(bmp.width * escala);
      canvas.height = Math.round(bmp.height * escala);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
      bmp.close();
      setTemPrevia(true);
    } catch {
      setTemPrevia(false);
    }
  }

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setResultado(null); setCarregando(true);
    const fd = new FormData();
    if (arquivo) fd.append('imagem', arquivo);
    if (texto) fd.append('texto', texto);
    try { setResultado(await api('/classificar', { metodo: 'POST', formData: fd })); } catch (err) { setErro(err.message); } finally { setCarregando(false); }
  }

  const preco = resultado?.material && materiais.find((m) => m.nome === resultado.material);

  return (
    <>
      <h1 className="titulo-1">Classificar resíduo</h1>
      <form className="pilha" onSubmit={enviar}>
        <label className="foto" htmlFor="foto">
          <canvas ref={canvasRef} role="img" aria-label="Foto escolhida" hidden={!temPrevia} />
          {!temPrevia && <><Icon name="camera" /><span>Toque para fotografar ou escolher uma imagem</span></>}
          <input id="foto" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={escolher} />
        </label>
        <div className="divisor">ou descreva o item</div>
        <div className="rp-campo-grupo">
          <label className="rp-rotulo" htmlFor="descricao">Descrição</label>
          <input className="rp-campo" id="descricao" placeholder="garrafa PET de refrigerante" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={300} />
        </div>
        {erro && <Alert tipo="erro" titulo="Não foi possível classificar">{erro}</Alert>}
        <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={carregando || (!arquivo && !texto)}>{carregando ? 'Analisando…' : 'Classificar'}</button>
      </form>
      {resultado && <ClassificationResult resultado={resultado} preco={preco} />}
    </>
  );
}
