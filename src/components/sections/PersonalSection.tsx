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

      {/* OBJETIVO */}
      <div className="form-field full-width">
        <label>🎯 Objetivo Profissional</label>
        <textarea
          value={personal.objective}
          onChange={(e) => updatePersonal('objective', e.target.value)}
          placeholder="Ex: Procuro posição como Desenvolvedor Front-End Júnior em Lisboa..."
          rows={3}
          maxLength={300}
        />
        <small className="char-counter">
          {personal.objective.length}/300 caracteres
        </small>
      </div>

      {/* RESUMO */}
      <div className="form-field full-width">
        <label>Resumo Profissional</label>
        <textarea
          value={personal.summary}
          onChange={(e) => updatePersonal('summary', e.target.value)}
          placeholder="Descreve em 2-3 linhas o teu perfil profissional..."
          rows={4}
          maxLength={500}
        />
        <small className="char-counter">
          {personal.summary.length}/500 caracteres
        </small>
      </div>

      {/* DISPONIBILIDADE */}
      <div className="form-grid">
        <div className="form-field">
          <label>📅 Disponibilidade</label>
          <select
            value={personal.availability}
            onChange={(e) => updatePersonal('availability', e.target.value)}
          >
            <option value="">Selecionar...</option>
            <option value="Imediata">Imediata</option>
            <option value="2 semanas">2 semanas</option>
            <option value="1 mês">1 mês</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {personal.availability === 'Outro' && (
          <div className="form-field">
            <label>Especificar</label>
            <input
              type="text"
              value={personal.availabilityOther}
              onChange={(e) => updatePersonal('availabilityOther', e.target.value)}
              placeholder="Ex: a partir de janeiro 2027"
            />
          </div>
        )}
      </div>

      {/* MOBILIDADE */}
      <div className="form-field full-width">
        <label>🚗 Mobilidade</label>

        <div className="checkbox-group-inline">
          <label className="checkbox-label-inline">
            <input
              type="checkbox"
              checked={personal.hasDrivingLicense}
              onChange={(e) => updatePersonal('hasDrivingLicense', e.target.checked)}
            />
            <span>Tenho carta de condução</span>
          </label>

          <label className="checkbox-label-inline">
            <input
              type="checkbox"
              checked={personal.hasCar}
              onChange={(e) => updatePersonal('hasCar', e.target.checked)}
            />
            <span>Tenho carro próprio</span>
          </label>
        </div>

        {/* CATEGORIA DA CARTA (só aparece se tiver carta) */}
        {personal.hasDrivingLicense && (
          <div className="form-field" style={{ marginTop: '12px' }}>
            <label>Categoria da Carta</label>
            <select
              value={personal.drivingLicenseCategory}
              onChange={(e) => updatePersonal('drivingLicenseCategory', e.target.value)}
            >
              <option value="">Selecionar categoria...</option>
              <optgroup label="Veículos Ligeiros">
                <option value="AM">AM — Ciclomotores</option>
                <option value="A1">A1 — Motociclos até 125cc</option>
                <option value="A2">A2 — Motociclos até 35kW</option>
                <option value="A">A — Motociclos sem limite</option>
                <option value="B1">B1 — Quadriciclos</option>
                <option value="B">B — Automóveis ligeiros</option>
                <option value="BE">BE — Ligeiros com reboque</option>
              </optgroup>
              <optgroup label="Veículos Pesados">
                <option value="C1">C1 — Pesados até 7,5t</option>
                <option value="C">C — Pesados acima de 7,5t</option>
                <option value="C1E">C1E — Pesados até 7,5t com reboque</option>
                <option value="CE">CE — Pesados com reboque</option>
                <option value="D1">D1 — Autocarros até 16 lugares</option>
                <option value="D">D — Autocarros</option>
                <option value="D1E">D1E — Autocarros até 16 lugares com reboque</option>
                <option value="DE">DE — Autocarros com reboque</option>
              </optgroup>
            </select>
          </div>
        )}
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