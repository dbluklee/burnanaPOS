import React from 'react';
import CardComp from './CardComp';

interface CardMenuCompProps {
  menuName: string;
  categoryName: string;
  price: string;
  description?: string;
  color: string;
  property?: "Default" | "Empty" | "Selected";
  onClick?: () => void;
}

export default function CardMenuComp({ 
  menuName, 
  categoryName,
  price,
  description,
  color,
  property = "Default",
  onClick 
}: CardMenuCompProps) {
  return (
    <CardComp
      type="Menu"
      title={menuName}
      subtitle={categoryName}
      subtitle2={price}
      subtitle3={description}
      color={color}
      property={property}
      onClick={onClick}
      dataName="MenuCard"
    />
  );
}