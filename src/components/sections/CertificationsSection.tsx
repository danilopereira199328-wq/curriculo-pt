import { useCVStore } from '../../store/cvStore';

export function CertificationsSection() {
  const { data, addCertification, updateCertification, removeCertification } = useCVStore();

  return (
    <div className="section">
      <h2>🏆 Certificações</h2>
      <p className="section-description">
        Adiciona cursos, certificados e formações complementares.
      </p>

      {data.certifications.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhuma certificação.</p>
        </div>
      )}

      {data.certifications.map((cert, index) => (
        <div key={cert.id} className="dynamic-card">
          <div className="card-header">
            <h3>Certificação {index + 1}</h3>
            <button
              type="button"
              className="card-remove"
              onClick={() => removeCertification(cert.id)}
              title="Remover"
            >
              🗑️
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Nome da Certificação *</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                placeholder="Ex: Google Analytics Certification"
              />
            </div>

            <div className="form-field">
              <label>Emitente *</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                placeholder="Ex: Google"
              />
            </div>

            <div className="form-field">
              <label>Data</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addCertification}>
        + Adicionar Certificação
      </button>
    </div>
  );
}