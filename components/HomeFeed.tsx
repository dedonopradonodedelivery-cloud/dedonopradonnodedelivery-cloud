
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
  ShoppingBag,
  Coins,
  Users,
  Crown
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

// --- CONFIGURAÇÃO DO CARROSSEL EDUCACIONAL ---
const AD_DURATION = 3000; 

const EDUCATIONAL_BANNERS = [
  {
    id: 'cashback',
    title: 'Cashback Localizei',
    subtitle: 'Ganhe parte do seu dinheiro de volta comprando no bairro.',
    cta: 'Entender',
    icon: <Coins className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-900 via-emerald-800 to-teal-900',
    image: 'https://images.unsplash.com/photo-1556742049-139422cb096c?q=80&w=600'
  },
  {
    id: 'services',
    title: 'Serviços & Reparos',
    subtitle: 'De eletricistas a diaristas. Encontre profissionais qualificados.',
    cta: 'Explorar',
    icon: <Wrench className="w-6 h-6 text-blue-400" />,
    gradient: 'from-blue-900 via-indigo-800 to-blue-900',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600'
  },
  {
    id: 'connect',
    title: 'Freguesia Connect',
    subtitle: 'A maior rede de networking e negócios da nossa região.',
    cta: 'Ver mais',
    icon: <Users className="w-6 h-6 text-indigo-400" />,
    gradient: 'from-indigo-900 via-purple-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600'
  },
  {
    id: 'premium_ads',
    title: 'Destaque Premium',
    subtitle: 'Conheça os estabelecimentos que estão bombando hoje.',
    cta: 'Ver loja',
    isSponsored: true,
    icon: <Crown className="w-6 h-6 text-amber-400" />,
    gradient: 'from-slate-900 via-slate-800 to-slate-950',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600'
  }
];

const EducationalCarousel: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / AD_DURATION) * 100;
      
      if (newProgress >= 100) {
        setCurrentIndex((prev) => (prev + 1) % EDUCATIONAL_BANNERS.length);
        setProgress(0);
        clearInterval(interval);
      } else {
        setProgress(newProgress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const currentBanner = EDUCATIONAL_BANNERS[currentIndex];

  return (
    <div className="px-4 mb-2">
      <div className="w-full relative aspect-[21/10] rounded-[32px] overflow-hidden shadow-xl shadow-blue-900/10 border border-gray-100 dark:border-gray-800 animate-in fade-in duration-500">
        
        {/* Background Image com Fade Transition */}
        <div className="absolute inset-0 bg-slate-900">
          <img 
            key={currentBanner.image}
            src={currentBanner.image} 
            className="w-full h-full object-cover opacity-60 animate-in fade-in duration-700"
            alt={currentBanner.title}
          />
        </div>

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentBanner.gradient} opacity-40 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        {/* INDICADOR DE PROGRESSO SEGMENTADO (Estilo Stories) */}
        <div className="absolute top-4 left-6 right-6 flex gap-2 z-30">
          {EDUCATIONAL_BANNERS.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-100 ease-linear ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
              {idx < currentIndex && <div className="absolute inset-0 bg-white opacity-40" />}
            </div>
          ))}
        </div>

        {/* Selo Tipo de Conteúdo */}
        <div className="absolute top-8 right-6 z-20 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
          {currentBanner.isSponsored ? (
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Patrocinado</span>
          ) : (
            <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Dica Localizei</span>
          )}
        </div>

        {/* Conteúdo do Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end z-20">
          <div className="flex-1 pr-4 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                {currentBanner.icon}
              </div>
              <h3 className="text-xl font-black text-white leading-tight font-display tracking-tight">
                {currentBanner.title}
              </h3>
            </div>
            <p className="text-[11px] text-gray-300 font-medium line-clamp-2 max-w-[280px]">
              {currentBanner.subtitle}
            </p>
          </div>
          
          <button 
            onClick={() => onNavigate(currentBanner.id === 'services' ? 'services' : currentBanner.id === 'cashback' ? 'user_statement' : 'explore')}
            className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl active:scale-[0.95] transition-all hover:bg-primary-500 hover:text-white"
          >
            {currentBanner.cta} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Swipe zones (Invisible) */}
        <div 
          className="absolute inset-y-0 left-0 w-1/4 z-40 cursor-pointer" 
          onClick={() => {
            setCurrentIndex(prev => prev === 0 ? EDUCATIONAL_BANNERS.length - 1 : prev - 1);
            setProgress(0);
          }}
        />
        <div 
          className="absolute inset-y-0 right-0 w-1/4 z-40 cursor-pointer" 
          onClick={() => {
            setCurrentIndex(prev => (prev + 1) % EDUCATIONAL_BANNERS.length);
            setProgress(0);
          }}
        />
      </div>
    </div>
  );
};

