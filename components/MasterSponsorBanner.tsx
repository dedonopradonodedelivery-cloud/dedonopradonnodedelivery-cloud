import React from 'react';
import { Crown, ArrowRight, Sparkles } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick: () => void;
  label?: string;
  sponsor?: {
    name: string;
    subtitle: string;
    logoUrl?: string;
  } | null;
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, label, sponsor }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full mt-12 mb-8 rounded-[2.5rem] bg-gradient-to-br from-slate-800 via-gray-900 to-black p-8 shadow-2xl shadow-black/30 overflow-hidden cursor-pointer group active:scale-[0.98] transition-all"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-6">
          <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Patrocinador Master</span>
        </div>

        {/* Conteúdo Central */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
            {sponsor?.name || 'Grupo Esquematiza'}
          </h2>
          <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-[260px]">
            {sponsor?.subtitle || `Apoiando o crescimento dos negócios em ${label || 'Jacarepaguá'}.`}
          </p>
        </div>

        {/* Rodapé do Banner */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Experiência Exclusiva</span>
          </div>
          
          <button className="bg-white text-slate-900 font-black py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2 text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
            Conhecer holding
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};