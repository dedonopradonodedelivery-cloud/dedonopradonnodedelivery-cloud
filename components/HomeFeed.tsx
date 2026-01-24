
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Gift, // Alterado de Tag para Gift
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
  CheckCircle2, 
  Lock, // Adicionado Lock
  Info,
  Shirt, // Adicionado para Banner de Moda
  CarFront // Adicionado para Banner de Serviços Automotivos
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, MOCK_BAIRRO_POSTS, FORBIDDEN_POST_WORDS } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { supabase } from '@/lib/supabaseClient';
import { trackAdEvent } from '@/lib/analytics';
// FIX: Import BannerDesign, Category, and Store interfaces from '@/types'
import { BannerDesign, Category, Store } from '@/types'; 
import { LaunchOfferBanner } from './LaunchOfferBanner';
import { BairroPost } from '@/types'; // Importando o novo tipo de post
import { BairroPostsBlock } from './BairroPostsBlock'; // Importando o novo componente
import { getStoreLogo } from '@/utils/mockLogos'; // Import para mock de logos

// FIX: Define BannerItem interface to resolve type inference issues for carousel items
interface BannerItem {
  id: string;
  target?: string;
  storeSlug?: string;
  isUserBanner?: boolean;
  config: BannerDesign; // Ensures 'imageUrl' is a known property in the config object
  profiles?: { // Add profiles directly here
    store_name: string;
    logo_url: string;
  };
}

