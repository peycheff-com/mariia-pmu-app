
import React from 'react';

interface ColorPaletteProps {
  colors: Record<string, string>;
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(colors).map(([name, hex]) => (
        <button
          key={name}
          onClick={() => onSelect(hex)}
          className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 ${
            selectedColor === hex ? 'border-amber-400 scale-110' : 'border-stone-600 hover:scale-105'
          }`}
          style={{ backgroundColor: hex }}
          aria-label={name.replace('_', ' ')}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
