
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
  Timer,
  Coffee,
  ShoppingBag,
  Moon,
  Sun,
  Utensils,
  Award,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink,
  Info,
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
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
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');

  const timeContext = useMemo((): TimeContext => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
  }, []);

  const banners = useMemo((): BannerItem[] => {
    return [
      {
        id: 'institutional',
        badge: 'O Bairro Conectado',
        icon: <Info className="w-3 h-3" />,
        title: 'O que é o Localizei Freguesia',
        subtitle: 'Conecta moradores ao comércio local, fortalece o bairro e gera economia real.',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop',
        cta: 'Entender como funciona',
        action: () => onNavigate('about'),
        isSponsored: false
      },
      {
        id: 'cashback_promo',
        badge: 'Economia Real',
        icon: <Wallet className="w-3 h-3" />,
        title: 'Cashback no comércio do bairro',
        subtitle: 'Compre perto de casa e ganhe dinheiro de volta.',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
        cta: 'Ativar cashback',
        action: () => onNavigate('cashback_info'),
        isSponsored: false
      },
      {
        id: 'whatsapp_services',
        badge: 'Praticidade',
        icon: <MessageCircle className="w-3 h-3" />,
        title: 'Orçamentos rápidos pelo WhatsApp',
        subtitle: 'Peça cotações de serviços locais direto no WhatsApp, sem complicação.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
        cta: 'Solicitar orçamento',
        action: () => onNavigate('explore'), // Direciona para explorar serviços
        isSponsored: false
      },
      {
        id: 'freguesia_connect',
        badge: 'Networking',
        icon: <Users className="w-3 h-3" />,
        title: 'Freguesia Connect',
        subtitle: 'Um grupo de networking para empresas que querem crescer juntas no bairro.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop',
        cta: 'Conhecer o grupo',
        action: () => onNavigate('freguesia_connect_public'),
        isSponsored: false
      },
      {
        id: 'sponsored_ads',
        badge: 'Destaque',
        icon: <Zap className="w-3 h-3" />,
        title: 'Espaço Patrocinado',
        subtitle: 'Banner reservado para lojistas com Ads Premium.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
        cta: 'Saiba mais',
        action: () => onNavigate('patrocinador_master'),
        isSponsored: true
      }
    ];
  }, [onNavigate]);

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
    switch (timeContext) {
      case 'morning':
        return {
          tags: [{ id: 1, label: 'Padaria', icon: '🥐' }, { id: 2, label: 'Café', icon: '☕' }, { id: 3, label: 'Hortifruti', icon: '🍎' }, { id: 4, label: 'Academia', icon: '💪' }],
          highlights: [{ id: 1, title: 'Pão Quentinho', desc: 'Padaria Imperial • 8%', icon: <Coffee className="w-4 h-4 text-amber-500" />, bg: 'bg-amber-50', borderColor: 'border-amber-100' }, { id: 2, title: 'Energia', desc: 'Fit Studio Bombando', icon: <Zap className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50', borderColor: 'border-blue-100' }],
          sectionOrder: ['hero', 'highlights', 'tags', 'wallet', 'filters', 'list', 'editorial', 'bonus']
        };
      case 'afternoon':
        return {
          tags: [{ id: 1, label: 'Almoço', icon: '🍽️' }, { id: 2, label: 'Moda', icon: '👕' }, { id: 3, label: 'Serviços', icon: '🛠️' }, { id: 4, label: 'Saúde', icon: '🏥' }],
          highlights: [{ id: 1, title: 'Prato do Dia', desc: 'Restaurante Sabor • 10%', icon: <Utensils className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50', borderColor: 'border-orange-100' }, { id: 2, title: 'Promoção', desc: 'Moda RJ: 20% OFF', icon: <ShoppingBag className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-50', borderColor: 'border-purple-100' }],
          sectionOrder: ['hero', 'tags', 'highlights', 'wallet', 'filters', 'list', 'editorial', 'bonus']
        };
      default:
        return {
          tags: [{ id: 1, label: 'Sushi', icon: '🍣' }, { id: 2, label: 'Pizza', icon: '🍕' }, { id: 3, label: 'Burger', icon: '🍔' }, { id: 4, label: 'Açaí', icon: '🍧' }],
          highlights: [{ id: 1, title: 'Delivery Grátis', desc: 'Pizza Place • 12% back', icon: <Moon className="w-4 h-4 text-indigo-500" />, bg: 'bg-indigo-50', borderColor: 'border-indigo-100' }, { id: 2, title: 'Happy Hour', desc: 'Chopp em dobro no Zé', icon: <Flame className="w-4 h-4 text-red-500" />, bg: 'bg-red-100', borderColor: 'border-red-100' }],
          sectionOrder: ['hero', 'highlights', 'editorial', 'wallet', 'tags', 'filters', 'list', 'bonus']
        };
    }
  }, [timeContext]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <div key="hero" className="relative group overflow-hidden">
            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-0 scroll-smooth"
            >
              {banners.map((banner) => (
                <div key={banner.id} className="min-w-full snap-center px-4">
                  <div className="w-full bg-primary-600 rounded-[28px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex h-[190px] relative border border-white/10">
                    
                    {/* Conteúdo Esquerdo */}
                    <div className="flex-1 p-6 pr-0 text-white flex flex-col justify-center relative z-20 animate-banner-text-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1.5 opacity-90">
                          {banner.icon}
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{banner.badge}</span>
                        </div>
                        
                        {banner.isSponsored && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-white/40"></span>
                            <span className="text-[7px] font-black uppercase tracking-[0.2em] bg-white/20 px-1.5 py-0.5 rounded-md border border-white/10">
                               Patrocinado
                            </span>
                          </div>
                        )}
                      </div>

                      <h1 className="text-[19px] font-black mb-1 leading-[1.2] tracking-tight whitespace-pre-line drop-shadow-md">
                        {banner.title}
                      </h1>
                      
                      <p className="text-white/80 text-[11px] font-medium mb-4 opacity-95 leading-tight line-clamp-2 pr-4">
                        {banner.subtitle}
                      </p>

                      <button 
                        onClick={banner.action} 
                        className="w-fit bg-white text-primary-600 text-[11px] font-black px-4 py-2 rounded-xl active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-black/10"
                      >
                        {banner.cta}
                        <ArrowRight className="w-3 h-3" strokeWidth={3} />
                      </button>
                    </div>

                    {/* Metade Direita */}
                    <div className="w-[42%] relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 via-primary-600/40 to-transparent z-10 w-16"></div>
                      <img 
                        src={banner.image} 
                        alt={banner.title} 
                        className="w-full h-full object-cover animate-banner-img-parallax brightness-[0.95]"
                      />
                      <div className="absolute inset-0 bg-primary-900/10 pointer-events-none z-0"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores Compactos */}
            <div className="flex justify-center gap-1.5 mt-4">
              {banners.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeBannerIndex === i 
                    ? 'w-6 bg-primary-500' 
                    : 'w-1.5 bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      case 'highlights':
        return (
          <div key="highlights" className="space-y-3.5 animate-in slide-in-from-bottom-2 duration-500">
            <div className="px-5 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Hoje no seu bairro</h3>
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                <div className="w-1 h-1 rounded-full bg-[#1E5BFF] animate-pulse"></div>
                <span className="text-[9px] font-bold text-[#1E5BFF] uppercase">Live</span>
              </div>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 snap-x">
              {contextConfig.highlights.map((item: any) => (
                <div key={item.id} className={`snap-center flex-shrink-0 w-[190px] p-4.5 rounded-2xl border ${item.borderColor} ${item.bg} flex flex-col gap-2.5 shadow-sm active:scale-95 transition-all cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{item.title}</span>
                    {item.icon}
                  </div>
                  <p className="text-[13px] font-black text-gray-800 dark:text-white leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tags':
        return (
          <div key="tags" className="space-y-3">
              <div className="px-5"><h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Mais buscados</h3></div>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5">
                  {contextConfig.tags.map((tag: any) => (
                      <button key={tag.id} className="flex-shrink-0 flex items-center gap-2.5 bg-white dark:bg-gray-800 px-5 py-3 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95 transition-all">
                          <span className="text-base">{tag.icon}</span>
                          <span className="text-xs font-black text-gray-700 dark:text-gray-300">{tag.label}</span>
                      </button>
                  ))}
              </div>
          </div>
        );
      case 'wallet':
        return (
          <div key="wallet" className="px-5 w-full">
              <div className="bg-white dark:bg-gray-800 rounded-[28px] p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer" onClick={() => onNavigate('user_cashback_flow')}>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1E5BFF]"><Wallet className="w-5 h-5" /></div>
                          <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Meu Saldo</p>
                              <p className="text-xl font-black text-gray-900 dark:text-white leading-none">R$ 12,50</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Resgate em</p>
                          <p className="text-xs font-black text-gray-700 dark:text-gray-300">R$ 50,00</p>
                      </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1E5BFF] w-[25%] rounded-full shadow-[0_0_10px_rgba(30,91,255,0.3)]"></div>
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
                    <button key={btn.id} onClick={() => setListFilter(btn.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-[11px] font-black transition-all active:scale-95 shadow-sm whitespace-nowrap ${listFilter === btn.id ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700'}`}>
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
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parceiros Verificados</span>
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
              <div className="px-5 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Descubra o bairro</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x px-5">
                  {themes.map((theme) => (
                      <div key={theme.id} className="snap-center min-w-[270px] w-[270px] h-[170px] rounded-[32px] overflow-hidden relative cursor-pointer active:scale-[0.98] transition-all shadow-xl group" onClick={() => onSelectCollection(theme as any)}>
                          <img src={theme.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={theme.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-5 left-6 right-6">
                              <h4 className="text-white font-black text-lg leading-tight mb-1">{theme.title}</h4>
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
              <button onClick={() => onNavigate('user_cashback_flow')} className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-5 flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl w-11 h-11 flex items-center justify-center text-orange-500"><Flame className="w-6 h-6 fill-current" /></div>
                      <div className="text-left">
                          <p className="text-sm font-black text-gray-800 dark:text-white leading-tight">Sequência de 3 Dias</p>
                          <p className="text-[10px] text-emerald-600 font-black uppercase mt-1 tracking-wide">Check-in disponível + R$ 0,50</p>
                      </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="grid grid-cols-2 gap-3.5">
                  <button onClick={() => setIsSpinWheelOpen(true)} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600"><Dices className="w-5 h-5" /></div>
                      <div className="text-center">
                          <p className="text-xs font-black text-gray-800 dark:text-white">Roleta</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase mt-1">Tente a Sorte</p>
                      </div>
                  </button>
                  <button onClick={() => onNavigate('invite_friend')} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-transform">
                      <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600"><Users className="w-5 h-5" /></div>
                      <div className="text-center">
                          <p className="text-xs font-black text-gray-800 dark:text-white">Indicar</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase mt-1">Ganhe R$ 5,00</p>
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
                {isSearching && <Loader2 className="w-4 h-4 animate-spin text-[#1E5BFF]" />}
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
                <SpinWheelView userId={user?.id || null} userRole={userRole || null} onWin={onSpinWin} onRequireLogin={onRequireLogin} onViewHistory={() => onNavigate('prize_history')} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
