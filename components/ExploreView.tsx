
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
  PlayCircle,
  Tag,
  Map as MapIcon,
  Smile,
  Coffee,
  RefreshCw,
  Gift,
  Bell
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
    statusColor: 'bg-red-600',
    logo: getStoreLogo(1), 
    videoUrl: 'https://videos.pexels.com/video-files/852395/852395-sd_540_960_30fps.mp4', 
    isLive: true 
  },
  { 
    id: 's1', 
    merchantName: 'Padaria Imperial', 
    category: 'Padaria',
    status: 'Promoção',
    statusColor: 'bg-indigo-600',
    logo: getStoreLogo(8), 
    videoUrl: 'https://videos.pexels.com/video-files/2942857/2942857-sd_540_960_24fps.mp4', 
    isLive: false 
  },
  { 
    id: 's2', 
    merchantName: 'Fit Studio', 
    category: 'Fitness',
    status: 'Dica',
    statusColor: 'bg-emerald-600',
    logo: getStoreLogo(7), 
    videoUrl: 'https://videos.pexels.com/video-files/4434246/4434246-sd_540_960_25fps.mp4', 
    isLive: false 
  },
  { 
    id: 's4', 
    merchantName: 'Moda Freguesia', 
    category: 'Moda',
    status: 'Novidade',
    statusColor: 'bg-blue-600',
    logo: getStoreLogo(11), 
    videoUrl: 'https://videos.pexels.com/video-files/6333333/6333333-sd_540_960_30fps.mp4', 
    isLive: false 
  },
  { 
    id: 's5', 
    merchantName: 'Pet Shop Bob', 
    category: 'Serviço',
    status: 'Bastidores',
    statusColor: 'bg-orange-500',
    logo: getStoreLogo(5), 
    videoUrl: 'https://videos.pexels.com/video-files/4625753/4625753-sd_540_960_25fps.mp4', 
    isLive: false 
  },
];

// --- STYLE CARD COMPONENT ---
const StyleCard: React.FC<{
  id: string;
  label: string;
  active: boolean;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  onClick: () => void;
}> = ({ id, label, active, icon: Icon, gradient, iconColor, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative min-w-[100px] h-[110px] rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-95 group overflow-hidden
      ${active 
        ? `${gradient} text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 ring-transparent` 
        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md'
      }
    `}
  >
    {/* Background Pattern for active state */}
    {active && (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent)]" />
    )}

    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
      ${active ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-50 dark:bg-gray-700'}
    `}>
        <Icon className={`w-5 h-5 ${active ? 'text-white' : iconColor}`} />
    </div>
    
    <span className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
        {label}
    </span>
  </button>
);

type HorizontalStoreSectionProps = {
  title: string;
  subtitle?: string;
  stores: Store[];
  onStoreClick: (store: Store) => void;
  onViewAll?: () => void;
  onMapClick?: () => void;
  variant?: 'default' | 'nearby' | 'curated';
};

