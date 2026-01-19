
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, ArrowRight, Wallet, Store, Coins, CheckCircle2 } from 'lucide-react';
import { CashbackIcon } from './CashbackIcon';

interface CashbackLandingViewProps {
  onBack: () => void;
  onLogin: () => void;
}

interface CashbackStoreMock {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  status: string;
  cashback: string;
}

const MOCK_CASHBACK_STORES: CashbackStoreMock[] = [
  { id: '1', name: 'Hamburgueria Brasa', category: 'Alimentação', neighborhood: 'Freguesia', status: 'Cashback ativo', cashback: '5%' },
  { id: '2', name: 'Pet Shop Alegria', category: 'Pets', neighborhood: 'Taquara', status: 'Cashback ativo', cashback: '8%' },
  { id: '3', name: 'Farmácia Central', category: 'Saúde', neighborhood: 'Anil', status: 'Cashback ativo', cashback: '3%' },
  { id: '4', name: 'Studio Hair Vip', category: 'Beleza', neighborhood: 'Pechincha', status: 'Cashback ativo', cashback: '10%' },
  { id: '5', name: 'Padaria Estrela', category: 'Alimentação', neighborhood: 'Tanque', status: 'Cashback ativo', cashback: '5%' },
];

export const CashbackLandingView: React.FC<CashbackLandingViewProps> = ({ onBack, onLogin }) => {
  const [fakeBalance, setFakeBalance] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFakeBalance(prev => {
        if (prev >= 148.90) {
            clearInterval(interval);
            return 148.90;
        }
        return prev + 2.45;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
      
      {/* Hero Background */}
      <div className="absolute top-0 left-0 right-0 h-[55vh] bg-[#1E5BFF] rounded-b-[48px] z-0">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1E5BFF] to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-6 flex items-center justify-between">
        <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px]">Ecossistema do Bairro</span>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center pt-6 px-6 overflow-y-auto pb-48 no-scrollbar">
        
        <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 mb-4 shadow-sm">
                <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Exclusivo Jacarepaguá</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3 font-display drop-shadow-sm tracking-tight leading-none">
                CASHBACK <br/><span className="text-white/80">LOCALIZEI</span>
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                Transforme suas compras no bairro em saldo para usar como quiser.
            </p>
        </div>

        {/* Balance Visualizer Card */}
        <div className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-2xl shadow-blue-900/20 border border-white/50 dark:border-gray-700 mb-10 transform hover:scale-105 transition-transform duration-500 relative z-20 overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                <CashbackIcon className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]">
                        <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Saldo Acumulado</span>
                </div>
            </div>
            <div className="text-center py-2 relative z-10">
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                    R$ {fakeBalance.toFixed(2).replace('.', ',')}
                </span>
            </div>
            <div className="mt-6 h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-gradient-to-r from-blue-400 to-[#1E5BFF] w-[70%] rounded-full animate-pulse"></div>
            </div>
        </div>

        {/* List of Partner Stores */}
        <div className="w-full space-y-4 mb-8">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-gray-900 dark:text-white text-lg uppercase tracking-tight">Onde ganhar hoje</h3>
                <span className="text-[10px] font-black text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg uppercase tracking-widest">
                    Parceiros Ativos
                </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                {MOCK_CASHBACK_STORES.map((store, idx) => (
                    <div 
                        key={store.id} 
                        className={`p-5 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${idx !== MOCK_CASHBACK_STORES.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{store.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                    {store.category} • {store.neighborhood}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                    {store.cashback} de volta
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] pt-2">
                + de 50 lojas participando no bairro
            </p>
        </div>

      </div>

      {/* Fixed Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 flex flex-col gap-3 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
            onClick={onLogin}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            Criar conta e ganhar agora
            <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
        
        <button 
            onClick={onLogin}
            className="w-full py-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
            Já sou cadastrado
        </button>
      </div>

    </div>
  );
};
