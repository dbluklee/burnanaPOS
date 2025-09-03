import React, { useState } from 'react';
import ColorSelector, { tableColors } from './ColorSelectorComp';
import TextInput from './TextInputComp';
import ButtonsSetComp from './ButtonsSetComp';

interface PlaceSettingsCompProps {
  onSave?: (placeName: string, selectedColor: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  initialName?: string;
  initialColorIndex?: number;
}

export default function PlaceSettingsComp({ 
  onSave, 
  onCancel, 
  onDelete, 
  isEditMode = false, 
  initialName = '', 
  initialColorIndex = 0
}: PlaceSettingsCompProps) {
  const [placeName, setPlaceName] = useState(initialName || '');
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
    <div className="flex flex-col gap-2.5 items-start justify-between w-full h-full px-[0.25rem]" data-name="PlaceSettings">
      <div className="flex flex-col items-start justify-start w-full" style={{ gap: '3vh' }} data-name="InspectorArea">
        {/* Place Name Input */}
        <TextInput
          name="Place Name"
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
      
      {/* Button Set - Save/Cancel and Delete */}
      <div className="flex justify-center w-full">
        <ButtonsSetComp
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          isEditMode={isEditMode}
          disabled={!placeName.trim()} // Disable if place name is empty
        />
      </div>
    </div>
  );
}