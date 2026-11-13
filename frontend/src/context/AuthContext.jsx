import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then((d) => setUsuario(d.usuario))
      .catch(() => setToken(null))
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(email, senha) {
    const d = await api('/auth/login', { metodo: 'POST', corpo: { email, senha } });
    setToken(d.token);
    setUsuario(d.usuario);
    return d.usuario;
  }

  async function cadastrar(dados) {
    const d = await api('/auth/cadastro', { metodo: 'POST', corpo: dados });
    setToken(d.token);
    setUsuario(d.usuario);
    return d.usuario;
  }

  function sair() {
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
