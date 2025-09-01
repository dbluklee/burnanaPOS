import React from 'react';
import Logs from './Logs';
import SettingInspector from './SettingInspector';

interface LogEntry {
  id: number;
  time: string;
  message: string;
}

interface Place {
  id: string;
  name: string;
  color: string;
  tableCount: number;
}

interface PanelContentProps {
  isAddMode: boolean;
  selectedTab: string;
  logEntries: LogEntry[];
  onLogUndo: (logId: number) => void;
  onSave?: (name: string, selectedColor: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  editingPlace?: Place | null;
}

export default function PanelContent({ 
  isAddMode, 
  selectedTab,
  logEntries, 
  onLogUndo,
  onSave,
  onCancel,
  onDelete,
  isEditMode = false,
  editingPlace = null
}: PanelContentProps) {
  return (
    <div className="flex flex-col flex-1 w-full h-full min-h-0 overflow-hidden" data-name="PanelContent">
      {isAddMode ? (
        <SettingInspector
          selectedTab={selectedTab}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          isEditMode={isEditMode}
          editingPlace={editingPlace}
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