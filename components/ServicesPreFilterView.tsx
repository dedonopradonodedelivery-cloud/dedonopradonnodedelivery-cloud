
import React from 'react';
import { 
  Wrench, 
  Briefcase,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

interface ServicesPreFilterViewProps {
  onBack: () => void;
  onSelectOption: (option: 'MANUAL' | 'SPECIALIZED' | 'ALL') => void;
}

const FilterCard: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void,
  description: string,
  bgColor: string,
  iconContainerColor: string,
  textColor: string
}> = ({ icon, label, onClick, description, bgColor, iconContainerColor, textColor }) => (
  <button 
    onClick={onClick}
    className={`${bgColor} p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group active:scale-95 border border-transparent w-full`}
  >
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${iconContainerColor} mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
        {icon}
    </div>
    <h4 className={`font-black ${textColor} uppercase tracking-tighter text-lg mb-2 leading-none`}>{label}</h4>
    <p className={`${textColor} opacity-60 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[180px]`}>{description}</p>
  </button>
);

export const ServicesPreFilterView: React.FC<ServicesPreFilterViewProps> = ({ onBack, onSelectOption }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-500">
      {/* Header Minimalista */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 active:scale-90 transition-all">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-8 flex flex-col justify-center pb-20">
        <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 mb-4">
                <Sparkles size={14} className="text-[#1E5BFF]" />
                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Encontre o Profissional Ideal</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.95] mb-4">
                Que tipo de serviço <br/>você procura?
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tight max-w-[280px] mx-auto">
                Selecione uma opção para mostrarmos os melhores profissionais no bairro.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto w-full">
          <FilterCard 
            icon={<Wrench size={40} strokeWidth={2} />} 
            label="Serviços Manuais" 
            description="Pequenos reparos, instalação, manutenção e mão na massa." 
            bgColor="bg-blue-50 dark:bg-blue-900/20"
            iconContainerColor="text-blue-600 bg-blue-100 dark:bg-blue-900/40"
            textColor="text-blue-900 dark:text-blue-100"
            onClick={() => onSelectOption('MANUAL')} 
          />
          <FilterCard 
            icon={<Briefcase size={40} strokeWidth={2} />} 
            label="Serviços Especializados" 
            description="Serviços técnicos e profissionais com maior complexidade." 
            bgColor="bg-indigo-50 dark:bg-indigo-900/20"
            iconContainerColor="text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            onClick={() => onSelectOption('SPECIALIZED')} 
          />
        </div>

        <button 
            onClick={() => onSelectOption('ALL')}
            className="mt-12 w-full py-4 text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-blue-500 transition-colors"
        >
            Ver todos os prestadores <ArrowRight size={14} strokeWidth={3} />
        </button>
      </main>

      <footer className="p-8 text-center opacity-30 grayscale pointer-events-none mt-auto">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] dark:text-white text-gray-400">Localizei JPA • Credibilidade no Bairro</p>
      </footer>
    </div>
  );
};
