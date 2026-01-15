
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter, Megaphone, ArrowUpRight } from 'lucide-react';
import { Category, Store, AdType } from '../types';
import { SUBCATEGORIES } from '../constants';

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  userRole?: 'cliente' | 'lojista' | null;
  onAdvertiseInCategory?: (categoryName: string) => void;
}

// --- Componente de Card Padronizado (Estilo macOS Big Sur - Colorido) ---
const BigSurCard: React.FC<{ 
  icon: React.ReactNode; 
  name: string; 
  isSelected: boolean; 
  onClick: () => void; 
  isMoreButton?: boolean;
  categoryColor?: string;
}> = ({ icon, name, isSelected, onClick, isMoreButton, categoryColor }) => {
  
  const baseClasses = `
    relative w-full aspect-square rounded-[24px] flex flex-col items-center justify-center gap-2 
    transition-all duration-300 cursor-pointer overflow-hidden border
  `;

  const backgroundClass = isMoreButton 
    ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" 
    : `bg-gradient-to-br ${categoryColor || 'from-blue-500 to-blue-600'} border-transparent shadow-md`;

  const textClass = isMoreButton 
    ? "text-gray-500 dark:text-gray-400" 
    : "text-white drop-shadow-sm";

  const iconContainerClass = isMoreButton
    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
    : "bg-white/20 text-white backdrop-blur-md border border-white/20";

  const selectionEffects = isSelected
    ? "ring-4 ring-black/10 dark:ring-white/20 scale-[0.96] brightness-110 shadow-inner" 
    : "hover:shadow-lg hover:-translate-y-1 hover:brightness-105";

  return (
    <button onClick={onClick} className={`${baseClasses} ${backgroundClass} ${selectionEffects}`}>
      <div className={`
        w-10 h-10 rounded-2xl flex items-center justify-center transition-colors
        ${iconContainerClass}
      `}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { 
          className: `w-5 h-5`, 
          strokeWidth: 2.5 
        }) : null}
      </div>
      <span className={`text-[10px] font-bold leading-tight px-1 truncate w-full text-center tracking-tight ${textClass}`}>
        {name}
      </span>
    </button>
  );
};

const StoreListItem: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white dark:hover:bg-gray-800 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
    >
      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain p-1" />
        {store.cashback && (
          <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-white text-[8px] font-bold text-center py-0.5">
            {store.cashback}%
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{store.name}</h4>
          {isSponsored && (
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
};

const FALLBACK_ADS = [
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=800&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop', 
];

const generateMockStoresForCategory = (categoryName: string, subcategoryName?: string): Store[] => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: `mock-${categoryName}-${i}`,
    name: `${categoryName} ${subcategoryName ? subcategoryName : 'Local'} ${i + 1}`,
    category: categoryName,
    subcategory: subcategoryName || 'Geral',
    rating: 4.5,
    reviewsCount: 10 + i,
    adType: i === 0 ? AdType.PREMIUM : AdType.ORGANIC,
    logoUrl: '/assets/default-logo.png',
    distance: '1.2km',
    description: `O melhor de ${categoryName}`,
    verified: i % 2 === 0,
    cashback: i % 3 === 0 ? 5 : undefined
  }));
};

