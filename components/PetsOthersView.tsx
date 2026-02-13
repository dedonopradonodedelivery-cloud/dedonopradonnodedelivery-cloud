
import React from 'react';
import { ChevronLeft, ChevronRight, Stethoscope, ShoppingBag, Scissors, Home, Bird, Turtle, Fish, MousePointer2, Star, Sparkles, Zap, Heart } from 'lucide-react';
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

interface PetsOthersViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void; // Added for the MasterSponsorBadge
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Saúde / Atendimento Veterinário",
    icon: Stethoscope,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { name: "Veterinário especializado em exóticos", isPopular: true },
      { name: "Clínica veterinária exóticos" },
    ]
  },
  {
    title: "Produtos / Pet Shop",
    icon: ShoppingBag,
    color: "text-blue-600 bg-blue-50",
    items: [
      { name: "Pet shop exóticos", isPopular: true },
      { name: "Alimentação natural exóticos" },
      { name: "Rações premium para exóticos" },
      { name: "Acessórios para exóticos" },
    ]
  },
  {
    title: "Cuidados / Estética",
    icon: Scissors,
    color: "text-purple-600 bg-purple-50",
    items: [
      { name: "Banho & Cuidados exóticos" },
      { name: "Estética exóticos", isPopular: true },
    ]
  },
  {
    title: "Hospedagem / Day Care",
    icon: Home,
    color: "text-amber-600 bg-amber-50",
    items: [
      { name: "Hotel para pets exóticos", isPopular: true },
      { name: "Creche para pets exóticos" },
    ]
  },
  {
    title: "Tipos de Pets",
    icon: Heart,
    color: "text-rose-600 bg-rose-50",
    items: [
      { name: "Aves" },
      { name: "Roedores" },
      { name: "Répteis" },
      { name: "Peixes ornamentais" },
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
            <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Especialista</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
  </button>
);

export const PetsOthersView: React.FC<PetsOthersViewProps> = ({ onBack, onSelect, onNavigate }) => {
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
            <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Pet — Outros</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Mundo Exótico 🦎🦋</p>
          </div>
        </div>
        {/* MasterSponsorBadge fixed at top right */}
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 relative">
        {/* Removed the absolute positioned badge from main */}

        {/* Banner de Autoridade */}
        <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Cuidados Especializados</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Conectamos você aos raros especialistas em animais exóticos de Jacarepaguá.</p>
                </div>
            </div>
        </div>

        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-1">
              <div className={`p-2 rounded-xl ${group.color} shrink-0 shadow-sm`}>
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
            <Bird size={20} className="text-emerald-600" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Exotic Hub</p>
        </div>
      </main>
    </div>
  );
};
