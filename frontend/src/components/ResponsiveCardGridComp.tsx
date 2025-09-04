import React, { useState, useEffect, useRef } from 'react';
import PlaceCard from './PlaceCardComp';
import { getCSSVariable } from './ColorSelectorComp';

interface Place {
  id: string;
  name: string;
  color: string;
  tableCount: number;
  sortOrder?: number;
}

interface ResponsiveCardGridCompProps {
  places: Place[];
  onCardClick: (place: Place) => void;
  onCardLongPress?: (place: Place) => void;
  onCardReorder?: (reorderedPlaces: Place[]) => void;
  onEditCancel?: () => void;
  editingPlace?: Place | null;
  isTransitioning?: boolean;
  animatingCardId?: string | null;
  isEditMode?: boolean;
}

export default function ResponsiveCardGridComp({ 
  places, 
  onCardClick, 
  onCardLongPress, 
  onCardReorder,
  onEditCancel,
  editingPlace = null,
  isTransitioning = false, 
  animatingCardId = null, 
  isEditMode = false 
}: ResponsiveCardGridCompProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState(15); // Default 15vw
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // Long-press detection state
  const longPressRef = useRef<{ timeoutId: number | null; place: Place | null }>({ 
    timeoutId: null, 
    place: null 
  });
  
  // Long-press visual feedback state
  const [longPressedCardId, setLongPressedCardId] = useState<string | null>(null);
  
  // Drag and drop state
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedPlace: Place | null;
    draggedIndex: number;
    targetIndex: number;
    draggedElement: HTMLElement | null;
    startPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
  }>({
    isDragging: false,
    draggedPlace: null,
    draggedIndex: -1,
    targetIndex: -1,
    draggedElement: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  });
  
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
  
  // Drag and drop handlers
  const startDrag = (place: Place, index: number, element: HTMLElement, clientX: number, clientY: number) => {
    if (!isEditMode || place.id === 'add') return;
    
    const rect = element.getBoundingClientRect();
    setDragState({
      isDragging: true,
      draggedPlace: place,
      draggedIndex: index,
      targetIndex: index,
      draggedElement: element,
      startPosition: { x: clientX, y: clientY },
      currentPosition: { x: clientX, y: clientY }
    });
    
    // Add visual feedback
    element.style.zIndex = '1000';
    element.style.transform = 'scale(1.05)';
    element.style.opacity = '0.9';
  };

  const updateDrag = (clientX: number, clientY: number) => {
    if (!dragState.isDragging || !dragState.draggedElement) return;
    
    const deltaX = clientX - dragState.startPosition.x;
    const deltaY = clientY - dragState.startPosition.y;
    
    // Update dragged element position
    dragState.draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
    
    setDragState(prev => ({
      ...prev,
      currentPosition: { x: clientX, y: clientY }
    }));
    
    // Calculate target index based on position
    const gapPx = vwToPx(gapVw);
    const cardPx = vwToPx(cardSizeVw);
    const cardsPerRow = Math.floor((containerDimensions.width + gapPx) / (cardPx + gapPx));
    
    if (cardsPerRow > 0) {
      const row = Math.floor((clientY - containerRef.current!.getBoundingClientRect().top) / (cardPx + gapPx));
      const col = Math.floor((clientX - containerRef.current!.getBoundingClientRect().left) / (cardPx + gapPx));
      const targetIndex = Math.min(Math.max(0, row * cardsPerRow + col), places.length - 2); // -2 to exclude add button
      
      setDragState(prev => ({
        ...prev,
        targetIndex
      }));
    }
  };

  const endDrag = () => {
    if (!dragState.isDragging || !dragState.draggedElement) return;
    
    // Reset visual styles
    dragState.draggedElement.style.zIndex = '';
    dragState.draggedElement.style.transform = '';
    dragState.draggedElement.style.opacity = '';
    
    // Reorder if target index is different
    if (dragState.targetIndex !== dragState.draggedIndex && dragState.targetIndex >= 0) {
      const reorderedPlaces = [...places.filter(p => p.id !== 'add')]; // Remove add button
      const [draggedPlace] = reorderedPlaces.splice(dragState.draggedIndex, 1);
      reorderedPlaces.splice(dragState.targetIndex, 0, draggedPlace);
      onCardReorder?.(reorderedPlaces);
    }
    
    setDragState({
      isDragging: false,
      draggedPlace: null,
      draggedIndex: -1,
      targetIndex: -1,
      draggedElement: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 }
    });
  };
  
  // Long-press handlers
  const startLongPress = (place: Place) => {
    if (place.id === 'add') return; // Don't allow long-press on add button
    
    longPressRef.current.place = place;
    setLongPressedCardId(place.id); // Add visual feedback immediately
    
    longPressRef.current.timeoutId = window.setTimeout(() => {
      onCardLongPress?.(place);
      // Keep the visual effect for a moment after triggering
      setTimeout(() => {
        setLongPressedCardId(null);
      }, 300);
    }, 600); // 600ms long-press duration
  };

  const cancelLongPress = () => {
    if (longPressRef.current.timeoutId) {
      clearTimeout(longPressRef.current.timeoutId);
      longPressRef.current.timeoutId = null;
      longPressRef.current.place = null;
    }
    // Clear visual feedback when canceling
    setLongPressedCardId(null);
  };

  const handleCardTouchStart = (place: Place, index: number) => (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startLongPress(place);
    
    // In edit mode, prepare for potential drag
    if (isEditMode && place.id !== 'add') {
      const element = e.currentTarget as HTMLElement;
      setTimeout(() => {
        // Only start drag if long-press didn't trigger edit mode
        if (longPressRef.current.timeoutId) {
          startDrag(place, index, element, touch.clientX, touch.clientY);
          cancelLongPress();
        }
      }, 650); // Slightly after long-press timeout
    }
  };

  const handleCardTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    if (dragState.isDragging) {
      e.preventDefault();
      updateDrag(touch.clientX, touch.clientY);
    } else {
      // Cancel long-press if user moves finger before drag starts
      cancelLongPress();
    }
  };

  const handleCardTouchEnd = (place: Place) => (e: React.TouchEvent) => {
    if (dragState.isDragging) {
      endDrag();
    } else if (longPressRef.current.timeoutId) {
      // If long-press didn't trigger, treat as normal click
      cancelLongPress();
      
      // If in edit mode and touching a different card (not the one being edited), cancel edit mode
      if (isEditMode && editingPlace && place.id !== editingPlace.id && place.id !== 'add') {
        onEditCancel?.();
      } else {
        onCardClick(place);
      }
    }
  };

  const handleCardMouseDown = (place: Place, index: number) => (e: React.MouseEvent) => {
    startLongPress(place);
    
    // In edit mode, prepare for potential drag
    if (isEditMode && place.id !== 'add') {
      const element = e.currentTarget as HTMLElement;
      setTimeout(() => {
        // Only start drag if long-press didn't trigger edit mode
        if (longPressRef.current.timeoutId) {
          startDrag(place, index, element, e.clientX, e.clientY);
          cancelLongPress();
        }
      }, 650); // Slightly after long-press timeout
    }
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (dragState.isDragging) {
      e.preventDefault();
      updateDrag(e.clientX, e.clientY);
    }
  };

  const handleCardMouseUp = (place: Place) => (e: React.MouseEvent) => {
    if (dragState.isDragging) {
      endDrag();
    } else if (longPressRef.current.timeoutId) {
      cancelLongPress();
      
      // If in edit mode and clicking a different card (not the one being edited), cancel edit mode
      if (isEditMode && editingPlace && place.id !== editingPlace.id && place.id !== 'add') {
        onEditCancel?.();
      } else {
        onCardClick(place);
      }
    }
  };

  const handleCardMouseLeave = () => {
    cancelLongPress();
    if (dragState.isDragging) {
      endDrag();
    }
  };

  // Prevent default touch behaviors while allowing card interactions
  const handleTouchMove = (e: React.TouchEvent) => {
    // Only prevent if not on a card
    const target = e.target as HTMLElement;
    const isCard = target.closest('[data-card]');
    
    if (!isCard) {
      e.preventDefault();
    }
  };

  // Cleanup long-press timeout and drag state on unmount
  useEffect(() => {
    return () => {
      cancelLongPress();
      if (dragState.isDragging) {
        endDrag();
      }
    };
  }, []);
  
  // Global mouse events for drag functionality
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging) {
        updateDrag(e.clientX, e.clientY);
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        endDrag();
      }
    };
    
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragState.isDragging]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: 'pan-y' }}
      onTouchMove={handleTouchMove}
    >
      <style>{`
        @keyframes slideInUp {
          0% {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes cardHighlight {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        @keyframes longPressGlow {
          0% {
            transform: scale(1);
            filter: brightness(1) saturate(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            transform: scale(1.03);
            filter: brightness(1.15) saturate(1.2);
            box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.3);
          }
          100% {
            transform: scale(1.03);
            filter: brightness(1.15) saturate(1.2);
            box-shadow: 0 0 25px 6px rgba(59, 130, 246, 0.4);
          }
        }
      `}</style>
      <div 
        className={`flex flex-wrap items-start justify-start w-full transition-opacity duration-150 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ gap: `${gapVw}vw` }}
      >
        {places.map((place, index) => {
          const isNewCard = animatingCardId === place.id && !isTransitioning;
          const isDragTarget = isEditMode && dragState.isDragging && dragState.targetIndex === index;
          const isDraggedCard = dragState.isDragging && dragState.draggedPlace?.id === place.id;
          const isLongPressed = longPressedCardId === place.id;
          
          return (
            <div
              key={place.id}
              className={`relative overflow-hidden flex-shrink-0 transition-all duration-300 ease-out ${
                isNewCard ? 'animate-pulse' : ''
              } ${isEditMode && place.id !== 'add' ? 'cursor-move' : 'cursor-pointer'} ${
                isDragTarget ? 'ring-2 ring-white/50' : ''
              } ${isDraggedCard ? 'pointer-events-none' : ''} ${
                isLongPressed ? 'ring-4 ring-blue-400/70 shadow-lg shadow-blue-400/30' : ''
              }`}
              style={{
                width: `${cardSizeVw}vw`,
                height: `${cardSizeVw}vw`,
                transform: isNewCard ? 'scale(1.02)' : isDraggedCard ? 'scale(1.05)' : isLongPressed ? 'scale(1.03)' : 'scale(1)',
                animation: isNewCard ? 'slideInUp 0.4s ease-out' : isLongPressed ? 'longPressGlow 0.6s ease-in-out' : 'none',
                filter: isEditMode && place.id !== 'add' ? 'brightness(1.1)' : isLongPressed ? 'brightness(1.15) saturate(1.2)' : 'none',
                opacity: isDraggedCard ? '0.9' : '1',
              }}
              onTouchStart={handleCardTouchStart(place, index)}
              onTouchEnd={handleCardTouchEnd(place)}
              onTouchMove={handleCardTouchMove}
              onMouseDown={handleCardMouseDown(place, index)}
              onMouseMove={handleCardMouseMove}
              onMouseUp={handleCardMouseUp(place)}
              onMouseLeave={handleCardMouseLeave}
              data-card="true"
            >
              <PlaceCard
                placeName={place.name}
                tableCount={place.tableCount}
                color={getCSSVariable(place.color)} // Convert hex color back to CSS variable
                property={place.id === 'add' ? 'Empty' : 'Default'}
                onClick={() => {}} // Disable PlaceCard's own click handler
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}