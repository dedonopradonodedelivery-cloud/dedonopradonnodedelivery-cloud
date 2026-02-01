
import React, { useState } from 'react';
import { ChevronLeft, Check, Crown, Zap, Building2, Star, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { PlanType } from '../types';

interface PlanSelectionViewProps {
  onBack: () => void;
  onSuccess: (plan: PlanType) => void;
}

const PLAN_DATA = [
    {
        id: 'professional',
        name: 'Profissional Local',
        price: '49,90',
        icon: Zap,
        color: 'bg-blue-600',
        features: [
            'Até 10 anúncios ativos',
            '2 anúncios em destaque rotativos',
            'Prioridade nas buscas do bairro',
            'Painel profissional completo',
            'Renovação automática'
        ]
    },
    {
        id: 'enterprise',
        name: 'Empresa Bairro',
        price: '99,90',
        icon: Building2,
        color: 'bg-indigo-600',
        popular: true,
        features: [
            'Até 30 anúncios ativos',
            'Destaques contínuos (Mini Banners)',
            'Selo Empresa Verificada',
            'Estatísticas de visualização',
            'Suporte prioritário'
        ]
    },
    {
        id: 'master',
        name: 'Master Imobiliário',
        price: '199,90',
        icon: Crown,
        color: 'bg-slate-900',
        features: [
            'Anúncios ilimitados',
            'Destaque fixo em Comerciais',
            'Presença em "Destaques do Bairro"',
            'Mini-banner fixo na rolagem',
            'Selo Destaque do Bairro',
            'Atendimento prioritário VIP'
        ]
    }
];

export const PlanSelectionView: React.FC<PlanSelectionViewProps> = ({ onBack, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [step, setStep] = useState<'selection' | 'checkout' | 'success'>('selection');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (id: string) => {
    setSelectedPlan(id);
    setStep('checkout');
  };

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
    }, 2000);
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600">
                  <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Plano Ativado!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-12">Seu acesso profissional já está liberado. Agora você pode criar anúncios sem limites e destacar sua marca.</p>
              <button 
                onClick={() => onSuccess(selectedPlan as PlanType)}
                className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-xs"
              >
                  Acessar meu painel
              </button>
          </div>
      );
  }

  if (step === 'checkout') {
      const plan = PLAN_DATA.find(p => p.id === selectedPlan);
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
              <header className="px-5 h-16 flex items-center gap-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => setStep('selection')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft className="w-6 h-6 dark:text-white"/></button>
                <h1 className="font-bold text-lg dark:text-white">Pagamento do Plano</h1>
              </header>
              
              <main className="flex-1 p-6 space-y-8">
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Plano Selecionado</p>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{plan?.name}</h2>
                      <div className="flex items-baseline justify-center gap-1 mt-4">
                          <span className="text-sm font-bold text-gray-400">R$</span>
                          <span className="text-4xl font-black text-[#1E5BFF]">{plan?.price}</span>
                          <span className="text-xs font-bold text-gray-400">/mês</span>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Forma de Pagamento</h3>
                      <button className="w-full bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-blue-500 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CheckCircle2 className="text-blue-500" size={20} />
                            <span className="font-bold dark:text-white">PIX Automatizado</span>
                          </div>
                          <Zap size={16} className="text-blue-500" />
                      </button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 flex gap-4">
                      <ShieldCheck className="text-blue-600 shrink-0" />
                      <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                          A renovação é automática a cada 30 dias. Você pode cancelar quando quiser sem taxas.
                      </p>
                  </div>
              </main>

              <footer className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={handleConfirmPurchase}
                    disabled={isProcessing}
                    className="w-full bg-[#1E5BFF] text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                  >
                      {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirmar e Ativar'}
                  </button>
              </footer>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft className="w-6 h-6 dark:text-white"/></button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Escolha seu Plano</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
          <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-3">Mais potência local</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Seja referência no seu bairro e venda mais.</p>
          </div>

          <div className="space-y-6">
              {PLAN_DATA.map(plan => {
                  const Icon = plan.icon;
                  return (
                      <div 
                        key={plan.id}
                        className={`relative bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border-2 transition-all ${plan.popular ? 'border-[#1E5BFF] shadow-2xl shadow-blue-500/10' : 'border-gray-100 dark:border-gray-800 shadow-sm'}`}
                      >
                          {plan.popular && (
                              <div className="absolute -top-3 right-8 bg-[#1E5BFF] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Mais Escolhido</div>
                          )}
                          <div className="flex items-center gap-4 mb-6">
                              <div className={`w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center text-white shadow-lg`}><Icon size={24}/></div>
                              <h3 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tight">{plan.name}</h3>
                          </div>
                          
                          <div className="flex items-baseline gap-1 mb-8">
                              <span className="text-sm font-bold text-gray-400">R$</span>
                              <span className="text-4xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                              <span className="text-xs font-bold text-gray-400">/mês</span>
                          </div>

                          <ul className="space-y-4 mb-10">
                              {plan.features.map((feat, i) => (
                                  <li key={i} className="flex items-start gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
                                      <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                      {feat}
                                  </li>
                              ))}
                          </ul>

                          <button 
                            onClick={() => handleSelectPlan(plan.id)}
                            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] ${plan.popular ? 'bg-[#1E5BFF] text-white shadow-xl shadow-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1E5BFF] hover:text-white'}`}
                          >
                              Contratar Plano
                          </button>
                      </div>
                  );
              })}
          </div>
      </main>
    </div>
  );
};
