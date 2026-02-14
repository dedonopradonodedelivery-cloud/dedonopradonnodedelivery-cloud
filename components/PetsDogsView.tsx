
import React from 'react';
import { ChevronLeft, ChevronRight, Scissors, Stethoscope, Home, ShoppingBag, Sparkles, Dog, Heart, Zap, Star, Bone } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

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

interface PetsDogsViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Higiene & Estética",
    icon: Scissors,
    color: "text-blue-600 bg-blue-50",
    items: [
      { name: "Banho & Tosa", isPopular: true },
      { name: "Estética canina" },
    ]
  },
  {
    title: "Saúde & Bem-estar",
    icon: Stethoscope,
    color: "text-rose-500 bg-rose-50",
    items: [
      { name: "Clínica veterinária canina", isPopular: true },
      { name: "Veterinário domiciliar canino" },
      { name: "Fisioterapia canina" },
    ]
  },
  {
    title: "Hospedagem & Treino",
    icon: Home,
    color: "text-amber-500 bg-amber-50",
    items: [
      { name: "Creche canina" },
      { name: "Hotel para cães", isPopular: true },
      { name: "Day care canino" },
      { name: "Adestramento canino" },
    ]
  },
  {
    title: "Shopping & Nutrição",
    icon: ShoppingBag,
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { name: "Pet shop canino", isPopular: true },
      { name: "Alimentação natural canina" },
      { name: "Rações premium para cães" },
      { name: "Acessórios para cães" },
      { name: "Moda pet canina" },
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
            <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Favorito</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
  </button>
);

export const PetsDogsView: React.FC<PetsDogsViewProps> = ({ onBack, onSelect, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 flex flex-col animate-in fade-in duration-500 pb-20">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Pet — Cães</h1>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Serviços e Cuidados 🐾</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 relative">
        {/* Banner de Autoridade */}
        <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl">
                    <Bone size={24} className="text-white fill-white" />
                </div>
                <div>
                    <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Mundo Canino JPA</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">As melhores clínicas e profissionais especializados em cães na região.</p>
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
            <Star size={20} className="text-[#1E5BFF]" fill="currentColor" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Hub Pet</p>
        </div>
      </main>
    </div>
  );
};
