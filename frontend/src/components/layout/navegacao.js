// Destinos de navegação por perfil (RBAC: nenhum perfil vê itens de outro).
export const NAVEGACAO = {
  morador: [
    { to: '/morador', icone: 'home', rotulo: 'Início' },
    { to: '/morador/classificar', icone: 'camera', rotulo: 'Classificar' },
    { to: '/morador/mapa', icone: 'pin', rotulo: 'Pontos' },
    { to: '/morador/coleta', icone: 'truck', rotulo: 'Coleta' },
    { to: '/morador/carteira', icone: 'wallet', rotulo: 'Carteira' },
  ],
  catador: [
    { to: '/catador', icone: 'list', rotulo: 'Pedidos' },
    { to: '/catador/coletas', icone: 'box', rotulo: 'Coletas' },
    { to: '/catador/pontos', icone: 'pin', rotulo: 'Meus pontos' },
    { to: '/catador/ganhos', icone: 'coin', rotulo: 'Ganhos' },
  ],
  ponto: [
    { to: '/ponto', icone: 'scan', rotulo: 'Receber' },
    { to: '/ponto/entregas', icone: 'check', rotulo: 'Entregas' },
  ],
  admin: [
    { to: '/admin', icone: 'shield', rotulo: 'Aprovações' },
    { to: '/admin/indicadores', icone: 'chart', rotulo: 'Índice Canal Limpo' },
  ],
};
