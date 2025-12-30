
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
  Heart
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
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
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
          <div key="categories" className="pt-4">
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
          <div key="hero" className="px-4 mt-2">
             <div className="w-full bg-gradient-to-br from-indigo-900 to-blue-800 rounded-[28px] p-6 text-white relative overflow-hidden shadow-xl border border-white/10">
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                    <MapPin className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-white/10 px-2.5 py-1 rounded-full border border-white/10 mb-4 inline-block">Guia Oficial Freguesia</span>
                  <h1 className="text-2xl font-black mb-1 leading-tight tracking-tight">O melhor do bairro,<br/>na sua mão.</h1>
                  <p className="text-xs text-blue-100/80 mb-6 font-medium">Explore lojas, serviços e promoções agora.</p>
                  <button onClick={() => onNavigate('explore')} className="bg-white text-blue-900 text-xs font-black px-6 py-3 rounded-2xl flex items-center gap-2 active:scale-95 transition-all shadow-xl">
                      EXPLORAR GUIA <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
             </div>
          </div>
        );

      case 'roulette':
        return (
          <div key="roulette" className="px-4">
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-gradient-to-br from-primary-600 to-blue-700 rounded-[28px] p-5 text-white flex items-center justify-between shadow-xl active:scale-[0.98] transition-all relative overflow-hidden group border border-white/10">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 flex items-center justify-center animate-spin-slow">
                  <RouletteIcon className="w-full h-full drop-shadow-2xl" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-100 opacity-70">Diversão do Dia</span>
                  <h3 className="font-black text-xl leading-none mb-1 tracking-tight">Roleta da Sorte</h3>
                  <p className="text-xs text-blue-100/80 font-medium">Ganhe prêmios e cashback agora!</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                 <ArrowRight className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </button>
          </div>
        );

      case 'cashback':
        if (!user || !userRole) return null;
        return (
          <div key="cashback" className="px-4">
            <UserCashbackBanner 
              role={userRole}
              balance={12.40} 
              totalGenerated={320.00}
              onClick={() => userRole === 'lojista' ? onNavigate('merchant_cashback_dashboard') : onNavigate('user_statement')} 
            />
          </div>
        );

      case 'highlights':
        return (
          <div key="highlights" className="px-4">
            <div className="flex items-center gap-2 mb-4 px-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Atividade Recente</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
              {[
                { id: 1, title: 'Novas Pizzarias', icon: <Zap className="text-amber-500" />, desc: '3 novos locais no bairro' },
                { id: 2, title: 'Dicas de Beleza', icon: <Heart className="text-rose-500" />, desc: 'Salões mais avaliados hoje' },
                { id: 3, title: 'Mercados 24h', icon: <Clock className="text-blue-500" />, desc: 'Abertos agora perto de você' }
              ].map((item) => (
                <div key={item.id} className="min-w-[200px] bg-white dark:bg-gray-800 p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'community':
        return (
          <div key="community" className="px-4">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400"/>
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Dicas de Moradores</h3>
                </div>
            </div>
            <RecomendadosPorMoradores items={[
              { id: '1', nome: 'Padaria Imperial', categoria: 'Comida', texto: 'Melhor pão na chapa!', totalRecomendacoes: 42 }
            ]} />
          </div>
        );

      case 'trending':
        return (
          <div key="trending" className="px-4">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-500"/>
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Coleções</h3>
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
              {EDITORIAL_COLLECTIONS.map((col) => (
                <div key={col.id} onClick={() => onSelectCollection(col)} className="min-w-[240px] h-32 rounded-[24px] bg-gray-900 relative overflow-hidden shadow-lg cursor-pointer active:scale-95 transition-all">
                  <img src={col.image} alt="" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">{col.title}</h4>
                    <p className="text-[10px] text-gray-300 font-medium">{col.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'filters':
        return (
          <div key="filters" className="px-4">
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
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-[11px] font-black transition-all active:scale-95 whitespace-nowrap uppercase tracking-wider
                    ${listFilter === btn.id 
                      ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-100 dark:border-gray-700'}`}
                >
                  <btn.icon className="w-3.5 h-3.5" />
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div key="list" className="px-4 min-h-[400px]">
              <div className="flex items-center gap-2 mb-4 px-1">
                 <ShieldCheck className="w-4 h-4 text-gray-400" />
                 <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Guia de Lojas</h3>
              </div>
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );

      default: return null;
    }
  };

  const HOME_STRUCTURE = [
    'categories',
    'hero',
    'roulette',
    'cashback',
    'highlights',
    'community',
    'trending',
    'filters',
    'list'
  ];

  return (
    <div className="flex flex-col gap-6 pb-32 bg-white dark:bg-gray-900 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      {activeSearchTerm ? (
        <div className="px-5 mt-4 min-h-[50vh]">
             <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">Resultados para "{activeSearchTerm}"</h3>
             <div className="flex flex-col gap-3">
                {stores.filter(s => s.name.toLowerCase().includes(activeSearchTerm.toLowerCase())).map((store) => (
                <div key={store.id} onClick={() => onStoreClick?.(store)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 p-1"><img src={store.logoUrl} className="w-full h-full object-contain" alt={store.name} /></div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{store.name}</h4>
                        <span className="text-[10px] text-[#1E5BFF] font-black uppercase">{store.category}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                </div>
                ))}
             </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
            {HOME_STRUCTURE.map(section => renderSection(section))}
            <div className="px-4">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>
            <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center opacity-40">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.5em]">Freguesia • Localizei v1.2.0</p>
            </div>
        </div>
      )}
      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end justify-center animate-in fade-in" onClick={() => setIsSpinWheelOpen(false)}>
          <div className="bg-transparent w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-5 z-50"><button onClick={() => setIsSpinWheelOpen(false)} className="p-2.5 text-gray-200 hover:text-white bg-white/10 backdrop-blur-md rounded-full active:scale-90 transition-transform"><X className="w-5 h-5" /></button></div>
            <div className="animate-in slide-in-from-bottom duration-500">
                <SpinWheelView userId={user?.id || null} userRole={userRole || null} onWin={onSpinWin} onRequireLogin={onRequireLogin} onViewHistory={() => { setIsSpinWheelOpen(false); onNavigate('prize_history'); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
