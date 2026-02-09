import React, { useEffect, useMemo, useState, useRef } from "react";
import { Store } from "@/types";
import {
  MapPin,
  Filter,
  Star,
  ChevronRight,
  ChevronLeft,
  BadgeCheck,
  Sparkles,
  Lightbulb,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { quickFilters } from "@/constants";

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

type ExploreViewProps = {
  stores: Store[];
  searchQuery: string;
  onStoreClick: (store: Store) => void;
  onLocationClick: () => void;
  onFilterClick: () => void;
  onOpenPlans: () => void;
  onNavigate: (view: string) => void;
  onViewAllVerified?: () => void;
};

const CategoryChip: React.FC<{ label: string; active?: boolean; icon?: React.ReactNode; onClick?: () => void; }> = ({ label, active, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all whitespace-nowrap flex-shrink-0
      ${active ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-transparent shadow-sm" : "bg-white/80 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/80"}`}
  >
    {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
    <span>{label}</span>
  </button>
);

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm">
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
        </div>
      </div>
      <button onClick={onSeeMore} className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60">Ver mais</button>
    </div>
);

const NovidadesDaSemana: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
    const newArrivals = useMemo(() => stores.filter(s => ['f-3', 'f-5', 'f-8', 'f-12', 'f-15'].includes(s.id)), [stores]);
    if (newArrivals.length === 0) return null;
    return (
      <div className="bg-white dark:bg-gray-950 pt-2 mb-6">
        <SectionHeader icon={Sparkles} title="Novidades da Semana" subtitle="Recém chegados" onSeeMore={() => onNavigate('explore')} />
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-4 px-4">
          {newArrivals.map((store) => (
            <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="flex-shrink-0 w-[170px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative snap-center shadow-2xl group active:scale-[0.98] transition-all">
              <img src={store.image || store.logoUrl || getFallbackStoreImage(store.id)} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-left">
                <span className="w-fit bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-1.5 shadow-lg">Novo</span>
                <h3 className="text-sm font-black text-white leading-tight mb-0.5 truncate drop-shadow-md">{store.name}</h3>
                <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest truncate">{store.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
};

const SugestoesParaVoce: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const suggestions = useMemo(() => stores.filter(s => ['f-3', 'f-5', 'f-8', 'f-12', 'f-15'].includes(s.id)), [stores]);
  if (suggestions.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-950 py-4 mb-6">
      <SectionHeader icon={Lightbulb} title="Sugestões" subtitle="Para você" onSeeMore={() => onNavigate('explore')} />
      <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x -mx-4 px-4">
        {suggestions.map((store) => (
          <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="flex-shrink-0 w-[240px] bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden snap-center shadow-xl border border-gray-100 dark:border-gray-800 group active:scale-[0.98] transition-all text-left">
            <div className="relative h-32 overflow-hidden">
              <img src={store.image || store.logoUrl || getFallbackStoreImage(store.id)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            </div>
            <div className="p-5">
              <span className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest block mb-1">{store.category}</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-2 truncate">{store.name}</h3>
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-400 mt-0.5">
                <MapPin size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tight">{store.neighborhood || store.distance}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const EmAltaNaCidade: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const trending = useMemo(() => stores.filter(s => ['f-1', 'f-2'].includes(s.id)), [stores]);
  if (trending.length < 2) return null;
  return (
    <div className="bg-white dark:bg-gray-950 py-4 mb-8">
      <SectionHeader icon={TrendingUp} title="Em alta" subtitle="O bairro ama" onSeeMore={() => onNavigate('explore')} />
      <div className="flex gap-4">
        {trending.map((store, idx) => (
          <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className={`flex-1 rounded-[2.5rem] p-6 flex flex-col items-center text-center transition-all active:scale-[0.98] shadow-sm ${idx === 0 ? 'bg-rose-50/70 dark:bg-rose-900/20' : 'bg-blue-50/70 dark:bg-blue-900/20'}`}>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-xl border-4 border-white mb-5">
              <img src={store.logoUrl || store.image || getFallbackStoreImage(store.id)} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">{store.name}</h3>
            <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">{store.category}</p>
            <div className="mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg">
              Explorar <ArrowRight size={10} strokeWidth={4} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const HorizontalStoreSection: React.FC<{ title: string; subtitle?: string; stores: Store[]; onStoreClick: (store: Store) => void; }> = ({ title, subtitle, stores, onStoreClick }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = (container: HTMLDivElement | null) => {
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    const container = document.querySelector(`[data-section="${title}"]`) as HTMLDivElement | null;
    if (!container) return;
    checkScrollPosition(container);
    const handleScroll = () => checkScrollPosition(container);
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [title, stores.length]);

  const scroll = (direction: "left" | "right") => {
    const container = document.querySelector(`[data-section="${title}"]`) as HTMLDivElement | null;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.7;
    container.scrollTo({ left: direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount, behavior: "smooth" });
  };

  if (!stores.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {!isMobile && (
          <div className="flex items-center gap-1">
            <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={`w-7 h-7 rounded-full border flex items-center justify-center text-gray-400 ${canScrollLeft ? "hover:bg-gray-50 border-gray-200" : "opacity-40 border-gray-100"}`}><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight} className={`w-7 h-7 rounded-full border flex items-center justify-center text-gray-400 ${canScrollRight ? "hover:bg-gray-50 border-gray-200" : "opacity-40 border-gray-100"}`}><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>
      <div data-section={title} className="flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-0.5 px-0.5">
        {stores.map((store) => (
          <button key={store.id} onClick={() => onStoreClick(store)} className="min-w-[250px] max-w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden text-left hover:-translate-y-0.5 transition-all duration-200">
            <div className="relative h-24 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img src={store.image || store.logoUrl || getFallbackStoreImage(store.id)} alt={store.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-semibold text-white">{store.rating?.toFixed(1) || "Novo"}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
                  <MapPin className="w-3 h-3 text-white/90" />
                  <span className="text-[10px] text-white/90">{store.distance || "Perto de você"}</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">{store.name}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{store.category || "Categoria em destaque"}</p>
                </div>
                {store.verified && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-[9px] font-semibold text-white shadow-sm"><BadgeCheck className="w-3 h-3" />Localizei</span>}
              </div>
              <div className="flex items-center gap-1 mt-1"><span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-medium text-emerald-600">Aberto agora</span></div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export const ExploreView: React.FC<ExploreViewProps> = ({ stores, searchQuery, onStoreClick, onFilterClick, onNavigate }) => {
  const { location } = useUserLocation();
  const [sortOption, setSortOption] = useState<"nearby" | "topRated" | null>(null);

  const filteredStores = useMemo(() => {
    let list = [...stores];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (sortOption === "topRated") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [stores, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar items-center">
        <button onClick={onFilterClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all whitespace-nowrap flex-shrink-0 shadow-sm"><Filter className="w-3.5 h-3.5" />Filtros</button>
        {quickFilters.map((f) => (
          <CategoryChip key={f.id} label={f.label} active={sortOption === f.id} onClick={() => { if (f.id === 'top_rated') setSortOption('topRated'); }} />
        ))}
      </div>

      <div className="px-4 space-y-6">
        <NovidadesDaSemana stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />
        
        <SugestoesParaVoce stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />

        <EmAltaNaCidade stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />

        <HorizontalStoreSection title="Perto de você" stores={filteredStores.slice(0, 5)} onStoreClick={onStoreClick} />
        <HorizontalStoreSection title="Mais bem avaliados" stores={filteredStores.filter(s => s.rating >= 4.5)} onStoreClick={onStoreClick} />
      </div>
    </div>
  );
};
