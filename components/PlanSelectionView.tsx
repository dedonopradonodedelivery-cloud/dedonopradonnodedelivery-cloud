
import React, { useState } from 'react';
import { ChevronLeft, Check, Crown, Zap, Building2, Star, ShieldCheck, ArrowRight, Loader2, CheckCircle2, Medal, Rocket, Sparkles, Calendar } from 'lucide-react';
import { PlanType } from '../types';

interface PlanSelectionViewProps {
  onBack: () => void;
  onSuccess: (plan: PlanType) => void;
}

const PLAN_DATA = [
    {
        id: 'founder',
        name: 'Plano Fundador – Inauguração',
        price: '81,00', // 27 * 3
        period: 'Pagamento Único',
        icon: Medal,
        color: 'bg-gradient-to-br from-amber-400 to-yellow-600',
        textColor: 'text-yellow-950',
        borderColor: 'border-yellow-400',
        isSpecial: true,
        badge: 'Pague 3, Leve 5 Meses',
        features: [
            '5 Meses de visibilidade garantida',
            'Selo Exclusivo "Fundador do Bairro"',
            'Prioridade inicial no algoritmo',
            'Suporte prioritário no WhatsApp',
            'Vagas limitadas por região'
        ]
    },
    {
        id: 'professional',
        name: 'Patrocinado Local',
        price: '27,00', // Mensal real
        dailyPrice: '0,90', // Destaque visual
        period: '/mês',
        icon: Zap,
        color: 'bg-blue-600',
        textColor: 'text-white',
        borderColor: 'border-gray-100',
        isSpecial: false,
        features: [
            'Sua loja em destaque no bairro',
            'Mais visibilidade no momento da decisão',
            'Presença diária para moradores próximos',
            'Ideal para testar sem risco',
            'Cancele quando quiser'
        ]
    },
    {
        id: 'enterprise',
        name: 'Empresa Bairro',
        price: '99,90',
        period: '/mês',
        icon: Building2,
        color: 'bg-indigo-600',
        textColor: 'text-white',
        borderColor: 'border-gray-100',
        isSpecial: false,
        popular: false,
        features: [
            'Até 30 anúncios ativos',
            'Destaque contínuo (Mini Banners)',
            'Selo Empresa Verificada',
            'Estatísticas de visualização',
            'Suporte prioritário'
        ]
    },
    {
        id: 'master',
        name: 'Master Imobiliário',
        price: '199,90',
        period: '/mês',
        icon: Crown,
        color: 'bg-slate-900',
        textColor: 'text-white',
        borderColor: 'border-gray-100',
        isSpecial: false,
        features: [
            'Anúncios ilimitados',
            'Destaque fixo em Comerciais',
            'Presença em "Destaques do Bairro"',
            'Mini-banner fixo na rolagem',
            'Selo Destaque do Bairro',
            'Status e Autoridade máxima'
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
    window.scrollTo(0, 0);
  };

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
    }, 2000);
  };

  if (step === 'success') {
      const plan = PLAN_DATA.find(p => p.id === selectedPlan);
      return (
          <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mb-8 text-emerald-600">
                  <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                  {selectedPlan === 'founder' ? 'Bem-vindo, Fundador!' : 'Plano Ativado!'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-12">
                  {selectedPlan === 'founder' 
                    ? 'Sua posição de destaque no bairro foi garantida por 5 meses. Aproveite a exclusividade de inauguração.' 
                    : 'Seu acesso patrocinado já está liberado. Sua loja começará a aparecer para mais moradores hoje.'}
              </p>
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
      const plan = PLAN_DATA.find(p => p.id === selectedPlan) as any; // Type hack for quick access
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
              <header className="px-5 h-20 flex items-center gap-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
                <button onClick={() => setStep('selection')} className="p-3 -ml-2 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><ChevronLeft className="w-5 h-5 dark:text-white"/></button>
                <h1 className="font-bold text-lg dark:text-white">Confirmação</h1>
              </header>
              
              <main className="flex-1 p-6 space-y-8">
                  <div className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-lg border-2 ${plan?.borderColor} dark:border-gray-800 text-center relative overflow-hidden`}>
                      {plan?.id === 'founder' && (
                          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-yellow-600"></div>
                      )}
                      
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Você escolheu</p>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">{plan?.name}</h2>
                      
                      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                          {plan.id === 'professional' ? (
                             <>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-gray-400">R$</span>
                                    <span className="text-5xl font-black text-[#1E5BFF] tracking-tighter">{plan.dailyPrice}</span>
                                    <span className="text-xs font-bold text-gray-400">/dia</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                    Cobrado mensalmente: R$ {plan.price}
                                </span>
                             </>
                          ) : (
                             <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-gray-400">R$</span>
                                <span className="text-5xl font-black text-[#1E5BFF] tracking-tighter">{plan?.price}</span>
                                <span className="text-xs font-bold text-gray-400">{plan?.period}</span>
                             </div>
                          )}
                      </div>

                      {plan?.id === 'founder' && (
                          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl">
                              <p className="text-xs text-amber-800 dark:text-amber-200 font-bold leading-relaxed">
                                  Você está garantindo <span className="uppercase font-black">5 meses</span> de acesso total (3 pagos + 2 grátis) e o selo vitalício de Fundador.
                              </p>
                          </div>
                      )}
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Forma de Pagamento</h3>
                      <button className="w-full bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 border-blue-500 flex items-center justify-between shadow-md">
                          <div className="flex items-center gap-4">
                            <CheckCircle2 className="text-blue-500" size={24} />
                            <div className="text-left">
                                <span className="font-bold dark:text-white block text-sm">PIX Automatizado</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Liberação Imediata</span>
                            </div>
                          </div>
                          <Zap size={20} className="text-blue-500" />
                      </button>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 flex gap-4">
                      <ShieldCheck className="text-blue-600 shrink-0" />
                      <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                          {plan?.id === 'founder' 
                            ? 'Sua posição de fundador é única e intransferível. O selo será ativado imediatamente após o pagamento.'
                            : 'A renovação é automática a cada 30 dias. Você pode cancelar a qualquer momento sem multas.'}
                      </p>
                  </div>
              </main>

              <footer className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={handleConfirmPurchase}
                    disabled={isProcessing}
                    className={`w-full text-white font-black py-5 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs transition-all active:scale-[0.98] ${plan?.id === 'founder' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-amber-500/20' : 'bg-[#1E5BFF] shadow-blue-500/20'}`}
                  >
                      {isProcessing ? <Loader2 className="animate-spin" /> : (plan?.id === 'founder' ? 'Garantir Posição' : 'Confirmar e Ativar')}
                  </button>
              </footer>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 transition-colors"><ChevronLeft className="w-5 h-5 dark:text-white"/></button>
        <h1 className="font-black text-lg text-gray-900 dark:text-white uppercase tracking-tighter">Planos de Visibilidade</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
          <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                  Apareça no seu bairro<br/>todos os dias
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto">
                  Visibilidade local real por menos de R$ 1 por dia.
              </p>
          </div>

          <div className="space-y-6">
              {PLAN_DATA.map((plan: any) => {
                  const Icon = plan.icon;
                  return (
                      <div 
                        key={plan.id}
                        className={`relative rounded-[2.5rem] p-8 border-2 transition-all cursor-pointer active:scale-[0.98]
                            ${plan.isSpecial 
                                ? 'bg-slate-900 border-amber-500 shadow-2xl shadow-amber-500/10' 
                                : `bg-white dark:bg-gray-900 ${plan.id === 'professional' ? 'border-[#1E5BFF] shadow-xl shadow-blue-500/10' : 'border-gray-100 dark:border-gray-800 shadow-sm'}`
                            }
                        `}
                      >
                          {plan.id === 'professional' && (
                              <div className="absolute -top-3 right-8 bg-[#1E5BFF] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg border-2 border-white dark:border-gray-900">
                                  Melhor Custo-Benefício
                              </div>
                          )}

                          {plan.badge && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-950 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                                  <Sparkles size={12} fill="currentColor" /> {plan.badge}
                              </div>
                          )}

                          <div className="flex items-center gap-4 mb-6">
                              <div className={`w-14 h-14 rounded-2xl ${plan.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                  <Icon size={24} fill={plan.isSpecial ? "currentColor" : "none"} />
                              </div>
                              <h3 className={`font-black text-xl uppercase tracking-tighter leading-none ${plan.isSpecial ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                  {plan.name}
                              </h3>
                          </div>
                          
                          <div className="flex flex-col items-start mb-8">
                              {plan.id === 'professional' ? (
                                  <>
                                     <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-bold text-gray-400">R$</span>
                                        <span className="text-5xl font-black tracking-tighter text-[#1E5BFF]">0,90</span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">/ dia</span>
                                     </div>
                                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                                        {plan.subPrice}
                                     </span>
                                  </>
                              ) : (
                                  <>
                                      <div className="flex items-baseline gap-1">
                                          <span className={`text-sm font-bold ${plan.isSpecial ? 'text-slate-400' : 'text-gray-400'}`}>R$</span>
                                          <span className={`text-5xl font-black tracking-tighter ${plan.isSpecial ? 'text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                                              {plan.price}
                                          </span>
                                          <span className={`text-xs font-bold uppercase tracking-wider ${plan.isSpecial ? 'text-slate-400' : 'text-gray-400'}`}>
                                              {plan.period}
                                          </span>
                                      </div>
                                      {plan.subPrice && (
                                        <span className="text-[10px] text-amber-200/70 font-bold uppercase tracking-widest mt-1">
                                            {plan.subPrice}
                                        </span>
                                      )}
                                  </>
                              )}
                          </div>

                          <ul className="space-y-4 mb-10">
                              {plan.features.map((feat: string, i: number) => (
                                  <li key={i} className={`flex items-start gap-3 text-xs font-bold ${plan.isSpecial ? 'text-slate-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                      <CheckCircle2 size={16} className={`${plan.isSpecial ? 'text-amber-500' : 'text-blue-500'} shrink-0`} />
                                      {feat}
                                  </li>
                              ))}
                          </ul>

                          <button 
                            onClick={() => handleSelectPlan(plan.id)}
                            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all 
                                ${plan.isSpecial 
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-950 hover:shadow-lg hover:shadow-amber-500/20' 
                                    : plan.id === 'professional' 
                                        ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#1E5BFF] hover:text-white'
                                }`}
                          >
                              {plan.isSpecial ? 'Quero ser Fundador' : plan.id === 'professional' ? 'Começar Agora' : 'Selecionar'}
                          </button>
                      </div>
                  );
              })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-800/30 text-center">
              <p className="text-xs text-blue-800 dark:text-blue-300 font-bold leading-relaxed">
                  💡 Dica: Comece com o <span className="uppercase">Patrocinado Local</span> e evolua para o <span className="uppercase">Master</span> quando quiser mais autoridade.
              </p>
          </div>
      </main>
    </div>
  );
};
