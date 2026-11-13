import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import Alert from '../../components/common/Alert.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

const PERFIS = [['morador', 'Morador(a)'], ['catador', 'Catador(a)'], ['ponto', 'Ponto de coleta ou cooperativa']];

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [municipios, setMunicipios] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [dados, setDados] = useState({ nome: '', email: '', telefone: '', senha: '', perfil: 'morador', municipio_id: '', bairro_id: '', endereco: '', materiais: [], aceite: false });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { api('/locais/municipios').then((d) => setMunicipios(d.municipios)).catch(() => {}); }, []);
  useEffect(() => {
    api(`/locais/bairros${dados.municipio_id ? `?municipio_id=${dados.municipio_id}` : ''}`).then((d) => setBairros(d.bairros)).catch(() => {});
  }, [dados.municipio_id]);

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const alternarMaterial = (m) => setDados({ ...dados, materiais: dados.materiais.includes(m) ? dados.materiais.filter((x) => x !== m) : [...dados.materiais, m] });

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    if (!dados.aceite) { setErro('Para criar a conta, aceite os termos de uso.'); return; }
    setEnviando(true);
    try {
      const bairroId = Number(dados.bairro_id) || null;
      await cadastrar({ ...dados, bairro_id: bairroId, bairros: bairroId ? [bairroId] : [] });
      navigate('/');
    } catch (err) { setErro(err.message); } finally { setEnviando(false); }
  }

  return (
    <form className="pilha" onSubmit={enviar} style={{ gap: 'var(--espaco-4)' }}>
      <h1 className="titulo-1">Criar conta</h1>
      <fieldset className="rp-card">
        <legend className="rp-rotulo">Eu sou</legend>
        {PERFIS.map(([v, r]) => (
          <label key={v} className="rp-opcao"><input type="radio" name="perfil" value={v} checked={dados.perfil === v} onChange={mudar('perfil')} /> {r}</label>
        ))}
      </fieldset>
      <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="nome">Nome completo</label><input className="rp-campo" id="nome" autoComplete="name" value={dados.nome} onChange={mudar('nome')} required /></div>
      <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="email">E-mail</label><input className="rp-campo" id="email" type="email" autoComplete="email" value={dados.email} onChange={mudar('email')} required /></div>
      <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="telefone">Telefone (opcional)</label><input className="rp-campo" id="telefone" type="tel" autoComplete="tel" inputMode="tel" value={dados.telefone} onChange={mudar('telefone')} /></div>
      <div className="grade-2">
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="municipio">Município</label>
          <select className="rp-campo" id="municipio" value={dados.municipio_id} onChange={(e) => setDados({ ...dados, municipio_id: e.target.value, bairro_id: '' })}>
            <option value="">Todos</option>{municipios.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select></div>
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="bairro">Bairro</label>
          <select className="rp-campo" id="bairro" value={dados.bairro_id} onChange={mudar('bairro_id')} required>
            <option value="">Selecione</option>{bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select></div>
      </div>
      {dados.perfil === 'morador' && (
        <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="endereco">Endereço (opcional)</label><input className="rp-campo" id="endereco" autoComplete="street-address" value={dados.endereco} onChange={mudar('endereco')} /></div>
      )}
      {dados.perfil === 'catador' && (
        <fieldset className="rp-card">
          <legend className="rp-rotulo">Materiais que coleto</legend>
          <div className="grade-2">{Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <label key={m} className="rp-opcao"><input type="checkbox" checked={dados.materiais.includes(m)} onChange={() => alternarMaterial(m)} /> {r}</label>
          ))}</div>
        </fieldset>
      )}
      <div className="rp-campo-grupo"><label className="rp-rotulo" htmlFor="senha">Senha</label><input className="rp-campo" id="senha" type="password" minLength={8} autoComplete="new-password" value={dados.senha} onChange={mudar('senha')} required /><span className="rp-ajuda">Mínimo de 8 caracteres.</span></div>
      <label className="rp-opcao"><input type="checkbox" checked={dados.aceite} onChange={mudar('aceite')} /> Li e aceito os termos de uso e a política de privacidade</label>
      {erro && <Alert tipo="erro" titulo="Não foi possível criar a conta">{erro}</Alert>}
      <button className="rp-btn rp-btn-primario rp-btn-bloco" type="submit" disabled={enviando}>{enviando ? 'Criando…' : 'Criar conta'}</button>
      {dados.perfil !== 'morador' && <p className="apoio centro">Catadores e pontos passam por aprovação antes de receber pedidos.</p>}
      <p className="apoio centro">Já tem conta? <Link to="/login">Entrar</Link></p>
    </form>
  );
}
