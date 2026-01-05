
import React, { useState, useEffect, useMemo } from 'react';
import { Store, Category, EditorialCollection, AdType } from '../types';
import { 
  ChevronRight, 
  Dices,
  ArrowUpRight,
  Leaf,
  Coffee,
  Baby,
  Dog as DogIcon,
  Crown,
  MessageCircle,
  TrendingUp,
  Store as StoreIcon,
  X,
  Sparkles
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES, STORES } from '../constants';
import { RecomendadosPorMoradores } from './RecomendadosPorMoradores';

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

const MINI_TRIBOS = [
  { id: 't-work', name: 'Home Office', subtitle: 'Wi-Fi e silêncio', icon: Coffee, color: 'bg-white text-blue-600 border-gray-100 shadow-sm' },
  { id: 't-pet', name: 'Amigo do Pet', subtitle: 'Eles são bem-vindos', icon: DogIcon, color: 'bg-white text-purple-600 border-gray-100 shadow-sm' },
  { id: 't-kids', name: 'Espaço Kids', subtitle: 'Lazer pros pequenos', icon: Baby, color: 'bg-white text-orange-600 border-gray-100 shadow-sm' },
  { id: 't-health', name: 'Vibe Saúde', subtitle: 'Foco no bem-estar', icon: Leaf, color: 'bg-white text-emerald-600 border-gray-100 shadow-sm' },
];

// --- LOGICA DO CARROSSEL ---

type BannerType = 'standard' | 'premium_grid';

