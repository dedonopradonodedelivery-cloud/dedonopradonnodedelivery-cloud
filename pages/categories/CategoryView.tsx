import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Search, Star, BadgeCheck, ChevronRight, X, AlertCircle, Grid, Filter, Megaphone, ArrowUpRight, Info, Image as ImageIcon, Sparkles, ShieldCheck, User, Baby, Briefcase, Wrench, CarFront, Bike, CheckCircle2, Crown, Plus } from 'lucide-react';
import { Category, Store, AdType } from '@/types';
import { SUBCATEGORIES, HEALTH_GROUPS, PROFESSIONALS_GROUPS, AUTOS_GROUPS } from '@/constants';
import { supabase } from '@/lib/supabaseClient';
import { CategoryTopCarousel } from '@/components/CategoryTopCarousel';
import { MasterSponsorBanner } from '@/components/MasterSponsorBanner';

// --- PAINEL DE FILTRO DE SUBCATEGORIA ---
const SubcategoryFilterPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  options: string[];
  selected: string | null;
  onSelect: (option: string | null) => void;
  title: string;
}> = ({ isOpen, onClose, options, selected, onSelect, title }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(opt =>
      opt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    );
  }, [options, searchTerm]);

  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{title}</h2>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400"><X size={20}/></button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-10 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white"
              autoFocus
            />
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={16}/></button>}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar space-y-1 p-4">
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left p-4 rounded-xl font-bold text-sm transition-colors flex justify-between items-center ${
              selected === null ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            Todos
            {selected === null && <CheckCircle2 size={16} />}
          </button>
          {filteredOptions.map(opt => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full text-left p-4 rounded-xl font-medium text-sm transition-colors flex justify-between items-center ${
                selected === opt ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {opt}
              {selected === opt && <CheckCircle2 size={16} />}
            </button>
          ))}
        </main>
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
  const baseClasses = `relative w-full aspect-square rounded-[24px] flex flex-col items-center justify-between p-2 transition-all duration-300 cursor-pointer overflow-hidden border border-white/20`;
  const backgroundClass = isMoreButton ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700" : `${categoryColor || 'bg-brand-blue'} shadow-sm`;
  const textClass = isMoreButton ? "text-brand-blue" : "text-white";
  const selectionEffects = isSelected ? "ring-4 ring-black/10 dark:ring-white/20 scale-[0.96] brightness-110 shadow-inner" : "active:scale-95 transition-all";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${backgroundClass} ${selectionEffects}`}>
      <div className="flex-1 flex items-center justify-center">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${isMoreButton ? 'text-brand-blue' : 'text-white drop-shadow-md'}`, strokeWidth: 3 }) : null}
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

