import React from 'react';

const arrowIcon = "http://localhost:3845/assets/3f880f964cb3569c13c09c77b39a9869fe93f708.svg";

interface BlockProps {
  intro?: string;
  title?: string;
  description?: string;
  onClick?: () => void;
}

export default function Block({ intro = "Intro", title = "Title", description = "Desc", onClick }: BlockProps) {
  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-hidden ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 active:shadow-inner transition-all duration-200 ease-out' : ''}`}
      style={{ 
        backgroundColor: 'var(--deep-dark)',
        borderRadius: '2.25rem' // 36px converted to rem
      }}
      onClick={onClick}
      data-name="Block" 
      data-node-id="108:231"
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
          gap: '0.5rem',
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
        
        {/* BlockTextTitle */}
        <div 
          className="FontStyleBlockTitle w-full flex-shrink-0"
          data-name="BlockTextTitle"
          data-node-id="108:224"
          style={{
            color: 'var(--white)',
            lineHeight: '1.1',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
            width: '100%'
          }}
        >
          {title}
        </div>
        
        {/* BlockTextDesc */}
        {description && (
          <div 
            className="FontStyleBlockText w-full"
            data-name="BlockTextDesc"
            data-node-id="108:225"
            style={{
              color: 'var(--grey)',
              lineHeight: '1.3',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%',
              width: '100%'
            }}
          >
            {description}
          </div>
        )}
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