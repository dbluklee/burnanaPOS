import React from 'react';

const chefImage = "http://localhost:3845/assets/fa0ab125aadf59718ff97f0715150ffad6560af6.png";

interface PromotionMidImg1Props {
  imageUrl?: string;
  alt?: string;
}

export default function PromotionMidImg1({ 
  imageUrl = chefImage, 
  alt = "Smiling chef holding tablet" 
}: PromotionMidImg1Props) {
  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{ 
        backgroundColor: 'var(--deep-dark)',
        borderRadius: '2.25rem' // 36px converted to rem
      }}
      data-name="PromotionMidImg1" 
      data-node-id="132:530"
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
      <div 
        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat" 
        data-name="smiling-chef-holding-tablet-modern-cafe-ready-take-orders 1" 
        data-node-id="132:460"
        style={{ 
          backgroundImage: `url('${imageUrl}')`,
          borderRadius: '2.25rem' // Match container border radius
        }}
      />
    </div>
  );
}