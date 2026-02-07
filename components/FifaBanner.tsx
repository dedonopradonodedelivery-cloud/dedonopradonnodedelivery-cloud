
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
      {/* Main Banner - Altura aumentada e visual suavizado */}
      <div 
        onClick={onClick}
        className="relative w-full overflow-hidden rounded-[2.5rem] bg-blue-600 py-16 px-8 shadow-xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] cursor-pointer group border border-white/10"
      >
        {/* Background - Gradiente mais leve e azulado */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"></div>
        
        {/* Decorative Lines/Patterns - Suavizados */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(135deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-[80px]"></div>
        </div>

        {/* Dynamic Glow Effect - Sutil */}
        <div className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-[slow-shimmer_8s_infinite_linear] pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-6">
          {/* Left Icon - Aumentado e clareado */}
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-lg">
            <Wrench size={28} className="text-white" />
          </div>

          {/* Text Section */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white leading-tight uppercase tracking-tight mb-2">
              Precisando de um profissional?
            </h2>
            <p className="text-xs text-blue-50 font-medium leading-relaxed opacity-90 pr-2">
              Especialistas verificados, orçamentos rápidos e atendimento perto de você!
            </p>
          </div>

          {/* Right Icon */}
          <div className="shrink-0 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all">
             <ChevronRight size={24} />
          </div>
        </div>
      </div>

      {/* Mini Services List */}
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
