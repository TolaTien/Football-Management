import React from 'react';

interface PitchHeaderCellProps {
  name: string;
  type: string;
  isLast?: boolean;
}

export const PitchHeaderCell: React.FC<PitchHeaderCellProps> = ({ name, type, isLast }) => {
  return (
    <div className={`p-4 text-center ${!isLast ? 'border-r border-gray-200' : ''}`}>
      <span className="block font-bold text-emerald-900 font-montserrat">{name}</span>
      <span className="text-[10px] text-gray-500 font-label-caps">{type}</span>
    </div>
  );
};
