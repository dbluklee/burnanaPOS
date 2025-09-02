import React, { useState, useEffect } from 'react';
import SignUpImageComp from './SignUpImageComp';
import SignUpComp from './SignUpComp';

interface SignUpPageProps {
  onBack?: () => void;
  onSignUpComplete?: () => void;
}

export default function SignUpPage({ onBack, onSignUpComplete }: SignUpPageProps) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dynamic layout based on screen size
  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  return (
    <div 
      className="flex overflow-hidden"
      style={{ 
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#000000'
      }}
    >
      {/* Dynamic Layout based on screen size */}
      {isMobile ? (
        // Mobile: Stack vertically
        <div className="w-full h-full flex flex-col">
          {/* Top: SignUpImage - 40% height */}
          <div className="w-full" style={{ height: '40%' }}>
            <SignUpImageComp />
          </div>
          
          {/* Bottom: SignUpComp - 60% height */}
          <div className="w-full" style={{ height: '60%' }}>
            <SignUpComp onBack={onBack} onSignUpComplete={onSignUpComplete} />
          </div>
        </div>
      ) : (
        // Desktop/Tablet: Side by side
        <div className="w-full h-full flex">
          {/* Left Side: SignUpImage */}
          <div 
            className="h-full"
            style={{ 
              width: isTablet ? '40%' : '50%',
              transition: 'width 0.3s ease-in-out'
            }}
          >
            <SignUpImageComp />
          </div>
          
          {/* Right Side: SignUpComp */}
          <div 
            className="h-full flex items-center justify-center"
            style={{ 
              width: isTablet ? '60%' : '50%',
              backgroundColor: '#000000',
              transition: 'width 0.3s ease-in-out',
              padding: 'clamp(1rem, 2vw, 2rem)'
            }}
          >
            <div 
              style={{ 
                width: '100%',
                maxWidth: isTablet ? '500px' : '600px',
                height: '100%'
              }}
            >
              <SignUpComp onBack={onBack} onSignUpComplete={onSignUpComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}