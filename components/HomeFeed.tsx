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
  Compass
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { CATEGORIES, EDITORIAL_SERVICES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

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

interface BannerItem {
  id: string;
  title: string;
  target: string;
  tag?: string;
  bgColor: string;
  Icon: React.ElementType;
}

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void; onStoreClick?: (store: Store) => void; stores?: Store[] }> = ({ onNavigate, onStoreClick, stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const banners: BannerItem[] = useMemo(() => [
    { id: 'master-sponsor', title: 'Grupo Esquematiza', target: 'patrocinador_master', tag: 'Patrocinador Master', bgColor: 'bg-slate-900', Icon: Crown },
    { id: 'rio-phone-store', title: 'Rio Phone Store', target: 'rio-phone-store', tag: 'Assistência Apple', bgColor: 'bg-zinc-900', Icon: Smartphone },
    { id: 'advertise-home', title: 'Anuncie aqui', target: 'advertise_home_banner', tag: 'Destaque sua marca', bgColor: 'bg-[#1E5BFF]', Icon: Megaphone }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % banners.length);
          return 0;
        }
        return prev + 0.75; 
      });
    }, 30);
    return () => clearInterval(interval);
  }, [banners.length]);

  const current = banners[currentIndex];

  const handleBannerClick = () => {
    if (onStoreClick && stores) {
      const targetStore = stores.find(s => s.id === current.target);
      if (targetStore) {
        onStoreClick(targetStore);
        return;
      }
    }
    onNavigate(current.target);
  };

  return (
    <div className="px-4">
      <div 
        onClick={handleBannerClick}
        className={`w-full relative aspect-[3/2] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 ${current.bgColor} cursor-pointer active:scale-[0.98] transition-all group`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4 pb-12 text-center z-10">
           <div className="p-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl animate-in zoom-in duration-700 mb-5">
              <current.Icon className="w-12 h-12 text-white" strokeWidth={2} />
           </div>
           <h3 className="text-2xl font-[900] text-white leading-tight font-display tracking-tight mt-4 uppercase">
            {current.title}
           </h3>
           <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{current.tag}</p>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 w-1/3 justify-center">
          {banners.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }} />
            </div>
          ))}
        </div>
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
  // Regra obrigatória: Apenas lojas que possuem imagem
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
  // Regra obrigatória: Apenas lojas que possuem imagem
  const suggestions = useMemo(() => {
    return stores.filter(s => (s.image || s.logoUrl) && ['f-3', 'f-5', 'f-8', 'f-12', 'f-15'].includes(s.id));
  }, [stores]);

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-950 py-4 px-5">
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
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
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
  // Regra obrigatória: Apenas lojas que possuem imagem
  const trending = useMemo(() => {
    return stores.filter(s => (s.image || s.logoUrl) && ['f-1', 'f-2'].includes(s.id));
  }, [stores]);

  if (trending.length < 2) return null;

  return (
    <div className="bg-white dark:bg-gray-950 py-4 px-5">
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
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-2 pb-0">
            <div ref={categoriesRef} className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 bg-gradient-to-br ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'home_carousel': return <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 mt-1 pb-1"><HomeCarousel onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} /></div>;
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

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      <div className="flex flex-col w-full gap-1">
          {homeStructure.map(section => renderSection(section))}
      </div>
    </div>
  );
};