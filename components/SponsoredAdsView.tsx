import React, { useState, useMemo } from 'react';
import { ChevronLeft, ArrowRight, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface SponsoredAdsViewProps {
  onBack: () => void;
  onProceedToPayment: (days: number, total: number) => void;
}

const MIN_DAYS = 15;
const MAX_DAYS = 180;
const PRICE_PER_DAY = 0.99;

export const SponsoredAdsView: React.FC<SponsoredAdsViewProps> = ({ onBack, onProceedToPayment }) => {
  const [days, setDays] = useState(MIN_DAYS);
  const total = useMemo(() => days * PRICE_PER_DAY, [days]);
  const formattedTotal = useMemo(() => new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(total), [total]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(parseInt(e.target.value, 10));
  };

  const sliderPercentage = ((days - MIN_DAYS) / (MAX_DAYS - MIN_DAYS)) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">ADS / Patrocinados</h1>
          <p className="text-xs text-slate-500">Configure seu destaque</p>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col p-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-2">
            Apareça em destaque
          </h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Escolha por quantos dias você quer que sua loja seja patrocinada no topo das buscas.
          </p>
        </div>

        <div className="bg-slate-800 rounded-[2rem] p-6 border border-white/10 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-center mb-10 bg-slate-700/50 p-3 rounded-xl w-fit mx-auto border border-white/10">
                <span className="text-xl font-black text-amber-300">R$ 0,99</span>
                <span className="text-xs text-slate-400 font-medium"> / dia</span>
            </div>

            <div className="relative mb-4">
                <div 
                    className="absolute -top-8 text-center transition-all duration-100 ease-out" 
                    style={{ left: `calc(${sliderPercentage}% - ${sliderPercentage/100 * 48}px)`, width: '48px' }}
                >
                    <div className="bg-slate-700 text-white font-bold text-xs py-1 px-2 rounded-md shadow-lg">{days}</div>
                    <div className="w-2 h-2 bg-slate-700 transform rotate-45 mx-auto -mt-1"></div>
                </div>
              <input 
                type="range"
                min={MIN_DAYS}
                max={MAX_DAYS}
                step={1}
                value={days}
                onChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 font-bold mt-2">
                  <span>{MIN_DAYS} dias</span>
                  <span>{MAX_DAYS} dias</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-8 border-t border-white/10 mt-8">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Calendar size={14}/> Duração</span>
                <span className="font-bold text-white">{days} dias</span>
            </div>
             <div className="flex justify-between items-center text-lg">
                <span className="text-slate-400 flex items-center gap-2 text-sm"><DollarSign size={14}/> Total</span>
                <span className="font-black text-amber-300">{formattedTotal}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent sticky bottom-0 z-30">
        <button 
          onClick={() => onProceedToPayment(days, total)}
          className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
            <span>Pagar e ativar por {days} dias — {formattedTotal}</span>
            <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