const HorizontalStoreSection: React.FC<HorizontalStoreSectionProps> = ({
  title,
  subtitle,
  stores,
  onStoreClick,
  onViewAll,
  onMapClick,
  variant = 'default'
}) => {
  if (!stores.length) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
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

        <div className="flex items-center gap-2">
            {onMapClick && (
                <button 
                    onClick={onMapClick}
                    className="text-[10px] font-bold text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                    <MapIcon className="w-3 h-3" />
                    Ver no mapa
                </button>
            )}
            {!onMapClick && (
                <button 
                onClick={onViewAll}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors flex items-center gap-0.5"
                >
                Ver mais
                </button>
            )}
        </div>
      </div>

      <div
        className="horizontal-scroll flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-0.5 px-0.5"
      >
        {stores.map((store, index) => {
          // Logic for Curated Badges
          let curatedBadge = null;
          if (variant === 'curated') {
             if ((store.rating || 0) >= 4.8) {
                 curatedBadge = { text: "⭐ Bem avaliado", bg: "bg-yellow-500", textCol: "text-white" };
             } else if ((store.reviewsCount || 0) > 100) {
                 curatedBadge = { text: "🔥 Popular", bg: "bg-orange-500", textCol: "text-white" };
             } else {
                 curatedBadge = { text: "💙 Favorito do bairro", bg: "bg-blue-600", textCol: "text-white" };
             }
          }

          return (
          <button
            key={store.id}
            onClick={() => onStoreClick(store)}
            className="min-w-[250px] max-w-[260px] bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] border border-gray-100 dark:border-gray-800 overflow-hidden group text-left hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="relative h-28 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img
                src={(store as any).coverImage || store.image || (store as any).imageUrl}
                alt={store.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              {/* CURATED BADGE (Top Left) */}
              {variant === 'curated' && curatedBadge && (
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm z-10 ${curatedBadge.bg} ${curatedBadge.textCol}`}>
                      {curatedBadge.text}
                  </div>
              )}

              {/* OVERLAYS: Variant Logic */}
              <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                
                {variant === 'nearby' ? (
                    // VARIANT NEARBY: Foco em Tempo e Distância
                    <div className="flex gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-sm">
                            <span className="text-[10px] font-bold text-gray-900">⏱ {(store as any).eta || "3 min"}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                            <span className="text-[10px] font-bold text-white">📍 {(store as any).distanceText || store.distance || "500m"}</span>
                        </div>
                    </div>
                ) : (
                    // VARIANT DEFAULT & CURATED (Bottom Info)
                    <>
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
                            {(store as any).distanceText || store.distance || "Perto"}
                        </span>
                        </div>
                    </>
                )}
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-gray-100 dark:border-gray-700 overflow-hidden flex-shrink-0">
                    <img src={store.logoUrl || getStoreLogo(store.name.length)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
                        {store.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                        {(store as any).categoryName || store.category || "Categoria"}
                    </p>
                  </div>
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
                  {/* Se não for variant 'nearby', mostra ETA aqui embaixo. Se for 'nearby', já mostrou na foto */}
                  {variant !== 'nearby' && (store as any).eta && (
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
        )})}
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
      // Enhanced Filter Logic for Styles
      if (selectedStyle === "Romântico") {
          list = list.filter(store => 
              (store as any).tags?.some((t:string) => t.toLowerCase() === 'romântico') ||
              store.category.toLowerCase().includes('restaurante')
          );
      } else if (selectedStyle === "Família") {
          list = list.filter(store => 
              (store as any).tags?.some((t:string) => ['família', 'kids', 'lazer'].includes(t.toLowerCase()))
          );
      } else if (selectedStyle === "Moderno") {
          list = list.filter(store => 
              (store as any).tags?.some((t:string) => ['moderno', 'trendy', 'novo'].includes(t.toLowerCase()))
          );
      } else if (selectedStyle === "Econômico") {
          list = list.filter(store => 
              (store as any).priceLevel === 1 ||
              (store as any).tags?.some((t:string) => t.toLowerCase() === 'promoção')
          );
      } else if (selectedStyle === "Experiências") {
          list = list.filter(store => 
              store.category.toLowerCase().includes('serviço') ||
              (store as any).tags?.some((t:string) => ['workshop', 'lazer', 'spa'].includes(t.toLowerCase()))
          );
      }
    }

    return list;
  }, [stores, sortOption, location, selectedStyle]);

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
      <div className="px-4 py-4 space-y-6">
        
        {/* Stories Section */}
        <section className="mt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Agora na Freguesia
                </h2>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
            {EXPLORE_STORIES.map((story, index) => {
                const isActive = story.isLive || story.status === 'Promoção';
                return (
                  <button
                    key={story.id}
                    onClick={() => setActiveStoryIndex(index)}
                    className={`snap-start relative flex-shrink-0 w-28 h-48 rounded-xl overflow-hidden group shadow-md border dark:border-gray-800 transition-all ${isActive ? 'ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 ring-indigo-500/50' : 'border-gray-100'}`}
                  >
                    {/* Image Background */}
                    <img 
                      src={story.logo} 
                      alt={story.merchantName} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                    {/* Status Badge */}
                    <div className={`absolute top-2 left-2 ${story.statusColor} text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md z-10 shadow-sm border border-white/20 flex items-center gap-1`}>
                        {story.isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        {story.status}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 z-10 flex flex-col items-start text-left">
                      <span className="text-white text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-md mb-0.5">
                          {story.merchantName}
                      </span>
                      <div className="flex items-center gap-1 mb-1.5">
                          <Tag className="w-2.5 h-2.5 text-gray-300" />
                          <span className="text-[9px] text-gray-300 font-medium">{story.category}</span>
                      </div>
                      
                      {/* Micro CTA */}
                      <div className="flex items-center gap-1 text-[8px] font-bold text-white/80 bg-white/20 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                          Toque para ver <ChevronRight className="w-2 h-2" />
                      </div>
                    </div>
                  </button>
                );
            })}
          </div>
        </section>

        {/* SECTION REPLACED: INTERACTIVE STYLE DISCOVERY */}
        <section className="mt-4 mb-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              Como você quer viver a Freguesia hoje?
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
            <StyleCard 
                id="Romântico" 
                label="Romântico" 
                icon={Heart} 
                active={selectedStyle === "Romântico"} 
                gradient="bg-gradient-to-br from-pink-500 to-rose-500"
                iconColor="text-pink-500"
                onClick={() => setSelectedStyle(selectedStyle === "Romântico" ? null : "Romântico")}
            />
            <StyleCard 
                id="Família" 
                label="Família" 
                icon={Users} 
                active={selectedStyle === "Família"} 
                gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                iconColor="text-emerald-500"
                onClick={() => setSelectedStyle(selectedStyle === "Família" ? null : "Família")}
            />
            <StyleCard 
                id="Moderno" 
                label="Moderno" 
                icon={Zap} 
                active={selectedStyle === "Moderno"} 
                gradient="bg-gradient-to-br from-violet-500 to-purple-500"
                iconColor="text-violet-500"
                onClick={() => setSelectedStyle(selectedStyle === "Moderno" ? null : "Moderno")}
            />
            <StyleCard 
                id="Econômico" 
                label="Econômico" 
                icon={Coins} 
                active={selectedStyle === "Econômico"} 
                gradient="bg-gradient-to-br from-yellow-500 to-amber-500"
                iconColor="text-amber-500"
                onClick={() => setSelectedStyle(selectedStyle === "Econômico" ? null : "Econômico")}
            />
            <StyleCard 
                id="Experiências" 
                label="Experiências" 
                icon={Sparkles} 
                active={selectedStyle === "Experiências"} 
                gradient="bg-gradient-to-br from-blue-500 to-indigo-500"
                iconColor="text-indigo-500"
                onClick={() => setSelectedStyle(selectedStyle === "Experiências" ? null : "Experiências")}
            />
          </div>
        </section>

        {hasAnyStore ? (
          <React.Fragment>
            {selectedStyle ? (
                // IF STYLE SELECTED, SHOW FILTERED LIST
                <HorizontalStoreSection
                    title={`Para você: ${selectedStyle}`}
                    subtitle="Sugestões baseadas no seu estilo escolhido"
                    stores={sortedStores}
                    onStoreClick={onStoreClick}
                    onViewAll={onFilterClick}
                    variant="curated"
                />
            ) : (
                // DEFAULT LISTS IF NO STYLE SELECTED
                <>
                    <HorizontalStoreSection
                    title="Perto de você agora"
                    subtitle="A poucos minutos da sua localização"
                    stores={nearbyStores}
                    onStoreClick={onStoreClick}
                    onViewAll={onFilterClick}
                    onMapClick={onLocationClick}
                    variant="nearby"
                    />

                    <HorizontalStoreSection
                    title="Escolhidos pra você"
                    subtitle="Baseado no que você curte e no que está bombando"
                    stores={sortedStores}
                    onStoreClick={onStoreClick}
                    onViewAll={onFilterClick}
                    variant="curated"
                    />

                    {cashbackStores.length > 0 && (
                    <HorizontalStoreSection
                        title="Com cashback"
                        subtitle="Ganhe parte do valor de volta nas suas compras"
                        stores={cashbackStores}
                        onStoreClick={onStoreClick}
                        onViewAll={() => handleFilterClick("cashback")}
                    />
                    )}

                    <HorizontalStoreSection
                    title="Tendências na Freguesia"
                    subtitle="Lugares que estão chamando atenção por aqui"
                    stores={trendingStores}
                    onStoreClick={onStoreClick}
                    onViewAll={onFilterClick}
                    />
                </>
            )}
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

        {/* --- RETENTION BLOCK: 'Volte amanhã' --- */}
        <section className="mt-8 mb-6 px-1">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 text-center relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Volte amanhã</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-xs mx-auto">
                    Todo dia tem novidade diferente na Freguesia
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

        {/* --- ADDED MASTER SPONSOR BANNER --- */}
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
