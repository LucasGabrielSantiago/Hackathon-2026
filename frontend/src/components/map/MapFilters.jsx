import { NOMES_MATERIAIS } from '../../utils/formatar.js';

export default function MapFilters({ valor, onChange }) {
  const opcoes = [['', 'Todos'], ...Object.entries(NOMES_MATERIAIS)];
  return (
    <div className="rp-chips" role="group" aria-label="Filtrar por material">
      {opcoes.map(([m, r]) => (
        <button key={m || 'todos'} type="button" className={`rp-chip${valor === m ? ' rp-chip-ativo' : ''}`} aria-pressed={valor === m} onClick={() => onChange(m)}>{r}</button>
      ))}
    </div>
  );
}
