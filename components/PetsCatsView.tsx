
import React from 'react';
import { ChevronLeft, ChevronRight, Scissors, Stethoscope, Home, ShoppingBag, Brain, Cat, Heart, Zap, Star, Sparkles } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge'; // Import the new badge component

interface SpecialtyItem {
  name: string;
  isPopular?: boolean;
}

interface SpecialtyGroup {
  title: string;
  icon: React.ElementType;
  items: SpecialtyItem[];
  color: string;
}

interface PetsCatsViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void; // Added for the MasterSponsorBadge
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Saúde & Especialidades",
    icon: Stethoscope,
    color: "text-indigo-600 bg-indigo-50",
    items: [
      { name: "Veterinário especializado em gatos", isPopular: true },
      { name: "Clínica veterinária felina" },
    ]
  },
  {
    title: "Estética & Bem-estar",
    icon: Scissors,
    color: "text-purple-600 bg-purple-50",
    items: [
      { name: "Estética felina", isPopular: true },
      { name: "Comportamento felino" },
    ]
  },
  {
    title: "Hospedagem & Convívio",
    icon: Home,
    color: "text-violet-600 bg-violet-50",
    items: [
      { name: "Hotel para gatos", isPopular: true },
      { name: "Creche felina" },
    ]
  },
  {
    title: "Mundo Felino (Shopping)",
    icon: ShoppingBag,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { name: "Areias sanitárias", isPopular: true },
      { name: "Arranhadores" },
      { name: "Pet shop felino" },
      { name: "Alimentação natural felina" },
      { name: "Rações premium para gatos" },
      { name: "Acessórios para gatos" },
    ]
  }
];

const SpecialtyCard: React.FC<{ item: SpecialtyItem; onClick: () => void }> = ({ item, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2"
  >
    <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{item.name}</span>
        {item.isPopular && (
            <span className="bg-indigo-100 text-indigo-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Destaque</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
  </button>
);

export const PetsCatsView: React.FC<PetsCatsViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Pet — Gatos</h1>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Especialistas em ronronar 🐱✨</p>
          </div>
        </div>
        {/* MasterSponsorBadge fixed at top right */}
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 relative">
        {/* Removed the absolute positioned badge from main */}

        {/* Banner de Autoridade */}
        <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl">
                    <Cat size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Universo Felino JPA</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Conecte-se com clínicas e especialistas dedicados exclusivamente ao cuidado felino.</p>
                </div>
            </div>
        </div>

        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-1">
              <div className={`p-2 rounded-xl ${group.color} shrink-0`}>
                <group.icon size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                {group.title}
              </h3>
            </div>
            <div className="flex flex-col">
              {group.items.map((item, itemIdx) => (
                <SpecialtyCard 
                  key={itemIdx} 
                  item={item} 
                  onClick={() => onSelect(item.name)} 
                />
              ))}
            </div>
          </section>
        ))}

        <div className="pt-8 pb-12 text-center opacity-30 flex flex-col items-center gap-2">
            <Sparkles size={20} className="text-[#4F46E5]" fill="currentColor" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Hub Cat</p>
        </div>
      </main>
    </div>
  );
};
