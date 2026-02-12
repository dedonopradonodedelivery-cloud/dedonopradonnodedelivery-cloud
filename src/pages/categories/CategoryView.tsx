import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter, Megaphone, ArrowUpRight, Info, Image as ImageIcon, Sparkles, ShieldCheck, User, Baby, Car, Bike } from 'lucide-react';
import { Category, Store, AdType } from '@/types';
import { SUBCATEGORIES } from '@/constants';
import { supabase } from '@/lib/supabaseClient';
import { CategoryTopCarousel } from '@/components/CategoryTopCarousel';
import { MasterSponsorBanner } from '@/components/MasterSponsorBanner';

const FALLBACK_STORE_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600',
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600'
];

const getFallbackStoreImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_STORE_IMAGES[Math.abs(hash) % FALLBACK_STORE_IMAGES.length];
};

const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800";

// --- Reusable Banner Rendering Components ---
const TemplateBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { template_id, headline, subheadline, product_image_url } = config;
    switch (template_id) {
      case 'oferta_relampago':
        return (
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-rose-50 to-red-600 text-white p-6 flex items-center justify-between overflow-hidden relative shadow-lg">
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
             <img src={product_image_url || DEFAULT_PLACEHOLDER} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
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

    type LayoutKey = keyof typeof layoutClasses;
    type SizeKey = keyof typeof fontSizes;
    type HeadlineSizeKey = keyof typeof headlineFontSize;

    return (
        <div 
            className={`w-full aspect-video rounded-2xl overflow-hidden relative shadow-lg p-8 ${layoutClasses[template_id as LayoutKey] || 'flex flex-col justify-center'}`}
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <h3 className={`${template_id === 'headline' ? headlineFontSize[font_size as HeadlineSizeKey] : fontSizes[font_size as SizeKey]} font-black leading-tight line-clamp-2`} style={{ fontFamily: font_family }}>
                {title || "Título"}
            </h3>
            <p className={`${subFontSizes[font_size as SizeKey]} mt-3 opacity-80 max-w-md line-clamp-3`} style={{ fontFamily: font_family }}>
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
  const baseClasses = `relative w-full aspect-square rounded-[25px] flex flex-col items-center justify-between p-2 transition-all duration-300 cursor-pointer overflow-hidden border border-white/20`;
  const backgroundClass = isMoreButton ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700" : `${categoryColor || 'bg-brand-blue'} shadow-sm`;
  const textClass = isMoreButton ? "text-gray-500 dark:text-gray-400" : "text-white";
  const selectionEffects = isSelected ? "ring-4 ring-black/10 dark:ring-white/20 scale-[0.96] brightness-110 shadow-inner" : "active:scale-95 transition-all";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${backgroundClass} ${selectionEffects}`}>
      <div className="flex-1 flex items-center justify-center">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${isMoreButton ? 'text-gray-400' : 'text-white drop-shadow-md'}`, strokeWidth: 3 }) : null}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-tighter leading-tight pb-1 truncate w-full text-center ${textClass}`}>
        {name}
      </span>
    </button>
  );
};

const StoreListItem: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  const storeImage = store.logoUrl || store.image || getFallbackStoreImage(store.id);
  
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={storeImage} alt={store.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase">Ads</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="flex items-center gap-1 font-bold text-[#1E5BFF]"><Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span className="truncate">{store.category}</span>
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
  onSubcategoryClick?: (subName: string) => void;
}

const SelectionButton: React.FC<{ label: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ label, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full aspect-[4/3] rounded-[2rem] flex flex-col items-center justify-center gap-4 ${color} text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group`}
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
        <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
            {React.cloneElement(icon as any, { size: 32, strokeWidth: 2 })}
        </div>
        <span className="relative z-10 font-black text-lg uppercase tracking-tight">{label}</span>
    </button>
);

