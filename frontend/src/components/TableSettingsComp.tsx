import React, { useState } from 'react';
import TextInput from './TextInputComp';
import DropdownInputComp from './DropdownInputComp';
import ButtonsSetComp from './ButtonsSetComp';

interface Place {
  id: string;
  name: string;
  color: string;
}

interface TableSettingsCompProps {
  places: Place[];
  onSave?: (tableName: string, selectedPlaceId: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  initialName?: string;
  initialPlaceId?: string;
}

export default function TableSettingsComp({ 
  places = [],
  onSave, 
  onCancel, 
  onDelete, 
  isEditMode = false, 
  initialName = '', 
  initialPlaceId = ''
}: TableSettingsCompProps) {
  const [tableName, setTableName] = useState(initialName || '');
  const [selectedPlaceId, setSelectedPlaceId] = useState(initialPlaceId || '');

  const handleSave = () => {
    onSave?.(tableName, selectedPlaceId);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleDelete = () => {
    onDelete?.();
  };

  // Convert places to dropdown options
  const placeOptions = places.map(place => ({
    value: place.id,
    label: place.name
  }));

  return (
    <div className="flex flex-col gap-2.5 items-start justify-between w-full h-full px-[0.25rem]" data-name="TableSettings">
      <div className="flex flex-col items-start justify-start w-full" style={{ gap: '3vh' }} data-name="InspectorArea">
        {/* Table Name Input */}
        <TextInput
          name="Table Name"
          value={tableName}
          onChange={setTableName}
          placeholder="eg. Table 1"
          description="Please write the name of the table."
          className="w-full"
        />

        {/* Place Selection */}
        <DropdownInputComp
          name="Place"
          value={selectedPlaceId}
          options={placeOptions}
          placeholder="Select a place"
          description="Select the place where this table will be located."
          onChange={setSelectedPlaceId}
          className="w-full"
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
          disabled={!tableName.trim() || !selectedPlaceId} // Disable if table name is empty or no place selected
        />
      </div>
    </div>
  );
}