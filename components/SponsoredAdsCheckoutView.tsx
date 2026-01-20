import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Loader2, CreditCard, Lock, Calendar, DollarSign, Rocket } from 'lucide-react';
import { SponsoredPlan } from '../types';

interface SponsoredAdsCheckoutViewProps {
  onBack: () => void;
  plan: SponsoredPlan;
  onConfirmPayment: () => void;
}

const formatCurrency = (total: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total);

export const SponsoredAdsCheckoutView: React.FC<SponsoredAdsCheckoutViewProps> = ({ onBack, plan, onConfirmPayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPayment();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Finalizar e Pagar</h1>
          <p className="text-xs text-slate-500">Última etapa</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Rocket size={14}/> Resumo do Patrocínio</h3>
          <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-sm text-slate-300 flex items-center gap-2"><Calendar size={14}/> Duração</span>
              <span className="font-bold text-white text-sm">{plan.days} dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Preço por dia</span>
              <span className="font-bold text-white text-sm">{formatCurrency(plan.pricePerDay)}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Pagamento</h3>
          <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <CreditCard size={20} />
              </div>
              <p className="font-bold text-white">Cartão de Crédito</p>
            </div>
            
            <div className="space-y-4">
              <input placeholder="Número do Cartão" className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Validade (MM/AA)" className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500" />
                <input placeholder="CVC" className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500" />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-500">
              <Lock size={12} />
              <span>Pagamento seguro via Stripe</span>
            </div>
          </div>
        </section>
      </main>

      <div className="p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent sticky bottom-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400">Total a pagar:</span>
          <span className="text-2xl font-black text-white">{formatCurrency(plan.total)}</span>
        </div>
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pagar ${formatCurrency(plan.total)}`}
        </button>
      </div>
    </div>
  );
};
