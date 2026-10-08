import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'berci-cv-draft';
const STORAGE_VERSION = 1;

interface StoredDraft<T> {
  version: number;
  savedAt: string;
  data: T;
}

export function useCVLocalStorage<T>(data: T, setData: (d: T) => void) {
  const isFirstRender = useRef(true);

  // Carregar ao montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: StoredDraft<T> = JSON.parse(raw);
      if (parsed.version !== STORAGE_VERSION) {
        console.warn('[CV] Versão de rascunho antiga. A ignorar.');
        return;
      }
      setData(parsed.data);
    } catch (e) {
      console.warn('[CV] Erro ao carregar rascunho:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar a cada alteração (debounced)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      try {
        const payload: StoredDraft<T> = {
          version: STORAGE_VERSION,
          savedAt: new Date().toISOString(),
          data,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn('[CV] Erro ao guardar rascunho:', e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  // Limpar rascunho
  const clearDraft = () => {
    if (confirm('Tens a certeza que queres apagar o rascunho guardado? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  // Verifica se há rascunho guardado
  const hasDraft = () => {
    return !!localStorage.getItem(STORAGE_KEY);
  };

  return { clearDraft, hasDraft, storageKey: STORAGE_KEY };
}