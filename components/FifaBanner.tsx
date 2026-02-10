import React from 'react';
import { Wrench, Check, ChevronRight, Zap, Key, Hammer, Sparkles, Laptop } from 'lucide-react';

interface FifaBannerProps {
  onClick: () => void;
}

const QUICK_SERVICES = [
  { name: 'Eletricista', icon: Zap },
  { name: 'Chaveiro', icon: Key },
  { name: 'Marido de Aluguel', icon: Hammer },
  { name: 'Diarista', icon: Sparkles },
  { name: 'Téc. Informática', icon: Laptop },
];

export const FifaBanner: React.FC<FifaBannerProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Main Banner */}
      <div 
        onClick={onClick}
        className="relative w-full overflow-hidden rounded-[1.75rem] bg-[#020617] p-5 shadow-xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] cursor-pointer group border border-white/5"
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

        <div className="relative z-10 flex items-center gap-4">
          {/* Left Icon (New) */}
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
            <Wrench size={20} className="text-white" />
          </div>

          {/* Text Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-white leading-none uppercase tracking-tighter mb-1.5">
              Precisando de um profissional?
            </h2>
            <p className="text-[10px] text-slate-300 font-medium leading-tight opacity-90 pr-2">
              Especialistas verificados, orçamentos rápidos e atendimento perto de você!
            </p>
          </div>

          {/* Right Icon (New) */}
          <div className="shrink-0 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">
             <ChevronRight size={20} />
          </div>
        </div>

        {/* Subtle Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full opacity-50"></div>
      </div>

      {/* Mini Services List (New) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
        {QUICK_SERVICES.map((s, i) => (
          <button 
            key={i} 
            onClick={onClick} 
            className="flex flex-col items-center gap-2 min-w-[76px] group/item active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-[18px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/20 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 group-hover/item:border-blue-100 dark:group-hover/item:border-blue-800/30 transition-all shadow-sm">
              <s.icon size={20} strokeWidth={1.5} />
            </div>
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 text-center leading-tight max-w-[70px] truncate group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
              {s.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
