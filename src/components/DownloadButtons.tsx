import { useState } from 'react';
import { useCVStore } from '../store/cvStore';
import { exportCVAsPDF } from '../utils/exportCV';
import { validateCV } from '../utils/validation';
import { analytics } from '../utils/analytics';

export function DownloadButtons() {
  const { data, template, reset } = useCVStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDownload = async () => {
    const validationErrors = validateCV(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.message));
      return;
    }
    setErrors([]);

    setIsDownloading(true);
    try {
      await exportCVAsPDF(data, template);

      // 👇 Analytics — PDF gerado
      const fieldsCount =
        Object.values(data.personal).filter(Boolean).length +
        data.experience.length +
        data.education.length +
        data.skills.length;
      analytics.pdfGenerated(template, fieldsCount);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tenta novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    if (
      confirm(
        'Tens a certeza que queres apagar tudo? Esta ação não pode ser desfeita.'
      )
    ) {
      reset();
      setErrors([]);
      analytics.draftCleared(); // 👈 Analytics
    }
  };

  return (
    <div className="download-buttons">
      {errors.length > 0 && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            padding: '10px 12px',
            marginBottom: '10px',
            fontSize: '13px',
            color: '#92400e',
          }}
        >
          <strong>⚠️ Corrige antes de gerar o PDF:</strong>
          <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="btn-download"
      >
        {isDownloading ? '⏳ A gerar PDF...' : '📥 Descarregar Currículo PDF'}
      </button>

      <button
        onClick={handleReset}
        type="button"
        style={{
          display: 'block',
          width: '100%',
          marginTop: '12px',
          padding: '10px',
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #dc2626',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        🗑️ Limpar rascunho
      </button>

      <div className="download-template-info">
        Template:{' '}
        <strong>
          {template === 'classic'
            ? 'Clássico'
            : template === 'minimal'
            ? 'Minimalista'
            : 'Moderno'}
        </strong>
      </div>
    </div>
  );
}