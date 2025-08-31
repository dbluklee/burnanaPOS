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
        style={{ padding: 'clamp(0.2rem, 0.8vw, 0.6rem)' }}
        data-name="ButtonItemInner"
      >
        <div className="bg-clip-text flex flex-col font-['Pretendard'] font-semibold justify-center leading-[1] not-italic relative shrink-0 text-center text-white" style={{ fontSize: 'clamp(0.65rem, 1.1vw, 1rem)' }}>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}