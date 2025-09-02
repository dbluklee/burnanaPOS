import React from 'react';

// Color palette using CSS variables
const tableColors = [
  'var(--table-color-1)',
  'var(--table-color-2)', 
  'var(--table-color-3)',
  'var(--table-color-4)',
  'var(--table-color-5)',
  'var(--table-color-6)',
  'var(--table-color-7)',
  'var(--table-color-8)'
];

interface ColorSelectorCompProps {
  selectedColorIndex: number;
  onColorSelect: (index: number) => void;
  title?: string;
  description?: string;
}

export default function ColorSelectorComp({ 
  selectedColorIndex, 
  onColorSelect,
  title = "Color",
  description = "On the table card, select a card color to easily distinguish places."
}: ColorSelectorCompProps) {
  return (
    <div className="box-border flex flex-col gap-[1rem] w-full items-start" data-name="ColorSelector">
      {/* Title */}
      <div className="FontStyleSubTitle text-white not-italic">
        {title}
      </div>
      
      {/* Color Palette - the area with color circles */}
      <div 
        className="flex items-center justify-center bg-transparent overflow-hidden" 
        style={{ 
          minHeight: '60px',
          width: '80%',
          padding: 'clamp(0.75rem, 2vw, 1.5rem)' 
        }} 
        data-name="ColorPalette"
      >
        <div className="flex flex-col w-full" style={{ gap: 'clamp(0.8rem, 3vh, 1.5rem)' }}>
          {/* First Row */}
          <div className="flex items-center justify-around relative w-full" style={{ gap: 'clamp(0.4rem, 0.8vw, 0.6rem)' }} data-name="Colors1">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="rounded-full cursor-pointer transition-all flex-shrink-0 relative"
                style={{ 
                  backgroundColor: tableColors[index],
                  width: 'clamp(1.5rem, 4vw, 2.2rem)',
                  aspectRatio: '1',
                  boxShadow: selectedColorIndex === index 
                    ? '0 0 0 clamp(0.2rem, 0.4vw, 0.3rem) rgba(255,255,255,0.8), 0 0 clamp(1.5rem, 3vw, 2rem) rgba(255,255,255,0.4)' 
                    : 'none',
                  transform: selectedColorIndex === index ? 'scale(1.05)' : 'scale(1)'
                }}
                onClick={() => onColorSelect(index)}
              >
                {selectedColorIndex === index && (
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"
                    style={{ margin: '-2px' }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Second Row */}
          <div className="flex items-center justify-around relative w-full" style={{ gap: 'clamp(0.4rem, 0.8vw, 0.6rem)' }} data-name="Colors2">
            {[4, 5, 6, 7].map((index) => (
              <div
                key={index}
                className="rounded-full cursor-pointer transition-all hover:scale-110 flex-shrink-0 relative"
                style={{ 
                  backgroundColor: tableColors[index],
                  width: 'clamp(1.5rem, 4vw, 2.2rem)',
                  aspectRatio: '1',
                  boxShadow: selectedColorIndex === index 
                    ? '0 0 0 clamp(0.2rem, 0.4vw, 0.3rem) rgba(255,255,255,0.8), 0 0 clamp(1.5rem, 3vw, 2rem) rgba(255,255,255,0.4)' 
                    : 'none',
                  transform: selectedColorIndex === index ? 'scale(1.05)' : 'scale(1)'
                }}
                onClick={() => onColorSelect(index)}
              >
                {selectedColorIndex === index && (
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"
                    style={{ margin: '-2px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Description */}
      {description && (
        <div className="FontStyleDisclaimer text-[#e0e0e0] not-italic">
          {description}
        </div>
      )}
    </div>
  );
}

// Export the table colors for use in parent components
export { tableColors };