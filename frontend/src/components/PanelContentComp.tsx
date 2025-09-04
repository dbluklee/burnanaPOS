import React from 'react';
import Logs from './LogsComp';
import SettingInspector from './SettingInspectorComp';

interface LogEntry {
  id: number;
  time: string;
  message: string;
  type: string;
}

interface Place {
  id: string;
  storeNumber: string;
  name: string;
  color: string;
  tableCount: number;
  userPin: string;
  createdAt: Date;
}

interface Table {
  id: string;
  placeId: string;
  name: string;
  color: string;
  positionX: number;
  positionY: number;
  storeNumber: string;
  userPin: string;
  createdAt: Date;
}

interface PanelContentCompProps {
  isAddMode: boolean;
  selectedTab: string;
  logEntries: LogEntry[];
  onLogUndo: (logId: number) => void;
  onSave?: (name: string, selectedColor: string, storeNumber?: string, userPin?: string, placeId?: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  editingPlace?: Place | null;
  editingTable?: Table | null;
  places?: Place[];
}

export default function PanelContentComp({ 
  isAddMode, 
  selectedTab,
  logEntries, 
  onLogUndo,
  onSave,
  onCancel,
  onDelete,
  isEditMode = false,
  editingPlace = null,
  editingTable = null,
  places = []
}: PanelContentCompProps) {
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
          editingTable={editingTable}
          places={places}
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