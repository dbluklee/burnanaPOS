import React from 'react';
import Logs from './Logs';
import SettingInspector from './SettingInspector';

interface LogEntry {
  id: number;
  time: string;
  message: string;
}

interface PanelContentProps {
  isAddMode: boolean;
  selectedTab: string;
  logEntries: LogEntry[];
  onLogUndo: (logId: number) => void;
  onSave?: (name: string, selectedColor: string) => void;
  onCancel?: () => void;
}

export default function PanelContent({ 
  isAddMode, 
  selectedTab,
  logEntries, 
  onLogUndo,
  onSave,
  onCancel 
}: PanelContentProps) {
  return (
    <div className="flex flex-col grow w-full h-full overflow-hidden" data-name="PanelContent">
      {isAddMode ? (
        <SettingInspector
          selectedTab={selectedTab}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <Logs
          logEntries={logEntries}
          onLogUndo={onLogUndo}
        />
      )}
    </div>
  );
}