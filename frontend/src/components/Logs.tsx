import React from 'react';
import Log from './Log';

interface LogEntry {
  id: number;
  time: string;
  message: string;
}

interface SwipeableLogEntryProps {
  log: LogEntry;
  itemLabel: string;
  onUndo: () => void;
}

function SwipeableLogEntry({ log, itemLabel, onUndo }: SwipeableLogEntryProps) {
  const [swipeOffset, setSwipeOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [isUndoState, setIsUndoState] = React.useState(false);
  const maxSwipe = 60;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const newOffset = Math.max(0, Math.min(maxSwipe, deltaX));
    setSwipeOffset(newOffset);
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (swipeOffset > maxSwipe / 2) {
      setSwipeOffset(maxSwipe);
      setIsUndoState(true);
    } else {
      setSwipeOffset(0);
      setIsUndoState(false);
    }
  };

  const handleUndo = () => {
    setSwipeOffset(0);
    setIsUndoState(false);
    onUndo();
  };

  return (
    <div 
      className="relative w-full cursor-pointer select-none" 
      style={{ minHeight: '60px' }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      <div
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          width: '100%',
          height: '100%'
        }}
      >
        <Log
          time={log.time}
          text={log.message}
          itemLabel={itemLabel}
          property1={isUndoState ? "Undo" : "Default"}
          onUndo={handleUndo}
        />
      </div>
    </div>
  );
}

interface LogsProps {
  logEntries: LogEntry[];
  onLogUndo: (logId: number) => void;
}

export default function Logs({ logEntries, onLogUndo }: LogsProps) {
  return (
    <div className="flex flex-col grow items-center justify-start min-h-0 min-w-0 overflow-hidden w-full" style={{ gap: 'clamp(0.2rem, 0.6vh, 0.4rem)' }} data-name="Logs">
      {logEntries.map((log) => (
        <SwipeableLogEntry
          key={log.id}
          log={log}
          itemLabel=""
          onUndo={() => onLogUndo(log.id)}
        />
      ))}
    </div>
  );
}