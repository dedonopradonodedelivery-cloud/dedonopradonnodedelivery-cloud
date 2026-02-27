
import React from 'react';
import { ChevronLeft, ChevronRight, Scissors, Stethoscope, Home, ShoppingBag, Brain, Cat, Heart, Zap, Star, Sparkles } from 'lucide-react';
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

interface PetsCatsViewProps {
  onBack: () => void;
  onSelect: (specialty: string) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
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

export const PetsCatsView: React.FC<PetsCatsViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Gatomania — Clínica Felina',
      category: 'Pets',
      subcategory: 'Clínica Veterinária',
      image: 'https://images.unsplash.com/photo-1514888286974-6c27e9cce25b?q=80&w=1200',
      description: 'A primeira clínica exclusiva para gatos em Jacarepaguá. Ambiente cat-friendly e especialistas dedicados ao seu felino.',
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
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Gatos</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-6 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
          <div 
              onClick={handleHeroClick}
              className="py-10 px-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden border border-white/5 cursor-pointer active:scale-[0.99] transition-all group"
          >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl">
                      <Cat size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Universo Felino JPA</h3>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">Conecte-se com clínicas e especialistas dedicados exclusivamente ao cuidado felino. <span className="underline ml-1">Ver Destaque</span></p>
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
              <div className="grid grid-cols-2 gap-4">
                {group.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => onSelect(item.name)}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[2.2rem] flex flex-col items-center justify-center text-center gap-4 transition-all active:scale-95 shadow-sm hover:shadow-md group relative"
                  >
                    {item.isPopular && (
                        <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Destaque</span>
                    )}
                    <div className={`w-16 h-16 rounded-[1.5rem] ${group.color.split(' ')[1]} bg-opacity-10 flex items-center justify-center ${group.color.split(' ')[0]} group-hover:scale-110 transition-transform duration-500`}>
                      <group.icon size={32} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none px-1">
                      {item.name}
                    </span>
                  </button>
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
    </div>
  );
};
