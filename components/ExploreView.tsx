
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Store } from "../types";
import {
  MapPin,
  Filter,
  Zap,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  Compass,
  BadgeCheck,
  Percent,
  Coins,
  Sparkles,
  Phone,
  Crown,
  X,
  Volume2,
  VolumeX,
  Heart,
  Users
} from "lucide-react";
import { useUserLocation } from "../hooks/useUserLocation";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { quickFilters } from "../constants";

type ExploreViewProps = {
  stores: Store[];
  searchQuery: string;
  onStoreClick: (store: Store) => void;
  onLocationClick: () => void;
  onFilterClick: () => void;
  onOpenPlans: () => void;
  onNavigate: (view: string) => void; // Adicionado para compatibilidade com App.tsx
  onViewAllVerified?: () => void;
};

// --- MOCK DATA FOR STORIES ---
const EXPLORE_STORIES = [
  { 
    id: 's1', 
    merchantName: 'Padaria Imperial', 
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop', 
    videoUrl: 'https://videos.pexels.com/video-files/2942857/2942857-sd_540_960_24fps.mp4', 
    isLive: false 
  },
  { 
    id: 's2', 
    merchantName: 'Fit Studio', 
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop', 
    videoUrl: 'https://videos.pexels.com/video-files/4434246/4434246-sd_540_960_25fps.mp4', 
    isLive: false 
  },
  { 
    id: 's3', 
    merchantName: 'Burger King', 
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop', 
    videoUrl: 'https://videos.pexels.com/video-files/852395/852395-sd_540_960_30fps.mp4', 
    isLive: true 
  },
  { 
    id: 's4', 
    merchantName: 'Moda Freguesia', 
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200&auto=format&fit=crop', 
    videoUrl: 'https://videos.pexels.com/video-files/6333333/6333333-sd_540_960_30fps.mp4', 
    isLive: false 
  },
  { 
    id: 's5', 
    merchantName: 'Pet Shop Bob', 
    logo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop', 
    videoUrl: 'https://videos.pexels.com/video-files/4625753/4625753-sd_540_960_25fps.mp4', 
    isLive: false 
  },
];

