import React, { useState, useRef } from 'react';

interface ButtonDeleteCompProps {
  onDelete: () => void;
  disabled?: boolean;
}

export default function ButtonDeleteComp({ onDelete, disabled }: ButtonDeleteCompProps) {
  const [slideDistance, setSlideDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false); // Track if button is in active/slide state
  const startX = useRef(0);
  const maxSlideDistance = 100; // Maximum slide distance in pixels
  const deleteThreshold = 80; // Threshold to trigger deletion

  const handleStart = (clientX: number) => {
    if (disabled) return;
    
    if (!isActive) {
      // First touch: activate slide state
      setIsActive(true);
      return;
    }
    
    // Already in active state: start dragging
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    const distance = clientX - startX.current;
    // Only allow sliding to the right, clamp between 0 and maxSlideDistance
    const newDistance = Math.max(0, Math.min(distance, maxSlideDistance));
    setSlideDistance(newDistance);
  };

  const handleEnd = () => {
    if (!isDragging || disabled) return;
    setIsDragging(false);
    
    // Check if slid far enough to trigger deletion
    if (slideDistance >= deleteThreshold) {
      // Trigger deletion
      onDelete();
      // Reset state
      setSlideDistance(0);
      setIsActive(false);
    } else {
      // Snap back to original position
      setSlideDistance(0);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
    e.preventDefault(); // Prevent scrolling while dragging
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Global mouse event listeners for dragging outside the element
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
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
  }, [isDragging]);

  // Add click outside to cancel active state
  const buttonRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isActive && !isDragging && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Reset to inactive state when clicking outside
        setIsActive(false);
        setSlideDistance(0);
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, isDragging]);

  const progress = slideDistance / maxSlideDistance; // Progress from 0 to 1

  return (
    <div 
      ref={buttonRef}
      className="flex items-center justify-center relative" 
      style={{ height: '60px', width: '30%' }}
      data-name="DeleteButton"
    >
      {isActive ? (
        // Active state: Shows sliding "Swipe" button (similar to Image #2)
        <div 
          className="flex items-center justify-start relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden rounded-[30px] border-2 border-[#777777]" 
          style={{ backgroundColor: '#2d2d2d' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Sliding "Swipe" button */}
          <div 
            className="flex items-center justify-center relative rounded-[26px] h-[52px] px-4 transition-all duration-200 ease-out" 
            style={{ 
              backgroundColor: slideDistance >= deleteThreshold ? '#e91e63' : '#fac2d9',
              width: '120px',
              transform: `translateX(${slideDistance}px)`,
              margin: '4px'
            }}
          >
            <span 
              className="font-['Pretendard'] font-medium text-[16px] text-gray-800 mr-2"
            >
              {slideDistance >= deleteThreshold ? 'Release!' : 'Swipe'}
            </span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="transition-transform duration-200 ease-out"
              style={{ 
                transform: `rotate(${slideDistance >= deleteThreshold ? '0deg' : '180deg'})` 
              }}
            >
              <path 
                d="M9 18l6-6-6-6" 
                stroke="#1f2937" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : (
        // Default state: Shows "Delete" button (similar to Image #1)
        <div 
          className="box-border flex items-center justify-center relative rounded-[30px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity w-full h-full border-2 border-[#777777]" 
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: 'clamp(0.1rem, 0.3vh, 0.2rem)'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div 
            className="box-border flex items-center justify-center relative rounded-[26px] shrink-0 h-full w-full"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: 'clamp(0.4rem, 1.2vw, 1rem)'
            }}
          >
            <span 
              className="font-['Pretendard'] font-semibold text-[20px] text-center text-white"
            >
              Delete
            </span>
          </div>
        </div>
      )}
    </div>
  );
}