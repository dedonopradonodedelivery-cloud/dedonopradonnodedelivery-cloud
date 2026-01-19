import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, Search, ImageIcon, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter } from 'lucide-react';
import { SUBCATEGORIES } from '../constants';
import { Store, AdType } from '../types';

interface BannerAd {
  id: string;
  image: string;
  title: string;
  link?: string;
  merchantName?: string;
}

// --- MOCK DATA GENERATOR FOR DEMO ---
// Gera lojas falsas para popular a lista vertical e demonstrar o filtro
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
      // FIX: Changed 'cashback' to 'cashback_percent' to match Store interface
      cashback_percent: Math.random() > 0.5 ? Math.floor(Math.random() * 8) + 2 : undefined,
      isOpenNow: Math.random() > 0.2
    };
  });
};

const ALL_FOOD_STORES = generateMockFoodStores();

const HighlightBanner: React.FC<{ banner: BannerAd; onClick: (id: string) => void; }> = ({ banner, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      onClick={() => onClick(banner.id)}
      className="snap-center flex-shrink-0 w-full h-[160px] rounded-[24px] shadow-lg shadow-black/5 overflow-hidden relative group cursor-pointer"
    >
      {imageError ? (
        <div className="w-full h-full bg-[#F2F2F2] dark:bg-gray-700 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
      ) : (
        <img 
          src={banner.image} 
          alt={banner.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
          onError={() => setImageError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-5">
        <p className="text-white font-bold text-lg drop-shadow-md leading-tight">{banner.title}</p>
      </div>
      {banner.merchantName && (
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 text-white text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 uppercase tracking-widest shadow-sm">
            Patrocinado
          </div>
        </div>
      )}
    </div>
  );
};

const BigSurCard: React.FC<{ 
  icon: React.ReactNode; 
  name: string; 
  isSelected: boolean; 
  onClick: () => void; 
  isMoreButton?: boolean;
}> = ({ icon, name, isSelected, onClick, isMoreButton }) => {
  
  // Paleta de gradientes "Big Sur" inspirados
  const baseClasses = `
    relative w-full aspect-square rounded-[20px] flex flex-col items-center justify-center gap-2 
    transition-all duration-300 active:scale-90 cursor-pointer overflow-hidden border
  `;

  const selectedClasses = isSelected
    ? "bg-gradient-to-br from-[#1E5BFF] to-[#0040DD] border-blue-500/20 shadow-lg shadow-blue-500/30 text-white ring-2 ring-offset-2 ring-[#1E5BFF] dark:ring-offset-gray-900"
    : isMoreButton
      ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-md hover:-translate-y-0.5";

  return (
    <button onClick={onClick} className={`${baseClasses} ${selectedClasses}`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center transition-colors
        ${isSelected 
          ? 'bg-white/20 text-white' 
          : isMoreButton 
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            : 'bg-blue-50 dark:bg-blue-900/20 text-[#1E5BFF] dark:text-blue-400'
        }
      `}>
        {React.cloneElement(icon as React.ReactElement<any>, { 
          className: `w-4 h-4`, 
          strokeWidth: 2.5 
        })}
      </div>
      <span className="text-[10px] font-bold leading-tight px-1 truncate w-full text-center tracking-tight">
        {name}
      </span>
    </button>
  );
};

const FoodStoreItem: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white dark:hover:bg-gray-800 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
  >
    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
      <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain" />
      {/* FIX: Changed 'cashback' to 'cashback_percent' to match Store interface */}
      {store.cashback_percent && (
        <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[8px] font-bold text-center py-0.5">
          {store.cashback_percent}%
        </div>
      )}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{store.name}</h4>
        {store.isSponsored && (
          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">Ads</span>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        <span className="flex items-center gap-1 font-bold text-[#1E5BFF]">
          <Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
        <span className="truncate">{store.subcategory}</span>
      </div>

      <div className="flex items-center gap-3 mt-1.5">
        {store.distance && (
          <span className="text-[10px] text-gray-400 font-medium">{store.distance}</span>
        )}
        {store.verified && (
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
            <BadgeCheck className="w-3 h-3" /> Verificado
          </span>
        )}
      </div>
    </div>
    
    <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300">
      <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

const HIGHLIGHTS_DATA: BannerAd[] = [
  {
    id: 'ad-1',
    title: 'Festival de Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
    merchantName: 'Hamburgueria Brasa',
  },
  {
    id: 'ad-2',
    title: 'Café da Manhã Colonial',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop',
    merchantName: 'Padaria Imperial',
  },
];

interface CategoriaAlimentacaoProps {
  onBack: () => void;
  onSelectSubcategory: (subcategoryName: string) => void;
}

export const CategoriaAlimentacao: React.FC<CategoriaAlimentacaoProps> = ({ onBack, onSelectSubcategory }) => {
    const rawSubcategories = SUBCATEGORIES['Alimentação'] || SUBCATEGORIES['Comida'] || [];
    
    // Logic for Grid (Max 8 items: 7 categories + 1 "More" button if needed)
    const MAX_VISIBLE = 8;
    const shouldShowMore = rawSubcategories.length > MAX_VISIBLE;
    
    const visibleSubcategories = useMemo(() => {
        if (shouldShowMore) {
            return rawSubcategories.slice(0, MAX_VISIBLE - 1);
        }
        return rawSubcategories;
    }, [rawSubcategories, shouldShowMore]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSub, setSelectedSub] = useState<string | null>(null);
    const [isAnimatingList, setIsAnimatingList] = useState(false);

    // Filter Stores based on selection
    const displayedStores = useMemo(() => {
        if (!selectedSub) return ALL_FOOD_STORES;
        return ALL_FOOD_STORES.filter(s => s.subcategory === selectedSub);
    }, [selectedSub]);

    const handleSubClick = (subName: string) => {
        setIsAnimatingList(true);
        setTimeout(() => {
            if (selectedSub === subName) {
                setSelectedSub(null); // Toggle off
            } else {
                setSelectedSub(subName);
            }
            setIsAnimatingList(false);
        }, 200); // 200ms delay for transition effect
    };

    const handleSeeAll = () => {
        // Here you would open a modal or navigate to a full list
        alert("Abrir modal com todas as categorias");
    };

    return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 font-sans pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 transition-all">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
        
        {isSearchOpen ? (
            <div className="flex-1 mx-2 relative animate-in fade-in zoom-in-95 duration-200">
                <input 
                    type="text" 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar prato ou restaurante..."
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#1E5BFF] shadow-inner dark:text-white"
                />
            </div>
        ) : (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white font-display">Alimentação</h1>
        )}

        <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isSearchOpen ? <X className="w-6 h-6 text-gray-800 dark:text-gray-200" /> : <Search className="w-6 h-6 text-gray-800 dark:text-gray-200" />}
        </button>
      </header>

      <main className="pt-20 space-y-8">
        
        {/* Banner Section (Optional) */}
        {!isSearchOpen && !selectedSub && (
            <section className="px-5">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Destaques</h2>
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-5 px-5">
                  {HIGHLIGHTS_DATA.map(banner => (
                      <HighlightBanner key={banner.id} banner={banner} onClick={() => {}} />
                  ))}
              </div>
            </section>
        )}

        {/* Categories Grid (4x2 Fixed) */}
        {!isSearchOpen && (
            <section className="px-5">
              <div className="flex flex-col mb-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">O que você deseja?</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">Categorias de Alimentação</p>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {visibleSubcategories.map((sub, i) => (
                    <BigSurCard 
                      key={i} 
                      icon={sub.icon}
                      name={sub.name}
                      isSelected={selectedSub === sub.name}
                      onClick={() => handleSubClick(sub.name)}
                    />
                ))}
                {shouldShowMore && (
                    <BigSurCard 
                        icon={<Grid />} 
                        name="Ver Todas" 
                        isSelected={false} 
                        isMoreButton 
                        onClick={handleSeeAll} 
                    />
                )}
              </div>
            </section>
        )}

        {/* Store List */}
        <section className="px-5 min-h-[400px] bg-white dark:bg-gray-900 rounded-t-[32px] pt-6 pb-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    {selectedSub ? selectedSub : 'Destaques em Alimentação'}
                    {selectedSub && (
                        <button onClick={() => handleSubClick(selectedSub)} className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-600">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </h3>
                <div className="flex items-center gap-1 text-[#1E5BFF] text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                    <Filter className="w-3 h-3" />
                    <span>{displayedStores.length} locais</span>
                </div>
            </div>

            <div className={`flex flex-col gap-2 transition-opacity duration-300 ${isAnimatingList ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {displayedStores.map((store) => (
                    <FoodStoreItem 
                        key={store.id} 
                        store={store} 
                        onClick={() => {}} // Navigate to store details
                    />
                ))}
                
                {displayedStores.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">Nenhum local encontrado nesta categoria.</p>
                        <button onClick={() => setSelectedSub(null)} className="mt-4 text-[#1E5BFF] font-bold text-sm">
                            Ver todas as categorias
                        </button>
                    </div>
                )}
            </div>
        </section>

      </main>
    </div>
  );
};