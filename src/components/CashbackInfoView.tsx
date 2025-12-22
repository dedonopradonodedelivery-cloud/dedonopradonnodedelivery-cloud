

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Sparkles } from 'lucide-react';
import { CashbackIcon } from '@/components/CashbackIcon.tsx';

interface CashbackInfoViewProps {
  onBack: () => void;
}

const COUNTDOWN_TARGET = new Date();
COUNTDOWN_TARGET.setDate(COUNTDOWN_TARGET.getDate() + 30);

const calculateTimeLeft = () => {
  const difference = +COUNTDOWN_TARGET - +new Date();
  let timeLeft = { days: '00', hours: '00', minutes: '00', seconds: '00' };

  if (difference > 0) {
    timeLeft = {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
    };
  }

  return timeLeft;
};

const CountdownUnit = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl w-20 h-20 flex items-center justify-center mb-2 shadow-sm">
      <span className="font-mono text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">
        {value}
      </span>
    </div>
    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
  </div>
);

export const CashbackInfoView: React.FC<CashbackInfoViewProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-[#1E5BFF] rounded-b-[40px] z-0">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 pt-6 flex items-center justify-between">
        <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-white/80 font-medium text-sm">Cashback Localizei</span>
        <div className="w-10"></div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center pt-6 px-6 pb-10 text-center">
        
        {/* Ícone */}
        <div className="mb-6 transform scale-75 -mt-8">
            <CashbackIcon />
        </div>

        {/* Título e Subtítulo */}
        <h1 className="text-3xl font-bold text-white mb-3 font-display drop-shadow-sm">
            Cashback chegando em breve
        </h1>
        <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto font-medium mb-10">
            Estamos finalizando os últimos detalhes para lançar o programa de cashback que vai fortalecer o nosso bairro.
        </p>

        {/* Contagem Regressiva */}
        <div className="w-full max-w-sm mx-auto mb-10">
          <div className="flex justify-center gap-3">
            <CountdownUnit value={timeLeft.days} label="Dias" />
            <CountdownUnit value={timeLeft.hours} label="Horas" />
            <CountdownUnit value={timeLeft.minutes} label="Min" />
            <CountdownUnit value={timeLeft.seconds} label="Seg" />
          </div>
        </div>
        
        {/* CTA */}
        <div className="w-full max-w-sm">
            <button 
                onClick={onBack}
                className="w-full bg-white dark:bg-gray-800 text-[#1E5BFF] dark:text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all"
            >
                Entendi, voltar para a home
            </button>
        </div>
      </div>
    </div>
  );
};