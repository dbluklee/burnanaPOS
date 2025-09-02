import React from 'react';
import DeleteButton from './ButtonDeleteComp';

interface ButtonsSetCompProps {
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isEditMode?: boolean;
  disabled?: boolean;
}

export default function ButtonsSetComp({ 
  onSave, 
  onCancel, 
  onDelete, 
  isEditMode = false, 
  disabled = false 
}: ButtonsSetCompProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full" data-name="SetButtons">
      {/* Save/Cancel Buttons */}
      <div className="flex items-center justify-center overflow-clip relative shrink-0 w-full" data-name="SaveCancelArea">
        <div className="flex items-center justify-center relative" style={{ gap: '3rem' }} data-name="SaveCancelButton">
          <div 
            className="box-border flex h-[60px] items-center justify-center overflow-clip px-8 py-2.5 relative rounded-[37.5px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-white/10 hover:bg-white/20" 
            data-name="SaveButton"
            onClick={onSave}
          >
            <div className="FontStyleTitle flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white">
              <p className="leading-[normal] whitespace-pre">SAVE</p>
            </div>
          </div>
          <div 
            className="box-border flex h-[60px] items-center justify-center overflow-clip px-8 py-2.5 relative rounded-[37.5px] shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-white/10 hover:bg-white/20" 
            data-name="CancelButton"
            onClick={onCancel}
          >
            <div className="FontStyleTitle flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white">
              <p className="leading-[normal] whitespace-pre">CANCEL</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Button - Only show in edit mode with 2vh gap */}
      {isEditMode && (
        <>
          <div className="shrink-0 w-full" style={{ height: '2vh' }} data-name="gap" />
          <div className="box-border flex flex-col items-center justify-center overflow-clip p-[10px] shrink-0 w-full" data-name="DeleteArea">
            <DeleteButton 
              onDelete={onDelete || (() => {})}
              disabled={disabled}
            />
          </div>
        </>
      )}
    </div>
  );
}