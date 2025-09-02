import React from 'react';
import signUpImage from '../assets/SignUpPage/SignUpImage.jpg';

interface SignUpImageCompProps {
  className?: string;
}

export default function SignUpImageComp({ className }: SignUpImageCompProps) {
  return (
    <div 
      className={`h-full flex items-center justify-center ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000'
      }}
    >
      <img 
        src={signUpImage}
        alt="Sign Up"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}