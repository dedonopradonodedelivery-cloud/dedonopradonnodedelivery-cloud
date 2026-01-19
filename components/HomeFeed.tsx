
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
  Compass,
  FileText,
  Shield,
  Rocket
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
  onRequireLogin: () => void;
}

interface BannerItem {
  id: string;
  title: string;
  target: string;
  tag?: string;
  bgColor: string;
  Icon: React.ElementType;
  isSpecial?: boolean;
}

// --- COMPONENTE INDEPENDENTE: HOME CAROUSEL ---

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void; onStoreClick?: (store: Store) => void; stores?: Store[] }> = ({ onNavigate, onStoreClick, stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const banners: BannerItem[] = useMemo(() => [
    { id: 'rio-phone-store', title: 'RIO PHONE STORE', target: 'rio-phone-store', tag: 'Assistência Apple', bgColor: 'bg-[#020617]', Icon: Smartphone, isSpecial: true },
    { id: 'master-sponsor', title: 'Grupo Esquematiza', target: 'patrocinador_master', tag: 'Patrocinador Master', bgColor: 'bg-slate-900', Icon: Crown },
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
        {current.id === 'rio-phone-store' ? (
          <div className="absolute inset-0">
            {/* Imagem de Fundo Integrada (Aproveita 100% da área) */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop" 
                alt="RIO PHONE STORE" 
                className="w-full h-full object-cover object-right brightness-110 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {/* Overlay de fusão para garantir leitura e remover aspecto de recorte */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/85 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(30,91,255,0.1),transparent_70%)] z-10"></div>
            </div>

            {/* Conteúdo (Textos permanecem nos lugares originais) */}
            <div className="z-20 pl-8 flex flex-col justify-center h-full max-w-[60%] relative">
               <div className="mb-5 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star className="w-2.5 h-2.5 text-blue-200 fill-blue-200" />
                      <span className="text-[9px] font-bold text-blue-50 uppercase tracking-widest leading-none">Especialista Apple</span>
                  </div>
               </div>
               <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                   <h3 className="text-[32px] font-[900] text-white leading-[0.85] font-display tracking-tight drop-shadow-lg">
                    RIO PHONE
                   </h3>
                   <h3 className="text-[32px] font-[300] text-blue-100 leading-[0.85] font-display tracking-tight opacity-90">
                    STORE
                   </h3>
               </div>
               <div className="mb-6 animate-in fade-in duration-700 delay-200">
                 <p className="text-slate-400 text-[10px] font-medium leading-relaxed max-w-[170px]">
                   Acessórios, manutenção e iPhones novos. Qualidade que você confia.
                 </p>
               </div>
               <div className="flex items-center gap-2 animate-in fade-in duration-700 delay-300">
                  <div className="w-6 h-[1px] bg-blue-500/50"></div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Desde 2017</span>
               </div>
            </div>
          </div>
        ) : current.id === 'master-sponsor' ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,91,255,0.1),transparent_70%)] animate-pulse"></div>
             <div className="absolute -right-16 -bottom-16 opacity-[0.05] rotate-12 pointer-events-none">
                <Shield className="w-64 h-64 text-white" />
             </div>
             <div className="relative z-10 mb-6 animate-in zoom-in-95 duration-1000">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2.5 shadow-2xl">
                    <div className="w-5 h-5 bg-amber-500/20 rounded-lg flex items-center justify-center">
                       <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.25em] leading-none">
                      Patrocinador Master
                    </span>
                </div>
             </div>
             <div className="relative z-10 space-y-2 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                <h3 className="text-4xl font-[950] bg-gradient-to-b from-white via-white to-blue-200 bg-clip-text text-transparent leading-none font-display tracking-tighter uppercase drop-shadow-2xl">
                  GRUPO
                </h3>
                <h3 className="text-4xl font-[950] bg-gradient-to-r from-blue-400 to-blue-100 bg-clip-text text-transparent leading-none font-display tracking-tighter uppercase">
                  ESQUEMATIZA
                </h3>
             </div>
             <div className="relative z-10 mt-6 animate-in fade-in duration-1000 delay-500">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">
                  Segurança e Facilities
                </p>
                <div className="flex items-center justify-center gap-4">
                   <div className="w-8 h-[1px] bg-white/10"></div>
                   <p className="text-blue-400/90 text-[10px] font-black uppercase tracking-widest">Excelência comprovada</p>
                   <div className="w-8 h-[1px] bg-white/10"></div>
                </div>
             </div>
          </div>
        ) : current.id === 'advertise-home' ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E5BFF] via-[#0040DD] to-[#1E5BFF] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
             <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-black/10 blur-3xl rounded-full"></div>
             <div className="absolute -right-8 -bottom-8 opacity-[0.07] rotate-[-15deg] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Rocket className="w-48 h-48 text-white" />
             </div>
             <div className="relative z-10 flex flex-col items-center max-w-xs">
                <div className="mb-5 animate-in slide-in-from-top-2 duration-700">
                    <div className="bg-black/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Oportunidade de Ouro</span>
                    </div>
                </div>
                <h3 className="text-3xl font-[950] text-white leading-[0.9] font-display tracking-tighter uppercase drop-shadow-xl mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                  ANUNCIE SUA MARCA
                </h3>
                <p className="text-blue-50 text-[11px] font-medium leading-relaxed max-w-[220px] mb-8 opacity-90 animate-in fade-in duration-1000 delay-200">
                  Alcance milhares de vizinhos em Jacarepaguá e venda mais todos os dias através do nosso super-app.
                </p>
                <div className="bg-white text-[#1E5BFF] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 shadow-2xl shadow-blue-900/40 group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-300 animate-in zoom-in-95 delay-300">
                   Divulgar minha loja
                   <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </div>
             </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4 pb-12 text-center z-10">
             <div className="p-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl animate-in zoom-in duration-700 mb-5">
                <current.Icon className="w-12 h-12 text-white" strokeWidth={2} />
             </div>
             <h3 className="text-2xl font-[900] text-white leading-tight font-display tracking-tight mt-4 uppercase">
              {current.title}
             </h3>
             <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{current.tag}</p>
          </div>
        )}

        {/* Indicadores de Progresso */}
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

export const HomeFeed: React.FC<HomeFeedProps> = ({ 
  onNavigate, 
  onSelectCategory, 
  onStoreClick, 
  stores,
  user
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const categoriesRef = useRef<HTMLDivElement>(null);

  // ESTRUTURA DA HOME: 'categories' primeiro, 'home_carousel' DEPOIS (abaixo das categorias)
  const homeStructure = useMemo(() => ['categories', 'home_carousel', 'novidades', 'sugestoes', 'em_alta', 'list'], []);

  const renderSection = (key: string) => {
    switch (key) {
      case 'home_carousel': 
        return (
          <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pb-2">
            <HomeCarousel onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} />
          </div>
        );
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-2 pb-0">
            <div ref={categoriesRef} className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
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
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-400 mt-0.5">
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
  const trending = useMemo(() => {
    return stores.filter(s => (s.image || s.logoUrl) && ['f-1', 'f-2'].includes(s.id));
  }, [stores]);

  if (trending.length < 2) return null;

  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-5">
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
