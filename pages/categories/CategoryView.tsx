
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Star, BadgeCheck, ChevronRight, X, AlertCircle, Image as ImageIcon, ShieldCheck, User, Baby, HeartHandshake } from 'lucide-react';
import { Category, Store, AdType } from '@/types';
import { SUBCATEGORIES } from '@/constants';
import { supabase } from '@/lib/supabaseClient';
import { CategoryTopCarousel } from '@/components/CategoryTopCarousel';
import { MasterSponsorBanner } from '@/components/MasterSponsorBanner';

const FALLBACK_STORE_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600',
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600'
];

const getFallbackStoreImage = (id: string): string => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_STORE_IMAGES[Math.abs(hash) % FALLBACK_STORE_IMAGES.length];
};

const BigSurCard: React.FC<{ 
  icon: React.ReactNode; 
  name: string; 
  isSelected: boolean; 
  onClick: () => void; 
  categoryColor?: string;
}> = ({ icon, name, isSelected, onClick, categoryColor }) => {
  const baseClasses = `relative w-full aspect-square rounded-[25px] flex flex-col items-center justify-between p-2 transition-all duration-300 cursor-pointer overflow-hidden border border-white/20`;
  const backgroundClass = `${categoryColor || 'bg-brand-blue'} shadow-sm`;
  const selectionEffects = isSelected ? "ring-4 ring-black/10 dark:ring-white/20 scale-[0.96] brightness-110 shadow-inner" : "active:scale-95 transition-all";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${backgroundClass} ${selectionEffects}`}>
      <div className="flex-1 flex items-center justify-center">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string; strokeWidth?: number }>, { className: `w-6 h-6 text-white drop-shadow-md`, strokeWidth: 3 }) : null}
      </div>
      <span className={`text-[8px] font-black uppercase tracking-tighter leading-tight pb-1 truncate w-full text-center text-white`}>
        {name}
      </span>
    </button>
  );
};

const ProfileButton: React.FC<{ label: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ label, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full aspect-[4/3] lg:aspect-square rounded-[1.5rem] lg:rounded-[2.5rem] flex flex-col items-center justify-center gap-2 lg:gap-6 ${color} text-white shadow-xl hover:scale-[1.05] active:scale-95 transition-all duration-300 relative overflow-hidden group`}
    >
        <div className="absolute top-0 right-0 w-16 h-16 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="relative z-10 w-10 h-10 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
            {React.cloneElement(icon as any, { className: "w-6 h-6 lg:w-10 lg:h-10", strokeWidth: 2.5 })}
        </div>
        <span className="relative z-10 font-black text-sm lg:text-xl uppercase tracking-tighter">{label}</span>
    </button>
);

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
          <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{store.name}</h4>
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

