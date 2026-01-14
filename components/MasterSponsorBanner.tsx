
import React from 'react';
import { ChevronRight, Crown } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'light';
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, className = "", variant = 'default' }) => {
  const isLight = variant === 'light';

  return (
    <div 
      onClick={onClick}
      className={`w-full relative overflow-hidden rounded-[24px] group cursor-pointer active:scale-[0.98] transition-all duration-300 shadow-xl 
        ${isLight 
          ? 'bg-white shadow-slate-200 border-2 border-emerald-50 py-8 px-6' 
          : 'bg-gradient-to-br from-slate-900 via-black to-slate-900 shadow-slate-900/20 border border-white/10 p-5'
        } ${className}`}
    >
      {/* Background Effects */}
      {!isLight && (
        <>
          <div className="absolute top-1/2 left-8 -translate-y-1/2 w-[100px] h-[100px] bg-amber-500/10 blur-[40px] rounded-full pointer-events-none z-0 group-hover:bg-amber-500/20 transition-all duration-500"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full mix-blend-lighten pointer-events-none"></div>
          <div className="absolute inset-0 rounded-[24px] border border-white/10 z-10 pointer-events-none"></div>
        </>
      )}

      {isLight && (
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      )}

      <div className="flex items-center justify-between gap-4 relative z-20">
         
         {/* Icon Container */}
         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300
            ${isLight 
              ? 'bg-emerald-50 border border-emerald-100' 
              : 'bg-slate-800 border border-white/10'
            }`}>
            <Crown className={`w-8 h-8 ${isLight ? 'text-emerald-700 fill-emerald-700' : 'text-amber-400'}`} />
         </div>

         {/* Content Area */}
         <div className="flex-1 min-w-0 text-left">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLight ? 'text-emerald-600' : 'text-blue-300'}`}>
                Patrocinador Master
            </span>
            <h3 className={`font-bold text-xl mt-1 truncate drop-shadow-sm tracking-tight leading-none
                ${isLight 
                  ? 'text-emerald-950' 
                  : 'bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent'
                }`}>
                Grupo Esquematiza
            </h3>
            {isLight && <p className="text-xs text-emerald-800/60 font-medium mt-1">Segurança e Facilities</p>}
         </div>

         {/* Action Indicator */}
         <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
            ${isLight 
              ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200' 
              : 'bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
            }`}>
            <ChevronRight className={`w-5 h-5 ${isLight ? 'text-emerald-800' : 'text-slate-300 group-hover:text-white'}`} />
         </div>
      </div>
    </div>
  );
};
