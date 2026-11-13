import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import Icon from '../../components/common/Icon.jsx';
import { StatusPedido } from '../../components/common/Badge.jsx';
import RecyclingProgress from '../../components/recycling/RecyclingProgress.jsx';
import FotoPedido from '../../components/pedido/FotoPedido.jsx';
import AcompanharColeta from '../../components/pedido/AcompanharColeta.jsx';
import CampoEndereco, { ENDERECO_VAZIO } from '../../components/map/CampoEndereco.jsx';
import { montarEndereco } from '../../services/mapas.js';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

const JANELAS = ['Manhã (8h–12h)', 'Tarde (13h–17h)', 'Noite (18h–20h)'];
const QTD_VAZIA = Object.fromEntries(Object.keys(NOMES_MATERIAIS).map((m) => [m, '']));
const MAX_BYTES = 5 * 1024 * 1024;

export default function SolicitarColeta() {
  const [bairros, setBairros] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ janela_horario: JANELAS[0] });
  const [endereco, setEndereco] = useState(ENDERECO_VAZIO);
  const [qtd, setQtd] = useState(QTD_VAZIA);
  const [foto, setFoto] = useState(null);
  const [temPrevia, setTemPrevia] = useState(false);
  const canvasRef = useRef(null);
  const inputFotoRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregar = () => api('/pedidos/meus').then((d) => setPedidos(d.pedidos.slice().reverse())).catch(() => {});
  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)).catch(() => {}); carregar(); }, []);

  async function escolherFoto(e) {
    const f = e.target.files?.[0];
    setErro('');
    if (!f) return;
    if (f.size > MAX_BYTES) { setErro('A foto passa de 5 MB. Tire outra ou escolha uma menor.'); return; }
    try {
      // Prévia em canvas: o arquivo do usuário nunca vira src/URL no DOM.
      const bmp = await createImageBitmap(f);
      const canvas = canvasRef.current;
      const escala = Math.min(1, 720 / bmp.width);
      canvas.width = Math.round(bmp.width * escala);
      canvas.height = Math.round(bmp.height * escala);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
      bmp.close();
      setTemPrevia(true);
      // Envia a versão reduzida (até 720 px, JPEG): mais rápido no 4G e ocupa menos no banco.
      const reduzida = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.8));
      setFoto(reduzida ? new File([reduzida], 'foto.jpg', { type: 'image/jpeg' }) : f);
    } catch {
      setErro('Não foi possível ler essa imagem. Envie uma foto em JPG, PNG ou WEBP.');
    }
  }

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setMsg('');
    const materiais_estimados = Object.entries(qtd).filter(([, v]) => Number(String(v).replace(',', '.')) > 0)
      .map(([material, v]) => ({ material, quantidade_kg: Number(String(v).replace(',', '.')) }));
    if (!foto) { setErro('Envie uma foto dos materiais para o coletor saber o que vai buscar.'); return; }
    if (materiais_estimados.length === 0) { setErro('Informe a quantidade de pelo menos um material.'); return; }
    if (endereco.latitude == null) { setErro('Localize o endereço no mapa para o coletor encontrar sua casa.'); return; }
    const fd = new FormData();
    fd.append('foto', foto);
    fd.append('materiais_estimados', JSON.stringify(materiais_estimados));
    fd.append('endereco', montarEndereco(endereco));
    fd.append('bairro_id', endereco.bairro_id);
    fd.append('cep', endereco.cep);
    fd.append('latitude', String(endereco.latitude));
    fd.append('longitude', String(endereco.longitude));
    fd.append('janela_horario', form.janela_horario);
    setEnviando(true);
    try {
      await api('/pedidos', { metodo: 'POST', formData: fd });
      setMsg('Avisaremos quando um coletor aceitar.');
      setQtd(QTD_VAZIA); setFoto(null); setTemPrevia(false);
      if (inputFotoRef.current) inputFotoRef.current.value = '';
      carregar();
    } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  const ativos = pedidos.filter((p) => !['entregue', 'cancelado'].includes(p.status));

  return (
    <>
      <h1 className="titulo-1">Pedir coleta em casa</h1>
      {ativos.map((p) => (
        <div key={p.id} className="rp-card">
          <div className="entre"><p className="rp-card-titulo">Pedido #{p.id}</p><StatusPedido status={p.status} /></div>
          <RecyclingProgress status={p.status} />
          {p.status === 'aceito' && <AcompanharColeta pedidoId={p.id} />}
          {p.tem_foto && <FotoPedido pedidoId={p.id} />}
          <p className="rp-card-texto">{p.materiais_estimados.map((m) => `${NOMES_MATERIAIS[m.material] || m.material} ${m.quantidade_kg} kg`).join(' · ')} · {p.janela_horario}</p>
          {p.qr_code && (
            <div className="rp-qr" style={{ padding: 'var(--espaco-4)' }}>
              <QRCodeSVG value={p.qr_code} size={160} fgColor="#27332D" bgColor="#FFFFFF" title="QR Code do pedido" />
              <p className="rp-card-texto">
                {p.status === 'aceito' ? 'O coletor está a caminho. Mostre este código na coleta.' : 'Guarde este código: o coletor vai pedir na hora da coleta.'}
              </p>
              <span className="rp-qr-codigo">{p.qr_code}</span>
            </div>
          )}
        </div>
      ))}

      <h2 className="secao">Novo pedido</h2>
      <form className="pilha" onSubmit={enviar}>
        <div className="rp-campo-grupo">
          <span className="rp-rotulo">Foto dos materiais (obrigatória)</span>
          <label className="foto" htmlFor="foto-pedido">
            <canvas ref={canvasRef} role="img" aria-label="Foto dos materiais escolhida" hidden={!temPrevia} />
            {!temPrevia && <><Icon name="camera" /><span>Toque para fotografar o que vai ser coletado</span></>}
            <input id="foto-pedido" ref={inputFotoRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={escolherFoto} />
          </label>
          <span className="rp-ajuda">Fotografe só os materiais: sem pessoas, documentos ou o número da casa. Os coletores do seu bairro veem esta foto.</span>
        </div>
        <fieldset className="rp-card">
          <legend className="rp-rotulo">Quantidade estimada (kg)</legend>
          {Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <div key={m} className="balanca">
              <label className="rp-opcao" htmlFor={`qtd-${m}`}>{r}</label>
              <input className="rp-campo" id={`qtd-${m}`} inputMode="decimal" placeholder="0" value={qtd[m]} onChange={(e) => setQtd({ ...qtd, [m]: e.target.value })} />
            </div>
          ))}
          <span className="rp-ajuda">Lixo eletrônico: celulares, cabos, carregadores, pilhas e aparelhos pequenos.</span>
        </fieldset>
        <CampoEndereco valor={endereco} onChange={setEndereco} bairros={bairros} id="coleta" />
        <span className="rp-ajuda">Só o coletor que aceitar o pedido vê o endereço e o pino exato.</span>
        <fieldset className="rp-campo-grupo" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="rp-rotulo">Horário</legend>
          <div className="rp-chips">{JANELAS.map((j) => (
            <button key={j} type="button" className={`rp-chip${form.janela_horario === j ? ' rp-chip-ativo' : ''}`} aria-pressed={form.janela_horario === j} onClick={() => setForm({ ...form, janela_horario: j })}>{j}</button>
          ))}</div>
        </fieldset>
        {erro && <Alert tipo="erro" titulo="Não foi possível enviar o pedido">{erro}</Alert>}
        {msg && <Alert tipo="sucesso" titulo="Pedido enviado">{msg}</Alert>}
        <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Solicitar coleta'}</button>
      </form>
    </>
  );
}
