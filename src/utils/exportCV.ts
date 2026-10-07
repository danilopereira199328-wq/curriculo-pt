import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { CVData } from '../types/cv';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 40;

export async function exportCVAsPDF(data: CVData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const {
    personal,
    experience,
    education,
    skills,
    languages,
    certifications,
    projects,
    hobbies,
  } = data;

  const primaryColor = rgb(0.12, 0.24, 0.42);
  const accentColor = rgb(0.0, 0.44, 0.89);
  const textColor = rgb(0.1, 0.1, 0.12);
  const mutedColor = rgb(0.4, 0.4, 0.45);

  // ==========================================
  // HEADER
  // ==========================================
  page.drawRectangle({
    x: 0,
    y: A4_HEIGHT - 160,
    width: A4_WIDTH,
    height: 160,
    color: primaryColor,
  });

  let photoEndX = MARGIN;
  if (personal.photo) {
    try {
      const photoBytes = await fetch(personal.photo).then((r) => r.arrayBuffer());
      let image;
      if (personal.photo.includes('data:image/png')) {
        image = await pdfDoc.embedPng(photoBytes);
      } else {
        image = await pdfDoc.embedJpg(photoBytes);
      }

      const photoSize = 90;
      page.drawImage(image, {
        x: MARGIN,
        y: A4_HEIGHT - 125,
        width: photoSize,
        height: photoSize,
      });

      page.drawEllipse({
        x: MARGIN + photoSize / 2,
        y: A4_HEIGHT - 125 + photoSize / 2,
        xScale: photoSize / 2,
        yScale: photoSize / 2,
        borderColor: rgb(1, 1, 1),
        borderWidth: 2,
      });

      photoEndX = MARGIN + photoSize + 20;
    } catch (error) {
      console.error('Erro ao carregar foto:', error);
    }
  }

  // Nome
  page.drawText(personal.fullName || 'Nome Completo', {
    x: photoEndX,
    y: A4_HEIGHT - 70,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
    maxWidth: A4_WIDTH - photoEndX - MARGIN,
  });

  // Cargo
  page.drawText(personal.jobTitle || 'Cargo Profissional', {
    x: photoEndX,
    y: A4_HEIGHT - 95,
    size: 13,
    font: fontRegular,
    color: rgb(0.85, 0.85, 0.9),
    maxWidth: A4_WIDTH - photoEndX - MARGIN,
  });

  // Contactos
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('  ·  '), {
      x: photoEndX,
      y: A4_HEIGHT - 120,
      size: 9,
      font: fontRegular,
      color: rgb(0.85, 0.85, 0.9),
      maxWidth: A4_WIDTH - photoEndX - MARGIN,
    });
  }

  // Links
  const linkParts = [personal.linkedin, personal.website, personal.github].filter(Boolean);
  if (linkParts.length > 0) {
    page.drawText(linkParts.join('  ·  '), {
      x: photoEndX,
      y: A4_HEIGHT - 135,
      size: 8,
      font: fontRegular,
      color: rgb(0.7, 0.7, 0.8),
      maxWidth: A4_WIDTH - photoEndX - MARGIN,
    });
  }

  // ==========================================
  // CONTEÚDO (com auto-paginação)
  // ==========================================
  let y = A4_HEIGHT - 200;

  // Função helper: verifica se precisa de nova página
  const checkPage = (neededSpace: number) => {
    if (y - neededSpace < MARGIN) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }
  };

  // ---- OBJETIVO ----
  if (personal.objective?.trim()) {
    checkPage(60);
    y = drawSectionTitle(page, 'OBJETIVO PROFISSIONAL', fontBold, accentColor, y);
    const lines = wrapText(personal.objective, 95);
    lines.forEach((line) => {
      checkPage(20);
      page.drawText(line, {
        x: MARGIN,
        y,
        size: 10,
        font: fontItalic,
        color: textColor,
      });
      y -= 14;
    });
    y -= 10;
  }

  // ---- SOBRE MIM ----
  if (personal.summary?.trim()) {
    checkPage(60);
    y = drawSectionTitle(page, 'SOBRE MIM', fontBold, accentColor, y);
    const lines = wrapText(personal.summary, 95);
    lines.forEach((line) => {
      checkPage(20);
      page.drawText(line, {
        x: MARGIN,
        y,
        size: 10,
        font: fontItalic,
        color: textColor,
      });
      y -= 14;
    });
    y -= 10;
  }

  // ---- EXPERIÊNCIA ----
  if (experience.length > 0) {
    checkPage(60);
    y = drawSectionTitle(page, 'EXPERIÊNCIA PROFISSIONAL', fontBold, accentColor, y);

    experience.forEach((exp) => {
      checkPage(60);

      // Cargo (negrito)
      page.drawText(exp.position || 'Cargo', {
        x: MARGIN,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 100,
      });

      // Datas à direita
      const dateStr = `${formatDate(exp.startDate)} — ${
        exp.current ? 'Presente' : formatDate(exp.endDate) || 'Presente'
      }`;
      const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
      page.drawText(dateStr, {
        x: A4_WIDTH - MARGIN - dateWidth,
        y,
        size: 9,
        font: fontRegular,
        color: mutedColor,
      });
      y -= 14;

      // Empresa
      const companyLine = `${exp.company || 'Empresa'}${exp.location ? ' · ' + exp.location : ''}`;
      page.drawText(companyLine, {
        x: MARGIN,
        y,
        size: 10,
        font: fontItalic,
        color: mutedColor,
        maxWidth: A4_WIDTH - MARGIN * 2,
      });
      y -= 16;

      // Descrição
      if (exp.description?.trim()) {
        const lines = wrapText(exp.description, 100);
        lines.forEach((line) => {
          checkPage(20);
          page.drawText(line, {
            x: MARGIN,
            y,
            size: 9,
            font: fontRegular,
            color: textColor,
          });
          y -= 12;
        });
      }
      y -= 8;
    });
    y -= 5;
  }

  // ---- EDUCAÇÃO ----
  if (education.length > 0) {
    checkPage(60);
    y = drawSectionTitle(page, 'EDUCAÇÃO', fontBold, accentColor, y);

    education.forEach((edu) => {
      checkPage(50);

      page.drawText(edu.degree || 'Curso', {
        x: MARGIN,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 100,
      });

      const dateStr = `${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`;
      const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
      page.drawText(dateStr, {
        x: A4_WIDTH - MARGIN - dateWidth,
        y,
        size: 9,
        font: fontRegular,
        color: mutedColor,
      });
      y -= 14;

      const instLine = `${edu.institution || 'Instituição'}${edu.field ? ' · ' + edu.field : ''}`;
      page.drawText(instLine, {
        x: MARGIN,
        y,
        size: 10,
        font: fontItalic,
        color: mutedColor,
        maxWidth: A4_WIDTH - MARGIN * 2,
      });
      y -= 20;
    });
    y -= 5;
  }

  // ---- PROJETOS ----
  if (projects.length > 0) {
    checkPage(60);
    y = drawSectionTitle(page, 'PROJETOS', fontBold, accentColor, y);

    projects.forEach((proj) => {
      checkPage(50);

      page.drawText(proj.name || 'Projeto', {
        x: MARGIN,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 100,
      });

      if (proj.link) {
        const linkWidth = fontRegular.widthOfTextAtSize(proj.link, 8);
        page.drawText(proj.link, {
          x: A4_WIDTH - MARGIN - linkWidth,
          y,
          size: 8,
          font: fontRegular,
          color: accentColor,
        });
      }
      y -= 14;

      if (proj.description?.trim()) {
        const lines = wrapText(proj.description, 100);
        lines.forEach((line) => {
          checkPage(20);
          page.drawText(line, {
            x: MARGIN,
            y,
            size: 9,
            font: fontRegular,
            color: textColor,
          });
          y -= 12;
        });
      }

      if (proj.technologies.length > 0) {
        checkPage(20);
        page.drawText(proj.technologies.join(' · '), {
          x: MARGIN,
          y,
          size: 9,
          font: fontItalic,
          color: accentColor,
          maxWidth: A4_WIDTH - MARGIN * 2,
        });
        y -= 12;
      }
      y -= 8;
    });
    y -= 5;
  }

  // ---- CERTIFICAÇÕES ----
  if (certifications.length > 0) {
    checkPage(60);
    y = drawSectionTitle(page, 'CERTIFICAÇÕES', fontBold, accentColor, y);

    certifications.forEach((cert) => {
      checkPage(40);

      page.drawText(cert.name || 'Certificação', {
        x: MARGIN,
        y,
        size: 10,
        font: fontBold,
        color: textColor,
        maxWidth: A4_WIDTH - MARGIN * 2 - 80,
      });

      if (cert.date) {
        const dateStr = formatDate(cert.date);
        const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
        page.drawText(dateStr, {
          x: A4_WIDTH - MARGIN - dateWidth,
          y,
          size: 9,
          font: fontRegular,
          color: mutedColor,
        });
      }
      y -= 14;

      if (cert.issuer) {
        page.drawText(cert.issuer, {
          x: MARGIN,
          y,
          size: 9,
          font: fontItalic,
          color: mutedColor,
        });
        y -= 14;
      }
      y -= 4;
    });
    y -= 5;
  }

  // ---- HABILIDADES + IDIOMAS (2 colunas) ----
  if (skills.length > 0 || languages.length > 0) {
    checkPage(150);

    const colY = y;

    // Habilidades (esquerda)
    if (skills.length > 0) {
      const titleY = drawSectionTitleAtX(
        page,
        'HABILIDADES',
        MARGIN,
        colY,
        fontBold,
        accentColor
      );
      let skillY = titleY;
      skills.forEach((skill) => {
        page.drawText(skill.name || 'Habilidade', {
          x: MARGIN,
          y: skillY,
          size: 10,
          font: fontRegular,
          color: textColor,
          maxWidth: 150,
        });
        page.drawText(`${skill.level}/5`, {
          x: 220,
          y: skillY,
          size: 9,
          font: fontBold,
          color: accentColor,
        });
        skillY -= 16;
      });
    }

    // Idiomas (direita)
    if (languages.length > 0) {
      const titleY = drawSectionTitleAtX(
        page,
        'IDIOMAS',
        A4_WIDTH / 2 + 20,
        colY,
        fontBold,
        accentColor
      );
      let langY = titleY;
      languages.forEach((lang) => {
        page.drawText(lang.name || 'Idioma', {
          x: A4_WIDTH / 2 + 20,
          y: langY,
          size: 10,
          font: fontRegular,
          color: textColor,
        });
        page.drawText(lang.level, {
          x: A4_WIDTH / 2 + 20,
          y: langY - 12,
          size: 9,
          font: fontItalic,
          color: mutedColor,
        });
        langY -= 30;
      });
    }

    // Atualiza y para o mínimo das duas colunas
    const skillsHeight = skills.length * 16 + 24;
    const languagesHeight = languages.length * 30 + 24;
    y = colY - Math.max(skillsHeight, languagesHeight, 40) - 15;
  }

  // ---- INFORMAÇÕES ADICIONAIS ----
  if (personal.availability || personal.hasDrivingLicense || personal.hasCar) {
    checkPage(80);
    y = drawSectionTitle(page, 'INFORMAÇÕES ADICIONAIS', fontBold, accentColor, y);

    if (personal.availability) {
      const availText =
        personal.availability === 'Outro'
          ? personal.availabilityOther
          : personal.availability;
      page.drawText(`Disponibilidade: ${availText}`, {
        x: MARGIN,
        y,
        size: 10,
        font: fontRegular,
        color: textColor,
      });
      y -= 14;
    }

    if (personal.hasDrivingLicense) {
      const licenseText = personal.drivingLicenseCategory
        ? `- Carta de conducao (Categoria ${personal.drivingLicenseCategory})`
        : '- Carta de conducao';
      page.drawText(licenseText, {
        x: MARGIN,
        y,
        size: 10,
        font: fontRegular,
        color: textColor,
      });
      y -= 14;
    }

    if (personal.hasCar) {
      page.drawText('- Carro proprio', {
        x: MARGIN,
        y,
        size: 10,
        font: fontRegular,
        color: textColor,
      });
      y -= 14;
    }
    y -= 8;
  }

  // ---- HOBBIES ----
  const validHobbies = hobbies.filter((h) => h.name.trim());
  if (validHobbies.length > 0) {
    checkPage(60);
    y = drawSectionTitle(page, 'HOBBIES E INTERESSES', fontBold, accentColor, y);

    const hobbyText = validHobbies.map((h) => h.name).join('  ·  ');
    const lines = wrapText(hobbyText, 95);
    lines.forEach((line) => {
      checkPage(20);
      page.drawText(line, {
        x: MARGIN,
        y,
        size: 10,
        font: fontRegular,
        color: textColor,
      });
      y -= 14;
    });
  }

  // ==========================================
  // DOWNLOAD
  // ==========================================
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], {
    type: 'application/pdf',
  });
  const url = URL.createObjectURL(blob);

  const safeName = (personal.fullName || 'curriculo')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'curriculo';

  const link = document.createElement('a');
  link.download = `cv-${safeName}.pdf`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

// ==========================================
// HELPERS
// ==========================================

function drawSectionTitle(
  page: any,
  title: string,
  font: any,
  color: any,
  y: number
): number {
  page.drawText(title, {
    x: MARGIN,
    y,
    size: 11,
    font,
    color,
  });

  page.drawLine({
    start: { x: MARGIN, y: y - 4 },
    end: { x: A4_WIDTH - MARGIN, y: y - 4 },
    thickness: 0.5,
    color,
  });

  return y - 22;
}

function drawSectionTitleAtX(
  page: any,
  title: string,
  x: number,
  y: number,
  font: any,
  color: any
): number {
  page.drawText(title, {
    x,
    y,
    size: 11,
    font,
    color,
  });

  page.drawLine({
    start: { x, y: y - 4 },
    end: { x: A4_WIDTH - MARGIN, y: y - 4 },
    thickness: 0.5,
    color,
  });

  return y - 22;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;

  const [year, month] = parts;
  const monthIdx = parseInt(month) - 1;
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];

  if (monthIdx < 0 || monthIdx > 11) return year;
  return `${months[monthIdx]} ${year}`;
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

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