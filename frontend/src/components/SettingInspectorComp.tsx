import React from 'react';
import PlaceSettings from './PlaceSettingsComp';
import { tableColors } from './ColorSelectorComp';

interface Place {
  id: string;
  storeNumber: string;
  name: string;
  color: string;
  tableCount: number;
  userPin: string;
  createdAt: Date;
}

interface SettingInspectorCompProps {
  selectedTab: string;
  onSave?: (name: string, selectedColor: string, storeNumber: string, userPin: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  editingPlace?: Place | null;
}

export default function SettingInspectorComp({ 
  selectedTab, 
  onSave, 
  onCancel, 
  onDelete, 
  isEditMode = false, 
  editingPlace = null 
}: SettingInspectorCompProps) {
  // Based on the selected tab, render the appropriate settings component
  // For now, we only have PlaceSettings, but this can be extended for Table, Category, Menu
  
  const renderSettings = () => {
    switch (selectedTab.toLowerCase()) {
      case 'place':
        return (
          <PlaceSettings
            onSave={onSave}
            onCancel={onCancel}
            onDelete={onDelete}
            isEditMode={isEditMode}
            initialName={editingPlace?.name || ''}
            initialColorIndex={editingPlace ? 
              tableColors.indexOf(editingPlace.color) >= 0 
                ? tableColors.indexOf(editingPlace.color) 
                : 0 
              : 0
            }
            initialStoreNumber={editingPlace?.storeNumber || ''}
            initialUserPin={editingPlace?.userPin || ''}
          />
        );
      case 'table':
        // Future: TableSettings component
        return (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p>Table Settings coming soon...</p>
          </div>
        );
      case 'category':
        // Future: CategorySettings component
        return (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p>Category Settings coming soon...</p>
          </div>
        );
      case 'menu':
        // Future: MenuSettings component
        return (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p>Menu Settings coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 overflow-hidden" data-name="SettingInspector">
      {renderSettings()}
    </div>
  );
}