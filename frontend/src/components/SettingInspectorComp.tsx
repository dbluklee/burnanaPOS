import React from 'react';
import PlaceSettings from './PlaceSettingsComp';
import TableSettings from './TableSettingsComp';
import { tableColors, getCSSVariable } from './ColorSelectorComp';

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

interface SettingInspectorCompProps {
  selectedTab: string;
  onSave?: (name: string, selectedColor: string, storeNumber?: string, userPin?: string, placeId?: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  editingPlace?: Place | null;
  editingTable?: Table | null;
  places?: Place[];
}

export default function SettingInspectorComp({ 
  selectedTab, 
  onSave, 
  onCancel, 
  onDelete, 
  isEditMode = false, 
  editingPlace = null,
  editingTable = null,
  places = []
}: SettingInspectorCompProps) {
  // Based on the selected tab, render the appropriate settings component
  // For now, we only have PlaceSettings, but this can be extended for Table, Category, Menu
  
  const renderSettings = () => {
    switch (selectedTab.toLowerCase()) {
      case 'place':
        return (
          <PlaceSettings
            onSave={(placeName: string, selectedColor: string) => 
              onSave?.(placeName, selectedColor, editingPlace?.storeNumber || '', editingPlace?.userPin || '')
            }
            onCancel={onCancel}
            onDelete={onDelete}
            isEditMode={isEditMode}
            initialName={editingPlace?.name || ''}
            initialColorIndex={editingPlace ? 
              (() => {
                // Convert hex color back to CSS variable, then find its index
                const cssVariable = getCSSVariable(editingPlace.color);
                const colorIndex = tableColors.indexOf(cssVariable);
                return colorIndex >= 0 ? colorIndex : 0;
              })()
              : 0
            }
          />
        );
      case 'table':
        return (
          <TableSettings
            places={places}
            onSave={(tableName: string, selectedPlaceId: string) => {
              // Get the selected place's color to use for the table
              const selectedPlace = places.find(p => p.id === selectedPlaceId);
              const placeColor = selectedPlace?.color || '#FF6B6B'; // fallback color
              onSave?.(tableName, placeColor, editingTable?.storeNumber || '', editingTable?.userPin || '', selectedPlaceId);
            }}
            onCancel={onCancel}
            onDelete={onDelete}
            isEditMode={isEditMode}
            initialName={editingTable?.name || ''}
            initialPlaceId={editingTable?.placeId || ''}
          />
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