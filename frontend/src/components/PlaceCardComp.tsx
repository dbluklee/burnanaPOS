import React from 'react';

interface PlaceCardCompProps {
  placeName: string;
  tableCount: number;
  color: string;
  property?: "Default" | "Empty" | "Selected";
  onClick?: () => void;
}

export default function PlaceCardComp({ 
  placeName, 
  tableCount, 
  color,
  property = "Default",
  onClick 
}: PlaceCardCompProps) {
  
  // Empty state - dashed border
  if (property === "Empty") {
    return (
      <div 
        className="relative rounded-[2.25rem] w-full h-full cursor-pointer"
        onClick={onClick}
        data-name="PlaceCard-Empty"
      >
        <div 
          aria-hidden="true" 
          className="absolute border-2 border-[#2d2d2d] border-dashed inset-0 pointer-events-none rounded-[2.25rem] opacity-30" 
        />
      </div>
    );
  }

  // Selected state - with inner shadow
  if (property === "Selected") {
    return (
      <div 
        className="box-border flex flex-col items-start justify-end relative w-full h-full cursor-pointer transition-all duration-200"
        style={{ 
          backgroundColor: color,
          boxShadow: 'inset 4px 10px 10px 0px rgba(45, 45, 45, 0.3)',
          padding: '15%',
          gap: '8%',
          borderRadius: '15%'
        }}
        onClick={onClick}
        data-name="PlaceCard-Selected"
      >
        <div className="flex flex-col items-start justify-start relative w-full" style={{ gap: '8%' }}>
          <div className="flex flex-col items-start justify-end relative w-full">
            <div className="FontStyleTitle overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--dark, #2d2d2d)', fontSize: '1.5em' }}>
              {placeName}
            </div>
          </div>
          <div className="box-border flex flex-col items-start justify-end relative w-full">
            <div className="FontStyleDisclaimer overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: '#555555', fontSize: '0.75em' }}>
              {tableCount} Tables
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state
  return (
    <div 
      className="box-border flex flex-col items-start justify-end relative w-full h-full cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      style={{ 
        backgroundColor: color,
        padding: '15%',
        gap: '8%',
        borderRadius: '15%'
      }}
      onClick={onClick}
      data-name="PlaceCard-Default"
    >
      <div className="flex flex-col items-start justify-start relative w-full" style={{ gap: '8%' }}>
        <div className="flex flex-col items-start justify-end relative w-full">
          <div className="FontStyleTitle overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: 'var(--dark, #2d2d2d)', fontSize: '1.5em' }}>
            {placeName}
          </div>
        </div>
        <div className="box-border flex flex-col items-start justify-end relative w-full">
          <div className="FontStyleDisclaimer overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: '#555555', fontSize: '0.75em' }}>
            {tableCount} Tables
          </div>
        </div>
      </div>
    </div>
  );
}