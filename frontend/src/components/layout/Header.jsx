import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
  const { usuario, sair } = useAuth();
  return (
    <header className="rp-header">
      <Link to="/" className="rp-marca" aria-label="Recicla PE, página inicial">
        <img src="/logo.svg" alt="" width="28" height="28" />
        Recicla <span>PE</span>
      </Link>
      {usuario ? (
        <button type="button" className="rp-btn rp-btn-fantasma" onClick={sair}>Sair</button>
      ) : (
        <Link to="/login" className="rp-btn rp-btn-fantasma">Entrar</Link>
      )}
    </header>
  );
}
