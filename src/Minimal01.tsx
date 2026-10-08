import type { CVData } from '../types/cv';

interface Props {
  data: CVData;
}

export function Minimal01({ data }: Props) {
  const {
    personal,
    experience,
    education,
    skills,
    languages,
    certifications,
    projects,
    hobbies,
    references,
    volunteering,
    awards,
  } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="cv-template minimal-01">
      {/* HEADER */}
      <header className="minimal-header">
        {personal.photo && (
          <div className="minimal-photo">
            <img src={personal.photo} alt={personal.fullName} />
          </div>
        )}
        <div className="minimal-header-text">
          <h1 className="minimal-name">{personal.fullName || 'Nome Completo'}</h1>
          <div className="minimal-job-title">{personal.jobTitle || 'Cargo Profissional'}</div>
          <div className="minimal-contacts">
            {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
          </div>
          {(personal.linkedin || personal.website || personal.github) && (
            <div className="minimal-links">
              {[personal.linkedin, personal.website, personal.github].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </header>

      {/* OBJETIVO */}
      {personal.objective && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Objetivo</h2>
          <p>{personal.objective}</p>
        </section>
      )}

      {/* SOBRE MIM */}
      {personal.summary && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Sobre</h2>
          <p>{personal.summary}</p>
        </section>
      )}

      {/* EXPERIÊNCIA */}
      {experience.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Experiência</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="minimal-item">
              <div className="minimal-item-main">
                <div className="minimal-item-title">{exp.position || 'Cargo'}</div>
                <div className="minimal-item-date">
                  {formatDate(exp.startDate)}
                  {exp.current ? ' — Presente' : exp.endDate ? ` — ${formatDate(exp.endDate)}` : ''}
                </div>
              </div>
              <div className="minimal-item-sub">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.description && (
                <p className="minimal-item-desc">{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EDUCAÇÃO */}
      {education.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Educação</h2>
          {education.map((edu) => (
            <div key={edu.id} className="minimal-item">
              <div className="minimal-item-main">
                <div className="minimal-item-title">{edu.degree || 'Curso'}</div>
                <div className="minimal-item-date">
                  {formatDate(edu.startDate)}
                  {edu.endDate ? ` — ${formatDate(edu.endDate)}` : ''}
                </div>
              </div>
              <div className="minimal-item-sub">
                {edu.institution}
                {edu.field ? `, ${edu.field}` : ''}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROJETOS */}
      {projects.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Projetos</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="minimal-item">
              <div className="minimal-item-main">
                <div className="minimal-item-title">{proj.name || 'Projeto'}</div>
                {proj.link && <div className="minimal-item-date">{proj.link}</div>}
              </div>
              {proj.description && (
                <p className="minimal-item-desc">{proj.description}</p>
              )}
              {proj.technologies.length > 0 && (
                <div className="minimal-tags">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className="minimal-tag">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* VOLUNTARIADO */}
      {volunteering.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Voluntariado</h2>
          {volunteering.map((vol) => (
            <div key={vol.id} className="minimal-item">
              <div className="minimal-item-main">
                <div className="minimal-item-title">{vol.role || 'Voluntário'}</div>
                <div className="minimal-item-date">
                  {formatDate(vol.startDate)}
                  {vol.current ? ' — Presente' : vol.endDate ? ` — ${formatDate(vol.endDate)}` : ''}
                </div>
              </div>
              <div className="minimal-item-sub">{vol.organization}</div>
              {vol.description && (
                <p className="minimal-item-desc">{vol.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* HABILIDADES E IDIOMAS - 2 COLUNAS */}
      <div className="minimal-two-cols">
        {skills.length > 0 && (
          <section className="minimal-section">
            <h2 className="minimal-section-title">Competências</h2>
            <ul className="minimal-list">
              {skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </section>
        )}

        {languages.length > 0 && (
          <section className="minimal-section">
            <h2 className="minimal-section-title">Idiomas</h2>
            <ul className="minimal-list">
              {languages.map((lang) => (
                <li key={lang.id}>
                  {lang.name} <span className="minimal-muted">— {lang.level}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* CERTIFICAÇÕES */}
      {certifications.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Certificações</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="minimal-line">
              <strong>{cert.name}</strong>
              {cert.issuer && <span> · {cert.issuer}</span>}
              {cert.date && <span className="minimal-muted"> · {formatDate(cert.date)}</span>}
            </div>
          ))}
        </section>
      )}

      {/* PRÉMIOS */}
      {awards.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Prémios</h2>
          {awards.map((award) => (
            <div key={award.id} className="minimal-line">
              <strong>{award.name}</strong>
              {award.issuer && <span> · {award.issuer}</span>}
              {award.date && <span className="minimal-muted"> · {formatDate(award.date)}</span>}
            </div>
          ))}
        </section>
      )}

      {/* REFERÊNCIAS */}
      {references.length > 0 && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Referências</h2>
          {references.map((ref) => (
            <div key={ref.id} className="minimal-line">
              <strong>{ref.name}</strong>
              {ref.position && <span> · {ref.position}</span>}
              {ref.company && <span> · {ref.company}</span>}
              {ref.email && <span className="minimal-muted"> · {ref.email}</span>}
            </div>
          ))}
        </section>
      )}

      {/* INFORMAÇÕES */}
      {(personal.availability || personal.hasDrivingLicense || personal.hasCar) && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Informações</h2>
          <ul className="minimal-list">
            {personal.availability && (
              <li>Disponibilidade:{' '}
                {personal.availability === 'Outro' ? personal.availabilityOther : personal.availability}
              </li>
            )}
            {personal.hasDrivingLicense && (
              <li>
                Carta de condução
                {personal.drivingLicenseCategory ? ` (${personal.drivingLicenseCategory})` : ''}
              </li>
            )}
            {personal.hasCar && <li>Carro próprio</li>}
          </ul>
        </section>
      )}

      {/* HOBBIES */}
      {hobbies.length > 0 && hobbies.some((h) => h.name.trim()) && (
        <section className="minimal-section">
          <h2 className="minimal-section-title">Interesses</h2>
          <div className="minimal-tags">
            {hobbies.filter((h) => h.name.trim()).map((h) => (
              <span key={h.id} className="minimal-tag">{h.name}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}