import React from 'react';
import CardComp from './CardComp';

interface CardPlaceCompProps {
  placeName: string;
  tableCount: number;
  color: string;
  property?: "Default" | "Empty" | "Selected";
  onClick?: () => void;
}

export default function CardPlaceComp({ 
  placeName, 
  tableCount, 
  color,
  property = "Default",
  onClick 
}: CardPlaceCompProps) {
  return (
    <CardComp
      type="Place"
      title={placeName}
      subtitle={tableCount.toString()}
      color={color}
      property={property}
      onClick={onClick}
      dataName="PlaceCard"
    />
  );
}