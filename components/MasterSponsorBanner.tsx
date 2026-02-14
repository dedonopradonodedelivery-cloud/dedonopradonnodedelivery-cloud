
import React from 'react';
import { Crown, Star, ArrowRight } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick: () => void;
  label?: string;
}

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, label }) => {
  return (
    <div 
       onClick={onClick}
       className="relative w-full rounded-[2.5rem] p-[2px] bg-gradient-to-br from-[#FF6501] via-[#FF8C00] to-[#FF6501] shadow-[0_15px_40px_rgba(255,101,1,0.2)] cursor-pointer group active:scale-[0.98] transition-all mt-4 overflow-hidden"
    >
       {/* Background Body */}
       <div className="bg-white dark:bg-gray-900 rounded-[2.4rem] p-5 relative overflow-hidden h-full">
           {/* Efeito de brilho âmbar */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
           
           {/* Badge Master Flutuante */}
           <div className="absolute top-0 right-8 -translate-y-1/2 z-20">
              <span className="bg-[#FF6501] text-white text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/20 flex items-center gap-2">
                 <Crown className="w-3 h-3 fill-white" /> Patrocinador Master
              </span>
           </div>

           <div className="flex gap-5 items-center relative z-10">
               {/* Logo AC Box */}
               <div className="w-16 h-16 rounded-[1.25rem] bg-orange-50 dark:bg-orange-950/30 flex-shrink-0 overflow-hidden relative shadow-inner border border-orange-100/50 dark:border-orange-900/30 flex items-center justify-center">
                    <span className="text-[#FF6501] font-black text-2xl tracking-tighter">AC</span>
               </div>
               <div className="flex-1 min-w-0">
                   <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight truncate mb-1 tracking-tight uppercase">Atual Clube</h3>
                   <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 font-bold leading-relaxed">
                     Proteção veicular e benefícios exclusivos para Jacarepaguá.
                   </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[9px] font-black text-[#FF6501] bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-lg border border-orange-100 dark:border-orange-900/30">
                           <Star className="w-3 h-3 fill-current" />
                           5.0
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Holdings</span>
                        </div>
                    </div>
               </div>
               {/* Seta de navegação premium */}
               <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-[#FF6501] group-hover:bg-orange-50 transition-all shadow-sm shrink-0">
                  <ArrowRight size={20} strokeWidth={3} />
               </div>
           </div>
       </div>
    </div>
  );
};
