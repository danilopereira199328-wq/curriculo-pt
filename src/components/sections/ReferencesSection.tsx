import { useCVStore } from '../../store/cvStore';

export function ReferencesSection() {
  const { data, addReference, updateReference, removeReference } = useCVStore();

  return (
    <div className="section">
      <h2>👥 Referências</h2>
      <p className="section-description">
        Adiciona pessoas que podem falar sobre o teu trabalho (chefes, colegas, professores).
      </p>

      {data.references.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhuma referência.</p>
          <small>💡 Dica: Normalmente 2-3 referências são suficientes.</small>
        </div>
      )}

      {data.references.map((ref, index) => (
        <div key={ref.id} className="dynamic-card">
          <div className="card-header">
            <h3>Referência {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeReference(ref.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Nome *</label>
              <input
                type="text"
                value={ref.name}
                onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                placeholder="Ex: Dr. João Silva"
              />
            </div>

            <div className="form-field">
              <label>Cargo</label>
              <input
                type="text"
                value={ref.position}
                onChange={(e) => updateReference(ref.id, 'position', e.target.value)}
                placeholder="Ex: Diretor de Marketing"
              />
            </div>

            <div className="form-field">
              <label>Empresa</label>
              <input
                type="text"
                value={ref.company}
                onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                placeholder="Ex: Google Portugal"
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={ref.email}
                onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                placeholder="Ex: joao@google.com"
              />
            </div>

            <div className="form-field">
              <label>Telefone</label>
              <input
                type="tel"
                value={ref.phone}
                onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                placeholder="Ex: +351 912 345 678"
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addReference}>
        + Adicionar Referência
      </button>
    </div>
  );
}