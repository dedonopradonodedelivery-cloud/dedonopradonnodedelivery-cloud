
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
       className="relative w-full rounded-[2rem] p-[2px] bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.15)] cursor-pointer group active:scale-[0.98] transition-all mt-6"
    >
       <div className="bg-slate-900 dark:bg-slate-900 rounded-[1.9rem] p-5 relative overflow-hidden h-full">
           {/* Efeito de brilho de fundo */}
           <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           
           <div className="absolute top-0 right-6 -translate-y-1/2 z-20">
              <span className="bg-amber-400 text-slate-900 text-[8px] font-black px-3 py-0.5 rounded-b-lg uppercase tracking-[0.15em] shadow-md flex items-center gap-1.5 border-x border-b border-amber-300">
                 <Crown className="w-3 h-3 fill-slate-900" /> Patrocinador Master
              </span>
           </div>

           <div className="flex gap-4 items-center">
               <div className="w-20 h-20 rounded-2xl bg-white flex-shrink-0 overflow-hidden relative shadow-xl border-2 border-slate-700">
                    <img 
                       src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
                       alt="Grupo Esquematiza" 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
               </div>
               <div className="flex-1 min-w-0 pt-1">
                   <h3 className="font-black text-lg text-white leading-tight truncate mb-1 tracking-tighter uppercase">Grupo Esquematiza</h3>
                   <p className="text-[10px] text-slate-400 line-clamp-2 mb-3 font-medium leading-relaxed">
                     Líder em segurança e facilities em {label || 'Jacarepaguá'}.
                   </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                           <Star className="w-3 h-3 fill-current" />
                           5.0
                        </div>
                        <div className="bg-slate-800 px-2 py-1 rounded-lg border border-white/5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Holdings</span>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
};
