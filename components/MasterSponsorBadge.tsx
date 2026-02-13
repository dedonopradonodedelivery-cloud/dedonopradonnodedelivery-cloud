
import React from 'react';

interface MasterSponsorBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const MasterSponsorBadge: React.FC<MasterSponsorBadgeProps> = ({ onClick, className = "" }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-end ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <p className="text-[8px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">Patrocinador Master</p>
      <p className="text-sm font-black tracking-tighter text-[#FF6501] uppercase">Atual Clube</p>
    </div>
  );
};
