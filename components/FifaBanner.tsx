import React from 'react';
import { Wrench, Check, ArrowRight, Sparkles } from 'lucide-react';

interface FifaBannerProps {
  onClick: () => void;
}

export const FifaBanner: React.FC<FifaBannerProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-[2rem] bg-[#020617] p-5 shadow-xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] cursor-pointer group"
    >
      {/* FIFA Style Background - Geometric & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1E5BFF] opacity-90"></div>
      
      {/* Decorative Lines/Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(135deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]"></div>
      </div>

      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-[slow-shimmer_6s_infinite_linear] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-3">
        {/* Top Section: Badge & Icon */}
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-xl">
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Serviços Verificados</span>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-blue-400/50 transition-colors">
              <Wrench size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#020617] shadow-lg">
                <Check size={10} className="text-white" strokeWidth={4} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white leading-tight uppercase tracking-tighter max-w-[240px]">
            Precisa de um profissional no seu bairro?
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[280px]">
            Especialistas verificados, orçamentos rápidos e atendimento perto de você.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-3 bg-white text-[#020617] font-black py-3 px-5 rounded-xl shadow-[0_0_20px_rgba(30,91,255,0.3)] transition-all group-hover:gap-5">
            <span className="text-[10px] uppercase tracking-widest">Solicitar Orçamento Grátis</span>
            <ArrowRight size={14} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full opacity-50"></div>
    </div>
  );
};