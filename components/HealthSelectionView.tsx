
import React from 'react';
import { ChevronLeft, Baby, User, Users, Heart, ArrowRight, Info } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface HealthSelectionViewProps {
  onBack: () => void;
  onSelect: (intent: string) => void;
  onNavigate: (view: string) => void;
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

export const HealthSelectionView: React.FC<HealthSelectionViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen">
      
      {/* 
        ============================================================
        A MÁGICA VISUAL: z-40 e -mt-12
        O container branco agora tem um z-index maior que o Header,
        permitindo que a borda arredondada sobreponha o azul.
        ============================================================
      */}
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-8 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        
        <main className="p-6 pt-12 space-y-10">
            <div className="text-center space-y-3 mb-4">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-2 shadow-inner">
                    <Heart size={32} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                    Para quem você busca <br/> atendimento? <span className="text-blue-500">✨</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Escolha uma opção para ver os especialistas do bairro.</p>
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

        <footer className="p-10 text-center opacity-30">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Saúde</p>
        </footer>
      </div>
    </div>
  );
};
