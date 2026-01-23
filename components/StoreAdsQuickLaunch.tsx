
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Megaphone, 
  CheckCircle2,
  CreditCard,
  Loader2,
  Info
} from 'lucide-react';

interface StoreAdsQuickLaunchProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

const DURATION_OPTIONS = [
    { days: 7, price: 6.93 },
    { days: 15, price: 13.90 },
    { days: 30, price: 27.90 },
];

export const StoreAdsQuickLaunch: React.FC<StoreAdsQuickLaunchProps> = ({ onBack }) => {
    const [step, setStep] = useState<'selection' | 'payment' | 'success'>('selection');
    const [selectedOption, setSelectedOption] = useState<(typeof DURATION_OPTIONS)[0] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelectOption = (option: (typeof DURATION_OPTIONS)[0]) => {
        setSelectedOption(option);
    };

    const handleActivate = () => {
        if (selectedOption) {
            setStep('payment');
        }
    };
    
    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 1500);
    };

    const handleSuccessClose = () => {
        onBack(); // Volta para o painel do lojista
    };

    const renderSelectionScreen = () => (
        <>
            <main className="flex-1 p-6 space-y-8 pb-40">
                <section className="text-center">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/20 shadow-lg shadow-amber-900/10">
                        <Megaphone className="w-10 h-10 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-3">Destaque Patrocinado</h2>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Sua empresa aparece como patrocinada antes das demais nas listas do app.
                    </p>
                </section>
                <section>
                    <div className="grid grid-cols-1 gap-4">
                        {DURATION_OPTIONS.map(option => (
                            <button
                                key={option.days}
                                onClick={() => handleSelectOption(option)}
                                className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between text-left group ${selectedOption?.days === option.days ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div>
                                    <h3 className="font-bold text-white text-lg">{option.days} DIAS</h3>
                                    <p className="text-xs text-slate-400 font-medium">de visibilidade extra</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-2xl text-white">R$ {option.price.toFixed(2).replace('.', ',')}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">R$ 0,99 / DIA</p>
                                </div>
                            </button>
                        ))}
                    </div>
                     {selectedOption && (
                        <p className="text-center text-sm font-bold text-emerald-400 mt-6 animate-in fade-in">
                            Duração escolhida: {selectedOption.days} dias
                        </p>
                    )}
                </section>
            </main>
            <footer className="fixed bottom-0 left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto">
                {selectedOption ? (
                    <div className="flex gap-3">
                        <div className="flex-1 bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-3 text-center border border-slate-700">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Comprar {selectedOption.days} dias</span>
                            <span className="text-lg font-black text-white">R$ {selectedOption.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button
                            onClick={handleActivate}
                            className="flex-1 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                        >
                            Ativar agora <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <p className="text-sm font-bold text-slate-500">Selecione a duração para continuar.</p>
                    </div>
                )}
            </footer>
        </>
    );

    const renderPaymentScreen = () => (
         <main className="flex-1 p-6 flex flex-col justify-center animate-in fade-in duration-300">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Pagamento</h2>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4">
                 <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                    <span className="text-slate-400">Produto:</span>
                    <span className="font-bold text-white">Destaque Patrocinado</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                    <span className="text-slate-400">Duração:</span>
                    <span className="font-bold text-white">{selectedOption?.days} dias</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-300 font-bold">Total:</span>
                    <span className="text-2xl font-black text-emerald-400">R$ {selectedOption?.price.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>

            <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full mt-8 bg-emerald-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Pagar agora'}
            </button>
         </main>
    );

    const renderSuccessScreen = () => (
        <main className="flex-1 p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20">
                <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Pagamento aprovado ✅</h2>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                Parabéns pela escolha de se destacar! Seu Destaque Patrocinado já está ativo e sua empresa vai aparecer como patrocinada nas listas do app.
            </p>
            <div className="bg-slate-800/50 rounded-2xl p-4 text-center border border-white/10 mb-10 w-full max-w-xs">
                <p className="text-slate-400 text-xs">Duração:</p>
                <p className="text-white font-bold">{selectedOption?.days} dias</p>
            </div>
            <button onClick={handleSuccessClose} className="w-full max-w-xs py-4 bg-white text-slate-900 font-black rounded-2xl shadow-2xl active:scale-95 transition-transform">
                Ok, entendi
            </button>
        </main>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
            {step !== 'success' && (
                <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-white/5 shrink-0">
                    <button onClick={step === 'selection' ? onBack : () => setStep('selection')} className="p-2.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                </header>
            )}
            
            {step === 'selection' && renderSelectionScreen()}
            {step === 'payment' && renderPaymentScreen()}
            {step === 'success' && renderSuccessScreen()}
        </div>
    );
};
