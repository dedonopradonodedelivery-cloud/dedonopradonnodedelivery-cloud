
import React from 'react';
import { Wrench, Zap, Key, Sparkles, Laptop, ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col py-2">
      {/* Unified Professional Service Central */}
      <div 
        onClick={onClick}
        className="relative w-full overflow-hidden rounded-[2.5rem] py-7 px-7 shadow-2xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] cursor-pointer group border border-white/10"
      >
        {/* Background Layer - Deep Brand Blue with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E5BFF] via-[#1248E0] to-[#0A2E99]"></div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px] animate-pulse"></div>
        </div>

        {/* Shimmer Effect for Premium Feeling */}
        <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-slow-shimmer pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header Area */}
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/40 shadow-xl">
                <Wrench size={24} className="text-white drop-shadow-lg" strokeWidth={2.5} />
              </div>
              <div className="bg-white/15 backdrop-blur-xl px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.12em]">Especialistas Verificados</span>
              </div>
          </div>

          {/* Text Content */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter max-w-[280px]">
              Precisa de um <br/> profissional agora?
            </h2>
            <p className="text-xs text-blue-50 font-medium leading-relaxed opacity-80 max-w-[260px]">
              Receba propostas de especialistas perto de você em Jacarepaguá.
            </p>
          </div>

          {/* Primary CTA */}
          <div>
              <button className="bg-white text-[#1E5BFF] font-black py-3.5 px-7 rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 group-hover:gap-4">
                Receber orçamentos
                <ArrowRight size={16} strokeWidth={3} />
              </button>
          </div>

          {/* Integrated Quick Shortcuts - Discreet Style */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-3 ml-1">Atalhos rápidos</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-1 pb-1">
                {QUICK_SERVICES.map((s, i) => (
                <div 
                    key={i} 
                    className="flex flex-col items-center gap-1.5 min-w-[70px] group/item"
                >
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 group-hover/item:bg-white/20 group-hover/item:text-white transition-all">
                        <s.icon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[7px] font-black text-white/60 text-center leading-tight uppercase tracking-tighter group-hover/item:text-white transition-colors max-w-[65px] truncate">
                        {s.name}
                    </span>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* Decorative Watermark - Scaled Down */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000">
            <Wrench size={160} strokeWidth={1} className="text-white" />
        </div>
      </div>
    </div>
  );
};
