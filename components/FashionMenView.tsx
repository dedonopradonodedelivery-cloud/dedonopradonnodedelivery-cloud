
import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Shirt, User, Watch, Zap, LayoutGrid } from 'lucide-react';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';
import { Store } from '@/types';

interface SpecialtyItem {
  name: string;
  isPopular?: boolean;
}

interface SpecialtyGroup {
  title: string;
  items: SpecialtyItem[];
  color: string;
}

interface FashionMenViewProps {
  onBack: () => void;
  onSelect: (category: string) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Estilos / Ocasiões",
    color: "text-blue-500 bg-blue-50",
    items: [
      { name: "Moda casual masculina", isPopular: true },
      { name: "Moda social masculina" },
      { name: "Moda executiva masculina" },
    ]
  },
  {
    title: "Segmentos / Nichos",
    color: "text-emerald-600 bg-emerald-50",
    items: [
      { name: "Moda jovem masculina" },
      { name: "Moda fitness masculina" },
      { name: "Moda praia masculina", isPopular: true },
      { name: "Moda esportiva masculina" },
      { name: "Moda plus size masculina" },
    ]
  },
  {
    title: "Lifestyle / Estética / Identidade",
    color: "text-indigo-600 bg-indigo-50",
    items: [
      { name: "Moda urbana masculina" },
      { name: "Moda streetwear masculina", isPopular: true },
      { name: "Moda country masculina" },
    ]
  },
  {
    title: "Premium / Diferenciação",
    color: "text-amber-600 bg-amber-50",
    items: [
      { name: "Moda luxo masculina", isPopular: true },
      { name: "Moda sustentável masculina" },
    ]
  },
  {
    title: "Produtos / Complementos",
    color: "text-purple-600 bg-purple-50",
    items: [
      { name: "Moda íntima masculina" },
      { name: "Acessórios masculinos", isPopular: true },
      { name: "Calçados masculinos", isPopular: true },
    ]
  }
];

const CategoryCard: React.FC<{ item: SpecialtyItem; onClick: () => void }> = ({ item, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm mb-2"
  >
    <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">{item.name}</span>
        {item.isPopular && (
            <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Destaque</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
  </button>
);

export const FashionMenView: React.FC<FashionMenViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Man Style JPA',
      category: 'Moda',
      subcategory: 'Masculino',
      image: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1200',
      description: 'Estilo clássico e contemporâneo para o homem de Jacarepaguá. O melhor da moda casual e social em um só lugar.',
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
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Homem</h1>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <div className="flex-1 bg-white dark:bg-gray-950 rounded-t-[3.5rem] -mt-8 pb-32 relative z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
        <main className="p-6 pt-12 space-y-10">
          <div 
              onClick={handleHeroClick}
              className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all group"
          >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                      <User size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-xl uppercase tracking-tighter leading-tight mb-1">Seu estilo,<br/>sua autenticidade.</h3>
                      <p className="text-blue-100 text-xs font-medium leading-relaxed max-w-[220px]">Lojas selecionadas para você em Jacarepaguá. <span className="underline ml-1">Conhecer</span></p>
                  </div>
              </div>
          </div>

          {GROUPS.map((group, idx) => (
            <section key={idx} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em]">
                  {group.title}
                </h3>
              </div>
              <div className="flex flex-col">
                {group.items.map((item, itemIdx) => (
                  <CategoryCard 
                    key={itemIdx} 
                    item={item} 
                    onClick={() => onSelect(item.name)} 
                  />
                ))}
              </div>
            </section>
          ))}

          <div className="pt-8 pb-12 text-center opacity-30 flex flex-col items-center gap-2">
              <Watch size={20} className="text-blue-500" fill="currentColor" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Men's Fashion Hub</p>
          </div>
        </main>
      </div>
    </div>
  );
};
