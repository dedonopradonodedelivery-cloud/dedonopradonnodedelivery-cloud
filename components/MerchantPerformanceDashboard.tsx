
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  BarChart3, 
  Eye, 
  User, 
  Phone, 
  TrendingUp, 
  PieChart, 
  Star, 
  Flame, 
  Send, 
  Tag, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Trophy
} from 'lucide-react';

interface MerchantPerformanceDashboardProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

// Componente para animar números subindo
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

// Componente de Medidor Circular Animado
const ProgressCircle: React.FC<{ percent: number; color: string; emoji: string }> = ({ percent, color, emoji }) => {
  const [offset, setOffset] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => setOffset(100 - percent), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-100 dark:text-gray-700"
          strokeWidth="4"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="4"
          strokeDasharray={`${100 - offset}, 100`}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl">
        {emoji}
      </div>
    </div>
  );
};

// Pequeno efeito de confete visual
const ConfettiRain: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <div 
        key={i}
        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.2}s`,
          animationDuration: '2s'
        }}
      />
    ))}
  </div>
);

export const MerchantPerformanceDashboard: React.FC<MerchantPerformanceDashboardProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      {/* Header Fixo */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <button 
          onClick={onBack} 
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Minha Loja
          </h1>
          <p className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-widest mt-1">Como você está indo hoje</p>
        </div>
      </header>

      <main className="p-5 space-y-8">
        
        {/* 1. RESUMO RÁPIDO - FORMATOS VARIADOS */}
        <section className="space-y-4">
          {/* FORMATO PILL (CÁPSULA) */}
          <div className="bg-[#EBF2FF] dark:bg-blue-900/20 p-6 rounded-[3rem] border-2 border-white dark:border-gray-800 shadow-xl shadow-blue-500/5 flex items-center gap-6">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner shrink-0">
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                <AnimatedNumber value={1250} />
              </h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">Muita gente viu você 👀</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* FORMATO QUADRADO */}
            <div className="bg-[#F5F1FF] dark:bg-purple-900/20 p-6 rounded-[2.5rem] border-2 border-white dark:border-gray-800 flex flex-col items-center text-center shadow-md">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                <AnimatedNumber value={450} />
              </h3>
              <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mt-2">Visitas no perfil</p>
            </div>

            <div className="bg-[#E6FFFA] dark:bg-emerald-900/20 p-6 rounded-[2.5rem] border-2 border-white dark:border-gray-800 flex flex-col items-center text-center shadow-md">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                <AnimatedNumber value={85} />
              </h3>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-2">Chamaram você!</p>
            </div>
          </div>
        </section>

        {/* 2. TERMÔMETROS REDONDOS */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm border border-gray-50 dark:border-gray-800">
            <ProgressCircle percent={85} color="text-orange-500" emoji="🚀" />
            <h4 className="font-black text-gray-900 dark:text-white text-xs uppercase mt-3">Sua semana:</h4>
            <p className="text-orange-600 font-bold text-xs uppercase tracking-widest">Ótima!</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm border border-gray-50 dark:border-gray-800 relative">
            <ConfettiRain />
            <ProgressCircle percent={60} color="text-blue-500" emoji="🎉" />
            <h4 className="font-black text-gray-900 dark:text-white text-xs uppercase mt-3">Você cresceu!</h4>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-tighter">Mais gente te viu!</p>
          </div>
        </section>

        {/* 3. PIZZA - DE ONDE VEM */}
        <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center justify-center gap-2">
            <PieChart size={14} className="text-blue-500" /> Como te acharam
          </h3>
          <div className="flex flex-col items-center gap-6">
            <div className="w-40 h-40 rounded-full relative" style={{ background: 'conic-gradient(#1E5BFF 0% 45%, #F59E0B 45% 75%, #EC4899 75% 100%)' }}>
              <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Sparkles size={24} className="text-amber-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1E5BFF]"></div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">Página Inicial</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">Categorias</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EC4899]"></div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">Conversas</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BARRAS - DIAS MAIS FORTES */}
        <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-6">Seu melhor dia foi:</p>
          <div className="flex items-end justify-between h-40 gap-3">
            {[
              { d: 'Seg', h: '30%', c: 'bg-gray-100 dark:bg-gray-700' },
              { d: 'Ter', h: '45%', c: 'bg-gray-100 dark:bg-gray-700' },
              { d: 'Qua', h: '40%', c: 'bg-gray-100 dark:bg-gray-700' },
              { d: 'Qui', h: '55%', c: 'bg-gray-100 dark:bg-gray-700' },
              { d: 'Sex', h: '80%', c: 'bg-gray-100 dark:bg-gray-700' },
              { d: 'Sáb', h: '100%', c: 'bg-[#1E5BFF]', best: true },
              { d: 'Dom', h: '70%', c: 'bg-gray-100 dark:bg-gray-700' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className={`w-full rounded-t-2xl transition-all duration-1000 ease-out relative ${bar.c}`} style={{ height: bar.h }}>
                  {bar.best && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                      <Trophy size={16} fill="currentColor" />
                    </div>
                  )}
                </div>
                <span className={`text-[9px] font-black uppercase ${bar.best ? 'text-blue-600' : 'text-gray-400'}`}>{bar.d}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. SELO DE CONQUISTA - FORMATO BADGE */}
        <section className="flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center animate-in zoom-in duration-700">
            {/* O SELO (Clip-path para formato de medalha/selo) */}
            <div className="absolute inset-0 bg-yellow-400 dark:bg-yellow-600 shadow-xl" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
            <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center text-center p-4">
              <Flame size={32} className="text-orange-500 mb-1" />
              <p className="text-[9px] font-black text-gray-900 dark:text-white uppercase leading-tight">Loja em Alta!</p>
              <p className="text-[7px] font-bold text-gray-400 uppercase mt-1">Parabéns!</p>
            </div>
          </div>
        </section>

        {/* 6. LINHA DO TEMPO - FORMATO RETANGULAR LIMPO */}
        <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px] mb-8 text-center">O que aconteceu</h3>
          <div className="space-y-8 relative">
            <div className="absolute left-6 top-2 bottom-2 w-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
            {[
              { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50', text: 'Você ganhou uma nota 5! ⭐' },
              { icon: Send, color: 'text-blue-500 bg-blue-50', text: 'Seu post foi ao ar! 🚀' },
              { icon: Tag, color: 'text-amber-500 bg-amber-50', text: 'Alguém salvou seu desconto! 🎟️' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-sm border-2 border-white dark:border-gray-800`}>
                  <item.icon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="py-10 text-center opacity-20 grayscale">
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em]">Localizei JPA • v1.0</p>
        </div>

      </main>
    </div>
  );
};
