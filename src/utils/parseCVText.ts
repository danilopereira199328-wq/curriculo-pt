import type { CVData } from '../types/cv';

export interface ParsedCV {
  personal: Partial<CVData['personal']>;
  experience: CVData['experience'];
  education: CVData['education'];
  skills: CVData['skills'];
  languages: CVData['languages'];
}

export interface ParsedResult {
  data: ParsedCV;
  detected: string[];   // lista de campos detetados (para feedback)
  warnings: string[];   // lista de avisos (para feedback)
}

const generateId = () => crypto.randomUUID();

// Lista alargada de skills comuns
const COMMON_SKILLS = [
  // Programação
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js', 'Django', 'Flask', 'Laravel', 'Spring',
  'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap',
  // Bases de dados
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Oracle',
  // DevOps/Cloud
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'CI/CD',
  // Dados
  'Excel', 'Word', 'PowerPoint', 'Power BI', 'Tableau', 'Google Analytics', 'Pandas', 'NumPy',
  // Design
  'Photoshop', 'Illustrator', 'Figma', 'InDesign', 'Canva', 'Sketch',
  // Gestão
  'Scrum', 'Agile', 'Jira', 'Trello', 'Notion', 'Slack',
  // Marketing
  'SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Email Marketing', 'Copywriting',
  // Outros
  'Office', 'Microsoft Office', 'AutoCAD', 'SAP', 'CRM', 'ERP',
];

// Idiomas
const COMMON_LANGUAGES = [
  'Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão',
  'Italiano', 'Holandês', 'Russo', 'Chinês', 'Japonês', 'Árabe',
];

// Níveis de idioma


