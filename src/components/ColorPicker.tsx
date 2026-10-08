interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  { name: 'Azul', value: '#0066FF' },
  { name: 'Verde', value: '#00A86B' },
  { name: 'Roxo', value: '#7B3FF2' },
  { name: 'Vermelho', value: '#E63946' },
  { name: 'Laranja', value: '#FF7A00' },
  { name: 'Rosa', value: '#E91E8C' },
  { name: 'Turquesa', value: '#00B5B5' },
  { name: 'Preto', value: '#1A1A1A' },
  { name: 'Azul-escuro', value: '#1E3A8A' },
  { name: 'Verde-escuro', value: '#065F46' },
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="text-sm font-medium text-gray-700">
          Cor de destaque
        </label>
        <span className="text-xs text-gray-400 font-mono">
          {value || '#0066FF'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            title={c.name}
            aria-label={c.name}
            className={`w-8 h-8 rounded-full border-2 transition-transform ${
              value === c.value
                ? 'border-gray-800 scale-110 shadow-md'
                : 'border-gray-200 hover:scale-105'
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}

        <label
          className="relative w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-500 cursor-pointer overflow-hidden"
          title="Cor personalizada"
        >
          <input
            type="color"
            value={value || '#0066FF'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500">
            +
          </span>
        </label>
      </div>
    </div>
  );
}