
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
  EyeOff
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';

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
    }, 6000);
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
    switch (timeContext) {
      case 'morning':
        return {
          tags: [{ id: 1, label: 'Padaria', icon: '🥐' }, { id: 2, label: 'Café', icon: '☕' }, { id: 3, label: 'Hortifruti', icon: '🍎' }, { id: 4, label: 'Academia', icon: '💪' }],
          highlights: [
            { id: 1, title: 'Pão Quentinho', desc: 'Padaria Imperial • 8%', icon: <Coffee className="text-amber-900 w-6 h-6" />, bg: 'bg-[#FFD700] dark:bg-amber-600' },
            { id: 2, title: 'Energia', desc: 'Fit Studio Bombando', icon: <Zap className="text-white w-6 h-6" />, bg: 'bg-[#007FFF] dark:bg-blue-600' }
          ],
        };
      case 'afternoon':
        return {
          tags: [{ id: 1, label: 'Almoço', icon: '🍽️' }, { id: 2, label: 'Moda', icon: '👕' }, { id: 3, label: 'Serviços', icon: '🛠️' }, { id: 4, label: 'Saúde', icon: '🏥' }],
          highlights: [
            { id: 1, title: 'Prato do Dia', desc: 'Restaurante Sabor • 10%', icon: <Utensils className="text-orange-900 w-6 h-6" />, bg: 'bg-orange-400 dark:bg-orange-600' },
            { id: 2, title: 'Promoção', desc: 'Moda RJ: 20% OFF', icon: <ShoppingBag className="text-white w-6 h-6" />, bg: 'bg-pink-400 dark:bg-pink-600' }
          ],
        };
      default:
        return {
          tags: [{ id: 1, label: 'Sushi', icon: '🍣' }, { id: 2, label: 'Pizza', icon: '🍕' }, { id: 3, label: 'Burger', icon: '🍔' }, { id: 4, label: 'Açaí', icon: '🍧' }],
          highlights: [
            { id: 1, title: 'Delivery Grátis', desc: 'Pizza Place • 12% back', icon: <Moon className="text-indigo-900 w-6 h-6" />, bg: 'bg-indigo-400 dark:bg-indigo-600' },
            { id: 2, title: 'Happy Hour', desc: 'Chopp em dobro no Zé', icon: <Flame className="text-white w-6 h-6" />, bg: 'bg-red-50 dark:bg-red-600' }
          ],
        };
    }
  }, [timeContext]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="relative pt-4 pb-0 bg-white dark:bg-gray-900">
            <div ref={carouselRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-0 scroll-smooth">
              {banners.map((banner, index) => {
                const isActive = activeBannerIndex === index;
                return (
                  <div key={banner.id} className="min-w-full snap-center px-4">
                    <div className={`w-full bg-gradient-to-br ${banner.gradient} rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative h-[190px] flex items-center transition-all duration-500 border border-white/10`}>
                      
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-1000">
                         {banner.image ? (
                           <div className="w-[140px] h-[140px] rounded-[2.5rem] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.25)] rotate-3 animate-float bg-white p-1">
                              <img src={banner.image} alt="" className="w-full h-full object-contain rounded-[2.3rem]" />
                           </div>
                         ) : (
                           <div className="mr-8 scale-[2.8] rotate-[-10deg] animate-float opacity-30">
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
      case 'wallet':
        return (
          <div key="wallet" className="px-5 py-4">
              <div 
                className="premium-glass rounded-[28px] p-8 flex flex-col gap-5 active:scale-[0.99] transition-all cursor-pointer relative overflow-hidden group animate-balance-load border border-white/20" 
                onClick={() => onNavigate('user_cashback_flow')}
              >
                  {/* Premium Background Elements */}
                  <div className="absolute top-0 right-0 w-56 h-56 bg-white/15 rounded-full blur-[70px] -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-[60px] -ml-16 -mb-16 opacity-60"></div>
                  
                  {/* Top Bar: Labels + Controls */}
                  <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-blue-100/60 uppercase tracking-[0.3em] mb-0.5">Meu Saldo</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-[9px] text-blue-100/50 font-bold tracking-widest uppercase">Carteira Segura</span>
                            </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }}
                          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                          aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
                        >
                          {showBalance ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
                        </button>
                        <div className="p-3 rounded-full bg-white text-[#1E5BFF] shadow-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                          <ArrowUpRight className="w-4.5 h-4.5" strokeWidth={3.5} />
                        </div>
                      </div>
                  </div>

                  {/* Main Value: Scaled to maximum prominence */}
                  <div className="relative z-10 flex flex-col items-start min-h-[90px]">
                      <div className="flex items-baseline gap-3 transition-all duration-500 group-hover:translate-x-1">
                        {showBalance ? (
                          <div className="flex items-baseline gap-3 animate-balance-load">
                            <span className="text-white text-3xl font-bold opacity-60 mb-2">R$</span>
                            <span className="text-[80px] font-black text-white tracking-tighter leading-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] text-shimmer">12,50</span>
                          </div>
                        ) : (
                          <div className="py-7 animate-balance-load">
                            <span className="text-6xl font-black text-white/25 tracking-[0.5em] leading-none select-none">•••••</span>
                          </div>
                        )}
                      </div>
                  </div>

                  {/* Footer Stats & Progress */}
                  <div className="relative z-10 mt-2 space-y-4">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/5 w-fit animate-in slide-in-from-left duration-700">
                        <div className="w-4.5 h-4.5 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                            <Coins className="w-2.5 h-2.5 text-blue-900 fill-blue-900" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.15em]">+ R$ 2,50 acumulados hoje</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[11px] font-bold text-blue-100/70 flex items-center gap-2">
                                Próximo Resgate em Parceiros
                                <TrendingUp className="w-3 h-3 text-green-400" />
                            </span>
                            <span className="text-[10px] font-black text-white bg-white/20 px-2.5 py-1 rounded-lg border border-white/10">25%</span>
                        </div>
                        <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/5 p-[1px] relative">
                            <div className="h-full bg-gradient-to-r from-blue-300 via-white to-blue-200 w-[25%] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
        );
      case 'master_sponsor':
        return (
          <div key="master_sponsor" className="px-5">
            <MasterSponsorBanner 
                onClick={() => onNavigate('patrocinador_master')}
            />
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
                <div key={item.id} className={`snap-center flex-shrink-0 w-[190px] ${item.bg} p-5 rounded-[24px] flex flex-col gap-4 active:scale-95 transition-all cursor-pointer group shadow-sm hover:shadow-md`}>
                  <div className="flex items-center justify-between">
                    <div className="px-2.5 py-1 rounded-lg bg-white/30 dark:bg-black/20 border border-white/20">
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
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-[0_8px_25px_rgba(147,51,234,0.2)] active:scale-[0.98] transition-all relative overflow-hidden group border border-white/10">
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
                      <button key={tag.id} className="flex-shrink-0 flex items-center gap-2.5 bg-[#F0F5FF] dark:bg-slate-800 px-4 py-3 rounded-full shadow-none border border-transparent active:scale-95 transition-all hover:bg-blue-100 dark:hover:bg-slate-700">
                          <span className="text-base grayscale-0">{tag.icon}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{tag.label}</span>
                      </button>
                  ))}
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
                      <div key={theme.id} className="snap-center min-w-[270px] w-[270px] h-[160px] rounded-3xl overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)] group border border-white/10" onClick={() => onSelectCollection(theme as any)}>
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
                  <button onClick={() => setIsSpinWheelOpen(true)} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 active:scale-95 transition-transform hover:shadow-md">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600"><Dices className="w-5 h-5" /></div>
                      <div className="text-center">
                          <p className="text-xs font-bold text-gray-800 dark:text-white">Roleta</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Tente a Sorte</p>
                      </div>
                  </button>
                  <button onClick={() => onNavigate('invite_friend')} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 active:scale-95 transition-transform hover:shadow-md">
                      <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600"><Users className="w-5 h-5" /></div>
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
        <div className="flex flex-col gap-4 w-full mt-0">
            {renderSection('hero')}
            {renderSection('wallet')}
            {renderSection('roulette_banner')}
            {renderSection('highlights')}
            {renderSection('tags')}
            {renderSection('master_sponsor')}
            {renderSection('filters')}
            {renderSection('list')}
            {renderSection('editorial')}
            {renderSection('bonus')}

            <div className="mt-12 mb-4 flex flex-col items-center justify-center text-center opacity-40">
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
