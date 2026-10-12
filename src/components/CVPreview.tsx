import { useState } from 'react';

// ... outros imports do teu template

export function CVPreview() {
  const [zoom, setZoom] = useState(0.6); // Escala inicial

  return (
    <div className="cv-preview-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 🔍 BARRA DE CONTROLOS DE ZOOM */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '12px', 
        background: 'white', 
        padding: '6px 12px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        alignItems: 'center',
        zIndex: 10
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginRight: '4px' }}>Zoom:</span>
        <button 
          onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
          style={{ padding: '2px 8px', background: '#f0f0f2', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          -
        </button>
        <span style={{ fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button 
          onClick={() => setZoom(Math.min(1.0, zoom + 0.1))}
          style={{ padding: '2px 8px', background: '#f0f0f2', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          +
        </button>
        <button 
          onClick={() => setZoom(0.6)}
          style={{ fontSize: '11px', padding: '2px 6px', background: '#e8f0f8', color: '#0071e3', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '6px' }}
        >
          Repor
        </button>
      </div>

      {/* CANVAS COM A ESCALA DINÂMICA */}
      <div className="cv-preview-scaler" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
        <div className="cv-preview-canvas" style={{ position: 'relative' }}>
          
          {/* 📄 INDICADOR DE LIMITE DA PÁGINA A4 */}
          <div style={{
            position: 'absolute',
            top: '1123px', // Altura exata de uma página A4
            left: 0,
            right: 0,
            borderTop: '2px dashed #ff3b30',
            zIndex: 99,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: '8px'
          }}>
            <span style={{ background: '#ff3b30', color: 'white', fontSize: '9px', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold', transform: 'translateY(-50%)' }}>
              Limite Página 1 (A4)
            </span>
          </div>

          {/* O teu componente de template renderizado aqui */}
          {/* Exemplo: <ModernTemplate data={data} /> ou o conteúdo atual do canvas */}
        </div>
      </div>
    </div>
  );
}