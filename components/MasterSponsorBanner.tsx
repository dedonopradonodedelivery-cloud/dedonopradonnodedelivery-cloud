
import React from 'react';
import { ChevronRight, Crown } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick?: () => void;
  className?: string;
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, className = "" }) => {
  return (
    <div 
      onClick={onClick}
      className={`w-full relative overflow-hidden rounded-[24px] group cursor-pointer active:scale-[0.98] transition-all duration-300 shadow-xl shadow-slate-900/20 ${className}`}
    >
      {/* 1. Background: Darker, more premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900 z-0"></div>
      
      {/* 2. Glow Effects: More focused */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 w-[100px] h-[100px] bg-amber-500/10 blur-[40px] rounded-full pointer-events-none z-0 group-hover:bg-amber-500/20 transition-all duration-500"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full mix-blend-lighten pointer-events-none"></div>

      {/* 3. Subtle Glass Border */}
      <div className="absolute inset-0 rounded-[24px] border border-white/10 z-10 pointer-events-none"></div>

      <div className="flex items-center justify-between gap-4 relative z-20 p-5">
         
         {/* Icon Container - Now with Crown */}
         <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-lg flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300 z-20">
            <Crown className="w-7 h-7 text-amber-400" />
         </div>

         {/* Content Area - Text reduced */}
         <div className="flex-1 min-w-0 text-left">
            <span className="text-[9px] font-bold text-blue-300 uppercase tracking-[0.2em]">
                Patrocinador Master
            </span>
            <h3 className="bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent font-bold text-lg mt-0.5 truncate drop-shadow-sm tracking-tight">
                Grupo Esquematiza
            </h3>
         </div>

         {/* Action Indicator */}
         <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
         </div>
      </div>
    </div>
  );
};
