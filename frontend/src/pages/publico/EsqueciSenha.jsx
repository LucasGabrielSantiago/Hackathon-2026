import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [resposta, setResposta] = useState(null);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setResposta(null); setEnviando(true);
    try { setResposta(await api('/auth/esqueci-senha', { metodo: 'POST', corpo: { email } })); } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  return (
    <form className="pilha" onSubmit={enviar} style={{ gap: 'var(--espaco-4)', paddingTop: 'var(--espaco-6)' }}>
      <div className="centro pilha" style={{ gap: 6 }}>
        <h1 className="titulo-1">Esqueci minha senha</h1>
        <p className="apoio">Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.</p>
      </div>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor="email">E-mail</label>
        <input className="rp-campo" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {erro && <Alert tipo="erro" titulo="Não foi possível enviar">{erro}</Alert>}
      {resposta && (
        <Alert tipo="sucesso" titulo="Pedido recebido">
          {resposta.mensagem}
          {resposta.link_demo && <> <Link to={resposta.link_demo}>Abrir link de demonstração</Link></>}
        </Alert>
      )}
      <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar link'}</button>
      <p className="apoio centro"><Link to="/login">Voltar para o login</Link></p>
    </form>
  );
}
