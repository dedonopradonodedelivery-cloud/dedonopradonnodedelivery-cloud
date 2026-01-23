
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Store, Category, AdType } from '@/types';
import { 
  ChevronRight, 
  Crown,
  Zap,
  MapPin,
  Star,
  Users,
  Briefcase,
  Megaphone,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Compass,
  CheckCircle, 
  Flame,
  Percent,
  Tag,
  Gift,
  Utensils,
  Pizza,
  Coffee,
  Beef,
  IceCream,
  ShoppingCart,
  Store as StoreIcon,
  Package,
  Wrench,
  Truck,
  CreditCard,
  Coins,
  Award,
  Smile,
  Bell,
  Clock,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { supabase } from '@/lib/supabaseClient';
import { trackAdEvent } from '@/lib/analytics';
import { BannerDesign } from './StoreBannerEditor';
import { LaunchOfferBanner } from './LaunchOfferBanner';

// --- BANNER VIEWER (LOCAL COMPONENT) ---

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Flame, Zap, Percent, Tag, Gift, Utensils, Pizza, Coffee, Beef, IceCream,
  ShoppingCart, Store: StoreIcon, Package, Wrench, Truck, CreditCard, Coins, Star,
  Award, MapPin, Smile, Bell, Clock, Heart, Sparkles, Rocket: Sparkles, Megaphone, Crown, ShieldCheck
};

const FONT_STYLES = [
  { id: 'font-moderna', name: 'Moderna', family: "'Outfit', sans-serif" },
  { id: 'font-forte', name: 'Forte', family: "'Inter', sans-serif", weight: '900' },
  { id: 'font-elegante', name: 'Elegante', family: "'Lora', serif" },
  { id: 'font-amigavel', name: 'Amigável', family: "'Quicksand', sans-serif" },
  { id: 'font-neutra', name: 'Neutra', family: "'Inter', sans-serif" },
  { id: 'font-impacto', name: 'Impacto', family: "'Anton', sans-serif" },
];

const SIZE_LEVELS = [
  { id: 'xs', name: 'M. Pequeno', titleClass: 'text-lg', subClass: 'text-[9px]' },
  { id: 'sm', name: 'Pequeno', titleClass: 'text-xl', subClass: 'text-[10px]' },
  { id: 'md', name: 'Médio', titleClass: 'text-2xl', subClass: 'text-xs' },
  { id: 'lg', name: 'Grande', titleClass: 'text-3xl', subClass: 'text-sm' },
  { id: 'xl', name: 'M. Grande', titleClass: 'text-4xl', subClass: 'text-base' },
];

