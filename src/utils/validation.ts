import type { CVData } from '../types/cv';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCV(data: CVData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.personal.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Nome completo é obrigatório.' });
  } else if (data.personal.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Nome demasiado curto.' });
  }

  const email = data.personal.email?.trim();
  if (!email) {
    errors.push({ field: 'email', message: 'Email é obrigatório.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Email inválido (ex: nome@dominio.com).' });
  }

  const phone = data.personal.phone?.trim();
  if (phone) {
    const phoneClean = phone.replace(/[\s\-().]/g, '');
    if (!/^(\+?\d{1,3})?\d{9}$/.test(phoneClean)) {
      errors.push({
        field: 'phone',
        message: 'Telefone inválido. Usa formato: +351 912 345 678',
      });
    }
  }

  const linkedin = data.personal.linkedin?.trim();
  if (linkedin && !/linkedin\.com\//i.test(linkedin)) {
    errors.push({ field: 'linkedin', message: 'LinkedIn deve conter "linkedin.com/".' });
  }

  const github = data.personal.github?.trim();
  if (github && !/github\.com\//i.test(github)) {
    errors.push({ field: 'github', message: 'GitHub deve conter "github.com/".' });
  }

  const website = data.personal.website?.trim();
  if (website && !/^https?:\/\/|\./.test(website)) {
    errors.push({ field: 'website', message: 'Website inválido.' });
  }

  data.experience.forEach((exp, i) => {
    if (exp.startDate && exp.endDate && !exp.current && exp.startDate > exp.endDate) {
      errors.push({
        field: `experience[${i}].startDate`,
        message: `Experiência #${i + 1}: data de início posterior à data de fim.`,
      });
    }
  });

  data.education.forEach((edu, i) => {
    if (edu.startDate && edu.endDate && edu.startDate > edu.endDate) {
      errors.push({
        field: `education[${i}].startDate`,
        message: `Educação #${i + 1}: data de início posterior à data de fim.`,
      });
    }
  });

  data.volunteering.forEach((vol, i) => {
    if (vol.startDate && vol.endDate && !vol.current && vol.startDate > vol.endDate) {
      errors.push({
        field: `volunteering[${i}].startDate`,
        message: `Voluntariado #${i + 1}: data de início posterior à data de fim.`,
      });
    }
  });

  return errors;
}

export function isValidCV(data: CVData): boolean {
  return validateCV(data).length === 0;
}