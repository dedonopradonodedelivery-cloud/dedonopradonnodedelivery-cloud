
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Gift, CheckCircle2, Lock, ArrowRight, Tag, Info, Calendar, Sparkles,
  Utensils, Pizza, Coffee, Shirt, CarFront, Wrench, PawPrint, ShoppingCart, Home as HomeIcon // Ícones para filtros
} from 'lucide-react';
import { STORES } from '@/constants';
import { Store, AdType } from '@/types';
import confetti from 'canvas-confetti'; // Usaremos um mock para confetti se não houver lib externa.

// Mock para confetti se não houver biblioteca externa
declare const window: Window & {
  confetti?: (options: { particleCount: number; spread: number; origin: { x: number; y: number } }) => void;
};
if (typeof window !== 'undefined' && !window.confetti) {
  window.confetti = (options) => {
    console.log('Confetti animation (mocked)', options);
    // Adicionar um feedback visual simples ou remover em ambiente de produção
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = `${options.origin.x * 100}vw`;
    el.style.top = `${options.origin.y * 100}vh`;
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.background = `radial-gradient(circle at center, yellow, orange, transparent)`;
    el.style.borderRadius = '50%';
    el.style.opacity = '0.7';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '99999';
    el.style.animation = 'fadeoutzoom 1s forwards';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeoutzoom { from { transform: scale(1); opacity: 0.7; } to { transform: scale(3); opacity: 0; } }`;
    document.head.appendChild(style);
  };
}


interface WeeklyRewardViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  // user: User | null; // Adicionar se precisar de dados do user para cupons
}

const PARTICIPATING_STORES = STORES.slice(0, 10).map((store, i) => ({
    ...store,
    discountType: i % 2 === 0 ? 'percentage' : 'fixed',
    discountValue: i % 2 === 0 ? 25 : 15,
    neighborhood: store.neighborhood || 'Freguesia'
}));

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Comida': Utensils,
  'Beleza': Sparkles,
  'Serviços': Wrench,
  'Pets': PawPrint,
  'Moda': Shirt,
  'Autos': CarFront,
  'Mercado': ShoppingCart,
  'Casa': HomeIcon,
};

export const WeeklyRewardView: React.FC<WeeklyRewardViewProps> = ({ onBack, onNavigate }) => {
  const [userChoice, setUserChoice] = useState<{ storeId: string; status: 'chosen' | 'redeemed' } | null>(null);
  const [hasPlayedAnimation, setHasPlayedAnimation] = useState(false);
  
  // Lógica de Sequência Diária
  const consecutiveDays = parseInt(localStorage.getItem('consecutive_days_count') || '1');
  const dailyClaimedFlag = `daily_claimed_${new Date().toISOString().split('T')[0]}`; // Ex: daily_claimed_2023-11-20

  const days = [1, 2, 3, 4, 5];
  const isWeekComplete = consecutiveDays >= 5;

  // --- Efeitos de Celebração ---
  useEffect(() => {
    // A animação só deve tocar na primeira visita do dia e se o dia foi realmente liberado
    if (!localStorage.getItem(dailyClaimedFlag) || hasPlayedAnimation) return;

    let particleCount = 0;
    let spread = 0;

    switch (consecutiveDays) {
      case 1:
        particleCount = 50;
        spread = 70;
        break;
      case 2:
      case 3:
      case 4:
        particleCount = 100;
        spread = 90;
        break;
      case 5: // Semana Concluída!
        particleCount = 200;
        spread = 120;
        break;
      default:
        return;
    }

    if (window.confetti) {
      window.confetti({
        particleCount,
        spread,
        origin: { x: 0.5, y: 0.8 },
      });
    }

    setHasPlayedAnimation(true);
  }, [consecutiveDays, dailyClaimedFlag, hasPlayedAnimation]);


  const handleChoose = (storeId: string) => {
    setUserChoice({ storeId, status: 'chosen' });
    // Navega para a tela do cupom do usuário
    onNavigate('user_coupons');
  };
  
  const getHeaderTitle = () => {
    if (isWeekComplete) return 'Semana Concluída!';
    return 'Recompensa da Semana';
  };

  const getHeaderSubtitle = () => {
    if (isWeekComplete) return 'Você desbloqueou todos os benefícios.';
    return `Dia ${consecutiveDays} liberado!`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-24 flex flex-col justify-end gap-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">{getHeaderTitle()}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{getHeaderSubtitle()}</p>
          </div>
        </div>
        
        {/* Barra de Progresso Visual */}
        <div className="flex justify-between items-center mt-4 mb-2 px-1">
            {days.map(day => (
                <div key={day} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        day <= consecutiveDays 
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' 
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                    }`}>
                        {day <= consecutiveDays ? <CheckCircle2 size={16} strokeWidth={3} /> : <Lock size={12} className="opacity-40" />}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${day <= consecutiveDays ? 'text-emerald-600' : 'text-gray-400'}`}>
                        Dia {day}
                    </span>
                </div>
            ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-start gap-4">
            <Info size={16} className="text-[#1E5BFF] shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                {isWeekComplete 
                    ? 'Você concluiu a sequência desta semana. Aproveite seus benefícios e volte na próxima semana para novos cupons!'
                    : 'Escolha uma loja abaixo para aplicar o seu benefício diário.'
                }
            </p>
        </div>

        {/* Lista de Lojas Participantes */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Gift size={16} className="text-gray-400" />
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lojas Participantes</h3>
            </div>
            
            <div className="grid gap-4">
                {PARTICIPATING_STORES.map(store => {
                    const isSelected = userChoice?.storeId === store.id;

                    return (
                        <div 
                          key={store.id} 
                          onClick={() => handleChoose(store.id)}
                          className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 active:scale-[0.98] cursor-pointer
                            ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 border-[#1E5BFF] shadow-lg shadow-blue-500/10' : 
                            'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200'
                          }`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600 shadow-inner">
                                <img src={store.logoUrl || store.image} className="w-full h-full object-contain p-2" alt={store.name} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                                    {store.category && (
                                        <>
                                            {React.createElement(CATEGORY_ICONS[store.category] || Tag, { size: 10, className: 'text-gray-400' })}
                                            {store.category}
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                        </>
                                    )}
                                    {store.neighborhood}
                                </p>
                                <div className="mt-2 flex items-center gap-1 text-[#0E8A3A] font-black text-base italic">
                                    {store.discountType === 'percentage' ? `Até ${store.discountValue}%` : `Até R$ ${store.discountValue}`}
                                    <span className="text-[9px] uppercase not-italic tracking-tighter opacity-70 ml-1">OFF</span>
                                </div>
                            </div>
                            
                            <div className="shrink-0">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1E5BFF]">
                                    <ArrowRight size={18} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
      </main>
    </div>
  );
};
    