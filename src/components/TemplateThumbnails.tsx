import type { TemplateType } from '../types/cv';

interface TemplateThumbnailProps {
  template: TemplateType;
  selected: boolean;
  onClick: () => void;
}

function TemplateThumbnail({ template, selected, onClick }: TemplateThumbnailProps) {
  const label =
    template === 'modern' ? 'Moderno' : template === 'classic' ? 'Clássico' : 'Minimalista';

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '8px',
        borderRadius: '8px',
        border: selected ? '2px solid #2563eb' : '2px solid #e5e7eb',
        background: selected ? '#eff6ff' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.15s',
        minWidth: '80px',
      }}
    >
      {/* Miniatura */}
      <div
        style={{
          width: '64px',
          height: '80px',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
          background: '#ffffff',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {template === 'modern' && (
          <>
            <div style={{ height: '24px', background: '#1e3a8a' }} />
            <div style={{ padding: '4px' }}>
              <div style={{ height: '4px', background: '#d1d5db', borderRadius: '2px', width: '75%', marginBottom: '3px' }} />
              <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '50%', marginBottom: '6px' }} />
              <div style={{ height: '4px', background: '#d1d5db', borderRadius: '2px', width: '66%', marginBottom: '3px' }} />
              <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '100%', marginBottom: '3px' }} />
              <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '83%' }} />
            </div>
          </>
        )}

        {template === 'classic' && (
          <div style={{ padding: '4px' }}>
            <div style={{ height: '5px', background: '#1f2937', borderRadius: '2px', width: '75%', margin: '4px auto 3px' }} />
            <div style={{ height: '4px', background: '#d1d5db', borderRadius: '2px', width: '50%', margin: '0 auto 8px' }} />
            <div style={{ height: '2px', background: '#1f2937', width: '100%', marginBottom: '4px' }} />
            <div style={{ height: '4px', background: '#9ca3af', borderRadius: '2px', width: '66%', marginBottom: '3px' }} />
            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '100%', marginBottom: '3px' }} />
            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '83%', marginBottom: '4px' }} />
            <div style={{ height: '4px', background: '#9ca3af', borderRadius: '2px', width: '50%', marginBottom: '3px' }} />
            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '100%' }} />
          </div>
        )}

        {template === 'minimal' && (
          <div style={{ padding: '6px' }}>
            <div style={{ height: '5px', background: '#374151', borderRadius: '2px', width: '50%', marginBottom: '3px' }} />
            <div style={{ height: '4px', background: '#d1d5db', borderRadius: '2px', width: '33%', marginBottom: '10px' }} />
            <div style={{ height: '2px', background: '#e5e7eb', width: '100%', marginBottom: '4px' }} />
            <div style={{ height: '4px', background: '#9ca3af', borderRadius: '2px', width: '66%', marginBottom: '3px' }} />
            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '100%', marginBottom: '8px' }} />
            <div style={{ height: '2px', background: '#e5e7eb', width: '100%', marginBottom: '4px' }} />
            <div style={{ height: '4px', background: '#9ca3af', borderRadius: '2px', width: '50%', marginBottom: '3px' }} />
            <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', width: '100%' }} />
          </div>
        )}
      </div>

      {/* Nome */}
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: selected ? '#1d4ed8' : '#4b5563',
        }}
      >
        {label}
      </span>
    </button>
  );
}

interface TemplateSelectorProps {
  value: TemplateType;
  onChange: (t: TemplateType) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
      {(['modern', 'classic', 'minimal'] as const).map((t) => (
        <TemplateThumbnail
          key={t}
          template={t}
          selected={value === t}
          onClick={() => onChange(t)}
        />
      ))}
    </div>
  );
}