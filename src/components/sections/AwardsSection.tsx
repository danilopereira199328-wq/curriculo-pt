import { useCVStore } from '../../store/cvStore';

export function AwardsSection() {
  const { data, addAward, updateAward, removeAward } = useCVStore();

  return (
    <div className="section">
      <h2>🎖️ Prémios & Reconhecimentos</h2>
      <p className="section-description">
        Adiciona prémios académicos, profissionais ou reconhecimentos públicos.
      </p>

      {data.awards.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhum prémio.</p>
          <small>💡 Ex: Melhor Projeto Final, Funcionário do Mês, Menção Honrosa, etc.</small>
        </div>
      )}

      {data.awards.map((award, index) => (
        <div key={award.id} className="dynamic-card">
          <div className="card-header">
            <h3>Prémio {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeAward(award.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Nome do Prémio *</label>
              <input
                type="text"
                value={award.name}
                onChange={(e) => updateAward(award.id, 'name', e.target.value)}
                placeholder="Ex: Melhor Projeto Final 2024"
              />
            </div>

            <div className="form-field">
              <label>Quem Atribuiu</label>
              <input
                type="text"
                value={award.issuer}
                onChange={(e) => updateAward(award.id, 'issuer', e.target.value)}
                placeholder="Ex: Universidade de Lisboa"
              />
            </div>

            <div className="form-field">
              <label>Data</label>
              <input
                type="month"
                value={award.date}
                onChange={(e) => updateAward(award.id, 'date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-field full-width">
            <label>Descrição (opcional)</label>
            <textarea
              value={award.description}
              onChange={(e) => updateAward(award.id, 'description', e.target.value)}
              placeholder="Descreve brevemente o prémio e o motivo..."
              rows={2}
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addAward}>
        + Adicionar Prémio
      </button>
    </div>
  );
}