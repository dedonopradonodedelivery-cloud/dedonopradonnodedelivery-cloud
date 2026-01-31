import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Gift, ArrowRight, CheckCircle2, Tag, Info, Star, MapPin, Loader2, Lock } from 'lucide-react';
import { STORES } from '../constants';
import { Store } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface WeeklyRewardPageProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const WeeklyRewardPage: React.FC<WeeklyRewardPageProps> = ({ onBack, onNavigate }) => {
  const { user, loading: authLoading } = useAuth();
  const [savedLojista, setSavedLojista] = useState<string | null>(null);
  
  // Guard de Autenticação: Se não estiver logado e terminou de carregar o auth, volta para home
  useEffect(() => {
    if (!authLoading && !user) {
      onBack();
    }
  }, [user, authLoading, onBack]);

  const consecutiveDays = parseInt(localStorage.getItem('reward_consecutive_days') || '1');

  // Lojas participantes mockadas da base real
  const participatingStores = useMemo(() => STORES.slice(0, 8), []);

  const handleSaveBenefit = (store: Store) => {
    if (savedLojista || !user) return;

    setSavedLojista(store.id);
    
    // Salvar no "Meus Cupons" (localStorage para persistência do MVP)
    const existing = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
    const newCoupon = {
      id: `CUP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      storeId: store.id,
      storeName: store.name,
      category: store.category,
      neighborhood: store.neighborhood || 'Freguesia',
      redeemedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      status: 'available',
      discount: '20% OFF' // Exemplo padrão
    };
    
    localStorage.setItem('user_saved_coupons', JSON.stringify([...existing, newCoupon]));
    
    // Avançar o dia no progresso da home
    if (consecutiveDays < 5) {
      localStorage.setItem('reward_consecutive_days', (consecutiveDays + 1).toString());
    }

    setTimeout(() => {
      onNavigate('user_coupons');
    }, 1500);
  };

  // Enquanto carrega a sessão, mostra um loader clean
  if (authLoading) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Verificando acesso...</p>
        </div>
    );
  }

  // Se não houver usuário (redundância de segurança pro render)
  if (!user) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login necessário</h2>
            <p className="text-sm text-gray-500 mb-8">Você precisa estar logado para acessar seus benefícios semanais.</p>
            <button onClick={onBack} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl">Voltar ao início</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Retirar Cupom - Dia {consecutiveDays}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
                <h2 className="text-xl font-black mb-1">Escolha seu benefício</h2>
                <p className="text-blue-100 text-sm opacity-90 leading-tight">Selecione uma das lojas abaixo para garantir seu desconto exclusivo de hoje.</p>
            </div>
        </div>

        {/* Lista de Lojas */}
        <div className="grid grid-cols-1 gap-4">
            {participatingStores.map((store) => (
                <div 
                  key={store.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600 shadow-inner flex items-center justify-center">
                        <img src={store.logoUrl || store.image} className="w-full h-full object-contain p-2" alt={store.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                        <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <MapPin size={10} /> {store.neighborhood}
                            </span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                                <Tag size={10} /> {store.category}
                            </span>
                        </div>
                        <div className="mt-2 text-[#0E8A3A] font-black text-sm italic bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-lg w-fit border border-green-100 dark:border-green-800">
                            20% OFF
                        </div>
                    </div>
                    <button 
                      onClick={() => handleSaveBenefit(store)}
                      disabled={savedLojista !== null}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        savedLojista === store.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                      } disabled:opacity-50`}
                    >
                        {savedLojista === store.id ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} /> Retirado
                          </div>
                        ) : 'Retirar'}
                    </button>
                </div>
            ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border border-amber-100 dark:border-amber-800/30 flex gap-4">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                Todo cupom retirado fica guardado automaticamente em <strong>Menu &gt; Meus Cupons</strong>. Você tem 30 dias para utilizar no estabelecimento.
            </p>
        </div>
      </main>
    </div>
  );
};