
import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Crown, ArrowRight, ShieldCheck, Star } from 'lucide-react';

interface PatrocinadorMasterScreenProps {
  onBack: () => void;
}

export const PatrocinadorMasterScreen: React.FC<PatrocinadorMasterScreenProps> = ({ onBack }) => {
  const [step, setStep] = useState<'intro' | 'payment' | 'success'>('intro');

  const handleHeaderBack = () => {
    if (step === 'intro') onBack();
    else setStep('intro');
  };

  const getPageTitle = () => {
    if (step === 'intro') return 'Patrocinador Master';
    if (step === 'payment') return 'Finalizar Contratação';
    return 'Sucesso';
  };

  const handleSubscribe = () => {
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/40">
            <Crown className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Bem-vindo ao Clube!</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-xs">
            Você agora é um Patrocinador Master. Sua marca terá destaque máximo em todo o aplicativo.
          </p>
          <button onClick={onBack} className="bg-amber-500 text-slate-950 font-black px-8 py-4 rounded-2xl">
            Voltar ao Painel
          </button>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-950 px-5 h-16 flex items-center gap-4 border-b border-white/5 shrink-0 shadow-lg">
        <button 
            onClick={handleHeaderBack}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-slate-300 transition-colors"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
            <h1 className="font-bold text-white text-lg leading-tight">
                {getPageTitle()}
            </h1>
            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Máxima Visibilidade
            </p>
        </div>
      </header>

      {step === 'intro' && (
        <main className="flex-1 p-6 pb-32 overflow-y-auto no-scrollbar">
            {/* Hero Section */}
            <div className="text-center mb-10 mt-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-amber-500/20 rotate-3">
                    <Crown className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                    Domine o Bairro <br/><span className="text-amber-500">com exclusividade</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    O plano mais completo para quem quer ser a referência do seu segmento em Jacarepaguá.
                </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-10">
                <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><ShieldCheck size={20} /></div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Selo de Verificação Dourado</h3>
                        <p className="text-xs text-slate-500 mt-1">Sua marca com destaque visual exclusivo em todas as listas.</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Star size={20} /></div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Topo das Buscas</h3>
                        <p className="text-xs text-slate-500 mt-1">Apareça sempre em 1º lugar quando buscarem sua categoria.</p>
                    </div>
                </div>
                 <div className="bg-slate-900 border border-white/5 p-5 rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Crown size={20} /></div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Banner na Home Grátis</h3>
                        <p className="text-xs text-slate-500 mt-1">Direito a 1 semana de banner na página inicial todo mês.</p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl text-center shadow-xl mb-6 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-amber-100 font-bold uppercase tracking-widest text-xs mb-2">Investimento</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xl font-medium text-amber-100">R$</span>
                        <span className="text-5xl font-black text-white">199</span>
                        <span className="text-xl font-medium text-amber-100">/mês</span>
                    </div>
                    <p className="text-xs text-amber-100 mt-4 opacity-80">Cancele quando quiser.</p>
                </div>
            </div>

            <button onClick={handleSubscribe} className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl shadow-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                Quero ser Master <ArrowRight size={16} />
            </button>
        </main>
      )}

      {step === 'payment' && (
        <main className="flex-1 p-6 flex flex-col justify-center">
            <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 mb-8">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Resumo do Pedido</p>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">Plano Master Mensal</span>
                    <span className="text-white font-bold">R$ 199,00</span>
                </div>
                <div className="border-t border-white/5 my-4"></div>
                <div className="flex justify-between items-center text-lg">
                    <span className="text-white font-black">Total</span>
                    <span className="text-amber-500 font-black">R$ 199,00</span>
                </div>
            </div>
            
            <button onClick={handleConfirmPayment} className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                Confirmar Pagamento (Simulação)
            </button>
        </main>
      )}
    </div>
  );
};
