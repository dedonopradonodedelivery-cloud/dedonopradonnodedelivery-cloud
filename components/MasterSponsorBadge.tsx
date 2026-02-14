
import React from 'react';

interface MasterSponsorBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const MasterSponsorBadge: React.FC<MasterSponsorBadgeProps> = ({ onClick, className = "" }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-end transition-all active:scale-95 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="text-right animate-premium-breathing select-none">
        {/* Label: Ultra minimal, sophisticated transparency */}
        <p className="text-[6px] font-black uppercase tracking-[0.45em] text-white/40 mb-1 leading-none">
          Patrocinador Master
        </p>
        
        {/* Brand Name: Pure White, Bold, with Layered Depth Glow */}
        <div className="relative">
            <p className="text-[12px] font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
                Atual Clube
            </p>
        </div>
      </div>
    </div>
  );
};
