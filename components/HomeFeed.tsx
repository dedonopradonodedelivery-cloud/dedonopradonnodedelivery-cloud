
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AdType, Category, Store, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  ArrowRight, 
  Star,
  X,
  Wallet,
  Users,
  TrendingUp,
  Flame,
  Zap,
  Dices,
  Clock,
  Coffee,
  ShoppingBag,
  Moon,
  Utensils,
  Award,
  ShieldCheck,
  MessageCircle,
  Handshake,
  MapPin,
  Coins,
  History,
  ArrowUpRight,
  Eye,
  EyeOff,
  BarChart3,
  Sun,
  Snowflake,
  Wind,
  Wrench,
  Bike,
  Rocket,
  Sparkles,
  Compass
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES, EDITORIAL_COLLECTIONS } from '../constants';
import { RecomendadosPorMoradores } from './RecomendadosPorMoradores'; // NEW IMPORT

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectCollection: (collection: EditorialCollection) => void;
  onStoreClick?: (store: Store) => void;
  searchTerm?: string;
  stores: Store[];
  user: User | null;
  userRole?: 'cliente' | 'lojista' | null;
  onSpinWin: (reward: any) => void;
  onRequireLogin: () => void;
}

type TimeContextTag = 'morning' | 'lunch_transition' | 'lunch' | 'afternoon' | 'evening' | 'late_night';

interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bg: string;
  tags: string[]; // e.g., ['morning', 'breakfast', 'cold']
  score?: number;
}

// --- NEW MOCK DATA FOR RECOMENDADOS POR MORADORES ---
interface RecomendacaoItem { // Changed from RecommendedItem to RecomendacaoItem
  id: string; // Added id
  nome: string; // Changed from storeName to nome
  categoria: string; // Changed from category to categoria
  texto: string; // Changed from recommendationText to texto
  totalRecomendacoes: number; // Changed from recommendersCount to totalRecomendacoes
}

const mockRecomendados: RecomendacaoItem[] = [
  {
    id: 'rec-1',
    nome: 'Açougue do Zé',
    categoria: 'Alimentação',
    texto: 'Carnes frescas e o melhor churrasco para o fim de semana!',
    totalRecomendacoes: 25,
  },
  {
    id: 'rec-2',
    nome: 'Salão Beleza Pura',
    categoria: 'Beleza',
    texto: 'Corte e hidratação perfeitos! Atendimento excelente da Ana.',
    totalRecomendacoes: 18,
  },
  {
    id: 'rec-3',
    nome: 'Consertos Rápidos',
    categoria: 'Serviços',
    texto: 'Eletricista de confiança, resolveu meu problema em minutos.',
    totalRecomendacoes: 12,
  },
  // Item extra para garantir que só 3 são exibidos, conforme a lógica do componente RecomendadosPorMoradores
  { 
    id: 'rec-4',
    nome: 'Doceria da Vovó',
    categoria: 'Alimentação',
    texto: 'Os melhores bolos e doces caseiros da região. Imperdível!',
    totalRecomendacoes: 30,
  },
];
// --- END NEW MOCK DATA ---


