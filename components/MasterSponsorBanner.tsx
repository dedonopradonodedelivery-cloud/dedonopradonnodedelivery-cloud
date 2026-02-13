
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
       className="relative w-full rounded-2xl p-[1.5px] bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 shadow-[0_8px_20px_rgba(245,158,11,0.1)] cursor-pointer group active:scale-[0.98] transition-all mt-4"
    >
       <div className="bg-slate-900 dark:bg-slate-900 rounded-[0.9rem] p-3 relative overflow-hidden h-full">
           {/* Efeito de brilho de fundo reduzido */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
           
           <div className="absolute top-0 right-4 -translate-y-1/2 z-20">
              <span className="bg-amber-400 text-slate-900 text-[7px] font-black px-2 py-0.5 rounded-b-md uppercase tracking-[0.1em] shadow-sm flex items-center gap-1 border-x border-b border-amber-300">
                 <Crown className="w-2.5 h-2.5 fill-slate-900" /> Master
              </span>
           </div>

           <div className="flex gap-3 items-center">
               <div className="w-11 h-11 rounded-xl bg-white flex-shrink-0 overflow-hidden relative shadow-md border border-slate-700">
                    <img 
                       src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
                       alt="Grupo Esquematiza" 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
               </div>
               <div className="flex-1 min-w-0">
                   <h3 className="font-black text-sm text-white leading-tight truncate mb-0.5 tracking-tight uppercase">Grupo Esquematiza</h3>
                   <p className="text-[8px] text-slate-400 line-clamp-1 mb-1.5 font-medium leading-tight opacity-80">
                     Segurança e facilities em {label || 'Jacarepaguá'}.
                   </p>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-[8px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/20">
                           <Star className="w-2.5 h-2.5 fill-current" />
                           5.0
                        </div>
                        <div className="bg-slate-800 px-1.5 py-0.5 rounded-md border border-white/5">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Holdings</span>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
};
