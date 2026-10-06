import { useCVStore } from '../../store/cvStore';

export function ExperienceSection() {
  const { data, addExperience, updateExperience, removeExperience } = useCVStore();

  return (
    <div className="section">
      <h2>💼 Experiência Profissional</h2>
      <p className="section-description">
        Adiciona os teus empregos, começando pelo mais recente.
      </p>

      {data.experience.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhuma experiência.</p>
        </div>
      )}

      {data.experience.map((exp, index) => (
        <div key={exp.id} className="dynamic-card">
          <div className="card-header">
            <h3>Experiência {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeExperience(exp.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Empresa *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                placeholder="Ex: Google Portugal"
              />
            </div>

            <div className="form-field">
              <label>Cargo *</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Ex: Desenvolvedor Front-End"
              />
            </div>

            <div className="form-field">
              <label>Localização</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder="Ex: Lisboa, Portugal"
              />
            </div>

            <div className="form-field">
              <label>Data de Início *</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Data de Término</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                Trabalho aqui atualmente
              </label>
            </div>
          </div>

          <div className="form-field full-width">
            <label>Descrição das Atividades</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              placeholder="• Desenvolvi funcionalidades... &#10;• Implementei testes... &#10;• Colaborei com a equipa..."
              rows={4}
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addExperience}>
        + Adicionar Experiência
      </button>
    </div>
  );
}