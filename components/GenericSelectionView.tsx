import React from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

interface Subcategory {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface GenericSelectionViewProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  subcategories: Subcategory[];
  onBack: () => void;
  onSelect: (sub: string) => void;
  onNavigate: (view: string) => void;
  emoji?: string;
}

export const GenericSelectionView: React.FC<GenericSelectionViewProps> = ({
  title,
  subtitle,
  icon: Icon,
  subcategories,
  onBack,
  onSelect,
  onNavigate,
  emoji = "✨"
}) => {
  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen">
      
      <div className="pt-12 pb-6 px-6 flex justify-end">
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </div>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
            <div className="text-center space-y-3 mb-4 relative">
                <button 
                  onClick={onBack}
                  className="absolute left-0 top-0 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-gray-900 active:scale-90 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mx-auto text-[#1E5BFF] mb-2 shadow-inner">
                    <Icon size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                    {title} <span className="text-blue-500">{emoji}</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {subcategories.map((sub) => (
                    <button
                        key={sub.name}
                        onClick={() => onSelect(sub.name)}
                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group"
                    >
                        <div className={`w-16 h-16 rounded-[1.5rem] ${sub.color} bg-opacity-10 flex items-center justify-center ${sub.color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform duration-500`}>
                            <sub.icon size={32} strokeWidth={2.5} />
                        </div>
                        <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                            {sub.name}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4 items-center">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                    <Sparkles className="text-blue-500" size={18} />
                </div>
                <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold leading-tight uppercase tracking-tight">
                    Encontre os melhores profissionais e lojas de Jacarepaguá.
                </p>
            </div>
        </main>
        <footer className="p-10 text-center opacity-30">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA Ecosystem</p>
        </footer>
      </div>
    </div>
  );
};
