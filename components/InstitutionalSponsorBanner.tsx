
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
      className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 mt-8
        ${isMerchant 
          ? 'bg-slate-900/40 border-white/5 text-slate-300' 
          : 'bg-gray-50 border-gray-100 text-gray-600 dark:bg-gray-800/50 dark:border-gray-800'
        } ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-[0.99]' : ''} ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${isMerchant ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
          <Crown className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">
            Patrocinador Master
          </span>
          <h4 className={`text-sm font-bold leading-tight ${isMerchant ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Grupo Esquematiza
          </h4>
          <p className="text-[10px] opacity-70 mt-0.5">
            {isMerchant 
              ? 'Apoiando o crescimento dos negócios locais' 
              : 'Apoiando o comércio local da freguesia'}
          </p>
        </div>
      </div>

      {onClick && (
        <div className="opacity-40">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
