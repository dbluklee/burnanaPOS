import React, { useState } from 'react';
import ColorSelector, { tableColors } from './ColorSelector';
import TextInput from './TextInput';
import SetButtons from './SetButtons';

interface PlaceSettingsProps {
  onSave?: (placeName: string, selectedColor: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  initialName?: string;
  initialColorIndex?: number;
}

export default function PlaceSettings({ 
  onSave, 
  onCancel, 
  onDelete, 
  isEditMode = false, 
  initialName = '', 
  initialColorIndex = 0 
}: PlaceSettingsProps) {
  const [placeName, setPlaceName] = useState(initialName);
  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex);

  const handleSave = () => {
    onSave?.(placeName, tableColors[selectedColorIndex]);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <div className="flex flex-col gap-2.5 items-start justify-start w-full h-full py-5" data-name="PlaceSettings">
      <div className="flex flex-col grow items-start justify-between w-full h-full overflow-hidden" data-name="PlaceInspector">
        <div className="flex flex-col items-start justify-start w-full" style={{ gap: '3vh' }} data-name="InspectorArea">
          {/* Place Name Input */}
          <TextInput
            name="Name"
            value={placeName}
            onChange={setPlaceName}
            placeholder="eg. 1st floor"
            description="Please write the name of the space where you want to install the tables."
            className="w-full"
          />

          {/* Color Selection */}
          <ColorSelector 
            selectedColorIndex={selectedColorIndex}
            onColorSelect={setSelectedColorIndex}
            title="Color"
            description="On the table card, select a card color to easily distinguish places."
          />
        </div>

        <div className="h-10 shrink-0 w-full" data-name="gap" />
        
        {/* Set Buttons Component (Save/Cancel + Delete) */}
        <SetButtons
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          isEditMode={isEditMode}
          disabled={!placeName.trim()} // Disable delete if no name is entered
        />
      </div>
    </div>
  );
}