import Icon from './Icon.jsx';

export default function EmptyState({ titulo, texto, acao }) {
  return (
    <div className="rp-card rp-vazio">
      <div className="rp-vazio-icone"><Icon name="recycle" /></div>
      <p className="rp-card-titulo">{titulo}</p>
      {texto && <p className="rp-card-texto">{texto}</p>}
      {acao}
    </div>
  );
}
