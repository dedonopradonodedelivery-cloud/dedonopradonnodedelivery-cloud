
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AdType, Category, Store, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  Loader2,
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
  Info,
  MessageCircle,
  Gift,
  Handshake
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';

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

type TimeContext = 'morning' | 'afternoon' | 'night';

interface BannerItem {
  id: string;
  badge?: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  action: () => void;
  isSponsored?: boolean;
  gradient?: string;
}

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

  const activeSearchTerm = externalSearchTerm || '';
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');

  const timeContext = useMemo((): TimeContext => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
  }, []);

  const banners = useMemo((): BannerItem[] => {
    const fixedBanners: BannerItem[] = [
      {
        id: 'cashback_promo',
        badge: 'ECONOMIA REAL',
        icon: <Wallet className="w-3 h-3" />,
        title: 'Cashback no\ncomércio do bairro',
        subtitle: 'Compre perto de casa e ganhe dinheiro de volta.',
        image: 'https://nyneuuvcdmtqjyaqrztz.supabase.co/storage/v1/object/public/assets/cashback_bag.png?t=1',
        gradient: 'from-[#2D6DF6] to-[#1B54D9]',
        cta: 'Ativar cashback',
        action: () => onNavigate('cashback_info'),
        isSponsored: false
      },
      {
        id: 'whatsapp_services',
        badge: 'AGILIDADE',
        icon: <MessageCircle className="w-3 h-3" />,
        title: 'Serviços locais em\npoucos minutos',
        subtitle: 'Peça orçamento de eletricista, encanador, limpeza, manutenção e mais — direto no WhatsApp',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
        gradient: 'from-[#1540AD] to-[#0F359E]',
        cta: 'Pedir orçamento agora',
        action: () => onNavigate('explore'),
        isSponsored: false
      },
      {
        id: 'freguesia_connect',
        badge: 'NETWORKING',
        icon: <Handshake className="w-3 h-3" />,
        title: 'Seu negócio conectado\ncresce mais',
        subtitle: 'Networking, parcerias e visibilidade entre empreendedores da Freguesia',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop',
        gradient: 'from-[#4F46E5] via-[#4338CA] to-[#4F46E5]',
        cta: 'Entrar no Freguesia Connect',
        action: () => onNavigate('freguesia_connect_public'),
        isSponsored: false
      }
    ];

    // Lógica de Ads Premium: Filtra lojas reais que pagam pelo Ads Premium
    const premiumAds = stores
      .filter(s => s.adType === AdType.PREMIUM || s.isSponsored)
      .sort(() => Math.random() - 0.5) // Aleatoriedade para rotatividade justa
      .slice(0, 3) // Limita a 3 anúncios para não sobrecarregar o carrossel
      .map(store => ({
        id: `ad-${store.id}`,
        badge: 'PATROCINADO',
        icon: <Zap className="w-3 h-3" />,
        title: store.name,
        subtitle: store.description,
        image: store.logoUrl || store.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
        gradient: 'from-[#0F172A] to-[#1E293B]', // Estilo premium escuro
        cta: 'Ver mais',
        action: () => onStoreClick?.(store),
        isSponsored: true
      }));

    // Insere os anúncios reais após os banners fixos de conversão
    return [...fixedBanners.slice(0, 2), ...premiumAds, ...fixedBanners.slice(2)];
  }, [onNavigate, stores, onStoreClick]);

  useEffect(() => {
    const startAutoplay = () => {
      autoplayTimerRef.current = setInterval(() => {
        if (carouselRef.current) {
          const nextIndex = (activeBannerIndex + 1) % banners.length;
          const scrollAmount = carouselRef.current.offsetWidth * nextIndex;
          carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
          setActiveBannerIndex(nextIndex);
        }
      }, 6000);
    };

    startAutoplay();
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [activeBannerIndex, banners.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== activeBannerIndex) {
        setActiveBannerIndex(newIndex);
      }
    }
  };

  const contextConfig = useMemo(() => {
    const commonOrder = ['hero', 'highlights', 'tags', 'wallet', 'roulette_banner', 'filters', 'list', 'editorial', 'bonus'];
    switch (timeContext) {
      case 'morning':
        return {
          tags: [{ id: 1, label: 'Padaria', icon: '🥐' }, { id: 2, label: 'Café', icon: '☕' }, { id: 3, label: 'Hortifruti', icon: '🍎' }, { id: 4, label: 'Academia', icon: '💪' }],
          highlights: [{ id: 1, title: 'Pão Quentinho', desc: 'Padaria Imperial • 8%', icon: <Coffee />, bg: 'bg-amber-50', borderColor: 'border-amber-100' }, { id: 2, title: 'Energia', desc: 'Fit Studio Bombando', icon: <Zap />, bg: 'bg-blue-50', borderColor: 'border-blue-100' }],
          sectionOrder: commonOrder
        };
      case 'afternoon':
        return {
          tags: [{ id: 1, label: 'Almoço', icon: '🍽️' }, { id: 2, label: 'Moda', icon: '👕' }, { id: 3, label: 'Serviços', icon: '🛠️' }, { id: 4, label: 'Saúde', icon: '🏥' }],
          highlights: [{ id: 1, title: 'Prato do Dia', desc: 'Restaurante Sabor • 10%', icon: <Utensils />, bg: 'bg-orange-50', borderColor: 'border-orange-100' }, { id: 2, title: 'Promoção', desc: 'Moda RJ: 20% OFF', icon: <ShoppingBag />, bg: 'bg-purple-50', borderColor: 'border-purple-100' }],
          sectionOrder: ['hero', 'tags', 'highlights', 'wallet', 'roulette_banner', 'filters', 'list', 'editorial', 'bonus']
        };
      default:
        return {
          tags: [{ id: 1, label: 'Sushi', icon: '🍣' }, { id: 2, label: 'Pizza', icon: '🍕' }, { id: 3, label: 'Burger', icon: '🍔' }, { id: 4, label: 'Açaí', icon: '🍧' }],
          highlights: [{ id: 1, title: 'Delivery Grátis', desc: 'Pizza Place • 12% back', icon: <Moon />, bg: 'bg-indigo-50', borderColor: 'border-indigo-100' }, { id: 2, title: 'Happy Hour', desc: 'Chopp em dobro no Zé', icon: <Flame />, bg: 'bg-red-100', borderColor: 'border-red-100' }],
          sectionOrder: ['hero', 'highlights', 'roulette_banner', 'editorial', 'wallet', 'tags', 'filters', 'list', 'bonus']
        };
    }
  }, [timeContext]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="relative bg-white pt-4 pb-0 overflow-hidden">
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-0 scroll-smooth"
            >
              {banners.map((banner, index) => {
                const isActive = activeBannerIndex === index;
                return (
                  <div key={banner.id} className="min-w-full snap-center px-4 pb-6">
                    <div className={`w-full bg-gradient-to-br ${banner.gradient} rounded-3xl overflow-hidden shadow-lg border border-white/10 h-[180px] relative flex`}>
                      <div className="flex-1 p-6 flex flex-col justify-center relative z-10">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${banner.isSponsored ? 'text-blue-300 bg-white/5' : 'text-white/80 bg-white/10'}`}>
                            {banner.badge}
                          </span>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1 leading-tight whitespace-pre-line truncate max-w-full">
                          {banner.title}
                        </h1>
                        <p className="text-white/70 text-[10px] font-medium mb-4 leading-tight line-clamp-2 max-w-[180px]">
                          {banner.subtitle}
                        </p>
                        <button 
                          onClick={banner.action} 
                          className={`w-fit bg-white text-gray-900 text-[11px] font-bold px-4 py-2 rounded-full active:scale-95 transition-transform flex items-center gap-2 
                            ${banner.id === 'cashback_promo' ? 'animate-pulse-soft shadow-lg' : ''} 
                            ${banner.id === 'whatsapp_services' ? 'animate-bounce-x shadow-md' : ''}
                            ${banner.id === 'freguesia_connect' && isActive ? 'animate-premium-in shadow-lg' : ''}
                            ${banner.isSponsored && isActive ? 'animate-glow-slow shadow-blue-500/20' : ''}`}
                        >
                          {banner.cta} <ArrowRight className={`w-3 h-3 ${banner.id === 'whatsapp_services' ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                      <div className="w-[120px] h-full relative">
                        <img src={banner.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-inherit via-transparent to-transparent"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5 mt-[-10px] mb-4">
              {banners.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${activeBannerIndex === i ? 'w-4 bg-[#1E5BFF]' : 'w-1 bg-gray-200'}`} />
              ))}
            </div>
          </div>
        );
      case 'roulette_banner':
        return (
          <div key="roulette_banner" className="px-5">
            <button 
              onClick={() => setIsSpinWheelOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Dices className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg leading-none mb-1">Roleta da Sorte</h3>
                  <p className="text-xs text-purple-100">Tente a sorte e ganhe prêmios!</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      case 'highlights':
        return (
          <div key="highlights" className="space-y-4 pt-2 pb-2">
            <div className="px-5 flex items-end justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                Hoje no seu bairro
              </h3>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 snap-x">
              {contextConfig.highlights.map((item: any) => (
                <div 
                  key={item.id} 
                  className="snap-center flex-shrink-0 w-[190px] bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4 active:scale-95 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-0.5 rounded-lg ${item.bg} bg-opacity-70 border border-transparent`}>
                      <span className={`text-[9px] font-black uppercase tracking-tight ${item.borderColor.replace('border-', 'text-')}`}>
                        {item.title}
                      </span>
                    </div>
                    <div className="opacity-40 text-gray-400 group-hover:text-primary-500 transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  <p className="text-[14px] font-bold text-gray-800 dark:text-gray-100 leading-tight">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tags':
        return (
          <div key="tags" className="space-y-3">
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5">
                  {contextConfig.tags.map((tag: any) => (
                      <button key={tag.id} className="flex-shrink-0 flex items-center gap-2.5 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95 transition-all">
                          <span className="text-base">{tag.icon}</span>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{tag.label}</span>
                      </button>
                  ))}
              </div>
          </div>
        );
      case 'wallet':
        return (
          <div key="wallet" className="px-5 w-full">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer" onClick={() => onNavigate('user_cashback_flow')}>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]"><Wallet className="w-5 h-5" /></div>
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Meu Saldo</p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">R$ 12,50</p>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1E5BFF] w-[25%] rounded-full"></div>
                  </div>
              </div>
          </div>
        );
      case 'filters':
        return (
          <div key="filters" className="px-5 w-full -mb-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: 'all', label: 'Tudo', icon: Zap },
                    { id: 'cashback', label: 'Cashback', icon: TrendingUp },
                    { id: 'top_rated', label: 'Melhores', icon: Star },
                    { id: 'open_now', label: 'Abertos', icon: Clock }
                  ].map((btn) => (
                    <button key={btn.id} onClick={() => setListFilter(btn.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-bold transition-all active:scale-95 shadow-sm whitespace-nowrap ${listFilter === btn.id ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700'}`}>
                        {btn.label}
                    </button>
                  ))}
              </div>
          </div>
        );
      case 'list':
        return (
          <div key="list" className="px-5 pb-2 min-h-[300px] w-full">
              <div className="flex items-center gap-2 mb-4">
                 <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parceiros Verificados</span>
              </div>
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} />
          </div>
        );
      case 'editorial':
        const themes = [
          { id: 'coffee', title: 'Pausa para o Café', subtitle: 'Favoritos do bairro', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop', keywords: ['café', 'padaria'], badge: 'Popular' },
          { id: 'health', title: 'Viver Bem', subtitle: 'Saúde & Foco', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', keywords: ['academia', 'clinica'], badge: 'Destaque' },
        ];
        return (
          <div key="editorial" className="space-y-4 w-full">
              <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x px-5">
                  {themes.map((theme) => (
                      <div key={theme.id} className="snap-center min-w-[270px] w-[270px] h-[160px] rounded-3xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all shadow-md group" onClick={() => onSelectCollection(theme as any)}>
                          <img src={theme.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={theme.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-5 left-6 right-6">
                              <h4 className="text-white font-bold text-lg leading-tight mb-1">{theme.title}</h4>
                              <p className="text-blue-200 text-[10px] font-bold opacity-80 uppercase tracking-widest">{theme.subtitle}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        );
      case 'bonus':
        return (
          <div key="bonus" className="px-5 mt-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Award className="w-4 h-4 text-[#1E5BFF]" />
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Clube Localizei</h3>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                  <button onClick={() => setIsSpinWheelOpen(true)} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600"><Dices className="w-5 h-5" /></div>
                      <div className="text-center">
                          <p className="text-xs font-bold text-gray-800 dark:text-white">Roleta</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Tente a Sorte</p>
                      </div>
                  </button>
                  <button onClick={() => onNavigate('invite_friend')} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform">
                      <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600"><Users className="w-5 h-5" /></div>
                      <div className="text-center">
                          <p className="text-xs font-bold text-gray-800 dark:text-white">Indicar</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Ganhe R$ 5,00</p>
                      </div>
                  </button>
              </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32 bg-gray-50 dark:bg-gray-900 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      {activeSearchTerm ? (
        <div className="px-5 mt-4 min-h-[50vh]">
             <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Resultados para "{activeSearchTerm}"</h3>
             </div>
             <div className="flex flex-col gap-3">
                {stores.filter(s => s.name.toLowerCase().includes(activeSearchTerm.toLowerCase())).map((store) => (
                <div key={store.id} onClick={() => onStoreClick && onStoreClick(store)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer active:scale-[0.98] transition-all">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50"><img src={store.logoUrl} className="w-full h-full object-contain" alt={store.name} /></div>
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
        <div className="flex flex-col gap-8 w-full mt-0">
            {contextConfig.sectionOrder.map((sectionKey: string) => renderSection(sectionKey))}
            <div className="mt-12 mb-4 flex flex-col items-center justify-center text-center opacity-40">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.5em]">Freguesia • Localizei v1.0.9</p>
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
