export interface CVData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    photo?: string;
    summary: string;
  };

  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;

  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;

  skills: Array<{
    id: string;
    name: string;
    level: number;
  }>;

  languages: Array<{
    id: string;
    name: string;
    level: 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente' | 'Nativo';
  }>;

  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;

  projects: Array<{
    id: string;
    name: string;
    description: string;
    link?: string;
    technologies: string[];
  }>;
}

export type TemplateType = 'modern';

export type SectionType =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects';