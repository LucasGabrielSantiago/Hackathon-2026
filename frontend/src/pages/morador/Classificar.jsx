import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

const MAX_BYTES = 5 * 1024 * 1024;

export default function Classificar() {
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState('');
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState(null);
  const [materiais, setMateriais] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => { api('/materiais').then((d) => setMateriais(d.materiais)).catch(() => {}); }, []);
  useEffect(() => () => previa && URL.revokeObjectURL(previa), [previa]);

  function escolher(e) {
    const f = e.target.files?.[0];
    setErro('');
    if (!f) return;
    if (f.size > MAX_BYTES) { setErro('Imagem acima de 5 MB.'); return; }
    setArquivo(f);
    setPrevia(URL.createObjectURL(f));
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
    <section>
      <h1>Classificar resíduo</h1>
      <form className="cartao formulario" onSubmit={enviar}>
        <label htmlFor="foto">Foto do resíduo</label>
        <input id="foto" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={escolher} />
        {previa && <img src={previa} alt="Prévia da foto escolhida" className="previa" />}
        <label htmlFor="descricao">Ou descreva o item</label>
        <input id="descricao" placeholder="Ex.: garrafa PET de refrigerante" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={300} />
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="botao" type="submit" disabled={carregando || (!arquivo && !texto)}>{carregando ? 'Analisando…' : 'Classificar'}</button>
      </form>

      {resultado && (
        <div className="cartao resultado" aria-live="polite">
          {resultado.material ? (
            <>
              <h2>{NOMES_MATERIAIS[resultado.material]}{resultado.categoria ? ` · ${resultado.categoria}` : ''}</h2>
              <p className={resultado.reciclavel ? 'ok' : 'erro'}>{resultado.reciclavel ? '✅ Reciclável' : '⚠️ Normalmente não reciclável'}</p>
              <p>Confiança: {Math.round(resultado.confianca * 100)}% {resultado.fonte === 'reserva' && '(sem IA)'}</p>
              {resultado.orientacoes.length > 0 && <ul>{resultado.orientacoes.map((o) => <li key={o}>{o}</li>)}</ul>}
              {preco && resultado.reciclavel && <p>Referência: <strong>{reais(preco.preco_kg_centavos)}/kg</strong> (valor demonstrativo; o valor final sai da pesagem no ponto).</p>}
            </>
          ) : <h2>Não identificado</h2>}
          <p className="nota">{resultado.observacao}</p>
          <div className="acoes">
            <Link to="/morador/mapa" className="botao">Ver pontos</Link>
            <Link to="/morador/coleta" className="botao secundario">Pedir coleta</Link>
          </div>
        </div>
      )}
    </section>
  );
}
