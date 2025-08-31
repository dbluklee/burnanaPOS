import React from 'react';

const analyticsImage = "http://localhost:3845/assets/fe8f4feee93370df77b4cec9782cd56404b11630.png";

interface PromotionMidImg2Props {
  imageUrl?: string;
  alt?: string;
}

export default function PromotionMidImg2({ 
  imageUrl = analyticsImage, 
  alt = "Female analyst using computer dashboard for business data analysis" 
}: PromotionMidImg2Props) {
  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{ 
        backgroundColor: 'var(--deep-dark)',
        borderRadius: '2.25rem' // 36px converted to rem
      }}
      data-name="PromotionMidImg2" 
      data-node-id="132:549"
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
        data-name="female-analyst-utilizes-computer-dashboard-business-data-analyze-data-management-system-with-kpi-concepts-technology-finance-operations-sales-marketing 1" 
        data-node-id="132:547"
        style={{ 
          backgroundImage: `url('${imageUrl}')`,
          borderRadius: '2.25rem' // Match container border radius
        }}
      />
    </div>
  );
}