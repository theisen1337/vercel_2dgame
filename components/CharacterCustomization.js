import React, { useState } from 'react';
import { COLOR_OPTIONS } from '../lib/gameConstants';

const CharacterCustomization = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentColors = {
    skin: '#ffdbac',
    hair: '#8b4513',
    shirt: '#4169e1',
    pants: '#2f4f4f'
  }
}) => {
  const [colors, setColors] = useState(currentColors);

  const handleColorChange = (part, color) => {
    setColors(prev => ({ ...prev, [part]: color }));
  };

  const handleSave = () => {
    onSave(colors);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2d4a3e',
        padding: '30px',
        borderRadius: '15px',
        border: '3px solid #8b7355',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#90ee90', textAlign: 'center', marginBottom: '20px' }}>
          Customize Your Character
        </h2>
        
        {Object.entries(COLOR_OPTIONS).map(([part, options]) => (
          <div key={part} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#90ee90', marginBottom: '10px', textTransform: 'capitalize' }}>
              {part} Color
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {options.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(part, color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    border: colors[part] === color ? '3px solid #90ee90' : '2px solid #8b7355',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#90ee90',
              color: '#2d4a3e',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#8b7355',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization; 