import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter, Megaphone, ArrowUpRight, Info, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Category, Store, AdType } from '../types';
import { SUBCATEGORIES } from '../constants';
import { supabase } from '../lib/supabaseClient';

// --- Reusable Banner Rendering Components ---
const TemplateBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { template_id, headline, subheadline, product_image_url } = config;
    switch (template_id) {
      case 'oferta_relampago':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white p-6 flex items-center justify-between overflow-hidden relative shadow-lg">
            <div className="relative z-10">
              <span className="text-sm font-bold bg-yellow-300 text-red-700 px-3 py-1 rounded-full uppercase shadow-sm">{headline || 'XX% OFF'}</span>
              <h3 className="text-3xl font-black mt-4 drop-shadow-md max-w-[200px] leading-tight">{subheadline || 'Nome do Produto'}</h3>
            </div>
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
              {product_image_url ? <img src={product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 flex items-end justify-between overflow-hidden relative shadow-lg">
             <img src={product_image_url || 'https://via.placeholder.com/150'} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
             <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">{headline || 'LANÇAMENTO'}</span>
                <h3 className="text-2xl font-bold mt-1 max-w-[220px] leading-tight">{subheadline || 'Descrição'}</h3>
             </div>
          </div>
        );
      default: return null;
    }
};
const CustomBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { template_id, background_color, text_color, font_size, font_family, title, subtitle } = config;
    const fontSizes = { small: 'text-2xl', medium: 'text-4xl', large: 'text-5xl' };
    const subFontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
    const headlineFontSize = { small: 'text-4xl', medium: 'text-6xl', large: 'text-7xl' };
    const layoutClasses = {
      simple_left: 'flex flex-col justify-center items-start text-left',
      centered: 'flex flex-col justify-center items-center text-center',
      headline: 'flex flex-col justify-center items-center text-center',
    };
    return (
        <div 
            className={`w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg p-8 ${layoutClasses[template_id] || 'flex flex-col justify-center'}`}
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <h3 className={`${template_id === 'headline' ? headlineFontSize[font_size] : fontSizes[font_size]} font-black leading-tight line-clamp-2`} style={{ fontFamily: font_family }}>
                {title || "Título"}
            </h3>
            <p className={`${subFontSizes[font_size]} mt-3 opacity-80 max-w-md line-clamp-3`} style={{ fontFamily: font_family }}>
                {subtitle || "Subtítulo"}
            </p>
        </div>
    );
};
// --- End Banner Rendering Components ---

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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryBanner, setCategoryBanner] = useState<any | null>(null);
  
  const subcategories = useMemo(() => SUBCATEGORIES[category.name] || [], [category.name]);
  const displayStores = useMemo(() => {
    let filtered = stores.filter(s => s.category.toLowerCase().includes(category.name.toLowerCase()));
    if (selectedSubcategory) filtered = filtered.filter(s => s.subcategory === selectedSubcategory);
    if (searchQuery) filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [stores, category.name, selectedSubcategory, searchQuery]);

  useEffect(() => {
    const fetchBanner = async () => {
        if (!supabase) return;
        const target = `category:${category.name}`;
        try {
            const { data, error } = await supabase
                .from('published_banners')
                .select('config')
                .eq('target', target)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            if (data) setCategoryBanner(data.config); else setCategoryBanner(null);
        } catch (e) { console.error(`Error fetching banner for ${target}`, e); }
    };
    fetchBanner();
  }, [category.name]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 font-sans pb-24 animate-in slide-in-from-right duration-300">
      <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm z-30 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" /></button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white font-display">{category.name}</h1>
        <button onClick={() => {}} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><Search className="w-6 h-6 text-gray-800 dark:text-gray-200" /></button>
      </header>
      
      <main className="pt-20 space-y-6">
        
        <section className="px-5">
            {categoryBanner ? (
                <div className="rounded-[32px] overflow-hidden">
                    {categoryBanner.type === 'template' ? <TemplateBannerRender config={categoryBanner} /> : <CustomBannerRender config={categoryBanner} />}
                </div>
            ) : (
                <div 
                    onClick={() => {
                        onAdvertiseInCategory(`category:${category.name}`);
                        onNavigate('store_ads_module');
                    }}
                    className="w-full aspect-video rounded-3xl bg-slate-800 flex flex-col items-center justify-center text-center p-6 cursor-pointer"
                >
                    <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                        <Megaphone size={24} />
                    </div>
                    <h3 className="font-bold text-white">Anuncie nesta Categoria</h3>
                    <p className="text-xs text-slate-400 mt-1">Seja o primeiro a aparecer aqui.</p>
                </div>
            )}
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