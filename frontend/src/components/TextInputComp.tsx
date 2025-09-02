import React from 'react';

interface TextInputCompProps {
  name: string;
  value?: string;
  placeholder?: string;
  description?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number';
}

export default function TextInputComp({ 
  name,
  value = '',
  placeholder = 'eg. 1st floor',
  description = 'Please write the name of the space where you want to install the tables.',
  onChange,
  className = '',
  type = 'text'
}: TextInputCompProps) {
  return (
    <div 
      className={`box-border flex flex-col gap-[1rem] items-start ${className}`}
      data-name="TextInput"
    >
      <label 
        className="FontStyleSubTitle text-white not-italic"
        htmlFor={name}
      >
        {name}
      </label>
      <input
        id={name}
        type={type}
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="FontStyleText box-border flex items-center px-[1rem] py-[0.5rem] rounded-[0.375rem] bg-[var(--light)] placeholder-gray-500 focus:outline-none transition-colors"
        style={{ 
          minHeight: '40px',
          width: '95%',
          color: 'var(--black)'
        }}
      />
      {description && (
        <div className="FontStyleDisclaimer text-[var(--light)] not-italic">
          {description}
        </div>
      )}
    </div>
  );
}