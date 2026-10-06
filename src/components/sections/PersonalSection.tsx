import { useCVStore } from '../../store/cvStore';

export function PersonalSection() {
  const { data, updatePersonal } = useCVStore();
  const { personal } = data;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updatePersonal('photo', event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="section">
      <h2>👤 Dados Pessoais</h2>
      <p className="section-description">
        Preenche as informações básicas que aparecerão no topo do currículo.
      </p>

      <div className="form-grid">
        <div className="form-field">
          <label>Nome Completo *</label>
          <input
            type="text"
            value={personal.fullName}
            onChange={(e) => updatePersonal('fullName', e.target.value)}
            placeholder="Ex: João Silva"
          />
        </div>

        <div className="form-field">
          <label>Cargo / Título Profissional *</label>
          <input
            type="text"
            value={personal.jobTitle}
            onChange={(e) => updatePersonal('jobTitle', e.target.value)}
            placeholder="Ex: Desenvolvedor Front-End"
          />
        </div>

        <div className="form-field">
          <label>Email *</label>
          <input
            type="email"
            value={personal.email}
            onChange={(e) => updatePersonal('email', e.target.value)}
            placeholder="Ex: joao@email.com"
          />
        </div>

        <div className="form-field">
          <label>Telefone *</label>
          <input
            type="tel"
            value={personal.phone}
            onChange={(e) => updatePersonal('phone', e.target.value)}
            placeholder="Ex: +351 912 345 678"
          />
        </div>

        <div className="form-field">
          <label>Localização</label>
          <input
            type="text"
            value={personal.location}
            onChange={(e) => updatePersonal('location', e.target.value)}
            placeholder="Ex: Lisboa, Portugal"
          />
        </div>

        <div className="form-field">
          <label>LinkedIn</label>
          <input
            type="url"
            value={personal.linkedin || ''}
            onChange={(e) => updatePersonal('linkedin', e.target.value)}
            placeholder="Ex: linkedin.com/in/joaosilva"
          />
        </div>

        <div className="form-field">
          <label>Website / Portfolio</label>
          <input
            type="url"
            value={personal.website || ''}
            onChange={(e) => updatePersonal('website', e.target.value)}
            placeholder="Ex: joaosilva.pt"
          />
        </div>

        <div className="form-field">
          <label>GitHub</label>
          <input
            type="url"
            value={personal.github || ''}
            onChange={(e) => updatePersonal('github', e.target.value)}
            placeholder="Ex: github.com/joaosilva"
          />
        </div>
      </div>

      {/* RESUMO PROFISSIONAL */}
      <div className="form-field full-width">
        <label>Resumo Profissional</label>
        <textarea
          value={personal.summary}
          onChange={(e) => updatePersonal('summary', e.target.value)}
          placeholder="Descreve em 2-3 linhas o teu perfil profissional, experiências principais e objetivos..."
          rows={4}
          maxLength={500}
        />
        <small className="char-counter">
          {personal.summary.length}/500 caracteres
        </small>
      </div>

      {/* FOTO */}
      <div className="form-field full-width">
        <label>Foto (opcional)</label>
        <div className="photo-upload-cv">
          {personal.photo ? (
            <div className="photo-preview-cv">
              <img src={personal.photo} alt="Foto" />
              <button
                type="button"
                className="photo-remove-cv"
                onClick={() => updatePersonal('photo', '')}
              >
                ✕ Remover Foto
              </button>
            </div>
          ) : (
            <label className="photo-input-cv">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <span className="photo-btn-cv">📷 Adicionar Foto</span>
              <small>Formatos: JPG, PNG (máx. 5MB)</small>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}