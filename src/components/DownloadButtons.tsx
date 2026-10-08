import { useState } from 'react';
import { useCVStore } from '../store/cvStore';
import { exportCVAsPDF } from '../utils/exportCV';

export function DownloadButtons() {
  const { data, template, reset } = useCVStore();
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

  const handleReset = () => {
    if (
      confirm(
        'Tens a certeza que queres apagar tudo? Esta ação não pode ser desfeita.'
      )
    ) {
      reset();
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

      {/* 👇 NOVO — botão limpar rascunho */}
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