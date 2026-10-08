import { Modern01 } from './Modern01';
import { Classic01 } from './Classic01';
import { Minimal01 } from './Minimal01';

export const templates = {
  modern: {
    id: 'modern',
    name: 'Moderno',
    component: Modern01,
  },
  classic: {
    id: 'classic',
    name: 'Clássico',
    component: Classic01,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalista',
    component: Minimal01,
  },
};

export type TemplateId = keyof typeof templates;