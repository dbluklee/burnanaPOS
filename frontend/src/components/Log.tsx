import React, { useState, useRef, useEffect } from 'react';
import Item from './Item';

const undoIcon = "data:image/svg+xml,<svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M33.334 33.334L16.668 50.0007L33.334 66.6673' stroke='%23E74C3C' stroke-width='3.33333' stroke-linecap='round' stroke-linejoin='round'/><path d='M63.3327 16.6673V50.0007C63.3327 51.7689 62.6309 53.4649 61.3806 54.7152C60.1304 55.9654 58.4344 56.6673 56.666 56.6673H16.668' stroke='%23E74C3C' stroke-width='3.33333' stroke-linecap='round' stroke-linejoin='round'/></svg>";

interface LogProps {
  time: string;
  text: string;
  itemLabel?: string;
  property1?: "Default" | "Undo";
  onUndo?: () => void;
}

function Log({ time, text, itemLabel, property1 = "Default", onUndo }: LogProps) {
  const [slideDistance, setSlideDistance] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  
  const handleStart = (clientX: number) => {
    if (property1 !== "Undo") return;
    startX.current = clientX;
    isDragging.current = true;
  };
  
  const handleMove = (clientX: number) => {
    if (!isDragging.current || property1 !== "Undo") return;
    const distance = clientX - startX.current;
    // Allow sliding right to reveal undo icon, clamp between 0 and 64px
    const newDistance = Math.max(0, Math.min(distance, 64));
    setSlideDistance(newDistance);
  };
  
  const handleEnd = () => {
    if (!isDragging.current || property1 !== "Undo") return;
    isDragging.current = false;
    // Snap behavior: if slid more than halfway, snap to full reveal
    if (slideDistance > 32) {
      setSlideDistance(64);
    } else {
      setSlideDistance(0);
    }
  };
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleEnd();
  };
  
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
    e.preventDefault(); // Prevent text selection
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleEnd();
  };
  
  // Global mouse event listeners for when dragging outside the element
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleMove(e.clientX);
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        handleEnd();
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // StyleLinearWhite border with inner shadow and rounded box
  const borderElement = (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 pointer-events-none rounded-[0.3rem]" 
      style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0))',
        padding: '0.1rem'
      }}
    >
      <div 
        className="w-full h-full rounded-[0.3rem]" 
        style={{ 
          backgroundColor: 'var(--dark)',
          boxShadow: '0px 0.4rem 0.4rem 0px inset rgba(0,0,0,0.25)'
        }} 
      />
    </div>
  );
  
  if (property1 === "Undo") {
    return (
      <div className="flex items-center w-full h-full overflow-hidden" data-name="Property 1=Undo" data-node-id="256:2909">
        {/* Undo icon with grey background positioned to the left */}
        <div 
          className="flex items-center justify-center cursor-pointer shrink-0 h-full rounded-l-[0.3rem]" 
          data-name="Undo" 
          data-node-id="256:2910"
          onClick={onUndo}
          style={{ 
            width: '4rem', 
            backgroundColor: '#666666' // Grey background
          }}
        >
          <div className="overflow-clip relative shrink-0" data-name="Icon / Undo2" data-node-id="256:2911" style={{ width: '3rem', height: '3rem' }}>
            <div className="absolute" style={{ inset: '16.667%' }} data-name="Vector">
              <div className="absolute" style={{ inset: '-6.25%' }}>
                <img alt="Undo" className="block max-w-none size-full" src={undoIcon} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Log content that can slide to reveal/hide undo icon */}
        <div 
          className="box-border flex items-center justify-start relative rounded-r-[0.3rem] flex-1 h-full transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing" 
          data-name="LogContent" 
          data-node-id="256:2912" 
          style={{ 
            backgroundColor: 'var(--dark)', 
            gap: '0.6rem', 
            padding: '1rem 1rem', 
            boxShadow: '0px 0.4rem 0.4rem 0px inset rgba(0,0,0,0.25)',
            transform: `translateX(${slideDistance - 64}px)` // Transform based on slide distance, starting from hidden position (-64px)
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div 
            aria-hidden="true" 
            className="absolute inset-0 pointer-events-none rounded-[0.3rem]" 
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0))',
              padding: '0.1rem'
            }}
          >
            <div className="w-full h-full rounded-[0.3rem]" style={{ backgroundColor: 'transparent' }} />
          </div>
          <div className="flex items-center justify-center overflow-clip relative shrink-0 z-10" data-name="Time" data-node-id="256:2913" style={{ gap: '0.6rem', width: '3rem', padding: '0 0.25rem' }}>
            <div className="flex flex-col font-['Pretendard'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap" data-node-id="256:2914" style={{ fontSize: '1rem', color: 'var(--white)' }}>
              <p className="leading-[normal] whitespace-pre">{time}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-start min-w-0 overflow-clip relative z-10" data-name="Text" data-node-id="256:2915" style={{ padding: '0 0.5rem' }}>
            {itemLabel && (
              <div className="flex flex-row items-center shrink-0" style={{ marginRight: '1rem' }}>
                <Item label={itemLabel} />
              </div>
            )}
            <div className="basis-0 flex flex-col font-['Pretendard'] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 overflow-hidden" data-node-id="256:2918" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
              <p className="leading-[normal] overflow-hidden text-ellipsis whitespace-nowrap">{text}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-start relative w-full h-full" data-name="Property 1=Default" data-node-id="256:2907">
      <div className="box-border flex items-center justify-start relative rounded-[0.3rem] w-full h-full" data-name="LogContent" data-node-id="256:2677" style={{ backgroundColor: 'var(--dark)', gap: '0.6rem', padding: '1rem 1rem', boxShadow: '0px 0.4rem 0.4rem 0px inset rgba(0,0,0,0.25)' }}>
        <div 
          aria-hidden="true" 
          className="absolute inset-0 pointer-events-none rounded-[0.3rem]" 
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0))',
            padding: '0.1rem'
          }}
        >
          <div className="w-full h-full rounded-[0.3rem]" style={{ backgroundColor: 'transparent' }} />
        </div>
        <div className="flex items-center justify-center overflow-clip relative shrink-0 z-10" data-name="Time" data-node-id="256:2678" style={{ gap: '0.6rem', width: '3rem', padding: '0 0.25rem' }}>
          <div className="flex flex-col font-['Pretendard'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap" data-node-id="256:2679" style={{ fontSize: '1rem', color: 'var(--white)' }}>
            <p className="leading-[normal] whitespace-pre">{time}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-start min-w-0 overflow-clip relative z-10" data-name="Text" data-node-id="256:2680" style={{ padding: '0 0.5rem' }}>
          {itemLabel && (
            <div className="flex flex-row items-center shrink-0" style={{ marginRight: '1rem' }}>
              <Item label={itemLabel} />
            </div>
          )}
          <div className="basis-0 flex flex-col font-['Pretendard'] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 overflow-hidden" data-name="256:2683" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
            <p className="leading-[normal] overflow-hidden text-ellipsis whitespace-nowrap">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Log;