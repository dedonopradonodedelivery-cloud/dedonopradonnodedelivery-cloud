
import React, { useState } from 'react';
import { Map, MapPin, Compass, ArrowRight, Check } from 'lucide-react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { setNeighborhood } = useNeighborhood();

  const handleFinish = () => {
    // Definir bairro padrão = Freguesia conforme regra de negócio
    setNeighborhood('Freguesia');
    // Salva também no localStorage para garantir persistência
    localStorage.setItem('localizei_neighborhood', 'Freguesia');
    onComplete();
  };

  const nextStep = () => {
    if (step < 2) {
        setStep(step + 1);
    } else {
        handleFinish();
    }
  };

  const content = [
    {
      icon: <Map className="w-24 h-24 text-[#1E5BFF]" strokeWidth={1} />,
      title: "Localizei JPA",
      text: "Tudo o que acontece nos bairros de Jacarepaguá, em um só lugar.",
      sub: null
    },
    {
      icon: <MapPin className="w-24 h-24 text-[#1E5BFF]" strokeWidth={1} />,
      title: "Seu bairro em destaque",
      text: "Você vê primeiro o que acontece no seu bairro. Promoções, vagas, novidades e recomendações locais.",
      sub: "Quer ver outros bairros? É só trocar o filtro."
    },
    {
      icon: <Compass className="w-24 h-24 text-[#1E5BFF]" strokeWidth={1} />,
      title: "Explore Jacarepaguá",
      text: "Veja conteúdos de outros bairros quando quiser. Você decide até onde quer ir.",
      sub: null
    }
  ];

  const current = content[step];

  return (
    <div className="fixed inset-0 z-[1000] bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 font-sans">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
        
        {/* Icon Animation Container */}
        <div className="mb-10 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-full animate-in zoom-in duration-500 key={step}">
            {current.icon}
        </div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 font-display tracking-tight animate-in slide-in-from-bottom-4 duration-500 key={`t-${step}`}>
            {current.title}
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium animate-in slide-in-from-bottom-6 duration-700 key={`p-${step}`}>
            {current.text}
        </p>

        {current.sub && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-6 font-bold bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl animate-in fade-in delay-300">
                {current.sub}
            </p>
        )}
      </div>

      <div className="w-full max-w-sm mt-auto pb-8">
        <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#1E5BFF]' : 'w-2 bg-gray-200 dark:bg-gray-700'}`} />
            ))}
        </div>

        <button 
            onClick={nextStep}
            className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
            {step === 2 ? 'Começar' : 'Continuar'}
            {step === 2 ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
