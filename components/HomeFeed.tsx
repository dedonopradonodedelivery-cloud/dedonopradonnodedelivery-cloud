import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Store, Category, EditorialCollection, AdType } from '../types';
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
  Image as ImageIcon
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, EDITORIAL_SERVICES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { supabase } from '../lib/supabaseClient';

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectCollection: (collection: EditorialCollection) => void;
  onStoreClick?: (store: Store) => void;
  searchTerm?: string;
  stores: Store[];
  user: User | null;
  userRole?: 'cliente' | 'lojista' | null;
  onRequireLogin: () => void;
}

interface BannerItem {
  id: string;
  title?: string;
  target?: string;
  tag?: string;
  bgColor?: string;
  Icon?: React.ElementType;
  isSpecial?: boolean;
  isUserBanner?: boolean;
  config?: any;
}

// --- COMPONENTES DE RENDERIZAÇÃO DINÂMICA DE BANNER ---

const TemplateBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { template_id, headline, subheadline, product_image_url } = config;
    switch (template_id) {
      case 'oferta_relampago':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 text-white p-6 flex items-center justify-between overflow-hidden relative">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <span className="text-sm font-bold bg-yellow-300 text-red-700 px-3 py-1 rounded-full uppercase shadow-sm">{headline || 'XX% OFF'}</span>
              <h3 className="text-3xl font-black mt-4 drop-shadow-md max-w-[200px] leading-tight">{subheadline || 'Nome do Produto'}</h3>
            </div>
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
              {product_image_url ? <img src={product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 flex items-end justify-between overflow-hidden relative">
             <img src={product_image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
             <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">{headline || 'LANÇAMENTO'}</span>
                <h3 className="text-2xl font-bold mt-1 max-w-[220px] leading-tight">{subheadline || 'Descrição'}</h3>
             </div>
          </div>
        );
      default: return null;
    }
};

const CustomBannerRender: React.FC<{ config: any }> = ({ config }) => {
    const { template_id, background_color, text_color, font_size, font_family, title, subtitle } = config;

    const fontSizes = { small: 'text-2xl', medium: 'text-4xl', large: 'text-5xl' };
    const subFontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
    const headlineFontSize = { small: 'text-4xl', medium: 'text-6xl', large: 'text-7xl' };

    const layoutClasses = {
      simple_left: 'flex flex-col justify-center items-start text-left',
      centered: 'flex flex-col justify-center items-center text-center',
      headline: 'flex flex-col justify-center items-center text-center',
    };
    
    return (
        <div 
            className={`w-full h-full p-8 ${layoutClasses[template_id] || 'flex flex-col justify-center'}`}
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <h3 className={`${template_id === 'headline' ? headlineFontSize[font_size] : fontSizes[font_size]} font-black leading-tight line-clamp-2`} style={{ fontFamily: font_family }}>
                {title || "Seu Título Aqui"}
            </h3>
            <p className={`${subFontSizes[font_size]} mt-3 opacity-80 max-w-md line-clamp-3`} style={{ fontFamily: font_family }}>
                {subtitle || "Descreva sua oferta."}
            </p>
        </div>
    );
};


// --- COMPONENTE INDEPENDENTE: HOME CAROUSEL ---

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void; onStoreClick?: (store: Store) => void; stores?: Store[] }> = ({ onNavigate, onStoreClick, stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userBanner, setUserBanner] = useState<BannerItem | null>(null);

  const defaultBanners: BannerItem[] = useMemo(() => [
    { id: 'rio-phone-store', title: 'RIO PHONE STORE', target: 'rio-phone-store', tag: 'Assistência Apple', bgColor: 'bg-black', Icon: Smartphone, isSpecial: true },
    { id: 'master-sponsor', title: 'Grupo Esquematiza', target: 'patrocinador_master', tag: 'Patrocinador Master', bgColor: 'bg-[#0F172A]', Icon: Crown },
    { id: 'advertise-home', title: 'Anuncie aqui', target: 'store_ads_module', tag: 'Destaque sua marca', bgColor: 'bg-brand-blue', Icon: Megaphone }
  ], []);

  useEffect(() => {
    const fetchHomeBanner = async () => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase
                .from('published_banners')
                .select('id, config')
                .eq('target', 'home')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (error) throw error;

            if (data && data.length > 0) {
                setUserBanner({
                    id: `user-banner-${data[0].id}`,
                    isUserBanner: true,
                    config: data[0].config,
                });
            } else {
                setUserBanner(null);
            }
        } catch (e: any) {
            console.error("Failed to fetch home banner from Supabase:", e.message || e);
            setUserBanner(null);
        }
    };
    
    fetchHomeBanner();
    
    const channel = supabase.channel('home-banner-updates')
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'published_banners',
          filter: 'target=eq.home'
        }, 
        (payload) => {
          fetchHomeBanner();
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error('Realtime subscription failed for home banner:', err.message || err);
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  const allBanners = useMemo(() => userBanner ? [userBanner, ...defaultBanners] : defaultBanners, [userBanner, defaultBanners]);

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
    if (current.isUserBanner) {
        alert(`Clicou no banner personalizado.`);
        return;
    }

    if (onStoreClick && stores && current.target) {
      const targetStore = stores.find(s => s.id === current.target);
      if (targetStore) {
        onStoreClick(targetStore);
        return;
      }
    }
    if(current.target) onNavigate(current.target);
  };

  return (
    <div className="px-4">
      <div className="flex flex-col gap-4">
        {/* Banner Container */}
        <div 
          onClick={handleBannerClick}
          className={`w-full relative aspect-[3/2] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 ${current.bgColor || ''} cursor-pointer active:scale-[0.98] transition-all group`}
        >
          {current.isUserBanner ? (
            current.config.type === 'template' ? (
              <TemplateBannerRender config={current.config} />
            ) : (
              <CustomBannerRender config={current.config} />
            )
          ) : current.id === 'rio-phone-store' ? (
            <div className="absolute inset-0 bg-black flex items-center justify-start px-4">
              {/* Text on the left */}
              <div className="w-1/2 h-full flex flex-col items-start justify-center text-left text-white z-10">
                  <h3 className="text-xl font-bold tracking-wider opacity-90">
                      <span className="opacity-70"></span> iPhone 17
                  </h3>
                  <h2 className="text-8xl font-black tracking-tighter my-1 bg-gradient-to-r from-orange-300 via-amber-400 to-orange-500 bg-clip-text text-transparent font-display">
                      PRO
                  </h2>
                  <button className="mt-8 px-8 py-3 border-2 border-white/80 rounded-full text-base font-bold hover:bg-white hover:text-black transition-all duration-300 active:scale-95">
                      Saiba mais
                  </button>
              </div>
              {/* Image on the right */}
              <div className="absolute right-0 top-0 bottom-0 w-[55%] h-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1678931481189-598199ea3504?q=80&w=1200&auto=format&fit=crop"
                    alt="iPhone 17 Pro Laranja" 
                    className="h-full w-auto object-cover scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                    style={{ objectPosition: '20% 35%' }}
                  />
              </div>
            </div>
          ) : current.id === 'master-sponsor' ? (
            <div className="absolute inset-0 bg-[#0F172A] flex overflow-hidden">
              {/* LADO ESQUERDO: VISUAL / ANIMAÇÃO */}
              <div className="relative w-[48%] h-full overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop" 
                    alt="Segurança Esquematiza" 
                    className="w-full h-full object-cover brightness-75 scale-110 animate-float-slow opacity-60"
                  />
                  {/* Gradiente de Fusão - Suaviza a transição para o texto no lado direito */}
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#0F172A] z-10"></div>
                  {/* Subtle Glow de Tecnologia */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] animate-pulse"></div>
                  {/* Textura de Scanline sutil */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '100% 4px' }}></div>
                </div>

                {/* Elemento flutuante de autoridade (Escudo) */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl animate-subtle-glow">
                        <Shield className="w-12 h-12 text-blue-400 opacity-80" strokeWidth={1.5} />
                    </div>
                </div>
              </div>

              {/* LADO DIREITO: TEXTO */}
              <div className="flex-1 h-full flex flex-col justify-center pl-2 pr-10 z-30 text-left relative">
                 {/* Badge Superior */}
                 <div className="mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <div className="bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                        <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-[9px] font-black text-amber-100 uppercase tracking-[0.2em] leading-none">Patrocinador Master</span>
                    </div>
                 </div>

                 {/* Marca Principal */}
                 <div className="mb-2 space-y-0.5 animate-in slide-in-from-bottom-2 duration-700 delay-100">
                    <h3 className="text-3xl font-[950] text-white leading-[0.85] font-display tracking-tighter uppercase drop-shadow-2xl">
                      GRUPO
                    </h3>
                    <h3 className="text-3xl font-[950] bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent leading-[0.85] font-display tracking-tighter uppercase">
                      ESQUEMATIZA
                    </h3>
                 </div>

                 {/* Slogan / Área */}
                 <div className="mb-6 animate-in fade-in duration-1000 delay-300">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-90 leading-tight">
                      SEGURANÇA E FACILITIES
                    </p>
                 </div>

                 {/* Selo de Excelência */}
                 <div className="flex items-center gap-3 animate-in fade-in duration-1000 delay-500">
                    <div className="w-6 h-[1px] bg-blue-500/30"></div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Excelência Comprovada</span>
                    </div>
                 </div>
              </div>
              
              {/* Overlay Decorativo Right */}
              <div className="absolute -right-16 -bottom-16 opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Shield className="w-64 h-64 text-white" />
              </div>
            </div>
          ) : current.id === 'advertise-home' ? (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-[#0A369D] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
              {/* Animated Watermark */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <MapPin className="absolute -bottom-16 -right-16 w-80 h-80 text-white/5 rotate-[-20deg] animate-subtle-diagonal-scroll" />
              </div>
              {/* Subtle decorative glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] animate-subtle-glow opacity-50"></div>

              <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
                  {/* Label */}
                  <div className="mb-5 animate-in fade-in duration-1000">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                          <span className="text-[8px] font-black text-white/80 uppercase tracking-[0.25em] leading-none">Destaque Exclusivo</span>
                      </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-[28px] font-bold text-white leading-tight font-display tracking-tight mb-3 animate-in fade-in slide-in-from-bottom-1 duration-1000 delay-100">
                    Anuncie sua marca
                  </h3>

                  {/* Subtitle */}
                  <p className="text-blue-100/70 text-[12px] font-medium leading-snug max-w-[260px] mb-8 animate-in fade-in duration-1000 delay-300 text-center tracking-normal">
                    Conecte sua empresa a milhares de novos clientes locais através do Localizei.
                  </p>

                  {/* CTA */}
                  <div className="relative group/cta">
                    <div className="relative bg-white text-[#1E5BFF] px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 shadow-2xl shadow-black/30 active:scale-[0.98] transition-all duration-500 hover:bg-blue-50 hover:-translate-y-0.5">
                      Divulgar minha loja
                      <ArrowRight className="w-3 h-3 transition-transform duration-500 group-hover/cta:translate-x-1" strokeWidth={2.5} />
                    </div>
                  </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4 pb-12 text-center z-10">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl animate-in zoom-in duration-700 mb-5">
                  {current.Icon && <current.Icon className="w-12 h-12 text-white" strokeWidth={2} />}
              </div>
              <h3 className="text-2xl font-[900] text-white leading-tight font-display tracking-tight mt-4 uppercase">
                {current.title}
              </h3>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{current.tag}</p>
            </div>
          )}
        </div>

        {/* Progress Indicators - MOVED OUTSIDE AND BELOW */}
        <div className="flex gap-1.5 z-30 w-1/3 mx-auto justify-center h-1">
          {allBanners.map((_, idx) => (
            <div key={idx} className="h-full flex-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1E5BFF] transition-all duration-100 ease-linear" 
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const categoriesRef = useRef<HTMLDivElement>(null);

  // ESTRUTURA DA HOME: 'categories' primeiro, 'home_carousel' DEPOIS (abaixo das categorias)
  const homeStructure = useMemo(() => ['categories', 'home_carousel', 'novidades', 'sugestoes', 'em_alta', 'list'], []);

  const renderSection = (key: string) => {
    switch (key) {
      case 'home_carousel': 
        return (
          <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pb-2 pt-4">
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
        <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">
          {title}
        </h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          {subtitle}
        </p>
      </div>
    </div>
    <button 
      onClick={onSeeMore}
      className="text-[10px] font-black text-[#1E5BFF] uppercase tracking-widest hover:underline active:opacity-60"
    >
      Ver mais
    </button>
  </div>
);

const NovidadesDaSemana: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const newArrivals = useMemo(() => {
    return stores.filter(s => (s.image || s.logoUrl) && ['f-38', 'f-39', 'f-45', 'f-42', 'f-50'].includes(s.id));
  }, [stores]);

  if (newArrivals.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-950 py-4 px-5">
      <SectionHeader 
        icon={Sparkles} 
        title="Novidades da Semana" 
        subtitle="Recém chegados no bairro" 
        onSeeMore={() => onNavigate('explore')}
      />

      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {newArrivals.map((store) => (
          <button 
            key={store.id}
            onClick={() => onStoreClick && onStoreClick(store)}
            className="flex-shrink-0 w-[180px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative snap-center shadow-2xl shadow-black/5 group active:scale-[0.98] transition-all"
          >
            <img 
              src={store.image || store.logoUrl} 
              alt={store.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            <div className="absolute inset-0 p-5 flex flex-col justify-end text-left">
              <span className="w-fit bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 shadow-lg shadow-emerald-500/20">
                Novo
              </span>
              <h3 className="text-sm font-black text-white leading-tight mb-0.5 truncate drop-shadow-md">
                {store.name}
              </h3>
              <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest truncate">
                {store.category}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SugestoesParaVoce: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const suggestions = useMemo(() => {
    return stores.filter(s => (s.image || s.logoUrl) && ['f-3', 'f-5', 'f-8', 'f-12', 'f-15'].includes(s.id));
  }, [stores]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-5">
      <SectionHeader 
        icon={Lightbulb} 
        title="Sugestões para você" 
        subtitle="Baseado nas suas buscas" 
        onSeeMore={() => onNavigate('explore')}
      />

      <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x -mx-5 px-5">
        {suggestions.map((store) => (
          <button 
            key={store.id}
            onClick={() => onStoreClick && onStoreClick(store)}
            className="flex-shrink-0 w-[240px] bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden snap-center shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 group active:scale-[0.98] transition-all text-left"
          >
            <div className="relative h-32 overflow-hidden">
              <img 
                src={store.image || store.logoUrl} 
                alt={store.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute top-3 left-3">
                <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                  Para você
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <span className="text-[9px] font-black text-[#1E5BFF] uppercase tracking-widest block mb-1">
                {store.category}
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-2 truncate">
                {store.name}
              </h3>
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-400 mt-0.5">
                <MapPin size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  {store.neighborhood || store.distance}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const EmAltaNaCidade: React.FC<{ stores: Store[]; onStoreClick?: (store: Store) => void; onNavigate: (v: string) => void }> = ({ stores, onStoreClick, onNavigate }) => {
  const trending = useMemo(() => {
    return stores.filter(s => (s.image || s.logoUrl) && ['f-1', 'f-2'].includes(s.id));
  }, [stores]);

  if (trending.length < 2) return null;

  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-5">
      <SectionHeader 
        icon={TrendingUp} 
        title="Em alta na cidade" 
        subtitle="O que a vizinhança ama" 
        onSeeMore={() => onNavigate('explore')}
      />

      <div className="flex gap-4">
        {trending.map((store, idx) => (
          <button 
            key={store.id}
            onClick={() => onStoreClick && onStoreClick(store)}
            className={`flex-1 rounded-[2.5rem] p-6 flex flex-col items-center text-center transition-all active:scale-[0.98] shadow-sm
              ${idx === 0 ? 'bg-rose-50/70 dark:bg-rose-900/20' : 'bg-blue-50/70 dark:bg-blue-900/20'}
            `}
          >
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-xl border-4 border-white mb-5">
              <img src={store.logoUrl || store.image} alt={store.name} className="w-full h-full object-cover" />
            </div>
            
            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1">
              {store.name}
            </h3>
            <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
              {store.category}
            </p>

            <div className="mt-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg transition-colors">
              Explorar <ArrowRight size={10} strokeWidth={4} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
