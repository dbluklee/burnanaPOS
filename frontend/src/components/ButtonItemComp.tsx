import React from 'react';

interface ButtonItemCompProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function ButtonItemComp({ 
  label, 
  isSelected = false, 
  onClick, 
  className = "",
  style,
  disabled = false
}: ButtonItemCompProps) {
  return (
    <div 
      className={`box-border content-stretch flex items-center justify-center overflow-hidden relative rounded-[1.5rem] shrink-0 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-95'} transition-transform duration-100 ${className}`}
      style={{ height: '100%', padding: 'clamp(0.1rem, 0.3vh, 0.2rem)', ...style }}
      onClick={disabled ? undefined : onClick}
      data-name="ButtonItem"
    >
      <div 
        className={`box-border content-stretch flex items-center justify-center overflow-hidden relative rounded-[1.25rem] shrink-0 h-full ${
          isSelected 
            ? 'bg-[rgba(255,255,255,0.05)] border-[0.125rem] border-[#777777]' 
            : ''
        }`}
        style={{ padding: 'clamp(0.2rem, 0.6vw, 0.4rem) clamp(0.8rem, 2.4vw, 2rem)' }}
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