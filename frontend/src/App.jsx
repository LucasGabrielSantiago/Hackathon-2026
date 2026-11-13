import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import { useAuth } from './context/AuthContext.jsx';

import Home from './pages/publico/Home.jsx';
import Login from './pages/publico/Login.jsx';
import Cadastro from './pages/publico/Cadastro.jsx';
import DashboardMorador from './pages/morador/Dashboard.jsx';
import Classificar from './pages/morador/Classificar.jsx';
import Mapa from './pages/morador/Mapa.jsx';
import SolicitarColeta from './pages/morador/SolicitarColeta.jsx';
import Carteira from './pages/morador/Carteira.jsx';
import PedidosProximos from './pages/catador/PedidosProximos.jsx';
import MeusPontos from './pages/catador/MeusPontos.jsx';
import Ganhos from './pages/catador/Ganhos.jsx';
import RegistrarPesagem from './pages/ponto/RegistrarPesagem.jsx';
import Aprovacoes from './pages/admin/Aprovacoes.jsx';
import Indicadores from './pages/admin/Indicadores.jsx';

const INICIO = { morador: '/morador', catador: '/catador', ponto: '/ponto', admin: '/admin' };

function Inicio() {
  const { usuario } = useAuth();
  if (usuario && INICIO[usuario.perfil]) return <Navigate to={INICIO[usuario.perfil]} replace />;
  return <Home />;
}

const p = (perfis, el) => <RotaProtegida perfis={perfis}>{el}</RotaProtegida>;

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/morador" element={p(['morador'], <DashboardMorador />)} />
        <Route path="/morador/classificar" element={p(['morador'], <Classificar />)} />
        <Route path="/morador/mapa" element={p(['morador'], <Mapa />)} />
        <Route path="/morador/coleta" element={p(['morador'], <SolicitarColeta />)} />
        <Route path="/morador/carteira" element={p(['morador'], <Carteira />)} />

        <Route path="/catador" element={p(['catador'], <PedidosProximos />)} />
        <Route path="/catador/pontos" element={p(['catador'], <MeusPontos />)} />
        <Route path="/catador/ganhos" element={p(['catador'], <Ganhos />)} />

        <Route path="/ponto" element={p(['ponto', 'admin'], <RegistrarPesagem />)} />

        <Route path="/admin" element={p(['admin'], <Aprovacoes />)} />
        <Route path="/admin/indicadores" element={p(['admin'], <Indicadores />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
