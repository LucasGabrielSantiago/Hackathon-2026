import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [bairros, setBairros] = useState([]);
  const [dados, setDados] = useState({ nome: '', email: '', telefone: '', senha: '', perfil: 'morador', bairro_id: '', endereco: '', materiais: [] });
  const [erro, setErro] = useState('');

  useEffect(() => { api('/locais/bairros').then((d) => setBairros(d.bairros)).catch(() => {}); }, []);

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });
  const alternarMaterial = (m) => setDados({ ...dados, materiais: dados.materiais.includes(m) ? dados.materiais.filter((x) => x !== m) : [...dados.materiais, m] });

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    try {
      const bairroId = Number(dados.bairro_id) || null;
      await cadastrar({ ...dados, bairro_id: bairroId, bairros: bairroId ? [bairroId] : [] });
      navigate('/');
    } catch (err) { setErro(err.message); }
  }

  return (
    <form className="cartao formulario" onSubmit={enviar}>
      <h1>Criar conta</h1>
      <fieldset>
        <legend>Eu sou</legend>
        {[['morador', 'Morador(a)'], ['catador', 'Catador(a)'], ['ponto', 'Ponto de coleta']].map(([v, r]) => (
          <label key={v} className="opcao"><input type="radio" name="perfil" value={v} checked={dados.perfil === v} onChange={mudar('perfil')} /> {r}</label>
        ))}
      </fieldset>
      <label htmlFor="nome">Nome</label>
      <input id="nome" value={dados.nome} onChange={mudar('nome')} required autoComplete="name" />
      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" value={dados.email} onChange={mudar('email')} required autoComplete="email" />
      <label htmlFor="telefone">Telefone (opcional)</label>
      <input id="telefone" type="tel" value={dados.telefone} onChange={mudar('telefone')} autoComplete="tel" />
      <label htmlFor="senha">Senha (mínimo 8 caracteres)</label>
      <input id="senha" type="password" minLength={8} value={dados.senha} onChange={mudar('senha')} required autoComplete="new-password" />
      <label htmlFor="bairro">Bairro</label>
      <select id="bairro" value={dados.bairro_id} onChange={mudar('bairro_id')} required>
        <option value="">Selecione</option>
        {bairros.map((b) => <option key={b.id} value={b.id}>{b.nome}</option>)}
      </select>
      {dados.perfil === 'catador' && (
        <fieldset>
          <legend>Materiais que coleto</legend>
          {Object.entries(NOMES_MATERIAIS).map(([m, r]) => (
            <label key={m} className="opcao"><input type="checkbox" checked={dados.materiais.includes(m)} onChange={() => alternarMaterial(m)} /> {r}</label>
          ))}
          <p className="nota">Seu cadastro passa por aprovação antes de receber pedidos.</p>
        </fieldset>
      )}
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="botao" type="submit">Criar conta</button>
    </form>
  );
}
