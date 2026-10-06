import { useCVStore } from '../../store/cvStore';

export function EducationSection() {
  const { data, addEducation, updateEducation, removeEducation } = useCVStore();

  return (
    <div className="section">
      <h2>🎓 Educação</h2>
      <p className="section-description">
        Adiciona a tua formação académica, começando pela mais recente.
      </p>

      {data.education.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhuma formação.</p>
        </div>
      )}

      {data.education.map((edu, index) => (
        <div key={edu.id} className="dynamic-card">
          <div className="card-header">
            <h3>Formação {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeEducation(edu.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Instituição *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="Ex: Universidade de Lisboa"
              />
            </div>

            <div className="form-field">
              <label>Curso / Grau *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Ex: Licenciatura"
              />
            </div>

            <div className="form-field">
              <label>Área</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                placeholder="Ex: Engenharia Informática"
              />
            </div>

            <div className="form-field">
              <label>Data de Início</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Data de Término</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addEducation}>
        + Adicionar Formação
      </button>
    </div>
  );
}