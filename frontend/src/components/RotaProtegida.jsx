import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RotaProtegida({ perfis, children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <p className="status" role="status">Carregando…</p>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (perfis && !perfis.includes(usuario.perfil)) return <Navigate to="/" replace />;
  return children;
}
