
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AdType, Category, Store, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  ArrowRight, 
  Star,
  X,
  TrendingUp,
  Flame,
  Zap,
  Dices,
  Clock,
  Utensils,
  MapPin,
  ArrowUpRight,
  Wrench,
  Heart,
  Tag,
  Timer,
  Activity,
  Eye,
  Rocket,
  Store as StoreIcon,
  ShoppingBag,
  Coins,
  Crown,
  ShieldCheck,
  Building2,
  Compass,
  Users
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES, EDITORIAL_COLLECTIONS } from '../constants';
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

const HOME_CAROUSEL_DURATION = 4000; 

const HOME_CAROUSEL_BANNERS = [
  {
    id: 'cashback',
    title: 'Cashback Localizei',
    subtitle: 'Ganhe dinheiro de volta comprando nos seus lugares favoritos da Freguesia.',
    cta: 'Ver Meu Saldo',
    icon: <Coins className="w-6 h-6 text-emerald-300" />,
    gradient: 'from-slate-900 via-emerald-950 to-slate-950',
    image: 'https://images.unsplash.com/photo-1579621970795-87f54c3038a8?q=80&w=600',
    isSponsored: false,
    navigationTarget: 'user_statement',
  },
  {
    id: 'premium_highlight',
    title: 'Destaques Premium',
    subtitle: 'Conheça os comércios que são referência em qualidade no nosso bairro.',
    cta: 'Ver Todos',
    icon: <Crown className="w-6 h-6 text-amber-400" />,
    gradient: 'from-slate-900 via-indigo-950 to-slate-950',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    isSponsored: true,
    navigationTarget: 'explore',
  },
  {
    id: 'servicos',
    title: 'Serviços Profissionais',
    subtitle: 'Encontre eletricistas, pintores e mais. Peça orçamentos grátis e sem compromisso.',
    cta: 'Pedir Orçamento',
    icon: <Wrench className="w-6 h-6 text-sky-300" />,
    gradient: 'from-slate-900 via-sky-950 to-slate-950',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=600',
    isSponsored: false,
    navigationTarget: 'services',
  }
];

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / HOME_CAROUSEL_DURATION) * 100;
      
      if (newProgress >= 100) {
        setCurrentIndex((prev) => (prev + 1) % HOME_CAROUSEL_BANNERS.length);
        setProgress(0);
        clearInterval(interval);
      } else {
        setProgress(newProgress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentBanner = HOME_CAROUSEL_BANNERS[currentIndex];

  return (
    <div className="px-4">
      <div className="w-full relative aspect-[21/10] rounded-[32px] overflow-hidden shadow-2xl shadow-slate-950/20 border border-white/5">
        
        <div className="absolute inset-0 bg-slate-900">
          <img 
            key={currentBanner.image}
            src={currentBanner.image} 
            className="w-full h-full object-cover opacity-50 animate-in fade-in duration-700"
            alt={currentBanner.title}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute bottom-4 left-6 right-6 flex gap-2 z-30">
          {HOME_CAROUSEL_BANNERS.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: idx === currentIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-6 right-6 z-20">
          {currentBanner.isSponsored && (
            <span className="bg-amber-500 text-slate-950 text-[8px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg tracking-[0.2em] animate-in zoom-in duration-500">
              Destaque Local
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 flex justify-between items-end z-20">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-black text-white leading-tight font-display tracking-tight mb-1">
              {currentBanner.title}
            </h3>
            <p className="text-[11px] text-gray-400 font-medium line-clamp-1 max-w-[240px]">
              {currentBanner.subtitle}
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate(currentBanner.navigationTarget)}
            className="bg-white text-slate-950 h-10 px-5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl active:scale-[0.95] transition-all hover:bg-amber-400"
          >
            {currentBanner.cta} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; rightElement?: React.ReactNode }> = ({ icon: Icon, title, rightElement }) => (
  <div className="flex items-center justify-between mb-6 px-1">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
         <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 tracking-tight">
        {title}
      </h3>
    </div>
    {rightElement}
  </div>
);

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
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');
  const activeSearchTerm = externalSearchTerm || '';

  const renderSection = (key: string) => {
    switch (key) {
      case 'home_carousel':
        return <HomeCarousel key="home_carousel" onNavigate={onNavigate} />;

      case 'categories':
        return (
          <div key="categories" className="w-full">
            <div className="flex overflow-x-auto no-scrollbar px-4 pb-2">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat)}
                    className="flex flex-col items-center group active:scale-95 transition-all duration-200"
                  >
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 relative overflow-hidden transition-all duration-300 bg-gradient-to-br ${cat.color} border border-white/20`}>
                      <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                      <div className="flex-1 flex items-center justify-center w-full mt-0.5">
                        {React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as any, { 
                          className: "w-7 h-7 text-white drop-shadow-md",
                          strokeWidth: 2.5
                        }) : null}
                      </div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2">
                        <span className="block w-full text-[9px] font-black text-white leading-none tracking-tight text-center uppercase">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'roulette':
        return (
          <div key="roulette" className="px-4">
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-slate-900 rounded-[2.5rem] p-6 text-white flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <Dices className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-lg leading-tight tracking-tight uppercase">Sorte do Dia</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Tente ganhar cashback agora</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                 <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </div>
            </button>
          </div>
        );

      case 'list':
        return (
          <div key="list" className="px-4 min-h-[400px]">
              <SectionHeader 
                icon={ShoppingBag} 
                title="Explorar o Bairro" 
                rightElement={
                  <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    {['all', 'cashback', 'top_rated'].map((f) => (
                        <button 
                            key={f} 
                            onClick={() => setListFilter(f as any)}
                            className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {f === 'all' ? 'Ver Tudo' : f === 'cashback' ? 'Cashback' : 'Top'}
                        </button>
                    ))}
                  </div>
                }
              />
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );

      default: return null;
    }
  };

  const homeStructure = useMemo(() => {
    return ['categories', 'home_carousel', 'roulette', 'list'];
  }, []);

  return (
    <div className="flex flex-col gap-10 pt-8 pb-32 bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      {activeSearchTerm ? (
        <div className="px-4 mt-4 min-h-[50vh]">
             <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4 px-1">Resultados para "{activeSearchTerm}"</h3>
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
      ) : (
        <div className="flex flex-col gap-10 w-full">
            {homeStructure.map(section => renderSection(section))}
            
            <div className="px-4">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>

            <div className="mt-4 mb-4 flex flex-col items-center justify-center text-center opacity-20">
              <Star className="w-3 h-3 text-gray-400 mb-2" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.5em]">Localizei Freguesia • Jacarepaguá</p>
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
            <div className="animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <SpinWheelView 
                    userId={user?.id || null} 
                    userRole={userRole || null} 
                    onWin={onSpinWin} 
                    onRequireLogin={onRequireLogin} 
                    onViewHistory={() => { setIsSpinWheelOpen(false); onNavigate('prize_history'); }} 
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
