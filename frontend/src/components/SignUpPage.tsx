import React from 'react';
import SignUpImageComp from './SignUpImageComp';
import SignUpComp from './SignUpComp';

interface SignUpPageProps {
  onBack?: () => void;
  onSignUpComplete?: () => void;
}

export default function SignUpPage({ onBack, onSignUpComplete }: SignUpPageProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left 50% - SignUpImage */}
      <div className="w-1/2">
        <SignUpImageComp />
      </div>
      
      {/* Right 50% - SignUpComp in 30vw area */}
      <div className="w-1/2 flex justify-center items-center" style={{ backgroundColor: '#000000' }}>
        <div style={{ width: '30vw' }}>
          <SignUpComp onBack={onBack} onSignUpComplete={onSignUpComplete} />
        </div>
      </div>
    </div>
  );
}