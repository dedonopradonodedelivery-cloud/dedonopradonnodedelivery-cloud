import React from 'react';
import { Wrench, Check, ArrowRight } from 'lucide-react';

interface FifaBannerProps {
  onClick: () => void;
}

export const FifaBanner: React.FC<FifaBannerProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-[1.5rem] bg-[#020617] p-4 shadow-xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] cursor-pointer group border border-white/5"
    >
      {/* Background - Preserved */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1E5BFF] opacity-90"></div>
      
      {/* Decorative Lines/Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(135deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]"></div>
      </div>

      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-[slow-shimmer_6s_infinite_linear] pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Text & CTA Section */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-white leading-none uppercase tracking-tighter mb-1.5">
            Precisando de um profissional?
          </h2>
          <p className="text-[10px] text-slate-300 font-medium leading-tight mb-3 opacity-90 pr-2">
            Especialistas verificados, orçamentos rápidos e atendimento perto de você!
          </p>

          {/* Compact CTA */}
          <div className="inline-flex items-center gap-2 bg-white text-[#020617] font-black py-2 px-3 rounded-xl shadow-[0_0_15px_rgba(30,91,255,0.4)] transition-all group-hover:gap-3">
            <span className="text-[9px] uppercase tracking-widest">Solicitar Orçamento Grátis</span>
            <ArrowRight size={12} strokeWidth={3} />
          </div>
        </div>

        {/* Icon Section - Compact */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-lg group-hover:bg-white/20 transition-colors group-hover:border-white/20">
            <Wrench size={20} className="text-white drop-shadow-md" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#020617] shadow-sm">
              <Check size={8} className="text-white" strokeWidth={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full opacity-50"></div>
    </div>
  );
};