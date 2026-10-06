import { useCVStore } from '../store/cvStore';
import { templates } from '../templates';

export function CVPreview() {
  const { data, template } = useCVStore();

  const templateConfig = templates[template];

  if (!templateConfig) {
    return <div className="preview-empty">Template não encontrado</div>;
  }

  const TemplateComponent = templateConfig.component;

  return (
    <div className="cv-preview-container">
      <div className="cv-preview-scaler">
        <div className="cv-preview-canvas">
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  );
}