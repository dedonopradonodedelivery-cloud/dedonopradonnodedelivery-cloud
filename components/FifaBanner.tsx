
import React from 'react';
import { Wrench, ChevronRight, Zap, Key, Hammer, Sparkles, Laptop, ShieldCheck, ArrowRight } from 'lucide-react';

interface FifaBannerProps {
  onClick: () => void;
}

const QUICK_SERVICES = [
  { name: 'Eletricista', icon: Zap },
  { name: 'Encanador', icon: Wrench },
  { name: 'Chaveiro', icon: Key },
  { name: 'Diarista', icon: Sparkles },
  { name: 'Técnico de Informática', icon: Laptop },
];

export const FifaBanner: React.FC<FifaBannerProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col gap-10 py-6">
      {/* Main Professional Service Block - Premium Design */}
      <div 
        onClick={onClick}
        className="relative w-full overflow-hidden rounded-[3.5rem] bg-slate-900 py-16 px-12 shadow-2xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] cursor-pointer group border border-white/10"
      >
        {/* Background Layer - Deep Brand Blue with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E5BFF] via-[#1248E0] to-[#0A2E99]"></div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-white/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        {/* Shimmer Effect for Premium Feeling */}
        <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-slow-shimmer pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-8">
          {/* Badge & Icon Area */}
          <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/40 shadow-2xl">
                <Wrench size={40} className="text-white drop-shadow-lg" strokeWidth={2.5} />
              </div>
              <div className="bg-white/15 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Especialistas Verificados</span>
              </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-[1.1] uppercase tracking-tighter max-w-[280px]">
              Precisa de um <br/> profissional agora?
            </h2>
            <p className="text-base text-blue-50 font-medium leading-relaxed opacity-90 max-w-[260px]">
              Receba propostas de especialistas perto de você em Jacarepaguá.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="pt-2">
              <button className="bg-white text-[#1E5BFF] font-black py-5 px-10 rounded-[2rem] shadow-2xl hover:bg-blue-50 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 group-hover:gap-4">
                Receber orçamentos
                <ArrowRight size={20} strokeWidth={3} />
              </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
            <Wrench size={260} strokeWidth={1} className="text-white" />
        </div>
      </div>

      {/* Horizontal Shortcuts - Sub-monetization Category Access */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Serviços em Destaque</p>
        </div>
        <div className="flex gap-5 overflow-x-auto no-scrollbar -mx-5 px-5 pb-4">
            {QUICK_SERVICES.map((s, i) => (
            <button 
                key={i} 
                onClick={onClick} 
                className="flex flex-col items-center gap-3 min-w-[90px] group/item active:scale-95 transition-transform"
            >
                <div className="w-16 h-16 rounded-[28px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/20 group-hover/item:text-[#1E5BFF] dark:group-hover/item:text-blue-400 group-hover/item:border-blue-100 dark:group-hover/item:border-blue-800/30 transition-all shadow-sm">
                <s.icon size={28} strokeWidth={2} />
                </div>
                <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 text-center leading-tight uppercase tracking-tighter group-hover/item:text-[#1E5BFF] transition-colors max-w-[80px]">
                {s.name}
                </span>
            </button>
            ))}
        </div>
      </div>
    </div>
  );
};
