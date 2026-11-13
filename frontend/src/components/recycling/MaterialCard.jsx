import { NOMES_MATERIAIS, reais } from '../../utils/formatar.js';

const SIGLA = { metal: 'Al', plastico: 'PET', papel: 'Pa', vidro: 'Vi' };

export default function MaterialCard({ material }) {
  return (
    <div className="rp-material">
      <span className={`rp-material-icone rp-material-${material.nome}`} aria-hidden="true">{SIGLA[material.nome]}</span>
      <span className="rp-material-nome">{NOMES_MATERIAIS[material.nome]}</span>
      <span className="rp-material-preco">{reais(material.preco_kg_centavos)}<small>por kg</small></span>
    </div>
  );
}
