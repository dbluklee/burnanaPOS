import React, { useState, useRef, useEffect } from 'react';
import undoIcon from '../assets/Common/undo.svg';
import Item from './Item';

interface LogNewProps {
  time: string;
  text: string;
  itemLabel?: string;
  onUndo?: () => void;
}

function LogNew({ time, text, itemLabel, onUndo }: LogNewProps) {
  const [slideOffset, setSlideOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse text to extract management items
  const parseLogText = (logText: string) => {
    const items: string[] = [];
    let remainingText = logText;
    
    // Find floor locations (e.g., "1st floor", "2nd floor")
    const floorPattern = /\b(\w+\s+floor)\b/gi;
    const floors = remainingText.match(floorPattern);
    if (floors) {
      items.push(...floors);
      remainingText = remainingText.replace(floorPattern, '').trim();
    }
    
    // Find table references (e.g., "Table1", "TableA")
    const tablePattern = /\b(Table\w*)\b/gi;
    const tables = remainingText.match(tablePattern);
    if (tables) {
      items.push(...tables);
      remainingText = remainingText.replace(tablePattern, '').trim();
    }
    
    // Find management keywords
    ['Place', 'Category', 'Menu'].forEach(keyword => {
      const pattern = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (pattern.test(remainingText)) {
        items.push(keyword);
        remainingText = remainingText.replace(pattern, '').trim();
      }
    });
    
    // Clean up whitespace
    remainingText = remainingText.replace(/\s+/g, ' ').trim();
    
    return { items, remainingText };
  };
  
  const { items: extractedItems, remainingText } = parseLogText(text);
  const allItems = itemLabel ? [itemLabel, ...extractedItems] : extractedItems;
  
  // Handle drag start
  const handleDragStart = (clientX: number) => {
    startXRef.current = clientX;
    setIsDragging(true);
  };
  
  // Handle drag move
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startXRef.current;
    // Only allow sliding to the right, max 64px (4rem)
    const newOffset = Math.max(0, Math.min(deltaX, 64));
    setSlideOffset(newOffset);
  };
  
  // Handle drag end with snap behavior
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap logic: if dragged more than 20px, snap open; otherwise snap closed
    if (slideOffset > 20) {
      setSlideOffset(64);
    } else {
      setSlideOffset(0);
    }
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleDragEnd();
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleDragEnd();
  };
  
  // Global mouse event listeners for dragging outside the element
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, slideOffset]);
  
  // Handle undo button click
  const handleUndoClick = () => {
    onUndo?.();
    // Reset the slide after undo
    setSlideOffset(0);
  };
  
  // Determine if we should show the undo layer
  const showUndoLayer = slideOffset > 0 || onUndo;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[60px] overflow-hidden rounded-[0.3rem]"
      style={{ backgroundColor: showUndoLayer ? '#666666' : 'var(--dark)' }}
    >
      {/* Layer 1: Undo button background (bottom layer, static) */}
      {showUndoLayer && (
        <div 
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center"
          style={{ 
            width: '64px',
            backgroundColor: '#666666',
            zIndex: 1
          }}
        >
          <button
            onClick={handleUndoClick}
            className="flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer"
            style={{ width: '48px', height: '48px' }}
          >
            <img 
              src={undoIcon} 
              alt="Undo" 
              className="w-9 h-9"
              style={{ filter: 'brightness(1.2)' }}
            />
          </button>
        </div>
      )}
      
      {/* Layer 2: Log content (top layer, slideable) */}
      <div 
        className="relative flex items-center w-full min-h-[60px] px-4 py-3 rounded-[0.3rem] cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: 'var(--dark)',
          transform: `translateX(${slideOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          boxShadow: '0px 4px 4px 0px inset rgba(0,0,0,0.25)',
          zIndex: 2,
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* White gradient border effect */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[0.3rem]"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0))',
            padding: '1px'
          }}
        >
          <div 
            className="w-full h-full rounded-[0.3rem]"
            style={{ backgroundColor: 'var(--dark)' }}
          />
        </div>
        
        {/* Time display */}
        <div 
          className="flex items-center justify-center shrink-0 relative z-10"
          style={{ 
            width: '48px',
            padding: '0 4px',
            color: 'var(--light)',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <span>{time}</span>
        </div>
        
        {/* Text content with items */}
        <div 
          className="flex-1 flex items-center flex-wrap gap-2 relative z-10 px-2"
          style={{ 
            color: 'var(--light)',
            fontSize: '14px',
            lineHeight: '1.4',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Render item tags */}
          {allItems.length > 0 && (
            <div className="inline-flex flex-wrap gap-2 items-center">
              {allItems.map((item, index) => (
                <span key={index} className="inline-block">
                  <Item label={item} />
                </span>
              ))}
            </div>
          )}
          
          {/* Render remaining text */}
          {remainingText && (
            <span className="inline-block">{remainingText}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogNew;