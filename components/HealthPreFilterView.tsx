
import React from 'react';
import { 
  ChevronLeft, 
  User, 
  Baby, 
  Accessibility, 
  HeartPulse,
  ArrowRight,
  X
} from 'lucide-react';

interface HealthPreFilterViewProps {
  onBack: () => void;
  onSelectOption: (option: string) => void;
}

const FilterCard: React.FC<{ 
  icon: React.ElementType, 
  label: string, 
  onClick: () => void,
  description: string 
}> = ({ icon: Icon, label, onClick, description }) => (
  <button 
    onClick={onClick}
    className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all flex flex-col items-center text-center group active:scale-95"
  >
    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF] mb-4 group-hover:scale-110 transition-transform">
        <Icon size={32} strokeWidth={2.5} />
    </div>
    <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-sm mb-1">{label}</h4>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">{description}</p>
  </button>
);

export const HealthPreFilterView: React.FC<HealthPreFilterViewProps> = ({ onBack, onSelectOption }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-500">
      {/* Header Minimalista */}
      <header className="px-5 pt-12 pb-6 flex items-center justify-between">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 active:scale-90 transition-all">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-8 flex flex-col justify-center pb-20">
        <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 mb-4">
                <HeartPulse size={14} className="text-[#1E5BFF]" />
                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Cuidado Personalizado</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.95] mb-4">
                Para quem você busca <br/>atendimento agora?
            </h1>
            <p className="text-sm text-gray-500 font-medium">Selecione uma opção para filtrarmos os melhores profissionais para você.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FilterCard 
            icon={User} 
            label="Mulher" 
            description="Saúde Feminina" 
            onClick={() => onSelectOption('Mulher')} 
          />
          <FilterCard 
            icon={User} 
            label="Homem" 
            description="Saúde Masculina" 
            onClick={() => onSelectOption('Homem')} 
          />
          <FilterCard 
            icon={Baby} 
            label="Pediatria" 
            description="Para Crianças" 
            onClick={() => onSelectOption('Pediatria')} 
          />
          <FilterCard 
            icon={Accessibility} 
            label="Geriatria" 
            description="Melhor Idade" 
            onClick={() => onSelectOption('Geriatria')} 
          />
        </div>

        <button 
            onClick={() => onSelectOption('')}
            className="mt-12 w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-blue-500 transition-colors"
        >
            Ver todas as opções de saúde <ArrowRight size={14} />
        </button>
      </main>

      <footer className="p-8 text-center opacity-30 grayscale pointer-events-none">
        <p className="text-[8px] font-black uppercase tracking-[0.5em]">Localizei JPA • Saúde e Bem-estar</p>
      </footer>
    </div>
  );
};
