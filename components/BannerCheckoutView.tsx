import React, { useState } from 'react';
import { ChevronLeft, CreditCard, QrCode, Landmark, Loader2, ShieldCheck } from 'lucide-react';
import { BannerPlan } from '../types';
import { PROFESSIONAL_BANNER_PRICING } from '../constants';

interface BannerCheckoutViewProps {
  onBack: () => void;
  plan: BannerPlan;
  draft: any;
  onComplete: (paymentMethod: 'pix' | 'credit' | 'debit') => void;
}

const formatCurrency = (cents: number) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

export const BannerCheckoutView: React.FC<BannerCheckoutViewProps> = ({ onBack, plan, draft, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);

  const adPlacementCostCents = plan.priceCents;
  const isProfessionalServiceSelected = draft.type === 'professional_service';
  const professionalServiceCostCents = isProfessionalServiceSelected ? PROFESSIONAL_BANNER_PRICING.promoCents : 0;
  const totalGeralCents = adPlacementCostCents + professionalServiceCostCents;

  const handlePay = () => {
    setIsProcessing(true);
    // Simula processamento
    setTimeout(() => {
      onComplete(paymentMethod);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col animate-in fade-in duration-500">
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Checkout</h1>
          <p className="text-xs text-slate-500">Pagamento Seguro</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        <section className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Resumo do Pedido</h3>
          <div className="flex justify-between items-center text-sm">
            <span>Anúncio ({plan.placement})</span>
            <span className="font-bold">{formatCurrency(adPlacementCostCents)}</span>
          </div>
          {isProfessionalServiceSelected && (
            <div className="flex justify-between items-center text-sm text-emerald-400">
              <span>Criação de Arte Profissional</span>
              <span className="font-bold">{formatCurrency(professionalServiceCostCents)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-black text-blue-400">{formatCurrency(totalGeralCents)}</span>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Método de Pagamento</h3>
          <div className="grid gap-3">
            <button 
              onClick={() => setPaymentMethod('pix')}
              className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'pix' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}
            >
              <QrCode className="text-blue-400" />
              <span className="font-bold">PIX (Aprovação na hora)</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('credit')}
              className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'credit' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800'}`}
            >
              <CreditCard className="text-blue-400" />
              <span className="font-bold">Cartão de Crédito</span>
            </button>
          </div>
        </section>

        <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
          <ShieldCheck className="text-slate-500 shrink-0" />
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-relaxed">
            Seu pagamento é processado via SSL criptografado e não armazenamos dados sensíveis de cartão.
          </p>
        </div>
      </main>

      <footer className="p-6 bg-slate-900 border-t border-white/5">
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : 'CONFIRMAR PAGAMENTO'}
        </button>
      </footer>
    </div>
  );
};