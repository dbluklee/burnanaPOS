import React, { useState } from 'react';
import ColorSelector, { tableColors } from './ColorSelector';
import TextInput from './TextInput';

interface PlaceSettingsProps {
  onSave?: (placeName: string, selectedColor: string) => void;
  onCancel?: () => void;
}

export default function PlaceSettings({ onSave, onCancel }: PlaceSettingsProps) {
  const [placeName, setPlaceName] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleSave = () => {
    onSave?.(placeName, tableColors[selectedColorIndex]);
  };

  const handleCancel = () => {
    onCancel?.();
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
        
        {/* Save/Cancel Buttons */}
        <div className="flex items-center justify-center overflow-clip relative shrink-0 w-full" data-name="SaveCancelArea">
          <div className="flex items-center justify-center relative" style={{ gap: '3rem' }} data-name="SaveCancelButton">
            <div 
              className="box-border flex h-[60px] items-center justify-center overflow-clip px-8 py-2.5 relative rounded-[37.5px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-white/10 hover:bg-white/20" 
              data-name="SaveButton"
              onClick={handleSave}
            >
              <div className="FontStyleTitle flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white">
                <p className="leading-[normal] whitespace-pre">SAVE</p>
              </div>
            </div>
            <div 
              className="box-border flex h-[60px] items-center justify-center overflow-clip px-8 py-2.5 relative rounded-[37.5px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-white/10 hover:bg-white/20" 
              data-name="CancelButton"
              onClick={handleCancel}
            >
              <div className="FontStyleTitle flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white">
                <p className="leading-[normal] whitespace-pre">CANCEL</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-10 shrink-0 w-full" data-name="gap" />
        <div className="box-border content-stretch flex flex-col h-20 items-center justify-between overflow-clip p-[10px] shrink-0 w-full" data-name="DeleteArea" />
      </div>
    </div>
  );
}