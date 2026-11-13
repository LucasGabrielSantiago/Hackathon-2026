import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

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
    <form className="cartao formulario" onSubmit={enviar}>
      <h1>Entrar</h1>
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label htmlFor="senha">Senha</label>
      <input id="senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="botao" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
      <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      <details className="nota">
        <summary>Contas de demonstração</summary>
        <p>morador@, catador@, ponto@ ou admin@reciclape.demo — senha <code>demo1234</code></p>
      </details>
    </form>
  );
}
