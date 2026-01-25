
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  MapPin, 
  Wrench, 
  Briefcase, 
  ChevronRight, 
  Building as Prédio,
  Briefcase as Maleta,
  Wrench as Ferramentas,
  AlertCircle,
  Filter,
  PawPrint,
  Heart,
  ShieldAlert,
  Info,
  X,
  MessageCircle,
  CheckCircle2,
  Plus,
  Camera,
  HeartHandshake,
  LayoutGrid,
  Sparkles,
  ClipboardList,
  ArrowRight
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { RealEstateFiltersView, RealEstateFilters } from './RealEstateFiltersView';
import { JobFiltersView, JobFilters } from './JobFiltersView';
import { ClassifiedsBannerCarousel } from './ClassifiedsBannerCarousel';
import { ServicesView } from './ServicesView';
import { MasterSponsorBanner } from './MasterSponsorBanner';

// --- MOCK DATA ---
const REAL_ESTATE_DATA = [
  { id: 1, title: "Sala no Quality Shopping", hood: "Freguesia", price: "R$ 1.500/mês", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400" },
  { id: 2, title: "Loja na Geremário Dantas", hood: "Pechincha", price: "R$ 2.800/mês", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400" },
  { id: 3, title: "Ponto Comercial Moderno", hood: "Taquara", price: "R$ 3.500/mês", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=400" },
];

const JOBS_DATA = [
  { id: 1, title: "Recepcionista", company: "Clinica Freguesia", hood: "Freguesia", price: "R$ 1.600", badge: "CLT", image: "https://images.unsplash.com/photo-1556740734-7f1a62791f20?q=80&w=400", area: "Administrativo / Secretariado / Finanças", shift: "Manhã" },
  { id: 2, title: "Auxiliar de Cozinha", company: "Restaurante Sabor", hood: "Pechincha", price: "R$ 1.450", badge: "CLT", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400", area: "Turismo / Hotelaria / Restaurante", shift: "Dia / Tarde" },
  { id: 3, title: "Entregador", company: "Log JPA", hood: "Taquara", price: "Diária R$ 120", badge: "Freelancer", image: "https://images.unsplash.com/photo-1617347454431?q=80&w=400", area: "Logística / Distribuição", shift: "Dia / Tarde" },
];

const PETS_DATA = [
  { id: 1, name: "Bolinha", type: "Cão", hood: "Freguesia", age: "Filhote", size: "Pequeno", neutered: true, vaccinated: true, description: "Bolinha é muito dócil, brincalhão e está pronto para um novo lar. Já come ração seca.", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400" },
  { id: 2, name: "Luna", type: "Gato", hood: "Taquara", age: "Adulto", size: "Médio", neutered: true, vaccinated: true, description: "Luna é calma, carinhosa e adora dormir no sol. Ideal para apartamentos.", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400" },
  { id: 3, name: "Max", type: "Cão", hood: "Pechincha", age: "Idoso", size: "Grande", neutered: true, vaccinated: true, description: "Max é um senhor muito tranquilo que só quer um sofá e carinho para descansar.", image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?q=80&w=400" },
];

interface ClassifiedsViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

const CategoryCard: React.FC<{ 
  icon: React.ElementType; 
  title: string; 
  onClick: () => void;
  isActive: boolean;
  isExpanded?: boolean;
  disabled?: boolean;
}> = ({ icon: Icon, title, onClick, isActive, isExpanded, disabled }) => (
  <button 
    onClick={disabled ? undefined : onClick}
    className={`rounded-[1.5rem] p-4 flex transition-all active:scale-95 shadow-lg bg-[#1E5BFF] shadow-blue-500/20 border-2 ${
      isActive ? 'border-white scale-100' : 'border-transparent'
    } ${disabled ? 'opacity-40 grayscale-[0.5]' : 'opacity-90'} group ${
      isExpanded ? 'w-full flex-row items-center justify-start gap-5 h-44' : 'w-full aspect-square flex-col items-center justify-center text-center'
    }`}
  >
    <div className={`rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 ${
      isExpanded ? 'w-16 h-16' : 'w-8 h-8 mb-2'
    }`}>
      <Icon className={`${isExpanded ? 'w-8 h-8' : 'w-4 h-4'} text-white`} strokeWidth={2.5} />
    </div>
    <div className={`flex flex-col ${isExpanded ? 'text-left' : 'text-center'}`}>
      <span className={`font-black uppercase leading-tight tracking-tight text-white ${isExpanded ? 'text-xl' : 'text-[9px] line-clamp-2'}`}>
        {title}
      </span>
      {isExpanded && (
        <span className="text-xs font-bold text-blue-100 uppercase tracking-widest mt-1 opacity-60">Toque para fechar</span>
      )}
    </div>
    {isExpanded && (
      <div className="ml-auto w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
        <X size={20} />
      </div>
    )}
  </button>
);

const SectionHeader: React.FC<{ title: string; subtitle?: string; onAction?: () => void }> = ({ title, subtitle, onAction }) => (
  <div className="flex flex-col mb-4 px-1">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{title}</h3>
      {onAction && <button onClick={onAction} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest">Ver todos</button>}
    </div>
    {subtitle && <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-tight">{subtitle}</p>}
  </div>
);

const INITIAL_RE_FILTERS: RealEstateFilters = {
  transaction: null, types: [], locations: [], priceMin: '', priceMax: '', iptuMin: '', iptuMax: '', condoMin: '', condoMax: '', areaMin: '', areaMax: '', parkingSpaces: null, details: [], advertiserType: 'ambos', sortBy: 'relevantes'
};

const INITIAL_JOB_FILTERS: JobFilters = {
  hireTypes: [], salaryMin: '', salaryMax: '', shifts: [], areas: [], sortBy: 'relevantes'
};

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate }) => {
  const { currentNeighborhood, setNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  
  // State for subview (Services flow)
  const [viewState, setViewState] = useState<'main' | 'services'>('main');

  // States para Filtros
  const [isREFiltersOpen, setIsREFiltersOpen] = useState(false);
  const [reFilters, setReFilters] = useState<RealEstateFilters>(INITIAL_RE_FILTERS);
  
  const [isJobFiltersOpen, setIsJobFiltersOpen] = useState(false);
  const [jobFilters, setJobFilters] = useState<JobFilters>(INITIAL_JOB_FILTERS);

  // States para Pets
  const [selectedPet, setSelectedPet] = useState<any | null>(null);

  const normalize = (val: string) => val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchHood = currentNeighborhood === "Jacarepaguá (todos)" || item.hood === currentNeighborhood;
      const matchSearch = !searchTerm || normalize(item.title || item.name || "").includes(normalize(searchTerm));
      return matchHood && matchSearch;
    });
  };

  const filteredRealEstate = useMemo(() => filterItems(REAL_ESTATE_DATA), [currentNeighborhood, searchTerm]);
  
  const filteredJobs = useMemo(() => {
    let list = filterItems(JOBS_DATA);
    if (jobFilters.hireTypes.length > 0) {
      list = list.filter(j => jobFilters.hireTypes.includes(j.badge));
    }
    if (jobFilters.shifts.length > 0) {
      list = list.filter(j => jobFilters.shifts.includes(j.shift || ''));
    }
    if (jobFilters.areas.length > 0) {
      list = list.filter(j => jobFilters.areas.includes(j.area || ''));
    }
    return list;
  }, [currentNeighborhood, searchTerm, jobFilters]);

  const filteredPets = useMemo(() => filterItems(PETS_DATA), [currentNeighborhood, searchTerm]);

  const handleCategoryToggle = (cat: string) => {
    if (cat === 'services') {
      setViewState('services');
    } else {
      setActiveCategoryFilter(prev => prev === cat ? null : cat);
    }
  };

  const activeREFiltersCount = useMemo(() => {
    let count = 0;
    if (reFilters.transaction) count++;
    count += reFilters.types.length + reFilters.details.length;
    if (reFilters.priceMin || reFilters.priceMax) count++;
    if (reFilters.parkingSpaces) count++;
    return count;
  }, [reFilters]);

  const activeJobFiltersCount = useMemo(() => {
    let count = 0;
    count += jobFilters.hireTypes.length;
    count += jobFilters.shifts.length;
    count += jobFilters.areas.length;
    if (jobFilters.salaryMin || jobFilters.salaryMax) count++;
    return count;
  }, [jobFilters]);

  if (viewState === 'services') {
    return <ServicesView onNavigate={(view) => view === 'classifieds' ? setViewState('main') : onNavigate?.(view)} />;
  }

  const hasAnyResults = filteredRealEstate.length > 0 || filteredJobs.length > 0 || filteredPets.length > 0 || activeCategoryFilter === 'services';

  // --- RENDERS DE FILTROS ESPECÍFICOS ---
  const renderCategoryFilters = () => {
    if (activeCategoryFilter === 'real_estate') {
      return (
        <section className="animate-in fade-in slide-in-from-top-2 duration-300">
           <button onClick={() => setIsREFiltersOpen(true)} className="w-full bg-[#EAF0FF] dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E5BFF] flex items-center justify-center text-white"><Filter size={20} /></div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-100">Filtros Imóveis</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-300 font-bold uppercase">Personalize sua busca</p>
                </div>
              </div>
              {activeREFiltersCount > 0 && <div className="bg-[#1E5BFF] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">{activeREFiltersCount} ativos</div>}
           </button>
        </section>
      );
    }
    if (activeCategoryFilter === 'jobs') {
      return (
        <section className="animate-in fade-in slide-in-from-top-2 duration-300">
           <button onClick={() => setIsJobFiltersOpen(true)} className="w-full bg-[#EAF0FF] dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E5BFF] flex items-center justify-center text-white"><Filter size={20} /></div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-900 dark:text-blue-100">Filtros Vagas</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-300 font-bold uppercase">Personalize seu perfil</p>
                </div>
              </div>
              {activeJobFiltersCount > 0 && <div className="bg-[#1E5BFF] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">{activeJobFiltersCount} ativos</div>}
           </button>
        </section>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      
      <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 border-b border-gray-100 dark:border-gray-800 rounded-b-[2.5rem] shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-900"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Classificados JPA</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Resolva o que você precisa perto de casa</p>
          </div>
        </div>

        <div className="relative mb-5 mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="O que você procura?"
            className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${currentNeighborhood === "Jacarepaguá (todos)" ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-400'}`}>Todos</button>
          {NEIGHBORHOODS.map(hood => (
            <button key={hood} onClick={() => setNeighborhood(hood)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${currentNeighborhood === hood ? 'bg-[#1E5BFF] border-[#1E5BFF] text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 text-gray-400'}`}>{hood}</button>
          ))}
        </div>
      </header>

      <main className="p-5 space-y-12 max-w-md mx-auto">
        
        {/* SEÇÃO 1: CATEGORIAS (COM EXPANSÃO) */}
        <section className="relative">
          <div className={`${activeCategoryFilter ? 'flex flex-col gap-4' : 'grid grid-cols-3 gap-3'} transition-all duration-500`}>
            {(activeCategoryFilter === null || activeCategoryFilter === 'services') && (
              <CategoryCard 
                title="Serviços Locais" 
                icon={Ferramentas} 
                isActive={activeCategoryFilter === 'services'} 
                isExpanded={activeCategoryFilter === 'services'}
                onClick={() => handleCategoryToggle('services')} 
              />
            )}
            {(activeCategoryFilter === null || activeCategoryFilter === 'real_estate') && (
              <CategoryCard 
                title="Imóveis Comerciais" 
                icon={Prédio} 
                isActive={activeCategoryFilter === 'real_estate'} 
                isExpanded={activeCategoryFilter === 'real_estate'}
                onClick={() => handleCategoryToggle('real_estate')} 
              />
            )}
            {(activeCategoryFilter === null || activeCategoryFilter === 'jobs') && (
              <CategoryCard 
                title="Vagas de Emprego" 
                icon={Maleta} 
                isActive={activeCategoryFilter === 'jobs'} 
                isExpanded={activeCategoryFilter === 'jobs'}
                onClick={() => handleCategoryToggle('jobs')} 
              />
            )}
            {(activeCategoryFilter === null || activeCategoryFilter === 'pets') && (
              <CategoryCard 
                title="Adoção de Pets" 
                icon={PawPrint} 
                isActive={activeCategoryFilter === 'pets'} 
                isExpanded={activeCategoryFilter === 'pets'}
                onClick={() => handleCategoryToggle('pets')} 
              />
            )}
            {(activeCategoryFilter === null || activeCategoryFilter === 'donations') && (
              <CategoryCard 
                title="Doação em Geral" 
                icon={HeartHandshake} 
                isActive={activeCategoryFilter === 'donations'} 
                isExpanded={activeCategoryFilter === 'donations'}
                onClick={() => handleCategoryToggle('donations')} 
              />
            )}
            {activeCategoryFilter === null && (
              <CategoryCard title="Em breve" icon={LayoutGrid} isActive={false} onClick={() => {}} disabled />
            )}
          </div>

          {/* Filtros da categoria abaixo do banner quando expandida */}
          {activeCategoryFilter && (
            <div className="mt-4">
              {renderCategoryFilters()}
            </div>
          )}
        </section>

        {/* SEÇÃO 2: CARROSSEL PUBLICITÁRIO (Sempre visível ou conforme regra) */}
        {!activeCategoryFilter && <ClassifiedsBannerCarousel />}

        {/* SEÇÃO 4: CONTEÚDOS LISTADOS */}
        <div className="space-y-12">
            
            {/* 4.1 SERVIÇOS LOCAIS */}
            {(activeCategoryFilter === 'services') && (
                <section className="animate-in fade-in duration-300">
                    <SectionHeader title="Serviços Locais" onAction={() => setViewState('services')} />
                    <div 
                        onClick={() => setViewState('services')}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                alt="Precisa de um serviço?" 
                            />
                            <div className="absolute top-3 right-3 bg-[#1E5BFF] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">Serviços</div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h4 className="font-black text-gray-900 dark:text-white text-base uppercase tracking-tight leading-tight">Precisa de um serviço?</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-relaxed">Descreva o que você precisa e receba até 5 propostas gratuitas de profissionais da sua região.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50 dark:border-gray-800">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/30">Até 5 propostas</div>
                                <span className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1">Pedir orçamento gratuito <ArrowRight size={14} strokeWidth={3} /></span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 4.2 IMÓVEIS COMERCIAIS */}
            {(activeCategoryFilter === null || activeCategoryFilter === 'real_estate') && filteredRealEstate.length > 0 && (
                <section className="animate-in fade-in duration-300">
                    <SectionHeader title="Imóveis Comerciais" subtitle="Salas, lojas e pontos comerciais na região." onAction={() => onNavigate?.('real_estate_list')} />
                    {activeCategoryFilter === 'real_estate' && <ClassifiedsBannerCarousel categoryName="real_estate" />}
                    <div className="space-y-4">
                        {filteredRealEstate.map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden active:scale-[0.98] transition-all">
                                <div className="relative h-32 overflow-hidden"><img src={item.image} className="w-full h-full object-cover" alt={item.title} /><div className="absolute top-3 right-3 bg-[#1E5BFF] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Imóvel</div></div>
                                <div className="p-5 flex items-center justify-between">
                                    <div className="min-w-0"><h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.title}</h4><div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mt-1"><MapPin size={10} className="text-[#1E5BFF]" /> {item.hood}</div></div>
                                    <p className="font-black text-[#1E5BFF] text-sm shrink-0 ml-4">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4.3 VAGAS DE EMPREGO */}
            {(activeCategoryFilter === null || activeCategoryFilter === 'jobs') && filteredJobs.length > 0 && (
                <section className="animate-in fade-in duration-300">
                    <SectionHeader title="Vagas de Emprego" subtitle="Oportunidades de trabalho perto de você." onAction={() => onNavigate?.('jobs_list')} />
                    {activeCategoryFilter === 'jobs' && <ClassifiedsBannerCarousel categoryName="jobs" />}
                    <div className="space-y-4">
                        {filteredJobs.map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden active:scale-[0.98] transition-all">
                                <div className="relative h-32 overflow-hidden"><img src={item.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600"} className="w-full h-full object-cover" alt={item.title} /><div className="absolute top-3 right-3 bg-[#1E5BFF] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Vaga</div></div>
                                <div className="p-5 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase"><MapPin size={10} className="text-[#1E5BFF]" /> {item.hood}</div>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{item.area}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4"><p className="font-black text-[#1E5BFF] text-sm leading-none">{item.price}</p><p className="text-[8px] font-black text-gray-400 uppercase mt-1 tracking-widest">{item.badge}</p></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4.4 ADOÇÃO DE PETS */}
            {(activeCategoryFilter === null || activeCategoryFilter === 'pets') && filteredPets.length > 0 && (
                <section className="animate-in fade-in duration-300">
                    <SectionHeader title="Adoção de Pets" subtitle="Encontre um novo melhor amigo." onAction={() => {}} />
                    {activeCategoryFilter === 'pets' && <ClassifiedsBannerCarousel categoryName="pets" />}
                    <div className="space-y-4">
                        {filteredPets.map(pet => (
                            <div key={pet.id} onClick={() => setSelectedPet(pet)} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden active:scale-[0.98] transition-all cursor-pointer">
                                <div className="relative h-40 overflow-hidden">
                                    <img src={pet.image} className="w-full h-full object-cover" alt={pet.name} />
                                    <div className="absolute top-3 right-3 bg-pink-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Adoção</div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-base leading-none mb-1.5">{pet.name}</h4>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                <MapPin size={10} className="text-[#1E5BFF]" /> {pet.hood} • {pet.age} • {pet.size}
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            {pet.neutered && <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Castrado</span>}
                                            {pet.vaccinated && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Vacinado</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4.5 DOAÇÕES */}
            {(activeCategoryFilter === null || activeCategoryFilter === 'donations') && (
              <section className="animate-in fade-in duration-300">
                  <SectionHeader title="Doações em Geral" subtitle="Ajude quem precisa no bairro." />
                  {activeCategoryFilter === 'donations' && <ClassifiedsBannerCarousel categoryName="donations" />}
                  <div className="py-10 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                      <HeartHandshake className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-500">Nenhum item para doação no momento.</p>
                      <p className="text-xs text-gray-400 mt-2">Tem algo para doar? Anuncie aqui em breve.</p>
                  </div>
              </section>
            )}

            {!hasAnyResults && (
                <div className="py-20 text-center flex flex-col items-center opacity-30">
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">Nenhum resultado<br/>encontrado.</p>
                </div>
            )}
        </div>

        {/* BANNER PATROCINADOR MASTER FINAL */}
        <section>
          <MasterSponsorBanner onClick={() => onNavigate?.('patrocinador_master')} label="Classificados" />
        </section>

        <div className="py-10 flex flex-col items-center opacity-20 grayscale pointer-events-none">
          <MapPin size={20} className="text-gray-400 mb-2" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-center">Localizei JPA • Classificados</p>
        </div>
      </main>

      {/* MODAIS E VIEWS AUXILIARES */}
      {isREFiltersOpen && <RealEstateFiltersView initialFilters={reFilters} onApply={(f) => { setReFilters(f); setIsREFiltersOpen(false); }} onBack={() => setIsREFiltersOpen(false)} />}
      {isJobFiltersOpen && <JobFiltersView initialFilters={jobFilters} onApply={(f) => { setJobFilters(f); setIsJobFiltersOpen(false); }} onBack={() => setIsJobFiltersOpen(false)} />}

      {selectedPet && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200" onClick={() => setSelectedPet(null)}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 shrink-0">
                <img src={selectedPet.image} className="w-full h-full object-cover" alt={selectedPet.name} />
                <button onClick={() => setSelectedPet(null)} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl border border-amber-100 flex gap-3 items-center">
                    <ShieldAlert size={18} className="text-amber-600" />
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase leading-tight">Somente adoção responsável. Proibida a venda de animais.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedPet.name}</h2>
                    <p className="text-xs text-[#1E5BFF] font-bold uppercase tracking-widest mt-1">{selectedPet.hood} • Rio de Janeiro</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Tipo', value: selectedPet.type },
                        { label: 'Idade', value: selectedPet.age },
                        { label: 'Porte', value: selectedPet.size },
                        { label: 'Saúde', value: `${selectedPet.neutered ? 'Castrado' : ''} ${selectedPet.vaccinated ? '• Vacinado' : ''}` }
                    ].map(info => (
                        <div key={info.label} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{info.label}</p>
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{info.value}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sobre o pet</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl italic">"{selectedPet.description}"</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex-1 bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-95 transition-all"><MessageCircle size={18}/> Conversar no chat</button>
                    <button className="p-4 border border-gray-200 rounded-2xl text-gray-400 hover:text-red-500 transition-colors"><ShieldAlert size={20}/></button>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
