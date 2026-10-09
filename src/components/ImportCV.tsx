import { useState } from 'react';
import { useCVStore } from '../store/cvStore';
import { extractTextFromFile } from '../utils/importCV';
import { parseCVText } from '../utils/parseCVText';

export function ImportCV() {
  const { data, setData } = useCVStore();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError('');

    try {
      const text = await extractTextFromFile(file);
      const parsed = parseCVText(text);

      setData({
        ...data,
        personal: { ...data.personal, ...parsed.personal },
        experience: parsed.experience.length > 0 ? parsed.experience : data.experience,
        education: parsed.education.length > 0 ? parsed.education : data.education,
        skills: parsed.skills.length > 0 ? parsed.skills : data.skills,
        languages: parsed.languages.length > 0 ? parsed.languages : data.languages,
      });

      alert('Currículo importado! Revisa os campos e corrige o que for necessário.');
    } catch (err: any) {
      setError(err.message || 'Erro ao importar. Tenta outro ficheiro.');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

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
        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>
          {error}
        </p>
      )}
    </div>
  );
}