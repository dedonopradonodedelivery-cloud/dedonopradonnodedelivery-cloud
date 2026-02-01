import React, { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const ONBOARDING_DATA = [
  {
    title: "Onde o bairro conversa.",
    description: "Descubra o que está acontecendo em Jacarepaguá, converse com pessoas do seu bairro e fique por dentro de tudo que acontece perto de você.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Tudo o que você precisa, perto de você.",
    description: "Encontre comércios, serviços, cupons, classificados e novidades dos bairros de Jacarepaguá em um só lugar.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Use, participe e aproveite.",
    description: "Interaja no JPA Conversa, resgate cupons, contrate serviços e faça parte da vida do seu bairro.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('localizei_onboarding_seen', 'true');
    onComplete();
  };

  const currentStep = ONBOARDING_DATA[currentIndex];

  return (
    <div className="fixed inset-0 z-[10000] bg-white dark:bg-gray-950 flex flex-col font-sans animate-in fade-in duration-500">
      {/* Imagem de Fundo com Overlay */}
      <div className="relative h-[55%] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-transparent to-transparent z-10"></div>
        <img 
          src={currentStep.image} 
          alt="" 
          className="w-full h-full object-cover transition-transform duration-1000 scale-105 animate-pulse-subtle"
        />
        
        {/* Botão Pular */}
        <button 
          onClick={handleFinish}
          className="absolute top-12 right-6 z-20 px-4 py-2 bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-white border border-white/20 active:scale-95 transition-all"
        >
          Pular
        </button>
      </div>

      {/* Conteúdo de Texto */}
      <div className="flex-1 flex flex-col justify-between px-8 pb-12 -mt-10 relative z-20">
        <div className="space-y-4">
          {/* Indicadores de Progresso */}
          <div className="flex gap-1.5 mb-8">
            {ONBOARDING_DATA.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#1E5BFF]' : 'w-2 bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight font-display tracking-tighter">
            {currentStep.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Botão Principal */}
        <div className="pt-8">
          <button 
            onClick={handleNext}
            className="w-full bg-[#1E5BFF] hover:bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base uppercase tracking-widest"
          >
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Começar agora' : 'Próximo'}
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1.05); }
          50% { opacity: 0.95; transform: scale(1.07); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};