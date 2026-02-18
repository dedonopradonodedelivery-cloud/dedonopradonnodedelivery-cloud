
import React from 'react';
import { ChevronLeft, ArrowRight, Sparkles, User, Info } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface BeautySelectionViewProps {
  onBack: () => void;
  onSelect: (intent: string) => void;
  onNavigate: (view: string) => void;
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

export const BeautySelectionView: React.FC<BeautySelectionViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen">
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-8 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
            <div className="text-center space-y-3 mb-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-2 shadow-inner">
                    <Sparkles size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                    Para quem você busca <br/> o serviço? <span className="text-blue-500">✨</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Escolha uma opção para ver os especialistas do bairro.</p>
            </div>

            <div className="space-y-3">
                <SelectionCard
                    icon={User}
                    label="Mulher"
                    sublabel="Serviços e estética feminina"
                    color="bg-rose-500"
                    onClick={() => onSelect('Mulher')}
                />
                <SelectionCard
                    icon={User}
                    label="Homem"
                    sublabel="Barbearia e cuidados masculinos"
                    color="bg-blue-500"
                    onClick={() => onSelect('Homem')}
                />
            </div>

            <div className="mt-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                    <Sparkles className="text-blue-500" size={18} />
                </div>
                <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold leading-tight uppercase tracking-tight">
                    Conectamos você com os melhores especialistas em Beleza do seu bairro.
                </p>
            </div>
        </main>
        <footer className="p-10 text-center opacity-30">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Beauty Hub</p>
        </footer>
      </div>
    </div>
  );
};
