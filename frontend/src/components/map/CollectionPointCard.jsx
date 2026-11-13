import Badge from '../common/Badge.jsx';
import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export default function CollectionPointCard({ ponto, acao }) {
  return (
    <div className="rp-card rp-ponto">
      <div className="rp-ponto-linha"><p className="rp-card-titulo">{ponto.nome}</p>{ponto.bairro && <span className="rp-ponto-dist">{ponto.bairro}</span>}</div>
      <p className="rp-card-texto">{ponto.horario} · {ponto.materiais_aceitos.map((m) => NOMES_MATERIAIS[m]).join(', ')}</p>
      <div className="linha">
        {ponto.modalidade === 'compra' ? <Badge tipo="info">Compra material</Badge> : <Badge tipo="sucesso">Recebe doações</Badge>}
        {ponto.demo && <Badge tipo="aviso">Demonstração</Badge>}
      </div>
      {acao}
    </div>
  );
}