// --- POOL DE PROMOÇÕES RESERVA (SUBSTITUIÇÃO AUTOMÁTICA) ---
const FALLBACK_PROMO_POOL = [
  { id: 'f-p1', store: 'Parrilla Freguesia', product: 'Churrasco Misto (2 pessoas)', old: '120,00', new: '84,00', off: '30', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop' },
  { id: 'f-p2', store: 'Doceria da Vila', product: 'Combo 6 Cupcakes Gourmet', old: '48,00', new: '33,60', off: '30', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=600&auto=format&fit=crop' },
  { id: 'f-p3', store: 'Studio Clean', product: 'Limpeza Facial Profunda', old: '150,00', new: '105,00', off: '30', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop' },
  { id: 'f-p4', store: 'Pet Style', product: 'Banho + Tosa Higiênica', old: '80,00', new: '60,00', off: '25', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop' },
  { id: 'f-p5', store: 'Massa Nostra', product: 'Lasanha Bolonhesa GG', old: '65,00', new: '45,50', off: '30', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop' }
];

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
      case 'onboarding':
        return <EducationalCarousel key="onboarding" onNavigate={onNavigate} />;

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
              {(() => {
                const rawPromos = [
                  { id: 'p1', store: 'Açougue Bom Corte', product: 'Picanha Premium KG', old: '89,90', new: '62,93', off: '30', image: 'https://images.unsplash.com/photo-1544022613-e879a7998d0f?q=80&w=600&auto=format&fit=crop' },
                  { id: 'p2', store: 'Imperial Bakery', product: 'Pão Italiano Artesanal', old: '18,00', new: '12,60', off: '30', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop' },
                  { id: 'p3', store: 'Beleza & Arte', product: 'Manicure + Pedicure', old: '60,00', new: '42,00', off: '30', image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?q=80&w=600&auto=format&fit=crop' },
                  { id: 'p5', store: 'Drogaria Freguesia', product: 'Vitamina C (2 Tubos)', old: '45,00', new: '31,50', off: '30', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop' }
                ];

                const filteredPromos = rawPromos.filter(p => p.image && p.image.trim() !== '');

                const finalPromos = filteredPromos.length < 5 
                  ? [...filteredPromos, ...FALLBACK_PROMO_POOL.slice(0, 5 - filteredPromos.length)]
                  : filteredPromos;

                return finalPromos.map((promo) => (
                  <div key={promo.id} className="min-w-[240px] snap-center bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-1 transition-all hover:shadow-md">
                    <div className="h-44 relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <img src={promo.image} className="w-full h-full object-cover animate-in fade-in duration-700" alt={promo.product} />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-600 to-pink-500 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(225,29,72,0.6)] animate-badge-pop">
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
                ));
              })()}
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
                { id: 'on-1', name: 'Padaria Central', category: 'Padaria', status: '🔥 Bombando hoje', microcopy: 'Vizinhança tomando café agora', icon: <Flame className="w-3 h-3 text-white" />, color: 'bg-gradient-to-r from-orange-600 to-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]', anim: 'animate-badge-shake' },
                { id: 'on-2', name: 'Hambúrguer do Zé', category: 'Lanches', status: '📈 Em alta agora', microcopy: 'Pico de pedidos detectado', icon: <TrendingUp className="w-3 h-3 text-white" />, color: 'bg-gradient-to-r from-emerald-600 to-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]', anim: 'animate-badge-float-up' },
                { id: 'on-3', name: 'Café da Praça', category: 'Cafeteria', status: '🚀 Tendência do dia', microcopy: 'Muitos vizinhos visitando', icon: <Rocket className="w-3 h-3 text-white" />, color: 'bg-gradient-to-r from-blue-600 to-blue-500', glow: 'shadow-[0_0_15px_rgba(30,91,255,0.5)]', anim: 'animate-badge-glow' },
                { id: 'on-4', name: 'Pet Shop Amigo', category: 'Pets', status: '👀 Movimento intenso', microcopy: 'Vizinhança ativa aqui', icon: <Eye className="w-3 h-3 text-white" />, color: 'bg-gradient-to-r from-purple-600 to-purple-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]', anim: 'animate-badge-pop' }
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
                  
                  <div className={`p-2.5 rounded-2xl ${item.color} ${item.glow} flex flex-col gap-1 overflow-hidden`}>
                    <div className={`flex items-center gap-1.5 ${item.anim}`}>
                      {item.icon}
                      <span className="text-[10px] font-black uppercase text-white tracking-tight">{item.status}</span>
                    </div>
                    <p className="text-[9px] font-bold text-white/80 leading-none">{item.microcopy}</p>
                  </div>
                </div>
              ))}
            </div>
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
    // Carrossel Onboarding é agora o primeiro elemento fixo após o cabeçalho.
    // Removido o banner de cashback isolado conforme solicitado.
    return ['onboarding', 'categories', 'hero', 'promo_semana', 'roulette', 'bairro_on', 'community', 'list'];
  }, []);

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