export const CategoryView: React.FC<CategoryViewProps> = ({ 
  category, 
  onBack, 
  onStoreClick, 
  stores, 
  userRole, 
  onAdvertiseInCategory, 
  onNavigate,
  onSubcategoryClick
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [activeBanner, setActiveBanner] = useState<any | null>(null);
  const [loadingBanner, setLoadingBanner] = useState(true);
  
  // State for Health Category intermediate screen
  const [healthGroup, setHealthGroup] = useState<'mulher' | 'homem' | 'pediatria' | null>(null);
  // State for Autos Category intermediate screen
  const [autosGroup, setAutosGroup] = useState<'carro' | 'moto' | null>(null);

  const subcategories = useMemo(() => {
    const allSubs = SUBCATEGORIES[category.name] || [];
    
    // Filtra subcategorias se for a categoria Saúde e um grupo estiver selecionado
    if (category.slug === 'saude' && healthGroup) {
        if (healthGroup === 'mulher') {
            return allSubs.filter(s => ['Ginecologia', 'Obstetrícia', 'Psicologia', 'Nutrição', 'Fisioterapia', 'Dermatologia', 'Endocrinologia', 'Clínica médica'].includes(s.name));
        }
        if (healthGroup === 'homem') {
            return allSubs.filter(s => ['Urologia', 'Cardiologia', 'Psicologia', 'Nutrição', 'Fisioterapia', 'Dermatologia', 'Endocrinologia', 'Clínica médica'].includes(s.name));
        }
        if (healthGroup === 'pediatria') {
             return allSubs.filter(s => ['Pediatria', 'Psicologia infantil', 'Fonoaudiologia', 'Nutrição infantil', 'Fisioterapia pediátrica', 'Odontopediatria', 'Neuropediatria', 'Clínica infantil'].includes(s.name));
        }
    }

    // Filtra subcategorias se for a categoria Autos e um grupo estiver selecionado
    if (category.slug === 'autos' && autosGroup) {
        if (autosGroup === 'carro') {
            return allSubs.filter(s => [
                'Oficina mecânica', 'Auto elétrica', 'Funilaria e pintura', 
                'Alinhamento e balanceamento', 'Troca de óleo', 'Suspensão e freios', 
                'Ar-condicionado automotivo', 'Guincho e reboque'
            ].includes(s.name));
        }
        if (autosGroup === 'moto') {
             return allSubs.filter(s => [
                'Oficina de motos', 'Elétrica de motos', 'Mecânica geral', 
                'Injeção eletrônica', 'Peças e acessórios', 'Guincho para motos'
             ].includes(s.name));
        }
    }
    
    return allSubs;
  }, [category.name, healthGroup, autosGroup, category.slug]);

  const MAX_VISIBLE_SUBCATEGORIES = 8;
  const shouldShowMore = subcategories.length > MAX_VISIBLE_SUBCATEGORIES;
  const visibleSubcategories = shouldShowMore ? subcategories.slice(0, MAX_VISIBLE_SUBCATEGORIES - 1) : subcategories;

  // Reset health/autos group when category changes
  useEffect(() => {
      setHealthGroup(null);
      setAutosGroup(null);
      setSelectedSubcategory(null);
  }, [category.slug]);

  useEffect(() => {
    const fetchCategoryBanner = async () => {
      if (!supabase) {
        setLoadingBanner(false);
        return;
      }
      setLoadingBanner(true);
      try {
        const { data, error } = await supabase
          .from('published_banners')
          .select('id, config, merchant_id')
          .eq('target', `category:${category.slug}`)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
            if (error.code === 'PGRST116' || error.message.includes('published_banners')) {
                setActiveBanner(null);
                return;
            }
            throw error;
        }

        if (data && data.length > 0) {
          setActiveBanner(data[0]);
        } else {
          setActiveBanner(null);
        }
      } catch (e: any) {
        if (!e.message?.includes('published_banners')) {
            console.error("Failed to fetch category banner:", e.message || e);
        }
        setActiveBanner(null);
      } finally {
        setLoadingBanner(false);
      }
    };
    
    fetchCategoryBanner();

    const channel = supabase.channel(`category-banner-${category.slug}`)
      .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'published_banners',
          filter: `target=eq.category:${category.slug}`
        },
        () => fetchCategoryBanner()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category.slug]);

  const filteredStores = useMemo(() => {
    let categoryStores = stores.filter(s => s.category === category.name);
    if (selectedSubcategory) {
      return categoryStores.filter(s => s.subcategory === selectedSubcategory);
    }
    return categoryStores;
  }, [stores, category.name, selectedSubcategory]);

  const handleSubcategoryClick = (subName: string) => {
    if (onSubcategoryClick) {
        onSubcategoryClick(subName);
    } else {
        setSelectedSubcategory(prev => (prev === subName ? null : subName));
    }
  };

  const handleAdvertiseClick = () => {
    if (userRole === 'lojista') {
      onAdvertiseInCategory(category.name);
      onNavigate('store_ads_module');
    } else {
      alert("Apenas lojistas podem anunciar aqui. Crie ou acesse sua conta de lojista.");
    }
  };

  const handleBannerClick = (banner: any) => {
    if (banner.merchant_id) {
      const store = stores.find(s => s.id === banner.merchant_id);
      if (store) {
        onStoreClick(store);
        return;
      }
    }
    onNavigate('explore');
  };

  const handleBack = () => {
      if (category.slug === 'saude' && healthGroup) {
          setHealthGroup(null);
          setSelectedSubcategory(null);
          return;
      }
      if (category.slug === 'autos' && autosGroup) {
          setAutosGroup(null);
          setSelectedSubcategory(null);
          return;
      }
      onBack();
  };

  // INTERMEDIATE SCREEN FOR HEALTH
  if (category.slug === 'saude' && !healthGroup) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}
                </h1>
            </div>

            <div className="p-6 space-y-6">
                <div className="text-center mb-8 mt-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Para quem é o atendimento?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escolha uma opção para facilitar sua busca.</p>
                </div>

                <div className="grid gap-4">
                    <SelectionButton 
                        label="Mulher" 
                        icon={<User />} 
                        color="bg-pink-500" 
                        onClick={() => setHealthGroup('mulher')} 
                    />
                    <SelectionButton 
                        label="Homem" 
                        icon={<User />} 
                        color="bg-blue-600" 
                        onClick={() => setHealthGroup('homem')} 
                    />
                    <SelectionButton 
                        label="Pediatria" 
                        icon={<Baby />} 
                        color="bg-amber-500" 
                        onClick={() => setHealthGroup('pediatria')} 
                    />
                </div>
            </div>
        </div>
      );
  }

  // INTERMEDIATE SCREEN FOR AUTOS
  if (category.slug === 'autos' && !autosGroup) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}
                </h1>
            </div>

            <div className="p-6 space-y-6">
                <div className="text-center mb-8 mt-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Qual seu veículo?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Encontre o serviço ideal para o seu automóvel.</p>
                </div>

                <div className="grid gap-4">
                    <SelectionButton 
                        label="Carro" 
                        icon={<Car />} 
                        color="bg-blue-600" 
                        onClick={() => setAutosGroup('carro')} 
                    />
                    <SelectionButton 
                        label="Moto" 
                        icon={<Bike />} 
                        color="bg-orange-500" 
                        onClick={() => setAutosGroup('moto')} 
                    />
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
      <div className={`sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800`}>
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} 
            {category.name} 
            {healthGroup && <span className="text-xs font-normal opacity-60">/ {healthGroup === 'mulher' ? 'Mulher' : healthGroup === 'homem' ? 'Homem' : 'Pediatria'}</span>}
            {autosGroup && <span className="text-xs font-normal opacity-60">/ {autosGroup === 'carro' ? 'Carro' : 'Moto'}</span>}
        </h1>
      </div>
      
      {/* BANNER FIXO INSTITUCIONAL (Altura Reduzida 16/6) */}
      <div className="mt-4 px-5">
        <div 
          onClick={() => onNavigate('explore')}
          className={`relative aspect-[16/6] w-full rounded-[2rem] overflow-hidden cursor-pointer shadow-lg bg-[#1E5BFF] border border-white/5`}
        >
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" 
            alt="Jacarepaguá" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="relative h-full flex flex-col justify-end p-6 text-white">
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">
              {category.name} <span className="opacity-70">em Jacarepaguá</span>
            </h2>
            <p className="text-[9px] font-bold text-blue-100 uppercase tracking-[0.2em]">O melhor do bairro em um só lugar</p>
          </div>
        </div>
      </div>

      <div className="p-5 pt-6 space-y-8">
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

        <section>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {selectedSubcategory || `Destaques em ${category.name}`}
            </h3>
            {filteredStores.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {filteredStores.map(store => (
                        <StoreCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">Nenhuma loja encontrada.</p>
                </div>
            )}
        </section>

        <section>
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label={category.name} />
        </section>
      </div>
    </div>
  );
};

// Re-using the StoreCard internal to list for CategoryView
const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  const storeImage = store.logoUrl || store.image || getFallbackStoreImage(store.id);

  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={storeImage} alt={store.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">Ads</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="flex items-center gap-1 font-bold text-[#1E5BFF]"><Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span className="truncate">{store.category}</span>
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