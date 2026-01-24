
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Gift, ArrowRight, CheckCircle2, Tag, Info, Star, MapPin } from 'lucide-react';
import { STORES } from '../constants';
import { Store } from '../types';

interface WeeklyRewardPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const WeeklyRewardPage: React.FC<WeeklyRewardPageProps> = ({ onBack, onNavigate }) => {
  const [savedLojista, setSavedLojista] = useState<string | null>(null);
  
  const consecutiveDays = parseInt(localStorage.getItem('reward_consecutive_days') || '1');

  // Lojas participantes mockadas da base real
  const participatingStores = useMemo(() => STORES.slice(0, 8), []);

  const handleSaveBenefit = (store: Store) => {
    setSavedLojista(store.id);
    
    // Salvar no "Meus Cupons" (localStorage para persistência do MVP)
    const existing = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
    const newCoupon = {
      id: `CUP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      storeId: store.id,
      storeName: store.name,
      category: store.category,
      redeemedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      status: 'available'
    };
    
    localStorage.setItem('user_saved_coupons', JSON.stringify([...existing, newCoupon]));
    
    setTimeout(() => {
      onNavigate('user_coupons');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Dia {consecutiveDays} Liberado 🎉</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        
        {/* Progresso Visual na Página */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Seu progresso da semana</h2>
            <div className="flex justify-between items-center w-full max-w-[240px]">
                {[1, 2, 3, 4, 5].map((d) => (
                    <div key={d} className={`w-3 h-3 rounded-full ${d <= consecutiveDays ? 'bg-[#1E5BFF]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                ))}
            </div>
            <p className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-[0.2em] mt-4">Escolha uma loja participante abaixo</p>
        </div>

        {/* Lista de Lojas */}
        <div className="grid grid-cols-1 gap-4">
            {participatingStores.map((store) => (
                <div 
                  key={store.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 transition-all"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600 shadow-inner">
                        <img src={store.logoUrl || store.image} className="w-full h-full object-contain p-2" alt={store.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tight">{store.category}</p>
                    </div>
                    <button 
                      onClick={() => handleSaveBenefit(store)}
                      disabled={savedLojista !== null}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        savedLojista === store.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-indigo-50 dark:bg-blue-900/20 text-[#1E5BFF] hover:bg-[#1E5BFF] hover:text-white'
                      }`}
                    >
                        {savedLojista === store.id ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} /> Salvo
                          </div>
                        ) : 'Ver benefício'}
                    </button>
                </div>
            ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex gap-3">
                <Info className="w-5 h-5 text-[#1E5BFF] shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Todo benefício liberado fica guardado automaticamente em <strong className="text-[#1E5BFF]">Meus Cupons</strong>. Você não precisa usá-lo agora.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};
