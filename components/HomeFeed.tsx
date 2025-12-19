
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
  Bike
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES } from '../constants';

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
}

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
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [categoryScrollProgress, setCategoryScrollProgress] = useState(0);


  // Funcionalidade de ocultar saldo com persistência na sessão
  const [showBalance, setShowBalance] = useState(() => {
    const saved = sessionStorage.getItem('localizei_show_balance');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    sessionStorage.setItem('localizei_show_balance', String(showBalance));
  }, [showBalance]);

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
    
    // Motor de pontuação com fallback integrado
    const scoredSuggestions = SUGGESTION_POOL.map(s => {
      let score = Math.random() * 5; // Base aleatória para desempate
      const isTimeMatch = s.tags.includes(timeTag);
      const isTempMatch = s.tags.includes(tempTag);

      if (isTimeMatch) {
        score += 100; // Pontuação alta para correspondência de horário
        if (isTempMatch) {
          score += 50; // Bônus extra para correspondência perfeita (horário + temp)
        }
      }
      return { ...s, score };
    })
    .sort((a, b) => b.score - a.score);
      
    return scoredSuggestions.slice(0, TARGET_SUGGESTION_COUNT);
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
        title: 'Quanto custa o reparo?\nDescubra no WhatsApp',
        subtitle: 'Orçamento rápido com técnicos locais',
        gradient: 'from-blue-500 to-blue-600',
        cta: 'Pedir agora',
        action: () => onNavigate('explore'),
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
        cta: 'Conhecer mais',
        action: () => onNavigate('about'),
        ctaClass: ''
      },
      {
        id: 'freguesia_connect',
        badge: 'OPORTUNIDADE',
        icon: <Handshake className="w-24 h-24 text-white/20" />,
        title: 'Sua loja em destaque e\nmais conexões no bairro',
        subtitle: 'Networking real para lojistas locais',
        gradient: 'from-indigo-600 to-violet-700',
        cta: 'Fazer parte',
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

  useEffect(() => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (activeBannerIndex + 1) % banners.length;
        const scrollAmount = carouselRef.current.offsetWidth * nextIndex;
        carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        setActiveBannerIndex(nextIndex);
      }
    }, 4000);
    return () => clearInterval(autoplayTimerRef.current);
  }, [activeBannerIndex, banners.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== activeBannerIndex) setActiveBannerIndex(newIndex);
    }
  };

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    if (scrollWidth <= clientWidth) {
      setCategoryScrollProgress(0);
      return;
    }
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setCategoryScrollProgress(progress);
  };


  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="relative bg-white dark:bg-gray-900">
            <div ref={carouselRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-0 scroll-smooth">
              {banners.map((banner, index) => {
                const isActive = activeBannerIndex === index;
                return (
                  <div key={banner.id} className="min-w-full snap-center px-4">
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
              ref={categoryScrollRef}
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
            <div className="px-5 mt-2">
              <div className="w-full bg-gray-200/30 dark:bg-gray-700/20 rounded-full h-px relative overflow-hidden">
                <div
                  className="bg-blue-400 dark:bg-blue-500 h-px rounded-full absolute"
                  style={{
                    width: '18%',
                    left: `${categoryScrollProgress * 0.82}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      case 'wallet':
        // --- NOVO BANNER DE CASHBACK REATORADO ---
        return (
          <div key="wallet" className="px-5">
            {/* ESTADO 1: CONVIDADO (SEM LOGIN) */}
            {!user && (
              <div 
                onClick={onRequireLogin}
                className="bg-gradient-to-br from-gray-900 to-black rounded-[28px] p-6 flex items-center justify-between h-[190px] cursor-pointer group active:scale-[0.99] transition-transform"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 backdrop-blur-md flex items-center justify-center text-amber-400 border border-amber-400/20 mb-3">
                    <Wallet className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-amber-300 text-lg leading-tight mb-1">Ganhe dinheiro de volta no bairro</h3>
                  <p className="text-amber-200/80 text-sm">Crie sua conta e comece a economizar.</p>
                </div>
                <div className="p-3 rounded-full bg-amber-400 text-black shadow-lg group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </div>
              </div>
            )}

            {/* ESTADO 2: LOJISTA LOGADO */}
            {user && userRole === 'lojista' && (
              <div 
                onClick={() => onNavigate('store_area')}
                className="bg-gradient-to-br from-gray-900 to-black rounded-[28px] p-6 h-[190px] cursor-pointer group active:scale-[0.99] transition-transform flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 backdrop-blur-md flex items-center justify-center text-amber-400 border border-amber-400/20">
                        <BarChart3 className="w-5 h-5"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-300">Painel de Cashback</p>
                        <p className="text-xs text-amber-200/80">Performance do seu negócio</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-amber-200/70 tracking-wider">Cashback Gerado</p>
                    <p className="text-2xl font-bold text-amber-300">R$ 622,50</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-amber-200/70 tracking-wider">Clientes Impactados</p>
                    <p className="text-2xl font-bold text-amber-300">114</p>
                  </div>
                </div>
              </div>
            )}

            {/* ESTADO 3: CLIENTE LOGADO */}
            {user && userRole === 'cliente' && (
              <div 
                onClick={() => onNavigate('user_cashback_flow')}
                className="bg-gradient-to-br from-gray-900 to-black rounded-[28px] p-6 h-[190px] cursor-pointer group active:scale-[0.99] transition-transform flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-amber-200/80 uppercase tracking-[0.3em] mb-0.5">Meu Saldo</p>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[9px] text-amber-200/60 font-bold tracking-widest uppercase">Carteira Segura</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-amber-300 hover:bg-white/20 transition-all active:scale-90"
                    aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
                  >
                    {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {showBalance ? (
                          <>
                            <span className="text-amber-300 text-3xl font-bold opacity-60">R$</span>
                            <span className="text-5xl font-black text-amber-300 tracking-tighter leading-none">12,50</span>
                          </>
                      ) : (
                          <span className="text-4xl font-black text-amber-200/25 tracking-[0.3em] leading-none select-none">•••••</span>
                      )}
                    </div>
                    <div className="p-3 rounded-full bg-amber-400 text-black shadow-xl group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-5 h-5" strokeWidth={3} />
                    </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'master_sponsor':
        return (
          <div key="master_sponsor" className="px-5 mt-6">
            <MasterSponsorBanner 
                onClick={() => onNavigate('patrocinador_master')}
            />
          </div>
        );
      case 'filters':
        return (
          <div key="filters" className="px-5">
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
        return (
          <div key="highlights" className="space-y-4">
            <div className="px-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Agora no seu bairro</h3>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 snap-x">
              {dynamicSuggestions.map((item: Suggestion) => (
                <div key={item.id} className={`snap-center flex-shrink-0 w-[190px] ${item.bg} p-5 rounded-[24px] flex flex-col gap-4 active:scale-95 transition-all cursor-pointer group shadow-sm hover:shadow-md`}>
                  <div className="flex items-center justify-between">
                    <div className="px-2.5 py-1 rounded-lg bg-white/30 dark:bg-black/20 border border-white/20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-800 dark:text-white/90">{item.title}</span>
                    </div>
                    <div className="opacity-100 transition-transform group-hover:scale-110 duration-300 drop-shadow-sm">{item.icon}</div>
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
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all relative overflow-hidden group border border-white/10">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 flex items-center justify-center animate-spin-and-stop">
                  <RouletteIcon className="w-full h-full drop-shadow-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg leading-none mb-1">Roleta da Sorte</h3>
                  <p className="text-xs text-emerald-100">Tente a sorte e ganhe prêmios!</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      case 'tags':
        // This section is now superseded by the dynamic suggestions
        return null;
      case 'list':
        return (
          <div key="list" className="px-5 min-h-[300px]">
              <div className="flex items-center gap-2 mb-4">
                 <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parceiros Verificados</span>
              </div>
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-32 bg-white dark:bg-gray-900 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
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
        <div className="flex flex-col gap-4 w-full">
            {renderSection('categories')}
            {renderSection('hero')}
            {user && renderSection('wallet')}
            {renderSection('roulette_banner')}
            {renderSection('highlights')}
            {renderSection('master_sponsor')}
            {renderSection('filters')}
            {renderSection('list')}

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
