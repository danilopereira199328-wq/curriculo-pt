import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { CVData } from '../types/cv';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

export async function exportCVAsPDF(data: CVData): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { personal, experience, education, skills, languages, certifications, projects } = data;

  const primaryColor = rgb(0.12, 0.24, 0.42);
  const accentColor = rgb(0.0, 0.44, 0.89);
  const textColor = rgb(0.1, 0.1, 0.12);
  const mutedColor = rgb(0.4, 0.4, 0.45);

  // === HEADER ===
  page.drawRectangle({
    x: 0,
    y: A4_HEIGHT - 160,
    width: A4_WIDTH,
    height: 160,
    color: primaryColor,
  });

  let photoEndX = 40;
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
        x: 40,
        y: A4_HEIGHT - 125,
        width: photoSize,
        height: photoSize,
      });

      page.drawEllipse({
        x: 40 + photoSize / 2,
        y: A4_HEIGHT - 125 + photoSize / 2,
        xScale: photoSize / 2,
        yScale: photoSize / 2,
        borderColor: rgb(1, 1, 1),
        borderWidth: 2,
      });

      photoEndX = 40 + photoSize + 20;
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
  });

  // Cargo
  page.drawText(personal.jobTitle || 'Cargo Profissional', {
    x: photoEndX,
    y: A4_HEIGHT - 95,
    size: 13,
    font: fontRegular,
    color: rgb(0.85, 0.85, 0.9),
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
    });
  }

  let y = A4_HEIGHT - 200;

  // === SOBRE MIM ===
  if (personal.summary && personal.summary.trim()) {
    y = drawSectionTitle(page, 'SOBRE MIM', 40, y, fontBold, accentColor);
    const summaryLines = wrapText(personal.summary, 95);
    summaryLines.forEach((line) => {
      page.drawText(line, {
        x: 40,
        y,
        size: 10,
        font: fontItalic,
        color: textColor,
      });
      y -= 14;
    });
    y -= 15;
  }

  // === EXPERIÊNCIA ===
  if (experience.length > 0) {
    if (y < 120) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }

    y = drawSectionTitle(page, 'EXPERIÊNCIA PROFISSIONAL', 40, y, fontBold, accentColor);

    experience.forEach((exp) => {
      // Cargo
      page.drawText(exp.position || 'Cargo', {
        x: 40,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
      });

      // Datas
      const dateStr = `${formatDate(exp.startDate)} — ${
        exp.current ? 'Presente' : formatDate(exp.endDate) || 'Presente'
      }`;
      const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
      page.drawText(dateStr, {
        x: A4_WIDTH - 40 - dateWidth,
        y,
        size: 9,
        font: fontRegular,
        color: mutedColor,
      });
      y -= 14;

      // Empresa
      const companyLine = `${exp.company || 'Empresa'}${exp.location ? ' · ' + exp.location : ''}`;
      page.drawText(companyLine, {
        x: 40,
        y,
        size: 10,
        font: fontItalic,
        color: mutedColor,
      });
      y -= 16;

      // Descrição
      if (exp.description && exp.description.trim()) {
        const descLines = wrapText(exp.description, 105);
        descLines.forEach((line) => {
          page.drawText(line, {
            x: 40,
            y,
            size: 9,
            font: fontRegular,
            color: textColor,
          });
          y -= 12;
        });
      }
      y -= 10;
    });
    y -= 5;
  }

  // === EDUCAÇÃO ===
  if (education.length > 0) {
    if (y < 120) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }

    y = drawSectionTitle(page, 'EDUCAÇÃO', 40, y, fontBold, accentColor);

    education.forEach((edu) => {
      page.drawText(edu.degree || 'Curso', {
        x: 40,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
      });

      const dateStr = `${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}`;
      const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
      page.drawText(dateStr, {
        x: A4_WIDTH - 40 - dateWidth,
        y,
        size: 9,
        font: fontRegular,
        color: mutedColor,
      });
      y -= 14;

      const instLine = `${edu.institution || 'Instituição'}${edu.field ? ' · ' + edu.field : ''}`;
      page.drawText(instLine, {
        x: 40,
        y,
        size: 10,
        font: fontItalic,
        color: mutedColor,
      });
      y -= 20;
    });
    y -= 5;
  }

  // === PROJETOS ===
  if (projects.length > 0) {
    if (y < 120) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }

    y = drawSectionTitle(page, 'PROJETOS', 40, y, fontBold, accentColor);

    projects.forEach((proj) => {
      page.drawText(proj.name || 'Projeto', {
        x: 40,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
      });

      if (proj.link) {
        const linkWidth = fontRegular.widthOfTextAtSize(proj.link, 8);
        page.drawText(proj.link, {
          x: A4_WIDTH - 40 - linkWidth,
          y,
          size: 8,
          font: fontRegular,
          color: accentColor,
        });
      }
      y -= 14;

      if (proj.description && proj.description.trim()) {
        const descLines = wrapText(proj.description, 105);
        descLines.forEach((line) => {
          page.drawText(line, {
            x: 40,
            y,
            size: 9,
            font: fontRegular,
            color: textColor,
          });
          y -= 12;
        });
      }

      if (proj.technologies.length > 0) {
        page.drawText(proj.technologies.join(' · '), {
          x: 40,
          y,
          size: 9,
          font: fontItalic,
          color: accentColor,
        });
        y -= 12;
      }
      y -= 10;
    });
    y -= 5;
  }

  // === CERTIFICAÇÕES ===
  if (certifications.length > 0) {
    if (y < 120) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }

    y = drawSectionTitle(page, 'CERTIFICAÇÕES', 40, y, fontBold, accentColor);

    certifications.forEach((cert) => {
      page.drawText(cert.name || 'Certificação', {
        x: 40,
        y,
        size: 10,
        font: fontBold,
        color: textColor,
      });

      if (cert.date) {
        const dateStr = formatDate(cert.date);
        const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
        page.drawText(dateStr, {
          x: A4_WIDTH - 40 - dateWidth,
          y,
          size: 9,
          font: fontRegular,
          color: mutedColor,
        });
      }
      y -= 14;

      if (cert.issuer) {
        page.drawText(cert.issuer, {
          x: 40,
          y,
          size: 9,
          font: fontItalic,
          color: mutedColor,
        });
        y -= 14;
      }
      y -= 4;
    });
    y -= 10;
  }

  // === HABILIDADES E IDIOMAS ===
  if (skills.length > 0 || languages.length > 0) {
    if (y < 150) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }

    const colY = y;

    // Habilidades (coluna esquerda)
    if (skills.length > 0) {
      let skillY = drawSectionTitle(page, 'HABILIDADES', 40, colY, fontBold, accentColor);
      skills.forEach((skill) => {
        page.drawText(skill.name || 'Habilidade', {
          x: 40,
          y: skillY,
          size: 10,
          font: fontRegular,
          color: textColor,
        });
        page.drawText(`${skill.level}/5`, {
          x: 240,
          y: skillY,
          size: 9,
          font: fontBold,
          color: accentColor,
        });
        skillY -= 16;
      });
    }

    // Idiomas (coluna direita)
    if (languages.length > 0) {
      let langY = drawSectionTitle(page, 'IDIOMAS', A4_WIDTH / 2 + 20, colY, fontBold, accentColor);
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
  }

  // === DOWNLOAD ===
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], {
    type: 'application/pdf',
  });
  const url = URL.createObjectURL(blob);

  const safeName = (personal.fullName || 'curriculo')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  const link = document.createElement('a');
  link.download = `cv-${safeName}.pdf`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

// ============================================
// HELPERS
// ============================================

function drawSectionTitle(
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
  y -= 4;
  page.drawLine({
    start: { x, y },
    end: { x: A4_WIDTH - 40, y },
    thickness: 0.5,
    color,
  });
  return y - 20;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;

  const [year, month] = parts;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthIndex = parseInt(month) - 1;

  if (monthIndex < 0 || monthIndex > 11) return year;
  return `${months[monthIndex]} ${year}`;
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