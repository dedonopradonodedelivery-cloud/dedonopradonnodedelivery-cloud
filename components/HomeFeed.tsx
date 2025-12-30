
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
  Coffee,
  ShoppingBag,
  Moon,
  Utensils,
  ShieldCheck,
  Handshake,
  MapPin,
  ArrowUpRight,
  Wrench,
  Bike,
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
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [categoryScrollProgress, setCategoryScrollProgress] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const activeSearchTerm = externalSearchTerm || '';
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');

  const handleCategoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollWidth > container.clientWidth) {
      setCategoryScrollProgress(container.scrollLeft / (container.scrollWidth - container.clientWidth));
    }
  };

  const banners = useMemo(() => [
    {
      id: 'cashback_neighborhood',
      badge: 'OFERTA DO BAIRRO',
      title: 'O cashback que vale no bairro inteiro.',
      subtitle: 'Você compra em uma, ganha e usa em outra. Dinheiro girando na vizinhança.',
      gradient: 'from-[#14532d] to-[#064e3b]',
      cta: 'Ver como funciona',
      action: () => onNavigate('cashback_info'),
      ctaClass: 'bg-white text-emerald-900 shadow-lg'
    },
    {
      id: 'freguesia_connect',
      badge: 'EXCLUSIVO LOJISTAS',
      title: 'Freguesia Connect',
      subtitle: 'Networking real entre os lojistas do bairro. Conexões que geram lucro.',
      gradient: 'from-[#1e1b4b] to-[#312e81]',
      cta: 'Saiba mais',
      action: () => onNavigate('freguesia_connect_public'),
      ctaClass: 'bg-white text-[#1e1b4b] shadow-lg'
    }
  ], [onNavigate]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="pt-6">
            <div 
              ref={categoriesRef} 
              onScroll={handleCategoryScroll}
              className="flex overflow-x-auto no-scrollbar px-5 pb-4"
            >
              <div className="grid grid-flow-col grid-rows-2 gap-x-4 gap-y-4">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat)}
                    className="flex flex-col items-center group active:scale-95 transition-all duration-200"
                  >
                    <div 
                      className={`w-[84px] h-[84px] rounded-[24px] shadow-lg flex flex-col items-center justify-between p-2.5 relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 bg-gradient-to-br ${cat.color} border border-white/20`}
                    >
                      {/* macOS Gloss Effect */}
                      <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                      <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-[24px] pointer-events-none"></div>
                      
                      {/* Icon */}
                      <div className="flex-1 flex items-center justify-center w-full mt-1">
                        <img 
                          src={cat.illustrationUrl} 
                          alt={cat.name} 
                          className="w-[32px] h-[32px] object-contain filter brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-110" 
                        />
                      </div>
                      
                      {/* Text Inside Card */}
                      <span className="w-full text-[10px] font-black text-white leading-none tracking-tight text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] pb-0.5">
                        {cat.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Scroll Indicator */}
            <div className="flex justify-center mt-1 opacity-20">
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
             {/* Simples Hero Section para manter o fluxo do app */}
             <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 text-white relative overflow-hidden border border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md border border-white/10 mb-3 inline-block">Localizei Freguesia</span>
                <h1 className="text-xl font-bold mb-1 leading-tight">O que você precisa hoje?</h1>
                <p className="text-xs text-gray-400 mb-5">Encontre os melhores do seu bairro.</p>
                <button onClick={() => onNavigate('explore')} className="bg-primary-500 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 active:scale-95 transition-all">
                    Explorar agora <ArrowRight className="w-4 h-4" />
                </button>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <MapPin className="w-32 h-32" />
                </div>
             </div>
          </div>
        );
      case 'cashback_banner':
        if (!user || !userRole) return null;
        return (
          <div key="cashback_banner" className="px-5 pt-2">
            <UserCashbackBanner 
              role={userRole}
              balance={12.40} 
              totalGenerated={320.00}
              onClick={() => userRole === 'lojista' ? onNavigate('merchant_cashback_dashboard') : onNavigate('user_statement')} 
            />
          </div>
        );
      case 'list':
        return (
          <div key="list" className="px-5 min-h-[300px]">
              <div className="flex items-center gap-2 mb-4 px-1">
                 <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Guia de Lojas</h3>
                 </div>
              </div>
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );
      default: return null;
    }
  };

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
            {renderSection('categories')}
            {renderSection('hero')}
            {renderSection('cashback_banner')}
            {renderSection('list')}
            <div className="px-5">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>
            <div className="mt-8 mb-4 flex flex-col items-center justify-center text-center opacity-40">
              <Star className="w-4 h-4 text-gray-400 mb-2" />
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.5em]">Freguesia • Localizei v1.1.0</p>
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