const CategoryAdsCarousel: React.FC<{ 
  userRole?: 'cliente' | 'lojista' | null; 
  onAdvertise: () => void;
}> = ({ userRole, onAdvertise }) => {
  const occupiedSlots = [
    { 
      id: 'ad1', 
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop', 
      title: 'Melhores Ofertas', 
      merchant: 'Supermercado Central' 
    },
  ];

  const showAdvertiseSlot = userRole === 'lojista';
  const activeSlot = occupiedSlots.length > 0 ? occupiedSlots[0] : null;

  return (
    <div className="px-5 pb-6">
      {activeSlot ? (
        <div className="w-full relative aspect-[5/3] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 group cursor-pointer active:scale-[0.98] transition-all">
           <img src={activeSlot.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <span className="text-[10px] font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full w-fit mb-2 uppercase tracking-widest backdrop-blur-md border border-white/10">Patrocinado</span>
              <h4 className="text-white font-black text-2xl leading-tight mb-1 drop-shadow-md">{activeSlot.title}</h4>
              <p className="text-white/80 text-sm font-medium truncate">{activeSlot.merchant}</p>
           </div>
        </div>
      ) : showAdvertiseSlot ? (
        <button 
          onClick={onAdvertise}
          className="w-full relative aspect-[5/3] rounded-[32px] overflow-hidden shadow-xl shadow-indigo-500/20 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-indigo-600 to-purple-700 group active:scale-[0.98] transition-all"
        >
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg border border-white/10">
              <Megaphone className="w-7 h-7 text-white" />
           </div>
           <h3 className="text-white font-black text-xl uppercase tracking-wide mb-2 drop-shadow-md">
              Anuncie nesta categoria
           </h3>
           <p className="text-white/80 text-xs font-medium max-w-[200px] leading-relaxed mb-4">
              Apareça no topo para quem já está procurando pelo seu serviço.
           </p>
           <div className="bg-white text-indigo-700 text-xs font-bold px-5 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 group-hover:bg-indigo-50 transition-colors">
              Ver planos <ArrowUpRight className="w-3.5 h-3.5" />
           </div>
        </button>
      ) : null}
    </div>
  );
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores, userRole, onAdvertiseInCategory }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isAnimatingList, setIsAnimatingList] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const subcategories = useMemo(() => {
    const key = category.name === 'Comida' ? 'Alimentação' : category.name;
    return SUBCATEGORIES[key] || SUBCATEGORIES['default'];
  }, [category.name]);

  const MAX_VISIBLE = 8;
  const shouldShowMore = subcategories.length > MAX_VISIBLE;
  
  const visibleSubcategories = useMemo(() => {
      if (shouldShowMore) {
          return subcategories.slice(0, MAX_VISIBLE - 1);
      }
      return subcategories.slice(0, MAX_VISIBLE);
  }, [subcategories, shouldShowMore]);

  const displayStores = useMemo(() => {
    let filtered = stores.filter(s => {
       return s.category.toLowerCase().includes(category.name.toLowerCase()) || 
              category.name.toLowerCase().includes(s.category.toLowerCase());
    });

    if (filtered.length === 0) {
        filtered = generateMockStoresForCategory(category.name, selectedSubcategory || undefined);
    }

    if (selectedSubcategory) {
        filtered = filtered.filter(s => s.subcategory === selectedSubcategory || s.subcategory.includes(selectedSubcategory));
        if (filtered.length === 0) {
             filtered = generateMockStoresForCategory(category.name, selectedSubcategory);
        }
    }

    if (searchQuery) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [stores, category.name, selectedSubcategory, searchQuery]);

  const handleSubcategoryClick = (subName: string) => {
    setIsAnimatingList(true);
    setTimeout(() => {
        if (selectedSubcategory === subName) {
            setSelectedSubcategory(null);
        } else {
            setSelectedSubcategory(subName);
        }
        setIsAnimatingList(false);
    }, 200);
  };

  const handleSeeAll = () => {
      alert("Abrir modal com todas as subcategorias: " + subcategories.map(s => s.name).join(", "));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300">
      <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 transition-all">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        
        {isSearchOpen ? (
            <div className="flex-1 mx-2 relative animate-in fade-in zoom-in-95 duration-200">
                <input 
                    type="text" 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Buscar em ${category.name}...`}
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-[#1E5BFF] shadow-inner dark:text-white"
                />
            </div>
        ) : (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white font-display">{category.name}</h1>
        )}

        <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isSearchOpen ? <X className="w-6 h-6 text-gray-800 dark:text-gray-200" /> : <Search className="w-6 h-6 text-gray-800 dark:text-gray-200" />}
        </button>
      </header>

      <main className="pt-20 space-y-6">
        {!isSearchOpen && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-3 px-5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Em Destaque</h3>
                </div>
                <CategoryAdsCarousel 
                    userRole={userRole} 
                    onAdvertise={() => onAdvertiseInCategory && onAdvertiseInCategory(category.name)} 
                />
            </section>
        )}

        {!isSearchOpen && (
            <section className="px-5">
              <div className="flex flex-col mb-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">O que você procura?</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">Categorias de {category.name}</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {visibleSubcategories.map((sub, i) => (
                    <BigSurCard 
                      key={i} 
                      icon={sub.icon}
                      name={sub.name}
                      isSelected={selectedSubcategory === sub.name}
                      onClick={() => handleSubcategoryClick(sub.name)}
                      categoryColor={category.color}
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

        <section className="px-5 min-h-[400px] bg-white dark:bg-gray-900 rounded-t-[32px] pt-6 pb-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    {selectedSubcategory ? selectedSubcategory : `Explorar ${category.name}`}
                    {selectedSubcategory && (
                        <button onClick={() => handleSubcategoryClick(selectedSubcategory)} className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-600">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </h3>
                <div className="flex items-center gap-1 text-[#1E5BFF] text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                    <Filter className="w-3 h-3" />
                    <span>{displayStores.length} locais</span>
                </div>
            </div>
            <div className={`flex flex-col gap-2 transition-opacity duration-300 ${isAnimatingList ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {displayStores.map((store) => (
                    <StoreListItem key={store.id} store={store} onClick={() => onStoreClick(store)} />
                ))}
                {displayStores.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">Nenhum local encontrado.</p>
                        <button onClick={() => setSelectedSubcategory(null)} className="mt-4 text-[#1E5BFF] font-bold text-sm">Ver todas as opções</button>
                    </div>
                )}
            </div>
        </section>
      </main>
    </div>
  );
};
