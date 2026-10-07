import { useState } from 'react';
import { useCVStore } from '../../store/cvStore';

const SUGGESTIONS = [
  'Fotografia', 'Leitura', 'Viagens', 'Desporto', 'Música',
  'Culinária', 'Xadrez', 'Corrida', 'Natação', 'Cinema',
  'Arte', 'Jardinagem', 'Yoga', 'Voluntariado', 'Ciclismo',
];

export function HobbiesSection() {
  const { data, addHobby, updateHobby, removeHobby } = useCVStore();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    addHobby();
    const lastHobby = useCVStore.getState().data.hobbies.slice(-1)[0];
    if (lastHobby) {
      updateHobby(lastHobby.id, 'name', trimmed);
    }
    setInput('');
  };

  return (
    <div className="section">
      <h2>🎨 Interesses & Hobbies</h2>
      <p className="section-description">
        Adiciona os teus passatempos. Humaniza o CV e mostra a tua personalidade.
      </p>

      {/* INPUT RÁPIDO */}
      <div className="hobby-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Ex: Fotografia"
        />
        <button type="button" className="btn-hobby-add" onClick={handleAdd}>
          + Adicionar
        </button>
      </div>

      {/* SUGESTÕES */}
      <div className="suggestions">
        <span className="suggestions-label">Sugestões:</span>
        <div className="suggestions-list">
          {SUGGESTIONS.map((sugg) => (
            <button
              key={sugg}
              type="button"
              className="suggestion-chip"
              onClick={() => {
                addHobby();
                const lastHobby = useCVStore.getState().data.hobbies.slice(-1)[0];
                if (lastHobby) {
                  updateHobby(lastHobby.id, 'name', sugg);
                }
              }}
            >
              {sugg}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      {data.hobbies.length === 0 && (
        <div className="empty-state">
          <p>Ainda não adicionaste nenhum hobby.</p>
        </div>
      )}

      {data.hobbies.length > 0 && (
        <div className="hobbies-list">
          {data.hobbies.map((hobby) => (
            <div key={hobby.id} className="hobby-item">
              <input
                type="text"
                value={hobby.name}
                onChange={(e) => updateHobby(hobby.id, 'name', e.target.value)}
                placeholder="Hobby"
                className="hobby-name-input"
              />
              <button
                type="button"
                className="hobby-remove"
                onClick={() => removeHobby(hobby.id)}
                title="Remover"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}