const CategoryChip: React.FC<{
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({ label, active, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all whitespace-nowrap flex-shrink-0
      ${
        active
          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-transparent shadow-sm"
          : "bg-white/80 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/80"
      }`}
  >
    {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
    <span>{label}</span>
  </button>
);

type HorizontalStoreSectionProps = {
  title: string;
  subtitle?: string;
  stores: Store[];
  onStoreClick: (store: Store) => void;
};

const HorizontalStoreSection: React.FC<HorizontalStoreSectionProps> = ({
  title,
  subtitle,
  stores,
  onStoreClick,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollPosition = (container: HTMLDivElement | null) => {
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScrollLeft = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScrollLeft - 4);
  };

  useEffect(() => {
    const container = document.querySelector(`[data-section="${title}"]`) as HTMLDivElement | null;
    if (!container) return;
    checkScrollPosition(container);
    const handleScroll = () => checkScrollPosition(container);
    container.addEventListener("scroll", handleScroll);
    const resizeObserver = new ResizeObserver(() => checkScrollPosition(container));
    resizeObserver.observe(container);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [title, stores.length]);

  const scroll = (direction: "left" | "right") => {
    const container = document.querySelector(`[data-section="${title}"]`) as HTMLDivElement | null;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.7;
    const newScrollLeft = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
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
            <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={`w-7 h-7 rounded-full border flex items-center justify-center text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-900/60 backdrop-blur ${canScrollLeft ? "hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 border-gray-200 dark:border-gray-700" : "opacity-40 cursor-default border-gray-100 dark:border-gray-800"}`}><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight} className={`w-7 h-7 rounded-full border flex items-center justify-center text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-900/60 backdrop-blur ${canScrollRight ? "hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 border-gray-200 dark:border-gray-700" : "opacity-40 cursor-default border-gray-100 dark:border-gray-800"}`}><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>
      <div data-section={title} className="horizontal-scroll flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-0.5 px-0.5">
        {stores.map((store) => (
          <button key={store.id} onClick={() => onStoreClick(store)} className="min-w-[250px] max-w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-gray-100 dark:border-gray-800 overflow-hidden group text-left hover:-translate-y-0.5 transition-all duration-200">
            <div className="relative h-24 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img src={store.image} alt={store.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-semibold text-white">{store.rating?.toFixed(1) || "Novo"}</span>
                  {store.reviewsCount !== undefined && <span className="text-[10px] text-white/70">({store.reviewsCount})</span>}
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
                <div className="flex flex-col items-end gap-1">
                  {store.verified && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-[9px] font-semibold text-white shadow-sm"><BadgeCheck className="w-3 h-3" />Localizei</span>}
                  {store.cashback && store.cashback > 0 && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400"><Coins className="w-3 h-3" />{store.cashback}% volta</span>}
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1"><span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Aberto agora</span></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export const ExploreView: React.FC<ExploreViewProps> = ({
  stores,
  searchQuery,
  onStoreClick,
  onLocationClick,
  onFilterClick,
  onOpenPlans,
  onNavigate,
  onViewAllVerified,
}) => {
  const { location, isLoading: isLoadingLocation } = useUserLocation();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"nearby" | "topRated" | "cashback" | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filteredStores = useMemo(() => {
    let list = [...stores];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (selectedFilter === "cashback") list = list.filter(s => (s.cashback || 0) > 0);
    if (sortOption === "topRated") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [stores, searchQuery, selectedFilter, sortOption]);

  const activeStory = activeStoryIndex !== null ? EXPLORE_STORIES[activeStoryIndex] : null;

  useEffect(() => {
    let interval: any;
    if (activeStoryIndex !== null) {
      setStoryProgress(0);
      const duration = 15000; 
      const step = 50; 
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + (step / duration) * 100;
        });
      }, step);
    }
    return () => clearInterval(interval);
  }, [activeStoryIndex]);

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < EXPLORE_STORIES.length - 1) setActiveStoryIndex(activeStoryIndex + 1);
    else setActiveStoryIndex(null); 
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1);
    else setActiveStoryIndex(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">
      <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar items-center">
        <button onClick={onFilterClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all whitespace-nowrap flex-shrink-0 shadow-sm"><Filter className="w-3.5 h-3.5" />Filtros</button>
        {quickFilters.map((f) => (
          <CategoryChip key={f.id} label={f.label} active={selectedFilter === f.id || sortOption === f.id} onClick={() => { if (f.id === 'top_rated') setSortOption('topRated'); else setSelectedFilter(f.id); }} />
        ))}
      </div>

      <div className="px-4 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-2"><h2 className="text-sm font-semibold text-gray-900 dark:text-white">Stories da Freguesia</h2></div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {EXPLORE_STORIES.map((story, index) => (
              <button key={story.id} onClick={() => setActiveStoryIndex(index)} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                <div className={`p-[2px] rounded-full bg-gradient-to-tr from-orange-400 to-yellow-400`}><div className="w-[60px] h-[60px] rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-gray-200"><img src={story.logo} alt="" className="w-full h-full object-cover" /></div></div>
                <span className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate w-[64px] text-center">{story.merchantName}</span>
              </button>
            ))}
          </div>
        </section>

        <HorizontalStoreSection title="Perto de você" stores={filteredStores.slice(0, 5)} onStoreClick={onStoreClick} />
        <HorizontalStoreSection title="Mais bem avaliados" stores={filteredStores.filter(s => s.rating >= 4.5)} onStoreClick={onStoreClick} />
      </div>

      {activeStory && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-3">
             {EXPLORE_STORIES.map((s, i) => (
                 <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-100" style={{ width: i === activeStoryIndex ? `${storyProgress}%` : i < activeStoryIndex ? '100%' : '0%' }} /></div>
             ))}
          </div>
          <div className="absolute top-6 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/50 bg-gray-50"><img src={activeStory.logo} alt="" className="w-full h-full object-contain" /></div>
                  <div className="text-white drop-shadow-md"><p className="font-bold text-sm leading-tight">{activeStory.merchantName}</p><p className="text-[10px] opacity-80">Patrocinado</p></div>
              </div>
              <button onClick={() => setActiveStoryIndex(null)} className="p-1 hover:bg-white/10 rounded-full text-white"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
             <video ref={videoRef} src={activeStory.videoUrl} className="w-full h-full object-cover" autoPlay muted={isMuted} loop playsInline />
             <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrevStory}></div>
             <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNextStory}></div>
          </div>
        </div>
      )}
    </div>
  );
};
