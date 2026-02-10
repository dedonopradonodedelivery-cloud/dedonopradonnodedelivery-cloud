
import React, { useState, useMemo } from 'react';
import { Store, Category } from '@/types';
import { 
  Compass, 
  ChevronRight,
  Clock,
  Zap,
  Tag,
  Package,
  Calendar,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import { LojasEServicosList } from '@/components/LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { useFeatures } from '@/contexts/FeatureContext';
import { HomeBannerCarousel } from '@/components/HomeBannerCarousel';

const HAPPENING_NOW_MOCK = [
  {
    id: 'hn-1',
    type: 'promotion',
    title: 'Rodízio de Pizza 25% OFF',
    subtitle: 'Pizzaria do Zé',
    timeRemaining: 'Até as 23h',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop',
    color: 'from-orange-600 to-red-700'
  },
  {
    id: 'hn-2',
    type: 'event',
    title: 'Feira Gastronômica Regional',
    subtitle: 'Praça da Freguesia',
    timeRemaining: 'Termina em 1h',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=200&auto=format&fit=crop',
    color: 'from-blue-600 to-indigo-700'
  }
];

const COUPONS_MOCK = [
  { id: 'cp-1', storeName: 'Bibi Lanches', logo: 'https://ui-avatars.com/api/?name=Bibi+Lanches&background=FF6B00&color=fff', discount: '15% OFF' },
  { id: 'cp-2', storeName: 'Studio Hair Vip', logo: 'https://ui-avatars.com/api/?name=Studio+Hair&background=BC1F66&color=fff', discount: 'R$ 20,00' },
  { id: 'cp-3', storeName: 'Pizzaria do Zé', logo: 'https://ui-avatars.com/api/?name=Pizzaria+Ze&background=22C55E&color=fff', discount: 'Entrega Grátis' }
];

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle: string; onSeeMore?: () => void }> = ({ icon: Icon, title, subtitle, onSeeMore }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white shadow-sm">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.15em] leading-none mb-1">{title}</h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{subtitle}</p>
      </div>
    </div>
    <button onClick={onSeeMore} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver todos</button>
  </div>
);

interface HomeFeedProps {
  onNavigate: (view: string, data?: any) => void;
  onSelectCategory: (category: Category) => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  user: User | null;
  userRole: 'cliente' | 'lojista' | null;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onStoreClick, 
  user, 
}) => {
  const { isFeatureActive } = useFeatures();

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      
      {/* CONTEÚDO PRINCIPAL (COM MARGEM PARA O HEADER) */}
      <div className="flex flex-col bg-white dark:bg-gray-950 relative z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] pt-8 -mt-4">
        
        {/* CARROSSEL UNIFICADO */}
        {isFeatureActive('banner_highlights') && (
            <section className="bg-transparent w-full">
               <HomeBannerCarousel onStoreClick={onStoreClick} onNavigate={onNavigate} />
            </section>
        )}

        {/* CUPONS */}
        <section className="py-2">
            <div className="flex items-center justify-between mb-1 px-5">
                <div>
                    <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Cupons</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Para você economizar</p>
                </div>
                <button onClick={() => onNavigate('coupon_landing')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline active:opacity-60">Ver todos</button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x px-5 pt-8 pb-4">
                {COUPONS_MOCK.map((coupon) => (
                    <div key={coupon.id} onClick={() => onNavigate('coupon_landing')} className="relative flex-shrink-0 w-36 snap-center cursor-pointer group">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 p-0.5 shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <img src={coupon.logo} alt="" className="w-full h-full rounded-full object-cover" />
                            </div>
                        </div>

                        <div className="w-full h-40 bg-[#1E5BFF] dark:bg-blue-800 rounded-2xl flex flex-col items-center justify-between pt-7 pb-3 px-3 relative overflow-hidden active:scale-95 transition-transform">
                            <div className="absolute top-[108px] -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-white dark:bg-gray-950 z-10"></div>
                            <div className="absolute top-[108px] -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-white dark:bg-gray-950 z-10"></div>
                            <div className="absolute top-[108px] -translate-y-1/2 left-4 right-4 border-t-2 border-dashed border-white/20 z-0"></div>

                            <div className="flex flex-col items-center justify-start h-1/2 w-full text-center z-10 pt-4">
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Cupom</span>
                                <span className="text-xl font-black text-white leading-none tracking-tight">
                                    {coupon.discount}
                                </span>
                            </div>

                            <div className="w-full z-10">
                                <button className="w-full bg-white text-[#1E5BFF] text-[9px] font-black uppercase py-2.5 rounded-xl rounded-tl-none shadow-sm flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] border-r border-dashed border-blue-500/20"></div>
                                    Pegar cupom
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* ACONTECENDO AGORA */}
        <section className="px-5 pt-4 pb-4 bg-transparent border-b border-gray-50 dark:border-gray-900">
            <div className="flex items-center justify-between mb-3 px-1">
                <div>
                    <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">Acontecendo Agora <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span></h2>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Tempo real no bairro</p>
                </div>
            </div>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x">
                {HAPPENING_NOW_MOCK.map((item) => (
                    <div key={item.id} className="snap-center flex-shrink-0 w-44 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-2.5 flex gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md w-fit ${item.type === 'promotion' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>{item.type}</span>
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight mt-1">{item.title}</h3>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* EXPLORAR BAIRRO */}
        {isFeatureActive('explore_guide') && (
            <div className="w-full bg-transparent pt-6 pb-12">
                <div className="px-5">
                    <SectionHeader icon={Compass} title="Explorar Bairro" subtitle="O que você precisa" onSeeMore={() => onNavigate('explore')} />
                    <div className="mt-4">
                        <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter="all" user={user} onNavigate={onNavigate} premiumOnly={false} />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
