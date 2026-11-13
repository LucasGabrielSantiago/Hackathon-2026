import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

// Menu lateral: só aparece a partir de 1024px (ver styles/app.css).
export default function Sidebar({ itens }) {
  return (
    <nav className="rp-sidebar" aria-label="Menu lateral">
      {itens.map((i) => (
        <NavLink key={i.to} to={i.to} end className={({ isActive }) => `rp-sidebar-item${isActive ? ' rp-sidebar-item-ativo' : ''}`}>
          <Icon name={i.icone} />
          {i.rotulo}
        </NavLink>
      ))}
    </nav>
  );
}
