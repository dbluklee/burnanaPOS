import React from 'react';

const arrowIcon = "http://localhost:3845/assets/3f880f964cb3569c13c09c77b39a9869fe93f708.svg";

interface HighlightBlockProps {
  intro?: string;
  title?: string;
}

export default function HighlightBlock({ 
  intro = "Intro", 
  title = "HighlightTile" 
}: HighlightBlockProps) {
  return (
    <div 
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: 'var(--deep-dark)',
        borderRadius: '2.25rem' // 36px converted to rem
      }}
      data-name="HighlightBlock" 
      data-node-id="132:631"
    >
      {/* StyleLinearWhite border with inner shadow and rounded box */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none StyleLinearWhite" 
        style={{
          padding: '0.1rem',
          borderRadius: '2.25rem'
        }}
      >
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundColor: 'transparent',
            borderRadius: '2.05rem' // Slightly smaller to account for padding
          }} 
        />
      </div>
      {/* BlockText - Centered in Block */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center w-full h-full overflow-hidden"
        style={{ 
          padding: '2.5rem 3.5rem 2.5rem 2.5rem', // Extra right padding to avoid arrow
          gap: 'clamp(0.25rem, 1vmin, 0.5rem)',
          maxHeight: '100%',
          boxSizing: 'border-box'
        }}
        data-name="BlockText" 
        data-node-id="108:222"
      >
        {/* BlockTextIntro */}
        {intro && (
          <div 
            className="FontStyleBlockText w-full"
            data-name="BlockTextIntro"
            data-node-id="108:223"
            style={{
              color: 'var(--grey)',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%',
              width: '100%'
            }}
          >
            {intro}
          </div>
        )}
        
        {/* BlockTextTitle with BlockHighlight style and gradient */}
        <div 
          className="FontStyleBlockHighlight w-full flex-shrink-0 overflow-hidden"
          data-name="BlockTextTitle"
          data-node-id="108:224"
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
            width: '100%',
            maxHeight: '100%'
          }}
        >
          {title}
        </div>
      </div>
      
      {/* Arrow with circle positioned at bottom-right */}
      <div 
        className="absolute bottom-[1rem] right-[1rem] z-10"
      >
        <div className="rotate-[135deg] scale-y-[-1]">
          <div 
            className="flex items-center justify-center relative rounded-full" 
            style={{ 
              backgroundColor: 'var(--deep-dark)',
              padding: 'clamp(0.2rem, 0.5vw, 0.375rem)', // Minimal padding
              width: 'clamp(1rem, 2.5vw, 1.75rem)', // Even smaller circle width
              height: 'clamp(1rem, 2.5vw, 1.75rem)', // Even smaller circle height
              border: '0.0625rem solid #2d2d2d'
            }}
          >
            <img 
              alt="" 
              className="block object-contain" 
              src={arrowIcon} 
              style={{ 
                filter: 'invert(0.8)', // Make arrow lighter
                width: 'clamp(0.75rem, 1.5vw, 1.25rem)', // Responsive icon width
                height: 'clamp(0.75rem, 1.5vw, 1.25rem)' // Responsive icon height
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}