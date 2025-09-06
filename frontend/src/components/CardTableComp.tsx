import React from 'react';
import CardComp from './CardComp';

interface CardTableCompProps {
  tableName: string;
  placeName: string;
  color: string;
  property?: "Default" | "Empty" | "Selected";
  onClick?: () => void;
}

export default function CardTableComp({ 
  tableName, 
  placeName,
  color,
  property = "Default",
  onClick 
}: CardTableCompProps) {
  return (
    <CardComp
      type="Table"
      title={tableName}
      subtitle={placeName}
      color={color}
      property={property}
      onClick={onClick}
      dataName="TableCard"
    />
  );
}