// --- BANNER VIEWER (LOCAL COMPONENT) ---

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Flame, Zap, Percent, Tag, Gift, Utensils, Pizza, Coffee, Beef, IceCream,
  ShoppingCart, Store: StoreIcon, Package, Wrench, Truck, CreditCard, Coins, Star,
  Award, MapPin, Smile, Bell, Clock, Heart, Sparkles, Rocket: Sparkles, Megaphone, Crown, ShieldCheck,
  Shirt, CarFront // Adicionado Shirt e CarFront
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
  config: BannerDesign & { imageUrl?: string; }; // Adicionado imageUrl ao config local
  storeName: string; 
  storeLogo?: string | null; 
}> = ({ config, storeName, storeLogo }) => {
    const { 
      title, subtitle, titleFont, titleSize, subtitleFont, subtitleSize, 
      bgColor, textColor, align, animation, iconName, iconPos, iconSize, 
      logoDisplay, iconColorMode, iconCustomColor, imageUrl
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
        style={{
          backgroundColor: bgColor,
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: imageUrl ? 'cover' : undefined,
          backgroundPosition: imageUrl ? 'center' : undefined,
        }}
      >
        {/* Overlay para escurecer imagem de fundo se houver */}
        {imageUrl && <div className="absolute inset-0 bg-black/40"></div>}

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

// --- END LOCAL COMPONENT ---


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
          imageUrl: dbConfig.product_image_url
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
          iconColorMode: 'text',
          imageUrl: dbConfig.product_image_url
        };
      case 'institucional':
        return {
          title: dbConfig.headline || 'Sua Loja',
          subtitle: dbConfig.subheadline || 'Qualidade e Tradição.',
          titleFont: 'font-forte', titleSize: 'lg',
          subtitleFont: 'font-neutra', subtitleSize: 'sm',
          bgColor: '#FFFFFF', textColor: '#111827',
          align: 'center', iconName: 'Store', iconPos: 'top',
          iconSize: 'md', logoDisplay: 'round', animation: 'none',
          iconColorMode: 'text',
          imageUrl: dbConfig.logo_url
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

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void; onStoreClick?: (store: Store) => void; stores: Store[] }> = ({ onNavigate, onStoreClick, stores }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userBanner, setUserBanner] = useState<BannerItem | null>(null);

  const defaultBanners: BannerItem[] = useMemo(() => [
    { // Banner 1: App Official Promo
      id: 'app-ads-promo',
      target: 'store_ads_module', // Navigates to ads module
      config: {
        title: 'Anuncie sua loja a partir de R$ 29,90',
        subtitle: 'Promoção de inauguração dos banners por tempo indeterminado. Anunciar agora!',
        titleFont: 'font-impacto', titleSize: 'xl',
        subtitleFont: 'font-neutra', subtitleSize: 'sm',
        bgColor: '#1E5BFF', textColor: '#FFFFFF',
        align: 'center', iconName: 'Megaphone', iconPos: 'top',
        iconSize: 'lg', logoDisplay: 'none', animation: 'float',
        iconColorMode: 'white'
      }
    },
    { // Banner 2: Restaurante Sabor do Bairro
      id: 'restaurante-sabor-bairro',
      target: 'store_detail', // Navigates to store detail
      storeSlug: 'restaurante-sabor-bairro', // Match with STORES mock ID
      config: {
        title: 'Almoço especial hoje',
        subtitle: 'Pratos caseiros feitos na hora. Ver cardápio.',
        titleFont: 'font-elegante', titleSize: 'lg',
        subtitleFont: 'font-amigavel', subtitleSize: 'md',
        bgColor: '#15803D', textColor: '#FFFFFF', // Dark green for food
        align: 'left', iconName: 'Utensils', iconPos: 'left',
        iconSize: 'md', logoDisplay: 'round', animation: 'none',
        iconColorMode: 'white',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edab74dad?q=80&w=800&auto=format&fit=crop' // Restaurant interior/dish
      }
    },
    { // Banner 3: Loja Estilo Urbano
      id: 'loja-estilo-urbano',
      target: 'store_detail',
      storeSlug: 'loja-estilo-urbano',
      config: {
        title: 'Nova coleção já disponível',
        subtitle: 'Peças exclusivas no bairro. Conhecer loja.',
        titleFont: 'font-moderna', titleSize: 'lg',
        subtitleFont: 'font-neutra', subtitleSize: 'md',
        bgColor: '#8B5CF6', textColor: '#FFFFFF', // Purple for fashion
        align: 'right', iconName: 'Shirt', iconPos: 'right',
        iconSize: 'md', logoDisplay: 'square', animation: 'none',
        iconColorMode: 'white',
        imageUrl: 'https://images.unsplash.com/photo-1596753040212-0761e3894458?q=80&w=800&auto=format&fit=crop' // Fashion model/clothing
      }
    },
    { // Banner 4: Oficina Auto JPA
      id: 'oficina-auto-jpa',
      target: 'store_detail',
      storeSlug: 'oficina-auto-jpa',
      config: {
        title: 'Seu carro em boas mãos',
        subtitle: 'Revisão e manutenção completa. Falar com a loja.',
        titleFont: 'font-forte', titleSize: 'lg',
        subtitleFont: 'font-neutra', subtitleSize: 'sm',
        bgColor: '#212121', textColor: '#FFFFFF', // Dark gray/black for auto
        align: 'left', iconName: 'CarFront', iconPos: 'left',
        iconSize: 'md', logoDisplay: 'round', animation: 'none',
        iconColorMode: 'white',
        imageUrl: 'https://images.unsplash.com/photo-1582236371300-84a1e9c5f87b?q=80&w=800&auto=format&fit=crop' // Car service garage
      }
    }
  ], []);

  useEffect(() => {
    const fetchHomeBanner = async () => {
        if (!supabase) return;
        try {
            // FIX: Ensure to select 'profiles' to get store_name and logo_url
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
                    config: data.config as BannerDesign, // Pass raw config
                    profiles: data.profiles,             // Pass profiles separately
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
  // FIX: Prioritize current.profiles for store_name and logo_url
  const storeForBanner = current.storeSlug ? findStore(current.storeSlug) : undefined;
  const storeNameForViewer = current.profiles?.store_name || storeForBanner?.name || 'Localizei JPA'; // FIX: Removed current.config.storeName
  const storeLogoForViewer = current.profiles?.logo_url || storeForBanner?.logoUrl || getStoreLogo(storeNameForViewer.length); // FIX: Removed current.config.logoUrl

  return (
    <div className="px-4 py-2">
      <div 
        onClick={handleBannerClick}
        className="w-full relative aspect-[3/2] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 cursor-pointer active:scale-[0.98] transition-all group"
      >
        <BannerViewer 
            config={current.config} // Now current.config is purely BannerDesign
            storeName={storeNameForViewer}
            storeLogo={storeLogoForViewer}
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

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
const WeeklyDiscountBlock: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const consecutiveDays = parseInt(localStorage.getItem('consecutive_days_count') || '1');
    const [animatedDays, setAnimatedDays] = useState(0);
    const [isCelebrated, setIsCelebrated] = useState(false);
    const [showShine, setShowShine] = useState(true);
    const days = [1, 2, 3, 4, 5];

    useEffect(() => {
        // Animação coreografada do Dia 0 -> Dia Atual ao carregar
        const timer = setTimeout(() => {
            let current = 0;
            const interval = setInterval(() => {
                if (current < consecutiveDays) {
                    current++;
                    setAnimatedDays(current);
                } else {
                    clearInterval(interval);
                }
            }, 120); // Delay entre a animação de cada dia
        }, 600);
        
        // Remove o shine do botão após 4 segundos (2 ciclos)
        const shineTimer = setTimeout(() => setShowShine(false), 4000);
        
        return () => {
          clearTimeout(timer);
          clearTimeout(shineTimer);
        };
    }, [consecutiveDays]);

    const handleActionClick = () => {
        if (consecutiveDays === 1 && !isCelebrated) {
          setIsCelebrated(true);
          // Pequeno delay para a celebração visual antes de mudar de página
          setTimeout(onClick, 850);
        } else {
          onClick();
        }
    };
    
    // Determine o texto do subheader com base no estado
    const subheaderText = isCelebrated 
      ? `Dia 1 liberado! Volte amanhã para o Dia 2.` 
      : (consecutiveDays > 1 ? `Continue acessando e seu cupom será liberado no Dia ${consecutiveDays + 1}.` : `Volte todos os dias e desbloqueie seu benefício.`);
    
    // Determine o texto do botão
    const buttonText = isCelebrated 
      ? 'Resgatado!' 
      : (consecutiveDays > 1 ? 'Acompanhar Recompensa' : 'Liberar Dia 1');

    return (
        <div className="px-5 w-full">
            <style>{`
              @keyframes shine-slide {
                0% { transform: translateX(-200%) skewX(-20deg); }
                30% { transform: translateX(200%) skewX(-20deg); }
                100% { transform: translateX(200%) skewX(-20deg); }
              }
              .btn-shine-effect {
                position: relative;
                overflow: hidden;
              }
              .btn-shine-effect::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
                animation: shine-slide 2.5s infinite;
              }
              @keyframes float-subtle {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-3px) rotate(1deg); }
              }
            `}</style>

            <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {/* Headline: Ícone de Presente com Animação */}
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg animate-[float-subtle_2s_ease-in-out_infinite]">
                            <Gift className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">🎁 Recompensa da Semana</h2>
                    </div>
                    {/* Indicador de Progresso Minimalista com Animação Staggered */}
                    <div className="flex gap-1.5" id="weekly-promo-progress-indicators">
                        {days.map(d => (
                            <div 
                              key={d} 
                              className={`w-5 h-5 rounded-full transition-all duration-500 relative flex items-center justify-center ${
                                d <= animatedDays 
                                  ? 'bg-emerald-500 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`} 
                              // Adiciona delay para animação staggered ao completar
                              style={{ animationDelay: `${d * 50 + 100}ms` }}
                            >
                                {d <= animatedDays ? (
                                    <div className="animate-in zoom-in duration-300">
                                        <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                                    </div>
                                ) : (
                                    <Lock size={10} className="text-gray-400 opacity-40" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Subheadline Motivacional */}
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 leading-tight font-medium" id="weekly-promo-subheader">
                  {subheaderText}
                </p>
                {/* Microcopy de Escassez */}
                <p className="text-[9px] text-gray-400 opacity-70 mb-4 font-medium" id="weekly-promo-scarcity-text">
                    Exclusivo para quem acompanha o bairro.
                </p>
                
                {/* Botão Principal com Animação Condicional */}
                <button 
                    onClick={handleActionClick} 
                    className={`w-full font-black py-3.5 rounded-xl active:scale-[0.96] transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 ${
                        isCelebrated 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-[#1E5BFF] text-white shadow-md shadow-blue-500/10'
                    } ${showShine && !isCelebrated ? 'btn-shine-effect' : ''}`}
                    id="weekly-promo-main-button"
                >
                    {isCelebrated ? (
                      <span className="flex items-center gap-2 animate-in zoom-in duration-300">
                         <CheckCircle size={14} strokeWidth={3} />
                         {buttonText}
                      </span>
                    ) : (
                      <>
                        {buttonText}
                        <ArrowRight className="w-5 h-5" strokeWidth={3} />
                      </>
                    )}
                </button>
            </div>
        </div>
    );
};
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
  const categoriesRef = useRef<HTMLDivElement>(null);
  const homeStructure = useMemo(() => ['categories', 'home_carousel', 'weekly_promo', 'bairro_posts', 'list'], []);

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
      case 'weekly_promo': 
        return userRole !== 'lojista' && (
            <div key="weekly_promo_container" className="py-2">
                <WeeklyDiscountBlock onClick={() => onNavigate('weekly_promo')} />
            </div>
        );
      case 'bairro_posts': // NOVO BLOCO
        return (
          <div key="bairro_posts_container" className="py-4">
              <BairroPostsBlock posts={MOCK_BAIRRO_POSTS} onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} />
          </div>
        );
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
  }, [homeStructure, listFilter, stores, user, onSelectCategory, onNavigate, onStoreClick, userRole]);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      {userRole === 'lojista' && (
        <section className="px-4 py-4 bg-white dark:bg-gray-950">
           <LaunchOfferBanner onClick={() => onNavigate('store_ads_module')} />
        </section>
      )}
      <div className="flex flex-col w-full gap-4">
          {MemoizedSections}
      </div>
    </div>
  );
};
