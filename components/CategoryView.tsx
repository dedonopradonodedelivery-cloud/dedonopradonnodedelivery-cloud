
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter } from 'lucide-react';
import { Category, Store, AdType } from '../types';
import { SUBCATEGORIES } from '../constants';

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
}

// --- Componente de Card Padronizado (Estilo macOS Big Sur) ---
const BigSurCard: React.FC<{ 
  icon: React.ReactNode; 
  name: string; 
  isSelected: boolean; 
  onClick: () => void; 
  isMoreButton?: boolean;
}> = ({ icon, name, isSelected, onClick, isMoreButton }) => {
  
  const baseClasses = `
    relative w-full aspect-square rounded-[20px] flex flex-col items-center justify-center gap-2 
    transition-all duration-300 active:scale-90 cursor-pointer overflow-hidden border
  `;

  const selectedClasses = isSelected
    ? "bg-gradient-to-br from-[#1E5BFF] to-[#0040DD] border-blue-500/20 shadow-lg shadow-blue-500/30 text-white ring-2 ring-offset-2 ring-[#1E5BFF] dark:ring-offset-gray-900"
    : isMoreButton
      ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { 
          className: `w-4 h-4`, 
          strokeWidth: 2.5 
        }) : null}
      </div>
      <span className="text-[10px] font-bold leading-tight px-1 truncate w-full text-center tracking-tight">
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
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop', 
];

// Gerador de dados falsos para popular categorias vazias (apenas para demo)
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

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isAnimatingList, setIsAnimatingList] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Obter Subcategorias
  const subcategories = useMemo(() => {
    // Tenta encontrar a chave exata, ou 'Alimentação' para 'Comida', ou usa default
    const key = category.name === 'Comida' ? 'Alimentação' : category.name;
    return SUBCATEGORIES[key] || SUBCATEGORIES['default'];
  }, [category.name]);

  // 2. Lógica da Grade 4x2 (Máximo 8 itens visíveis)
  const MAX_VISIBLE = 8;
  const shouldShowMore = subcategories.length > MAX_VISIBLE;
  
  const visibleSubcategories = useMemo(() => {
      if (shouldShowMore) {
          // Mostra 7 e o 8º vira botão
          return subcategories.slice(0, MAX_VISIBLE - 1);
      }
      return subcategories.slice(0, MAX_VISIBLE);
  }, [subcategories, shouldShowMore]);

  // 3. Banner Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % FALLBACK_ADS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 4. Filtragem de Lojas
  const displayStores = useMemo(() => {
    let filtered = stores.filter(s => {
       // Match category loosely
       return s.category.toLowerCase().includes(category.name.toLowerCase()) || 
              category.name.toLowerCase().includes(s.category.toLowerCase());
    });

    // Se estiver vazio (para fins de demo), gera mocks
    if (filtered.length === 0) {
        filtered = generateMockStoresForCategory(category.name, selectedSubcategory || undefined);
    }

    // Filtra por subcategoria
    if (selectedSubcategory) {
        // Para mock data, o filtro pode ser restrito demais se os mocks não tiverem a subcategoria exata
        // Em produção, isso seria um filtro exato.
        filtered = filtered.filter(s => s.subcategory === selectedSubcategory || s.subcategory.includes(selectedSubcategory));
        
        // Se após filtro ficar vazio (e for demo), gera mocks específicos
        if (filtered.length === 0) {
             filtered = generateMockStoresForCategory(category.name, selectedSubcategory);
        }
    }

    if (searchQuery) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [stores, category.name, selectedSubcategory, searchQuery]);

  // Handler de Clique na Subcategoria
  const handleSubcategoryClick = (subName: string) => {
    setIsAnimatingList(true);
    setTimeout(() => {
        if (selectedSubcategory === subName) {
            setSelectedSubcategory(null); // Remove filtro
        } else {
            setSelectedSubcategory(subName); // Aplica filtro
        }
        setIsAnimatingList(false);
    }, 200); // Delay para animação
  };

  const handleSeeAll = () => {
      alert("Abrir modal com todas as subcategorias: " + subcategories.map(s => s.name).join(", "));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Header Fixo */}
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
        
        {/* Banner (Opcional, só aparece se não estiver buscando) */}
        {!isSearchOpen && (
            <section className="px-5">
                <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden relative shadow-md bg-gray-200 dark:bg-gray-800">
                    {FALLBACK_ADS.map((img, index) => (
                        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={img} alt="Destaque" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-[10px] font-bold uppercase tracking-widest bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg w-fit mb-1">Destaque</p>
                                <p className="font-bold text-lg leading-tight">Melhores de {category.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Grade de Subcategorias (4x2 Fixa) */}
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

        {/* Lista Dinâmica de Lojas */}
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
                    <StoreListItem 
                        key={store.id} 
                        store={store} 
                        onClick={() => onStoreClick(store)} 
                    />
                ))}
                
                {displayStores.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">Nenhum local encontrado.</p>
                        <button onClick={() => setSelectedSubcategory(null)} className="mt-4 text-[#1E5BFF] font-bold text-sm">
                            Ver todas as opções
                        </button>
                    </div>
                )}
            </div>
        </section>

      </main>
    </div>
  );
};
