
import React, { useState, useMemo, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  ChevronLeft,
  Plus, 
  MessageSquare, 
  Briefcase, 
  Building2, 
  Wrench, 
  PawPrint, 
  Tag, 
  Heart,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Camera,
  Loader2,
  AlertCircle,
  Megaphone,
  Check,
  ChevronRight
} from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';
import { Classified, AdType, Store, ServiceUrgency } from '../types';
import { MOCK_CLASSIFIEDS, STORES } from '../constants';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { ClassifiedsSelectionModal } from './ClassifiedsSelectionModal';
import { ClassifiedsFilterModal } from './ClassifiedsFilterModal';

// Imagens de fallback variadas para manter o padrão visual de "sempre ter imagem"
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800', // Objetos
  'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800', // Serviços
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', // Imóveis
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800', // Pets
  'https://images.unsplash.com/photo-1534723452202-428aae1ad99d?q=80&w=800', // Genérico
];

const getFallbackImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
};

const CLASSIFIED_CATEGORIES = [
  { id: 'servicos', name: 'Orçamento de Serviços', slug: 'services_landing', icon: <Wrench />, color: 'bg-brand-blue', bentoClass: 'col-span-2 aspect-[2/1]' },
  { id: 'imoveis', name: 'Imóveis Comerciais', slug: 'real_estate_wizard', icon: <Building2 />, color: 'bg-brand-blue', bentoClass: 'col-span-1 row-span-2' },
  { id: 'emprego', name: 'Vaga de emprego', slug: 'jobs', icon: <Briefcase />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-square' },
  { id: 'doacoes', name: 'Doações', slug: 'donations', icon: <Heart />, color: 'bg-brand-blue', bentoClass: 'col-span-2 aspect-[2.1/1]' },
  { id: 'desapega', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-[1/1.1]' },
];

const ClassifiedCategoryButton: React.FC<{ category: any; onClick: () => void }> = ({ category, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center group active:scale-95 transition-all w-full h-full ${category.bentoClass}`}
  >
    <div className={`w-full h-full rounded-[25px] border border-white/20 shadow-sm flex flex-col items-center justify-between p-2 ${category.color}`}>
      <div className="flex-1 flex items-center justify-center">
        {React.cloneElement(category.icon as any, { 
            className: "text-white drop-shadow-md", 
            size: category.bentoClass.includes('col-span-2') ? 32 : 24,
            strokeWidth: 3 
        })}
      </div>
      <span className="text-[8px] w-full font-black text-white text-center uppercase tracking-tighter leading-tight pb-1 truncate">
        {category.name}
      </span>
    </div>
  </button>
);

const ClassifiedCard: React.FC<{ item: Classified; onClick: () => void }> = ({ item, onClick }) => {
    const isDonation = item.category === 'Doações em geral';
    const isAdoption = item.category === 'Adoção de pets';
    const isJob = item.category === 'Empregos';
    const isService = item.category === 'Orçamento de Serviços';
    const hasPrice = !!item.price && !isDonation && !isAdoption && item.category !== 'Empregos' && item.category !== 'Orçamento de Serviços';

    // Garante uma imagem mesmo se o item não tiver
    const displayImage = item.imageUrl || getFallbackImage(item.id);

    return (
        <div 
            onClick={onClick} 
            className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                <img 
                    src={displayImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {(isDonation || isAdoption) && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg border border-white/20">
                            DOAÇÃO
                        </span>
                    )}
                    {isJob && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg border border-white/10">
                            VAGA
                        </span>
                    )}
                    {isService && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg border border-white/10">
                            SERVIÇO
                        </span>
                    )}
                    <div className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/50 text-white backdrop-blur-md">
                        {item.neighborhood}
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">{item.category}</span>
                </div>
                <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2 h-10 leading-tight mb-2">
                    {item.title}
                </h3>
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        <Clock size={10} />
                        <span>{item.timestamp}</span>
                    </div>
                    {hasPrice && <span className="text-emerald-600 dark:text-emerald-400 text-base font-black italic">{item.price}</span>}
                </div>
            </div>
        </div>
    );
};

interface CategoryBlockProps {
    category: typeof CLASSIFIED_CATEGORIES[0];
    items: Classified[];
    onItemClick: (item: Classified) => void;
    onAnunciar: (catName: string) => void;
    onViewAll: (slug: string) => void;
    subtitle?: string;
    ctaLabel: string;
}

const CategoryBlock: React.FC<CategoryBlockProps> = ({ category, items, onItemClick, onAnunciar, onViewAll, subtitle, ctaLabel }) => {
    return (
        <section className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${category.color} flex items-center justify-center text-white shadow-lg`}>
                        {React.cloneElement(category.icon as any, { size: 20, strokeWidth: 2.5 })}
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{category.name}</h2>
                        {subtitle && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
                    </div>
                </div>
                <button onClick={() => onViewAll(category.slug)} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest flex items-center gap-1 hover:underline">
                    Ver tudo <ArrowRight size={12} strokeWidth={3} />
                </button>
            </div>

            {items.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 snap-x">
                        {items.map(item => <ClassifiedCard key={item.id} item={item} onClick={() => onItemClick(item)} />)}
                    </div>
                    <div className="px-1">
                        <button 
                            onClick={() => onAnunciar(category.name)}
                            className="w-full py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                        >
                            {ctaLabel}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50/50 dark:bg-gray-900/50 rounded-[2.5rem] p-10 text-center border border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-6">{subtitle || 'Nenhum anúncio nesta categoria ainda.'}</p>
                    <button 
                        onClick={() => onAnunciar(category.name)}
                        className="bg-[#1E5BFF] text-white font-black px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95"
                    >
                        {ctaLabel}
                    </button>
                </div>
            )}
        </section>
    );
};

interface ClassifiedsViewProps {
  onBack: () => void;
  onNavigate: (view: string, data?: any) => void;
  user: User | null;
  onRequireLogin: () => void;
}

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({ onBack, onNavigate, user, onRequireLogin }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const services = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Orçamento de Serviços').slice(0, 5), []);
  const realEstate = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Imóveis Comerciais').slice(0, 5), []);
  const jobs = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Empregos').slice(0, 5), []);
  const donations = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Doações em geral' || item.category === 'Adoção de pets').slice(0, 8), []);
  const desapega = useMemo(() => MOCK_CLASSIFIEDS.filter(item => item.category === 'Desapega JPA').slice(0, 5), []);

  const handleAnunciarHeader = () => {
    if (!user) {
        onRequireLogin();
        return;
    }
    setIsSelectionOpen(true);
  };

  const handleItemClick = (item: Classified) => {
    onNavigate('classified_detail', { item });
  };

  const handleSearchSubmit = () => {
    if (!searchTerm.trim()) return;
    onNavigate('classified_search_results', { searchTerm });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500 overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={onBack} className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 transition-colors active:scale-90 shadow-sm shrink-0">
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none truncate">Classificados</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1 truncate">Oportunidades em {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleAnunciarHeader}
              className="px-3 py-1.5 bg-[#1E5BFF] hover:bg-blue-600 text-white font-black rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 uppercase tracking-widest text-[9px] border border-white/10 active:scale-95 transition-all h-9"
            >
              <Plus size={12} strokeWidth={4} />
              Anunciar
            </button>
            
            <button 
              onClick={() => setIsFilterOpen(true)} 
              className="relative p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 shadow-sm active:scale-90 transition-all"
            >
              <SlidersHorizontal size={20}/>
            </button>
          </div>
        </div>

        <div className="space-y-2">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    placeholder="Busque anúncios: vaga, sala comercial, doação, item…"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-32 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                    <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Classificados</span>
                </div>
            </div>
        </div>
      </header>

      <main className="p-5 space-y-4">
        
        {/* BENTO GRID DE CATEGORIAS EQUILIBRADO */}
        <div className="grid grid-cols-4 gap-3 mb-8 mt-2">
            {CLASSIFIED_CATEGORIES.map(cat => (
                <ClassifiedCategoryButton 
                    key={cat.id} 
                    category={cat} 
                    onClick={() => onNavigate(cat.slug)} 
                />
            ))}
        </div>

        <CategoryBlock 
            category={CLASSIFIED_CATEGORIES[0]} 
            items={services} 
            onItemClick={handleItemClick}
            onAnunciar={(name) => onNavigate('services_landing')}
            onViewAll={() => onNavigate('services_landing')}
            ctaLabel="Pedir Orçamento Grátis"
            subtitle="Profissionais verificados do bairro"
        />

        <CategoryBlock 
            category={CLASSIFIED_CATEGORIES[1]} 
            items={realEstate} 
            onItemClick={handleItemClick}
            onAnunciar={(name) => onNavigate('real_estate_wizard')}
            onViewAll={() => onNavigate('real_estate')}
            ctaLabel="Anunciar Ponto Comercial"
            subtitle="Oportunidades imobiliárias"
        />

        <CategoryBlock 
            category={CLASSIFIED_CATEGORIES[2]} 
            items={jobs} 
            onItemClick={handleItemClick}
            onAnunciar={(name) => onNavigate('job_wizard')}
            onViewAll={() => onNavigate('jobs')}
            ctaLabel="Divulgar Vaga no Bairro"
            subtitle="Encontre talentos locais"
        />

        <CategoryBlock 
            category={CLASSIFIED_CATEGORIES[3]} 
            items={donations} 
            onItemClick={handleItemClick}
            onAnunciar={(name) => onNavigate('donations')}
            onViewAll={() => onNavigate('donations')}
            ctaLabel="Divulgar Doação ou Adoção"
            subtitle="Ações sociais e pets no bairro"
        />

        <CategoryBlock 
            category={CLASSIFIED_CATEGORIES[4]} 
            items={desapega} 
            onItemClick={handleItemClick}
            onAnunciar={(name) => onNavigate('desapega')}
            onViewAll={() => onNavigate('desapega')}
            ctaLabel="Anunciar Desapego"
            subtitle="Venda o que você não usa mais"
        />

        {/* BANNER PATROCINADOR MASTER FINAL */}
        <section className="mt-8">
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Classificados JPA" />
        </section>
      </main>

      {/* MODAL DE SELEÇÃO O QUE ANUNCIAR */}
      <ClassifiedsSelectionModal 
        isOpen={isSelectionOpen}
        onClose={() => setIsSelectionOpen(false)}
        onSelect={(slug) => {
            setIsSelectionOpen(false);
            onNavigate(slug);
        }}
      />

      {/* MODAL DE FILTROS GLOBAIS */}
      <ClassifiedsFilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
            console.log("Filtros aplicados:", filters);
            setIsFilterOpen(false);
        }}
      />
    </div>
  );
};
