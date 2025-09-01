import React from 'react';

interface ButtonItemProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ButtonItem({ 
  label, 
  isSelected = false, 
  onClick, 
  className = "" 
}: ButtonItemProps) {
  return (
    <div 
      className={`box-border content-stretch flex items-center justify-center overflow-hidden relative rounded-[1.5rem] shrink-0 cursor-pointer ${className}`}
      style={{ height: '100%', padding: 'clamp(0.1rem, 0.3vh, 0.2rem)' }}
      onClick={onClick}
      data-name="ButtonItem"
    >
      <div 
        className={`box-border content-stretch flex items-center justify-center overflow-hidden relative rounded-[1.25rem] shrink-0 h-full ${
          isSelected 
            ? 'bg-[rgba(255,255,255,0.05)] border-[0.125rem] border-[#777777]' 
            : ''
        }`}
        style={{ padding: 'clamp(0.4rem, 1.2vw, 1rem)' }}
        data-name="ButtonItemInner"
      >
        <div 
          className="FontStyleButtonItemText bg-clip-text flex flex-col justify-center leading-[1] not-italic relative shrink-0 text-center"
          style={{ color: 'var(--light)' }}
        >
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}