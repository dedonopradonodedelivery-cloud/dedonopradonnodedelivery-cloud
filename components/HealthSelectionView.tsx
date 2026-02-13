
import React from 'react';
import { ChevronLeft, Baby, User, Users, Heart, ArrowRight, Info } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge'; // Import the new badge component

interface HealthSelectionViewProps {
  onBack: () => void;
  onSelect: (intent: string) => void;
  onNavigate: (view: string) => void; // Added for the MasterSponsorBadge
}

const SelectionButton: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  color: string; 
  onClick: () => void;
}> = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{label}</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
      <ChevronLeft size={20} className="rotate-180" />
    </div>
  </button>
);

export const HealthSelectionView: React.FC<HealthSelectionViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Saúde</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Refine sua busca</p>
          </div>
        </div>
        {/* MasterSponsorBadge fixed at top right */}
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 gap-8 max-w-md mx-auto w-full relative">
        {/* Removed the absolute positioned badge from main */}

        <div className="text-center space-y-2 mb-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-4">
            <Heart size={32} fill="currentColor" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            Para quem você busca atendimento?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Escolha uma opção para ver os especialistas ideais.</p>
        </div>

        <div className="space-y-3">
          <SelectionButton 
            icon={User} 
            label="Mulher" 
            color="bg-rose-500" 
            onClick={() => onSelect('Mulher')} 
          />
          <SelectionButton 
            icon={User} 
            label="Homem" 
            color="bg-blue-500" 
            onClick={() => onSelect('Homem')} 
          />
          <SelectionButton 
            icon={Baby} 
            label="Pediatria" 
            color="bg-amber-500" 
            onClick={() => onSelect('Pediatria')} 
          />
          <SelectionButton 
            icon={Users} 
            label="Geriatria" 
            color="bg-indigo-500" 
            onClick={() => onSelect('Geriatria')} 
          />
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-800 dark:text-blue-300 font-bold leading-tight uppercase tracking-tight">
                Conectamos você com os melhores profissionais de Jacarepaguá.
            </p>
        </div>
      </main>

      <footer className="p-10 text-center opacity-30 shrink-0">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Saúde</p>
      </footer>
    </div>
  );
};
