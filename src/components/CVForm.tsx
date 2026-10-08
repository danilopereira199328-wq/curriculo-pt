import { useCVStore } from '../store/cvStore';
import { PersonalSection } from './sections/PersonalSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';
import { CertificationsSection } from './sections/CertificationsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { HobbiesSection } from './sections/HobbiesSection';
import { ReferencesSection } from './sections/ReferencesSection';
import { VolunteeringSection } from './sections/VolunteeringSection';
import { AwardsSection } from './sections/AwardsSection';
import { templates } from '../templates';
import { ColorPicker } from './ColorPicker';
import type { TemplateType } from '../types/cv';

export function CVForm() {
  const { step, setStep, template, setTemplate, data, setData } = useCVStore();

  const sections = [
    { id: 1, label: '👤 Pessoal', component: PersonalSection },
    { id: 2, label: '💼 Experiência', component: ExperienceSection },
    { id: 3, label: '🎓 Educação', component: EducationSection },
    { id: 4, label: '⚡ Habilidades', component: SkillsSection },
    { id: 5, label: '🌍 Idiomas', component: LanguagesSection },
    { id: 6, label: '🏆 Certificações', component: CertificationsSection },
    { id: 7, label: '🚀 Projetos', component: ProjectsSection },
    { id: 8, label: '🎨 Hobbies', component: HobbiesSection },
    { id: 9, label: '👥 Referências', component: ReferencesSection },
    { id: 10, label: '🤝 Voluntariado', component: VolunteeringSection },
    { id: 11, label: '🎖️ Prémios', component: AwardsSection },
  ];

  const CurrentSection = sections[step - 1]?.component || PersonalSection;

  return (
    <div className="cv-form">
      {/* SELETOR DE TEMPLATE */}
      <div className="template-selector">
        <span className="template-label">🎨 Template:</span>
        <div className="template-buttons">
          {Object.values(templates).map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              className={`template-btn ${template === tpl.id ? 'active' : ''}`}
              onClick={() => setTemplate(tpl.id as TemplateType)}
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* 👇 NOVO — COR DE DESTAQUE */}
      <div className="mt-4 max-w-md">
        <ColorPicker
          value={data.theme?.accentColor || '#0066FF'}
          onChange={(color) =>
            setData({
              ...data,
              theme: { ...(data.theme || {}), accentColor: color },
            })
          }
        />
      </div>

      {/* NAVEGAÇÃO DAS SECÇÕES */}
      <div className="steps-nav">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`step-btn ${step === sec.id ? 'active' : ''}`}
            onClick={() => setStep(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div className="step-content">
        <CurrentSection />
      </div>

      <div className="step-navigation">
        <button
          type="button"
          className="btn-nav btn-prev"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          ← Anterior
        </button>

        <span className="step-indicator">
          {step} / {sections.length}
        </span>

        <button
          type="button"
          className="btn-nav btn-next"
          onClick={() => setStep(Math.min(sections.length, step + 1))}
          disabled={step === sections.length}
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}