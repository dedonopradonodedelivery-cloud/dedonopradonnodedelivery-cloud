
import React from 'react';
import { Crown, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface MasterSponsor {
  name: string;
  subtitle: string;
  logoUrl?: string;
}

interface MasterSponsorBannerProps {
  onClick: () => void;
  label?: string;
  sponsor?: MasterSponsor | null;
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, label, sponsor }) => {
  if (sponsor) {
    // STATE: VENDIDO (SOLD)
    return (
      <div 
        onClick={onClick}
        className="relative w-full mt-12 mb-8 rounded-[2.5rem] bg-gradient-to-br from-slate-800 via-gray-900 to-black p-8 shadow-2xl shadow-black/30 overflow-hidden cursor-pointer group active:scale-[0.98] transition-all"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-6">
            <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Patrocinador Master</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 p-1">
                {sponsor.logoUrl ? <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain rounded-xl" /> : <Building2 className="w-8 h-8 text-slate-400" />}
             </div>
             <div>
                <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                  {sponsor.name}
                </h2>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {sponsor.subtitle}
                </p>
             </div>
          </div>

          <div className="flex items-center justify-end pt-6 border-t border-white/10">
            <div className="bg-white text-slate-900 font-black py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2 text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
              Conhecer Patrocinador
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE: DISPONÍVEL (AVAILABLE) - Fallback
  return (
    <div 
      onClick={onClick}
      className="relative w-full mt-12 mb-8 rounded-[2.5rem] bg-gradient-to-br from-[#1E5BFF] via-[#1E5BFF] to-[#4D7CFF] p-8 shadow-2xl shadow-blue-500/30 overflow-hidden cursor-pointer group active:scale-[0.98] transition-all"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-6">
          <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Patrocinador Master</span>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
            Destaque absoluto no bairro
          </h2>
          <p className="text-sm text-blue-50 font-medium leading-relaxed max-w-[260px]">
            Sua marca em evidência para todos que acessam esta página de {label || 'conteúdo'}.
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Espaço disponível</span>
          </div>
          
          <button className="bg-white text-[#1E5BFF] font-black py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2 text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
            Quero ser Master
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
