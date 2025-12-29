
import React from 'react';
import { Crown, ArrowUpRight } from 'lucide-react';

interface InstitutionalSponsorBannerProps {
  type: 'client' | 'merchant';
  onClick?: () => void;
  className?: string;
}

export const InstitutionalSponsorBanner: React.FC<InstitutionalSponsorBannerProps> = ({ type, onClick, className = "" }) => {
  const isMerchant = type === 'merchant';
  
  return (
    <div 
      onClick={onClick}
      className={`w-full p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between gap-4 mt-8 relative overflow-hidden
        ${isMerchant 
          ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500/20 shadow-xl shadow-indigo-500/5 text-slate-300' 
          : 'bg-white border-gray-100 text-gray-600 dark:bg-gray-800/50 dark:border-gray-800 shadow-sm'
        } ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-[0.99]' : ''} ${className}`}
    >
      {/* Subtle Glow for Merchant Mode */}
      {isMerchant && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner
          ${isMerchant 
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10'}`}>
          <Crown className="w-6 h-6" />
        </div>
        
        <div className="flex flex-col">
          <span className={`text-[8px] font-black uppercase tracking-[0.25em] opacity-60 ${isMerchant ? 'text-indigo-300' : ''}`}>
            Patrocinador Master
          </span>
          <h4 className={`text-[15px] font-bold leading-tight ${isMerchant ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Grupo Esquematiza
          </h4>
          <p className="text-[10px] opacity-70 mt-0.5 font-medium">
            {isMerchant 
              ? 'Apoiando o crescimento dos negócios locais' 
              : 'Apoiando o comércio local da freguesia'}
          </p>
        </div>
      </div>

      {onClick && (
        <div className="opacity-40">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