interface CategoryViewProps {
  category: Category;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  userRole: 'cliente' | 'lojista' | null;
  onAdvertiseInCategory: (categoryName: string | null) => void;
  onNavigate: (view: string) => void;
  onSubcategoryClick: (subName: string) => void;
}

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

  // Autos Specific State
  const [autosProfile, setAutosProfile] = useState<'Carro' | 'Moto' | null>(null);

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
        setActiveBanner(null);
      } finally {
        setLoadingBanner(false);
      }
    };
    
    fetchCategoryBanner();
  }, [category.slug]);

  const subcategories = useMemo(() => {
      return SUBCATEGORIES[category.name] || [];
  }, [category.name]);

  const filteredStores = useMemo(() => {
    let categoryStores = stores.filter(s => s.category === category.name);
    if (selectedSubcategory) {
      return categoryStores.filter(s => s.subcategory === selectedSubcategory);
    }
    return categoryStores;
  }, [stores, category.name, selectedSubcategory]);

  const handleBack = () => {
      if (category.slug === 'autos' && autosProfile) {
          setAutosProfile(null);
          return;
      }
      onBack();
  };

  // TELA DE SELEÇÃO PARA CATEGORIA SAÚDE (TOTALMENTE RESPONSIVA E FIXA)
  if (category.slug === 'saude') {
      return (
        <div className="h-[100dvh] bg-gray-50 dark:bg-gray-950 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
            {/* Header Fixo */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0 z-30">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Saúde</h1>
            </div>

            {/* Container Centralizado com Altura Dinâmica para caber tudo sem scroll */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 max-w-6xl mx-auto w-full pb-[100px] lg:pb-32">
                <div className="text-center mb-6 lg:mb-16 shrink-0">
                    <h2 className="text-2xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Para quem é o atendimento?</h2>
                    <p className="text-sm lg:text-lg text-gray-500 dark:text-gray-400 font-medium">Escolha uma opção para ver o cuidado ideal.</p>
                </div>

                {/* Grid Responsivo: 2x2 no mobile, 4 em linha no desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 w-full max-w-4xl">
                    <ProfileButton label="Mulher" icon={<User />} color="bg-pink-500" onClick={() => onSubcategoryClick('Mulher')} />
                    <ProfileButton label="Homem" icon={<User />} color="bg-blue-600" onClick={() => onSubcategoryClick('Homem')} />
                    <ProfileButton label="Pediatria" icon={<Baby />} color="bg-amber-500" onClick={() => onSubcategoryClick('Pediatria')} />
                    <ProfileButton label="Geriatria" icon={<HeartHandshake />} color="bg-emerald-600" onClick={() => onSubcategoryClick('Geriatria')} />
                </div>

                <div className="mt-8 lg:mt-16 bg-blue-50/50 dark:bg-blue-900/10 p-4 lg:px-8 lg:py-4 rounded-3xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-3 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    <p className="text-[10px] lg:text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest leading-none">Profissionais verificados por morador</p>
                </div>
            </div>
        </div>
      );
  }

  // INTERMEDIATE SCREEN FOR AUTOS
  if (category.slug === 'autos' && !autosProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
          <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
              <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                {React.isValidElement(category.icon) ? React.cloneElement(category.icon as React.ReactElement<{ className?: string }>, {className: 'w-5 h-5'}) : null} {category.name}
              </h1>
          </div>

          <div className="p-6 space-y-6">
              <div className="text-center mb-8 mt-4">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Qual seu veículo?</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Encontre o serviço ideal para o seu automóvel.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:max-w-3xl lg:mx-auto">
                  <ProfileButton label="Carro" icon={<ImageIcon />} color="bg-blue-600" onClick={() => setAutosProfile('Carro')} />
                  <ProfileButton label="Moto" icon={<ImageIcon />} color="bg-orange-500" onClick={() => setAutosProfile('Moto')} />
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
            {React.isValidElement(category.icon) ? React.cloneElement(category.icon as React.ReactElement<{ className?: string }>, {className: 'w-5 h-5'}) : null} 
            {category.name}
            {autosProfile && <span className="text-xs font-normal opacity-50 ml-1">/ {autosProfile}</span>}
        </h1>
      </div>
      
      <div className="mt-4">
        <CategoryTopCarousel categoriaSlug={category.slug} onStoreClick={onStoreClick} />
      </div>

      <div className="p-5 pt-0 space-y-8 max-w-4xl mx-auto">
        <section>
            <div className="grid grid-cols-4 gap-3">
              {subcategories.map((sub, i) => (
                  <BigSurCard 
                    key={i} 
                    icon={sub.icon}
                    name={sub.name}
                    isSelected={selectedSubcategory === sub.name}
                    onClick={() => {
                        onSubcategoryClick(sub.name);
                        setSelectedSubcategory(sub.name);
                    }}
                    categoryColor={category.color}
                  />
              ))}
            </div>
        </section>

        <section>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {selectedSubcategory || `Destaques em ${category.name}`}
            </h3>
            {filteredStores.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {filteredStores.map(store => (
                        <StoreCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500">Nenhuma loja encontrada.</p>
                </div>
            )}
        </section>

        <section>
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label={selectedSubcategory || category.name} />
        </section>
      </div>
    </div>
  );
};
