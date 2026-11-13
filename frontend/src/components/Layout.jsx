import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const MENUS = {
  morador: [['/morador', 'Início'], ['/morador/classificar', 'Classificar'], ['/morador/mapa', 'Pontos'], ['/morador/coleta', 'Pedir coleta'], ['/morador/carteira', 'Carteira']],
  catador: [['/catador', 'Pedidos'], ['/catador/pontos', 'Meus pontos'], ['/catador/ganhos', 'Ganhos']],
  ponto: [['/ponto', 'Registrar pesagem']],
  admin: [['/admin', 'Aprovações'], ['/admin/indicadores', 'Índice Canal Limpo']],
};

export default function Layout({ children }) {
  const { usuario, sair } = useAuth();
  const itens = usuario ? MENUS[usuario.perfil] || [] : [];
  return (
    <>
      <header className="topo">
        <Link to="/" className="marca" aria-label="Recicla PE, página inicial">
          <img src="/logo.svg" alt="" width="32" height="34" />
          <span>Recicla <strong>PE</strong></span>
        </Link>
        {usuario ? (
          <button type="button" className="botao-texto" onClick={sair}>Sair</button>
        ) : (
          <Link to="/login" className="botao-texto">Entrar</Link>
        )}
      </header>
      {itens.length > 0 && (
        <nav className="menu" aria-label="Menu principal">
          {itens.map(([to, rotulo]) => (
            <NavLink key={to} to={to} end>{rotulo}</NavLink>
          ))}
        </nav>
      )}
      <main className="conteudo">{children}</main>
    </>
  );
}