// --- NOVO SISTEMA DE SUGESTÕES DINÂMICAS ---
const SUGGESTION_POOL: Suggestion[] = [
  { id: 'sug-1', title: 'Pão quentinho na chapa', subtitle: 'Padarias abertas perto de você', icon: <Coffee size={24} className="text-amber-900/80" />, bg: 'bg-amber-400/80', tags: ['morning', 'breakfast', 'cold'] },
  { id: 'sug-2', title: 'Aquele café pra viagem', subtitle: 'Cafeterias com retirada rápida', icon: <Zap size={24} className="text-gray-800" />, bg: 'bg-gray-300/80', tags: ['morning', 'lunch_transition', 'afternoon'] },
  { id: 'sug-3', title: 'Almoço rápido e prático', subtitle: 'Restaurantes com prato do dia', icon: <Utensils size={24} className="text-red-900/80" />, bg: 'bg-red-400/80', tags: ['lunch', 'quick_meal'] },
  { id: 'sug-4', title: 'Opções leves para hoje', subtitle: 'Saladas e bowls refrescantes', icon: <Wind size={24} className="text-green-900/80" />, bg: 'bg-green-400/80', tags: ['lunch', 'hot'] },
  { id: 'sug-5', title: 'Treino matinal', subtitle: 'Academias abertas agora', icon: <TrendingUp size={24} className="text-blue-900/80" />, bg: 'bg-blue-400/80', tags: ['morning', 'fitness'] },
  { id: 'sug-6', title: 'Jantar no bairro', subtitle: 'Restaurantes para fechar o dia', icon: <Moon size={24} className="text-indigo-900/80" />, bg: 'bg-indigo-400/80', tags: ['evening', 'dinner'] },
  { id: 'sug-7', title: 'Conserto rápido', subtitle: 'Técnicos e assistências disponíveis', icon: <Wrench size={24} className="text-gray-800" />, bg: 'bg-slate-400/80', tags: ['afternoon', 'services'] },
  { id: 'sug-8', title: 'Abertos até tarde', subtitle: 'Lanches e conveniência 24h', icon: <Clock size={24} className="text-purple-900/80" />, bg: 'bg-purple-400/80', tags: ['late_night', 'emergency'] },
  { id: 'sug-9', title: 'Happy Hour começando', subtitle: 'Bares com petiscos e chopp', icon: <Flame size={24} className="text-orange-900/80" />, bg: 'bg-orange-400/80', tags: ['evening', 'happy_hour'] },
  { id: 'sug-10', title: 'Pizza quentinha', subtitle: 'Pizzarias com delivery rápido', icon: <Bike size={24} className="text-red-900/80" />, bg: 'bg-red-500/80', tags: ['evening', 'late_night', 'cold', 'delivery'] },
  { id: 'sug-11', title: 'Banho e tosa hoje', subtitle: 'Pet shops com horários livres', icon: <ShoppingBag size={24} className="text-cyan-900/80" />, bg: 'bg-cyan-400/80', tags: ['morning', 'afternoon', 'pet'] },
  { id: 'sug-12', title: 'Açaí pra refrescar', subtitle: 'Opções geladas para o calor', icon: <Snowflake size={24} className="text-purple-900/80" />, bg: 'bg-purple-400/70', tags: ['lunch', 'afternoon', 'hot'] },
];

const getMockWeather = (hour: number) => {
  if (hour >= 11 && hour < 17) return { temp: 30, condition: 'sunny' };
  if (hour < 6 || hour > 20) return { temp: 18, condition: 'clear' };
  return { temp: 22, condition: 'cloudy' };
};

interface BannerItem {
  id: string;
  badge: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
  cta: string;
  action: () => void;
  isSponsored?: boolean;
  gradient: string;
  ctaClass: string;
  iconAnimation?: string;
}

const RouletteIcon: React.FC<{ className?: string }> = ({ className }) => {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#F97316', '#EF4444', '#06B6D4'];
  const sliceAngle = 45;
  const center = 50;
  const radius = 50;

  const getPathD = (index: number) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    return `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 0 1 ${x2},${y2} Z`;
  };

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {colors.map((color, i) => (
        <path key={i} d={getPathD(i)} fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
      ))}
      <circle cx="50" cy="50" r="8" fill="white" />
      <circle cx="50" cy="50" r="5" fill="#334155" />
    </svg>
  );
};


