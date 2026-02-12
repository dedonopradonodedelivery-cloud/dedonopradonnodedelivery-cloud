
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Gift, CheckCircle2, Lock, ArrowRight, Tag, Info, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { STORES } from '../constants';
import { Store } from '../types';

interface WeeklyPromoSelectionViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const WeeklyPromoSelectionView: React.FC<WeeklyPromoSelectionViewProps> = ({ onBack, onNavigate }) => {
  const [userChoice, setUserChoice] = useState<{ storeId: string; status: 'chosen' | 'redeemed' } | null>(null);
  
  // Lógica de Sequência Diária
  const consecutiveDays = parseInt(localStorage.getItem('consecutive_days_count') || '1');
  const isUnlocked = consecutiveDays >= 5;
  const progressPercent = (consecutiveDays / 5) * 100;

  const PARTICIPATING_STORES = useMemo(() => STORES.slice(0, 10).map((store, i) => ({
      ...store,
      discountType: i % 2 === 0 ? 'percentage' : 'fixed',
      discountValue: i % 2 === 0 ? 25 : 15,
      neighborhood: store.neighborhood || 'Freguesia'
  })), []);

  const handleChoose = (storeId: string) => {
    if (!isUnlocked) return;
    setUserChoice({ storeId, status: 'chosen' });
  };
  
  const handleRedeem = () => {
    if (userChoice) {
      setUserChoice({ ...userChoice, status: 'redeemed' });
      setTimeout(() => onNavigate('user_coupons'), 1500);
    }
  };

  const days = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col pb-32">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Cupom da Semana</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* 1. Explicação Completa */}
        <section className="p-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-[#1E5BFF]" />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">O bairro te premia</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Comece a semana resgatando seu cupom e acesse o app por <strong>5 dias consecutivos</strong> para garantir o uso nesta semana. 
                <br/><br/>
                Caso a sequência seja interrompida, o cupom só poderá ser usado na próxima semana. É a nossa forma de valorizar quem está sempre por aqui!
            </p>
        </section>

        {/* 2. Progresso Completo */}
        <section className="p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Sua Sequência Atual</h3>
                    <span className="text-[10px] font-bold text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{consecutiveDays}/5 Dias</span>
                </div>

                <div className="flex justify-between items-center mb-8 px-1">
                    {days.map(day => (
                        <div key={day} className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                day <= consecutiveDays 
                                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                                  : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                            }`}>
                                {day <= consecutiveDays ? <CheckCircle2 size={24} strokeWidth={3} /> : <Lock size={18} className="opacity-40" />}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${day <= consecutiveDays ? 'text-emerald-600' : 'text-gray-400'}`}>
                                Dia {day}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <Info size={14} className="text-[#1E5BFF] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-tight font-bold uppercase tracking-tight">
                      É necessário manter o acesso diário para desbloquear a recompensa.
                  </p>
                </div>
            </div>
        </section>

        {/* 3. Lista de Lojas Participantes */}
        <section className="px-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Tag size={16} className="text-gray-400" />
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lojas Ativas nesta semana</h3>
            </div>
            
            {!isUnlocked && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 mb-6">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
                  🔒 Você ainda não atingiu os 5 dias. Continue acessando para poder escolher uma loja e usar seu desconto!
                </p>
              </div>
            )}

            <div className="grid gap-4">
                {PARTICIPATING_STORES.map(store => {
                    const isSelected = userChoice?.storeId === store.id;
                    const isLockedByChoice = userChoice !== null && !isSelected;

                    return (
                        <div 
                          key={store.id} 
                          onClick={() => handleChoose(store.id)}
                          className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-4 active:scale-[0.98] ${
                            isSelected ? 'bg-blue-50 dark:bg-blue-900/30 border-[#1E5BFF] shadow-lg shadow-blue-500/10' : 
                            isLockedByChoice || !isUnlocked ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60' : 
                            'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200'
                          } ${isUnlocked && !userChoice ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600 shadow-inner">
                                <img src={store.logoUrl || store.image} className="w-full h-full object-contain p-2" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tight">{store.neighborhood}</p>
                                <div className="mt-2 text-[#0E8A3A] font-black text-base italic">
                                    {store.discountType === 'percentage' ? `Até ${store.discountValue}%` : `Até R$ ${store.discountValue}`}
                                    <span className="text-[9px] uppercase not-italic tracking-tighter opacity-70 ml-1">OFF</span>
                                </div>
                            </div>
                            
                            <div className="shrink-0">
                                {isSelected ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                                        <CheckCircle2 size={20} strokeWidth={3} />
                                    </div>
                                ) : !isUnlocked ? (
                                    <Lock size={16} className="text-gray-300" />
                                ) : !userChoice ? (
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1E5BFF]">
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>

        <div className="h-20"></div>
      </main>

      {/* 4. Ações Disponíveis (Footer dinâmico) */}
      {isUnlocked && (
        <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-30 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {!userChoice ? (
                <div className="text-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 animate-pulse">✨ Sequência Completa! Escolha uma loja acima.</p>
                </div>
            ) : userChoice.status === 'chosen' ? (
                <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
                    <p className="text-center text-[10px] text-gray-500 font-medium">Você selecionou <strong className="text-gray-900 dark:text-white uppercase">{PARTICIPATING_STORES.find(s => s.id === userChoice.storeId)?.name}</strong>.</p>
                    <button 
                        onClick={handleRedeem} 
                        className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        <Tag size={16} /> Resgatar Cupom Agora
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-3 py-4 text-emerald-600 animate-in zoom-in duration-300">
                    <CheckCircle2 size={24} strokeWidth={3} />
                    <p className="font-black text-sm uppercase tracking-widest">Cupom Gerado!</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};