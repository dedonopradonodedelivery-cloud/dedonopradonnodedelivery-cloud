
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Check } from 'lucide-react';
import { Category, Store, AdType } from '../types';
import { SUBCATEGORIES } from '../constants';

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
}

const CARD_GRADIENTS = [
  "bg-gradient-to-br from-[#1E5BFF] to-[#4D7CFF]", 
  "bg-gradient-to-br from-orange-500 to-amber-600",     
  "bg-gradient-to-br from-purple-500 to-indigo-600", 
  "bg-gradient-to-br from-emerald-500 to-teal-600",  
  "bg-gradient-to-br from-blue-500 to-cyan-600",     
  "bg-gradient-to-br from-pink-500 to-fuchsia-600",
  "bg-gradient-to-br from-rose-500 to-red-600",
  "bg-gradient-to-br from-slate-600 to-slate-800",
];

const FALLBACK_ADS = [
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=800&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop', 
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', 
];

const generateSubcategoryStores = (subName: string, categoryName: string): Store[] => {
  return Array.from({ length: 12 }).map((_, i) => {
    const isSponsored = i < 2;
    const hasCashback = i % 3 === 0;
    
    return {
      id: `fake-${categoryName}-${subName}-${i}`,
      name: `${subName} ${['Prime', 'Express', 'Vila', 'Freguesia'][i % 4]}`,
      category: categoryName,
      subcategory: subName,
      logoUrl: '/assets/default-logo.png', 
      rating: Number((4.2 + Math.random() * 0.8).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 100) + 5,
      description: `Excelência em ${subName} no coração da Freguesia.`,
      distance: `${(0.5 + Math.random() * 2).toFixed(1)}km`,
      adType: isSponsored ? AdType.PREMIUM : AdType.ORGANIC,
      isSponsored: isSponsored,
      verified: true,
      cashback: hasCashback ? Math.floor(Math.random() * 5) + 3 : undefined,
      address: 'Freguesia, Jacarepaguá',
      isOpenNow: true
    };
  });
};

const sortStoresByHierarchy = (list: Store[]) => {
  return list.sort((a, b) => {
    const aSponsored = a.isSponsored || a.adType === AdType.PREMIUM;
    const bSponsored = b.isSponsored || b.adType === AdType.PREMIUM;

    if (aSponsored && !bSponsored) return -1;
    if (!aSponsored && bSponsored) return 1;

    return 0;
  });
};

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const subcategories = useMemo(() => {
    const key = category.name === 'Comida' || category.name === 'Alimentação' ? 'Alimentação' : category.name;
    return SUBCATEGORIES[key] || SUBCATEGORIES['default'];
  }, [category.name]);

  const bannerImages = useMemo(() => {
    return FALLBACK_ADS.sort(() => Math.random() - 0.5).slice(0, 5); 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const displayStores = useMemo(() => {
    let baseList: Store[] = [];

    if (selectedSubcategory) {
      baseList = generateSubcategoryStores(selectedSubcategory, category.name);
    } else {
      baseList = stores.filter((store) => {
        const storeCat = store.category.toLowerCase();
        const currentCat = category.name.toLowerCase();
        return storeCat === currentCat || storeCat.includes(currentCat);
      });
      
      if (baseList.length === 0) {
         baseList = generateSubcategoryStores(category.name, category.name);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      baseList = baseList.filter(s => s.name.toLowerCase().includes(q));
    }

    return sortStoresByHierarchy(baseList);
  }, [selectedSubcategory, category.name, stores, searchQuery]);

  const handleSubcategoryClick = (subName: string) => {
    const isSelected = selectedSubcategory === subName;
    setSelectedSubcategory(isSelected ? null : subName);
    
    if (!isSelected) {
        setTimeout(() => {
            listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 h-[72px]">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">{category.name}</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-5 space-y-8">
        <div className="w-full aspect-[2/1] rounded-3xl overflow-hidden relative shadow-md bg-gray-200 dark:bg-gray-800 animate-in fade-in duration-500">
          {bannerImages.map((img, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}>
              <img src={img} alt="Destaque" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-white/20">
                  <span className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-wider">Patrocinado</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-end justify-between mb-4 px-1">
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-lg leading-none">Subcategorias</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Escolha para filtrar</p>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {subcategories.slice(0, 8).map((sub, idx) => {
              const isSelected = selectedSubcategory === sub.name;
              const gradientClass = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
              
              return (
                <button 
                  key={idx}
                  onClick={() => handleSubcategoryClick(sub.name)}
                  className={`
                    relative h-[110px] min-w-[110px] rounded-2xl overflow-hidden shadow-sm transition-all duration-200 active:scale-[0.97] group text-left p-3 flex flex-col justify-between
                    ${isSelected ? 'ring-4 ring-[#1E5BFF] ring-offset-2 ring-offset-white dark:ring-offset-gray-950 scale-95' : 'border border-transparent'}
                    ${gradientClass}
                  `}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    {React.isValidElement(sub.icon) 
                      ? React.cloneElement(sub.icon as React.ReactElement<any>, { className: "w-4 h-4 text-white" })
                      : null
                    }
                  </div>

                  <span className="relative z-10 font-bold text-white text-[11px] leading-tight drop-shadow-md uppercase tracking-tighter">
                    {sub.name}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 z-20 shadow-md">
                      <Check className="w-2.5 h-2.5 text-[#1E5BFF]" strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={listRef} className="scroll-mt-24">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {selectedSubcategory ? selectedSubcategory : `Destaques em ${category.name}`}
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{displayStores.length} locais</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {displayStores.map((store) => {
              const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
              return (
                <div
                  key={store.id}
                  onClick={() => onStoreClick(store)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 flex gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="w-20 h-20 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                    <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain" />
                    {store.cashback && (
                       <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[8px] font-black text-center py-0.5 uppercase tracking-tighter">
                         {store.cashback}% VOLTA
                       </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-start gap-2">
                       <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{store.name}</h4>
                       {isSponsored && (
                          <span className="flex-shrink-0 text-[8px] font-black bg-blue-50 text-[#1E5BFF] px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-widest">ADS</span>
                       )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                       <div className="flex items-center gap-0.5 text-[#1E5BFF] font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{store.rating}</span>
                       </div>
                       <span className="opacity-30">•</span>
                       <span className="truncate">{store.subcategory}</span>
                    </div>
                    
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1 italic">{store.description}</p>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
