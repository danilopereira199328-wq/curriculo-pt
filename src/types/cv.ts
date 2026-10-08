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
    objective: string;
    availability: 'Imediata' | '2 semanas' | '1 mês' | 'Outro' | '';
    availabilityOther: string;
    hasDrivingLicense: boolean;
    drivingLicenseCategory: string;
    hasCar: boolean;
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

  hobbies: Array<{
    id: string;
    name: string;
  }>;

  references: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;

  volunteering: Array<{
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;

  awards: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    description: string;
  }>;

  // 👇 NOVO — tema visual (cor de destaque)
  theme?: {
    accentColor?: string;  // ex: "#0066FF"
    headerColor?: string;  // opcional
  };
}

export type TemplateType = 'modern' | 'classic' | 'minimal';

export type SectionType =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'certifications'
  | 'projects'
  | 'hobbies'
  | 'references'
  | 'volunteering'
  | 'awards';

