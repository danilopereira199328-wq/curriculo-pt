import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVData, TemplateType } from '../types/cv';

interface CVStore {
  data: CVData;
  template: TemplateType;
  step: number;

  // Atualização genérica (para o ColorPicker)
  setData: (data: CVData) => void;
  updateTheme: (accentColor: string) => void;

  updatePersonal: (field: keyof CVData['personal'], value: string | boolean) => void;
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

  addHobby: () => void;
  updateHobby: (id: string, field: string, value: string) => void;
  removeHobby: (id: string) => void;

  addReference: () => void;
  updateReference: (id: string, field: string, value: string) => void;
  removeReference: (id: string) => void;

  addVolunteering: () => void;
  updateVolunteering: (id: string, field: string, value: string | boolean) => void;
  removeVolunteering: (id: string) => void;

  addAward: () => void;
  updateAward: (id: string, field: string, value: string) => void;
  removeAward: (id: string) => void;

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
    objective: '',
    availability: '',
    availabilityOther: '',
    hasDrivingLicense: false,
    drivingLicenseCategory: '',
    hasCar: false,
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  hobbies: [],
  references: [],
  volunteering: [],
  awards: [],
  theme: {
    accentColor: '#0066FF',
  },
};

const generateId = () => crypto.randomUUID();

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      data: initialData,
      template: 'modern',
      step: 1,

      // 👇 Setter genérico (usa-o no ColorPicker)
      setData: (data) => set({ data }),

      // 👇 Atualizar só a cor
      updateTheme: (accentColor) =>
        set((state) => ({
          data: {
            ...state.data,
            theme: { ...(state.data.theme || {}), accentColor },
          },
        })),

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

      addSkill: () =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [...state.data.skills, { id: generateId(), name: '', level: 3 }],
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

      addProject: () =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [
              ...state.data.projects,
              { id: generateId(), name: '', description: '', technologies: [] },
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

      addHobby: () =>
        set((state) => ({
          data: {
            ...state.data,
            hobbies: [...state.data.hobbies, { id: generateId(), name: '' }],
          },
        })),

      updateHobby: (id, field, value) =>
        set((state) => ({
          data: {
            ...state.data,
            hobbies: state.data.hobbies.map((hobby) =>
              hobby.id === id ? { ...hobby, [field]: value } : hobby
            ),
          },
        })),

      removeHobby: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            hobbies: state.data.hobbies.filter((hobby) => hobby.id !== id),
          },
        })),

      addReference: () =>
        set((state) => ({
          data: {
            ...state.data,
            references: [
              ...state.data.references,
              { id: generateId(), name: '', position: '', company: '', email: '', phone: '' },
            ],
          },
        })),

      updateReference: (id, field, value) =>
        set((state) => ({
          data: {
            ...state.data,
            references: state.data.references.map((ref) =>
              ref.id === id ? { ...ref, [field]: value } : ref
            ),
          },
        })),

      removeReference: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            references: state.data.references.filter((ref) => ref.id !== id),
          },
        })),

      addVolunteering: () =>
        set((state) => ({
          data: {
            ...state.data,
            volunteering: [
              ...state.data.volunteering,
              {
                id: generateId(),
                organization: '',
                role: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
              },
            ],
          },
        })),

      updateVolunteering: (id, field, value) =>
        set((state) => ({
          data: {
            ...state.data,
            volunteering: state.data.volunteering.map((vol) =>
              vol.id === id ? { ...vol, [field]: value } : vol
            ),
          },
        })),

      removeVolunteering: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            volunteering: state.data.volunteering.filter((vol) => vol.id !== id),
          },
        })),

      addAward: () =>
        set((state) => ({
          data: {
            ...state.data,
            awards: [
              ...state.data.awards,
              { id: generateId(), name: '', issuer: '', date: '', description: '' },
            ],
          },
        })),

      updateAward: (id, field, value) =>
        set((state) => ({
          data: {
            ...state.data,
            awards: state.data.awards.map((award) =>
              award.id === id ? { ...award, [field]: value } : award
            ),
          },
        })),

      removeAward: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            awards: state.data.awards.filter((award) => award.id !== id),
          },
        })),

      setTemplate: (template) => set({ template }),
      setStep: (step) => set({ step }),
      reset: () =>
        set({
          data: initialData,
          template: 'modern',
          step: 1,
        }),
    }),
    {
      name: 'berci-cv-draft',
      version: 1,
      partialize: (state) => ({
        data: state.data,
        template: state.template,
        step: state.step,
      }),
    }
  )
);