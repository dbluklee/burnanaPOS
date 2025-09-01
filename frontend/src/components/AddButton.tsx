import React from 'react';
import crossIcon from '../assets/ManagementPage/cross.svg';

interface AddButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function AddButton({ onClick, className = "" }: AddButtonProps) {
  return (
    <div 
      className={`content-stretch flex flex-col items-center justify-center relative size-full cursor-pointer hover:opacity-80 transition-opacity ${className}`} 
      data-name="AddButton" 
      data-node-id="261:1423"
      onClick={onClick}
    >
      <div className="overflow-clip relative shrink-0 w-full h-full max-w-8 max-h-8" data-name="Icon / Cross" data-node-id="261:1420">
        <div className="absolute inset-[8.333%]" data-name="Vector" id="node-I261_1420-1_1401">
          <div className="absolute inset-[-5%]" style={{ "--stroke-0": "rgba(224, 224, 224, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" src={crossIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}