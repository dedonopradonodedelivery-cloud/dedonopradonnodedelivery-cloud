
import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, ShoppingBag, Gem, Zap, Star, LayoutGrid, Shirt } from 'lucide-react';
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

interface FashionWomenViewProps {
  onBack: () => void;
  onSelect: (category: string) => void;
  onNavigate: (view: string) => void;
  onStoreClick: (store: Store) => void;
}

const GROUPS: SpecialtyGroup[] = [
  {
    title: "Estilos / Ocasiões",
    color: "text-rose-500 bg-rose-50",
    items: [
      { name: "Moda casual feminina", isPopular: true },
      { name: "Moda social feminina" },
      { name: "Moda executiva feminina" },
      { name: "Moda festa feminina", isPopular: true },
    ]
  },
  {
    title: "Segmentos / Nichos",
    color: "text-purple-500 bg-purple-50",
    items: [
      { name: "Moda jovem feminina" },
      { name: "Moda praia feminina", isPopular: true },
      { name: "Moda fitness feminina", isPopular: true },
      { name: "Moda plus size feminina" },
      { name: "Moda gestante" },
      { name: "Moda evangélica feminina" },
    ]
  },
  {
    title: "Premium / Diferenciação",
    color: "text-amber-600 bg-amber-50",
    items: [
      { name: "Moda luxo feminina", isPopular: true },
      { name: "Moda sustentável feminina" },
    ]
  },
  {
    title: "Produtos / Complementos",
    color: "text-indigo-600 bg-indigo-50",
    items: [
      { name: "Moda íntima feminina" },
      { name: "Lingerie" },
      { name: "Acessórios femininos", isPopular: true },
      { name: "Bolsas femininas" },
      { name: "Calçados femininos", isPopular: true },
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
            <span className="bg-rose-100 text-rose-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Trend</span>
        )}
    </div>
    <ChevronRight size={16} className="text-gray-300 group-hover:text-rose-500 transition-colors" />
  </button>
);

export const FashionWomenView: React.FC<FashionWomenViewProps> = ({ onBack, onSelect, onNavigate, onStoreClick }) => {
  const handleHeroClick = () => {
    onStoreClick({
      name: 'Boutique Elegance JPA',
      category: 'Moda',
      subcategory: 'Feminino',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
      description: 'Tendências da estação selecionadas para a mulher moderna de Jacarepaguá. Peças exclusivas e atendimento diferenciado.',
    } as Store);
  };

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
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Moda — Mulher</h1>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">Estilo & Tendência ✨</p>
          </div>
        </div>
        <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 relative">
        {/* Banner de Inspiração - Clicável */}
        <div 
            onClick={handleHeroClick}
            className="p-8 bg-rose-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden cursor-pointer active:scale-[0.99] transition-all group"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-black text-xl uppercase tracking-tighter leading-tight mb-1">O seu estilo, <br/>perto de você.</h3>
                    <p className="text-rose-100 text-xs font-medium leading-relaxed max-w-[220px]">Encontre as melhores lojas de moda feminina de Jacarepaguá. <span className="underline ml-1">Ver</span></p>
                </div>
            </div>
        </div>

        {GROUPS.map((group, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
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
            <Heart size={20} className="text-rose-500" fill="currentColor" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Localizei JPA • Fashion Hub</p>
        </div>
      </main>
    </div>
  );
};
