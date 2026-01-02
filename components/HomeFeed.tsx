
import React, { useState, useEffect, useMemo } from 'react';
import { Store, Category, EditorialCollection } from '../types';
import { 
  ChevronRight, 
  Star,
  X,
  Dices,
  ArrowUpRight,
  Heart,
  Wallet,
  Leaf,
  Coffee,
  Baby,
  Dog as DogIcon,
  Sparkles,
  Beer,
  HeartHandshake,
  ShoppingBag,
  Zap
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
  { id: 't-work', name: 'Home Office', subtitle: 'Wi-Fi e silêncio', icon: Coffee, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 't-pet', name: 'Amigo do Pet', subtitle: 'Eles são bem-vindos', icon: DogIcon, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 't-kids', name: 'Espaço Kids', subtitle: 'Lazer pros pequenos', icon: Baby, color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 't-health', name: 'Vibe Saúde', subtitle: 'Foco no bem-estar', icon: Leaf, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 't-happy', name: 'Happy Hour', subtitle: 'Chopp e petiscos', icon: Beer, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { id: 't-local', name: 'Feito Aqui', subtitle: 'Orgulho do bairro', icon: HeartHandshake, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: 't-love', name: 'Jantar a Dois', subtitle: 'Clima romântico', icon: Heart, color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { id: 't-run', name: 'Na Correria', subtitle: 'Rápido e prático', icon: Zap, color: 'bg-amber-50 text-amber-700 border-amber-100' }
];

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const banners = [
    {
      id: 'b1',
      title: 'Ganhe Cashback Real',
      subtitle: 'Compre no bairro e receba parte do seu dinheiro de volta na carteira.',
      cta: 'Ver Lojas',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
      target: 'explore'
    },
    {
      id: 'b2',
      title: 'Destaques da Semana',
      subtitle: 'Os lugares que estão bombando na Freguesia agora.',
      cta: 'Explorar',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
      target: 'explore'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % banners.length);
          return 0;
        }
        return prev + 0.5;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [banners.length]);

  const current = banners[currentIndex];

  return (
    <div className="px-4">
      <div 
        onClick={() => onNavigate(current.target)}
        className="w-full relative aspect-[21/10] rounded-[32px] overflow-hidden shadow-xl border border-gray-100 dark:border-white/5 bg-slate-900 cursor-pointer active:scale-[0.98] transition-all"
      >
        <img 
          key={current.image}
          src={current.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 animate-in fade-in duration-700"
          alt={current.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        
        <div className="absolute top-4 left-6 right-6 flex gap-2 z-30">
          {banners.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 flex justify-between items-end z-20">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-black text-white leading-tight font-display tracking-tight mb-1">
              {current.title}
            </h3>
            <p className="text-[11px] text-gray-300 font-medium line-clamp-1">
              {current.subtitle}
            </p>
          </div>
          <button className="bg-white text-slate-950 h-10 px-5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shrink-0">
            {current.cta} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; subtitle?: string; rightElement?: React.ReactNode }> = ({ icon: Icon, title, subtitle, rightElement }) => (
  <div className="flex items-center justify-between mb-5 px-1">
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
           <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
      </div>
      {subtitle && <p className="text-[11px] text-gray-400 font-medium ml-9 leading-tight pr-4">{subtitle}</p>}
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
    { id: 'rec-3', nome: 'Espaço Beleza VIP', categoria: 'Salão', texto: 'A Cris é a melhor cabeleireira da região, super indico!', totalRecomendacoes: 76 },
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="w-full pt-2">
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
        return <HomeCarousel key="home_carousel" onNavigate={onNavigate} />;

      case 'cashback_stores':
        return (
          <div key="cashback_stores" className="w-full bg-gray-50/50 dark:bg-gray-900/30 py-8">
            <div className="px-4">
              <SectionHeader icon={Wallet} title="Economize no Bairro" subtitle="Lojas que devolvem parte do dinheiro na sua carteira." />
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2 snap-x">
              {stores.filter(s => s.cashback && s.cashback > 0).slice(0, 6).map((store) => (
                <div key={store.id} onClick={() => onStoreClick?.(store)} className="min-w-[140px] bg-white dark:bg-gray-800 rounded-[2.2rem] p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center snap-center active:scale-95 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 p-2 mb-3 relative border border-gray-100 dark:border-gray-800">
                    <img src={store.logoUrl} className="w-full h-full object-contain" alt={store.name} />
                    <div className="absolute -top-2 -right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-lg">{store.cashback}%</div>
                  </div>
                  <h4 className="font-bold text-[11px] text-gray-800 dark:text-white truncate w-full mb-1">{store.name}</h4>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Star className="w-2.5 h-2.5 fill-current text-yellow-500" />
                    <span className="text-[10px] font-bold">{store.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'roulette':
        return (
          <div key="roulette" className="px-4">
            <button onClick={() => setIsSpinWheelOpen(true)} className="w-full bg-slate-950 rounded-[2.5rem] p-6 text-white flex items-center justify-between shadow-2xl active:scale-[0.98] transition-all border border-white/5">
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                    <Dices className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-lg leading-tight tracking-tight uppercase">Sorte do Dia</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Tente ganhar saldo agora</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" strokeWidth={3} />
            </button>
          </div>
        );

      case 'recommended':
        return (
          <div key="recommended" className="px-4">
            <SectionHeader icon={Heart} title="Indicações dos Vizinhos" subtitle="O que o pessoal da Freguesia indica por experiência real." />
            <RecomendadosPorMoradores items={communityRecommendations} />
          </div>
        );

      case 'list':
        return (
          <div key="list" className="px-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <SectionHeader 
                icon={ShoppingBag} 
                title="Explorar o Bairro" 
                rightElement={
                  <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
                    {['all', 'cashback', 'top_rated'].map((f) => (
                        <button key={f} onClick={() => setListFilter(f as any)} className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>
                            {f === 'all' ? 'Ver Tudo' : f === 'cashback' ? 'Cashback' : 'Top'}
                        </button>
                    ))}
                  </div>
                }
              />
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );

      case 'mini_tribes':
        return (
          <div key="mini_tribes" className="w-full bg-gray-50 dark:bg-gray-900/50 py-12">
            <div className="px-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#1E5BFF] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">Editorial</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Curadoria Localizei</p>
              </div>
              <SectionHeader icon={Sparkles} title="Sua Tribo na Freguesia" subtitle="Descubra lugares selecionados pelo estilo e vibe que entregam." />
            </div>
            <div className="grid grid-cols-2 gap-3 px-4">
              {MINI_TRIBOS.map((tribo) => (
                <button key={tribo.id} className={`flex items-center gap-3 p-4 rounded-3xl border text-left active:scale-[0.97] transition-all ${tribo.color}`}>
                  <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                    <tribo.icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[11px] truncate leading-tight uppercase tracking-tight">{tribo.name}</h4>
                    <p className="text-[9px] opacity-70 font-medium leading-tight mt-0.5">{tribo.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  // UX ENGINEER: Nova ordem otimizada para hierarquia e retenção
  const homeStructure = useMemo(() => {
    return [
      'categories',      // 1. Entrada rápida
      'home_carousel',   // 2. Impacto visual
      'cashback_stores', // 3. Valor imediato
      'roulette',        // 4. Gamificação
      'recommended',     // 5. Confiança/Social
      'list',            // 6. Discovery vertical
      'mini_tribes'      // 7. Lifestyle/Filtro final
    ];
  }, []);

  return (
    <div className="flex flex-col gap-14 pt-6 pb-32 bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      {!activeSearchTerm ? (
        <div className="flex flex-col gap-14 w-full">
            {homeStructure.map(section => renderSection(section))}
            <div className="px-4">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>
        </div>
      ) : (
        <div className="px-4 mt-4 min-h-[50vh]">
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
