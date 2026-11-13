import Header from './Header.jsx';
import BottomNavigation from './BottomNavigation.jsx';
import Sidebar from './Sidebar.jsx';
import { NAVEGACAO } from './navegacao.js';
import { useAuth } from '../../context/AuthContext.jsx';

// Mobile-first: barra inferior no celular; admin ganha menu lateral no desktop.
export default function AppLayout({ children }) {
  const { usuario } = useAuth();
  const itens = usuario ? NAVEGACAO[usuario.perfil] || [] : [];
  const comSidebar = usuario?.perfil === 'admin';
  return (
    <div className={`app${comSidebar ? ' app-com-sidebar' : ''}`}>
      <Header />
      <div className="app-corpo">
        {itens.length > 0 && <Sidebar itens={itens} />}
        <main className={`conteudo${itens.length ? '' : ' conteudo-publico'}`}>{children}</main>
      </div>
      {itens.length > 0 && <BottomNavigation itens={itens} />}
    </div>
  );
}
