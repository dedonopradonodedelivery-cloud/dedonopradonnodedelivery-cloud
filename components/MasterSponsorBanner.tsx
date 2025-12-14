
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick?: () => void;
  className?: string;
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, className = "" }) => {
  return (
    <div 
      onClick={onClick}
      className={`w-full relative overflow-hidden rounded-[24px] group cursor-pointer active:scale-[0.98] transition-all duration-500 ease-out shadow-lg shadow-slate-900/10 ${className}`}
    >
      {/* 1. Deep Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] z-0"></div>
      
      {/* 2. 'Soft Light' Glow Effect - Diffused and Elegant */}
      <div className="absolute top-0 left-0 w-[140px] h-[140px] bg-blue-600/20 blur-[50px] pointer-events-none z-0 mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute bottom-0 right-0 w-[100px] h-[100px] bg-indigo-500/10 blur-[60px] pointer-events-none z-0"></div>

      {/* 3. Subtle Glass Border */}
      <div className="absolute inset-0 rounded-[24px] border border-white/10 z-10 pointer-events-none"></div>

      <div className="flex items-center gap-4 relative z-20 p-5">
         {/* Icon Container - High Contrast Pivot Point */}
         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300 z-20">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#0F172A]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill="currentColor"/>
              <path d="M8 8H16V10H10V11H15V13H10V14H16V16H8V8Z" fill="white"/>
            </svg>
         </div>

         {/* Content Area */}
         <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold text-blue-100/90 uppercase tracking-[0.15em] leading-none flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]"></span>
                    Patrocinador Master
                </span>
            </div>
            
            <h3 className="text-white font-bold text-[17px] leading-tight truncate drop-shadow-sm tracking-tight mb-0.5">
                Grupo Esquematiza
            </h3>
            
            <p className="text-slate-400 text-xs font-medium truncate group-hover:text-slate-300 transition-colors">
                Transformando desafios em soluções seguras.
            </p>
         </div>

         {/* Action Indicator */}
         <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
         </div>
      </div>
    </div>
  );
};
