import { NavLink } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

export default function BottomNavigation({ itens }) {
  return (
    <nav className="rp-nav" aria-label="Menu principal" style={{ gridTemplateColumns: `repeat(${itens.length}, minmax(0, 1fr))` }}>
      {itens.map((i) => (
        <NavLink key={i.to} to={i.to} end className={({ isActive }) => `rp-nav-item${isActive ? ' rp-nav-item-ativo' : ''}`}>
          <Icon name={i.icone} className="" />
          {i.rotulo}
        </NavLink>
      ))}
    </nav>
  );
}
