
import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, ShoppingBag, Gem, Zap, Star, LayoutGrid, Shirt, Baby, Users } from 'lucide-react';
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

interface FashionKidsViewProps {
  onBack: () => void;
  onSelect: (category: string) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Faixa Etária / Segmentação",
    color: "text-pink-500 bg-pink-50",
    items: [
      { name: "Moda bebê", isPopular: true },
      { name: "Moda kids feminina" },
      { name: "Moda kids masculina" },
    ]
  },
  {
    title: "Estilos / Ocasiões",
    color: "text-purple-500 bg-purple-50",
    items: [
      { name: "Moda casual infantil" },
      { name: "Moda festa infantil", isPopular: true },
      { name: "Moda praia infantil" },
      { name: "Moda esportiva infantil" },
      { name: "Moda íntima infantil" },
    ]
  },
  {
    title: "Contextos / Uso",
    color: "text-blue-500 bg-blue-50",
    items: [
      { name: "Moda escolar", isPopular: true },
    ]
  },
  {
    title: "Nichos Emocionais",
    color: "text-orange-500 bg-orange-50",
    items: [
      { name: "Moda temática infantil", isPopular: true },
      { name: "Moda personagens infantil", isPopular: true },
    ]
  },
  {
    title: "Premium / Diferenciação",
    color: "text-emerald-500 bg-emerald-50",
    items: [
      { name: "Moda sustentável infantil" },
    ]
  },
  {
    title: "Produtos / Complementos",
    color: "text-indigo-500 bg-indigo-50",
    items: [
      { name: "Calçados infantis", isPopular: true },
      { name: "Acessórios infantis", isPopular: true },
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
            <span className="bg-pink-100 text-pink-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Destaque</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
  </button>
);

export const FashionKidsView: React.FC<FashionKidsViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Planeta Kids JPA',
      category: 'Moda',
      subcategory: 'Infantil',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200',
      description: 'A maior variedade de moda infantil e juvenil do bairro. Roupas, calçados e acessórios para todas as idades.',
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
          <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Moda — Kids</h1>
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
                      <Baby size={24} className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-xl uppercase tracking-tighter leading-tight mb-1">O universo infantil <br/> mais completo da cidade.</h3>
                      <p className="text-blue-100 text-xs font-medium leading-relaxed max-w-[220px]">Encontre as melhores marcas e lojas para seus pequenos em Jacarepaguá. <span className="underline ml-1">Explorar</span></p>
                  </div>
              </div>
          </div>

          {GROUPS.map((group, idx) => (
            <section key={idx} className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
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
              <Heart size={20} className="text-pink-500" fill="currentColor" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Kids Fashion Hub</p>
          </div>
        </main>
      </div>
    </div>
  );
};
