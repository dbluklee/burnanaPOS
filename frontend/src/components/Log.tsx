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
  // Extract management items from text
  const extractManagementItems = (logText: string) => {
    const items: string[] = [];
    let cleanedText = logText;
    
    // Extract specific place names (ending with "floor")
    const placeRegex = /\b(\w+\s+floor)\b/gi;
    const placeMatches = cleanedText.match(placeRegex);
    if (placeMatches) {
      items.push(...placeMatches);
      cleanedText = cleanedText.replace(placeRegex, '').trim();
    }
    
    // Extract table names (starting with "Table" followed by numbers/letters)
    const tableRegex = /\b(Table\w*)\b/gi;
    const tableMatches = cleanedText.match(tableRegex);
    if (tableMatches) {
      items.push(...tableMatches);
      cleanedText = cleanedText.replace(tableRegex, '').trim();
    }
    
    // Extract general management keywords
    const managementKeywords = ['Place', 'Category', 'Menu'];
    managementKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = cleanedText.match(regex);
      if (matches) {
        items.push(...matches);
        cleanedText = cleanedText.replace(regex, '').trim();
      }
    });
    
    // Clean up extra spaces
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    return { items, cleanedText };
  };
  
  const { items: extractedItems, cleanedText } = extractManagementItems(text);
  const displayItems = itemLabel ? [itemLabel, ...extractedItems] : extractedItems;
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
      <div className="flex items-center w-full min-h-[60px] overflow-hidden" data-name="Property 1=Undo" data-node-id="256:2909">
        {/* Undo icon with grey background positioned to the left */}
        <div 
          className="flex items-center justify-center cursor-pointer shrink-0 min-h-[60px] rounded-l-[0.3rem]" 
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
          className="box-border flex items-center justify-start relative rounded-r-[0.3rem] flex-1 min-h-[60px] py-4 transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing" 
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
            <div className="FontStyleText flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap" data-node-id="256:2914" style={{ color: 'var(--light)' }}>
              <p className="leading-[normal] whitespace-pre">{time}</p>
            </div>
          </div>
          <div className="flex-1 relative z-10 w-full FontStyleText" data-name="Text" data-node-id="256:2915" style={{ padding: '0 0.5rem', color: 'var(--light)', lineHeight: '1.2' }}>
            <p className="leading-[1.2] break-words w-full" style={{ margin: 0 }}>
              {displayItems.length > 0 && (
                <>
                  {displayItems.map((item, index) => (
                    <span key={index} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'top' }}>
                      <Item label={item} />
                    </span>
                  ))}
                </>
              )}
              <span style={{ display: 'inline' }}>{cleanedText}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-start relative w-full min-h-[60px]" data-name="Property 1=Default" data-node-id="256:2907">
      <div className="box-border flex items-center justify-start relative rounded-[0.3rem] w-full min-h-[60px] py-4" data-name="LogContent" data-node-id="256:2677" style={{ backgroundColor: 'var(--dark)', gap: '0.6rem', padding: '0 1rem', boxShadow: '0px 0.4rem 0.4rem 0px inset rgba(0,0,0,0.25)' }}>
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
          <div className="FontStyleText flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap" data-node-id="256:2679" style={{ color: 'var(--light)' }}>
            <p className="leading-[normal] whitespace-pre">{time}</p>
          </div>
        </div>
        <div className="flex-1 relative z-10 w-full FontStyleText" data-name="Text" data-node-id="256:2680" style={{ padding: '0 0.5rem', color: 'var(--light)', lineHeight: '1.2' }}>
          <p className="leading-[1.2] break-words w-full" style={{ margin: 0 }}>
            {displayItems.length > 0 && (
              <>
                {displayItems.map((item, index) => (
                  <span key={index} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'top' }}>
                    <Item label={item} />
                  </span>
                ))}
              </>
            )}
            <span style={{ display: 'inline' }}>{cleanedText}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Log;