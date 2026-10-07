import type { CVData } from '../types/cv';

interface Props {
  data: CVData;
}

export function Modern01({ data }: Props) {
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
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="cv-template modern-01">
      {/* HEADER */}
      <header className="cv-header">
        <div className="cv-header-left">
          {personal.photo && (
            <div className="cv-photo">
              <img src={personal.photo} alt={personal.fullName} />
            </div>
          )}
          <div className="cv-header-info">
            <h1 className="cv-name">{personal.fullName || 'Nome Completo'}</h1>
            <h2 className="cv-job-title">{personal.jobTitle || 'Cargo Profissional'}</h2>
          </div>
        </div>

        <div className="cv-header-contacts">
          {personal.email && (
            <div className="cv-contact-item">
              <span>✉</span> {personal.email}
            </div>
          )}
          {personal.phone && (
            <div className="cv-contact-item">
              <span>☎</span> {personal.phone}
            </div>
          )}
          {personal.location && (
            <div className="cv-contact-item">
              <span>⌂</span> {personal.location}
            </div>
          )}
          {personal.linkedin && (
            <div className="cv-contact-item">
              <span>in</span> {personal.linkedin}
            </div>
          )}
          {personal.website && (
            <div className="cv-contact-item">
              <span>🌐</span> {personal.website}
            </div>
          )}
          {personal.github && (
            <div className="cv-contact-item">
              <span>⌨</span> {personal.github}
            </div>
          )}
        </div>
      </header>

      {/* OBJETIVO */}
      {personal.objective && (
        <section className="cv-section cv-objective">
          <h3 className="cv-section-title">🎯 Objetivo</h3>
          <p>{personal.objective}</p>
        </section>
      )}

      {/* RESUMO */}
      {personal.summary && (
        <section className="cv-section cv-summary">
          <h3 className="cv-section-title">Sobre Mim</h3>
          <p>{personal.summary}</p>
        </section>
      )}

      {/* CONTEÚDO EM 2 COLUNAS */}
      <div className="cv-body">
        {/* COLUNA ESQUERDA */}
        <div className="cv-col-left">
          {experience.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">💼 Experiência</h3>
              {experience.map((exp) => (
                <div key={exp.id} className="cv-item">
                  <div className="cv-item-header">
                    <div>
                      <h4 className="cv-item-title">{exp.position || 'Cargo'}</h4>
                      <div className="cv-item-subtitle">
                        {exp.company}
                        {exp.location && ` · ${exp.location}`}
                      </div>
                    </div>
                    <div className="cv-item-date">
                      {formatDate(exp.startDate)}
                      {exp.current ? ' — Presente' : exp.endDate ? ` — ${formatDate(exp.endDate)}` : ''}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="cv-item-description">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">🎓 Educação</h3>
              {education.map((edu) => (
                <div key={edu.id} className="cv-item">
                  <div className="cv-item-header">
                    <div>
                      <h4 className="cv-item-title">{edu.degree || 'Curso'}</h4>
                      <div className="cv-item-subtitle">
                        {edu.institution}
                        {edu.field && ` · ${edu.field}`}
                      </div>
                    </div>
                    <div className="cv-item-date">
                      {formatDate(edu.startDate)}
                      {edu.endDate ? ` — ${formatDate(edu.endDate)}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">🚀 Projetos</h3>
              {projects.map((proj) => (
                <div key={proj.id} className="cv-item">
                  <h4 className="cv-item-title">{proj.name || 'Projeto'}</h4>
                  {proj.description && (
                    <p className="cv-item-description">{proj.description}</p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="cv-tags">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="cv-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* VOLUNTARIADO */}
          {volunteering.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">🤝 Voluntariado</h3>
              {volunteering.map((vol) => (
                <div key={vol.id} className="cv-item">
                  <div className="cv-item-header">
                    <div>
                      <h4 className="cv-item-title">{vol.role || 'Voluntário'}</h4>
                      <div className="cv-item-subtitle">{vol.organization}</div>
                    </div>
                    <div className="cv-item-date">
                      {formatDate(vol.startDate)}
                      {vol.current ? ' — Presente' : vol.endDate ? ` — ${formatDate(vol.endDate)}` : ''}
                    </div>
                  </div>
                  {vol.description && (
                    <p className="cv-item-description">{vol.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* COLUNA DIREITA */}
        <div className="cv-col-right">
          {skills.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">⚡ Habilidades</h3>
              <div className="cv-skills">
                {skills.map((skill) => (
                  <div key={skill.id} className="cv-skill">
                    <div className="cv-skill-header">
                      <span>{skill.name || 'Habilidade'}</span>
                      <span className="cv-skill-level">{skill.level}/5</span>
                    </div>
                    <div className="cv-skill-bar">
                      <div
                        className="cv-skill-fill"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">🌍 Idiomas</h3>
              <div className="cv-languages">
                {languages.map((lang) => (
                  <div key={lang.id} className="cv-language">
                    <span className="cv-language-name">{lang.name || 'Idioma'}</span>
                    <span className="cv-language-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INFORMAÇÕES */}
          {(personal.availability || personal.hasDrivingLicense || personal.hasCar) && (
            <section className="cv-section">
              <h3 className="cv-section-title">📅 Informações</h3>

              {personal.availability && (
                <div className="cv-info-item">
                  <strong>Disponibilidade:</strong>{' '}
                  {personal.availability === 'Outro'
                    ? personal.availabilityOther
                    : personal.availability}
                </div>
              )}

              {personal.hasDrivingLicense && (
                <div className="cv-info-item">
                  ✓ Carta de condução
                  {personal.drivingLicenseCategory && ` (Categoria ${personal.drivingLicenseCategory})`}
                </div>
              )}

              {personal.hasCar && (
                <div className="cv-info-item">✓ Carro próprio</div>
              )}
            </section>
          )}

          {certifications.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">🏆 Certificações</h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="cv-certification">
                  <div className="cv-cert-name">{cert.name || 'Certificação'}</div>
                  <div className="cv-cert-issuer">{cert.issuer}</div>
                  {cert.date && (
                    <div className="cv-cert-date">{formatDate(cert.date)}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* PRÉMIOS */}
          {awards.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">🎖️ Prémios</h3>
              {awards.map((award) => (
                <div key={award.id} className="cv-certification">
                  <div className="cv-cert-name">{award.name || 'Prémio'}</div>
                  {award.issuer && (
                    <div className="cv-cert-issuer">{award.issuer}</div>
                  )}
                  {award.date && (
                    <div className="cv-cert-date">{formatDate(award.date)}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* REFERÊNCIAS */}
          {references.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-section-title">👥 Referências</h3>
              {references.map((ref) => (
                <div key={ref.id} className="cv-certification">
                  <div className="cv-cert-name">{ref.name || 'Referência'}</div>
                  {ref.position && (
                    <div className="cv-cert-issuer">
                      {ref.position}
                      {ref.company && ` · ${ref.company}`}
                    </div>
                  )}
                  {ref.email && (
                    <div className="cv-cert-date">{ref.email}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {hobbies.length > 0 && hobbies.some((h) => h.name.trim()) && (
            <section className="cv-section">
              <h3 className="cv-section-title">🎨 Hobbies</h3>
              <div className="cv-hobbies">
                {hobbies
                  .filter((h) => h.name.trim())
                  .map((hobby) => (
                    <span key={hobby.id} className="cv-hobby-tag">
                      {hobby.name}
                    </span>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}