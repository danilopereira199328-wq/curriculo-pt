import { useCVStore } from '../../store/cvStore';

const LEVELS = ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'] as const;

export function LanguagesSection() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useCVStore();

  return (
    <div className="section">
      <h2>🌍 Idiomas</h2>
      <p className="section-description">
        Adiciona os idiomas que falas e o teu nível.
      </p>

      {data.languages.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhum idioma.</p>
        </div>
      )}

      {data.languages.map((lang) => (
        <div key={lang.id} className="language-item">
          <input
            type="text"
            value={lang.name}
            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
            placeholder="Ex: Inglês"
            className="language-name-input"
          />

          <select
            value={lang.level}
            onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
            className="language-level-select"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="language-remove"
            onClick={() => removeLanguage(lang.id)}
            title="Remover"
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addLanguage}>
        + Adicionar Idioma
      </button>
    </div>
  );
}