
import React from 'react';
import { Baby, User, Users, Heart, ArrowRight, Info, ChevronLeft } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface HealthSelectionViewProps {
  onSelect: (intent: string) => void;
  onNavigate: (view: string) => void;
  onBack: () => void;
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
      <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{label}</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
      <ArrowRight size={20} strokeWidth={3} />
    </div>
  </button>
);

export const HealthSelectionView: React.FC<HealthSelectionViewProps> = ({ onSelect, onNavigate, onBack }) => {
  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen">
      
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        
        <main className="p-6 pt-12 space-y-10">
            <div className="text-center space-y-3 mb-4 relative">
                <button 
                  onClick={onBack}
                  className="absolute left-0 top-0 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-2 shadow-inner">
                    <Heart size={32} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                    Para quem você busca <br/> atendimento? <span className="text-blue-500">✨</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Escolha uma opção para ver os especialistas do bairro.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onSelect('Mulher')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-rose-500 bg-opacity-10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-500">
                        <User size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Mulher
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Homem')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 bg-opacity-10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                        <User size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Homem
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Pediatria')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 bg-opacity-10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-500">
                        <Baby size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Pediatria
                    </span>
                </button>
                <button
                    onClick={() => onSelect('Geriatria')}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500 bg-opacity-10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500">
                        <Users size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                        Geriatria
                    </span>
                </button>
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
                <Info className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs text-blue-800 dark:text-blue-300 font-bold leading-tight uppercase tracking-tight">
                    Conectamos você com os melhores profissionais de Jacarepaguá.
                </p>
            </div>
        </main>

        <footer className="p-10 text-center opacity-30">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Saúde</p>
        </footer>
      </div>
    </div>
  );
};
