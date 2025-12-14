
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
  Users,
  Flame,
  TrendingUp,
  MousePointerClick,
  ArrowRight,
  RefreshCw,
  Gift,
  Bell,
  Play
} from "lucide-react";
import { useUserLocation } from "../hooks/useUserLocation";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { quickFilters } from "../constants";
import { MasterSponsorBanner } from "./MasterSponsorBanner";
import { getStoreLogo } from "../utils/mockLogos";

type ExploreViewProps = {
  stores: Store[];
  searchQuery: string;
  onStoreClick: (store: Store) => void;
  onLocationClick: () => void;
  onFilterClick: () => void;
  onOpenPlans: () => void;
  onViewAllVerified?: () => void;
  onViewMasterSponsor?: () => void;
};

// --- MOCK DATA FOR STORIES ---
const EXPLORE_STORIES = [
  { 
    id: 's3', 
    merchantName: 'Burger King', 
    category: 'Comida',
    status: 'Ao vivo',
    logo: getStoreLogo(1), 
    videoUrl: 'https://videos.pexels.com/video-files/852395/852395-sd_540_960_30fps.mp4', 
    isLive: true,
    viewers: 124,
    badgeColor: 'bg-red-600',
    badgeText: 'AO VIVO'
  },
  { 
    id: 's1', 
    merchantName: 'Padaria Imperial', 
    category: 'Padaria',
    status: 'Promoção',
    logo: getStoreLogo(8), 
    videoUrl: 'https://videos.pexels.com/video-files/2942857/2942857-sd_540_960_24fps.mp4', 
    isLive: false,
    viewers: 42,
    badgeColor: 'bg-green-600',
    badgeText: 'Gera Cashback',
    icon: Zap
  },
  { 
    id: 's2', 
    merchantName: 'Fit Studio', 
    category: 'Fitness',
    status: 'Dica',
    logo: getStoreLogo(7), 
    videoUrl: 'https://videos.pexels.com/video-files/4434246/4434246-sd_540_960_25fps.mp4', 
    isLive: false,
    badgeColor: 'bg-black/60 backdrop-blur-md',
    badgeText: 'Novo hoje'
  },
  { 
    id: 's4', 
    merchantName: 'Moda Freguesia', 
    category: 'Moda',
    status: 'Novidade',
    logo: getStoreLogo(11), 
    videoUrl: 'https://videos.pexels.com/video-files/6333333/6333333-sd_540_960_30fps.mp4', 
    isLive: false,
    viewers: 15,
    badgeColor: 'bg-blue-600',
    badgeText: 'Trending'
  },
  { 
    id: 's5', 
    merchantName: 'Pet Shop Bob', 
    category: 'Serviço',
    status: 'Bastidores',
    logo: getStoreLogo(5), 
    videoUrl: 'https://videos.pexels.com/video-files/4625753/4625753-sd_540_960_25fps.mp4', 
    isLive: false,
    badgeColor: 'bg-orange-500',
    badgeText: 'Oferta Relâmpago'
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
    const container = document.querySelector(
      `[data-section="${title}"]`
    ) as HTMLDivElement | null;
    if (!container) return;

    checkScrollPosition(container);

    const handleScroll = () => checkScrollPosition(container);
    container.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(() =>
      checkScrollPosition(container)
    );
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [title, stores.length]);

  const scroll = (direction: "left" | "right") => {
    const container = document.querySelector(
      `[data-section="${title}"]`
    ) as HTMLDivElement | null;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.7;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (!stores.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {!isMobile && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-900/60 backdrop-blur
                ${
                  canScrollLeft
                    ? "hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 border-gray-200 dark:border-gray-700"
                    : "opacity-40 cursor-default border-gray-100 dark:border-gray-800"
                }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-7 h-7 rounded-full border flex items-center justify-center text-gray-400 dark:text-gray-500 bg-white/70 dark:bg-gray-900/60 backdrop-blur
                ${
                  canScrollRight
                    ? "hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 border-gray-200 dark:border-gray-700"
                    : "opacity-40 cursor-default border-gray-100 dark:border-gray-800"
                }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div
        data-section={title}
        className="horizontal-scroll flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-0.5 px-0.5"
      >
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => onStoreClick(store)}
            className="min-w-[250px] max-w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-gray-100 dark:border-gray-800 overflow-hidden group text-left hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="relative h-24 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img
                src={(store as any).coverImage || store.image || (store as any).imageUrl}
                alt={store.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-semibold text-white">
                    {store.rating?.toFixed(1) || "Novo"}
                  </span>
                  {store.reviewsCount !== undefined && (
                    <span className="text-[10px] text-white/70">
                      ({store.reviewsCount})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
                  <MapPin className="w-3 h-3 text-white/90" />
                  <span className="text-[10px] text-white/90">
                    {(store as any).distanceText || store.distance || "Perto de você"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                    {store.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {(store as any).categoryName ||
                      store.category ||
                      "Categoria em destaque"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {(store as any).isLocalizeiPartner && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-[9px] font-semibold text-white shadow-sm">
                      <BadgeCheck className="w-3 h-3" />
                      Localizei
                    </span>
                  )}

                  {(store as any).cashbackPercentage && (store as any).cashbackPercentage > 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <Coins className="w-3 h-3" />
                      {(store as any).cashbackPercentage}% volta
                    </span>
                  )}
                </div>
              </div>

              {(store as any).tags && (store as any).tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {(store as any).tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800/80 text-[9px] text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
                    >
                      <Sparkles className="w-3 h-3 mr-1 text-orange-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      {(store as any).status || "Aberto agora"}
                    </span>
                  </div>
                  {(store as any).eta && (
                    <span className="text-[10px] text-gray-400">
                      • {(store as any).eta} min
                    </span>
                  )}
                </div>

                {(store as any).priceLevel && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {Array.from({ length: (store as any).priceLevel })
                      .map(() => "R$")
                      .join("")}
                  </span>
                )}
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
  onViewAllVerified,
  onViewMasterSponsor,
}) => {
  const { location, isLoading: isLoadingLocation } = useUserLocation();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"nearby" | "topRated" | "cashback" | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Feed State
  const [feedLimit, setFeedLimit] = useState(6);

  const nearbyStores = useMemo(() => {
    if (!stores.length) return [];

    let filtered = [...stores];

    if (selectedFilter === "cashback") {
      filtered = filtered.filter((store) => (store as any).cashbackPercentage && (store as any).cashbackPercentage > 0);
    } else if (selectedFilter === "open_now") {
      filtered = filtered.filter((store) => (store as any).status === "Aberto agora");
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          store.category?.toLowerCase().includes(query) ||
          store.description?.toLowerCase().includes(query) ||
          (store as any).tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    if (location) {
      return filtered.sort((a, b) => {
        const distanceA = (a as any).distance || Infinity;
        const distanceB = (b as any).distance || Infinity;
        return typeof distanceA === 'number' && typeof distanceB === 'number' ? distanceA - distanceB : 0;
      });
    }

    return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [stores, searchQuery, selectedFilter, location]);

  const cashbackStores = useMemo(
    () => stores.filter((store) => (store as any).cashbackPercentage && (store as any).cashbackPercentage > 0),
    [stores]
  );

  const topRatedStores = useMemo(
    () => stores.filter((store) => (store.rating || 0) >= 4.5),
    [stores]
  );

  const trendingStores = useMemo(
    () => stores.filter((store) => (store as any).tags?.includes("Trending") || (store as any).tags?.includes("Popular")),
    [stores]
  );

  const hasAnyStore =
    nearbyStores.length > 0 ||
    cashbackStores.length > 0 ||
    topRatedStores.length > 0 ||
    trendingStores.length > 0;

  const handleFilterClick = (filterId: string) => {
    if (filterId === "cashback") {
      setSelectedFilter(selectedFilter === "cashback" ? null : "cashback");
      setSortOption("cashback");
    } else if (filterId === "open_now") {
      setSelectedFilter(selectedFilter === "open_now" ? null : "open_now");
    } else if (filterId === "nearby") {
      setSortOption("nearby");
    } else if (filterId === "top_rated") {
      setSortOption("topRated");
    } else {
      setSelectedFilter(null);
    }
  };

  const sortedStores = useMemo(() => {
    let list = [...stores];

    if (sortOption === "cashback") {
      list = list
        .filter((store) => (store as any).cashbackPercentage && (store as any).cashbackPercentage > 0)
        .sort((a, b) => ((b as any).cashbackPercentage || 0) - ((a as any).cashbackPercentage || 0));
    } else if (sortOption === "topRated") {
      list = list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "nearby" && location) {
      list = list.sort((a, b) => {
        const distanceA = (a as any).distance || Infinity;
        const distanceB = (b as any).distance || Infinity;
        return typeof distanceA === 'number' && typeof distanceB === 'number' ? distanceA - distanceB : 0;
      });
    }

    if (selectedStyle) {
      list = list.filter((store) =>
        (store as any).tags?.some((tag: string) => tag.toLowerCase().includes(selectedStyle.toLowerCase()))
      );
    }

    return list;
  }, [stores, sortOption, location, selectedStyle]);

  // Feed Logic
  const feedStores = useMemo(() => {
    // Duplicate for infinite effect demo
    const base = [...sortedStores, ...sortedStores, ...sortedStores];
    return base.slice(0, 30);
  }, [sortedStores]);

  const displayedFeed = feedStores.slice(0, feedLimit);
  const hasMoreFeed = feedLimit < feedStores.length;

  const handleLoadMore = () => {
    setFeedLimit(prev => Math.min(prev + 6, feedStores.length));
  };

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
    if (activeStoryIndex !== null && activeStoryIndex < EXPLORE_STORIES.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null); 
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  return (
    <>
      <style>{`
        @keyframes breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-breath {
          animation: breath 4s ease-in-out infinite;
        }
      `}</style>

      <div className="px-4 py-1 pt-4">
        {/* Filtros em Linha Única */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
          
          {/* Botão Filtros como Primeiro Item */}
          <button
            onClick={onFilterClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all whitespace-nowrap flex-shrink-0 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            Filtros
          </button>

          {/* Chips de Filtros Rápidos */}
          {quickFilters.map((filter) => (
            <CategoryChip
              key={filter.id}
              label={filter.label}
              active={
                (filter.id === "cashback" && selectedFilter === "cashback") ||
                (filter.id === "open_now" && selectedFilter === "open_now") ||
                (filter.id === "nearby" && sortOption === "nearby") ||
                (filter.id === "top_rated" && sortOption === "topRated")
              }
              icon={
                filter.icon === "zap" ? (
                  <Zap className="w-3 h-3 text-yellow-400" />
                ) : filter.icon === "star" ? (
                  <Star className="w-3 h-3 text-yellow-400" />
                ) : filter.icon === "clock" ? (
                  <Clock className="w-3 h-3 text-emerald-500" />
                ) : filter.icon === "percent" ? (
                  <Percent className="w-3 h-3 text-emerald-500" />
                ) : undefined
              }
              onClick={() => handleFilterClick(filter.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 space-y-6">
        
        {/* 1) SEÇÃO AGORA NA FREGUESIA (Vertical Cards 9:16) */}
        <section className="mt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Agora na Freguesia
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
            {EXPLORE_STORIES.map((story, index) => {
              const BadgeIcon = story.icon;
              return (
                <button
                  key={story.id}
                  onClick={() => setActiveStoryIndex(index)}
                  className="relative flex-shrink-0 w-[130px] aspect-[9/16] rounded-2xl overflow-hidden group active:scale-95 transition-all duration-300 shadow-sm border border-gray-100 dark:border-gray-800 snap-center hover:shadow-lg"
                >
                  {/* Background - using video poster style */}
                  <div className="absolute inset-0 bg-gray-900">
                     <video 
                       src={story.videoUrl} 
                       className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700" 
                       muted 
                       loop 
                       playsInline 
                     /> 
                     {/* Gradient Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"></div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
                      {story.isLive ? (
                          <span className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded animate-pulse shadow-sm tracking-wide">
                              AO VIVO
                          </span>
                      ) : (
                          <span className={`${story.badgeColor || 'bg-black/60 backdrop-blur-md'} text-white text-[8px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm border border-white/10`}>
                              {BadgeIcon && <BadgeIcon className="w-2 h-2 fill-white" />}
                              {story.badgeText}
                          </span>
                      )}
                      
                      {story.viewers && (
                          <span className="text-[8px] text-white/90 font-medium drop-shadow-md bg-black/30 px-1.5 rounded backdrop-blur-sm">
                              {story.viewers} vendo agora
                          </span>
                      )}
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left z-10">
                      <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-4 h-4 rounded-full border border-white/60 overflow-hidden flex-shrink-0 bg-white">
                              <img src={story.logo} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-white truncate leading-none shadow-black drop-shadow-md">
                              {story.merchantName}
                          </span>
                      </div>
                      
                      <p className="text-[9px] text-gray-200 mb-2 truncate pl-0.5 opacity-90">
                          {story.category}
                      </p>

                      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg py-1 px-1.5 flex items-center justify-center gap-1 group-active:bg-white/30 transition-colors w-full">
                          <span className="text-[8px] font-bold text-white uppercase tracking-wide">Assistir agora</span>
                          <ChevronRight className="w-2.5 h-2.5 text-white" />
                      </div>
                  </div>
                  
                  {/* Subtle Border Glow on Hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 pointer-events-none transition-colors"></div>
                </button>
              );
            })}
          </div>
        </section>

        {hasAnyStore ? (
          <React.Fragment>
            <HorizontalStoreSection
              title="Perto de você agora"
              subtitle="Sugestões na Freguesia e arredores"
              stores={nearbyStores}
              onStoreClick={onStoreClick}
            />

            <HorizontalStoreSection
              title="Você provavelmente vai gostar"
              subtitle="Selecionadas pelo seu estilo e avaliações"
              stores={sortedStores}
              onStoreClick={onStoreClick}
            />

            {cashbackStores.length > 0 && (
              <HorizontalStoreSection
                title="Com cashback"
                subtitle="Ganhe parte do valor de volta nas suas compras"
                stores={cashbackStores}
                onStoreClick={onStoreClick}
              />
            )}

            <HorizontalStoreSection
              title="Tendências na Freguesia"
              subtitle="Lugares que estão chamando atenção por aqui"
              stores={trendingStores}
              onStoreClick={onStoreClick}
            />

            <section className="mt-6 mb-2">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Descubra seu estilo na Freguesia
                    </h2>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                    <CategoryChip
                    label="Romântico"
                    active={selectedStyle === "Romântico"}
                    icon={<Heart className={`w-3 h-3 ${selectedStyle === "Romântico" ? "text-white" : "text-pink-500"}`} />}
                    onClick={() => setSelectedStyle(selectedStyle === "Romântico" ? null : "Romântico")}
                    />
                    <CategoryChip
                    label="Família"
                    active={selectedStyle === "Família"}
                    icon={<Users className={`w-3 h-3 ${selectedStyle === "Família" ? "text-white" : "text-emerald-500"}`} />}
                    onClick={() => setSelectedStyle(selectedStyle === "Família" ? null : "Família")}
                    />
                    <CategoryChip
                    label="Moderno"
                    active={selectedStyle === "Moderno"}
                    icon={<Zap className={`w-3 h-3 ${selectedStyle === "Moderno" ? "text-white" : "text-violet-500"}`} />}
                    onClick={() => setSelectedStyle(selectedStyle === "Moderno" ? null : "Moderno")}
                    />
                    <CategoryChip
                    label="Clássico"
                    active={selectedStyle === "Clássico"}
                    icon={<Star className={`w-3 h-3 ${selectedStyle === "Clássico" ? "text-white" : "text-amber-500"}`} />}
                    onClick={() => setSelectedStyle(selectedStyle === "Clássico" ? null : "Clássico")}
                    />
                </div>
            </section>

            {/* NEW CONTINUE DISCOVERING SECTION */}
            <section className="mt-8 mb-4">
                <div className="mb-4 px-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        Continue descobrindo 👇
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Mais coisas que estão rolando agora na Freguesia
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {displayedFeed.map((store, idx) => {
                        // Deterministic Badge Logic based on index
                        const badges = [
                            { icon: Flame, text: "Em alta", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800" },
                            { icon: TrendingUp, text: "Bombando", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800" },
                            { icon: Coins, text: "Cashback", color: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800" },
                            { icon: Heart, text: "Favorito", color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800" },
                            { icon: MousePointerClick, text: "Muitos acessos", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800" }
                        ];
                        const badge = badges[idx % badges.length];

                        return (
                            <button 
                                key={`feed-${store.id}-${idx}`}
                                onClick={() => onStoreClick(store)}
                                className="w-full bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 flex gap-4 items-center animate-in slide-in-from-bottom-4 duration-700 fill-mode-forwards active:scale-[0.98] transition-all"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-600">
                                    <img 
                                        src={store.logoUrl || getStoreLogo(store.name.length)} 
                                        alt={store.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-[15px] truncate max-w-[65%]">{store.name}</h4>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${badge.color}`}>
                                            <badge.icon className="w-3 h-3" />
                                            {badge.text}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">{store.category} • Freguesia · RJ</p>
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded w-fit">
                                        <Star className="w-3 h-3 fill-current" />
                                        {store.rating}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {hasMoreFeed && (
                    <div className="mt-8 flex flex-col items-center animate-in fade-in duration-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4">
                            Você já descobriu bastante coisa hoje 👀
                        </p>
                        <button 
                            onClick={handleLoadMore}
                            className="bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold text-xs px-8 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98] active:bg-gray-100 flex items-center gap-2 group"
                        >
                            Continuar explorando
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </section>

          </React.Fragment>
        ) : (
          <div className="pt-8 pb-4 flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5 text-gray-400" />
            </div>
            <p className="font-semibold text-sm">Nenhuma loja encontrada</p>
            <p className="text-xs mt-1">
              Ajuste a busca ou os filtros para ver novas opções.
            </p>
          </div>
        )}

        {/* 6) RETENTION BLOCK RESTORED */}
        <section className="mt-8 mb-6 px-1">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 text-center relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Sempre tem algo novo na Freguesia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-xs mx-auto">
                    Quem entra todo dia, economiza mais
                </p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-gray-100 dark:border-gray-700">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Conteúdo diário</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-pink-500 shadow-sm border border-gray-100 dark:border-gray-700">
                            <Gift className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Sorteios</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-green-500 shadow-sm border border-gray-100 dark:border-gray-700">
                            <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Cashback</span>
                    </div>
                </div>

                <button className="w-full bg-[#1E5BFF] hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    Ativar lembrete diário
                </button>
            </div>
        </section>

        {/* --- ADDED MASTER SPONSOR BANNER RESTORED --- */}
        <section className="mt-2 mb-8">
           <MasterSponsorBanner onClick={onViewMasterSponsor} />
        </section>

      </div>

      {activeStory && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in zoom-in-95 duration-200 flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-3">
             {EXPLORE_STORIES.map((s, i) => (
                 <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ 
                            width: i === activeStoryIndex ? `${storyProgress}%` : i < activeStoryIndex ? '100%' : '0%' 
                        }}
                     />
                 </div>
             ))}
          </div>

          <div className="absolute top-6 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/50 bg-gray-50">
                      <img src={activeStory.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-white drop-shadow-md">
                      <p className="font-bold text-sm leading-tight">{activeStory.merchantName}</p>
                      <p className="text-[10px] opacity-80 flex items-center gap-1">
                        {activeStory.status} • {activeStory.category}
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>
                <button 
                  onClick={() => setActiveStoryIndex(null)} 
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-white drop-shadow-md" />
                </button>
              </div>
          </div>

          <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
             <video 
                ref={videoRef}
                src={activeStory.videoUrl} 
                className="w-full h-full object-cover" 
                autoPlay 
                muted={isMuted}
                loop 
                playsInline
             />
             
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

             <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrevStory}></div>
             <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNextStory}></div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-6 z-20 flex justify-center">
             <button className="bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg active:scale-95 transition-transform flex items-center gap-2">
               Ver Oferta <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}
    </>
  );
};
