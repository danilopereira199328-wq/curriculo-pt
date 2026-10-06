import { useCVStore } from '../store/cvStore';
import { PersonalSection } from './sections/PersonalSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { LanguagesSection } from './sections/LanguagesSection';

export function CVForm() {
  const { step, setStep } = useCVStore();

  const sections = [
    { id: 1, label: '👤 Pessoal', component: PersonalSection },
    { id: 2, label: '💼 Experiência', component: ExperienceSection },
    { id: 3, label: '🎓 Educação', component: EducationSection },
    { id: 4, label: '⚡ Habilidades', component: SkillsSection },
    { id: 5, label: '🌍 Idiomas', component: LanguagesSection },
  ];

  const CurrentSection = sections[step - 1]?.component || PersonalSection;

  return (
    <div className="cv-form">
      {/* ABAS DE NAVEGAÇÃO */}
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

      {/* CONTEÚDO DA SECÇÃO ATIVA */}
      <div className="step-content">
        <CurrentSection />
      </div>

      {/* NAVEGAÇÃO ANTERIOR/PRÓXIMO */}
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