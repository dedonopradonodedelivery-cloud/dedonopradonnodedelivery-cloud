
import React, { useState, useMemo } from 'react';
import { ChevronLeft, Star, BadgeCheck, ChevronRight, Grid, AlertCircle, MapPin } from 'lucide-react';
import { Category, Store, AdType } from '../../types';
import { SUBCATEGORIES } from '../../constants';
import { MasterSponsorBanner } from '../../components/MasterSponsorBanner';

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
  onNavigate: (view: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores, userRole, onAdvertiseInCategory, onNavigate }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const subcategories = useMemo(() => SUBCATEGORIES[category.name] || [], [category.name]);
  const MAX_VISIBLE_SUBCATEGORIES = 8;
  const shouldShowMore = subcategories.length > MAX_VISIBLE_SUBCATEGORIES;
  const visibleSubcategories = shouldShowMore ? subcategories.slice(0, MAX_VISIBLE_SUBCATEGORIES - 1) : subcategories;

  const filteredStores = useMemo(() => {
    let categoryStores = stores.filter(s => s.category === category.name);
    if (selectedSubcategory) {
      return categoryStores.filter(s => s.subcategory === selectedSubcategory);
    }
    return categoryStores;
  }, [stores, category.name, selectedSubcategory]);

  const handleSubcategoryClick = (subName: string) => {
    setSelectedSubcategory(prev => (prev === subName ? null : subName));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
      <div className={`sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800`}>
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">{React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}</h1>
      </div>
      
      {/* 1. BANNER INSTITUCIONAL DA CATEGORIA (FIXO) */}
      <div className="mx-5 mt-6 mb-6 rounded-[2.5rem] bg-gradient-to-br from-[#1E5BFF] to-[#1040B0] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
         {/* Elementos Decorativos */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>
         
         <div className="relative z-10 flex flex-col justify-center h-full">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-3 border border-white/10">
                <MapPin size={12} className="text-blue-100" />
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-50">Localizei JPA</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-2 max-w-[260px]">
               Seu bairro, suas escolhas
            </h2>
            <p className="text-xs font-medium text-blue-100 leading-relaxed max-w-[280px]">
               Conectamos você aos melhores negócios e serviços de Jacarepaguá, com a confiança e proximidade que você merece.
            </p>
         </div>
      </div>

      <div className="p-5 pt-0 space-y-8">
        
        {/* SUBCATEGORIAS */}
        {visibleSubcategories.length > 0 && (
          <section>
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
                      onClick={() => alert('Mostrar todas as subcategorias')} 
                  />
              )}
            </div>
          </section>
        )}

        {/* LISTA DE LOJAS */}
        <section>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <span>{selectedSubcategory || `Principais em ${category.name}`}</span>
                {filteredStores.length > 0 && <span className="text-xs font-normal text-gray-500">{filteredStores.length} encontrados</span>}
            </h3>
            {filteredStores.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {filteredStores.map(store => (
                        <StoreListItem key={store.id} store={store} onClick={() => onStoreClick(store)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">Nenhuma loja encontrada nesta categoria.</p>
                </div>
            )}
        </section>

        {/* BANNER PATROCINADOR MASTER (Último elemento) */}
        <section>
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label={category.name} />
        </section>
      </div>
    </div>
  );
};
