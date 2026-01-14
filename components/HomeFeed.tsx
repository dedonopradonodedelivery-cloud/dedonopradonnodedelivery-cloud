
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Store, Category, EditorialCollection, AdType, CommunityPost } from '../types';
import { 
  ChevronRight, 
  Dices,
  ArrowUpRight,
  Leaf,
  Coffee,
  Baby,
  Dog as DogIcon,
  Crown,
  MessageCircle,
  TrendingUp,
  Store as StoreIcon,
  X,
  Sparkles,
  Timer,
  Tag,
  Briefcase,
  Coins,
  Repeat,
  Quote,
  Zap,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  MapPin,
  Star,
  Users,
  Search,
  Wrench,
  Ticket,
  BadgeCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES, STORES, MOCK_JOBS, MOCK_COMMUNITY_POSTS } from '../constants';
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

const MINI_TRIBOS = [
  { id: 't-work', name: 'Home Office', subtitle: 'Wi-Fi e silêncio', icon: Coffee, color: 'bg-white text-blue-600 border-gray-100 shadow-sm' },
  { id: 't-pet', name: 'Amigo do Pet', subtitle: 'Eles são bem-vindos', icon: DogIcon, color: 'bg-white text-purple-600 border-gray-100 shadow-sm' },
  { id: 't-kids', name: 'Espaço Kids', subtitle: 'Lazer pros pequenos', icon: Baby, color: 'bg-white text-orange-600 border-gray-100 shadow-sm' },
  { id: 't-health', name: 'Vibe Saúde', subtitle: 'Foco no bem-estar', icon: Leaf, color: 'bg-white text-emerald-600 border-gray-100 shadow-sm' },
];

const getCategoryCover = (category: string) => {
  switch (category) {
    case 'Alimentação': return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop';
    case 'Pets': return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop';
    case 'Beleza': return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop';
    case 'Saúde': return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop';
    case 'Mercado': return 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop';
    default: return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop';
  }
};

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  target: string;
  tag?: string;
  bgColor: string;
  Icon: React.ElementType;
}

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { currentNeighborhood } = useNeighborhood();

  const banners: BannerItem[] = useMemo(() => [
    {
      id: 'b1-cashback',
      title: 'Cashback em JPA',
      subtitle: `Compre no bairro e receba dinheiro de volta na hora.`,
      target: 'explore', 
      tag: 'Exclusivo',
      bgColor: 'bg-[#1E5BFF]',
      Icon: Coins
    },
    {
      id: 'b2-services',
      title: 'Serviços & Orçamentos',
      subtitle: 'Encontre profissionais de JPA pelo WhatsApp.',
      target: 'services',
      tag: 'WhatsApp Direto',
      bgColor: 'bg-emerald-500',
      Icon: Wrench
    },
    {
      id: 'b3-merchant',
      title: 'Sua loja no mapa',
      subtitle: 'Venda mais e atraia novos clientes em Jacarepaguá.',
      target: 'freguesia_connect_public',
      tag: 'Para Negócios',
      bgColor: 'bg-indigo-600',
      Icon: StoreIcon
    },
    {
      id: 'b4-jobs',
      title: `Vagas em ${currentNeighborhood === 'Jacarepaguá (todos)' ? 'JPA' : currentNeighborhood}`,
      subtitle: 'Lojas contratando agora no seu bairro.',
      target: 'jobs_list',
      tag: 'Oportunidade',
      bgColor: 'bg-orange-500',
      Icon: Briefcase
    }
  ], [currentNeighborhood]);

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

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setProgress(0);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setProgress(0);
  };

  return (
    <div className="px-5">
      <div 
        onClick={() => onNavigate(current.target)}
        className={`w-full relative aspect-[5/3] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border border-gray-100 dark:border-white/5 ${current.bgColor} cursor-pointer active:scale-[0.98] transition-all group`}
      >
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* --- REESTRUTURAÇÃO DO CONTEÚDO PARA EVITAR SOBREPOSIÇÃO --- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
           
           {/* 1. Ícone Superior Centralizado */}
           <div className="p-5 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-2xl animate-in zoom-in duration-700 mb-6 group-hover:scale-105 transition-transform">
              <current.Icon className="w-14 h-14 text-white drop-shadow-xl" strokeWidth={2} />
           </div>

           {/* 2. Selo (Tag) abaixo do ícone com espaçamento seguro */}
           <div className="animate-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
              <span className="bg-white/20 text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] shadow-sm border border-white/20 backdrop-blur-sm">
                {current.tag}
              </span>
           </div>

           {/* 3. Título Principal */}
           <h3 className="text-2xl font-[900] text-white leading-tight font-display tracking-tight mt-4 mb-2 drop-shadow-md animate-in slide-in-from-bottom-3 duration-500 delay-200 fill-mode-both">
            {current.title}
           </h3>

           {/* 4. Subtítulo */}
           <p className="text-xs text-white/85 font-medium line-clamp-2 leading-relaxed max-w-[280px] animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
            {current.subtitle}
           </p>

        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 w-1/3 justify-center">
          {banners.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setProgress(0); }}>
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Click Zones */}
        <div className="absolute inset-y-0 left-0 w-1/6 z-20" onClick={handlePrev}></div>
        <div className="absolute inset-y-0 right-0 w-1/6 z-20" onClick={handleNext}></div>
      </div>
    </div>
  );
};

