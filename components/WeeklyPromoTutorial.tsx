
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Tag, 
  Home, 
  Calendar, 
  TrendingUp, 
  Rocket,
  CheckCircle2,
  Zap,
  ArrowRight,
  Target
} from 'lucide-react';

interface WeeklyPromoTutorialProps {
  onClose: () => void;
  onStart: () => void;
}

const STEPS = [
  {
    title: "Venda mais para o bairro",
    description: "A Promoção da Semana é a vitrine de maior destaque para o seu melhor produto.",
    icon: <Rocket className="w-12 h-12 text-amber-400" />,
    color: "from-indigo-600 to-blue-700"
  },
  {
    title: "Destaque na Home",
    description: "Sua oferta aparece logo no início do app, onde milhares de moradores circulam todos os dias.",
    icon: <Home className="w-12 h-12 text-blue-400" />,
    color: "from-blue-600 to-indigo-800"
  },
  {
    title: "7 dias de visibilidade",
    description: "Cada promoção dura exatamente uma semana. Tempo perfeito para gerar desejo e recorrência.",
    icon: <Calendar className="w-12 h-12 text-emerald-400" />,
    color: "from-emerald-600 to-teal-800"
  },
  {
    title: "O segredo: O Desconto",
    description: "Para entrar na vitrine, o desconto deve ser de no mínimo 20%. Quanto maior o desconto, mais clientes você atrai.",
    icon: <TrendingUp className="w-12 h-12 text-rose-400" />,
    color: "from-rose-600 to-orange-700"
  },
  {
    title: "Rápido e Simples",
    description: "Suba uma foto, defina o preço e pronto. Sua loja ganha um impulso instantâneo.",
    icon: <Zap className="w-12 h-12 text-amber-300" />,
    color: "from-amber-500 to-orange-600"
  }
];

export const WeeklyPromoTutorial: React.FC<WeeklyPromoTutorialProps> = ({ onClose, onStart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const duration = 8000; // 8 segundos por slide

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            return 0;
          } else {
            clearInterval(stepInterval);
            return 100;
          }
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(stepInterval);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    } else {
      onStart();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const activeStep = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-500">
      {/* Progress Bars */}
      <div className="flex gap-1.5 p-4 pt-6">
        {STEPS.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: idx === currentStep ? `${progress}%` : idx < currentStep ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-2">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Guia do Lojista</span>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b ${activeStep.color} transition-colors duration-700`}>
        <div className="mb-10 p-10 bg-white/10 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 animate-in zoom-in duration-500">
          {activeStep.icon}
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4 leading-tight tracking-tight font-display animate-in slide-in-from-bottom-4 duration-500">
          {activeStep.title}
        </h2>
        
        <p className="text-lg text-white/80 font-medium leading-relaxed max-w-xs animate-in slide-in-from-bottom-6 duration-700">
          {activeStep.description}
        </p>
      </div>

      {/* Interaction Zones (Hidden) */}
      <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev}></div>
      <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNext}></div>

      {/* Footer CTA */}
      <div className="p-8 bg-slate-950/80 backdrop-blur-md border-t border-white/5">
        <button 
          onClick={handleNext}
          className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
        >
          {currentStep === STEPS.length - 1 ? 'Começar Agora' : 'Próximo'}
          <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </button>
        <p className="text-center text-[10px] text-slate-500 font-bold uppercase mt-6 tracking-[0.3em]">
          Dica: Toque nas laterais para navegar
        </p>
      </div>
    </div>
  );
};
