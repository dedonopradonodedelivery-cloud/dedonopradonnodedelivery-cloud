
import React, { useState, useEffect } from 'react';
import { Crown, Star, ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';

interface MasterSponsorBannerProps {
  onClick: () => void;
  label?: string;
}

const PHRASES = [
  "A melhor loja de iPhones e acessórios da região",
  "Assistência técnica especializada Apple",
  "Seu novo iPhone está aqui na Freguesia"
];

export const MasterSponsorBanner: React.FC<MasterSponsorBannerProps> = ({ onClick, label }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        setIsFading(false);
      }, 300); // Duration of fade out
    }, 4000); // Interval between phrases

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
       onClick={onClick}
       className="relative w-full mt-6 group cursor-pointer"
    >
       {/* Floating Badge - Half in/out */}
       <div className="absolute -top-3 right-6 z-20">
           <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border-2 border-white/10 flex items-center gap-1.5">
               <Crown size={10} fill="currentColor" />
               {label || 'Patrocinador Master'}
           </span>
       </div>

       {/* Main Container with "Big App" Card Style */}
       <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1e293b] shadow-2xl shadow-blue-900/20 border border-white/10 transition-transform active:scale-[0.98] duration-300">
           
           {/* Background Decorative Elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>
           
           {/* Geometric Pattern Overlay */}
           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

           <div className="relative p-6 flex items-center gap-5">
               
               {/* Left: Sponsor Logo Area */}
               <div className="relative shrink-0">
                   <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-lg shadow-black/10 relative z-10 border border-blue-200/50">
                       <Smartphone size={36} className="text-blue-600" strokeWidth={1.5} />
                   </div>
                   {/* Decorative ring behind logo */}
                   <div className="absolute -inset-1 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
               </div>

               {/* Center: Content */}
               <div className="flex-1 min-w-0 py-1">
                   {/* Rating */}
                   <div className="flex items-center gap-1 text-[9px] font-bold text-blue-200 mb-2">
                       <Star size={10} className="fill-amber-400 text-amber-400" />
                       <span className="text-amber-400">5.0</span>
                   </div>

                   {/* Title & Description */}
                   <h3 className="text-xl font-black text-white leading-none tracking-tight mb-1">
                       Rio Phone Store
                   </h3>
                   <p className={`text-xs font-medium text-blue-100/80 leading-relaxed line-clamp-2 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                       {PHRASES[currentPhraseIndex]}
                   </p>
               </div>

               {/* Right: Action Arrow */}
               <div className="shrink-0">
                   <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-lg">
                       <ArrowRight size={20} className="text-white" />
                   </div>
               </div>
           </div>

           {/* Bottom Strip / Footer inside card */}
           <div className="bg-white/5 backdrop-blur-md px-6 py-2.5 flex items-center justify-between border-t border-white/5">
               <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90 uppercase tracking-wide">
                       <ShieldCheck size={12} className="text-emerald-400" />
                       <span>Verificado</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-white/20"></div>
                   <span className="text-[10px] font-medium text-white/60">Freguesia</span>
               </div>
               <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                   Ver Loja
               </span>
           </div>
       </div>
    </div>
  );
};
