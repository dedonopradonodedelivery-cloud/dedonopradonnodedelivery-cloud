
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
  BadgeCheck
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
  onSpinWin: (reward: any) => void;
  onRequireLogin: () => void;
}

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
  target: string;
  tag?: string;
  bgColor: string;
  Icon: React.ElementType;
}

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void; onStoreClick?: (store: Store) => void; stores?: Store[] }> = ({ onNavigate, onStoreClick, stores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const banners: BannerItem[] = useMemo(() => [
    { id: 'master-sponsor', title: 'Grupo Esquematiza', target: 'patrocinador_master', tag: 'Patrocinador Master', bgColor: 'bg-slate-900', Icon: Crown },
    { id: 'rio-phone-store', title: 'Rio Phone Store', target: 'rio-phone-store', tag: 'Assistência Apple', bgColor: 'bg-zinc-900', Icon: Smartphone },
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4 pb-12 text-center z-10">
           <div className="p-4 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl animate-in zoom-in duration-700 mb-5">
              <current.Icon className="w-12 h-12 text-white" strokeWidth={2} />
           </div>
           <h3 className="text-2xl font-[900] text-white leading-tight font-display tracking-tight mt-4 uppercase">
            {current.title}
           </h3>
           <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-2">{current.tag}</p>
        </div>
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

const FeaturedServicesBlock: React.FC<{ stores: Store[], onStoreClick: (store: Store) => void }> = ({ stores, onStoreClick }) => {
  const visibleServices = useMemo(() => EDITORIAL_SERVICES.filter(service => service.image), []);
  if (visibleServices.length === 0) return null;
  return (
    <div className="w-full bg-white dark:bg-gray-950 py-3 border-t border-gray-50 dark:border-gray-800">
      <div className="px-5 mb-3">
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Serviços Recomendados</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Profissionais bem avaliados na região</p>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2 snap-x">
        {visibleServices.map(service => (
          <button key={service.id} onClick={() => { const s = stores.find(st => st.id === service.id); if (s) onStoreClick(s); }} className="snap-center w-[160px] shrink-0 aspect-[9/16] relative overflow-hidden group active:scale-[0.98] transition-all bg-gray-200 dark:bg-gray-800 shadow-md">
            <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 text-left z-10">
                <p className="text-[8px] text-amber-400 font-black uppercase tracking-widest mb-1">{service.subcategory}</p>
                <h4 className="font-bold text-white text-sm leading-[1.15] mb-1 line-clamp-2">{service.name}</h4>
                <div className="flex items-center gap-1 text-[9px] text-gray-300"><MapPin className="w-2.5 h-2.5" />{service.location}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const CommunityFeedBlock: React.FC<{ onNavigate: (view: string) => void; }> = ({ onNavigate }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();
  const previewPosts = useMemo(() => {
     const fakePosts: any[] = [
        { id: 'fake-1', userName: 'Maria Souza', userAvatar: 'https://i.pravatar.cc/100?u=maria', neighborhood: 'Freguesia', content: 'Genteeee!!! Adorei esse Aplicativo!!! é tudooooo!!!! #LocalizeiJPA', timestamp: '2 min atrás', likes: 24, comments: 8 },
        { id: 'fake-7', userName: 'Luciana Lima', userAvatar: 'https://i.pravatar.cc/100?u=luciana', neighborhood: 'Pechincha', content: 'Alguém sabe se o Hortifruti da Estrada do Tindiba tá aberto? 🍎', timestamp: '3 min atrás', likes: 12, comments: 4 }
     ];
     return isAll ? fakePosts : fakePosts.filter(p => p.neighborhood === currentNeighborhood || p.id === 'fake-1');
  }, [currentNeighborhood, isAll]);

  if (previewPosts.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-950 py-3 border-t border-gray-50 dark:border-gray-800">
      <div className="px-5 mb-3 flex justify-between items-center">
        <h2 className="text-base font-[900] text-gray-900 dark:text-white tracking-tight leading-none flex items-center gap-2">Bombando no bairro <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-[9px] font-black rounded-full uppercase animate-pulse">Ao Vivo</div></h2>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-3 snap-x">
        {previewPosts.map((post) => (
            <div key={post.id} className="snap-center min-w-[280px] max-w-[280px] bg-[#1E5BFF]/5 dark:bg-blue-900/5 p-5 rounded-3xl border border-blue-100/50 dark:border-gray-700 flex flex-col justify-between active:scale-[0.99] transition-transform cursor-pointer" onClick={() => onNavigate('community_feed')}>
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <img src={post.userAvatar} alt={post.userName} className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-gray-800" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 dark:text-white truncate">@{post.userName.toLowerCase().replace(' ', '')}</p>
                        <span className="text-[10px] text-[#1E5BFF] font-black">{post.neighborhood}</span>
                    </div>
                </div>
                <p className="text-[13px] text-gray-800 dark:text-gray-200 leading-snug line-clamp-3 font-semibold italic mb-4">"{post.content}"</p>
                <div className="flex items-center gap-5 text-gray-400 border-t border-gray-50 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold"><ThumbsUp className="w-4 h-4" /> {post.likes}</div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold"><MessageSquare className="w-4 h-4" /> {post.comments}</div>
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
  stores,
  user
}) => {
  const [listFilter, setListFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const { currentNeighborhood } = useNeighborhood();
  const categoriesRef = useRef<HTMLDivElement>(null);

  const homeStructure = useMemo(() => ['categories', 'home_carousel', 'featured_services', 'community_feed', 'list'], []);

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-4 pb-0">
            <div ref={categoriesRef} className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center group active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 bg-gradient-to-br ${cat.color} border border-white/20`}>
                      <div className="flex-1 flex items-center justify-center w-full">{React.cloneElement(cat.icon as any, { className: "w-7 h-7 text-white drop-shadow-md", strokeWidth: 2.5 })}</div>
                      <div className="w-full bg-black/10 backdrop-blur-[2px] py-1 rounded-b-[20px] -mx-2 -mb-2"><span className="block w-full text-[9px] font-black text-white text-center uppercase tracking-tight">{cat.name}</span></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'home_carousel': return <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 mt-4 pb-3"><HomeCarousel onNavigate={onNavigate} onStoreClick={onStoreClick} stores={stores} /></div>;
      case 'featured_services': return <FeaturedServicesBlock key="featured_services" stores={stores} onStoreClick={(s) => onStoreClick && onStoreClick(s)} />;
      case 'community_feed': return <CommunityFeedBlock key="community_feed" onNavigate={onNavigate} />;
      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-900 pt-3">
            <div className="px-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Explorar Bairro</h3>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  {['all', 'top_rated'].map((f) => (<button key={f} onClick={() => setListFilter(f as any)} className={`text-[8px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-all ${listFilter === f ? 'bg-white dark:bg-gray-700 text-[#1E5BFF] shadow-sm' : 'text-gray-400'}`}>{f === 'all' ? 'Tudo' : 'Top'}</button>))}
                </div>
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
      <div className="flex flex-col w-full">
          {homeStructure.map(section => renderSection(section))}
      </div>
    </div>
  );
};
