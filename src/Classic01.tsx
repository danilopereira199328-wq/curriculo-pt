import type { CVData } from '../types/cv';

interface Props {
  data: CVData;
}

export function Classic01({ data }: Props) {
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
    <div className="cv-template classic-01">
      {/* HEADER */}
      <header className="classic-header">
        <h1 className="classic-name">{personal.fullName || 'Nome Completo'}</h1>
        {personal.jobTitle && (
          <h2 className="classic-job-title">{personal.jobTitle}</h2>
        )}
        <div className="classic-contacts">
          {[
            personal.email,
            personal.phone,
            personal.location,
            personal.linkedin,
            personal.website,
            personal.github,
          ]
            .filter(Boolean)
            .join('  ·  ')}
        </div>
      </header>

      <div className="classic-separator" />

      {/* OBJETIVO */}
      {personal.objective && (
        <section className="classic-section">
          <h3 className="classic-section-title">Objetivo Profissional</h3>
          <p className="classic-text">{personal.objective}</p>
        </section>
      )}

      {/* SOBRE MIM */}
      {personal.summary && (
        <section className="classic-section">
          <h3 className="classic-section-title">Sobre Mim</h3>
          <p className="classic-text">{personal.summary}</p>
        </section>
      )}

      {/* EXPERIÊNCIA */}
      {experience.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Experiência Profissional</h3>
          {experience.map((exp) => (
            <div key={exp.id} className="classic-item">
              <div className="classic-item-row">
                <strong className="classic-item-title">{exp.position || 'Cargo'}</strong>
                <span className="classic-item-date">
                  {formatDate(exp.startDate)}
                  {exp.current ? ' — Presente' : exp.endDate ? ` — ${formatDate(exp.endDate)}` : ''}
                </span>
              </div>
              <div className="classic-item-subtitle">
                {exp.company}
                {exp.location && ` — ${exp.location}`}
              </div>
              {exp.description && (
                <p className="classic-item-description">{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EDUCAÇÃO */}
      {education.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Educação</h3>
          {education.map((edu) => (
            <div key={edu.id} className="classic-item">
              <div className="classic-item-row">
                <strong className="classic-item-title">{edu.degree || 'Curso'}</strong>
                <span className="classic-item-date">
                  {formatDate(edu.startDate)}
                  {edu.endDate ? ` — ${formatDate(edu.endDate)}` : ''}
                </span>
              </div>
              <div className="classic-item-subtitle">
                {edu.institution}
                {edu.field && ` — ${edu.field}`}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROJETOS */}
      {projects.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Projetos</h3>
          {projects.map((proj) => (
            <div key={proj.id} className="classic-item">
              <strong className="classic-item-title">{proj.name || 'Projeto'}</strong>
              {proj.description && (
                <p className="classic-item-description">{proj.description}</p>
              )}
              {proj.technologies.length > 0 && (
                <p className="classic-item-subtitle">
                  Tecnologias: {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* VOLUNTARIADO */}
      {volunteering.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Voluntariado</h3>
          {volunteering.map((vol) => (
            <div key={vol.id} className="classic-item">
              <div className="classic-item-row">
                <strong className="classic-item-title">{vol.role || 'Voluntário'}</strong>
                <span className="classic-item-date">
                  {formatDate(vol.startDate)}
                  {vol.current ? ' — Presente' : vol.endDate ? ` — ${formatDate(vol.endDate)}` : ''}
                </span>
              </div>
              <div className="classic-item-subtitle">{vol.organization}</div>
              {vol.description && (
                <p className="classic-item-description">{vol.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* HABILIDADES */}
      {skills.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Competências</h3>
          <p className="classic-text">
            {skills.map((s) => s.name).filter(Boolean).join('  ·  ')}
          </p>
        </section>
      )}

      {/* IDIOMAS */}
      {languages.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Idiomas</h3>
          {languages.map((lang) => (
            <div key={lang.id} className="classic-inline">
              <strong>{lang.name}</strong> — {lang.level}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICAÇÕES */}
      {certifications.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Certificações</h3>
          {certifications.map((cert) => (
            <div key={cert.id} className="classic-item">
              <div className="classic-item-row">
                <strong className="classic-item-title">{cert.name || 'Certificação'}</strong>
                {cert.date && (
                  <span className="classic-item-date">{formatDate(cert.date)}</span>
                )}
              </div>
              {cert.issuer && (
                <div className="classic-item-subtitle">{cert.issuer}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* PRÉMIOS */}
      {awards.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Prémios</h3>
          {awards.map((award) => (
            <div key={award.id} className="classic-item">
              <div className="classic-item-row">
                <strong className="classic-item-title">{award.name || 'Prémio'}</strong>
                {award.date && (
                  <span className="classic-item-date">{formatDate(award.date)}</span>
                )}
              </div>
              {award.issuer && (
                <div className="classic-item-subtitle">{award.issuer}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* REFERÊNCIAS */}
      {references.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-title">Referências</h3>
          {references.map((ref) => (
            <div key={ref.id} className="classic-item">
              <strong className="classic-item-title">{ref.name}</strong>
              {(ref.position || ref.company) && (
                <div className="classic-item-subtitle">
                  {ref.position}
                  {ref.position && ref.company ? ' — ' : ''}
                  {ref.company}
                </div>
              )}
              <div className="classic-item-subtitle">
                {[ref.email, ref.phone].filter(Boolean).join('  ·  ')}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* INFORMAÇÕES ADICIONAIS */}
      {(personal.availability || personal.hasDrivingLicense || personal.hasCar) && (
        <section className="classic-section">
          <h3 className="classic-section-title">Informações Adicionais</h3>
          {personal.availability && (
            <div className="classic-inline">
              <strong>Disponibilidade:</strong>{' '}
              {personal.availability === 'Outro' ? personal.availabilityOther : personal.availability}
            </div>
          )}
          {personal.hasDrivingLicense && (
            <div className="classic-inline">
              <strong>Carta de condução:</strong> Sim
              {personal.drivingLicenseCategory ? ` (Categoria ${personal.drivingLicenseCategory})` : ''}
            </div>
          )}
          {personal.hasCar && (
            <div className="classic-inline">
              <strong>Carro próprio:</strong> Sim
            </div>
          )}
        </section>
      )}

      {/* HOBBIES */}
      {hobbies.length > 0 && hobbies.some((h) => h.name.trim()) && (
        <section className="classic-section">
          <h3 className="classic-section-title">Interesses</h3>
          <p className="classic-text">
            {hobbies.filter((h) => h.name.trim()).map((h) => h.name).join('  ·  ')}
          </p>
        </section>
      )}
    </div>
  );
}