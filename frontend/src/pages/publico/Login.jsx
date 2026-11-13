import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Alert from '../../components/common/Alert.jsx';

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setEnviando(true);
    try { await entrar(email, senha); navigate('/'); } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  return (
    <form className="pilha" onSubmit={enviar} style={{ gap: 'var(--espaco-4)', paddingTop: 'var(--espaco-6)' }}>
      <div className="centro pilha" style={{ gap: 6 }}>
        <h1 className="titulo-1">Entrar</h1>
        <p className="apoio">Bem-vindo de volta. Entre para ver sua carteira e seus pedidos.</p>
      </div>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor="email">E-mail</label>
        <input className="rp-campo" id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor="senha">Senha</label>
        <input className="rp-campo" id="senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
      </div>
      {erro && <Alert tipo="erro" titulo="Não foi possível entrar">{erro}</Alert>}
      <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      <p className="apoio centro"><Link to="/esqueci-senha">Esqueci minha senha</Link></p>
      <p className="apoio centro">Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </form>
  );
}
