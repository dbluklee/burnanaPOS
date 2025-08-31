import React from 'react';

const robotImage = "http://localhost:3845/assets/fb3c1f91193f9b15e851c363607dd1820617dd6c.png";

interface PromotionBottomImgProps {
  imageUrl?: string;
  alt?: string;
}

export default function PromotionBottomImg({ 
  imageUrl = robotImage, 
  alt = "Anthropomorphic robot that performs regular human job" 
}: PromotionBottomImgProps) {
  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{ 
        backgroundColor: 'var(--deep-dark)',
        borderRadius: '2.25rem' // 36px converted to rem
      }}
      data-name="PromotionBottomImg" 
      data-node-id="132:652"
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
        data-name="anthropomorphic-robot-that-performs-regular-human-job 1" 
        data-node-id="132:650"
        style={{ 
          backgroundImage: `url('${imageUrl}')`,
          borderRadius: '2.25rem' // Match container border radius
        }}
      />
    </div>
  );
}