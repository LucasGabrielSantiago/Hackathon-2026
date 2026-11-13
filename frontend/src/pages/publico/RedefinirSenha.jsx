import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';

export default function RedefinirSenha() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(''); setMsg('');
    if (senha !== confirmacao) { setErro('As senhas não são iguais.'); return; }
    setEnviando(true);
    try { setMsg((await api('/auth/redefinir-senha', { metodo: 'POST', corpo: { token, senha } })).mensagem); } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  if (!token) {
    return (
      <div className="pilha" style={{ paddingTop: 'var(--espaco-6)' }}>
        <Alert tipo="erro" titulo="Link inválido">Peça um novo link em <Link to="/esqueci-senha">Esqueci minha senha</Link>.</Alert>
      </div>
    );
  }

  return (
    <form className="pilha" onSubmit={enviar} style={{ gap: 'var(--espaco-4)', paddingTop: 'var(--espaco-6)' }}>
      <h1 className="titulo-1 centro">Criar nova senha</h1>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor="senha">Nova senha</label>
        <input className="rp-campo" id="senha" type="password" minLength={8} autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <span className="rp-ajuda">Mínimo de 8 caracteres.</span>
      </div>
      <div className="rp-campo-grupo">
        <label className="rp-rotulo" htmlFor="confirmacao">Repita a nova senha</label>
        <input className="rp-campo" id="confirmacao" type="password" minLength={8} autoComplete="new-password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required />
      </div>
      {erro && <Alert tipo="erro" titulo="Não foi possível alterar">{erro}</Alert>}
      {msg && <Alert tipo="sucesso" titulo="Pronto">{msg} <Link to="/login">Entrar</Link></Alert>}
      <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando || Boolean(msg)}>{enviando ? 'Salvando…' : 'Salvar nova senha'}</button>
    </form>
  );
}
