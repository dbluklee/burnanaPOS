import React, { useState } from 'react';
import Log from './Log';

interface LogEntry {
  id: number;
  time: string;
  message: string;
}

interface LogsProps {
  logEntries: LogEntry[];
  onLogUndo: (logId: number) => void;
}

export default function Logs({ logEntries, onLogUndo }: LogsProps) {
  const [activeUndoLogId, setActiveUndoLogId] = useState<number | null>(null);

  const handleLogSlide = (logId: number, isInUndoMode: boolean) => {
    // When a log enters undo mode, make it the active one and deactivate others
    // When a log exits undo mode, clear the active log if it was the active one
    if (isInUndoMode) {
      setActiveUndoLogId(logId);
    } else if (activeUndoLogId === logId) {
      setActiveUndoLogId(null);
    }
  };

  const handleLogUndo = (logId: number) => {
    onLogUndo(logId);
    // Reset the active undo log after undo action
    setActiveUndoLogId(null);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-0 min-w-0 overflow-y-auto overflow-x-hidden w-full" style={{ gap: 'clamp(0.2rem, 0.6vh, 0.4rem)' }} data-name="Logs">
      {logEntries.map((log) => (
        <Log
          key={log.id}
          time={log.time}
          text={log.message}
          itemLabel=""
          onUndo={() => handleLogUndo(log.id)}
          isActiveUndo={activeUndoLogId === log.id}
          onSlideStateChange={(isInUndoMode) => handleLogSlide(log.id, isInUndoMode)}
        />
      ))}
    </div>
  );
}