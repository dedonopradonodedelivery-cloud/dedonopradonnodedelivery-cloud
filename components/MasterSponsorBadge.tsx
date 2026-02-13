
import React from 'react';
// Removed Crown icon as per request

interface MasterSponsorBadgeProps {
  onClick?: () => void; // Keeping onClick for semantic use if needed later, but styling removed.
  className?: string; // For additional styling if needed
}

export const MasterSponsorBadge: React.FC<MasterSponsorBadgeProps> = ({ onClick, className = "" }) => {
  return (
    <div // Changed from button to div
      onClick={onClick} // Keep onClick for logical purpose
      className={`flex flex-col items-end ${onClick ? 'cursor-pointer' : ''} ${className}`} // Right alignment for sponsor text, add cursor-pointer
    >
      <p className="text-[8px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-0.5">Patrocinador Master</p>
      <p className="text-sm font-bold tracking-normal text-amber-500 dark:text-amber-400">Grupo Esquematiza</p>
    </div>
  );
};
