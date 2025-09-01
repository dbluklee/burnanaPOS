import React, { useState, useEffect, useRef } from 'react';
import PlaceCard from './PlaceCard';

interface Place {
  id: string;
  name: string;
  color: string;
  tableCount: number;
}

interface ResponsiveCardGridProps {
  places: Place[];
  onCardClick: (place: Place) => void;
}

export default function ResponsiveCardGrid({ places, onCardClick }: ResponsiveCardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(15); // Default 15vw
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // Convert vw to pixels for calculations
  const vwToPx = (vw: number) => (vw * window.innerWidth) / 100;
  const pxToVw = (px: number) => (px * 100) / window.innerWidth;
  
  // Calculate optimal card size and layout
  const calculateLayout = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    setContainerDimensions({ width: containerWidth, height: containerHeight });
    
    const gapVw = 1; // 1vw gap
    const gapPx = vwToPx(gapVw);
    const totalCards = places.length;
    
    // Try different card sizes from max (20vw) to min (10vw)
    for (let testCardVw = 20; testCardVw >= 10; testCardVw -= 0.5) {
      const cardPx = vwToPx(testCardVw);
      
      // Calculate how many cards fit horizontally
      const cardsPerRow = Math.floor((containerWidth + gapPx) / (cardPx + gapPx));
      
      if (cardsPerRow === 0) continue; // Skip if no cards fit
      
      // Calculate number of rows needed
      const totalRows = Math.ceil(totalCards / cardsPerRow);
      
      // Calculate total height needed
      const totalHeight = (totalRows * cardPx) + ((totalRows - 1) * gapPx);
      
      // If it fits vertically, use this card size
      if (totalHeight <= containerHeight || testCardVw === 10) {
        setCardSize(testCardVw);
        return;
      }
    }
    
    // Fallback to minimum size
    setCardSize(10);
  };
  
  // Update layout on mount and resize
  useEffect(() => {
    calculateLayout();
    
    const handleResize = () => {
      calculateLayout();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateLayout();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [places.length]);
  
  // Calculate grid layout
  const gapVw = 1;
  const cardSizeVw = Math.max(10, Math.min(20, cardSize)); // Clamp between 10-20vw
  
  // Prevent default touch behaviors while allowing card interactions
  const handleTouchMove = (e: React.TouchEvent) => {
    // Only prevent if not on a card
    const target = e.target as HTMLElement;
    const isCard = target.closest('[data-card]');
    
    if (!isCard) {
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: 'pan-y' }}
      onTouchMove={handleTouchMove}
    >
      <div 
        className="flex flex-wrap items-start justify-start w-full"
        style={{ gap: `${gapVw}vw` }}
      >
        {places.map((place) => (
          <div
            key={place.id}
            className="relative overflow-hidden flex-shrink-0"
            style={{
              width: `${cardSizeVw}vw`,
              height: `${cardSizeVw}vw`
            }}
            onClick={() => onCardClick(place)}
            data-card="true"
          >
            <PlaceCard
              placeName={place.name}
              tableCount={place.tableCount}
              color={place.color}
              property={place.id === 'add' ? 'Empty' : 'Default'}
              onClick={() => onCardClick(place)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}