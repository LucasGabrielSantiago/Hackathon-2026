import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './common/Loading.jsx';

export default function RotaProtegida({ perfis, children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <Loading />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (perfis && !perfis.includes(usuario.perfil)) return <Navigate to="/" replace />;
  return children;
}
