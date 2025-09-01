import React from 'react';

interface TextInputProps {
  name: string;
  value?: string;
  placeholder?: string;
  description?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number';
}

export default function TextInput({ 
  name,
  value = '',
  placeholder = 'eg. 1st floor',
  description = 'Please write the name of the space where you want to install the tables.',
  onChange,
  className = '',
  type = 'text'
}: TextInputProps) {
  return (
    <div 
      className={`box-border flex flex-col gap-[1rem] items-start ${className}`}
      data-name="TextInput"
    >
      <label 
        className="FontStyleTitle text-white not-italic"
        htmlFor={name}
      >
        {name}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="FontStyleText box-border flex items-center px-[1.5rem] py-[1rem] rounded-[0.375rem] bg-[#e0e0e0] placeholder-gray-500 focus:outline-none transition-colors"
        style={{ 
          minHeight: '60px',
          width: '80%',
          color: '#000000'
        }}
      />
      {description && (
        <div className="FontStyleText text-[#e0e0e0] not-italic">
          {description}
        </div>
      )}
    </div>
  );
}