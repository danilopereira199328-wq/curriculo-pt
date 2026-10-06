import { Modern01 } from './Modern01';

export const templates = {
  modern: {
    id: 'modern',
    name: 'Moderno',
    component: Modern01,
  },
};

export type TemplateId = keyof typeof templates;