export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onSelectCollection,
  onStoreClick, 
  searchTerm: externalSearchTerm,
  stores,
  user,
  userRole,
  onSpinWin,
  onRequireLogin
}) => {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<any | null>(null);

  const [categoryScroll, setCategoryScroll] = useState({ canScrollLeft: false, canScrollRight: true });
  const [categoryScrollProgress, setCategoryScrollProgress] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCategoryScroll({
        canScrollLeft: scrollLeft > 10,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 10,
    });
    
    if (scrollWidth > clientWidth) {
      const progress = scrollLeft / (scrollWidth - clientWidth);
      setCategoryScrollProgress(progress);
    } else {
      setCategoryScrollProgress(0);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
        const scrollAmount = categoriesRef.current.clientWidth * 0.7;
        categoriesRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  useEffect(() => {
    const container = categoriesRef.current;
    if (container) {
      const checkScroll = () => handleCategoryScroll({ currentTarget: container } as any);
      checkScroll();
      const observer = new ResizeObserver(checkScroll);
      observer.observe(container);
      return () => observer.disconnect();
    }
  }, []);

  const activeSearchTerm = externalSearchTerm || '';
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');

  const dynamicSuggestions = useMemo((): Suggestion[] => {
    const TARGET_SUGGESTION_COUNT = 6;
    const hour = new Date().getHours();
    const { temp } = getMockWeather(hour);
    
    const getTimeTag = (h: number): TimeContextTag => {
      if (h >= 6 && h < 10.5) return 'morning';
      if (h >= 10.5 && h < 12) return 'lunch_transition';
      if (h >= 12 && h < 14.5) return 'lunch';
      if (h >= 14.5 && h < 18) return 'afternoon';
      if (h >= 18 && h < 22) return 'evening';
      return 'late_night';
    };

    const getTempTag = (t: number) => {
      if (t >= 28) return 'hot';
      if (t <= 18) return 'cold';
      return 'neutral';
    };
    
    const timeTag = getTimeTag(hour);
    const tempTag = getTempTag(temp);
    
    const scoredSuggestions = SUGGESTION_POOL.map(s => {
      let score = Math.random() * 5; 
      const isTimeMatch = s.tags.includes(timeTag);
      const isTempMatch = s.tags.includes(tempTag);

      if (isTimeMatch) {
        score += 100;
        if (isTempMatch) {
          score += 50;
        }
      }
      return { ...s, score };
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));
    
    const contextualSuggestions = scoredSuggestions.filter(s => (s.score || 0) >= 100);

    if (contextualSuggestions.length === 0) {
      return [];
    }
      
    return contextualSuggestions.slice(0, TARGET_SUGGESTION_COUNT);
  }, []);


  const banners = useMemo((): BannerItem[] => {
    const list: BannerItem[] = [
      {
        id: 'cashback_promo',
        badge: 'CASHBACK',
        icon: <Coins className="w-24 h-24 text-white/20" />,
        title: 'Dinheiro de volta em\ntodas as compras',
        subtitle: 'Ative agora e economize no bairro',
        gradient: 'from-emerald-500 to-emerald-600',
        cta: 'Ativar Grátis',
        action: () => onNavigate('cashback_info'),
        ctaClass: 'animate-pulse-soft shadow-[0_0_15px_rgba(255,255,255,0.4)]'
      },
      {
        id: 'whatsapp_services',
        badge: 'ORÇAMENTOS',
        icon: <MessageCircle className="w-24 h-24 text-white/20" />,
        title: 'Precisa de conserto rápido?',
        subtitle: 'Compare orçamentos no WhatsApp com profissionais do seu bairro.',
        gradient: 'from-emerald-600 to-teal-700',
        cta: 'Pedir orçamento agora',
        action: () => onNavigate('services'),
        ctaClass: 'animate-bounce-x-small',
        iconAnimation: ''
      },
      {
        id: 'institutional',
        badge: 'SUPER-APP',
        icon: <MapPin className="w-24 h-24 text-white/20" />,
        title: 'O guia definitivo da\nnossa vizinhança',
        subtitle: 'Tudo o que você precisa em um só lugar',
        gradient: 'from-sky-500 to-blue-500',
        cta: 'Explorar o Guia',
        action: () => onNavigate('about'),
        ctaClass: ''
      },
      {
        id: 'freguesia_connect',
        badge: 'OPORTUNIDADE',
        icon: <Handshake className="w-24 h-24 text-white/20" />,
        title: 'Mais visibilidade no seu bairro',
        subtitle: 'Coloque sua loja em destaque e atraia novos clientes locais.',
        gradient: 'from-indigo-600 to-violet-700',
        cta: 'Quero participar',
        action: () => onNavigate('freguesia_connect_public'),
        ctaClass: 'animate-bounce-y'
      }
    ];

    const premiumStores = stores.filter(s => s.adType === AdType.PREMIUM || s.isSponsored);
    if (premiumStores.length > 0) {
      const randomStore = premiumStores[Math.floor(Math.random() * premiumStores.length)];
      list.push({
        id: `ad-${randomStore.id}`,
        badge: 'DESTAQUE',
        icon: <Zap className="w-24 h-24 text-white/10" />,
        title: randomStore.name,
        subtitle: randomStore.description ? randomStore.description.substring(0, 45) + '...' : 'Confira ofertas exclusivas agora.',
        image: randomStore.logoUrl || randomStore.image,
        gradient: 'from-slate-900 to-slate-800',
        cta: 'Visitar loja',
        action: () => onStoreClick?.(randomStore),
        isSponsored: true,
        ctaClass: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent'
      });
    }

    return list;
  }, [onNavigate, stores, onStoreClick]);

  const carouselBanners = useMemo(() => {
    return banners.length > 1 ? [...banners, banners[0]] : banners;
  }, [banners]);

  // Autoplay and infinite loop logic
  useEffect(() => {
    if (banners.length <= 1) return;
  
    autoplayTimerRef.current = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: carouselRef.current.offsetWidth,
          behavior: 'smooth',
        });
      }
    }, 4000);
  
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [banners.length]);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (!target) return;
  
    const { scrollLeft, clientWidth, scrollWidth } = target;
    
    // Update the indicator dots based on the current slide
    const newIndex = Math.round(scrollLeft / clientWidth);
    const newActiveDotIndex = newIndex % banners.length;
    
    if (newActiveDotIndex !== activeBannerIndex) {
        setActiveBannerIndex(newActiveDotIndex);
    }

    // Check if we're at the very end (the cloned slide)
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (isAtEnd) {
      // We have scrolled to the cloned slide. Instantly jump back to the start without animation.
      target.style.scrollBehavior = 'auto';
      target.scrollLeft = 0;
      target.style.scrollBehavior = 'smooth';
    }
  };


  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="relative bg-white dark:bg-gray-900">
            <div ref={carouselRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-0 scroll-smooth">
              {carouselBanners.map((banner, index) => {
                const isActive = activeBannerIndex === (index % banners.length);
                return (
                  <div key={`${banner.id}-${index}`} className="min-w-full snap-center px-4">
                    <div className={`w-full bg-gradient-to-br ${banner.gradient} rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative h-[190px] flex items-center transition-all duration-500 border border-white/10`}>
                      
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-1000">
                         {banner.image ? (
                           <div className="w-[100px] h-[100px] rounded-[2.5rem] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.25)] rotate-3 animate-float bg-white p-1">
                              <img src={banner.image} alt="" className="w-full h-full object-contain rounded-[2.3rem]" />
                           </div>
                         ) : (
                           <div className="mr-8 scale-[2.2] rotate-[-10deg] animate-float opacity-30">
                             {banner.icon}
                           </div>
                         )}
                      </div>

                      <div className="relative z-10 px-7 py-6 flex flex-col justify-center h-full w-full max-w-[65%]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${banner.isSponsored ? 'bg-black/20 text-white' : 'bg-white/20 text-white'}`}>
                            {banner.badge}
                          </span>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2 leading-tight whitespace-pre-line tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                          {banner.title}
                        </h1>
                        <p className="text-white/90 text-[11px] font-medium mb-5 leading-tight line-clamp-1">
                          {banner.subtitle}
                        </p>
                        <button onClick={banner.action} className={`w-fit bg-white text-gray-900 text-[12px] font-bold px-5 py-2.5 rounded-full active:scale-95 transition-all flex items-center gap-2 shadow-lg ${isActive ? banner.ctaClass : ''}`}>
                          {banner.cta} <ArrowRight className={`w-3.5 h-3.5 ${isActive && banner.iconAnimation ? banner.iconAnimation : ''}`} />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 pointer-events-none z-30">
                        {banners.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 rounded-full transition-all duration-500 ${
                                activeBannerIndex === i
                                ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                                : 'w-1 bg-white/40'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'categories':
        return (
          <div key="categories" className="pt-4">
            <div 
              ref={categoriesRef} 
              onScroll={handleCategoryScroll}
              className="flex overflow-x-auto no-scrollbar px-5 pb-2"
            >
              <div className="grid grid-flow-col grid-rows-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat)}
                    className="flex flex-col w-[76px] h-[72px] p-2 gap-1 rounded-2xl bg-[#EAF2FF] dark:bg-gray-800 items-center justify-center cursor-pointer flex-shrink-0 group snap-start border border-[#DBEAFE] dark:border-gray-700 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out"
                  >
                    <div 
                      className="flex items-center justify-center text-[#2D6DF6] dark:text-blue-400 w-7 h-7 group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    >
                      {React.isValidElement(cat.icon) 
                        ? React.cloneElement(cat.icon as React.ReactElement<any>, { 
                            className: `w-7 h-7 text-[#2D6DF6] dark:text-blue-400`, 
                            strokeWidth: 2 
                          }) 
                        : cat.icon}
                    </div>
                    <span 
                      className="font-bold text-gray-600 dark:text-gray-300 text-[10px] text-center line-clamp-1 w-full"
                    >
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                <div 
                  className="h-full bg-primary-500 rounded-full absolute top-0 left-0 w-8 transition-transform duration-100 ease-linear"
                  style={{ transform: `translateX(${categoryScrollProgress * (96 - 32)}px)` }} // 96px track - 32px thumb = 64px travel
                />
              </div>
            </div>
          </div>
        );
      case 'recommendations':
        return null; // This section is removed
      case 'trending': // Replaced with Editorial Collections
        return (
          <div key="trending" className="px-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-gray-400"/>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Guias da Vizinhança</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Seleções especiais para te ajudar a decidir.</p>
                    </div>
                </div>
                <button onClick={() => onNavigate('explore')} className="text-xs font-bold text-primary-500">Ver tudo</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {EDITORIAL_COLLECTIONS.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onSelectCollection(collection)}
                  className="w-full h-32 rounded-2xl overflow-hidden relative group active:scale-[0.98] transition-transform shadow-lg shadow-black/5"
                >
                  <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <h4 className="text-white font-bold text-lg leading-tight drop-shadow-md">{collection.title}</h4>
                    <p className="text-white/90 text-xs drop-shadow-sm">{collection.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'community_recommendations': // NEW SECTION
        return (
          <div key="community_recommendations" className="px-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400"/>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recomendados por Moradores</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">O que a vizinhança está amando e indicando.</p>
                    </div>
                </div>
            </div>
            <RecomendadosPorMoradores items={mockRecomendados} />
          </div>
        );
      case 'filters':
        return (
          <div key="filters" className="px-5">
            <div className="flex items-center gap-1.5 mb-3 px-1">
                 <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Lojas & Serviços</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Encontre os melhores estabelecimentos</p>
                 </div>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'Tudo', icon: Zap },
                { id: 'cashback', label: 'Cashback', icon: TrendingUp },
                { id: 'top_rated', label: 'Melhores', icon: Star },
                { id: 'open_now', label: 'Abertos', icon: Clock }
              ].map((btn) => (
                <button 
                  key={btn.id} 
                  onClick={() => setListFilter(btn.id as any)} 
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 whitespace-nowrap 
                    ${listFilter === btn.id 
                      ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' 
                      : 'bg-[#F2F5FA] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent'}`}
                >
                  <btn.icon className={`w-3.5 h-3.5 ${listFilter === btn.id ? 'text-white' : 'text-[#1E5BFF]'}`} />
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 'highlights':
        if (dynamicSuggestions.length === 0) return null;
        return (
          <div key="highlights" className="px-5">
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <Flame className="w-3.5 h-3.5 text-gray-400" />
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Agora no seu bairro</h3>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x pt-2">
              {dynamicSuggestions.map((item: Suggestion) => (
                <div key={item.id} className={`snap-center flex-shrink-0 w-[190px] bg-[#EAF2FF] dark:bg-gray-800 border border-[#DBEAFE] dark:border-gray-700 p-5 rounded-[24px] flex flex-col gap-4 active:scale-95 transition-all cursor-pointer group shadow-sm hover:shadow-md`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.title}</span>
                    <div className="opacity-100 transition-transform group-hover:scale-110 duration-300 drop-shadow-sm">
                      {React.cloneElement(item.icon as React.ReactElement<any>, { 
                          className: 'text-[#2D6DF6] dark:text-blue-400',
                          size: 24
                      })}
                    </div>
                  </div>
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'roulette_banner':
        return (
          <div key="roulette_banner" className="px-5">
            <div className="flex items-center gap-1.5 mb-2 px-1">
                <Dices className="w-3.5 h-3.5 text-gray-400" />
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Diversão do dia</h3>
            </div>
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all relative overflow-hidden group border border-white/10">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center animate-spin-and-stop">
                  <RouletteIcon className="w-full h-full drop-shadow-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg leading-none mb-1">Roleta da Sorte</h3>
                  <p className="text-xs text-blue-100">Tente a sorte e ganhe prêmios!</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      case 'list':
        return (
          <div key="list" className="px-5 min-h-[300px]">
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-32 bg-white dark:bg-gray-900 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      {activeSearchTerm ? (
        <div className="px-5 mt-4 min-h-[50vh]">
             <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Resultados para "{activeSearchTerm}"</h3>
             </div>
             <div className="flex flex-col gap-3">
                {stores.filter(s => s.name.toLowerCase().includes(activeSearchTerm.toLowerCase())).map((store) => (
                <div key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer active:scale-[0.98] transition-all">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 p-1"><img src={store.logoUrl} className="w-full h-full object-contain" alt={store.name} /></div>
                    <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{store.name}</h4>
                        <span className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-tight">{store.category}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                </div>
                ))}
             </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
            {/* 1. Ordem Final dos Blocos */}
            {renderSection('categories')}
            {renderSection('hero')}
            {renderSection('roulette_banner')}
            {renderSection('highlights')}
            {renderSection('community_recommendations')} {/* NEW SECTION */}
            {renderSection('trending')}
            {renderSection('filters')}
            {renderSection('list')}
            <div className="px-5">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>

            <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center opacity-40">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.5em]">Freguesia • Localizei v1.0.10</p>
            </div>
        </div>
      )}
      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end justify-center animate-in fade-in" onClick={() => setIsSpinWheelOpen(false)}>
          <div className="bg-transparent w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-5 z-50"><button onClick={() => setIsSpinWheelOpen(false)} className="p-2.5 text-gray-200 hover:text-white bg-white/10 backdrop-blur-md rounded-full active:scale-90 transition-transform"><X className="w-5 h-5" /></button></div>
            <div className="animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <SpinWheelView userId={user?.id || null} userRole={userRole || null} onWin={onSpinWin} onRequireLogin={onRequireLogin} onViewHistory={() => { setIsSpinWheelOpen(false); onNavigate('prize_history'); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};