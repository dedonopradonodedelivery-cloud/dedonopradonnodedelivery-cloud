
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Megaphone, 
  CheckCircle2,
  CreditCard,
  Loader2,
  Info
} from 'lucide-react';
import { MandatoryVideoLock } from '@/components/MandatoryVideoLock';

interface StoreSponsoredAdsProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
}

export const StoreSponsoredAds: React.FC<StoreSponsoredAdsProps> = ({ onBack }) => {
    const [step, setStep] = useState<'selection' | 'payment' | 'success'>('selection');
    const [duration, setDuration] = useState(7);
    const [isProcessing, setIsProcessing] = useState(false);

    const PRICE_PER_DAY = 0.99;
    const totalPrice = duration * PRICE_PER_DAY;

    const handleActivate = () => {
        setStep('payment');
    };
    
    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
        }, 1500);
    };

    const handleHeaderBack = () => {
        if (step === 'payment') setStep('selection');
        else onBack();
    }

    return (
        <MandatoryVideoLock 
          videoUrl="https://videos.pexels.com/video-files/3129957/3129957-sd_540_960_30fps.mp4" 
          storageKey="store_sponsored"
        >
          <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
              {/* CABEÇALHO FIXO PERSISTENTE (STICKY HEADER) */}
              {step !== 'success' && (
                  <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-white/5 shrink-0">
                      <button onClick={handleHeaderBack} className="p-2.5 bg-slate-800 rounded-2xl hover:bg-slate-700 transition-colors">
                          <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <div>
                          <h1 className="font-bold text-lg leading-none">
                              {step === 'payment' ? 'Pagamento' : 'Destaque Patrocinado'}
                          </h1>
                          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-1">Impulsione sua visibilidade</p>
                      </div>
                  </header>
              )}
              
              <main className="flex-1 p-6 space-y-16 pb-64 overflow-y-auto no-scrollbar">
                  {step === 'selection' && (
                      <div className="flex-1 p-6 space-y-8 animate-in fade-in pb-32">
                          <section className="text-center">
                              <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/20 shadow-lg shadow-amber-900/10">
                                  <Megaphone className="w-10 h-10 text-amber-400" />
                              </div>
                              <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-3">Destaque Patrocinado</h2>
                              <p className="text-sm text-slate-400 max-sm mx-auto leading-relaxed">Sua empresa aparece como patrocinada antes das demais nas listas do app.</p>
                          </section>
                          
                          <section className="space-y-4">
                              <h3 className="text-sm font-bold text-slate-300 text-center">Escolha por quantos dias deseja ficar patrocinado</h3>
                              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                                  <div className="flex justify-between items-baseline mb-4">
                                      <span className="text-slate-400 font-medium">Duração selecionada:</span>
                                      <span className="text-3xl font-black text-white">{duration} dias</span>
                                  </div>
                                  <input type="range" min="7" max="30" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg accent-blue-500" />
                                  <div className="flex justify-between text-xs text-slate-500 mt-2"><span>7 dias</span><span>30 dias</span></div>
                              </div>
                              <div className="mt-4 text-center"><p className="text-xs text-slate-400">Custo: <span className="font-bold text-slate-200">R$ 0,99 por dia</span></p></div>
                          </section>

                          <footer className="fixed bottom-[80px] left-0 right-0 p-5 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-30 max-w-md mx-auto">
                              <div className="flex gap-3">
                                  <div className="flex-1 bg-slate-800 rounded-2xl flex flex-col items-center justify-center p-3 text-center border border-slate-700">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">Valor total</span>
                                      <span className="text-lg font-black text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                                  </div>
                                  <button onClick={handleActivate} className="flex-1 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">Ativar por {duration} dias <ArrowRight size={16} /></button>
                              </div>
                          </footer>
                      </div>
                  )}

                  {step === 'payment' && (
                      <div className="flex-1 p-6 flex flex-col justify-center animate-in fade-in duration-300">
                          <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 space-y-4">
                              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4"><span className="text-slate-400">Produto:</span><span className="font-bold text-white">Destaque Patrocinado</span></div>
                              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4"><span className="text-slate-400">Duração:</span><span className="font-bold text-white">{duration} dias</span></div>
                              <div className="flex justify-between items-center pt-2"><span className="text-slate-300 font-bold">Total:</span><span className="text-2xl font-black text-emerald-400">R$ {totalPrice.toFixed(2).replace('.', ',')}</span></div>
                          </div>
                          <button onClick={handlePay} disabled={isProcessing} className="w-full mt-8 bg-emerald-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">{isProcessing ? <Loader2 className="animate-spin" /> : 'Pagar agora'}</button>
                      </div>
                  )}

                  {isProcessing && (
                      <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                          <h2 className="text-xl font-bold text-white">Processando pagamento...</h2>
                      </div>
                  )}

                  {step === 'success' && (
                      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20">
                              <CheckCircle2 size={48} className="text-emerald-400" />
                          </div>
                          <h2 className="text-3xl font-bold text-white mb-3">Pagamento aprovado ✅</h2>
                          <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">Parabéns! Seu Destaque Patrocinado já está ativo por {duration} dias.</p>
                          <button onClick={onBack} className="w-full max-w-xs py-4 bg-white text-slate-900 font-black rounded-2xl shadow-2xl active:scale-95 transition-transform">Ok, entendi</button>
                      </div>
                  )}
              </main>
          </div>
        </MandatoryVideoLock>
    );
};
