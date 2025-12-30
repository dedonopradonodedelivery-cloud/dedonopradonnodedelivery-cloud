
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
  ShieldCheck,
  MapPin,
  ArrowUpRight,
  Wrench,
  Compass,
  CheckCircle2,
  Heart,
  Tag,
  Timer
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES, EDITORIAL_COLLECTIONS } from '../constants';
import { RecomendadosPorMoradores } from './RecomendadosPorMoradores';
import { UserCashbackBanner } from './UserCashbackBanner';

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

const RouletteIcon: React.FC<{ className?: string }> = ({ className }) => {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#F97316', '#EF4444', '#06B6D4'];
  const sliceAngle = 45;
  const center = 50;
  const radius = 50;
  const getPathD = (index: number) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;
    const startRad = (startAngle - -90) * Math.PI / 180;
    const endRad = (endAngle - -90) * Math.PI / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    return `M ${center},${center} L ${x1},${y1} A ${radius},${radius} 0 0 1 ${x2},${y2} Z`;
  };
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {colors.map((color, i) => (
        <path key={i} d={getPathD(i)} fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
      ))}
      <circle cx="50" cy="50" r="8" fill="white" />
      <circle cx="50" cy="50" r="5" fill="#334155" />
    </svg>
  );
};

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
  const [categoryScrollProgress, setCategoryScrollProgress] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const activeSearchTerm = externalSearchTerm || '';

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollWidth > container.clientWidth) {
      setCategoryScrollProgress(container.scrollLeft / (container.scrollWidth - container.clientWidth));
    }
  };

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="w-full">
            <div 
              ref={categoriesRef} 
              onScroll={handleCategoryScroll}
              className="flex overflow-x-auto no-scrollbar px-4 pb-2"
            >
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat)}
                    className="flex flex-col items-center group active:scale-95 transition-all duration-200"
                  >
                    <div 
                      className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 bg-gradient-to-br ${cat.color} border border-white/20`}
                    >
                      <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/25 to-transparent pointer-events-none"></div>
                      
                      <div className="flex-1 flex items-center justify-center w-full mt-0.5">
                        {React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as any, { 
                          className: "w-7 h-7 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]",
                          strokeWidth: 2.5
                        }) : null}
                      </div>
                      
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2 border-t border-white/5">
                        <span className="block w-full text-[9px] font-black text-white leading-none tracking-tight text-center uppercase drop-shadow-md">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-2 opacity-20">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full relative overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full absolute top-0 left-0 w-4 transition-transform duration-100 ease-linear"
                  style={{ transform: `translateX(${categoryScrollProgress * (48 - 16)}px)` }}
                />
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div key="hero" className="px-4">
             <div className="w-full bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 rounded-[28px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/10 group cursor-pointer active:scale-[0.99] transition-all">
                <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-0">
                    <MapPin className="w-56 h-56" />
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] bg-white/10 px-3 py-1 rounded-full border border-white/10 mb-5 inline-block">App Oficial da Freguesia</span>
                  <h1 className="text-2xl font-black mb-2 leading-tight tracking-tight drop-shadow-lg">O guia definitivo da<br/>nossa vizinhança</h1>
                  <p className="text-sm text-blue-100/70 mb-8 font-medium max-w-[220px]">Explore o melhor do bairro com um clique.</p>
                  <button onClick={() => onNavigate('explore')} className="bg-white text-blue-900 text-xs font-black px-7 py-3.5 rounded-2xl flex items-center gap-2 active:scale-95 transition-all shadow-xl hover:bg-blue-50">
                      EXPLORAR O GUIA <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
             </div>
          </div>
        );

      case 'roulette':
        return (
          <div key="roulette" className="px-4">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Diversão do Dia</h3>
            </div>
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-gradient-to-br from-primary-600 to-blue-700 rounded-[28px] p-6 text-white flex items-center justify-between shadow-xl active:scale-[0.98] transition-all relative overflow-hidden group border border-white/10">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center animate-spin-slow">
                  <RouletteIcon className="w-full h-full drop-shadow-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-xl leading-none mb-1 tracking-tight uppercase">Roleta da Localizei Freguesia</h3>
                  <p className="text-xs text-blue-100/80 font-bold italic opacity-90">Tente a sorte e ganhe agora!</p>
                </div>
              </div>
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
                 <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </button>
          </div>
        );

      case 'achados_semana':
        return (
          <div key="achados_semana" className="px-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-500" />
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Achados da Semana</h3>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/30">
                <Timer className="w-3.5 h-3.5" />
                <span>Oferta da semana</span>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
              {[
                { id: 1, title: 'Barca de Sushi (30 pçs)', store: 'Sushi House', oldPrice: 89.90, newPrice: 59.90, discount: '-33%', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop' },
                { id: 2, title: 'Limpeza de Pele Prof.', store: 'Clínica BioEstética', oldPrice: 180.00, newPrice: 119.00, discount: '-34%', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop' },
                { id: 3, title: 'Combo Smash Double', store: 'Burger Freguesia', oldPrice: 42.00, newPrice: 28.00, discount: '-33%', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' }
              ].map((item) => (
                <div key={item.id} className="min-w-[240px] bg-white dark:bg-gray-800 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden group active:scale-[0.98] transition-transform">
                  <div className="h-32 relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                      {item.discount}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.store}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-400 line-through text-[11px] font-medium">R$ {item.oldPrice.toFixed(2)}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-black text-base">R$ {item.newPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cashback':
        return (
          <div key="cashback" className="px-4">
            <UserCashbackBanner 
              role={userRole || 'cliente'}
              balance={user ? 12.40 : 0} 
              totalGenerated={user ? 320.00 : 0}
              onClick={() => {
                if (!user) return onRequireLogin();
                userRole === 'lojista' ? onNavigate('merchant_cashback_dashboard') : onNavigate('user_statement');
              }} 
            />
          </div>
        );

      case 'community':
        return (
          <div key="community" className="px-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="p-1 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500"/>
                </div>
                <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em]">Amados pela Vizinhança</h3>
            </div>
            <RecomendadosPorMoradores items={[
              { id: '1', nome: 'Padaria Imperial', categoria: 'Comida', texto: 'Melhor pão na chapa que já comi, o atendimento é impecável sempre!', totalRecomendacoes: 42 }
            ]} />
          </div>
        );

      case 'list':
        return (
          <div key="list" className="px-4 min-h-[400px]">
              <div className="flex items-center justify-between mb-5 px-1">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Guia de Lojas</h3>
                 </div>
                 <div className="flex gap-2">
                    {['all', 'cashback', 'top_rated'].map((f) => (
                        <button 
                            key={f} 
                            onClick={() => setListFilter(f as any)}
                            className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
                        >
                            {f === 'all' ? 'Tudo' : f === 'cashback' ? 'Cashback' : 'Top'}
                        </button>
                    ))}
                 </div>
              </div>
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );

      default: return null;
    }
  };

  const homeStructure = useMemo(() => {
    if (user) {
      return ['cashback', 'categories', 'hero', 'roulette', 'achados_semana', 'community', 'list'];
    }
    return ['categories', 'hero', 'roulette', 'achados_semana', 'community', 'list'];
  }, [user]);

  return (
    <div className="flex flex-col gap-10 pt-8 pb-32 bg-white dark:bg-gray-900 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
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

            <div className="mt-4 mb-4 flex flex-col items-center justify-center text-center opacity-30">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.5em]">Freguesia • Localizei v1.3.3</p>
            </div>
        </div>
      )}

      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300" onClick={() => setIsSpinWheelOpen(false)}>
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
