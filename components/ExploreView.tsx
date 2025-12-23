
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

const EXPLORE_STORIES = [
  { 
    id: 's3', 
    merchantName: 'Burger King', 
    category: 'Lanches',
    status: 'Promoção',
    logo: getStoreLogo(1), 
    videoUrl: 'https://videos.pexels.com/video-files/852395/852395-sd_540_960_30fps.mp4', 
    isLive: true,
    viewers: 154,
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
];

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

const HorizontalStoreSection: React.FC<{
  title: string;
  subtitle?: string;
  stores: Store[];
  onStoreClick: (store: Store) => void;
}> = ({ title, subtitle, stores, onStoreClick }) => {
  if (!stores.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">{title}</h2>
          {subtitle && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{subtitle}</p>}
        </div>
        <button className="text-xs font-bold text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">Ver tudo</button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => onStoreClick(store)}
            className="snap-center min-w-[220px] w-[220px] bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-gray-700 overflow-hidden group text-left transition-all duration-300 active:scale-[0.98]"
          >
            <div className="relative h-32 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img src={store.logoUrl || store.image} alt={store.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                 <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/20">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold">{store.rating?.toFixed(1)}</span>
                 </div>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate mb-0.5">{store.name}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {store.distance || "Freguesia"} • {store.category}
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-2.5 mt-1">
                 <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" /> 15 min
                 </span>
                 <ArrowRight className="w-3 h-3 text-[#1E5BFF]" />
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
  const { location } = useUserLocation();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [feedLimit, setFeedLimit] = useState(6);

  // Fix: Added missing activeStory derived from activeStoryIndex and the EXPLORE_STORIES constant
  const activeStory = activeStoryIndex !== null ? EXPLORE_STORIES[activeStoryIndex] : null;

  const nearbyStores = useMemo(() => {
    let filtered = [...stores];
    if (selectedFilter === "cashback") filtered = filtered.filter((s) => (s as any).cashbackPercentage > 0);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
    }
    return filtered;
  }, [stores, searchQuery, selectedFilter]);

  const sortedStores = useMemo(() => [...stores].sort((a, b) => (b.rating || 0) - (a.rating || 0)), [stores]);

  useEffect(() => {
    let interval: any;
    if (activeStoryIndex !== null) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            if (activeStoryIndex < EXPLORE_STORIES.length - 1) setActiveStoryIndex(activeStoryIndex + 1);
            else setActiveStoryIndex(null);
            return 0;
          }
          return prev + 0.3; // 15s approximately
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeStoryIndex]);

  return (
    <>
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Descobrir 👀</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">O que está rolando agora perto de você</p>
      </div>

      <div className="px-4 py-2 sticky top-[64px] z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
          <button onClick={onFilterClick} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm active:scale-95">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
          {quickFilters.map((f) => (
            <CategoryChip
              key={f.id}
              label={f.label}
              active={selectedFilter === f.id}
              icon={f.icon === "zap" ? <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> : f.icon === "star" ? <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> : <Clock className="w-3 h-3 text-emerald-500" />}
              onClick={() => setSelectedFilter(f.id === selectedFilter ? null : f.id)}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pb-20 space-y-8 min-h-screen">
        <section className="mt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                Agora na Freguesia
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
            {EXPLORE_STORIES.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setActiveStoryIndex(index)}
                className="relative flex-shrink-0 w-[140px] aspect-[9/16] rounded-3xl overflow-hidden group active:scale-95 transition-all duration-300 shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-900"
              >
                <div className="absolute inset-0">
                   <video src={story.videoUrl} className="w-full h-full object-cover opacity-90" muted loop playsInline /> 
                   <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
                </div>
                <div className="absolute top-2 left-2 z-10">
                    {story.isLive ? (
                        <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md animate-pulse">AO VIVO</span>
                    ) : (
                        <span className={`${story.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-md`}>{story.badgeText}</span>
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full border border-white/60 overflow-hidden bg-white">
                            <img src={story.logo} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] font-bold text-white truncate shadow-black drop-shadow-md">{story.merchantName}</span>
                    </div>
                    <p className="text-[10px] text-gray-200 mb-2 truncate opacity-90">{story.category}</p>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl py-1.5 px-2 flex items-center justify-center gap-1.5">
                        <Play className="w-2.5 h-2.5 fill-white text-white" />
                        <span className="text-[9px] font-bold text-white uppercase">ASSISTIR</span>
                    </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <HorizontalStoreSection title="Perto de você" stores={nearbyStores} onStoreClick={onStoreClick} />
        <HorizontalStoreSection title="Os favoritos da galera 💙" stores={sortedStores} onStoreClick={onStoreClick} />

        <section className="mt-8 mb-6 px-1">
            <div className="bg-gradient-to-br from-[#1E5BFF] to-[#1749CC] rounded-[32px] p-6 text-center relative overflow-hidden shadow-xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">Sempre tem algo novo</h3>
                <p className="text-sm text-blue-100 mb-6 font-medium">Quem entra todo dia, economiza mais no bairro.</p>
                <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10"><RefreshCw className="w-5 h-5" /></div>
                        <span className="text-[10px] font-bold text-blue-100">Conteúdo</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10"><Gift className="w-5 h-5" /></div>
                        <span className="text-[10px] font-bold text-blue-100">Sorteios</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10"><Zap className="w-5 h-5" /></div>
                        <span className="text-[10px] font-bold text-blue-100">Cashback</span>
                    </div>
                </div>
                <button className="w-full bg-white text-[#1E5BFF] font-extrabold text-sm py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4 fill-[#1E5BFF]" /> Ativar lembrete diário
                </button>
            </div>
        </section>

        <section className="pb-10">
           <MasterSponsorBanner onClick={onViewMasterSponsor} />
        </section>
      </div>

      {activeStoryIndex !== null && activeStory && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300 flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2 pt-3">
             {EXPLORE_STORIES.map((s, i) => (
                 <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                     <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: i === activeStoryIndex ? `${storyProgress}%` : i < activeStoryIndex ? '100%' : '0%' }} />
                 </div>
             ))}
          </div>
          <div className="absolute top-6 left-0 right-0 z-20 px-4 py-2 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/50 bg-gray-50"><img src={activeStory.logo} alt="" className="w-full h-full object-contain" /></div>
                  <div className="text-white">
                      <p className="font-bold text-sm leading-tight">{activeStory.merchantName}</p>
                      <p className="text-[10px] opacity-80">{activeStory.status} • {activeStory.category}</p>
                  </div>
              </div>
              <button onClick={() => setActiveStoryIndex(null)} className="p-1 hover:bg-white/10 rounded-full text-white"><X className="w-7 h-7" /></button>
          </div>
          <div className="flex-1 relative bg-gray-900">
             <video ref={videoRef} src={activeStory.videoUrl} className="w-full h-full object-cover" autoPlay muted={isMuted} loop playsInline />
          </div>
          <div className="absolute bottom-8 left-0 right-0 px-6 z-20">
             <button className="bg-white text-black font-bold py-4 px-8 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center gap-2 w-full justify-center">Ver Oferta <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
};
