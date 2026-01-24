import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, ShoppingBag, Utensils, Pizza, Coffee, Beef, ImageIcon, AlertCircle } from 'lucide-react';
import { Store, AdType } from '../types';

interface BannerAd {
  id: string;
  image: string;
  title: string;
  link?: string;
  merchantName?: string;
}

const generateMockFoodStores = (): Store[] => {
  const foodSubs = ['Restaurantes', 'Padarias', 'Lanches', 'Pizzarias', 'Cafeterias', 'Japonês / Oriental', 'Churrascarias', 'Doces & Sobremesas'];
  return Array.from({ length: 20 }).map((_, i) => {
    const sub = foodSubs[i % foodSubs.length];
    return {
      id: `food-store-${i}`,
      name: `${sub} ${['Gourmet', 'Express', 'da Família', 'Premium', 'do Chef'][i % 5]}`,
      category: 'Alimentação',
      subcategory: sub,
      logoUrl: '/assets/default-logo.png',
      rating: 4.0 + (Math.random()),
      reviewsCount: Math.floor(Math.random() * 500) + 10,
      description: `O melhor de ${sub} na região.`,
      distance: `${(Math.random() * 3).toFixed(1)}km`,
      adType: i % 6 === 0 ? AdType.PREMIUM : AdType.ORGANIC,
      isSponsored: i % 6 === 0,
      verified: Math.random() > 0.3,
      isOpenNow: Math.random() > 0.2
    };
  });
};

const ALL_FOOD_STORES = generateMockFoodStores();

const HighlightBanner: React.FC<{ banner: BannerAd; onClick: (id: string) => void; }> = ({ banner, onClick }) => {
  return (
    <div 
      onClick={() => onClick(banner.id)} 
      className="snap-center flex-shrink-0 w-full h-[180px] rounded-[32px] overflow-hidden relative shadow-xl cursor-pointer group active:scale-[0.98] transition-all"
    >
      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Destaque do Dia</span>
        <h3 className="text-xl font-bold text-white leading-tight">{banner.title}</h3>
        {banner.merchantName && <p className="text-xs text-white/70 mt-1">{banner.merchantName}</p>}
      </div>
    </div>
  );
};

export const CategoriaAlimentacao: React.FC<{ onBack: () => void; onStoreClick: (store: Store) => void }> = ({ onBack, onStoreClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const banners: BannerAd[] = [
    { id: 'b1', title: 'Festival de Inverno', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', merchantName: 'Pizzaria do Zé' },
    { id: 'b2', title: 'Burgers Artesanais', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800', merchantName: 'Bibi Lanches' }
  ];

  const filteredStores = useMemo(() => {
    return ALL_FOOD_STORES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSub = activeSub ? s.subcategory === activeSub : true;
      return matchesSearch && matchesSub;
    });
  }, [searchTerm, activeSub]);

  const subcategories = Array.from(new Set(ALL_FOOD_STORES.map(s => s.subcategory)));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Alimentação</h1>
        </div>
      </header>

      <main className="p-5 space-y-8">
        {/* Banner Section */}
        <div className="flex gap-4 overflow-x-auto snap-x no-scrollbar -mx-5 px-5 pb-2">
            {banners.map(b => (
                <HighlightBanner key={b.id} banner={b} onClick={() => {}} />
            ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Qual o sabor de hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 transition-all dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
           {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSub(activeSub === sub ? null : sub)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeSub === sub ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
              >
                {sub}
              </button>
           ))}
        </div>

        {/* Results */}
        <div className="space-y-4">
            {filteredStores.length > 0 ? filteredStores.map(store => (
                <div
                    key={store.id}
                    onClick={() => onStoreClick(store)}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 active:scale-[0.98] transition-all cursor-pointer"
                >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600">
                        <img src={store.logoUrl} className="w-full h-full object-cover" alt={store.name} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                            {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-blue-50 dark:fill-gray-900 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{store.subcategory} • {store.distance}</p>
                        <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                                <Star size={10} className="fill-current" />
                                {store.rating.toFixed(1)}
                             </div>
                             {store.isOpenNow && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Aberto</span>}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <ChevronRight className="w-5 h-5 text-gray-200" />
                    </div>
                </div>
            )) : (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">Nenhum resultado encontrado</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};