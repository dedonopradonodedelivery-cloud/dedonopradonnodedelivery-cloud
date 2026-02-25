
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
      <div className="flex items-center gap-1.5 animate-premium-breathing select-none">
        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/50 leading-none">
          Patrocinador Master
        </p>
        <span className="text-white/30 text-[8px] font-light">/</span>
        <p className="text-[11px] font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
            Atual Clube
        </p>
      </div>
    </div>
  );
};
