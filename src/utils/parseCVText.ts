import type { CVData } from '../types/cv';

export interface ParsedCV {
  personal: Partial<CVData['personal']>;
  experience: CVData['experience'];
  education: CVData['education'];
  skills: CVData['skills'];
  languages: CVData['languages'];
}

export function parseCVText(text: string): ParsedCV {
  const result: ParsedCV = {
    personal: {},
    experience: [],
    education: [],
    skills: [],
    languages: [],
  };

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.personal.email = emailMatch[0];

  // Telefone (formato português/internacional)
  const phoneMatch = text.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3}/);
  if (phoneMatch) result.personal.phone = phoneMatch[0].trim();

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) result.personal.linkedin = linkedinMatch[0];

  // GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) result.personal.github = githubMatch[0];

  // Website
  const websiteMatch = text.match(/(https?:\/\/)?[\w-]+\.[a-z]{2,}(\/[\w-]*)?/i);
  if (websiteMatch && !websiteMatch[0].includes('@') && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github')) {
    result.personal.website = websiteMatch[0];
  }

  // Nome (procura nas primeiras 3 linhas)
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    if (line.length >= 3 && line.length <= 50 && /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/.test(line)) {
      result.personal.fullName = line;
      break;
    }
  }

  // Skills (procura palavras comuns)
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'SQL',
    'HTML', 'CSS', 'Git', 'Docker', 'AWS', 'Excel', 'Word', 'Photoshop',
  ];
  commonSkills.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      result.skills.push({ id: crypto.randomUUID(), name: skill, level: 3 });
    }
  });

  // Idiomas
  const languages = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano'];
  languages.forEach(lang => {
    if (text.includes(lang)) {
      result.languages.push({ id: crypto.randomUUID(), name: lang, level: 'Intermediário' });
    }
  });

  return result;
}