import { useCVStore } from '../../store/cvStore';

export function VolunteeringSection() {
  const { data, addVolunteering, updateVolunteering, removeVolunteering } = useCVStore();

  return (
    <div className="section">
      <h2>🤝 Voluntariado</h2>
      <p className="section-description">
        Adiciona trabalho voluntário. Mostra os teus valores e compromisso social.
      </p>

      {data.volunteering.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhum voluntariado.</p>
          <small>💡 Ex: Cruz Vermelha, Banco Alimentar, Associações locais, etc.</small>
        </div>
      )}

      {data.volunteering.map((vol, index) => (
        <div key={vol.id} className="dynamic-card">
          <div className="card-header">
            <h3>Voluntariado {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeVolunteering(vol.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Organização *</label>
              <input
                type="text"
                value={vol.organization}
                onChange={(e) => updateVolunteering(vol.id, 'organization', e.target.value)}
                placeholder="Ex: Cruz Vermelha Portuguesa"
              />
            </div>

            <div className="form-field">
              <label>Função / Papel</label>
              <input
                type="text"
                value={vol.role}
                onChange={(e) => updateVolunteering(vol.id, 'role', e.target.value)}
                placeholder="Ex: Voluntário de Recolha de Alimentos"
              />
            </div>

            <div className="form-field">
              <label>Data de Início</label>
              <input
                type="month"
                value={vol.startDate}
                onChange={(e) => updateVolunteering(vol.id, 'startDate', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Data de Término</label>
              <input
                type="month"
                value={vol.endDate}
                onChange={(e) => updateVolunteering(vol.id, 'endDate', e.target.value)}
                disabled={vol.current}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vol.current}
                  onChange={(e) => updateVolunteering(vol.id, 'current', e.target.checked)}
                />
                Faço voluntariado atualmente
              </label>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Descrição das Atividades</label>
            <textarea
              value={vol.description}
              onChange={(e) => updateVolunteering(vol.id, 'description', e.target.value)}
              placeholder="• Recolha de alimentos... &#10;• Apoio a famílias carenciadas... &#10;• Organização de eventos..."
              rows={3}
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addVolunteering}>
        + Adicionar Voluntariado
      </button>
    </div>
  );
}