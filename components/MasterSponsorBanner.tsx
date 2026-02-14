import React from 'react';
import { Crown, Star } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick: () => void;
  label?: string;
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, label }) => {
  return (
    <div 
       onClick={onClick}
       className="relative w-full rounded-2xl p-[1px] bg-white/30 shadow-[0_8px_20px_rgba(255,101,1,0.25)] cursor-pointer group active:scale-[0.98] transition-all mt-4"
    >
       {/* Fundo agora LARANJA */}
       <div className="bg-[#FF6501] rounded-[0.9rem] p-3 relative overflow-hidden h-full">
           {/* Efeito de brilho agora BRANCO */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
           
           {/* Badge: Fundo BRANCO, Texto LARANJA */}
           <div className="absolute top-0 right-4 -translate-y-1/2 z-20">
              <span className="bg-white text-[#FF6501] text-[7px] font-black px-2 py-0.5 rounded-b-md uppercase tracking-[0.1em] shadow-sm flex items-center gap-1">
                 <Crown className="w-2.5 h-2.5 fill-[#FF6501]" /> Master
              </span>
           </div>

           <div className="flex gap-3 items-center">
               {/* Logo Box: Fundo BRANCO, Texto LARANJA */}
               <div className="w-11 h-11 rounded-xl bg-white flex-shrink-0 overflow-hidden relative shadow-md border border-white/20 flex items-center justify-center">
                    <span className="text-[#FF6501] font-black text-xs">AC</span>
               </div>
               <div className="flex-1 min-w-0">
                   {/* Textos agora BRANCOS */}
                   <h3 className="font-black text-sm text-white leading-tight truncate mb-0.5 tracking-tight uppercase">Atual Clube</h3>
                   <p className="text-[8px] text-white/90 line-clamp-1 mb-1.5 font-medium leading-tight opacity-90">
                     Proteção e benefícios exclusivos em {label || 'Jacarepaguá'}.
                   </p>
                    <div className="flex items-center gap-2">
                        {/* Rating: Texto BRANCO, Fundo Translúcido BRANCO */}
                        <div className="flex items-center gap-0.5 text-[8px] font-bold text-white bg-white/20 px-1.5 py-0.5 rounded-md border border-white/30">
                           <Star className="w-2.5 h-2.5 fill-current text-white" />
                           5.0
                        </div>
                        {/* Tag: Texto BRANCO, Fundo Escuro Suave mantido para contraste */}
                        <div className="bg-black/5 px-1.5 py-0.5 rounded-md border border-black/5">
                            <span className="text-[7px] font-black text-white uppercase tracking-widest">Benefícios</span>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
};