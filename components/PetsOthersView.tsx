
import React from 'react';
import { ChevronLeft, ChevronRight, Stethoscope, ShoppingBag, Scissors, Home, Bird, Turtle, Fish, MousePointer2, Star, Sparkles, Zap, Heart } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

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
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
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

export const PetsOthersView: React.FC<PetsOthersViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Reino Exótico JPA',
      category: 'Pets',
      subcategory: 'Especialista em Exóticos',
      image: 'https://images.unsplash.com/photo-1548767791-5147bea8f96e?q=80&w=1200',
      description: 'Especialistas em répteis, aves e pequenos roedores. Tudo o que você precisa para seu pet não convencional.',
    } as Store);
  };

  return (
    <div className="flex flex-col bg-brand-blue w-full max-w-md mx-auto min-h-screen animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-brand-blue px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Outros</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
          <div 
              onClick={handleHeroClick}
              className="py-10 px-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.99] transition-all group"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                      <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Cuidados Especializados</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">Conectamos você aos raros especialistas em animais exóticos de Jacarepaguá. <span className="underline ml-1">Ver Destaque</span></p>
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
    </div>
  );
};
