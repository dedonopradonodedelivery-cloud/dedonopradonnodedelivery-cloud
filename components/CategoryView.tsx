
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter, Megaphone, ArrowUpRight, Info, Image as ImageIcon, Sparkles, ShieldCheck, User, Baby, Briefcase, Wrench, CarFront, Bike } from 'lucide-react';
import { Category, Store, AdType } from '@/types';
import { SUBCATEGORIES, HEALTH_GROUPS, PROFESSIONALS_GROUPS, AUTOS_GROUPS } from '@/constants';
import { supabase } from '@/lib/supabaseClient';
import { CategoryTopCarousel } from '@/components/CategoryTopCarousel';
import { MasterSponsorBanner } from '@/components/MasterSponsorBanner';

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
  const baseClasses = `relative w-full aspect-square rounded-[24px] flex flex-col items-center justify-between p-2 transition-all duration-300 cursor-pointer overflow-hidden border border-white/20`;
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
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white dark:hover:bg-gray-800 active:scale-[0.99] transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">Patrocinado</span>}
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
  onNavigate: (view: string, data?: any) => void;
  onSubcategoryClick: (subName: string, parentCat: Category) => void;
}

const SelectionButton: React.FC<{ label: string; subtitle?: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ label, icon, color, onClick, subtitle }) => (
    <button
        onClick={onClick}
        className={`w-full py-8 rounded-[2rem] flex flex-col items-center justify-center gap-3 ${color} text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] active:brightness-90 active:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
        <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
            {React.cloneElement(icon as any, { size: 28, strokeWidth: 2 })}
        </div>
        <div className="relative z-10 text-center px-4">
            <span className="font-black text-lg uppercase tracking-tight">{label}</span>
            {subtitle && <p className="text-xs text-white/80 font-medium mt-1 leading-tight">{subtitle}</p>}
        </div>
    </button>
);

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores, userRole, onAdvertiseInCategory, onNavigate, onSubcategoryClick }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [activeBanner, setActiveBanner] = useState<any | null>(null);
  const [loadingBanner, setLoadingBanner] = useState(true);

  // States for intermediate selection screens
  const [healthGroup, setHealthGroup] = useState<'mulher' | 'homem' | 'pediatria' | null>(null);
  const [professionalGroup, setProfessionalGroup] = useState<'manuais' | 'tecnicos' | null>(null);
  const [autosGroup, setAutosGroup] = useState<'carro' | 'moto' | null>(null);


  useEffect(() => {
      setHealthGroup(null);
      setProfessionalGroup(null);
      setAutosGroup(null);
      setSelectedSubcategory(null);
  }, [category.slug]);

  const subcategories = useMemo(() => {
    const allSubs = SUBCATEGORIES[category.name] || [];

    if (category.slug === 'saude' && healthGroup) {
        return allSubs.filter(s => HEALTH_GROUPS[healthGroup].includes(s.name));
    }
    
    if (category.slug === 'profissionais' && professionalGroup) {
        return allSubs.filter(s => PROFESSIONALS_GROUPS[professionalGroup].includes(s.name));
    }
    
    if (category.slug === 'autos' && autosGroup) {
        return allSubs.filter(s => AUTOS_GROUPS[autosGroup].includes(s.name));
    }

    return allSubs;
  }, [category.name, category.slug, healthGroup, professionalGroup, autosGroup]);
  
  const MAX_VISIBLE_SUBCATEGORIES = 8;
  const shouldShowMore = subcategories.length > MAX_VISIBLE_SUBCATEGORIES;
  const visibleSubcategories = shouldShowMore ? subcategories.slice(0, MAX_VISIBLE_SUBCATEGORIES - 1) : subcategories;

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
          if (error.message.includes('published_banners')) {
            setActiveBanner(null);
          } else {
            throw error;
          }
        } else {
            if (data && data.length > 0) {
              setActiveBanner(data[0]);
            } else {
              setActiveBanner(null);
            }
        }
      } catch (e: any) {
        console.error("Failed to fetch category banner from Supabase:", e.message || e);
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
    setSelectedSubcategory(prev => (prev === subName ? null : subName));
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
      if (category.slug === 'profissionais' && professionalGroup) {
          setProfessionalGroup(null);
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

  if (category.slug === 'saude' && !healthGroup) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}
                </h1>
            </div>

            <div className="p-6 space-y-4">
                <div className="text-center mb-6 mt-2">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Para quem é o atendimento?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escolha uma opção para facilitar sua busca.</p>
                </div>

                <div className="grid gap-3">
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
  
  if (category.slug === 'profissionais' && !professionalGroup) {
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

            <div className="p-6 space-y-4">
                <div className="text-center mb-8 mt-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Qual tipo de serviço?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ajude-nos a encontrar o profissional certo para você.</p>
                </div>

                <div className="grid gap-3">
                    <SelectionButton
                        label="Serviços Manuais"
                        subtitle="Obras, reparos e serviços práticos"
                        icon={<Wrench />}
                        color="bg-sky-600"
                        onClick={() => setProfessionalGroup('manuais')}
                    />
                    <SelectionButton
                        label="Técnicos / Especializados"
                        subtitle="Serviços profissionais e especializados"
                        icon={<Briefcase />}
                        color="bg-sky-700"
                        onClick={() => setProfessionalGroup('tecnicos')}
                    />
                </div>
            </div>
        </div>
      );
  }
  
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

            <div className="p-6 space-y-4">
                <div className="text-center mb-8 mt-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Qual tipo de veículo?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escolha para ver os serviços especializados.</p>
                </div>

                <div className="grid gap-3">
                    <SelectionButton
                        label="Carro"
                        subtitle="Serviços para automóveis"
                        icon={<CarFront />}
                        color="bg-red-600"
                        onClick={() => setAutosGroup('carro')}
                    />
                    <SelectionButton
                        label="Moto"
                        subtitle="Serviços para motocicletas"
                        icon={<Bike />}
                        color="bg-red-700"
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
            {professionalGroup && <span className="text-xs font-normal opacity-60">/ {professionalGroup === 'manuais' ? 'Manuais' : 'Técnicos'}</span>}
            {autosGroup && <span className="text-xs font-normal opacity-60">/ {autosGroup === 'carro' ? 'Carro' : 'Moto'}</span>}
        </h1>
      </div>
      
      {/* BANNER DE TOPO REDIRECIONANDO PARA PERFIL */}
      <div className="mt-4">
        <CategoryTopCarousel categoriaSlug={category.slug} onStoreClick={onStoreClick} />
      </div>

      <div className="p-5 pt-0 space-y-8">
        {visibleSubcategories.length > 0 && (
          <section>
            <div className="grid grid-cols-4 gap-3">
              {visibleSubcategories.map((sub, i) => (
                  <BigSurCard 
                    key={i} 
                    icon={sub.icon}
                    name={sub.name}
                    isSelected={selectedSubcategory === sub.name}
                    onClick={() => onSubcategoryClick(sub.name, category)}
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
          {loadingBanner ? (
            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          ) : activeBanner ? (
            <div onClick={() => handleBannerClick(activeBanner)} className="cursor-pointer active:scale-[0.99] transition-transform">
              {activeBanner.config.type === 'template' ? (
                <TemplateBannerRender config={activeBanner.config} />
              ) : (
                <CustomBannerRender config={activeBanner.config} />
              )}
            </div>
          ) : (
            <div 
              onClick={handleAdvertiseClick}
              className="w-full aspect-video rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-center p-8 cursor-pointer relative overflow-hidden shadow-2xl border border-white/5 group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl mb-4 border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-8 h-8 text-[#1E5BFF]" />
                    </div>
                    <h3 className="font-black text-2xl text-white uppercase tracking-tighter leading-tight">Serviços de <span className="text-[#1E5BFF]">Confiança</span></h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 mb-6">Os melhores profissionais da região</p>
                    <div className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 transition-all">
                        Patrocinar nesta categoria
                    </div>
                </div>
            </div>
          )}
        </section>

        <section>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {selectedSubcategory || `Destaques em ${category.name}`}
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
