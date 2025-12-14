
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
  Play,
  Eye,
  Rocket
} from "lucide-react";
import { useUserLocation } from "../hooks/useUserLocation";
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

// --- MOCK DATA FOR STORIES (Vertical 9:16 Format) ---
// Simula conteúdo "vivo" como Instagram Reels / TikTok
const EXPLORE_STORIES = [
  { 
    id: 's3', 
    merchantName: 'Burger King', 
    category: 'Lanches',
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
    badgeColor: 'bg-yellow-500 text-black',
    badgeText: 'Novo hoje',
    icon: Star
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
    badgeText: 'Bombando',
    icon: TrendingUp
  },
  { 
    id: 's5', 
    merchantName: 'Pet Shop Bob', 
    category: 'Serviço',
    status: 'Bastidores',
    logo: getStoreLogo(5), 
    videoUrl: 'https://videos.pexels.com/video-files/4625753/4625753-sd_540_960_25fps.mp4', 
    isLive: false,
    badgeColor: 'bg-purple-600',
    badgeText: 'Oferta Relâmpago',
    icon: Rocket
  },
];

// Chip de categoria reutilizável
const CategoryChip: React.FC<{
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({ label, active, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 active:scale-95 shadow-sm
      ${
        active
          ? "bg-gradient-to-r from-[#1E5BFF] to-[#1749CC] text-white border-transparent shadow-blue-500/30"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
  >
    {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
    <span>{label}</span>
  </button>
);

// Componente de seção horizontal de lojas
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
  if (!stores.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <button className="text-xs font-bold text-[#1E5BFF] hover:text-[#1749CC] transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            Ver mais
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => onStoreClick(store)}
            className="snap-center min-w-[220px] w-[220px] bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden group text-left hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="relative h-32 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src={(store as any).coverImage || store.image || (store as any).imageUrl}
                alt={store.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              
              <div className="absolute top-2 right-2">
                 {(store as any).isOpenNow ? (
                    <span className="text-[9px] font-bold text-white bg-green-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Aberto agora
                    </span>
                 ) : null}
              </div>

              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                 <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/20">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold">{store.rating?.toFixed(1)}</span>
                 </div>
              </div>
            </div>

            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-0.5">
                {store.name}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {store.distance || "Freguesia"} • {(store as any).categoryName || store.category}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-2.5 mt-1">
                 <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" /> {(store as any).eta || '15 min'}
                 </span>
                 <span className="text-[10px] font-bold text-[#1E5BFF] flex items-center gap-1">
                    Ver no mapa <ArrowRight className="w-3 h-3" />
                 </span>
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
  
  // Story Player State
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Feed State
  const [feedLimit, setFeedLimit] = useState(6);

  // --- FILTERS & SORTING LOGIC ---
  const nearbyStores = useMemo(() => {
    if (!stores.length) return [];
    let filtered = [...stores];
    
    // Quick filters
    if (selectedFilter === "cashback") {
      filtered = filtered.filter((store) => (store as any).cashbackPercentage && (store as any).cashbackPercentage > 0);
    } else if (selectedFilter === "open_now") {
      filtered = filtered.filter((store) => (store as any).isOpenNow);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          store.category?.toLowerCase().includes(query)
      );
    }

    // Sort by distance (mocked)
    return filtered.sort((a, b) => ((a as any).distanceKm || 0) - ((b as any).distanceKm || 0));
  }, [stores, searchQuery, selectedFilter, location]);

  const sortedStores = useMemo(() => [...stores].sort((a, b) => (b.rating || 0) - (a.rating || 0)), [stores]);
  const hasAnyStore = nearbyStores.length > 0 || sortedStores.length > 0;

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

  // --- FEED INFINITO LOGIC ---
  const feedStores = useMemo(() => {
    // Duplicate stores to simulate infinite feed for demo
    const base = [...sortedStores, ...nearbyStores, ...sortedStores]; 
    return base.slice(0, 30);
  }, [sortedStores, nearbyStores]);

  const displayedFeed = feedStores.slice(0, feedLimit);
  const hasMoreFeed = feedLimit < feedStores.length;

  const handleLoadMore = () => {
    setFeedLimit(prev => Math.min(prev + 6, feedStores.length));
  };

  // --- STORY PLAYER LOGIC ---
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
    <>
      <style>{`
        @keyframes breath { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-breath { animation: breath 4s ease-in-out infinite; }
      `}</style>

      {/* 1️⃣ TOPO DA TELA - Header */}
      <div className="px-5 pt-6 pb-2 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display leading-tight">
            Descobrir na Freguesia 👀
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            O que está rolando agora, perto de você
        </p>
      </div>

      <div className="px-4 py-2 sticky top-[64px] z-20 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm pb-4">
        {/* Filtros em Linha Única */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
          <button onClick={onFilterClick} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all whitespace-nowrap flex-shrink-0 shadow-sm active:scale-95">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
          {quickFilters.map((filter) => (
            <CategoryChip
              key={filter.id}
              label={filter.label}
              active={ (filter.id === "cashback" && selectedFilter === "cashback") || (filter.id === "open_now" && selectedFilter === "open_now") || (filter.id === "nearby" && sortOption === "nearby") || (filter.id === "top_rated" && sortOption === "topRated") }
              icon={ filter.icon === "zap" ? <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> : filter.icon === "star" ? <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> : filter.icon === "clock" ? <Clock className="w-3 h-3 text-emerald-500" /> : filter.icon === "percent" ? <Percent className="w-3 h-3 text-emerald-500" /> : undefined }
              onClick={() => handleFilterClick(filter.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pb-20 space-y-8 min-h-screen">
        
        {/* 2️⃣ SEÇÃO: AGORA NA FREGUESIA (STORIES 9:16) */}
        <section className="mt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                Agora na Freguesia
                </h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
            {EXPLORE_STORIES.map((story, index) => {
              const BadgeIcon = story.icon;
              return (
                <button
                  key={story.id}
                  onClick={() => setActiveStoryIndex(index)}
                  className="relative flex-shrink-0 w-[140px] aspect-[9/16] rounded-2xl overflow-hidden group active:scale-95 transition-all duration-300 shadow-lg border border-gray-100 dark:border-gray-800 snap-center hover:shadow-xl bg-gray-900"
                >
                  {/* Background - using video poster style */}
                  <div className="absolute inset-0 bg-gray-900">
                     <video src={story.videoUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" muted loop playsInline /> 
                     <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5 z-10">
                      {story.isLive ? (
                          <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md animate-pulse shadow-sm tracking-wide border border-red-500/50 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> AO VIVO
                          </span>
                      ) : (
                          <span className={`${story.badgeColor || 'bg-black/60 backdrop-blur-md'} text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-white/10`}>
                              {BadgeIcon && <BadgeIcon className="w-2.5 h-2.5 fill-white" />}
                              {story.badgeText}
                          </span>
                      )}
                      
                      {story.viewers && (
                          <span className="text-[9px] text-white/90 font-bold drop-shadow-md bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {story.viewers} vendo
                          </span>
                      )}
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left z-10">
                      <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 rounded-full border border-white/60 overflow-hidden flex-shrink-0 bg-white">
                              <img src={story.logo} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[11px] font-bold text-white truncate leading-none shadow-black drop-shadow-md">
                              {story.merchantName}
                          </span>
                      </div>
                      
                      <p className="text-[10px] text-gray-200 mb-2.5 truncate pl-0.5 opacity-90 font-medium">
                          {story.category}
                      </p>

                      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 group-active:bg-white/30 transition-colors w-full shadow-sm">
                          <Play className="w-2.5 h-2.5 fill-white text-white" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-wide">ASSISTIR AGORA</span>
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
            {/* 3️⃣ SEÇÃO: PERTO DE VOCÊ AGORA */}
            <HorizontalStoreSection
              title="Perto de você agora"
              subtitle="Chegue em poucos minutos"
              stores={nearbyStores}
              onStoreClick={onStoreClick}
            />

            {/* 4️⃣ SEÇÃO: VOCÊ PROVAVELMENTE VAI GOSTAR */}
            <HorizontalStoreSection
              title="Você provavelmente vai gostar 💙"
              subtitle="Baseado no que a Freguesia adora"
              stores={sortedStores}
              onStoreClick={onStoreClick}
            />

            {/* 5️⃣ SEÇÃO: COMO VOCÊ QUER VIVER A FREGUESIA HOJE? */}
            <section className="mt-2 mb-4">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight max-w-[80%]">
                        Como você quer viver a Freguesia hoje?
                    </h2>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                    <CategoryChip label="💖 Romântico" active={selectedStyle === "Romântico"} onClick={() => setSelectedStyle(selectedStyle === "Romântico" ? null : "Romântico")} />
                    <CategoryChip label="👨‍👩‍👧 Família" active={selectedStyle === "Família"} onClick={() => setSelectedStyle(selectedStyle === "Família" ? null : "Família")} />
                    <CategoryChip label="⚡ Moderno" active={selectedStyle === "Moderno"} onClick={() => setSelectedStyle(selectedStyle === "Moderno" ? null : "Moderno")} />
                    <CategoryChip label="⭐ Clássico" active={selectedStyle === "Clássico"} onClick={() => setSelectedStyle(selectedStyle === "Clássico" ? null : "Clássico")} />
                </div>
            </section>

            {/* 6️⃣ SEÇÃO: CONTINUE DESCOBRINDO (OBRIGATÓRIA) */}
            <section className="mt-8 mb-4">
                <div className="mb-5 px-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                        Continue descobrindo 👇
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        O que está bombando no bairro
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
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-600">
                                    <img 
                                        src={store.logoUrl || getStoreLogo(store.name.length)} 
                                        alt={store.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-[15px] truncate max-w-[60%]">{store.name}</h4>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${badge.color}`}>
                                            <badge.icon className="w-3 h-3" />
                                            {badge.text}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{store.category} • Freguesia · RJ</p>
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 px-2 py-0.5 rounded w-fit border border-yellow-100 dark:border-yellow-800/30">
                                        <Star className="w-3 h-3 fill-current" />
                                        {store.rating}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 7️⃣ FEEDBACK DE PROGRESSO */}
                {hasMoreFeed && (
                    <div className="mt-10 flex flex-col items-center animate-in fade-in duration-700 text-center">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider">
                            Você já descobriu bastante coisa hoje 👀
                        </p>
                        <button 
                            onClick={handleLoadMore}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs px-8 py-3.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98] shadow-sm flex items-center gap-2 group"
                        >
                            Continuar explorando
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </section>

          </React.Fragment>
        ) : (
          <div className="pt-20 pb-4 flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Compass className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-bold text-base mb-1">Nenhum resultado</p>
            <p className="text-xs max-w-xs">
              Tente ajustar seus filtros para encontrar o que procura.
            </p>
          </div>
        )}

        {/* 8️⃣ BLOCO: SEMPRE TEM ALGO NOVO NA FREGUESIA (OBRIGATÓRIO) */}
        <section className="mt-8 mb-6 px-1">
            <div className="bg-gradient-to-br from-[#1E5BFF] to-[#1749CC] dark:from-indigo-900 dark:to-blue-900 rounded-[24px] p-6 text-center relative overflow-hidden shadow-lg shadow-blue-500/20">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                <h3 className="text-xl font-bold text-white mb-2 font-display">Sempre tem algo novo</h3>
                <p className="text-sm text-blue-100 mb-6 max-w-xs mx-auto font-medium">
                    Quem entra todo dia, economiza mais.
                </p>

                <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-100">Conteúdo diário</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                            <Gift className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-100">Sorteios</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                            <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-100">Cashback</span>
                    </div>
                </div>

                <button className="w-full bg-white text-[#1E5BFF] font-extrabold text-sm py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-gray-50">
                    <Bell className="w-4 h-4 fill-[#1E5BFF]" />
                    Ativar lembrete diário
                </button>
            </div>
        </section>

        {/* 9️⃣ BANNER FINAL — PATROCINADOR MASTER (FIXO) */}
        <section className="mt-2 mb-8">
           <MasterSponsorBanner 
             onClick={onViewMasterSponsor} 
             className="bg-[#0F172A]" // Dark premium card
           />
        </section>

      </div>

      {/* STORY PLAYER MODAL (Mantido para funcionamento) */}
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
                  {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
                </button>
                <button 
                  onClick={() => setActiveStoryIndex(null)} 
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-7 h-7 text-white drop-shadow-md" />
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
             
             <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

             <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrevStory}></div>
             <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNextStory}></div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 px-6 z-20 flex justify-center">
             <button className="bg-white text-black font-bold py-4 px-8 rounded-full shadow-xl active:scale-95 transition-transform flex items-center gap-2 text-sm w-full justify-center">
               Ver Oferta <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}
    </>
  );
};
