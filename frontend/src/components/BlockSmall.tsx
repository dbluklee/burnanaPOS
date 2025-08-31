import React from 'react';

interface BlockSmallProps {
  icon?: string;
  alt?: string;
  onClick?: () => void;
}

export default function BlockSmall({ 
  icon = "http://localhost:3845/assets/22d6221ca50c81ceea1200cd023e315074ba4ee7.svg", 
  alt = "Icon",
  onClick
}: BlockSmallProps) {
  return (
    <div 
      className={`relative w-full h-full flex flex-col overflow-hidden ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      style={{ 
        backgroundColor: 'var(--deep-dark)',
        borderRadius: '2.25rem' // 36px converted to rem
      }}
      onClick={onClick}
      data-name="BlockSmall" 
      data-node-id="132:339"
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
      {/* Icon centered in Block */}
      <div 
        className="absolute inset-0 flex items-center justify-center w-full h-full z-10"
        style={{ 
          padding: '1.125rem', // 18px converted to rem
          boxSizing: 'border-box'
        }}
      >
        <img 
          alt={alt}
          className="block object-contain"
          src={icon}
          style={{ 
            height: '30%', // 30% of BlockSmall height
            width: '30%', // 30% of BlockSmall width for square aspect
            objectFit: 'contain',
            // Only apply white filter to SVG icons, not PNG images
            filter: icon.endsWith('.svg') 
              ? 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' // White for SVGs
              : 'none' // No filter for PNG (Burnana logo)
          }}
        />
      </div>
    </div>
  );
}