
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter, Megaphone, ArrowUpRight, Info } from 'lucide-react';
import { Category, Store, AdType } from '../types';
import { SUBCATEGORIES } from '../constants';

// --- INTERFACES & MOCK DATA FOR PROMO BANNERS ---

interface PromoBanner {
  id: string;
  type: 'merchant' | 'institutional';
  title: string;
  subtitle?: string;
  bgColor: string; 
  textColor: string;
  merchantName?: string;
  subcategoryTarget?: string; 
  link?: string;
  image?: string;
}

const INSTITUTIONAL_FALLBACKS: PromoBanner[] = [
  {
    id: 'inst-1',
    type: 'institutional',
    title: 'Anuncie sua Loja Aqui',
    subtitle: 'Alcance milhares de vizinhos',
    bgColor: 'bg-gradient-to-r from-slate-900 to-slate-800',
    textColor: 'text-white',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'inst-2',
    type: 'institutional',
    title: 'Clube de Vantagens',
    subtitle: 'Descontos exclusivos no bairro',
    bgColor: 'bg-gradient-to-r from-[#1E5BFF] to-[#0040DD]',
    textColor: 'text-white'
  },
  {
    id: 'inst-3',
    type: 'institutional',
    title: 'Apoie o Comércio Local',
    subtitle: 'A Freguesia cresce com você',
    bgColor: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    textColor: 'text-white'
  }
];

const MERCHANT_ADS_MOCK: PromoBanner[] = [
  {
    id: 'ad-burger-1',
    type: 'merchant',
    title: 'Burger Artesanal 2x1',
    subtitle: 'Só hoje na Hamburgueria Brasa',
    merchantName: 'Hamburgueria Brasa',
    subcategoryTarget: 'Hamburguerias', 
    bgColor: 'bg-[#FF9F1C]',
    textColor: 'text-black',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ad-pizza-1',
    type: 'merchant',
    title: 'Rodízio de Pizza',
    subtitle: 'Crianças não pagam!',
    merchantName: 'Pizzaria do Zé',
    subcategoryTarget: 'Pizzarias',
    bgColor: 'bg-[#E71D36]',
    textColor: 'text-white'
  }
];

// --- COMPONENTE INDEPENDENTE: SUBCATEGORY CAROUSEL ---

