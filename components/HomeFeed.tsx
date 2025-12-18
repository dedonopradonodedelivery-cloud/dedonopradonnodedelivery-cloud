
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
  Tag,
  BadgePercent
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
  badge: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
  cta: string;
  action: () => void;
  isSponsored?: boolean;
  gradient: string;
  glowClass: string;
  ctaClass: string;
  iconAnimation?: string;
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
    const list: BannerItem[] = [
      {
        id: 'cashback_promo',
        badge: 'CASHBACK',
        icon: <BadgePercent className="w-24 h-24 text-white/20" />,
        title: 'Ganha dinheiro\ncomprando na Freguesia',
        subtitle: 'Cashback real nas lojas do seu bairro',
        gradient: 'from-emerald-500 to-emerald-600',
        glowClass: 'shadow-emerald-500/30',
        cta: 'Ativar agora',
        action: () => onNavigate('cashback_info'),
        ctaClass: 'animate-pulse-soft animate-glow-pulse shadow-[0_0_15px_rgba(255,255,255,0.4)]'
      },
      {
        id: 'whatsapp_services',
        badge: 'SERVIÇOS',
        icon: <MessageCircle className="w-24 h-24 text-white/20" />,
        title: 'Orçamentos rápidos\npelo WhatsApp',
        subtitle: 'Encontre serviços locais e resolva em minutos',
        gradient: 'from-blue-500 to-blue-600',
        glowClass: 'shadow-blue-500/30',
        cta: 'Pedir cotação',
        action: () => onNavigate('explore'),
        ctaClass: '',
        iconAnimation: 'animate-bounce-x-small'
      },
      {
        id: 'freguesia_connect',
        badge: 'BUSINESS',
        icon: <Handshake className="w-24 h-24 text-white/20" />,
        title: 'Seu negócio conectado\nà Freguesia',
        subtitle: 'Networking, parcerias e novas oportunidades',
        gradient: 'from-indigo-600 to-violet-700',
        glowClass: 'shadow-indigo-500/30',
        cta: 'Entrar agora',
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
        glowClass: 'shadow-slate-500/30',
        cta: 'Visitar loja',
        action: () => onStoreClick?.(randomStore),
        isSponsored: true,
        ctaClass: 'animate-soft-pulse'
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
    }, 5000);
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

  const contextConfig = useMemo(() => {
    const commonOrder = ['hero', 'highlights', 'tags', 'wallet', 'roulette_banner', 'filters', 'list', 'editorial', 'bonus'];
    switch (timeContext) {
      case 'morning':
        return {
          tags: [{ id: 1, label: 'Padaria', icon: '🥐' }, { id: 2, label: 'Café', icon: '☕' }, { id: 3, label: 'Hortifruti', icon: '🍎' }, { id: 4, label: 'Academia', icon: '💪' }],
          highlights: [
            { id: 1, title: 'Pão Quentinho', desc: 'Padaria Imperial • 8%', icon: <Coffee className="text-amber-900 w-6 h-6" />, bg: 'bg-[#FFD700] dark:bg-amber-600' },
            { id: 2, title: 'Energia', desc: 'Fit Studio Bombando', icon: <Zap className="text-white w-6 h-6" />, bg: 'bg-[#007FFF] dark:bg-blue-600' }
          ],
          sectionOrder: commonOrder
        };
      case 'afternoon':
        return {
          tags: [{ id: 1, label: 'Almoço', icon: '🍽️' }, { id: 2, label: 'Moda', icon: '👕' }, { id: 3, label: 'Serviços', icon: '🛠️' }, { id: 4, label: 'Saúde', icon: '🏥' }],
          highlights: [
            { id: 1, title: 'Prato do Dia', desc: 'Restaurante Sabor • 10%', icon: <Utensils className="text-orange-900 w-6 h-6" />, bg: 'bg-orange-400 dark:bg-orange-600' },
            { id: 2, title: 'Promoção', desc: 'Moda RJ: 20% OFF', icon: <ShoppingBag className="text-white w-6 h-6" />, bg: 'bg-pink-400 dark:bg-pink-600' }
          ],
          sectionOrder: ['hero', 'tags', 'highlights', 'wallet', 'roulette_banner', 'filters', 'list', 'editorial', 'bonus']
        };
      default:
        return {
          tags: [{ id: 1, label: 'Sushi', icon: '🍣' }, { id: 2, label: 'Pizza', icon: '🍕' }, { id: 3, label: 'Burger', icon: '🍔' }, { id: 4, label: 'Açaí', icon: '🍧' }],
          highlights: [
            { id: 1, title: 'Delivery Grátis', desc: 'Pizza Place • 12% back', icon: <Moon className="text-indigo-900 w-6 h-6" />, bg: 'bg-indigo-400 dark:bg-indigo-600' },
            { id: 2, title: 'Happy Hour', desc: 'Chopp em dobro no Zé', icon: <Flame className="text-white w-6 h-6" />, bg: 'bg-red-500 dark:bg-red-600' }
          ],
          sectionOrder: ['hero', 'highlights', 'roulette_banner', 'editorial', 'wallet', 'tags', 'filters', 'list', 'bonus']
        };
    }
  }, [timeContext]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="relative pt-4 pb-2 bg-white dark:bg-gray-900">
            <div ref={carouselRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-0 scroll-smooth">
              {banners.map((banner, index) => {
                const isActive = activeBannerIndex === index;
                return (
                  <div key={banner.id} className="min-w-full snap-center px-4">
                    <div className={`w-full bg-gradient-to-br ${banner.gradient} rounded-[28px] overflow-hidden shadow-xl ${banner.glowClass} relative h-[160px] flex items-center transition-all duration-500`}>
                      
                      <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-30 pointer-events-none transition-all duration-1000">
                         {banner.image ? (
                           <div className="w-[140px] h-[140px] rounded-3xl overflow-hidden shadow-2xl mr-6 rotate-6 animate-float-slow">
                              <img src={banner.image} alt="" className="w-full h-full object-cover" />
                           </div>
                         ) : (
                           <div className="mr-10 scale-[2.2] rotate-[-12deg] animate-float-slow">
                             {banner.icon}
                           </div>
                         )}
                      </div>

                      <div className="relative z-10 px-6 py-6 flex flex-col justify-center h-full w-full max-w-[75%]">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${banner.isSponsored ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' : 'bg-white/15 text-white/90'}`}>
                            {banner.badge}
                          </span>
                        </div>
                        <h1 className="text-lg font-bold text-white mb-1 leading-tight whitespace-pre-line tracking-tight drop-shadow-md">
                          {banner.title}
                        </h1>
                        <p className="text-white/80 text-[10px] font-medium mb-3 leading-tight line-clamp-1">
                          {banner.subtitle}
                        </p>
                        <button onClick={banner.action} className={`w-fit bg-white text-gray-900 text-[11px] font-bold px-5 py-2.5 rounded-full active:scale-95 transition-all flex items-center gap-2 shadow-xl ${isActive ? banner.ctaClass : ''}`}>
                          {banner.cta} <ArrowRight className={`w-3.5 h-3.5 ${isActive && banner.iconAnimation ? banner.iconAnimation : ''}`} />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                        {banners.map((_, i) => (
                          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${activeBannerIndex === i ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/40'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'filters':
        return (
          <div key="filters" className="px-5 py-2">
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
          <div key="highlights" className="space-y-4 py-2">
            <div className="px-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Hoje no seu bairro</h3>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 snap-x">
              {contextConfig.highlights.map((item: any) => (
                <div key={item.id} className={`snap-center flex-shrink-0 w-[190px] ${item.bg} p-5 rounded-[24px] flex flex-col gap-4 active:scale-95 transition-all cursor-pointer group shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <div className="px-2.5 py-1 rounded-lg bg-white/30 dark:bg-black/20">
                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-800 dark:text-white/90">{item.title}</span>
                    </div>
                    <div className="opacity-100 transition-transform group-hover:scale-110 duration-300 drop-shadow-sm">{item.icon}</div>
                  </div>
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'roulette_banner':
        return (
          <div key="roulette_banner" className="px-5">
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-[0_8px_20px_rgba(147,51,234,0.15)] active:scale-[0.98] transition-all relative overflow-hidden group">
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
      case 'tags':
        return (
          <div key="tags" className="py-2">
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5">
                  {contextConfig.tags.map((tag: any) => (
                      <button key={tag.id} className="flex-shrink-0 flex items-center gap-2.5 bg-[#F0F5FF] dark:bg-slate-800 px-4 py-3 rounded-full shadow-none border border-transparent active:scale-95 transition-all">
                          <span className="text-base grayscale-0">{tag.icon}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{tag.label}</span>
                      </button>
                  ))}
              </div>
          </div>
        );
      case 'wallet':
        return (
          <div key="wallet" className="px-5 py-2">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer" onClick={() => onNavigate('user_cashback_flow')}>
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
      case 'list':
        return (
          <div key="list" className="px-5 py-2 min-h-[300px]">
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
          <div key="editorial" className="space-y-4 py-4">
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x px-5">
                  {themes.map((theme) => (
                      <div key={theme.id} className="snap-center min-w-[270px] w-[270px] h-[160px] rounded-2xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)] group" onClick={() => onSelectCollection(theme as any)}>
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
          <div key="bonus" className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Award className="w-4 h-4 text-[#1E5BFF]" />
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Clube Localizei</h3>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                  <button onClick={() => setIsSpinWheelOpen(true)} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 active:scale-95 transition-transform">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600"><Dices className="w-5 h-5" /></div>
                      <div className="text-center">
                          <p className="text-xs font-bold text-gray-800 dark:text-white">Roleta</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Tente a Sorte</p>
                      </div>
                  </button>
                  <button onClick={() => onNavigate('invite_friend')} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 active:scale-95 transition-transform">
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
    <div className="flex flex-col gap-4 pb-32 bg-white dark:bg-gray-900 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
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
        <div className="flex flex-col gap-4 w-full mt-0">
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
