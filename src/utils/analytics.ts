// ============================================
// Umami Analytics — Helper
// ============================================

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, any>) => void;
    };
  }
}

function trackEvent(eventName: string, data?: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, data);
  }
}

// ============================================
// Eventos do Currículo.pt
// ============================================

export const analytics = {
  pdfGenerated: (template: string, fieldsCount: number) =>
    trackEvent('pdf_generated', { template, fieldsCount }),

  cvImported: (detected: number, warnings: number) =>
    trackEvent('cv_imported', { detected, warnings }),

  templateChanged: (template: string) =>
    trackEvent('template_changed', { template }),

  colorChanged: (color: string) =>
    trackEvent('color_changed', { color }),

  draftCleared: () =>
    trackEvent('draft_cleared'),
};