import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Store, Category, EditorialCollection, AdType, UserRole } from '../types';
import { 
  ChevronRight, 
  Star, 
  MapPin, 
  Search,
  X,
  Tag,
  Briefcase,
  Coins,
  Repeat,
  Quote,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Timer,
  Crown,
  AlertCircle
} from 'lucide-react';
import { LojasEServicosList } from './LojasEServicosList';
import { User } from '@supabase/supabase-js';
import { SpinWheelView } from './SpinWheelView';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { CATEGORIES, STORES, MOCK_JOBS, MOCK_COMMUNITY_POSTS } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { useConfig } from '../contexts/ConfigContext';

interface HomeFeedProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (category: Category) => void;
  onSelectCollection: (collection: EditorialCollection) => void;
  onStoreClick?: (store: Store) => void;
  searchTerm?: string;
  stores: Store[];
  user: User | null;
  userRole?: UserRole | null;
  onSpinWin: (reward: any) => void;
  onRequireLogin: () => void;
}

// Utilitário para normalizar texto (remover acentos e lowercase)
const normalizeText = (text: string): string => {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const MINI_TRIBOS = [
  { id: 't-work', name: 'Home Office', subtitle: 'Wi-Fi e silêncio', icon: Sparkles, color: 'bg-white text-blue-600 border-gray-100 shadow-sm' },
  { id: 't-pet', name: 'Amigo do Pet', subtitle: 'Eles são bem-vindos', icon: Tag, color: 'bg-white text-purple-600 border-gray-100 shadow-sm' },
];

const WEEKLY_PROMOS = [
  { id: 'promo-1', storeName: 'Espaço VIP Beleza', productName: 'Hidratação Profunda', discount: 30, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop', validity: 'Até domingo', storeId: 'mock-1', neighborhood: 'Freguesia' },
  { id: 'promo-2', storeName: 'Hamburgueria Brasa', productName: 'Combo Duplo Cheddar', discount: 25, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400&auto=format&fit=crop', validity: 'Até domingo', storeId: 'mock-2', neighborhood: 'Freguesia' },
];

const getCategoryCover = (category: string) => {
  switch (category) {
    case 'Alimentação': return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop';
    case 'Pets': return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400&auto=format&fit=crop';
    case 'Beleza': return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop';
    default: return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop';
  }
};

const HomeCarousel: React.FC<{ onNavigate: (v: string) => void }> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { currentNeighborhood, isAll } = useNeighborhood();
  const { features } = useConfig();

  const banners = useMemo(() => {
    const list = [];
    if (features.cashbackEnabled) {
      list.push({ id: 'b1', type: 'standard', title: 'Cashback real no bairro', subtitle: 'Compre local e receba de volta.', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800', target: 'explore', tag: 'Exclusivo', tagColor: 'bg-emerald-500' });
    }
    list.push({ id: 'b2', type: 'standard', title: 'Serviços em JPA', subtitle: 'Receba até 5 orçamentos.', image: 'https://images.unsplash.com/photo-1581578731117-10d52143b0e8?q=80&w=800', target: 'services', tag: 'WhatsApp', tagColor: 'bg-green-600' });
    return list;
  }, [features]);

  useEffect(() => {
    if (banners.length === 0) return;
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

  if (banners.length === 0) return null;
  const current = banners[currentIndex];

  return (
    <div className="px-5">
      <div onClick={() => onNavigate(current.target)} className="w-full relative aspect-[2/1] rounded-[32px] overflow-hidden shadow-xl bg-gray-100 dark:bg-slate-900 cursor-pointer active:scale-[0.98] transition-all">
        <img key={current.id} src={current.image} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-90" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 pb-10">
          <span className={`${current.tagColor} text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest w-fit mb-2`}>{current.tag}</span>
          <h3 className="text-xl font-black text-white leading-[1.1] mb-2">{current.title}</h3>
          <p className="text-xs text-gray-200 font-medium line-clamp-2">{current.subtitle}</p>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 w-1/3 justify-center">
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

const CommunityFeedBlock: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { currentNeighborhood, isAll } = useNeighborhood();
  const previewPosts = useMemo(() => {
     const allPosts = [...MOCK_COMMUNITY_POSTS];
     allPosts.sort((a, b) => {
         if (isAll) return 0; 
         return a.neighborhood === currentNeighborhood ? -1 : 1;
     });
     return allPosts.slice(0, 4);
  }, [currentNeighborhood, isAll]);

  if (previewPosts.length === 0) return null;

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-gray-950 py-6 border-b border-gray-100 dark:border-gray-800">
      <div className="px-5 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">Novidades dos bairros <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full uppercase">Ao Vivo</div></h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1.5">O que está acontecendo agora em JPA</p>
        </div>
        <button onClick={() => onNavigate('community_feed')} className="text-xs font-bold text-[#1E5BFF]">Ver tudo</button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-4 snap-x">
        {previewPosts.map((post) => (
            <div key={post.id} className="snap-center min-w-[280px] max-w-[280px] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => onNavigate('community_feed')}>
                <div className="flex items-center gap-3 mb-3">
                    <img src={post.userAvatar} className="w-10 h-10 rounded-full bg-gray-100 object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{post.userName}</p>
                        <p className="text-[10px] font-bold text-[#1E5BFF]">{post.neighborhood}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 font-medium">"{post.content}"</p>
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
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [listFilter, setListFilter] = useState<'all' | 'cashback' | 'top_rated' | 'open_now'>('all');
  const activeSearchTerm = externalSearchTerm || '';
  const { currentNeighborhood, isAll } = useNeighborhood();
  const { features } = useConfig();
  const categoriesRef = useRef<HTMLDivElement>(null);

  // LOGICA DE FILTRO SEGURA (V1)
  const searchResults = useMemo(() => {
    if (!activeSearchTerm) return [];

    const termNormalized = normalizeText(activeSearchTerm);
    
    return stores.filter(store => {
      const name = normalizeText(store.name);
      const cat = normalizeText(store.category);
      const sub = normalizeText(store.subcategory);
      
      // Concatena tags de forma segura
      const tags = (store as any).tags ? (store as any).tags.map((t: string) => normalizeText(t)).join(' ') : "";
      const description = normalizeText(store.description);

      return (
        name.includes(termNormalized) ||
        cat.includes(termNormalized) ||
        sub.includes(termNormalized) ||
        tags.includes(termNormalized) ||
        description.includes(termNormalized)
      );
    });
  }, [stores, activeSearchTerm]);

  const renderSection = (key: string) => {
    switch (key) {
      case 'categories':
        return (
          <div key="categories" className="w-full bg-white dark:bg-gray-950 pt-6 pb-2">
            <div ref={categoriesRef} className="flex overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
              <div className="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex flex-col items-center active:scale-95 transition-all">
                    <div className={`w-[78px] h-[78px] rounded-[22px] shadow-lg flex flex-col items-center justify-between p-2 overflow-hidden bg-gradient-to-br ${cat.color} border border-white/20`}>
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
      case 'home_carousel': return <div key="home_carousel" className="w-full bg-white dark:bg-gray-950 pb-8"><HomeCarousel onNavigate={onNavigate} /></div>;
      case 'community_feed': return <CommunityFeedBlock key="community_feed" onNavigate={onNavigate} />;
      case 'list':
        return (
          <div key="list" className="w-full bg-white dark:bg-gray-900 py-8 px-5">
            <div className="flex flex-col mb-5">
              <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Explorar {currentNeighborhood}</h3>
              <p className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">O que há de melhor no bairro</p>
            </div>
            <LojasEServicosList onStoreClick={onStoreClick} onViewAll={() => onNavigate('explore')} activeFilter={listFilter} user={user} onNavigate={onNavigate} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 w-full max-w-md mx-auto animate-in fade-in duration-500 overflow-x-hidden pb-32">
      {!activeSearchTerm ? (
        <div className="flex flex-col w-full">
            {['categories', 'home_carousel', 'community_feed', 'list'].map(section => renderSection(section))}
            <div className="px-5 pb-8 pt-4 bg-gray-50 dark:bg-gray-900">
              <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} />
            </div>
        </div>
      ) : (
        <div className="px-5 mt-6 min-h-[60vh] animate-in fade-in duration-300">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {searchResults.length > 0 ? `Resultados para "${activeSearchTerm}"` : "Nenhum resultado"}
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{searchResults.length} locais</span>
             </div>

             {searchResults.length > 0 ? (
               <div className="flex flex-col gap-3">
                  {searchResults.map((store) => (
                  <div key={store.id} onClick={() => onStoreClick?.(store)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 cursor-pointer active:scale-[0.98] transition-all">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 p-1 flex-shrink-0 border border-gray-100 dark:border-gray-600">
                          <img src={store.logoUrl || "/assets/default-logo.png"} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate">{store.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#1E5BFF] font-black uppercase tracking-tight">{store.category}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{store.neighborhood}</span>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 self-center" />
                  </div>
                  ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                    <AlertCircle className="w-10 h-10 text-gray-300" />
                  </div>
                  <h4 className="text-gray-900 dark:text-white font-bold">Ops! Não encontramos nada</h4>
                  <p className="text-gray-500 text-sm mt-1 max-w-[240px]">Tente buscar por termos mais genéricos como "pizza" ou "mecânico".</p>
               </div>
             )}
        </div>
      )}

      {isSpinWheelOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center" onClick={() => setIsSpinWheelOpen(false)}>
          <div className="bg-transparent w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-5 z-50">
                <button onClick={() => setIsSpinWheelOpen(false)} className="p-2.5 text-gray-200 hover:text-white bg-white/10 backdrop-blur-md rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <SpinWheelView userId={user?.id || null} userRole={userRole || null} onWin={onSpinWin} onRequireLogin={onRequireLogin} onViewHistory={() => { setIsSpinWheelOpen(false); onNavigate('prize_history'); }} />
          </div>
        </div>
      )}
    </div>
  );
};