export function parseCVText(text: string): ParsedResult {
  const result: ParsedCV = {
    personal: {},
    experience: [],
    education: [],
    skills: [],
    languages: [],
  };

  const detected: string[] = [];
  const warnings: string[] = [];

  // ============================================
  // CONTACTOS
  // ============================================

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.personal.email = emailMatch[0];
    detected.push(`Email: ${emailMatch[0]}`);
  } else {
    warnings.push('Email não encontrado');
  }

  // Telefone (formato internacional e PT)
  const phoneMatch = text.match(
    /(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/
  );
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 9) {
    result.personal.phone = phoneMatch[0].trim();
    detected.push(`Telefone: ${phoneMatch[0].trim()}`);
  }

  // LinkedIn
  const linkedinMatch = text.match(
    /(?:https?:\/\/)?(?:[a-z]{2}\.)?linkedin\.com\/in\/[\w-]+/i
  );
  if (linkedinMatch) {
    result.personal.linkedin = linkedinMatch[0];
    detected.push(`LinkedIn: ${linkedinMatch[0]}`);
  }

  // GitHub
  const githubMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i
  );
  if (githubMatch) {
    result.personal.github = githubMatch[0];
    detected.push(`GitHub: ${githubMatch[0]}`);
  }

  // Website (evitar emails e redes sociais)
  const websiteMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:pt|com|org|net|io|dev|app|me)(?:\/[\w\-./?%&=]*)?/i
  );
  if (
    websiteMatch &&
    !websiteMatch[0].includes('@') &&
    !websiteMatch[0].toLowerCase().includes('linkedin') &&
    !websiteMatch[0].toLowerCase().includes('github')
  ) {
    result.personal.website = websiteMatch[0];
    detected.push(`Website: ${websiteMatch[0]}`);
  }

  // ============================================
  // NOME (heurística melhorada)
  // ============================================
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Ignora linhas que são claramente contactos ou títulos
    if (
      line.includes('@') ||
      /\d{4,}/.test(line) ||
      /^curriculum|^cv|^currículo/i.test(line)
    ) {
      continue;
    }
    // Nome próprio: 2-4 palavras, cada uma começando por maiúscula
    if (
      line.length >= 3 &&
      line.length <= 50 &&
      /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+){1,3}$/.test(line)
    ) {
      result.personal.fullName = line;
      detected.push(`Nome: ${line}`);
      break;
    }
  }

  // ============================================
  // SKILLS
  // ============================================
  const foundSkills = new Set<string>();
  COMMON_SKILLS.forEach((skill) => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  });

  foundSkills.forEach((skill) => {
    result.skills.push({
      id: generateId(),
      name: skill,
      level: 3,
    });
  });

  if (foundSkills.size > 0) {
    detected.push(`Skills: ${Array.from(foundSkills).join(', ')}`);
  }

  // ============================================
  // IDIOMAS
  // ============================================
  COMMON_LANGUAGES.forEach((lang) => {
    if (new RegExp(`\\b${lang}\\b`, 'i').test(text)) {
      result.languages.push({
        id: generateId(),
        name: lang,
        level: 'Intermediário',
      });
    }
  });

  if (result.languages.length > 0) {
    detected.push(`Idiomas: ${result.languages.map((l) => l.name).join(', ')}`);
  }

  // ============================================
  // EXPERIÊNCIA (heurística)
  // ============================================
  const experienceSectionMatch = text.match(
    /(?:experi[êe]ncia|experience)[\s\S]*?(?=(?:educa[çc][ãa]o|education|skills|compet[êe]ncias|idiomas|languages|$))/i
  );

  if (experienceSectionMatch) {
    // Procura por padrões: "Cargo na Empresa (2020-2023)" ou "Empresa — Cargo"
    const expText = experienceSectionMatch[0];
    const jobPatterns = expText.match(
      /([A-ZÀ-Ú][^\n]{3,60})\s*[-–—]\s*([A-ZÀ-Ú][^\n]{3,60})/g
    );

    if (jobPatterns) {
      jobPatterns.slice(0, 5).forEach((pattern) => {
        const parts = pattern.split(/\s*[-–—]\s*/);
        if (parts.length >= 2) {
          result.experience.push({
            id: generateId(),
            position: parts[0].trim(),
            company: parts[1].trim(),
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
          });
        }
      });

      if (result.experience.length > 0) {
        detected.push(`Experiência: ${result.experience.length} entrada(s) detetada(s)`);
      }
    } else {
      warnings.push('Experiência: secção encontrada mas formato não reconhecido');
    }
  } else {
    warnings.push('Experiência profissional não encontrada');
  }

  // ============================================
  // EDUCAÇÃO (heurística)
  // ============================================
  const educationSectionMatch = text.match(
    /(?:educa[çc][ãa]o|forma[çc][ãa]o|education)[\s\S]*?(?=(?:experi[êe]ncia|experience|skills|compet[êe]ncias|idiomas|languages|$))/i
  );

  if (educationSectionMatch) {
    const eduText = educationSectionMatch[0];
    const eduPatterns = eduText.match(
      /(Licenciatura|Mestrado|Doutoramento|Bachelor|Master|PhD|Curso|Formação)[^\n]{0,80}/gi
    );

    if (eduPatterns) {
      eduPatterns.slice(0, 3).forEach((pattern) => {
        result.education.push({
          id: generateId(),
          degree: pattern.trim(),
          institution: '',
          field: '',
          startDate: '',
          endDate: '',
        });
      });

      if (result.education.length > 0) {
        detected.push(`Educação: ${result.education.length} entrada(s) detetada(s)`);
      }
    } else {
      warnings.push('Educação: secção encontrada mas formato não reconhecido');
    }
  } else {
    warnings.push('Educação não encontrada');
  }

  // ============================================
  // OBJETIVO / RESUMO
  // ============================================
  const objectiveMatch = text.match(
    /(?:objetivo|objective)[\s:]*([^\n]{20,300})/i
  );
  if (objectiveMatch) {
    result.personal.objective = objectiveMatch[1].trim();
    detected.push('Objetivo profissional');
  }

  const summaryMatch = text.match(
    /(?:sobre mim|resumo|summary|about)[\s:]*([^\n]{30,500})/i
  );
  if (summaryMatch) {
    result.personal.summary = summaryMatch[1].trim();
    detected.push('Resumo profissional');
  }

  return { data: result, detected, warnings };
}