
import React from 'react';
import { ChevronLeft, Shirt, User, Baby, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge'; // Import the new badge component

interface FashionSelectionViewProps {
  onBack: () => void;
  onSelect: (intent: string) => void;
  onNavigate: (view: string) => void; // Added for the MasterSponsorBadge
}

const SelectionCard: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  sublabel: string;
  color: string; 
  onClick: () => void;
}> = ({ icon: Icon, label, sublabel, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.5rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div className="text-left">
        <span className="block text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{label}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sublabel}</span>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
      <ArrowRight size={20} strokeWidth={3} />
    </div>
  </button>
);

export const FashionSelectionView: React.FC<FashionSelectionViewProps> = ({ onBack, onSelect, onNavigate }) => {
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
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Moda</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Jacarepaguá / Estilo</p>
          </div>
        </div>
        {/* MasterSponsorBadge fixed at top right */}
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 gap-8 max-w-md mx-auto w-full relative">
        {/* Removed the absolute positioned badge from main */}

        <div className="text-center space-y-3 mb-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-2">
            <Shirt size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
            Que estilo você <br/> procura hoje? <span className="text-blue-500">👀✨</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">As melhores tendências pertinho de você.</p>
        </div>

        <div className="space-y-3">
          <SelectionCard 
            icon={User} 
            label="Feminino" 
            color="bg-rose-500" 
            onClick={() => onSelect('Feminino')} 
          />
          <SelectionCard 
            icon={User} 
            label="Masculino" 
            color="bg-blue-500" 
            onClick={() => onSelect('Masculino')} 
          />
          <SelectionCard 
            icon={Baby} 
            label="Infantil" 
            color="bg-amber-500" 
            onClick={() => onSelect('Infantil')} 
          />
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
            <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                <Sparkles className="text-blue-500" size={18} />
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300 font-bold leading-tight uppercase tracking-tight">
                Curadoria exclusiva com as melhores lojas de Jacarepaguá.
            </p>
        </div>
      </main>

      <footer className="p-10 text-center opacity-30 shrink-0">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Fashion Hub</p>
      </footer>
    </div>
  );
};
