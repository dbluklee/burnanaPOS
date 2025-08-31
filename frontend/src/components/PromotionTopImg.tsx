import React from 'react';

const qrCodeImage = "http://localhost:3845/assets/8543dcb891358e22f850df88bd5f5129385bfda1.png";

interface PromotionTopImgProps {
  imageUrl?: string;
  alt?: string;
}

export default function PromotionTopImg({ 
  imageUrl = qrCodeImage, 
  alt = "QR Code Payment" 
}: PromotionTopImgProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center relative rounded-[36px] w-full h-full" 
      data-name="PromotionTopImg" 
      data-node-id="108:315"
    >
      <div 
        className="relative w-full h-full overflow-hidden"
        style={{ 
          backgroundColor: 'var(--deep-dark)',
          borderRadius: '2.25rem' // 36px converted to rem
        }}
        data-name="Img" 
        data-node-id="108:325"
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
          data-name="hand-using-mobile-smart-phone-scan-qr-code-barcode-reader-qr-code-payment-cashless-technology-digital-money-concept 1" 
          data-node-id="108:326"
          style={{ 
            backgroundImage: `url('${imageUrl}')`,
            borderRadius: '2.25rem' // Match container border radius
          }}
        />
      </div>
    </div>
  );
}