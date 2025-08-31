import React from 'react';

interface ItemProps {
  label: string;
}

function Item({ label }: ItemProps) {
  return (
    <div className="box-border flex items-center justify-center overflow-clip relative rounded-[1rem] shrink-0" data-name="Item" style={{ height: '2rem', width: 'auto', minWidth: 'fit-content', padding: '0.5rem 1rem', backgroundColor: 'var(--table-color-8)' }}>
      <div className="flex flex-col font-['Pretendard'] justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap" style={{ fontSize: '1rem', color: 'var(--dark)' }}>
        <p className="leading-[normal] whitespace-pre">{label}</p>
      </div>
    </div>
  );
}

export default Item;