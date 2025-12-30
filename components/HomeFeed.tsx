
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
  Timer,
  Activity,
  Eye,
  Rocket,
  Store as StoreIcon,
  ShoppingBag
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

/**
 * Componente de Título Padronizado conforme Design System
 */
const SectionHeader: React.FC<{ icon: React.ElementType; title: string; rightElement?: React.ReactNode }> = ({ icon: Icon, title, rightElement }) => (
  <div className="flex items-center justify-between mb-6 px-1">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" strokeWidth={2} />
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 tracking-tight leading-none">
        {title}
      </h3>
    </div>
    {rightElement}
  </div>
);

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
                          className: "w-7 h-7 text-white drop-shadow-[0_2px_4_rgba(0,0,0,0.3)]",
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

      case 'promo_semana':
        return (
          <div key="promo_semana" className="px-4">
            <SectionHeader 
              icon={Tag} 
              title="Promoção da Semana" 
              rightElement={<p className="text-[10px] font-bold text-gray-400 uppercase">20% OFF+</p>}
            />
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 snap-x">
              {[
                { id: 'p1', store: 'Açougue Bom Corte', product: 'Picanha Premium KG', old: '89,90', new: '62,93', off: '30', image: 'https://images.unsplash.com/photo-1544022613-e879a7998d0f?q=80&w=600&auto=format&fit=crop' },
                { id: 'p2', store: 'Imperial Bakery', product: 'Pão Italiano Artesanal', old: '18,00', new: '12,60', off: '30', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop' },
                { id: 'p3', store: 'Beleza & Arte', product: 'Manicure + Pedicure', old: '60,00', new: '42,00', off: '30', image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?q=80&w=600&auto=format&fit=crop' },
                { id: 'p4', store: 'Pet Mundo', product: 'Ração Golden 15kg', old: '189,00', new: '151,20', off: '20', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=600&auto=format&fit=crop' },
                { id: 'p5', store: 'Drogaria Freguesia', product: 'Vitamina C (2 Tubos)', old: '45,00', new: '31,50', off: '30', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop' }
              ].map((promo) => (
                <div key={promo.id} className="min-w-[240px] snap-center bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                  <div className="h-44 relative overflow-hidden">
                    <img src={promo.image} className="w-full h-full object-cover" alt={promo.product} />
                    {/* Badge Animado: animate-badge-pop */}
                    <div className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(225,29,72,0.4)] animate-badge-pop">
                      -{promo.off}% OFF
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md text-gray-900 text-[9px] font-black px-2.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-sm">
                      <Timer className="w-3.5 h-3.5 text-rose-500" />
                      7 DIAS
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h4 className="font-bold text-gray-900 dark:text-white text-[14px] leading-tight line-clamp-1 mb-0.5">{promo.product}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{promo.store}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 line-through font-bold leading-none mb-1">R$ {promo.old}</p>
                        <p className="text-lg font-black text-[#1E5BFF] leading-none">R$ {promo.new}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'roulette':
        return (
          <div key="roulette" className="px-4">
            <SectionHeader icon={Dices} title="Diversão do Dia" />
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

      case 'bairro_on':
        return (
          <div key="bairro_on" className="px-4">
            <SectionHeader 
              icon={Flame} 
              title="O Bairro Tá On" 
              rightElement={<p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Bombando agora</p>}
            />
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
              {[
                { id: 'on-1', name: 'Padaria Central', category: 'Padaria', status: '🔥 Bombando hoje', microcopy: 'Vizinhança tomando café agora', icon: <Flame className="w-3 h-3 text-orange-500" />, color: 'bg-orange-50 dark:bg-orange-900/10', anim: 'animate-badge-shake' },
                { id: 'on-2', name: 'Hambúrguer do Zé', category: 'Lanches', status: '📈 Em alta agora', microcopy: 'Pico de pedidos detectado', icon: <TrendingUp className="w-3 h-3 text-emerald-500" />, color: 'bg-emerald-50 dark:bg-emerald-900/10', anim: 'animate-badge-float-up' },
                { id: 'on-3', name: 'Café da Praça', category: 'Cafeteria', status: '🚀 Tendência do dia', microcopy: 'Muitos vizinhos visitando', icon: <Rocket className="w-3 h-3 text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/10', anim: 'animate-badge-glow' },
                { id: 'on-4', name: 'Pet Shop Amigo', category: 'Pets', status: '👀 Movimento intenso', microcopy: 'Vizinhança ativa aqui', icon: <Eye className="w-3 h-3 text-purple-500" />, color: 'bg-purple-50 dark:bg-purple-900/10', anim: 'animate-badge-pop' }
              ].map((item) => (
                <div key={item.id} className="min-w-[190px] bg-white dark:bg-gray-800 rounded-[24px] p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3 group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <StoreIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className={`p-2.5 rounded-2xl ${item.color} flex flex-col gap-1`}>
                    <div className={`flex items-center gap-1.5 ${item.anim}`}>
                      {item.icon}
                      <span className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-100 tracking-tight">{item.status}</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-none">{item.microcopy}</p>
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
            <SectionHeader icon={Heart} title="Amados pela Vizinhança" />
            <RecomendadosPorMoradores items={[
              { id: 'f1', nome: 'Padaria da Vila', categoria: 'Comida', texto: 'O melhor pãozinho da região! Atendimento nota 10 sempre.', totalRecomendacoes: 124 },
              { id: 'f2', nome: 'Cantinho do Sabor', categoria: 'Restaurante', texto: 'Comida caseira de verdade. O tempero da dona Maria é imbatível!', totalRecomendacoes: 89 },
              { id: 'f3', nome: 'Pet & Cia', categoria: 'Pets', texto: 'Cuidam muito bem dos nossos bichinhos. Confiança total no banho e tosa.', totalRecomendacoes: 56 },
              { id: 'f4', nome: 'Mercado Popular', categoria: 'Mercado', texto: 'Preço justo e sempre tem tudo fresquinho. Adoro os hortifruti.', totalRecomendacoes: 210 },
              { id: 'f5', nome: 'Café do Bairro', categoria: 'Cafeteria', texto: 'Lugar aconchegante para trabalhar e tomar um espresso perfeito.', totalRecomendacoes: 45 },
              { id: 'f6', nome: 'Floricultura Primavera', categoria: 'Casa', texto: 'Sempre flores frescas e lindas. Montam arranjos maravilhosos.', totalRecomendacoes: 32 },
              { id: 'f7', nome: 'Lanchonete Dois Irmãos', categoria: 'Lanches', texto: 'O melhor hambúrguer do bairro. Rápido e delicioso!', totalRecomendacoes: 167 },
              { id: 'f8', nome: 'Mecânica do Seu João', categoria: 'Serviços', texto: 'Confiança total, nunca me deixou na mão. Preço honesto sempre.', totalRecomendacoes: 78 },
              { id: 'f9', nome: 'Salão Espaço Vip', categoria: 'Beleza', texto: 'As melhores manicures da Freguesia. Ambiente muito agradável.', totalRecomendacoes: 92 }
            ]} />
          </div>
        );

      case 'list':
        return (
          <div key="list" className="px-4 min-h-[400px]">
              <SectionHeader 
                icon={ShoppingBag} 
                title="Guia de Lojas" 
                rightElement={
                  <div className="flex gap-1.5">
                    {['all', 'cashback', 'top_rated'].map((f) => (
                        <button 
                            key={f} 
                            onClick={() => setListFilter(f as any)}
                            className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md transition-all ${listFilter === f ? 'bg-[#1E5BFF] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                        >
                            {f === 'all' ? 'Tudo' : f === 'cashback' ? 'Cash' : 'Top'}
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
    const base = ['categories', 'hero', 'promo_semana', 'roulette', 'bairro_on', 'community', 'list'];
    if (user) {
      return ['cashback', ...base];
    }
    return base;
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
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.5em]">Freguesia • Localizei v1.3.4</p>
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
                    /* Fix: Changed onWin to onSpinWin to match component props */
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
