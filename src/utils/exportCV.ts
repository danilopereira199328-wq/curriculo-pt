import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { PDFPage, PDFFont, RGB } from 'pdf-lib';
import type { CVData, TemplateType } from '../types/cv';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 40;

// ============================================
// TIPOS
// ============================================

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  serif: PDFFont;
  serifBold: PDFFont;
  serifItalic: PDFFont;
}

interface RenderContext {
  pdfDoc: PDFDocument;
  getPage: () => PDFPage;
  setPage: (p: PDFPage) => void;
  getY: () => number;
  setY: (val: number) => void;
  textColor: RGB;
  mutedColor: RGB;
  accentColor: RGB;
  titleStyle: 'modern' | 'classic' | 'minimal';
  titleUppercase: boolean;
  topMargin: number;
  drawPageHeader?: (page: PDFPage) => void;
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

export async function exportCVAsPDF(data: CVData, template: TemplateType): Promise<void> {
  if (!data) throw new Error('Dados do CV em falta.');

  const pdfDoc = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    serif: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    serifItalic: await pdfDoc.embedFont(StandardFonts.TimesRomanItalic),
  };

  try {
    if (template === 'classic') {
      await renderClassic(pdfDoc, data, fonts);
    } else if (template === 'minimal') {
      await renderMinimal(pdfDoc, data, fonts);
    } else {
      await renderModern(pdfDoc, data, fonts);
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const safeName =
      (data.personal?.fullName || 'curriculo')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'curriculo';

    const link = document.createElement('a');
    link.download = `cv-${safeName}.pdf`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('[exportCV] Erro ao gerar PDF:', error);
    throw error;
  }
}

// ============================================
// TEMPLATE MODERNO
// ============================================

async function renderModern(pdfDoc: PDFDocument, data: CVData, fonts: Fonts): Promise<void> {
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const personal: any = data.personal || {};

  const primaryColor = rgb(0.12, 0.24, 0.42);
  const accentColor = rgb(0.0, 0.44, 0.89);
  const textColor = rgb(0.1, 0.1, 0.1);
  const mutedColor = rgb(0.4, 0.4, 0.45);

  page.drawRectangle({
    x: 0, y: A4_HEIGHT - 160, width: A4_WIDTH, height: 160, color: primaryColor,
  });

  let photoEndX = MARGIN;
  if (personal.photo) {
    try {
      const photoBytes = await fetch(personal.photo).then((r) => r.arrayBuffer());
      const image = personal.photo.includes('data:image/png')
        ? await pdfDoc.embedPng(photoBytes)
        : await pdfDoc.embedJpg(photoBytes);
      const photoSize = 90;
      page.drawImage(image, { x: MARGIN, y: A4_HEIGHT - 125, width: photoSize, height: photoSize });
      page.drawEllipse({
        x: MARGIN + photoSize / 2, y: A4_HEIGHT - 125 + photoSize / 2,
        xScale: photoSize / 2, yScale: photoSize / 2,
        borderColor: rgb(1, 1, 1), borderWidth: 2,
      });
      photoEndX = MARGIN + photoSize + 20;
    } catch (error) { console.error('Erro foto:', error); }
  }

  page.drawText(personal.fullName || 'Nome Completo', {
    x: photoEndX, y: A4_HEIGHT - 70, size: 22, font: fonts.bold, color: rgb(1, 1, 1),
    maxWidth: A4_WIDTH - photoEndX - MARGIN,
  });
  page.drawText(personal.jobTitle || 'Cargo Profissional', {
    x: photoEndX, y: A4_HEIGHT - 95, size: 13, font: fonts.regular,
    color: rgb(0.85, 0.85, 0.9), maxWidth: A4_WIDTH - photoEndX - MARGIN,
  });

  const contacts = [personal.email, personal.phone, personal.location].filter(Boolean).join('  ·  ');
  if (contacts) {
    page.drawText(contacts, {
      x: photoEndX, y: A4_HEIGHT - 120, size: 9, font: fonts.regular,
      color: rgb(0.85, 0.85, 0.9), maxWidth: A4_WIDTH - photoEndX - MARGIN,
    });
  }

  const links = [personal.linkedin, personal.website, personal.github].filter(Boolean).join('  ·  ');
  if (links) {
    page.drawText(links, {
      x: photoEndX, y: A4_HEIGHT - 135, size: 8, font: fonts.regular,
      color: rgb(0.7, 0.7, 0.8), maxWidth: A4_WIDTH - photoEndX - MARGIN,
    });
  }

  let y = A4_HEIGHT - 200;

  const getPage = () => page;
  const setPage = (p: PDFPage) => { page = p; };
  const getY = () => y;
  const setY = (val: number) => { y = val; };

  await renderContent(data, fonts, {
    pdfDoc,
    getPage, setPage, getY, setY,
    textColor, mutedColor, accentColor,
    titleStyle: 'modern',
    titleUppercase: true,
    topMargin: 60,
  });
}

// ============================================
// TEMPLATE CLÁSSICO
// ============================================

async function renderClassic(pdfDoc: PDFDocument, data: CVData, fonts: Fonts): Promise<void> {
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const personal: any = data.personal || {};
  let y = A4_HEIGHT - 60;

  const textColor = rgb(0.1, 0.1, 0.1);
  const mutedColor = rgb(0.4, 0.4, 0.45);

  const nameSize = 24;
  const nameWidth = fonts.serifBold.widthOfTextAtSize(personal.fullName || 'Nome Completo', nameSize);
  page.drawText(personal.fullName || 'Nome Completo', {
    x: (A4_WIDTH - nameWidth) / 2, y, size: nameSize, font: fonts.serifBold, color: textColor,
  });
  y -= 20;

  if (personal.jobTitle) {
    const jobSize = 12;
    const jobWidth = fonts.serifItalic.widthOfTextAtSize(personal.jobTitle, jobSize);
    page.drawText(personal.jobTitle, {
      x: (A4_WIDTH - jobWidth) / 2, y, size: jobSize, font: fonts.serifItalic, color: mutedColor,
    });
    y -= 16;
  }

  const contacts = [personal.email, personal.phone, personal.location].filter(Boolean).join('  ·  ');
  if (contacts) {
    const contactSize = 9;
    const contactWidth = fonts.regular.widthOfTextAtSize(contacts, contactSize);
    page.drawText(contacts, {
      x: (A4_WIDTH - contactWidth) / 2, y, size: contactSize, font: fonts.regular, color: mutedColor,
    });
    y -= 12;
  }

  const links = [personal.linkedin, personal.website, personal.github].filter(Boolean).join('  ·  ');
  if (links) {
    const linkSize = 8;
    const linkWidth = fonts.regular.widthOfTextAtSize(links, linkSize);
    page.drawText(links, {
      x: (A4_WIDTH - linkWidth) / 2, y, size: linkSize, font: fonts.regular, color: rgb(0.6, 0.6, 0.65),
    });
    y -= 16;
  }

  page.drawLine({
    start: { x: MARGIN, y }, end: { x: A4_WIDTH - MARGIN, y },
    thickness: 2, color: textColor,
  });
  y -= 24;

  const getPage = () => page;
  const setPage = (p: PDFPage) => { page = p; };
  const getY = () => y;
  const setY = (val: number) => { y = val; };

  await renderContent(data, fonts, {
    pdfDoc,
    getPage, setPage, getY, setY,
    textColor, mutedColor, accentColor: textColor,
    titleStyle: 'classic',
    titleUppercase: false,
    topMargin: 60,
  });
}

// ============================================
// TEMPLATE MINIMALISTA
// ============================================

async function renderMinimal(pdfDoc: PDFDocument, data: CVData, fonts: Fonts): Promise<void> {
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const personal: any = data.personal || {};
  let y = A4_HEIGHT - 70;

  const textColor = rgb(0.1, 0.1, 0.1);
  const mutedColor = rgb(0.5, 0.5, 0.5);
  const accentColor = rgb(0.7, 0.7, 0.7);

  let textX = MARGIN + 20;
  let textWidth = A4_WIDTH - MARGIN * 2 - 20;

  if (personal.photo) {
    try {
      const photoBytes = await fetch(personal.photo).then((r) => r.arrayBuffer());
      const image = personal.photo.includes('data:image/png')
        ? await pdfDoc.embedPng(photoBytes)
        : await pdfDoc.embedJpg(photoBytes);
      const photoSize = 80;
      page.drawImage(image, { x: MARGIN, y: y - photoSize + 10, width: photoSize, height: photoSize });
      textX = MARGIN + photoSize + 20;
      textWidth = A4_WIDTH - MARGIN * 2 - photoSize - 20;
    } catch (error) { console.error('Erro foto:', error); }
  }

  page.drawText(personal.fullName || 'Nome Completo', {
    x: textX, y, size: 26, font: fonts.regular, color: textColor, maxWidth: textWidth,
  });
  y -= 22;

  if (personal.jobTitle) {
    page.drawText(personal.jobTitle, {
      x: textX, y, size: 11, font: fonts.regular, color: mutedColor, maxWidth: textWidth,
    });
    y -= 14;
  }

  const contacts = [personal.email, personal.phone, personal.location].filter(Boolean).join('  ·  ');
  if (contacts) {
    page.drawText(contacts, {
      x: textX, y, size: 9, font: fonts.regular, color: mutedColor, maxWidth: textWidth,
    });
    y -= 12;
  }

  const links = [personal.linkedin, personal.website, personal.github].filter(Boolean).join('  ·  ');
  if (links) {
    page.drawText(links, {
      x: textX, y, size: 8, font: fonts.regular, color: rgb(0.6, 0.6, 0.6), maxWidth: textWidth,
    });
    y -= 12;
  }

  y = Math.min(y - 20, A4_HEIGHT - 160);

  page.drawLine({
    start: { x: MARGIN + 20, y }, end: { x: A4_WIDTH - MARGIN - 20, y },
    thickness: 0.5, color: rgb(0.9, 0.9, 0.9),
  });
  y -= 24;

  const getPage = () => page;
  const setPage = (p: PDFPage) => { page = p; };
  const getY = () => y;
  const setY = (val: number) => { y = val; };

  await renderContent(data, fonts, {
    pdfDoc,
    getPage, setPage, getY, setY,
    textColor, mutedColor, accentColor,
    titleStyle: 'minimal',
    titleUppercase: false,
    topMargin: 70,
  });
}

// ============================================
// RENDER CONTENT (partilhado)
// ============================================

async function renderContent(data: CVData, fonts: Fonts, ctx: RenderContext): Promise<void> {
  const d: any = data || {};
  const personal: any = d.personal || {};
  const experience = Array.isArray(d.experience) ? d.experience : [];
  const education = Array.isArray(d.education) ? d.education : [];
  const skills = Array.isArray(d.skills) ? d.skills : [];
  const languages = Array.isArray(d.languages) ? d.languages : [];
  const certifications = Array.isArray(d.certifications) ? d.certifications : [];
  const projects = Array.isArray(d.projects) ? d.projects : [];
  const hobbies = Array.isArray(d.hobbies) ? d.hobbies : [];
  const references = Array.isArray(d.references) ? d.references : [];
  const volunteering = Array.isArray(d.volunteering) ? d.volunteering : [];
  const awards = Array.isArray(d.awards) ? d.awards : [];

  const { textColor, mutedColor, accentColor, titleStyle, titleUppercase } = ctx;

  // CHECKPAGE — cria página nova de verdade
  const checkPage = (needed: number) => {
    if (ctx.getY() - needed < MARGIN) {
      const newPage = ctx.pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      ctx.setPage(newPage);
      if (ctx.drawPageHeader) ctx.drawPageHeader(newPage);
      ctx.setY(A4_HEIGHT - ctx.topMargin);
    }
  };

  const drawTitle = (title: string) => {
    const displayTitle = titleUppercase ? title.toUpperCase() : title;
    const titleFont = titleStyle === 'classic' ? fonts.serifBold : fonts.bold;
    const titleSize = titleStyle === 'minimal' ? 9 : (titleStyle === 'classic' ? 12 : 11);
    const y = ctx.getY();

    ctx.getPage().drawText(displayTitle, {
      x: MARGIN, y, size: titleSize, font: titleFont, color: accentColor,
    });

    if (titleStyle === 'modern') {
      ctx.getPage().drawLine({
        start: { x: MARGIN, y: y - 4 }, end: { x: A4_WIDTH - MARGIN, y: y - 4 },
        thickness: 0.5, color: accentColor,
      });
    } else if (titleStyle === 'classic') {
      ctx.getPage().drawLine({
        start: { x: MARGIN, y: y - 4 }, end: { x: A4_WIDTH - MARGIN, y: y - 4 },
        thickness: 0.5, color: textColor,
      });
    } else {
      ctx.getPage().drawLine({
        start: { x: MARGIN, y: y - 4 }, end: { x: MARGIN + 30, y: y - 4 },
        thickness: 0.5, color: accentColor,
      });
    }
    ctx.setY(y - (titleStyle === 'minimal' ? 18 : 22));
  };

  // OBJETIVO
  if (personal.objective?.trim()) {
    checkPage(60);
    drawTitle('Objetivo Profissional');
    wrapText(personal.objective, 90).forEach((line) => {
      checkPage(14);
      const ly = ctx.getY();
      ctx.getPage().drawText(line, { x: MARGIN, y: ly, size: 10, font: fonts.italic, color: textColor });
      ctx.setY(ly - 14);
    });
    ctx.setY(ctx.getY() - 10);
  }

  // SOBRE MIM
  if (personal.summary?.trim()) {
    checkPage(60);
    drawTitle('Sobre Mim');
    wrapText(personal.summary, 90).forEach((line) => {
      checkPage(14);
      const ly = ctx.getY();
      ctx.getPage().drawText(line, { x: MARGIN, y: ly, size: 10, font: fonts.italic, color: textColor });
      ctx.setY(ly - 14);
    });
    ctx.setY(ctx.getY() - 10);
  }

  // EXPERIÊNCIA
  if (experience.length > 0) {
    checkPage(60);
    drawTitle('Experiência Profissional');
    experience.forEach((exp: any) => {
      checkPage(70);
      let y = ctx.getY();
      ctx.getPage().drawText(exp.position || 'Cargo', {
        x: MARGIN, y, size: 11, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 120,
      });
      const dateStr = formatDateRange(exp.startDate, exp.endDate, exp.current);
      if (dateStr) {
        const dateWidth = fonts.regular.widthOfTextAtSize(dateStr, 9);
        ctx.getPage().drawText(dateStr, {
          x: A4_WIDTH - MARGIN - dateWidth, y, size: 9, font: fonts.regular, color: mutedColor,
        });
      }
      y -= 14;
      ctx.setY(y);
      ctx.getPage().drawText(`${exp.company || 'Empresa'}${exp.location ? ' · ' + exp.location : ''}`, {
        x: MARGIN, y, size: 10, font: fonts.italic, color: mutedColor,
        maxWidth: A4_WIDTH - MARGIN * 2,
      });
      ctx.setY(y - 16);
      if (exp.description?.trim()) {
        wrapText(exp.description, 95).forEach((line) => {
          checkPage(12);
          const ly = ctx.getY();
          ctx.getPage().drawText(line, { x: MARGIN, y: ly, size: 9, font: fonts.regular, color: textColor });
          ctx.setY(ly - 12);
        });
      }
      ctx.setY(ctx.getY() - 8);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // EDUCAÇÃO
  if (education.length > 0) {
    checkPage(60);
    drawTitle('Educação');
    education.forEach((edu: any) => {
      checkPage(50);
      let y = ctx.getY();
      ctx.getPage().drawText(edu.degree || 'Curso', {
        x: MARGIN, y, size: 11, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 120,
      });
      const dateStr = formatDateRange(edu.startDate, edu.endDate, false);
      if (dateStr) {
        const dateWidth = fonts.regular.widthOfTextAtSize(dateStr, 9);
        ctx.getPage().drawText(dateStr, {
          x: A4_WIDTH - MARGIN - dateWidth, y, size: 9, font: fonts.regular, color: mutedColor,
        });
      }
      y -= 14;
      ctx.getPage().drawText(`${edu.institution || 'Instituição'}${edu.field ? ' · ' + edu.field : ''}`, {
        x: MARGIN, y, size: 10, font: fonts.italic, color: mutedColor,
        maxWidth: A4_WIDTH - MARGIN * 2,
      });
      ctx.setY(y - 20);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // PROJETOS
  if (projects.length > 0) {
    checkPage(60);
    drawTitle('Projetos');
    projects.forEach((proj: any) => {
      checkPage(50);
      let y = ctx.getY();
      ctx.getPage().drawText(proj.name || 'Projeto', {
        x: MARGIN, y, size: 11, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 120,
      });
      if (proj.link) {
        const linkWidth = fonts.regular.widthOfTextAtSize(proj.link, 8);
        ctx.getPage().drawText(proj.link, {
          x: A4_WIDTH - MARGIN - linkWidth, y, size: 8, font: fonts.regular, color: accentColor,
        });
      }
      y -= 14;
      ctx.setY(y);
      if (proj.description?.trim()) {
        wrapText(proj.description, 95).forEach((line) => {
          checkPage(12);
          const ly = ctx.getY();
          ctx.getPage().drawText(line, { x: MARGIN, y: ly, size: 9, font: fonts.regular, color: textColor });
          ctx.setY(ly - 12);
        });
      }
      if (Array.isArray(proj.technologies) && proj.technologies.length > 0) {
        checkPage(12);
        const ly = ctx.getY();
        ctx.getPage().drawText(proj.technologies.join(' · '), {
          x: MARGIN, y: ly, size: 9, font: fonts.italic, color: accentColor,
          maxWidth: A4_WIDTH - MARGIN * 2,
        });
        ctx.setY(ly - 12);
      }
      ctx.setY(ctx.getY() - 8);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // VOLUNTARIADO
  if (volunteering.length > 0) {
    checkPage(60);
    drawTitle('Voluntariado');
    volunteering.forEach((vol: any) => {
      checkPage(70);
      let y = ctx.getY();
      ctx.getPage().drawText(vol.role || 'Voluntário', {
        x: MARGIN, y, size: 11, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 120,
      });
      const dateStr = formatDateRange(vol.startDate, vol.endDate, vol.current);
      if (dateStr) {
        const dateWidth = fonts.regular.widthOfTextAtSize(dateStr, 9);
        ctx.getPage().drawText(dateStr, {
          x: A4_WIDTH - MARGIN - dateWidth, y, size: 9, font: fonts.regular, color: mutedColor,
        });
      }
      y -= 14;
      ctx.setY(y);
      ctx.getPage().drawText(vol.organization || 'Organização', {
        x: MARGIN, y, size: 10, font: fonts.italic, color: mutedColor,
        maxWidth: A4_WIDTH - MARGIN * 2,
      });
      ctx.setY(y - 16);
      if (vol.description?.trim()) {
        wrapText(vol.description, 95).forEach((line) => {
          checkPage(12);
          const ly = ctx.getY();
          ctx.getPage().drawText(line, { x: MARGIN, y: ly, size: 9, font: fonts.regular, color: textColor });
          ctx.setY(ly - 12);
        });
      }
      ctx.setY(ctx.getY() - 8);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // HABILIDADES + IDIOMAS
  if (skills.length > 0 || languages.length > 0) {
    checkPage(150);
    const colY = ctx.getY();

    if (skills.length > 0) {
      ctx.getPage().drawText(titleUppercase ? 'HABILIDADES' : 'Competências', {
        x: MARGIN, y: colY, size: 11, font: fonts.bold, color: accentColor,
      });
      ctx.getPage().drawLine({
        start: { x: MARGIN, y: colY - 4 }, end: { x: MARGIN + 60, y: colY - 4 },
        thickness: 0.5, color: accentColor,
      });
      let skillY = colY - 18;
      skills.forEach((skill: any) => {
        ctx.getPage().drawText(skill.name || 'Habilidade', {
          x: MARGIN, y: skillY, size: 10, font: fonts.regular, color: textColor, maxWidth: 150,
        });
        ctx.getPage().drawText(`${skill.level ?? ''}/5`, {
          x: MARGIN + 180, y: skillY, size: 9, font: fonts.bold, color: accentColor,
        });
        skillY -= 16;
      });
    }

    if (languages.length > 0) {
      const rightX = A4_WIDTH / 2 + 20;
      ctx.getPage().drawText(titleUppercase ? 'IDIOMAS' : 'Idiomas', {
        x: rightX, y: colY, size: 11, font: fonts.bold, color: accentColor,
      });
      ctx.getPage().drawLine({
        start: { x: rightX, y: colY - 4 }, end: { x: rightX + 60, y: colY - 4 },
        thickness: 0.5, color: accentColor,
      });
      let langY = colY - 18;
      languages.forEach((lang: any) => {
        ctx.getPage().drawText(lang.name || 'Idioma', {
          x: rightX, y: langY, size: 10, font: fonts.regular, color: textColor,
        });
        ctx.getPage().drawText(lang.level || '', {
          x: rightX, y: langY - 12, size: 9, font: fonts.italic, color: mutedColor,
        });
        langY -= 30;
      });
    }

    const maxHeight = Math.max(skills.length * 16 + 24, languages.length * 30 + 24, 40);
    ctx.setY(colY - maxHeight - 15);
  }

  // CERTIFICAÇÕES
  if (certifications.length > 0) {
    checkPage(60);
    drawTitle('Certificações');
    certifications.forEach((cert: any) => {
      checkPage(40);
      let y = ctx.getY();
      ctx.getPage().drawText(cert.name || 'Certificação', {
        x: MARGIN, y, size: 10, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 100,
      });
      if (cert.date) {
        const dateStr = formatDate(cert.date);
        const dateWidth = fonts.regular.widthOfTextAtSize(dateStr, 9);
        ctx.getPage().drawText(dateStr, {
          x: A4_WIDTH - MARGIN - dateWidth, y, size: 9, font: fonts.regular, color: mutedColor,
        });
      }
      y -= 14;
      if (cert.issuer) {
        ctx.getPage().drawText(cert.issuer, {
          x: MARGIN, y, size: 9, font: fonts.italic, color: mutedColor,
        });
        y -= 14;
      }
      ctx.setY(y - 4);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // PRÉMIOS
  if (awards.length > 0) {
    checkPage(60);
    drawTitle('Prémios e Reconhecimentos');
    awards.forEach((award: any) => {
      checkPage(50);
      let y = ctx.getY();
      ctx.getPage().drawText(award.name || 'Prémio', {
        x: MARGIN, y, size: 10, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 100,
      });
      if (award.date) {
        const dateStr = formatDate(award.date);
        const dateWidth = fonts.regular.widthOfTextAtSize(dateStr, 9);
        ctx.getPage().drawText(dateStr, {
          x: A4_WIDTH - MARGIN - dateWidth, y, size: 9, font: fonts.regular, color: mutedColor,
        });
      }
      y -= 14;
      if (award.issuer) {
        ctx.getPage().drawText(award.issuer, {
          x: MARGIN, y, size: 9, font: fonts.italic, color: mutedColor,
        });
        y -= 14;
      }
      ctx.setY(y - 4);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // INFORMAÇÕES ADICIONAIS
  if (personal.availability || personal.hasDrivingLicense || personal.hasCar) {
    checkPage(80);
    drawTitle('Informações Adicionais');
    let y = ctx.getY();

    if (personal.availability) {
      const availText = personal.availability === 'Outro' ? personal.availabilityOther : personal.availability;
      ctx.getPage().drawText(`Disponibilidade: ${availText}`, {
        x: MARGIN, y, size: 10, font: fonts.regular, color: textColor,
      });
      y -= 14;
    }
    if (personal.hasDrivingLicense) {
      const licenseText = personal.drivingLicenseCategory
        ? `Carta de condução (Categoria ${personal.drivingLicenseCategory})`
        : 'Carta de condução';
      ctx.getPage().drawText(licenseText, {
        x: MARGIN, y, size: 10, font: fonts.regular, color: textColor,
      });
      y -= 14;
    }
    if (personal.hasCar) {
      ctx.getPage().drawText('Carro próprio', {
        x: MARGIN, y, size: 10, font: fonts.regular, color: textColor,
      });
      y -= 14;
    }
    ctx.setY(y - 8);
  }

  // REFERÊNCIAS
  if (references.length > 0) {
    checkPage(60);
    drawTitle('Referências');
    references.forEach((ref: any) => {
      checkPage(50);
      let y = ctx.getY();
      ctx.getPage().drawText(ref.name || 'Referência', {
        x: MARGIN, y, size: 10, font: fonts.bold, color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2,
      });
      y -= 14;
      const posLine = `${ref.position || ''}${ref.company ? (ref.position ? ' · ' : '') + ref.company : ''}`;
      if (posLine.trim()) {
        ctx.getPage().drawText(posLine, {
          x: MARGIN, y, size: 9, font: fonts.italic, color: mutedColor,
          maxWidth: A4_WIDTH - MARGIN * 2,
        });
        y -= 14;
      }
      const contactLine = [ref.email, ref.phone].filter(Boolean).join('  ·  ');
      if (contactLine) {
        ctx.getPage().drawText(contactLine, {
          x: MARGIN, y, size: 9, font: fonts.regular, color: textColor,
          maxWidth: A4_WIDTH - MARGIN * 2,
        });
        y -= 14;
      }
      ctx.setY(y - 4);
    });
    ctx.setY(ctx.getY() - 5);
  }

  // HOBBIES (sem duplicados)
  const validHobbies = Array.from(
    new Map(
      hobbies
        .filter((h: any) => h && typeof h.name === 'string' && h.name.trim())
        .map((h: any) => [h.name.trim().toLowerCase(), h])
    ).values()
  );
  if (validHobbies.length > 0) {
    checkPage(60);
    drawTitle('Hobbies e Interesses');
    const hobbyText = validHobbies.map((h: any) => h.name).join('  ·  ');
    wrapText(hobbyText, 90).forEach((line) => {
      checkPage(14);
      const ly = ctx.getY();
      ctx.getPage().drawText(line, { x: MARGIN, y: ly, size: 10, font: fonts.regular, color: textColor });
      ctx.setY(ly - 14);
    });
  }
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length < 2) return dateStr;
  const [year, month] = parts;
  const monthIdx = parseInt(month) - 1;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  if (monthIdx < 0 || monthIdx > 11) return year;
  return `${months[monthIdx]} ${year}`;
}

function formatDateRange(start?: string, end?: string, current?: boolean): string {
  const s = formatDate(start || '');
  const e = current ? 'Presente' : formatDate(end || '');
  if (s && e) return `${s} — ${e}`;
  if (s) return `${s} — Presente`;
  if (e) return e;
  return '';
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  const paragraphs = String(text).split('\n');
  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      lines.push('');
      return;
    }
    const words = paragraph.split(' ');
    let currentLine = '';
    words.forEach((word) => {
      if ((currentLine + ' ' + word).trim().length > maxChars) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = (currentLine + ' ' + word).trim();
      }
    });
    if (currentLine) lines.push(currentLine.trim());
  });
  return lines;
}