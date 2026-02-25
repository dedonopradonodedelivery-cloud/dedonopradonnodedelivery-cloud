import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Wallet, Store, Coins, CheckCircle2, XCircle, HeartHandshake, ShoppingBag, ChevronLeft } from 'lucide-react';
import { CashbackIcon } from './CashbackIcon';

interface CashbackLandingViewProps {
  onLogin: () => void;
  onBack: () => void;
}

const MOCK_CASHBACK_STORES = [
  { id: '1', name: 'Mercadinho Boa Praça' },
  { id: '2', name: 'Burger da Esquina' },
  { id: '3', name: 'Studio Bella Mulher' },
  { id: '4', name: 'Tech Cell JPA' },
  { id: '5', name: 'Academia Corpo Ativo' },
];

export const CashbackLandingView: React.FC<CashbackLandingViewProps> = ({ onLogin, onBack }) => {
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
      
      {/* HERO */}
      <div className="absolute top-0 left-0 right-0 h-[55vh] bg-[#1E5BFF] rounded-b-[48px] z-0">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1E5BFF] to-transparent"></div>
      </div>

      <header className="relative z-10 px-5 pt-6 flex items-center justify-between">
        <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white/80 font-black uppercase tracking-[0.2em] text-[10px]">Ecossistema do Bairro</span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 relative z-10 flex flex-col items-center pt-6 px-6 overflow-y-auto pb-48 no-scrollbar">
        
        <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-3 font-display drop-shadow-sm tracking-tight leading-none">
                Cashback <br/><span className="text-white/80">do Bairro</span>
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                Ganhe dinheiro de volta comprando nas lojas da sua região.
            </p>
            <p className="text-blue-200 text-xs mt-4 max-w-xs mx-auto">
                Criamos um sistema onde algumas lojas do bairro devolvem parte do valor da sua compra para você usar novamente.
            </p>
        </div>
        
        {/* HOW IT WORKS */}
        <section className="w-full space-y-4 mb-10">
            <h3 className="text-center font-bold text-white text-lg">Como funciona</h3>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col items-center">
                    <ShoppingBag className="w-6 h-6 text-white mb-3" />
                    <h4 className="text-sm font-bold text-white leading-tight mb-1">Compre no bairro</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">Faça sua compra em uma loja participante.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col items-center">
                    <CheckCircle2 className="w-6 h-6 text-white mb-3" />
                    <h4 className="text-sm font-bold text-white leading-tight mb-1">A loja registra</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">O lojista registra sua compra no app.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col items-center">
                    <Coins className="w-6 h-6 text-white mb-3" />
                    <h4 className="text-sm font-bold text-white leading-tight mb-1">Receba cashback</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">Parte do valor volta para você.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col items-center">
                    <Wallet className="w-6 h-6 text-white mb-3" />
                    <h4 className="text-sm font-bold text-white leading-tight mb-1">Use novamente</h4>
                    <p className="text-[11px] text-blue-100 leading-snug">Use o saldo na mesma loja.</p>
                </div>
            </div>
        </section>

        {/* WHY IT EXISTS */}
        <section className="w-full bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/30 mb-10">
          <div className="flex items-start gap-4">
              <HeartHandshake className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
              <div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-200">Apoiamos o que é nosso</h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                      Este programa foi criado para beneficiar o morador e fortalecer o comércio local, fazendo o dinheiro circular aqui mesmo no bairro.
                  </p>
              </div>
          </div>
        </section>
        
        {/* PARTICIPATING STORES */}
        <section className="w-full mb-10">
          <h3 className="text-center font-bold text-gray-900 dark:text-white text-lg mb-4">Alguns parceiros</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
              {MOCK_CASHBACK_STORES.map(store => (
                  <div key={store.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{store.name}</span>
                  </div>
              ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4 font-bold uppercase tracking-widest">Novas lojas toda semana</p>
        </section>

        {/* OBJECTION HANDLING */}
        <section className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-center font-bold text-gray-900 dark:text-white text-lg mb-6">Simples e transparente</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-gray-600 dark:text-gray-400">Não é cartão de crédito</p></div>
                <div className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-gray-600 dark:text-gray-400">Não é pontos confusos</p></div>
                <div className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500" /><p className="text-sm text-gray-600 dark:text-gray-400">Não é desconto fake</p></div>
                <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /><p className="text-sm font-bold text-gray-800 dark:text-gray-200">Cashback de verdade</p></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /><p className="text-sm font-bold text-gray-800 dark:text-gray-200">Controlado pela própria loja</p></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /><p className="text-sm font-bold text-gray-800 dark:text-gray-200">Usado aqui no bairro</p></div>
            </div>
        </section>

      </div>

      {/* CTA FINAL */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 flex flex-col gap-3 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-400">Você já compra no bairro. Agora pode ganhar com isso.</p>
        <button 
            onClick={onLogin}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black text-sm uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            Entrar / Criar conta
            <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

    </div>
  );
};
