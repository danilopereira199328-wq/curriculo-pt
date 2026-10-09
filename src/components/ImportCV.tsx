import { useState } from 'react';
import { useCVStore } from '../store/cvStore';
import { extractTextFromFile } from '../utils/importCV';
import { parseCVText } from '../utils/parseCVText';

interface ImportFeedback {
  detected: string[];
  warnings: string[];
}

export function ImportCV() {
  const { data, setData } = useCVStore();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<ImportFeedback | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError('');
    setFeedback(null);

    try {
      const text = await extractTextFromFile(file);
      const { data: parsed, detected, warnings } = parseCVText(text);

      setData({
        ...data,
        personal: { ...data.personal, ...parsed.personal },
        experience: parsed.experience.length > 0 ? parsed.experience : data.experience,
        education: parsed.education.length > 0 ? parsed.education : data.education,
        skills: parsed.skills.length > 0 ? parsed.skills : data.skills,
        languages: parsed.languages.length > 0 ? parsed.languages : data.languages,
      });

      setFeedback({ detected, warnings });
    } catch (err: any) {
      setError(err.message || 'Erro ao importar. Tenta outro ficheiro.');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const closeFeedback = () => setFeedback(null);

  return (
    <div style={{ marginTop: '12px' }}>
      <label
        style={{
          display: 'block',
          padding: '10px 16px',
          background: '#f0f7ff',
          border: '1px dashed #0071e3',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          color: '#0071e3',
        }}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFile}
          style={{ display: 'none' }}
          disabled={isImporting}
        />
        {isImporting ? '⏳ A importar...' : '📎 Importar Currículo (PDF/DOCX)'}
      </label>

      {error && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px 12px',
            background: '#fee2e2',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#991b1b',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {feedback && (
        <div
          style={{
            marginTop: '12px',
            padding: '14px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#065f46' }}>✅ Importação concluída</strong>
            <button
              onClick={closeFeedback}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#6b7280',
                padding: 0,
              }}
              title="Fechar"
            >
              ✕
            </button>
          </div>

          {feedback.detected.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#065f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Detetado
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  color: '#374151',
                  lineHeight: 1.6,
                }}
              >
                {feedback.detected.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.warnings.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#92400e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                ⚠️ Verifica manualmente
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  color: '#78350f',
                  lineHeight: 1.6,
                  fontSize: '12px',
                }}
              >
                {feedback.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}