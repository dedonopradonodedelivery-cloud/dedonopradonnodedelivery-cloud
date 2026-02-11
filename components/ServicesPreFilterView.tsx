
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
}> = ({ icon, label, onClick, description }) => (
  <button 
    onClick={onClick}
    className={`bg-[#1E5BFF] p-8 rounded-[2.5rem] shadow-sm hover:brightness-110 transition-all flex flex-col items-center text-center group active:scale-95 border border-white/10 w-full`}
  >
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-inner bg-white/10`}>
        {icon}
    </div>
    <h4 className={`font-black text-white uppercase tracking-tighter text-lg mb-2 leading-none`}>{label}</h4>
    <p className={`text-white opacity-60 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-[180px]`}>{description}</p>
  </button>
);

export const ServicesPreFilterView: React.FC<ServicesPreFilterViewProps> = ({ onBack, onSelectOption }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-500">
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
            icon={<Wrench size={40} strokeWidth={2.5} />} 
            label="Serviços Manuais" 
            description="Pequenos reparos, instalação, manutenção e mão na massa." 
            onClick={() => onSelectOption('MANUAL')} 
          />
          <FilterCard 
            icon={<Briefcase size={40} strokeWidth={2.5} />} 
            label="Serviços Especializados" 
            description="Serviços técnicos e profissionais com maior complexidade." 
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

      <footer className="p-8 text-center opacity-30 grayscale pointer-events-none mt-auto text-gray-400">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] dark:text-white">Localizei JPA • Credibilidade no Bairro</p>
      </footer>
    </div>
  );
};
