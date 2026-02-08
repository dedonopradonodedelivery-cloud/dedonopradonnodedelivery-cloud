
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
  { id: 'servicos', name: 'Orçamento de Serviços', slug: 'services_landing', icon: <Wrench />, color: 'bg-brand-blue', bentoClass: 'col-span-3 aspect-[3/0.95]' }, // Mais largo
  { id: 'imoveis', name: 'Imóveis Comerciais', slug: 'real_estate', icon: <Building2 />, color: 'bg-brand-blue', bentoClass: 'col-span-1 row-span-2 h-full' }, // Mais alto
  { id: 'emprego', name: 'Vaga de emprego', slug: 'jobs', icon: <Briefcase />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-[1/0.9]' }, // Quase quadrado
  { id: 'doacoes', name: 'Doações', slug: 'donations', icon: <Heart />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-[1/0.7]' }, // Mais compacto
  { id: 'desapega', name: 'Desapega', slug: 'desapega', icon: <Tag />, color: 'bg-brand-blue', bentoClass: 'col-span-1 aspect-[0.8/1]' }, // Mais estreito
];

const ClassifiedCategoryButton: React.FC<{ category: any; onClick: () => void }> = ({ category, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center group active:scale-95 transition-all w-full h-full ${category.bentoClass}`}
  >
    <div className={`w-full h-full rounded-[22px] border border-white/20 shadow-sm flex flex-col items-center justify-between p-2 ${category.color}`}>
      <div className="flex-1 flex items-center justify-center">
        {React.cloneElement(category.icon as any, { 
            className: "text-white drop-shadow-md", 
            size: category.id === 'servicos' ? 28 : (category.id === 'imoveis' ? 32 : 22),
            strokeWidth: 3 
        })}
      </div>
      <span className="text-[7.5px] w-full font-black text-white text-center uppercase tracking-tighter leading-tight pb-1 truncate">
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
                <button 
                    onClick={() => onViewAll(category.slug)}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60"
                >
                    Ver todos
                </button>
            </div>

            {items.length === 0 ? (
                <div className="py-12 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nenhum anúncio nesta categoria.</p>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5 pb-2">
                    {items.map(item => (
                        <ClassifiedCard key={item.id} item={item} onClick={() => onItemClick(item)} />
                    ))}
                </div>
            )}
            
            <div className="mt-8 px-1">
                <button 
                    onClick={() => onAnunciar(category.id)}
                    className="w-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] transition-all border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95"
                >
                    {ctaLabel}
                    <ArrowRight size={14} strokeWidth={3} />
                </button>
            </div>
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
  const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onNavigate('classified_search_results', { searchTerm });
  };

  const handleAnunciar = (categorySlug: string) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    const categoryMapping: Record<string, string> = {
      'servicos': 'services_landing',
      'imoveis': 'real_estate_wizard',
      'emprego': 'job_wizard',
      'doacoes': 'donations',
      'desapega': 'desapega',
      'adocao': 'adoption' // Adicionando caso de adoção
    };
    const targetView = categoryMapping[categorySlug];
    if (targetView) {
      onNavigate(targetView);
    } else {
      setSelectionModalOpen(true);
    }
  };
  
  const handleItemClick = (item: Classified) => {
    onNavigate('classified_detail', { item });
  };

  const handleViewAll = (slug: string) => {
    if (slug === 'jobs') onNavigate('jobs');
    else if (slug === 'real_estate') onNavigate('real_estate');
    else if (slug === 'donations') onNavigate('donations');
    else if (slug === 'desapega') onNavigate('desapega');
    else if (slug === 'services_landing') onNavigate('services_landing');
    else {
      // Navegação genérica para outras categorias (ex: adoção)
      onNavigate(slug);
    }
  };

  const allClassifieds = MOCK_CLASSIFIEDS; // Usando os mocks importados

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans pb-32 animate-in fade-in duration-500">
      {/* Header Fixo Sticky */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 h-20 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 active:scale-90 transition-all">
          <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Classificados</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Negócios Locais</p>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar em classificados..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 transition-all shadow-inner dark:text-white"
                />
            </div>
            <button type="button" onClick={() => setFilterModalOpen(true)} className="relative p-3.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 shadow-sm active:scale-90 transition-all">
                <SlidersHorizontal size={20}/>
            </button>
        </form>

        <section className="bg-[#F8F9FC] dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800">
           <div className="grid grid-cols-4 gap-2">
              {CLASSIFIED_CATEGORIES.map((cat) => (
                <ClassifiedCategoryButton key={cat.id} category={cat} onClick={() => handleViewAll(cat.slug)} />
              ))}
           </div>
        </section>
      
        {/* Adicione outros blocos aqui, se necessário */}

        <ClassifiedsFilterModal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} onApply={() => {}} />

        <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label="Classificados" />
      </main>

      <div className="fixed bottom-[80px] left-0 right-0 p-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setSelectionModalOpen(true)}
          className="w-full bg-[#1E5BFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          <Plus size={16} strokeWidth={3} />
          Anunciar Gratuitamente
        </button>
      </div>

      <ClassifiedsSelectionModal 
        isOpen={isSelectionModalOpen}
        onClose={() => setSelectionModalOpen(false)}
        onSelect={(slug) => handleAnunciar(slug)}
      />
    </div>
  );
};
