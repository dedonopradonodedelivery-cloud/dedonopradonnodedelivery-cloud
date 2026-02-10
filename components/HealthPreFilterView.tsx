
import React from 'react';
import { 
  UserRound, 
  Baby, 
  Smile, 
  HeartPulse,
  ArrowRight,
  X,
  Plus
} from 'lucide-react';

interface HealthPreFilterViewProps {
  onBack: () => void;
  onSelectOption: (option: string) => void;
}

const FilterCard: React.FC<{ 
  icon: React.ElementType, 
  label: string, 
  onClick: () => void,
  description: string,
  bgColor: string,
  iconColor: string,
  textColor: string
}> = ({ icon: Icon, label, onClick, description, bgColor, iconColor, textColor }) => (
  <button 
    onClick={onClick}
    className={`${bgColor} p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group active:scale-95 border border-transparent`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconColor} mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
        <Icon size={32} strokeWidth={2.5} />
    </div>
    <h4 className={`font-black ${textColor} uppercase tracking-tighter text-sm mb-1 leading-none`}>{label}</h4>
    <p className={`${textColor} opacity-60 text-[9px] font-bold uppercase tracking-widest leading-tight`}>{description}</p>
  </button>
);

export const HealthPreFilterView: React.FC<HealthPreFilterViewProps> = ({ onBack, onSelectOption }) => {
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
        <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 mb-4">
                <HeartPulse size={14} className="text-[#1E5BFF]" />
                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Cuidado Especializado</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-[0.95] mb-4">
                Para quem você busca <br/>atendimento agora?
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tight">
                Selecione uma opção para filtrarmos os melhores profissionais para você.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FilterCard 
            icon={UserRound} 
            label="Mulher" 
            description="Saúde Feminina" 
            bgColor="bg-pink-50 dark:bg-pink-900/20"
            iconColor="text-pink-600 bg-pink-100 dark:bg-pink-900/40"
            textColor="text-pink-900 dark:text-pink-100"
            onClick={() => onSelectOption('MULHER')} 
          />
          <FilterCard 
            icon={UserRound} 
            label="Homem" 
            description="Saúde Masculina" 
            bgColor="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-blue-600 bg-blue-100 dark:bg-blue-900/40"
            textColor="text-blue-900 dark:text-blue-100"
            onClick={() => onSelectOption('HOMEM')} 
          />
          <FilterCard 
            icon={Baby} 
            label="Pediatria" 
            description="Para Crianças" 
            bgColor="bg-teal-50 dark:bg-teal-900/20"
            iconColor="text-teal-600 bg-teal-100 dark:bg-teal-900/40"
            textColor="text-teal-900 dark:text-teal-100"
            onClick={() => onSelectOption('PEDIATRIA')} 
          />
          <FilterCard 
            icon={Smile} 
            label="Geriatria" 
            description="Melhor Idade" 
            bgColor="bg-amber-50 dark:bg-amber-900/20"
            iconColor="text-amber-600 bg-amber-100 dark:bg-amber-900/40"
            textColor="text-amber-900 dark:text-amber-100"
            onClick={() => onSelectOption('GERIATRIA')} 
          />
        </div>

        <button 
            onClick={() => onSelectOption('ALL')}
            className="mt-12 w-full py-4 text-gray-400 dark:text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-blue-500 transition-colors"
        >
            Ver todas as opções de saúde <ArrowRight size={14} strokeWidth={3} />
        </button>
      </main>

      <footer className="p-8 text-center opacity-30 grayscale pointer-events-none mt-auto">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] dark:text-white">Localizei JPA • Rede de Cuidado</p>
      </footer>
    </div>
  );
};
