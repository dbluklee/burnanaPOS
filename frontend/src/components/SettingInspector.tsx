import React from 'react';
import PlaceSettings from './PlaceSettings';

interface SettingInspectorProps {
  selectedTab: string;
  onSave?: (name: string, selectedColor: string) => void;
  onCancel?: () => void;
}

export default function SettingInspector({ selectedTab, onSave, onCancel }: SettingInspectorProps) {
  // Based on the selected tab, render the appropriate settings component
  // For now, we only have PlaceSettings, but this can be extended for Table, Category, Menu
  
  const renderSettings = () => {
    switch (selectedTab.toLowerCase()) {
      case 'place':
        return (
          <PlaceSettings
            onSave={onSave}
            onCancel={onCancel}
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
    <div className="flex flex-col w-full h-full overflow-hidden" data-name="SettingInspector">
      {renderSettings()}
    </div>
  );
}