const SubcategoryCarousel: React.FC<{ subcategory: string }> = ({ subcategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayBanners = useMemo(() => {
    const activeMerchantAds = MERCHANT_ADS_MOCK.filter(ad => 
      ad.subcategoryTarget && subcategory.toLowerCase().includes(ad.subcategoryTarget.toLowerCase())
    );
    const needed = 3 - activeMerchantAds.length;
    const fillers = INSTITUTIONAL_FALLBACKS.slice(0, Math.max(0, needed));
    return [...activeMerchantAds, ...fillers].slice(0, 3);
  }, [subcategory]);

  useEffect(() => {
    const interval = setInterval(() => {
        const nextSlide = (currentSlide + 1) % 3;
        setCurrentSlide(nextSlide);
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollTo({ left: width * nextSlide, behavior: 'smooth' });
        }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleScroll = () => {
      if (scrollRef.current) {
          const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
          if (index !== currentSlide) setCurrentSlide(index);
      }
  };

  return (
    <div className="relative">
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-[24px] shadow-sm"
        >
            {displayBanners.map((banner, idx) => (
                <div 
                    key={`${banner.id}-${idx}`} 
                    className={`w-full flex-shrink-0 aspect-[5/2] snap-center relative overflow-hidden ${banner.bgColor} flex flex-col justify-center px-6`}
                >
                    {banner.image && (
                        <div className="absolute inset-0 z-0">
                            <img src={banner.image} alt="" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                        </div>
                    )}

                    <div className="relative z-10 max-w-[80%]">
                        {banner.type === 'merchant' && (
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1 block" style={{ color: banner.textColor }}>
                                {banner.merchantName} apresenta:
                            </span>
                        )}
                        {banner.type === 'institutional' && (
                            <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                                <BadgeCheck className="w-3 h-3" color={banner.textColor === 'text-white' ? '#fff' : '#000'} />
                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: banner.textColor }}>Dica Localizei</span>
                            </div>
                        )}
                        
                        <h3 className={`text-xl font-black leading-tight mb-1 ${banner.textColor} drop-shadow-sm font-display`}>
                            {banner.title}
                        </h3>
                        
                        <p className={`text-xs font-medium opacity-90 ${banner.textColor}`}>
                            {banner.subtitle}
                        </p>
                    </div>

                    <div className="absolute top-3 right-3 bg-black/10 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        <span className="text-[8px] font-bold text-white/80 uppercase">
                            {banner.type === 'merchant' ? 'Publicidade' : 'App'}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {[0, 1, 2].map((idx) => (
                <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                    }`} 
                />
            ))}
        </div>
    </div>
  );
};

const BigSurCard: React.FC<{ 
  icon: React.ReactNode; 
  name: string; 
  isSelected: boolean; 
  onClick: () => void; 
  isMoreButton?: boolean;
  categoryColor?: string;
}> = ({ icon, name, isSelected, onClick, isMoreButton, categoryColor }) => {
  const baseClasses = `relative w-full aspect-square rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer overflow-hidden border`;
  const backgroundClass = isMoreButton ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" : `${categoryColor || 'bg-brand-blue'} border-transparent shadow-md`;
  const textClass = isMoreButton ? "text-gray-500 dark:text-gray-400" : "text-white drop-shadow-sm";
  const iconContainerClass = isMoreButton ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" : "bg-white/20 text-white backdrop-blur-md border border-white/20";
  const selectionEffects = isSelected ? "ring-4 ring-black/10 dark:ring-white/20 scale-[0.96] brightness-110 shadow-inner" : "hover:shadow-lg hover:-translate-y-1 hover:brightness-105";
  return (
    <button onClick={onClick} className={`${baseClasses} ${backgroundClass} ${selectionEffects}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${iconContainerClass}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5`, strokeWidth: 2.5 }) : null}
      </div>
      <span className={`text-[10px] font-bold leading-tight px-1 truncate w-full text-center tracking-tight ${textClass}`}>{name}</span>
    </button>
  );
};

const StoreListItem: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white dark:hover:bg-gray-800 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">Ads</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="flex items-center gap-1 font-bold text-[#1E5BFF]"><Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span className="truncate">{store.subcategory}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {store.distance && <span className="text-[10px] text-gray-400 font-medium">{store.distance}</span>}
          {store.verified && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5"><BadgeCheck className="w-3 h-3" /> Verificado</span>}
        </div>
      </div>
      <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300"><ChevronRight className="w-4 h-4" /></div>
    </div>
  );
};

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  userRole: 'cliente' | 'lojista' | null;
  onAdvertiseInCategory: (categoryName: string | null) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const subcategories = useMemo(() => SUBCATEGORIES[category.name] || [], [category.name]);
  const displayStores = useMemo(() => {
    let filtered = stores.filter(s => s.category.toLowerCase().includes(category.name.toLowerCase()));
    if (selectedSubcategory) filtered = filtered.filter(s => s.subcategory === selectedSubcategory);
    if (searchQuery) filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [stores, category.name, selectedSubcategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300">
      <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" /></button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white font-display">{category.name}</h1>
        <button onClick={() => {}} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><Search className="w-6 h-6 text-gray-800 dark:text-gray-200" /></button>
      </header>
      
      <main className="pt-20 space-y-6">
        
        {/* 1. CARROSSEL DA SUBCATEGORIA - TOPO ABSOLUTO (Logo abaixo do header) */}
        <section className="px-5">
            <SubcategoryCarousel subcategory={selectedSubcategory || category.name} />
        </section>

        {/* 2. GRID DE SUBCATEGORIAS - ABAIXO DO CARROSSEL */}
        <section className="px-5">
            <div className="grid grid-cols-4 gap-3">
            {subcategories.slice(0, 8).map((sub, i) => (
                <BigSurCard key={i} icon={sub.icon} name={sub.name} isSelected={selectedSubcategory === sub.name} onClick={() => setSelectedSubcategory(selectedSubcategory === sub.name ? null : sub.name)} categoryColor={category.color} />
            ))}
            </div>
        </section>
        
        <section className="px-5 min-h-[400px] bg-white dark:bg-gray-900 rounded-t-[32px] pt-6 pb-10 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">{selectedSubcategory || `Explorar ${category.name}`}</h3>
            
            <div className="flex flex-col gap-2">
                {displayStores.map((store) => (
                    <StoreListItem key={store.id} store={store} onClick={() => onStoreClick(store)} />
                ))}
                {displayStores.length === 0 && (
                  <div className="text-center py-10 opacity-50">
                    <p className="text-sm font-bold">Nenhum local encontrado.</p>
                  </div>
                )}
            </div>
        </section>
      </main>
    </div>
  );
};
