
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
  Wrench
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
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

const WEEKLY_PROMOS = [
  {
    id: 'promo-1',
    storeName: 'Espaço VIP Beleza',
    productName: 'Hidratação Profunda',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop',
    validity: 'Até domingo',
    storeId: 'mock-1',
    neighborhood: 'Freguesia'
  },
  {
    id: 'promo-2',
    storeName: 'Hamburgueria Brasa',
    productName: 'Combo Duplo Cheddar',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400&auto=format&fit=crop',
    validity: 'Até domingo',
    storeId: 'mock-2',
    neighborhood: 'Freguesia'
  },
  {
    id: 'promo-3',
    storeName: 'Pet Shop Araguaia',
    productName: 'Banho & Tosa Premium',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop',
    validity: 'Até sábado',
    storeId: 'mock-3',
    neighborhood: 'Taquara'
  },
  {
    id: 'promo-4',
    storeName: 'Academia Force',
    productName: 'Plano Trimestral',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    validity: 'Só hoje',
    storeId: 'mock-4',
    neighborhood: 'Pechincha'
  }
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
        return prev + 0.4; 
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

        {/* Central Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pb-20">
           <div className="p-6 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-2xl animate-in zoom-in duration-700">
              <current.Icon className="w-16 h-16 text-white drop-shadow-xl" strokeWidth={2} />
           </div>
        </div>

        {/* Content Info */}
        <div className="absolute inset-x-0 bottom-0 p-6 pt-10 flex flex-col items-center text-center z-20 bg-gradient-to-t from-black/20 to-transparent">
          <span className="bg-white/20 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.2em] shadow-sm mb-3 border border-white/20 backdrop-blur-sm">
            {current.tag}
          </span>
          <h3 className="text-2xl font-black text-white leading-tight font-display tracking-tight mb-2 drop-shadow-md">
            {current.title}
          </h3>
          <p className="text-xs text-white/90 font-medium line-clamp-2 leading-relaxed opacity-90 max-w-[280px]">
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

const WeeklyPromosSection: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();
  const validPromos = useMemo(() => {
    let promos = [...WEEKLY_PROMOS].filter(p => p.discount >= 15);
    promos.sort((a, b) => {
        if (isAll) return b.discount - a.discount;
        const aIsLocal = a.neighborhood === currentNeighborhood;
        const bIsLocal = b.neighborhood === currentNeighborhood;
        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return b.discount - a.discount;
    });
    return promos;
  }, [currentNeighborhood, isAll]);

  if (validPromos.length === 0) return null;

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0B0F19] py-6 border-b border-gray-100 dark:border-gray-800">
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-4 h-4 text-red-500 fill-red-500/20" />
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
            Promoções da Semana
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Descontos reais por tempo limitado no seu bairro
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2 snap-x">
        {validPromos.map((promo) => (
          <button 
            key={promo.id}
            onClick={() => onNavigate('weekly_promo')} 
            className="snap-center min-w-[160px] max-w-[160px] flex flex-col bg-white dark:bg-gray-800 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden group active:scale-[0.98] transition-all"
          >
            <div className="relative h-[110px] w-full overflow-hidden">
              <img src={promo.image} alt={promo.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                <span className="text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Timer className="w-2.5 h-2.5 text-yellow-400" /> 7 Dias
                </span>
              </div>
              {(isAll || promo.neighborhood !== currentNeighborhood) && (
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                    <span className="text-[8px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {promo.neighborhood}
                    </span>
                  </div>
              )}
              <div className="absolute bottom-2 left-2">
                <div className="bg-red-600 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-0.5">
                  <span className="text-[14px] font-black tracking-tighter">-{promo.discount}%</span>
                </div>
              </div>
            </div>
            <div className="p-3 flex flex-col flex-1 justify-between text-left">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-xs leading-tight line-clamp-2 mb-1">{promo.productName}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">{promo.storeName}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-900/10 px-1.5 py-0.5 rounded uppercase">Oferta</span>
                <span className="text-[9px] font-medium text-gray-400">{promo.validity}</span>
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
    let list = (stores || []).filter(s => s && s.recentComments && s.recentComments.length > 0);
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
    <div className="w-full bg-[#FAFAFA] dark:bg-gray-950 py-6 border-b border-gray-100 dark:border-gray-800">
      <div className="px-5 mb-4">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none flex items-center gap-2">
                    Novidades dos bairros <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full uppercase tracking-wide">Ao Vivo</div>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5">O que está acontecendo agora em Jacarepaguá</p>
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

const WheelBanner: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [rotation, setRotation] = useState(0);
  useEffect(() => {
    const spin = () => setRotation(prev => prev + 1800);
    const initialTimer = setTimeout(spin, 100);
    const interval = setInterval(spin, 5000);
    return () => { clearTimeout(initialTimer); clearInterval(interval); };
  }, []);
  return (
    <div className="px-5">
      <button onClick={onClick} className="w-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] rounded-[24px] p-1 shadow-2xl relative overflow-hidden group active:scale-[0.98] transition-all flex items-center justify-between">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-5 w-full p-4">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 text-white drop-shadow-md">▼</div>
                <div className="w-20 h-20 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.3)] relative z-10" style={{ background: `conic-gradient(#FF3B30 0% 12.5%, #FF9500 12.5% 25%, #FFCC00 25% 37.5%, #34C759 37.5% 50%, #30B0C7 50% 62.5%, #007AFF 62.5% 75%, #5856D6 75% 87.5%, #FF2D55 87.5% 100%)`, transform: `rotate(${rotation}deg)`, transition: 'transform 4.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
                </div>
            </div>
            <div className="text-left flex-1">
                <h3 className="text-lg font-black text-white leading-tight mb-1 font-display drop-shadow-sm">Roleta da <br/> Localizei JPA</h3>
                <p className="text-[11px] text-white/90 font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md w-fit backdrop-blur-sm">Gire e ganhe vantagens</p>
            </div>
        </div>
      </button>
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
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
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

      case 'weekly_promos': return <WeeklyPromosSection key="weekly_promos" onNavigate={onNavigate} />;

      case 'community_feed': return <CommunityFeedBlock key="community_feed" onNavigate={onNavigate} />;

      case 'roulette':
        return (
          <div key="roulette" className="w-full bg-white dark:bg-gray-950 py-8">
            <div className="px-5 mb-2"><div className="flex items-center gap-2"><span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">🎁 Interaja e ganhe vantagens</span></div></div>
            <WheelBanner onClick={() => setIsSpinWheelOpen(true)} />
          </div>
        );

      case 'cashback_stores':
        const cashbackList = (sortedStores || []).filter(s => s.cashback && s.cashback > 0);
        if (cashbackList.length === 0) return null;
        return (
          <div key="cashback_stores" className="w-full bg-white dark:bg-gray-950 py-6">
            <div className="px-5 mb-4"><h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none">Cashback no seu bairro</h2><p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5">Veja onde você recebe cashback em {currentNeighborhood === 'Jacarepaguá (todos)' ? 'Jacarepaguá' : currentNeighborhood}</p></div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-6 snap-x">
              {cashbackList.map((store) => (
                <button key={store.id} onClick={() => onStoreClick?.(store)} className="snap-center relative w-[140px] h-[190px] rounded-[24px] overflow-hidden group active:scale-[0.98] transition-all flex-shrink-0 shadow-lg">
                  <img src={store.image || getCategoryCover(store.category)} alt={store.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 group-hover:via-black/70 transition-colors"></div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-between items-start text-left z-10">
                     <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1.5 rounded-xl shadow-sm"><Coins className="w-4 h-4 text-emerald-400 fill-emerald-400/20" /></div>
                     <div className="w-full">
                        <div className="flex flex-col mb-3"><span className="text-4xl font-black text-white tracking-tighter leading-none drop-shadow-xl filter">{store.cashback}%</span><span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none mt-1">de volta</span></div>
                        <div className="h-[2px] w-8 bg-white/20 mb-3 rounded-full"></div>
                        <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 drop-shadow-md mb-1">{store.name}</h4>
                        {(isAll || store.neighborhood !== currentNeighborhood) && store.neighborhood ? <p className="text-[9px] text-gray-300 font-medium truncate opacity-90 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{store.neighborhood}</p> : <p className="text-[9px] text-gray-400 mt-0.5 truncate max-w-full opacity-80 font-medium">{store.category}</p>}
                     </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'trust_feed': return <CommunityTrustCarousel key="trust_feed" stores={sortedStores} onStoreClick={(s) => onStoreClick && onStoreClick(s)} />;

      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-900 py-8">
            <div className="px-5">
              <SectionHeader title={`Explorar ${currentNeighborhood === 'Jacarepaguá (todos)' ? 'Jacarepaguá' : currentNeighborhood}`} subtitle="O que há de melhor no bairro" rightElement={<div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">{['all', 'cashback', 'top_rated'].map((f) => (<button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>{f === 'all' ? 'Tudo' : f === 'cashback' ? '%' : 'Top'}</button>))}</div>} />
              <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
            </div>
          </div>
        );

      case 'mini_tribes':
        return (
          <div key="mini_tribes" className="w-full py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
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
    'weekly_promos',
    'cashback_stores',
    'trust_feed',
    'community_feed',
    'roulette',       
    'list',           
    'mini_tribes'
  ], []);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      <div className="flex flex-col w-full">
          {homeStructure.map(section => renderSection(section))}
          <div className="px-5 pb-8 pt-4 bg-gray-50 dark:bg-gray-900">
            <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
          </div>
      </div>

      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300" onClick={() => setIsSpinWheelOpen(false)}>
          <div className="bg-transparent w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-5 z-50"><button onClick={() => setIsSpinWheelOpen(false)} className="p-2.5 text-gray-200 hover:text-white bg-white/10 backdrop-blur-md rounded-full active:scale-90 transition-transform"><X className="w-5 h-5" /></button></div>
            <SpinWheelView userId={user?.id || null} userRole={userRole || null} onWin={onSpinWin} onRequireLogin={onRequireLogin} onViewHistory={() => { setIsSpinWheelOpen(false); onNavigate('prize_history'); }} />
          </div>
        </div>
      )}
    </div>
  );
};
