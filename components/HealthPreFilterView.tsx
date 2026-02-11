
import React from 'react';
import { 
  Baby, 
  HeartPulse,
  ArrowRight,
  X
} from 'lucide-react';

interface HealthPreFilterViewProps {
  onBack: () => void;
  onSelectOption: (option: string) => void;
}

// Ícones Customizados Premium (Silhuetas Minimalistas)
const WomanIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    <path d="M12 8v7" />
    <path d="M9 12h6" />
  </svg>
);

const ManIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

const SeniorIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="6" r="3" />
    <path d="M9 22V15l-2-1a2 2 0 0 1-1-1.73V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2.5" />
    <path d="M16 11l2 1v10" />
    <path d="M18 22h1" />
  </svg>
);

const FilterCard: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void,
  description: string,
}> = ({ icon, label, onClick, description }) => (
  <button 
    onClick={onClick}
    className={`bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-[2.5rem] shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all flex flex-col items-center text-center group active:scale-95 border border-white/20`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-inner bg-white/10`}>
        {icon}
    </div>
    <h4 className={`font-black text-white uppercase tracking-tighter text-sm mb-1 leading-none drop-shadow-sm`}>{label}</h4>
    <p className={`text-white opacity-80 text-[9px] font-bold uppercase tracking-widest leading-tight`}>{description}</p>
  </button>
);

export const HealthPreFilterView: React.FC<HealthPreFilterViewProps> = ({ onBack, onSelectOption }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col animate-in fade-in duration-500">
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 active:scale-90 transition-all">
          <X size={24} strokeWidth={3} />
        </button>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-8 flex flex-col justify-center pb-20">
        <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 mb-4 shadow-sm">
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
            icon={<WomanIcon />} 
            label="Mulher" 
            description="Saúde Feminina" 
            onClick={() => onSelectOption('MULHER')} 
          />
          <FilterCard 
            icon={<ManIcon />} 
            label="Homem" 
            description="Saúde Masculina" 
            onClick={() => onSelectOption('HOMEM')} 
          />
          <FilterCard 
            icon={<Baby size={32} strokeWidth={2.5} />} 
            label="Pediatria" 
            description="Para Crianças" 
            onClick={() => onSelectOption('PEDIATRIA')} 
          />
          <FilterCard 
            icon={<SeniorIcon />} 
            label="Geriatria" 
            description="Melhor Idade" 
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
