import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Loader2, CreditCard, Lock, QrCode, Landmark } from 'lucide-react';

interface BannerProfessionalPaymentViewProps {
  onBack: () => void;
  onConfirmPayment: (method: 'pix' | 'credit' | 'debit') => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const BannerProfessionalPaymentView: React.FC<BannerProfessionalPaymentViewProps> = ({ onBack, onConfirmPayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('credit');

  const total = 59.90;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => onConfirmPayment(paymentMethod), 1500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border-2 border-green-500/20">
          <CheckCircle2 size={48} className="text-green-400" />
        </div>
        <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-3">
          Pagamento Aprovado!
        </h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Nossa equipe já foi notificada. Acompanhe o status e envie mensagens no seu painel.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center gap-4">
        <button onClick={onBack} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-xl active:scale-95">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-none">Pagar Banner Profissional</h1>
          <p className="text-xs text-slate-500">Serviço de Design</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <div className="bg-slate-800 rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-sm text-slate-300">Serviço</span>
              <span className="font-bold text-white text-sm">Criação de Banner Profissional</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-slate-300">Valor</span>
              <span className="font-black text-white">{formatCurrency(total)}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Forma de Pagamento</h3>
          <div className="space-y-3">
            <button onClick={() => setPaymentMethod('credit')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'credit' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'credit' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-sm">Cartão de Crédito</span>
            </button>
             <button onClick={() => setPaymentMethod('pix')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'pix' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                <QrCode className={`w-5 h-5 ${paymentMethod === 'pix' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-sm">PIX</span>
            </button>
             <button onClick={() => setPaymentMethod('debit')} className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'debit' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                <Landmark className={`w-5 h-5 ${paymentMethod === 'debit' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-sm">Cartão de Débito</span>
            </button>
          </div>
        </section>
      </main>

      <div className="p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent sticky bottom-0">
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Confirmar Pagamento - ${formatCurrency(total)}`}
        </button>
      </div>
    </div>
  );
};
