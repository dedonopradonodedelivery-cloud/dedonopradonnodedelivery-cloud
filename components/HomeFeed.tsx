
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Store, Category, EditorialCollection, AdType } from '@/types';
import { 
  ChevronRight, 
  ArrowUpRight,
  Crown,
  Zap,
  ThumbsUp,
  MessageSquare,
  MapPin,
  Star,
  Users,
  Briefcase,
  DollarSign,
  Megaphone,
  Smartphone,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Compass,
  FileText,
  Shield,
  Rocket,
  CheckCircle, 
  Image as ImageIcon,
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
  Ban,
  Circle,
  Square
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, EDITORIAL_SERVICES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { supabase } from '@/lib/supabaseClient';
import { trackAdEvent } from '@/lib/analytics';
import { StoreBannerEditor, BannerDesign } from './StoreBannerEditor';

const mapToEditorConfig = (dbConfig: any): BannerDesign => {
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
    },
    { 
      id: 'advertise-home', 
      target: 'store_ads_module',
      config: {
        title: 'Anuncie Sua Marca Aqui',
        subtitle: 'Apareça para milhares de clientes em Jacarepaguá.',
        titleFont: 'font-moderna', titleSize: 'lg',
        subtitleFont: 'font-neutra', subtitleSize: 'sm',
        bgColor: '#FFFFFF', textColor: '#1E5BFF',
        align: 'center', iconName: 'Megaphone', iconPos: 'top',
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
        return prev + 0.75; 
      });
    }, 30);
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
        className="w-full relative aspect-[3/2] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all group"
      >
        <StoreBannerEditor 
            config={current.isUserBanner ? mapToEditorConfig(current.config) : current.config}
            storeName={current.isUserBanner ? (current.config.profiles?.store_name || 'Loja Parceira') : (storeForBanner?.name || 'Localizei JPA')}
            storeLogo={current.isUserBanner ? (current.config.profiles?.logo_url) : (storeForBanner?.logoUrl)}
        />
        
        {/* Protective Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

        {/* Progress Bars (Inside Banner) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-[3px] flex gap-1.5 z-10">
          {allBanners.map((_, idx) => (
            <div key={idx} className="h-full flex-1 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden">
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

// --- O RESTANTE DO COMPONENTE HomeFeed.tsx (SEM ALTERAÇÕES) ---
// FIX: Added HomeFeedProps interface definition to fix TypeScript error.
interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const categoriesRef = useRef<HTMLDivElement>(null);
  const homeStructure = useMemo(() => ['categories', 'home_carousel', 'novidades', 'sugestoes', 'em_alta', 'list'], []);

  const renderSection = (key: string) => {
    switch (key) {
      case 'home_carousel': 
        return (
          <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pt-4">
            <HomeCarousel onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} />
          </div>
        );
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-2 pb-0">
            <div ref={categoriesRef} className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'novidades': return <NovidadesDaSemana key="novidades" stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />;
      case 'sugestoes': return <SugestoesParaVoce key="sugestoes" stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />;
      case 'em_alta': return <EmAltaNaCidade key="em_alta" stores={stores} onStoreClick={onStoreClick} onNavigate={onNavigate} />;
      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-900 pt-1 pb-10">
            <div className="px-5">
              <SectionHeader 
                icon={Compass} 
                title="Explorar Bairro" 
                subtitle="Tudo o que você precisa" 
                onSeeMore={() => onNavigate('explore')}
              />
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit mb-4">
                {['all', 'top_rated'].map((f) => (
                  <button 
                    key={f} 
                    onClick={() => setListFilter(f as any)} 
                    className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}
                  >
                    {f === 'all' ? 'Tudo' : 'Top'}
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

  const MemoizedSections = useMemo(() => {
    return homeStructure.map(section => renderSection(section));
  }, [homeStructure, listFilter, stores, user, onSelectCategory, onNavigate, onStoreClick]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      <div className="flex flex-col w-full gap-1">
          {MemoizedSections}
      </div>
    </div>
  );
};
const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-4">
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
  const newArrivals = useMemo(() => stores.filter(s => (s.image || s.logoUrl) && ['f-38', 'f-39', 'f-45', 'f-42', 'f-50'].includes(s.id)), [stores]);
  if (newArrivals.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-950 py-4 px-5">
      <SectionHeader icon={Sparkles} title="Novidades da Semana" subtitle="Recém chegados" onSeeMore={() => onNavigate('explore')} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {newArrivals.map((store) => (
          <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="flex-shrink-0 w-[180px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative snap-center shadow-2xl group active:scale-[0.98] transition-all">
            <img src={store.image || store.logoUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 p-5 flex flex-col justify-end text-left">
              <span className="w-fit bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 shadow-lg">Novo</span>
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
  const suggestions = useMemo(() => stores.filter(s => (s.image || s.logoUrl) && ['f-3', 'f-5', 'f-8', 'f-12', 'f-15'].includes(s.id)), [stores]);
  if (suggestions.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-5">
      <SectionHeader icon={Lightbulb} title="Sugestões" subtitle="Para você" onSeeMore={() => onNavigate('explore')} />
      <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {suggestions.map((store) => (
          <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="flex-shrink-0 w-[240px] bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden snap-center shadow-xl border border-gray-100 dark:border-gray-800 group active:scale-[0.98] transition-all text-left">
            <div className="relative h-32 overflow-hidden">
              <img src={store.image || store.logoUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
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
  const trending = useMemo(() => stores.filter(s => (s.image || s.logoUrl) && ['f-1', 'f-2'].includes(s.id)), [stores]);
  if (trending.length < 2) return null;
  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-5">
      <SectionHeader icon={TrendingUp} title="Em alta" subtitle="O bairro ama" onSeeMore={() => onNavigate('explore')} />
      <div className="flex gap-4">
        {trending.map((store, idx) => (
          <button key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className={`flex-1 rounded-[2.5rem] p-6 flex flex-col items-center text-center transition-all active:scale-[0.98] shadow-sm ${idx === 0 ? 'bg-rose-50/70 dark:bg-rose-900/20' : 'bg-blue-50/70 dark:bg-blue-900/20'}`}>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-xl border-4 border-white mb-5">
              <img src={store.logoUrl || store.image} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">{store.name}</h3>
            <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">{store.category}</p>
            <div className="mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
              Explorar <ArrowRight size={10} strokeWidth={4} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