const SelectionButton: React.FC<{ 
    label: string; 
    subtitle?: string; 
    icon: React.ReactNode; 
    color: string; 
    onClick: () => void;
    size?: 'large' | 'small';
}> = ({ label, icon, color, onClick, subtitle, size = 'large' }) => {
    const paddingClass = size === 'large' ? 'py-8' : 'py-5';
    const gapClass = size === 'large' ? 'gap-3' : 'gap-2';
    const iconWrapperClass = size === 'large' ? 'w-14 h-14' : 'w-12 h-12';
    const iconSize = size === 'large' ? 28 : 24;

    return (
        <button
            onClick={onClick}
            className={`w-full ${paddingClass} rounded-[2rem] flex flex-col items-center justify-center ${gapClass} ${color} text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] active:brightness-90 active:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <div className={`relative z-10 ${iconWrapperClass} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20`}>
                {React.cloneElement(icon as any, { size: iconSize, strokeWidth: 2 })}
            </div>
            <div className="relative z-10 text-center px-4">
                <span className="font-black text-lg uppercase tracking-tight">{label}</span>
                {subtitle && <p className="text-xs text-white/80 font-medium mt-1 leading-tight">{subtitle}</p>}
            </div>
        </button>
    );
};

export const CategoryView: React.FC<CategoryViewProps> = ({ category, onBack, onStoreClick, stores, userRole, onAdvertiseInCategory, onNavigate, onSubcategoryClick }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isSubcategoryFilterOpen, setIsSubcategoryFilterOpen] = useState(false);
  const [isTechnicianFilterOpen, setIsTechnicianFilterOpen] = useState(false);
  const [isHealthFilterOpen, setIsHealthFilterOpen] = useState(false);
  const [isAutosFilterOpen, setIsAutosFilterOpen] = useState(false);

  // States for intermediate selection screens
  const [healthGroup, setHealthGroup] = useState<'mulher' | 'homem' | 'pediatria' | null>(null);
  const [professionalGroup, setProfessionalGroup] = useState<'manuais' | 'tecnicos' | null>(null);
  const [autosGroup, setAutosGroup] = useState<'carro' | 'moto' | null>(null);

  const isManuals = category.slug === 'profissionais' && professionalGroup === 'manuais';
  const isTechnicians = category.slug === 'profissionais' && professionalGroup === 'tecnicos';
  const isAutos = category.slug === 'autos' && autosGroup;

  const MasterSponsorSignature: React.FC = () => (
    <div className="pointer-events-none text-right shrink-0 ml-4">
      <p className="text-[9px] font-light text-gray-400 dark:text-gray-500 leading-none">Patrocinador Master</p>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight">Grupo Esquematiza</p>
    </div>
  );

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

  const filteredStores = useMemo(() => {
    let categoryStores = stores.filter(s => s.category === category.name);
    if (selectedSubcategory) {
      return categoryStores.filter(s => s.subcategory === selectedSubcategory);
    }
    return categoryStores;
  }, [stores, category.name, selectedSubcategory]);
  
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 truncate">
                        {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}
                    </h1>
                    <MasterSponsorSignature />
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="text-center mb-6 mt-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Para quem é o atendimento?</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Escolha uma opção para facilitar sua busca.</p>
                </div>

                <div className="grid gap-3">
                    <SelectionButton
                        label="Mulher"
                        subtitle="Especialidades e cuidados para a saúde feminina."
                        icon={<User />}
                        color="bg-pink-500"
                        onClick={() => setHealthGroup('mulher')}
                        size="small"
                    />
                    <SelectionButton
                        label="Homem"
                        subtitle="Check-ups e especialidades para a saúde masculina."
                        icon={<User />}
                        color="bg-blue-600"
                        onClick={() => setHealthGroup('homem')}
                        size="small"
                    />
                    <SelectionButton
                        label="Pediatria"
                        subtitle="Acompanhamento completo para bebês e crianças."
                        icon={<Baby />}
                        color="bg-amber-500"
                        onClick={() => setHealthGroup('pediatria')}
                        size="small"
                    />
                </div>
            </div>
        </div>
      );
  }
  
  if (category.slug === 'profissionais' && !professionalGroup) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 truncate">
                        {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}
                    </h1>
                    <MasterSponsorSignature />
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="text-center mb-6 mt-10">
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10 animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 truncate">
                        {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} {category.name}
                    </h1>
                    <MasterSponsorSignature />
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="text-center mb-6 mt-10">
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
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 animate-in slide-in-from-right duration-300">
        <div className={`sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800`}>
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
          </button>
          <div className="flex-1 min-w-0 flex justify-between items-center">
              <h1 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 truncate">
                  {React.cloneElement(category.icon as any, {className: 'w-5 h-5'})} 
                  {category.name} 
                  {healthGroup && <span className="text-xs font-normal opacity-60">/ {healthGroup === 'mulher' ? 'Mulher' : healthGroup === 'homem' ? 'Homem' : 'Pediatria'}</span>}
                  {professionalGroup && <span className="text-xs font-normal opacity-60">/ {professionalGroup === 'manuais' ? 'Manuais' : 'Técnicos'}</span>}
                  {autosGroup && <span className="text-xs font-normal opacity-60">/ {autosGroup === 'carro' ? 'Carro' : 'Moto'}</span>}
              </h1>
              <MasterSponsorSignature />
          </div>
        </div>
        
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
                        icon={<Plus />} 
                        name="Mais" 
                        isSelected={false} 
                        isMoreButton 
                        onClick={() => {
                            if (category.slug === 'saude') {
                                setIsHealthFilterOpen(true);
                            } else if (isManuals) {
                                setIsSubcategoryFilterOpen(true);
                            } else if (isTechnicians) {
                                setIsTechnicianFilterOpen(true);
                            } else if (isAutos) {
                                setIsAutosFilterOpen(true);
                            } else {
                                alert('Mostrar todas as subcategorias');
                            }
                        }} 
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
      {isManuals && (
        <SubcategoryFilterPanel
            isOpen={isSubcategoryFilterOpen}
            onClose={() => setIsSubcategoryFilterOpen(false)}
            options={subcategories.map(s => s.name)}
            selected={selectedSubcategory}
            onSelect={(sub) => {
                onSubcategoryClick(sub as string, category)
                setIsSubcategoryFilterOpen(false);
            }}
            title="Filtrar por subcategoria"
        />
      )}

      {isTechnicians && (
        <SubcategoryFilterPanel
            isOpen={isTechnicianFilterOpen}
            onClose={() => setIsTechnicianFilterOpen(false)}
            options={subcategories.map(s => s.name)}
            selected={selectedSubcategory}
            onSelect={(sub) => {
                onSubcategoryClick(sub as string, category)
                setIsTechnicianFilterOpen(false);
            }}
            title="Filtrar por subcategoria"
        />
      )}

      {category.slug === 'saude' && healthGroup && (
          <SubcategoryFilterPanel
              isOpen={isHealthFilterOpen}
              onClose={() => setIsHealthFilterOpen(false)}
              options={subcategories.map(s => s.name)}
              selected={selectedSubcategory}
              onSelect={(sub) => {
                  onSubcategoryClick(sub as string, category)
                  setIsHealthFilterOpen(false);
              }}
              title="Filtrar por subcategoria"
          />
      )}
      {isAutos && (
        <SubcategoryFilterPanel
            isOpen={isAutosFilterOpen}
            onClose={() => setIsAutosFilterOpen(false)}
            options={subcategories.map(s => s.name)}
            selected={selectedSubcategory}
            onSelect={(sub) => {
                onSubcategoryClick(sub as string, category)
                setIsAutosFilterOpen(false);
            }}
            title="Filtrar por subcategoria"
        />
      )}
    </>
  );
};