interface BannerItem {
  id: string;
  type: BannerType;
  title: string;
  subtitle?: string;
  image?: string;
  target: string;
  tag?: string;
  tagColor?: string;
  premiumStores?: Store[];
}

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // 1. Filtrar lojas premium para o Banner 4
  const premiumStores = useMemo(() => {
    return STORES.filter(s => s.adType === AdType.PREMIUM).slice(0, 6); // Max 6 logos
  }, []);

  // 2. Construir lista de banners
  const banners: BannerItem[] = useMemo(() => {
    const list: BannerItem[] = [
      {
        id: 'b1-cashback',
        type: 'standard',
        title: 'Cashback real entre lojas do seu bairro',
        subtitle: 'Compre no comércio local e receba dinheiro de volta na hora. Algo nunca visto antes.',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
        target: 'explore', 
        tag: 'Exclusivo',
        tagColor: 'bg-emerald-500'
      },
      {
        id: 'b2-services',
        type: 'standard',
        title: 'Encontre serviços e receba até 5 orçamentos',
        subtitle: 'Fale direto com profissionais pelo WhatsApp, sem ligações e sem complicação.',
        image: 'https://images.unsplash.com/photo-1581578731117-10d52143b0e8?q=80&w=800&auto=format&fit=crop',
        target: 'services',
        tag: 'WhatsApp Direto',
        tagColor: 'bg-green-600'
      },
      {
        id: 'b3-merchant',
        type: 'standard',
        title: 'Freguesia Connect para lojistas',
        subtitle: 'Venda mais, atraia clientes do bairro e participe do cashback local.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
        target: 'freguesia_connect_public',
        tag: 'Para Negócios',
        tagColor: 'bg-indigo-600'
      }
    ];

    // Adiciona Banner 4 somente se houver lojas premium
    if (premiumStores.length > 0) {
      list.push({
        id: 'b4-premium',
        type: 'premium_grid',
        title: 'Lojas Patrocinadas',
        target: 'explore',
        premiumStores: premiumStores
      });
    }

    return list;
  }, [premiumStores]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % banners.length);
          return 0;
        }
        return prev + 0.4; // ~8 seconds duration (slower)
      });
    }, 30);
    return () => clearInterval(interval);
  }, [banners.length]);

  const current = banners[currentIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setProgress(0);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setProgress(0);
  };

  return (
    <div className="px-5">
      <div 
        onClick={() => onNavigate(current.target)}
        className="w-full relative aspect-[2/1] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 bg-slate-900 cursor-pointer active:scale-[0.98] transition-all group"
      >
        
        {/* --- CONTEÚDO CONDICIONAL --- */}
        {current.type === 'standard' ? (
          <>
            <img 
              key={current.image}
              src={current.image} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 animate-in fade-in zoom-in-50 duration-[1500ms]"
              alt={current.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-90"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 pb-10">
              <div className="flex items-center gap-2 mb-2">
                  <span className={`${current.tagColor || 'bg-blue-600'} text-white text-[9px] font-black px-2 py-0.5 rounded text-xs uppercase tracking-widest shadow-sm animate-in fade-in slide-in-from-left-2`}>
                    {current.tag}
                  </span>
              </div>
              <h3 className="text-xl font-black text-white leading-[1.1] font-display tracking-tight mb-2 drop-shadow-sm max-w-[90%]">
                {current.title}
              </h3>
              <p className="text-xs text-gray-200 font-medium line-clamp-2 leading-relaxed opacity-90 max-w-[95%]">
                {current.subtitle}
              </p>
            </div>
          </>
        ) : (
          /* --- LAYOUT PREMIUM GRID (BANNER 4) --- */
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

             {/* Tag Patrocinado */}
             <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <p className="text-[8px] font-black text-white/70 uppercase tracking-widest flex items-center gap-1">
                   <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                   Patrocinado
                </p>
             </div>

             {/* Grid de Logos */}
             <div className="w-full grid grid-cols-4 gap-3 items-center justify-center">
                {current.premiumStores?.map((store, idx) => (
                   <div key={idx} className="aspect-square bg-white rounded-xl flex items-center justify-center p-2 shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                      <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain" />
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Progress Bar Indicator - Bottom Position */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 w-1/3 justify-center">
          {banners.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setProgress(0); }}>
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Invisible Click Areas for Navigation */}
        <div className="absolute inset-y-0 left-0 w-1/6 z-20" onClick={handlePrev}></div>
        <div className="absolute inset-y-0 right-0 w-1/6 z-20" onClick={handleNext}></div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; rightElement?: React.ReactNode }> = ({ title, subtitle, rightElement }) => (
  <div className="flex items-center justify-between mb-5 px-1">
    <div className="flex flex-col">
      <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">
        {title}
      </h3>
      {subtitle && <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">{subtitle}</p>}
    </div>
    {rightElement}
  </div>
);

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  searchTerm: externalSearchTerm,
  stores,
  user,
  userRole,
  onSpinWin,
  onRequireLogin
}) => {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');
  const activeSearchTerm = externalSearchTerm || '';

  const communityRecommendations = [
    { id: 'rec-1', nome: 'Cantinho do Café', categoria: 'Cafeterias', texto: 'Melhor lugar pra trabalhar de tarde, o café coado é incrível.', totalRecomendacoes: 142 },
    { id: 'rec-2', nome: 'Pet Shop Araguaia', categoria: 'Pets', texto: 'Tratam os cachorros com um carinho que nunca vi antes.', totalRecomendacoes: 98 },
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-6 pb-4">
            <div className="flex overflow-x-auto no-scrollbar px-4 pb-2">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 relative overflow-hidden bg-gradient-to-br ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">
                        {React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 }) : null}
                      </div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2">
                        <span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'home_carousel':
        return (
          <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pb-8">
            <HomeCarousel onNavigate={onNavigate} />
          </div>
        );

      case 'recommended':
        return (
          <div key="recommended" className="w-full bg-gray-50/80 dark:bg-slate-900/30 py-10 border-y border-gray-100 dark:border-gray-800">
            <div className="px-5">
              <SectionHeader title="Comunidade" subtitle="Recomendados pelos vizinhos" />
              <RecomendadosPorMoradores items={communityRecommendations} />
            </div>
          </div>
        );

      case 'roulette':
        return (
          <div key="roulette" className="w-full bg-white dark:bg-gray-950 py-8">
            <div className="px-5">
              <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-slate-950 rounded-[32px] p-8 text-white flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all border border-white/5 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                      <Dices className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-base uppercase tracking-widest leading-none">Sorte do Dia</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1.5">Clique para girar</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700" strokeWidth={3} />
              </button>
            </div>
          </div>
        );

      case 'cashback_stores':
        return (
          <div key="cashback_stores" className="w-full bg-white dark:bg-gray-950 py-6">
            <div className="px-5 mb-4">
              <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none">
                Dinheiro de volta para você
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5">
                Veja onde você recebe cashback no bairro
              </p>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-6 snap-x">
              {stores.filter(s => s.cashback && s.cashback > 0).map((store) => (
                <button
                  key={store.id}
                  onClick={() => onStoreClick?.(store)}
                  className="flex flex-col items-center justify-between p-3 min-w-[120px] max-w-[120px] bg-white dark:bg-gray-800 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-700 active:scale-95 transition-all duration-300 group snap-center"
                >
                   {/* Logo Area with Squircle Shape */}
                   <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-1 mb-2 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                      <img src={store.logoUrl} className="w-full h-full object-contain rounded-xl" alt={store.name} />
                   </div>

                   {/* Content */}
                   <div className="flex flex-col items-center w-full">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate w-full text-center leading-tight">
                        {store.name}
                      </h4>
                      
                      {/* Elegant Badge (Pill) */}
                      <div className="mt-2 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                         <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap tracking-wide">
                           {store.cashback}% de volta
                         </span>
                      </div>
                   </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-950 py-8">
            <div className="px-5">
              <SectionHeader 
                title="Explorar" 
                subtitle="O que há de melhor no bairro" 
                rightElement={
                  <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {['all', 'cashback', 'top_rated'].map((f) => (
                        <button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>
                            {f === 'all' ? 'Tudo' : f === 'cashback' ? '%' : 'Top'}
                        </button>
                    ))}
                  </div>
                }
              />
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
            </div>
          </div>
        );

      case 'mini_tribes':
        return (
          <div key="mini_tribes" className="w-full py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="px-5">
              <SectionHeader title="Estilo de Vida" subtitle="Lugares pela sua vibe" />
            </div>
            <div className="grid grid-cols-2 gap-3 px-5">
              {MINI_TRIBOS.map((tribo) => (
                <button key={tribo.id} className={`flex items-center gap-3 p-4 rounded-2xl border text-left active:scale-[0.97] transition-all ${tribo.color} bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700`}>
                  <div className="p-2 bg-gray-50/50 dark:bg-gray-700 rounded-lg shrink-0">
                    <tribo.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[10px] truncate uppercase tracking-tight">{tribo.name}</h4>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  const homeStructure = useMemo(() => {
    return [
      'categories',
      'home_carousel',
      'recommended',
      'roulette',
      'cashback_stores',
      'list',
      'mini_tribes'
    ];
  }, []);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      {!activeSearchTerm ? (
        <div className="flex flex-col w-full">
            {homeStructure.map(section => renderSection(section))}
            <div className="px-5 pb-8 pt-4 bg-gray-50 dark:bg-gray-900">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>
        </div>
      ) : (
        <div className="px-5 mt-4 min-h-[50vh]">
             <h3 className="font-bold text-sm text-gray-500 mb-4 px-1">Resultados para "{activeSearchTerm}"</h3>
             <div className="flex flex-col gap-3">
                {stores.filter(s => s.name.toLowerCase().includes(activeSearchTerm.toLowerCase())).map((store) => (
                <div key={store.id} onClick={() => onStoreClick?.(store)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 p-1 flex-shrink-0">
                        <img src={store.logoUrl || "/assets/default-logo.png"} className="w-full h-full object-contain" alt={store.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{store.name}</h4>
                        <span className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-tight">{store.category}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                </div>
                ))}
             </div>
        </div>
      )}

      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300" onClick={() => setIsSpinWheelOpen(false)}>
          <div className="bg-transparent w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-5 z-50">
                <button onClick={() => setIsSpinWheelOpen(false)} className="p-2.5 text-gray-200 hover:text-white bg-white/10 backdrop-blur-md rounded-full active:scale-90 transition-transform">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <SpinWheelView 
                userId={user?.id || null} 
                userRole={userRole || null} 
                onWin={onSpinWin} 
                onRequireLogin={onRequireLogin} 
                onViewHistory={() => { setIsSpinWheelOpen(false); onNavigate('prize_history'); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};
