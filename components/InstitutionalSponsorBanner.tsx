import React from 'react';
import { Crown, ArrowUpRight } from 'lucide-react';

interface InstitutionalSponsorBannerProps {
  type: 'client' | 'merchant';
  onClick?: () => void;
  className?: string;
}

/**
 * Banner Institucional do Patrocinador Master.
 * A cor de fundo foi ajustada para um Azul-Grafite Acinzentado (#334155 / #475569)
 * extraído da paleta institucional, garantindo destaque sobre o fundo quase preto da tela.
 */
export const InstitutionalSponsorBanner: React.FC<InstitutionalSponsorBannerProps> = ({ type, onClick, className = "" }) => {
  const isMerchant = type === 'merchant';
  
  return (
    <div 
      onClick={onClick}
      className={`w-full p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between gap-4 mt-8 relative overflow-hidden
        ${isMerchant 
          ? 'bg-gradient-to-br from-[#334155] via-[#2a3441] to-[#1e293b] border-white/10 shadow-2xl shadow-black/40 text-slate-200' 
          : 'bg-white border-gray-100 text-gray-600 dark:bg-gray-800 dark:border-gray-800 shadow-sm'
        } ${onClick ? 'cursor-pointer hover:brightness-110 active:scale-[0.99]' : ''} ${className}`}
    >
      {/* Brilho interno sutil para efeito metálico/premium no modo lojista */}
      {isMerchant && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>
      )}

      <div className="flex items-center gap-4 relative z-10">
        {/* Ícone de Coroa preservado em Dourado (Amber) */}
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner
          ${isMerchant 
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
            : 'bg-blue-50/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'}`}>
          <Crown className="w-6 h-6 fill-current" />
        </div>
        
        <div className="flex flex-col">
          <span className={`text-[8px] font-black uppercase tracking-[0.25em] opacity-70 ${isMerchant ? 'text-slate-300' : ''}`}>
            Patrocinador Master
          </span>
          <h4 className={`text-[16px] font-bold leading-tight tracking-tight ${isMerchant ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Grupo Esquematiza
          </h4>
          <p className={`text-[10px] mt-0.5 font-medium ${isMerchant ? 'text-slate-400' : 'opacity-70'}`}>
            {isMerchant 
              ? 'Apoiando o crescimento dos negócios locais' 
              : 'Apoiando o comércio local da freguesia'}
          </p>
        </div>
      </div>

      {onClick && (
        <div className={`transition-transform duration-300 ${isMerchant ? 'text-slate-400' : 'opacity-40'}`}>
          <ArrowUpRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
