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
      <span className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
        {type}
      </span>
    </div>
  );
};
