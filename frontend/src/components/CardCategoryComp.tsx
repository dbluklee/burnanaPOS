import React from 'react';
import CardComp from './CardComp';

interface CardCategoryCompProps {
  categoryName: string;
  menuCount: number;
  color: string;
  property?: "Default" | "Empty" | "Selected";
  onClick?: () => void;
}

export default function CardCategoryComp({ 
  categoryName, 
  menuCount, 
  color,
  property = "Default",
  onClick 
}: CardCategoryCompProps) {
  return (
    <CardComp
      type="Category"
      title={categoryName}
      subtitle={menuCount.toString()}
      color={color}
      property={property}
      onClick={onClick}
      dataName="CategoryCard"
    />
  );
}