const BannerViewer: React.FC<{ 
  config: BannerDesign; 
  storeName: string; 
  storeLogo?: string | null; 
}> = ({ config, storeName, storeLogo }) => {
    const { 
      title, subtitle, titleFont, titleSize, subtitleFont, subtitleSize, 
      bgColor, textColor, align, animation, iconName, iconPos, iconSize, 
      logoDisplay, iconColorMode, iconCustomColor 
    } = config;

    const renderIcon = (name: string | null, size: 'sm' | 'md' | 'lg', colorMode: string) => {
      if (!name || !ICON_COMPONENTS[name]) return null;
      const IconComp = ICON_COMPONENTS[name];
      const sizes = { sm: 24, md: 44, lg: 64 };
      const colors: Record<string, string> = { text: textColor, white: '#FFFFFF', black: '#000000', custom: iconCustomColor || '#1E5BFF' };
      return <IconComp size={sizes[size]} style={{ color: colors[colorMode] }} strokeWidth={2.5} />;
    };

    const getFontStyle = (fontId: string) => {
      const f = FONT_STYLES.find(x => x.id === fontId);
      return f ? { fontFamily: f.family, fontWeight: f.weight || '700' } : {};
    };
    
    return (
      <div 
        className={`w-full h-full p-8 shadow-2xl relative overflow-hidden transition-all duration-500 flex flex-col justify-center border border-white/10 ${
          align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'
        } ${animation === 'pulse' ? 'animate-pulse' : animation === 'float' ? 'animate-float-slow' : ''}`}
        style={{ backgroundColor: bgColor }}
      >
        <div className={`relative z-10 transition-all duration-500 flex ${iconPos === 'top' ? 'flex-col items-inherit' : iconPos === 'right' ? 'flex-row-reverse items-center gap-4' : 'flex-row items-center gap-4'} ${animation === 'slide' ? 'animate-in slide-in-from-left-8' : ''}`}>
          {iconName && (
            <div className={`${iconPos === 'top' ? 'mb-4' : ''} shrink-0`}>
                {renderIcon(iconName, iconSize, iconColorMode)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 w-fit transition-all duration-300">
              {logoDisplay !== 'none' && storeLogo && (
                  <div className={`shrink-0 overflow-hidden bg-white/20 p-0.5 border border-white/20 transition-all duration-300 ${logoDisplay === 'round' ? 'rounded-full' : 'rounded-lg'}`}>
                      <img src={storeLogo} className={`w-5 h-5 object-contain transition-all duration-300 ${logoDisplay === 'round' ? 'rounded-full' : 'rounded-md'}`} alt="Logo" />
                  </div>
              )}
              <div className="bg-black/10 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 w-fit">
                  <span className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: textColor }}>{storeName}</span>
              </div>
            </div>
            <h2 
              className={`font-black leading-tight mb-2 tracking-tight line-clamp-2 transition-all duration-300 ${SIZE_LEVELS.find(s => s.id === titleSize)?.titleClass}`} 
              style={{ ...getFontStyle(titleFont), color: textColor }}
            >
                {title}
            </h2>
            <p 
              className={`font-medium opacity-80 leading-snug max-w-[280px] line-clamp-2 transition-all duration-300 ${SIZE_LEVELS.find(s => s.id === subtitleSize)?.subClass}`} 
              style={{ ...getFontStyle(subtitleFont), color: textColor }}
            >
                {subtitle}
            </p>
          </div>
        </div>
      </div>
    );
};

const mapToViewerConfig = (dbConfig: any): BannerDesign => {
  if (dbConfig.type === 'custom_editor') {
    return dbConfig;
  }
  if (dbConfig.type === 'template') {
    switch (dbConfig.template_id) {
      case 'oferta_relampago':
        return {
          title: dbConfig.subheadline || 'Oferta Imperdível',
          subtitle: `Com ${dbConfig.headline || 'desconto'}!`,
          titleFont: 'font-impacto', titleSize: 'lg',
          subtitleFont: 'font-amigavel', subtitleSize: 'md',
          bgColor: '#DC2626', textColor: '#FFFFFF',
          align: 'center', iconName: 'Flame', iconPos: 'top',
          iconSize: 'lg', logoDisplay: 'none', animation: 'pulse',
          iconColorMode: 'white',
        };
      case 'lancamento':
        return {
          title: dbConfig.headline || 'Lançamento',
          subtitle: dbConfig.subheadline || 'Conheça a novidade.',
          titleFont: 'font-moderna', titleSize: 'lg',
          subtitleFont: 'font-elegante', subtitleSize: 'md',
          bgColor: '#0F172A', textColor: '#FFFFFF',
          align: 'left', iconName: 'Sparkles', iconPos: 'right',
          iconSize: 'lg', logoDisplay: 'square', animation: 'none',
          iconColorMode: 'text'
        };
      default: break;
    }
  }
  return {
    title: 'Anúncio Patrocinado',
    subtitle: 'Confira as novidades da loja.',
    bgColor: '#1E5BFF', textColor: '#FFFFFF',
    titleFont: 'font-moderna', titleSize: 'md',
    subtitleFont: 'font-neutra', subtitleSize: 'sm',
    align: 'left', iconName: null, iconPos: 'left',
    iconSize: 'md', logoDisplay: 'round', animation: 'none',
    iconColorMode: 'text'
  };
};

interface BannerItem {
  id: string;
  target?: string;
  storeSlug?: string;
  isUserBanner?: boolean;
  config: any;
}

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void; onStoreClick?: (store: Store) => void; stores: Store[] }> = ({ onNavigate, onStoreClick, stores }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userBanner, setUserBanner] = useState<BannerItem | null>(null);

  const defaultBanners: BannerItem[] = useMemo(() => [
    { 
      id: 'growth-opportunity', 
      target: 'store_ads_module',
      config: {
        title: 'Sua Loja em Destaque',
        subtitle: 'Anúncios que geram resultado real no seu bairro.',
        titleFont: 'font-impacto', titleSize: 'xl',
        subtitleFont: 'font-neutra', subtitleSize: 'sm',
        bgColor: '#1E5BFF', textColor: '#FFFFFF',
        align: 'left', iconName: 'Rocket', iconPos: 'right',
        iconSize: 'lg', logoDisplay: 'none', animation: 'float',
        iconColorMode: 'white'
      }
    },
    { 
      id: 'master-sponsor', 
      target: 'grupo-esquematiza', 
      storeSlug: 'grupo-esquematiza',
      config: {
        title: 'GRUPO ESQUEMATIZA',
        subtitle: 'Segurança e Facilities para Empresas e Condomínios.',
        titleFont: 'font-forte', titleSize: 'lg',
        subtitleFont: 'font-neutra', subtitleSize: 'sm',
        bgColor: '#0F172A', textColor: '#FFFFFF',
        align: 'left', iconName: 'ShieldCheck', iconPos: 'left',
        iconSize: 'lg', logoDisplay: 'none', animation: 'none',
        iconColorMode: 'text'
      }
    }
  ], []);

  useEffect(() => {
    const fetchHomeBanner = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('published_banners')
                .select('id, config, merchant_id, profiles(store_name, logo_url)')
                .eq('target', 'home')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (error) {
              if (error.code !== 'PGRST116') throw error;
              return;
            }

            if (data) {
                setUserBanner({
                    id: `user-banner-${data.id}`,
                    isUserBanner: true,
                    config: { ...(data.config as object), profiles: data.profiles },
                    target: data.merchant_id,
                });
            } else {
                setUserBanner(null);
            }
        } catch (e: any) {
            console.warn("Home banner fetch suppressed:", e.message || e);
        }
    };
    fetchHomeBanner();
  }, []);

  const allBanners = useMemo(() => userBanner ? [userBanner, ...defaultBanners] : defaultBanners, [userBanner, defaultBanners]);
  
  useEffect(() => {
    const banner = allBanners[currentIndex];
    if (banner) {
        trackAdEvent('ad_impression', banner.id, banner.target, 'home', null, null, currentNeighborhood);
    }
  }, [currentIndex, allBanners, currentNeighborhood]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % allBanners.length);
          return 0;
        }
        return prev + 1; 
      });
    }, 40);
    return () => clearInterval(interval);
  }, [allBanners.length]);

  if (allBanners.length === 0) return null;

  const current = allBanners[currentIndex];

  const handleBannerClick = () => {
    trackAdEvent('ad_click', current.id, current.target, 'home', null, null, currentNeighborhood);
    if (onStoreClick && stores && (current.target || current.storeSlug)) {
      const targetStore = stores.find(s => s.id === (current.storeSlug || current.target));
      if (targetStore) {
        onStoreClick(targetStore);
        return;
      }
    }
    if(current.target) onNavigate(current.target);
  };
  
  const findStore = (slug?: string) => stores?.find(s => s.id === slug);
  const storeForBanner = findStore(current.storeSlug);

  return (
    <div className="px-4 py-2">
      <div 
        onClick={handleBannerClick}
        className="w-full relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 cursor-pointer active:scale-[0.98] transition-all group"
      >
        <BannerViewer 
            config={current.isUserBanner ? mapToViewerConfig(current.config) : current.config}
            storeName={current.isUserBanner ? (current.config.profiles?.store_name || 'Loja Parceira') : (storeForBanner?.name || 'Localizei JPA')}
            storeLogo={current.isUserBanner ? (current.config.profiles?.logo_url) : (storeForBanner?.logoUrl)}
        />
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-[2px] flex gap-1.5 z-10">
          {allBanners.map((_, idx) => (
            <div key={idx} className="h-full flex-1 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear" 
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user,
  userRole
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const homeStructure = useMemo(() => ['categories', 'home_carousel', 'novidades', 'em_alta', 'list'], []);

  const renderSection = (key: string) => {
    switch (key) {
      case 'home_carousel': 
        return (
          <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pb-4">
            <HomeCarousel onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} />
          </div>
        );
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-6 pb-2">
            <div className="grid grid-cols-4 gap-y-6 px-4">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-[#1E5BFF] mb-2 group-hover:bg-[#1E5BFF] group-hover:text-white transition-colors">
                      {React.cloneElement(cat.icon as any, { className: "w-6 h-6", strokeWidth: 2.5 })}
                    </div>
                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 text-center uppercase tracking-widest">{cat.name}</span>
                  </button>
                ))}
            </div>
          </div>
        );
      case 'novidades': return <NovidadesDaSemana key="novidades" stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />;
      case 'em_alta': return <EmAltaNaCidade key="em_alta" stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />;
      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-950 pt-8 pb-10">
            <div className="px-5">
              <SectionHeader 
                icon={Compass} 
                title="Explorar Bairro" 
                subtitle="O que há de melhor perto de você" 
              />
              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                {['all', 'top_rated', 'open_now'].map((f) => (
                  <button 
                    key={f} 
                    onClick={() => setListFilter(f as any)} 
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${listFilter === f ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800'}`}
                  >
                    {f === 'all' ? 'Tudo' : f === 'top_rated' ? 'Top' : 'Aberto'}
                  </button>
                ))}
              </div>
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter as any} user={user} onNavigate={onNavigate} premiumOnly={false} />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-700 pb-32">
      {userRole === 'lojista' && (
        <section className="px-4 py-4">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}
      <div className="flex flex-col w-full gap-2">
          {homeStructure.map(section => renderSection(section))}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-5 px-1">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1E5BFF] shadow-sm">
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{title}</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
      </div>
    </div>
    {onSeeMore && <button onClick={onSeeMore} className="p-2 text-gray-400 hover:text-[#1E5BFF] transition-colors"><ChevronRight size={20} /></button>}
  </div>
);

const NovidadesDaSemana: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const newArrivals = useMemo(() => stores.filter(s => (s.image || s.logoUrl)).slice(0, 5), [stores]);
  return (
    <div className="bg-white dark:bg-gray-950 py-6">
      <div className="px-5">
        <SectionHeader icon={Sparkles} title="Novidades" subtitle="Recém chegados em Jacarepaguá" />
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x px-5">
        {newArrivals.map((store) => (
          <button key={store.id} onClick={() => onStoreClick?.(store)} className="flex-shrink-0 w-[160px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative snap-center shadow-xl group active:scale-95 transition-all">
            <img src={store.image || store.logoUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 p-5 flex flex-col justify-end text-left">
              <span className="w-fit bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2">Novo</span>
              <h3 className="text-sm font-black text-white leading-tight truncate mb-0.5">{store.name}</h3>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest truncate">{store.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const EmAltaNaCidade: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const trending = useMemo(() => stores.filter(s => s.rating >= 4.7).slice(0, 2), [stores]);
  return (
    <div className="bg-white dark:bg-gray-950 py-6 px-5">
      <SectionHeader icon={TrendingUp} title="Em Alta" subtitle="O bairro está amando" />
      <div className="flex gap-4">
        {trending.map((store, idx) => (
          <button key={store.id} onClick={() => onStoreClick?.(store)} className={`flex-1 rounded-[2.5rem] p-6 flex flex-col items-center text-center transition-all active:scale-95 shadow-sm border border-gray-50 dark:border-gray-900 ${idx === 0 ? 'bg-rose-50/50 dark:bg-rose-900/10' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
            <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-white shadow-xl border-4 border-white mb-6">
              <img src={store.logoUrl || store.image} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight mb-1">{store.name}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">{store.category}</p>
            <div className="mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
              Conhecer <ChevronRight size={14} strokeWidth={3} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
