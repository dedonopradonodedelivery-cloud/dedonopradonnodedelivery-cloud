
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
       className="relative w-full rounded-2xl p-[1.5px] bg-gradient-to-r from-[#FF6501] via-orange-400 to-[#FF6501] shadow-[0_8px_20px_rgba(255,101,1,0.15)] cursor-pointer group active:scale-[0.98] transition-all mt-4"
    >
       <div className="bg-slate-900 dark:bg-slate-900 rounded-[0.9rem] p-3 relative overflow-hidden h-full">
           <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
           
           <div className="absolute top-0 right-4 -translate-y-1/2 z-20">
              <span className="bg-[#FF6501] text-white text-[7px] font-black px-2 py-0.5 rounded-b-md uppercase tracking-[0.1em] shadow-sm flex items-center gap-1">
                 <Crown className="w-2.5 h-2.5 fill-white" /> Master
              </span>
           </div>

           <div className="flex gap-3 items-center">
               <div className="w-11 h-11 rounded-xl bg-white flex-shrink-0 overflow-hidden relative shadow-md border border-slate-700 flex items-center justify-center">
                    <span className="text-orange-600 font-black text-xs">AC</span>
               </div>
               <div className="flex-1 min-w-0">
                   <h3 className="font-black text-sm text-white leading-tight truncate mb-0.5 tracking-tight uppercase">Atual Clube</h3>
                   <p className="text-[8px] text-slate-400 line-clamp-1 mb-1.5 font-medium leading-tight opacity-80">
                     Proteção e benefícios exclusivos em {label || 'Jacarepaguá'}.
                   </p>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-[8px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-md border border-orange-400/20">
                           <Star className="w-2.5 h-2.5 fill-current" />
                           5.0
                        </div>
                        <div className="bg-slate-800 px-1.5 py-0.5 rounded-md border border-white/5">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Benefícios</span>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
};
