
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Star, BadgeCheck, ChevronRight, X, AlertCircle, Image as ImageIcon, ShieldCheck, User, Baby, HeartHandshake, Users, Heart, Info, Stethoscope, Activity, Microscope, Smile, Building2, Brain, Apple, Car, Bike } from 'lucide-react';
import { Category, Store, AdType } from '@/types';
import { SUBCATEGORIES, HEALTH_SPECIALTIES } from '@/constants';
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

const HealthProfileCard: React.FC<{ 
  label: string; 
  icon: React.ReactNode; 
  onClick: () => void; 
  color: string;
}> = ({ label, icon, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full aspect-square rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-300 active:scale-95 border-2 border-transparent hover:border-white/20 shadow-xl ${color} group relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
    <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
       {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 36, strokeWidth: 2.5 }) : null}
    </div>
    <span className="text-lg font-black text-white uppercase tracking-tight drop-shadow-md">{label}</span>
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
  const [activeBanner, setActiveBanner] = useState<{ id: string; config: any; merchant_id?: string } | null>(null);
  const [loadingBanner, setLoadingBanner] = useState(true);
  
  // Perfil selecionado na categoria Saúde (Mulher, Homem, Pediatria, Geriatria)
  const [healthProfile, setHealthProfile] = useState<'Mulher' | 'Homem' | 'Pediatria' | 'Geriatria' | null>(null);
  // Perfil selecionado na categoria Autos (Carro, Moto)
  const [autosProfile, setAutosProfile] = useState<'Carro' | 'Moto' | null>(null);

  useEffect(() => {
    // Resetar perfil ao mudar de categoria
    setHealthProfile(null);
    setAutosProfile(null);
    setSelectedSubcategory(null);
  }, [category.id]);

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
          setActiveBanner(data[0] as { id: string; config: any; merchant_id?: string });
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
      return categoryStores.filter(s => s.subcategory === selectedSubcategory || s.tags?.includes(selectedSubcategory.toLowerCase()));
    }
    return categoryStores;
  }, [stores, category.name, selectedSubcategory]);

  const handleBack = () => {
    if (category.slug === 'saude' && selectedSubcategory) {
        setSelectedSubcategory(null);
        return;
    }
    if (category.slug === 'saude' && healthProfile) {
        setHealthProfile(null);
        return;
    }
    if (category.slug === 'autos' && autosProfile) {
        setAutosProfile(null);
        return;
    }
    onBack();
  };

  const handleSubSelection = (subName: string) => {
      onSubcategoryClick(subName);
      setSelectedSubcategory(subName);
  };

  // RENDERIZAÇÃO DA TELA INTERMEDIÁRIA DE SAÚDE (PASSO 1: PERFIS)
  if (category.slug === 'saude' && !healthProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" /> Saúde
          </h1>
        </div>

        <main className="p-6">
            <div className="text-center mb-10 mt-4">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-2">
                    Escolha o tipo <br/> de atendimento
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Selecione um grupo para ver as especialidades</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <HealthProfileCard label="Mulher" icon={<User />} color="bg-pink-500" onClick={() => setHealthProfile('Mulher')} />
                <HealthProfileCard label="Homem" icon={<User />} color="bg-blue-600" onClick={() => setHealthProfile('Homem')} />
                <HealthProfileCard label="Pediatria" icon={<Baby />} color="bg-amber-500" onClick={() => setHealthProfile('Pediatria')} />
                <HealthProfileCard label="Geriatria" icon={<HeartHandshake />} color="bg-emerald-600" onClick={() => setHealthProfile('Geriatria')} />
            </div>

            <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 flex gap-4">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                   Encontre especialistas, clínicas e exames focados na necessidade de cada integrante da sua família em Jacarepaguá.
                </p>
            </div>
        </main>
      </div>
    );
  }

  // RENDERIZAÇÃO DA TELA INTERMEDIÁRIA DE AUTOS (PASSO 1: VEÍCULOS)
  if (category.slug === 'autos' && !autosProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-500" /> Autos
          </h1>
        </div>

        <main className="p-6">
            <div className="text-center mb-10 mt-4">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-2">
                    Qual o seu <br/> veículo?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Filtre por tipo de automóvel</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <HealthProfileCard label="Carro" icon={<Car />} color="bg-blue-600" onClick={() => setAutosProfile('Carro')} />
                <HealthProfileCard label="Moto" icon={<Bike />} color="bg-orange-500" onClick={() => setAutosProfile('Moto')} />
            </div>
        </main>
      </div>
    );
  }

  // RENDERIZAÇÃO DA LISTA DE ESPECIALIDADES DE SAÚDE (PASSO 2: LISTA CLICÁVEL)
  if (category.slug === 'saude' && healthProfile && !selectedSubcategory) {
      const specialties = HEALTH_SPECIALTIES[healthProfile] || [];
      return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <div className="flex flex-col">
                    <h1 className="font-bold text-base text-gray-900 dark:text-white leading-none">Saúde — {healthProfile}</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Especialidades disponíveis</p>
                </div>
            </div>

            <div className="p-6 space-y-2">
                {specialties.map((spec) => (
                    <button 
                        key={spec}
                        onClick={() => handleSubSelection(spec)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all group active:scale-[0.98]"
                    >
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{spec}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                    </button>
                ))}
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
            {healthProfile && <span className="text-xs font-normal opacity-50 ml-1">/ {healthProfile}</span>}
            {autosProfile && <span className="text-xs font-normal opacity-50 ml-1">/ {autosProfile}</span>}
        </h1>
      </div>
      
      <div className="mt-4">
        <CategoryTopCarousel categoriaSlug={category.slug} onStoreClick={onStoreClick} />
      </div>

      <div className="p-5 pt-0 space-y-8">
        <section>
            <div className="grid grid-cols-4 gap-3">
              {subcategories.map((sub, i) => (
                  <BigSurCard 
                    key={i} 
                    icon={sub.icon}
                    name={sub.name}
                    isSelected={selectedSubcategory === sub.name}
                    onClick={() => handleSubSelection(sub.name)}
                    categoryColor={category.color}
                  />
              ))}
            </div>
        </section>

        <section>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-gray-900 dark:text-white">
                    {selectedSubcategory || (healthProfile ? `Resultados em ${selectedSubcategory}` : `Destaques em ${category.name}`)}
                </h3>
            </div>
            
            {filteredStores.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {filteredStores.map(store => (
                        <StoreCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Nenhum profissional <br/> cadastrado ainda</p>
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
