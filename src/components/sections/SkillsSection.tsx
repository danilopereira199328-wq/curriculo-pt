import { useCVStore } from '../../store/cvStore';

export function SkillsSection() {
  const { data, addSkill, updateSkill, removeSkill } = useCVStore();

  return (
    <div className="section">
      <h2>⚡ Habilidades</h2>
      <p className="section-description">
        Adiciona as tuas competências técnicas e pessoais.
      </p>

      {data.skills.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhuma habilidade.</p>
        </div>
      )}

      <div className="skills-list">
        {data.skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              placeholder="Ex: JavaScript"
              className="skill-name-input"
            />

            <div className="skill-level">
              <input
                type="range"
                min="1"
                max="5"
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, 'level', Number(e.target.value))}
                className="skill-range"
              />
              <span className="skill-level-label">{skill.level}/5</span>
            </div>

            <button
              type="button"
              className="skill-remove"
              onClick={() => removeSkill(skill.id)}
              title="Remover"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn-add" onClick={addSkill}>
        + Adicionar Habilidade
      </button>
    </div>
  );
}