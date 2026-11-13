// Controle de acesso por perfil (RBAC).
const PERFIS = ['morador', 'catador', 'cooperativa', 'ponto', 'empresa', 'admin', 'gestor_publico'];

function exigirPerfil(...permitidos) {
  return (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ erro: 'NAO_AUTENTICADO', mensagem: 'Faça login para continuar.' });
    if (!permitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: 'SEM_PERMISSAO', mensagem: 'Seu perfil não tem acesso a esta função.' });
    }
    return next();
  };
}

module.exports = { PERFIS, exigirPerfil };
