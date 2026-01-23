
import React, { useState } from 'react';
import { ChevronLeft, Zap, ArrowRight, CheckCircle2, Megaphone } from 'lucide-react';

interface StoreAdsQuickLaunchProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const StoreAdsQuickLaunch: React.FC<StoreAdsQuickLaunchProps> = ({ onBack }) => {
  const [step, setStep] = useState<'intro' | 'payment' | 'success'>('intro');

  const handleHeaderBack = () => {
     if (step === 'intro') onBack();
     else setStep('intro');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
       {step !== 'success' && (
            <header className="sticky top-0 z-50 bg-slate-950 px-5 h-16 flex items-center gap-4 border-b border-white/5 shrink-0 shadow-lg">
                <button onClick={handleHeaderBack} className="p-2.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                    <h1 className="font-bold text-lg leading-none">
                        {step === 'payment' ? 'Pagamento' : 'Destaque Rápido'}
                    </h1>
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Impulsione sua visibilidade</p>
                </div>
            </header>
        )}

        {step === 'intro' && (
            <main className="flex-1 p-6 pb-24">
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                        <Zap className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Impulso Instantâneo</h2>
                    <p className="text-slate-400 text-sm">Coloque sua loja no topo da lista da sua categoria por 24 horas.</p>
                </div>

                <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-300 font-bold">Duração</span>
                        <span className="text-white font-bold">24 Horas</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-300 font-bold">Alcance Estimado</span>
                        <span className="text-white font-bold">~1.200 pessoas</span>
                    </div>
                    <div className="border-t border-white/5 my-4"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-black text-lg">Investimento</span>
                        <span className="text-[#1E5BFF] font-black text-2xl">R$ 19,90</span>
                    </div>
                </div>

                <button 
                    onClick={() => setStep('payment')}
                    className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    Ativar Agora <ArrowRight size={18} />
                </button>
            </main>
        )}

        {step === 'payment' && (
            <main className="flex-1 p-6 flex flex-col justify-center">
                <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 mb-8 text-center">
                    <Megaphone className="w-10 h-10 text-white mx-auto mb-4" />
                    <p className="text-slate-400 text-sm mb-6">Confirmar impulsionamento de 24h para sua loja.</p>
                    <p className="text-3xl font-black text-white">R$ 19,90</p>
                </div>
                <button 
                    onClick={() => setStep('success')}
                    className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                    Pagar com PIX
                </button>
            </main>
        )}

        {step === 'success' && (
            <main className="flex-1 p-6 flex flex-col items-center justify-center text-center animate-in zoom-in">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/40">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Tudo Pronto!</h2>
                <p className="text-slate-400 text-sm mb-8">Sua loja já está em destaque na categoria.</p>
                <button 
                    onClick={onBack}
                    className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl"
                >
                    Voltar ao Painel
                </button>
            </main>
        )}
    </div>
  );
};
