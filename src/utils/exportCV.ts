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

  const { personal, experience, education, skills, languages } = data;

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

  page.drawText(personal.fullName || 'Nome Completo', {
    x: photoEndX,
    y: A4_HEIGHT - 70,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(personal.jobTitle || 'Cargo Profissional', {
    x: photoEndX,
    y: A4_HEIGHT - 95,
    size: 13,
    font: fontRegular,
    color: rgb(0.85, 0.85, 0.9),
  });

  const contacts = [personal.email, personal.phone, personal.location]
    .filter(Boolean)
    .join('  ·  ');

  if (contacts) {
    page.drawText(contacts, {
      x: photoEndX,
      y: A4_HEIGHT - 120,
      size: 9,
      font: fontRegular,
      color: rgb(0.85, 0.85, 0.9),
    });
  }

  let y = A4_HEIGHT - 200;

  // === RESUMO ===
  if (personal.summary) {
    page.drawText('SOBRE MIM', {
      x: 40,
      y,
      size: 10,
      font: fontBold,
      color: accentColor,
    });
    y -= 4;
    page.drawLine({
      start: { x: 40, y },
      end: { x: A4_WIDTH - 40, y },
      thickness: 0.5,
      color: accentColor,
    });
    y -= 20;

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

    page.drawText('EXPERIÊNCIA PROFISSIONAL', {
      x: 40,
      y,
      size: 11,
      font: fontBold,
      color: accentColor,
    });
    y -= 4;
    page.drawLine({
      start: { x: 40, y },
      end: { x: A4_WIDTH - 40, y },
      thickness: 0.5,
      color: accentColor,
    });
    y -= 20;

    experience.forEach((exp) => {
      page.drawText(exp.position || 'Cargo', {
        x: 40,
        y,
        size: 11,
        font: fontBold,
        color: textColor,
      });

      const dateStr = `${formatDate(exp.startDate)} — ${
        exp.current ? 'Presente' : formatDate(exp.endDate)
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

      page.drawText(`${exp.company}${exp.location ? ' · ' + exp.location : ''}`, {
        x: 40,
        y,
        size: 10,
        font: fontItalic,
        color: mutedColor,
      });
      y -= 16;

      if (exp.description) {
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

    page.drawText('EDUCAÇÃO', {
      x: 40,
      y,
      size: 11,
      font: fontBold,
      color: accentColor,
    });
    y -= 4;
    page.drawLine({
      start: { x: 40, y },
      end: { x: A4_WIDTH - 40, y },
      thickness: 0.5,
      color: accentColor,
    });
    y -= 20;

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

      page.drawText(`${edu.institution}${edu.field ? ' · ' + edu.field : ''}`, {
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

  // === HABILIDADES E IDIOMAS ===
  if (skills.length > 0 || languages.length > 0) {
    if (y < 120) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - 60;
    }

    if (skills.length > 0) {
      page.drawText('HABILIDADES', {
        x: 40,
        y,
        size: 11,
        font: fontBold,
        color: accentColor,
      });

      let skillY = y - 20;
      skills.forEach((skill) => {
        page.drawText(skill.name || 'Habilidade', {
          x: 40,
          y: skillY,
          size: 10,
          font: fontRegular,
          color: textColor,
        });
        page.drawText(`${skill.level}/5`, {
          x: 260,
          y: skillY,
          size: 9,
          font: fontBold,
          color: accentColor,
        });
        skillY -= 16;
      });
    }

    if (languages.length > 0) {
      page.drawText('IDIOMAS', {
        x: A4_WIDTH / 2 + 20,
        y,
        size: 11,
        font: fontBold,
        color: accentColor,
      });

      let langY = y - 20;
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
    .replace(/[^a-z0-9]/g, '-');

  const link = document.createElement('a');
  link.download = `cv-${safeName}.pdf`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  paragraphs.forEach((paragraph) => {
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