// --- BLOCO REESTILIZADO: CASHBACK ATIVO NO BAIRRO ---
const NeighborhoodCouponsBlock: React.FC<{ stores: Store[], onStoreClick: (store: Store) => void }> = ({ stores, onStoreClick }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();

  const couponStores = useMemo(() => {
    // FILTRO RELAXADO: Exibe qualquer loja com cashback > 0
    // ORDENAÇÃO: Premium > Local > Organic
    let list = stores.filter(s => s.cashback && s.cashback > 0);
    
    list.sort((a, b) => {
        // 1. Premium first
        if (a.adType === AdType.PREMIUM && b.adType !== AdType.PREMIUM) return -1;
        if (a.adType !== AdType.PREMIUM && b.adType === AdType.PREMIUM) return 1;
        
        // 2. Local second
        if (a.adType === AdType.LOCAL && b.adType !== AdType.LOCAL) return -1;
        if (a.adType !== AdType.LOCAL && b.adType === AdType.LOCAL) return 1;

        // 3. Geolocation Logic
        if (isAll) return 0;
        const aIsLocal = (a.neighborhood === currentNeighborhood);
        const bIsLocal = (b.neighborhood === currentNeighborhood);
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return 0;
    });
    return list;
  }, [stores, currentNeighborhood, isAll]);

  if (couponStores.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-6">
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Ticket className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Cupons Ativos no Bairro
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Economize agora nas lojas perto de você
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2 snap-x">
        {couponStores.map(store => (
          <button
            key={store.id}
            onClick={() => onStoreClick(store)}
            className="snap-center min-w-[160px] max-w-[160px] flex flex-col bg-white dark:bg-gray-800 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden group active:scale-[0.98] transition-all"
          >
            <div className="relative h-[110px] w-full overflow-hidden">
               <img src={store.image || store.logoUrl || '/assets/default-logo.png'} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

               {(isAll || store.neighborhood !== currentNeighborhood) && store.neighborhood && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    <span className="text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {store.neighborhood}
                    </span>
                  </div>
               )}

               <div className="absolute bottom-2 left-2">
                <div className="bg-emerald-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-0.5">
                  <span className="text-[14px] font-black tracking-tighter">{store.cashback}% OFF</span>
                </div>
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1 justify-between text-left">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-tight line-clamp-2 mb-1">{store.name}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">{store.category}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded uppercase">Ativo</span>
                <span className="text-[9px] font-medium text-gray-400">Resgatar</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- NOVO BLOCO: VAGAS EM DESTAQUE (PREMIUM JOB ADS ONLY) ---
const FeaturedJobsBlock: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();

  // Filtra apenas vagas PREMIUM ativas
  const premiumJobs = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return MOCK_JOBS.filter(job => 
      job.isSponsored === true && 
      (job.sponsoredUntil && job.sponsoredUntil >= today) &&
      (isAll || job.neighborhood === currentNeighborhood)
    );
  }, [currentNeighborhood, isAll]);

  if (premiumJobs.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-6 border-t border-gray-50 dark:border-gray-800">
      <div className="px-5 mb-4 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Vagas em Destaque
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Oportunidades exclusivas perto de você
          </p>
        </div>
        <button onClick={() => onNavigate('jobs_list')} className="text-[10px] font-bold text-[#1E5BFF] hover:underline">
            Ver todas
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-4 snap-x">
        {premiumJobs.map(job => (
          <button
            key={job.id}
            onClick={() => onNavigate('jobs_list')}
            className="snap-center min-w-[240px] max-w-[240px] bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 shadow-sm border border-orange-100 dark:border-gray-700 flex flex-col text-left group active:scale-[0.98] transition-all relative overflow-hidden"
          >
            {job.isUrgent && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-bl-xl uppercase tracking-wider">
                    Urgente
                </div>
            )}
            
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                    <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate leading-tight">{job.role}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{job.company}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-bold text-gray-500 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-1.5 py-0.5 rounded">
                    {job.type}
                </span>
                {job.salary && (
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <DollarSign className="w-2.5 h-2.5" /> {job.salary}
                    </span>
                )}
            </div>

            <div className="mt-auto pt-3 border-t border-orange-100 dark:border-gray-700 flex items-center justify-between w-full">
                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                    <MapPin className="w-2.5 h-2.5" /> {job.neighborhood}
                </div>
                <span className="text-[9px] font-bold text-[#1E5BFF] flex items-center gap-0.5 group-hover:underline">
                    Ver detalhes <ChevronRight className="w-2.5 h-2.5" />
                </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- BLOCO: SERVIÇOS EM DESTAQUE (PREMIUM ADS ONLY) ---
const FeaturedServicesBlock: React.FC<{ stores: Store[], onStoreClick: (store: Store) => void }> = ({ stores, onStoreClick }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();

  // Filtra apenas serviços PREMIUM ativos
  // Se for uma lista vazia, o componente não renderiza
  const premiumServices = useMemo(() => {
    let list = stores.filter(s => 
      s.category === 'Serviços' && 
      s.adType === AdType.PREMIUM && 
      (s as any).status === 'active' // Garante que apenas ativos apareçam
    );

    // Ordenação básica por rating, mas mantendo a lógica de Premium no topo
    list.sort((a, b) => b.rating - a.rating);
    
    // Filtro geográfico se necessário
    if (!isAll) {
       list = list.filter(s => s.neighborhood === currentNeighborhood);
    }

    return list;
  }, [stores, currentNeighborhood, isAll]);

  if (premiumServices.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-6 border-t border-gray-50 dark:border-gray-800">
      <div className="px-5 mb-4 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BadgeCheck className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Serviços em Destaque
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Profissionais verificados e recomendados
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-4 snap-x">
        {premiumServices.map(service => (
          <button
            key={service.id}
            onClick={() => onStoreClick(service)}
            className="snap-center min-w-[200px] max-w-[200px] bg-white dark:bg-gray-900 rounded-[24px] shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-1.5 flex flex-col group active:scale-[0.98] transition-all relative overflow-hidden"
          >
            {/* Faixa Premium Decorativa */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-tr-[24px] pointer-events-none"></div>

            <div className="h-28 w-full rounded-[20px] overflow-hidden relative bg-gray-100 dark:bg-gray-800">
               <img 
                 src={service.image || service.logoUrl || '/assets/default-logo.png'} 
                 alt={service.name} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               
               {/* Selo Destaque */}
               <div className="absolute top-2 right-2 bg-amber-400 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm border border-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-2 h-2 fill-white" />
                  Premium
               </div>

               <div className="absolute bottom-2 left-3 text-white">
                  <div className="flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 w-fit">
                     <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                     {service.rating.toFixed(1)}
                  </div>
               </div>
            </div>

            <div className="p-3 pt-3 flex flex-col text-left">
               <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate mb-1">
                 {service.name}
               </h4>
               <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate mb-3">
                 {service.subcategory}
               </p>
               
               <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium">
                     <MapPin className="w-2.5 h-2.5" />
                     {service.distance || 'Local'}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                     <ArrowUpRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string; rightElement?: React.ReactNode }> = ({ title, subtitle, rightElement }) => (
  <div className="flex items-center justify-between mb-5 px-1">
    <div className="flex flex-col">
      <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">
        {title}
      </h3>
      {subtitle && <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">{subtitle}</p>}
    </div>
    {rightElement}
  </div>
);

const CommunityTrustCarousel: React.FC<{ stores: Store[], onStoreClick: (store: Store) => void }> = ({ stores, onStoreClick }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();
  const trustedStores = useMemo(() => {
    // FILTRO RIGOROSO: Apenas PREMIUM e COM REVIEWS
    let list = (stores || []).filter(s => 
        s && 
        s.recentComments && 
        s.recentComments.length > 0 &&
        s.adType === AdType.PREMIUM
    );
    list.sort((a, b) => {
        if (isAll) return 0;
        const aIsLocal = (a.neighborhood === currentNeighborhood);
        const bIsLocal = (b.neighborhood === currentNeighborhood);
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return 0;
    });
    return list.slice(0, 6);
  }, [stores, currentNeighborhood, isAll]);

  if (trustedStores.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-6">
      <div className="px-5 mb-4">
        <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none flex items-center gap-2">
          Confiança no Bairro <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5">O que os moradores realmente dizem e fazem</p>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-6 snap-x">
        {trustedStores.map((store) => {
            const comment = store.recentComments ? store.recentComments[0] : '';
            const shortComment = comment.length > 70 ? comment.substring(0, 70) + '...' : comment;
            return (
              <button key={store.id} onClick={() => onStoreClick(store)} className="snap-center min-w-[160px] max-w-[160px] flex flex-col bg-white dark:bg-gray-800 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden group active:scale-[0.98] transition-all relative">
                <div className="h-24 w-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                   <img src={store.image || getCategoryCover(store.category)} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute -bottom-3 right-3 bg-white dark:bg-gray-700 shadow-md border border-gray-100 dark:border-gray-600 px-2 py-1 rounded-lg flex items-center gap-1 z-10">
                     <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                     <span className="text-[10px] font-bold text-gray-900 dark:text-white">{store.rating?.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-3 pt-5 flex flex-col h-full bg-white dark:bg-gray-800 relative">
                   <div className="absolute -top-3 left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm z-10">
                      <Quote className="w-3 h-3 text-white fill-white" />
                   </div>
                   <div className="mb-3 flex-1">
                      <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium italic leading-relaxed line-clamp-3">"{shortComment}"</p>
                   </div>
                   <div className="flex flex-col border-t border-gray-50 dark:border-gray-700 pt-2 mt-auto">
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-tight line-clamp-1">{store.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                         <span className="text-[9px] text-gray-400 dark:text-gray-500 truncate max-w-[80px]">{store.category}</span>
                         {(isAll || store.neighborhood !== currentNeighborhood) && store.neighborhood && (
                            <span className="text-[8px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded">{store.neighborhood}</span>
                         )}
                      </div>
                   </div>
                </div>
              </button>
            );
        })}
      </div>
    </div>
  );
};

const CommunityFeedBlock: React.FC<{ onNavigate: (view: string) => void; }> = ({ onNavigate }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();
  const previewPosts = useMemo(() => {
     const allPosts = [...MOCK_COMMUNITY_POSTS];
     allPosts.sort((a, b) => {
         if (isAll) return 0; 
         const aIsLocal = (a.neighborhood === currentNeighborhood);
         const bIsLocal = (b.neighborhood === currentNeighborhood);
         if (aIsLocal && !bIsLocal) return -1;
         if (!aIsLocal && bIsLocal) return 1;
         return 0;
     });
     return allPosts.slice(0, 4);
  }, [currentNeighborhood, isAll]);

  if (previewPosts.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-6">
      <div className="px-5 mb-4">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none flex items-center gap-2">
                    O que está bombando no bairro agora <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full uppercase tracking-wide">Ao Vivo</div>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5">Atividade real acontecendo perto de você</p>
            </div>
            <button onClick={() => onNavigate('community_feed')} className="text-xs font-bold text-[#1E5BFF] hover:underline">Ver tudo</button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-4 snap-x">
        {previewPosts.map((post) => (
            <div key={post.id} className="snap-center min-w-[280px] max-w-[280px] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between active:scale-[0.99] transition-transform cursor-pointer relative" onClick={() => onNavigate('community_feed')}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                        <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full bg-gray-100 object-cover border border-gray-100 dark:border-gray-700" />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{post.userName}</p>
                            <span className="text-[9px] text-gray-400 font-medium">{post.timestamp}</span>
                        </div>
                        {post.neighborhood && (
                            <p className="text-[10px] font-bold text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded w-fit mt-0.5 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> {post.neighborhood}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex-1 mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 font-medium">"{post.content}"</p>
                </div>
                <div className="flex items-center gap-4 text-gray-400 border-t border-gray-50 dark:border-gray-700 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium"><ThumbsUp className="w-3.5 h-3.5" /> {post.likes > 0 ? post.likes : 'Curtir'}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium"><MessageSquare className="w-3.5 h-3.5" /> {post.comments > 0 ? `${post.comments} coments` : 'Comentar'}</div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

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
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');
  const activeSearchTerm = externalSearchTerm || '';
  const { currentNeighborhood, isAll } = useNeighborhood();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScrollCategories = () => {
    if (categoriesRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
        const maxScroll = scrollWidth - clientWidth;
        setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) : 0);
    }
  };

  const sortedStores = useMemo(() => {
    let list = [...(stores || [])];
    list.sort((a, b) => {
        if (isAll) return 0; 
        const aIsLocal = (a.neighborhood === currentNeighborhood);
        const bIsLocal = (b.neighborhood === currentNeighborhood);
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return 0; 
    });
    return list;
  }, [stores, currentNeighborhood, isAll]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-6 pb-2">
            <div ref={categoriesRef} onScroll={handleScrollCategories} className="flex overflow-x-auto no-scrollbar px-4 pb-2 snap-x">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {(CATEGORIES || []).map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 relative overflow-hidden bg-gradient-to-br ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">{React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 }) : null}</div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center w-full mt-1 mb-1">
                <div className="w-12 h-[3px] bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-[#1E5BFF] rounded-full transition-transform duration-100 ease-out w-4" style={{ transform: `translateX(${scrollProgress * 200}%)` }} />
                </div>
            </div>
          </div>
        );

      case 'home_carousel':
        return <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pb-8"><HomeCarousel onNavigate={onNavigate} /></div>;

      case 'neighborhood_coupons':
        return <NeighborhoodCouponsBlock key="neighborhood_coupons" stores={stores} onStoreClick={(s) => onStoreClick && onStoreClick(s)} />;

      case 'featured_services':
        return <FeaturedServicesBlock key="featured_services" stores={stores} onStoreClick={(s) => onStoreClick && onStoreClick(s)} />;

      case 'featured_jobs':
        return <FeaturedJobsBlock key="featured_jobs" onNavigate={onNavigate} />;

      case 'community_feed': return <CommunityFeedBlock key="community_feed" onNavigate={onNavigate} />;

      case 'trust_feed': return <CommunityTrustCarousel key="trust_feed" stores={sortedStores} onStoreClick={(s) => onStoreClick && onStoreClick(s)} />;

      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-900 py-8">
            <div className="px-5">
              <SectionHeader title={`Parceiros Premium em ${currentNeighborhood === 'Jacarepaguá (todos)' ? 'Jacarepaguá' : currentNeighborhood}`} subtitle="O que há de melhor no bairro" rightElement={<div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">{['all', 'cashback', 'top_rated'].map((f) => (<button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>{f === 'all' ? 'Tudo' : f === 'cashback' ? '%' : 'Top'}</button>))}</div>} />
              {/* FILTRAGEM PREMIUM ATIVADA */}
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} premiumOnly={true} />
            </div>
          </div>
        );

      case 'mini_tribes':
        return (
          <div key="mini_tribes" className="w-full py-12 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="px-5"><SectionHeader title="Estilo de Vida" subtitle="Lugares pela sua vibe" /></div>
            <div className="grid grid-cols-2 gap-3 px-5">
              {MINI_TRIBOS.map((tribo) => (
                <button key={tribo.id} className={`flex items-center gap-3 p-4 rounded-2xl border text-left active:scale-[0.97] transition-all ${tribo.color} bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700`}><div className="p-2 bg-gray-50/50 dark:bg-gray-700 rounded-lg shrink-0"><tribo.icon size={18} strokeWidth={2.5} /></div><div className="min-w-0"><h4 className="font-bold text-[10px] truncate uppercase tracking-tight">{tribo.name}</h4></div></button>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const homeStructure = useMemo(() => [
    'categories',
    'home_carousel',
    'neighborhood_coupons', // 1. Prioridade
    'featured_services',    // 2. Prioridade
    'featured_jobs',        // 3. Prioridade
    'trust_feed',
    'community_feed',       // 4. Retenção
    'list',
    'mini_tribes'
  ], []);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      <div className="flex flex-col w-full">
          {homeStructure.map(section => renderSection(section))}
          <div className="px-5 pb-8 pt-4 bg-white dark:bg-gray-900">
            <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
          </div>
      </div>
    </div>
  );
};
