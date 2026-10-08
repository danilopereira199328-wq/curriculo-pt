import { useState } from 'react';
import { useCVStore } from '../store/cvStore';
import { exportCVAsPDF } from '../utils/exportCV';

export function DownloadButtons() {
  const { data, template } = useCVStore();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await exportCVAsPDF(data, template);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tenta novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="download-buttons">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="btn-download"
      >
        {isDownloading ? '⏳ A gerar PDF...' : '📥 Descarregar Currículo PDF'}
      </button>
      <div className="download-template-info">
        Template: <strong>{template === 'classic' ? 'Clássico' : template === 'minimal' ? 'Minimalista' : 'Moderno'}</strong>
      </div>
    </div>
  );
}