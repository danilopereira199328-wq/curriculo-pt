import { create } from 'zustand';
import type { CVData, TemplateType } from '../types/cv';

interface CVStore {
  data: CVData;
  template: TemplateType;
  step: number;

  updatePersonal: (field: keyof CVData['personal'], value: string) => void;
  updateSummary: (summary: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  removeExperience: (id: string) => void;

  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;

  addSkill: () => void;
  updateSkill: (id: string, field: string, value: string | number) => void;
  removeSkill: (id: string) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;

  addCertification: () => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;

  addProject: () => void;
  updateProject: (id: string, field: string, value: string | string[]) => void;
  removeProject: (id: string) => void;

  setTemplate: (template: TemplateType) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const initialData: CVData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

const generateId = () => crypto.randomUUID();

export const useCVStore = create<CVStore>((set) => ({
  data: initialData,
  template: 'modern',
  step: 1,

  // === PESSOAL ===
  updatePersonal: (field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        personal: { ...state.data.personal, [field]: value },
      },
    })),

  updateSummary: (summary) =>
    set((state) => ({
      data: {
        ...state.data,
        personal: { ...state.data.personal, summary },
      },
    })),

  // === EXPERIÊNCIA ===
  addExperience: () =>
    set((state) => ({
      data: {
        ...state.data,
        experience: [
          ...state.data.experience,
          {
            id: generateId(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
          },
        ],
      },
    })),

  updateExperience: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.filter((exp) => exp.id !== id),
      },
    })),

  // === EDUCAÇÃO ===
  addEducation: () =>
    set((state) => ({
      data: {
        ...state.data,
        education: [
          ...state.data.education,
          {
            id: generateId(),
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
          },
        ],
      },
    })),

  updateEducation: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter((edu) => edu.id !== id),
      },
    })),

  // === HABILIDADES ===
  addSkill: () =>
    set((state) => ({
      data: {
        ...state.data,
        skills: [
          ...state.data.skills,
          { id: generateId(), name: '', level: 3 },
        ],
      },
    })),

  updateSkill: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.map((skill) =>
          skill.id === id ? { ...skill, [field]: value } : skill
        ),
      },
    })),

  removeSkill: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter((skill) => skill.id !== id),
      },
    })),

  // === IDIOMAS ===
  addLanguage: () =>
    set((state) => ({
      data: {
        ...state.data,
        languages: [
          ...state.data.languages,
          { id: generateId(), name: '', level: 'Intermediário' },
        ],
      },
    })),

  updateLanguage: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        languages: state.data.languages.map((lang) =>
          lang.id === id ? { ...lang, [field]: value } : lang
        ),
      },
    })),

  removeLanguage: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        languages: state.data.languages.filter((lang) => lang.id !== id),
      },
    })),

  // === CERTIFICAÇÕES ===
  addCertification: () =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: [
          ...state.data.certifications,
          { id: generateId(), name: '', issuer: '', date: '' },
        ],
      },
    })),

  updateCertification: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: state.data.certifications.map((cert) =>
          cert.id === id ? { ...cert, [field]: value } : cert
        ),
      },
    })),

  removeCertification: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        certifications: state.data.certifications.filter((cert) => cert.id !== id),
      },
    })),

  // === PROJETOS ===
  addProject: () =>
    set((state) => ({
      data: {
        ...state.data,
        projects: [
          ...state.data.projects,
          {
            id: generateId(),
            name: '',
            description: '',
            technologies: [],
          },
        ],
      },
    })),

  updateProject: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.map((proj) =>
          proj.id === id ? { ...proj, [field]: value } : proj
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.filter((proj) => proj.id !== id),
      },
    })),

  // === TEMPLATE / NAVEGAÇÃO ===
  setTemplate: (template) => set({ template }),
  setStep: (step) => set({ step }),
  reset: () => set({ data: initialData, template: 'modern', step: 1 }),
}));