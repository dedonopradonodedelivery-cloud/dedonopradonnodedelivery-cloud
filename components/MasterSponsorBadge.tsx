
import React from 'react';

interface MasterSponsorBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const MasterSponsorBadge: React.FC<MasterSponsorBadgeProps> = ({ onClick, className = "" }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center transition-all active:scale-95 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex flex-col items-end bg-[#FF6501] px-3 py-1.5 rounded-lg shadow-md border border-white/10">
        <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/90 leading-none mb-0.5">
          Patrocinador Master
        </p>
        <p className="text-[11px] font-black tracking-tighter text-white uppercase leading-none drop-shadow-sm">
            Atual Clube
        </p>
      </div>
    </div>
  );
};
