
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Star, Loader2, AlertCircle, BadgeCheck, Heart, Award, Eye, Rocket, Crown, Store as StoreIcon, Zap } from 'lucide-react';
import { Store, AdType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { User } from '@supabase/supabase-js';
import { STORES } from '../constants';

interface LojasEServicosListProps {
  onStoreClick?: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'cashback' | 'top_rated' | 'open_now';
  user?: User | null;
  onNavigate?: (view: string) => void;
  premiumOnly?: boolean; 
}

const ITEMS_PER_PAGE = 12;
const MASTER_ID = 'grupo-esquematiza'; // ID do Patrocinador Master Fixo (Atualizado)

// Alvos de monetização
const sortStores = (stores: Store[]) => {
  return [...stores].sort((a, b) => {
    const aSponsored = a.isSponsored || a.adType === AdType.PREMIUM;
    const bSponsored = b.isSponsored || b.adType === AdType.PREMIUM;
    if (aSponsored && !bSponsored) return -1;
    if (!aSponsored && bSponsored) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });
};

export const LojasEServicosList: React.FC<LojasEServicosListProps> = ({ onStoreClick, activeFilter = 'all', user = null, onNavigate, premiumOnly = false }) => {
  const [visibleStores, setVisibleStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const { toggleFavorite, isFavorite } = useFavorites(user);

  // Identifica o Master Store para renderizar separado
  const masterStore = useMemo(() => STORES.find(s => s.id === MASTER_ID), []);

  const filteredPool = useMemo(() => {
    let filtered = [...STORES];
    
    // Remove o Master da lista regular para não duplicar, pois ele terá slot fixo
    filtered = filtered.filter(s => s.id !== MASTER_ID);

    if (premiumOnly) {
      filtered = filtered.filter(s => s.adType === AdType.PREMIUM || s.isSponsored);
    }
    if (activeFilter === 'cashback') {
      filtered = filtered.filter(s => s.cashback && s.cashback > 0);
    } else if (activeFilter === 'open_now') {
      filtered = filtered.filter(s => s.isOpenNow);
    } else if (activeFilter === 'top_rated') {
      filtered = filtered.filter(s => s.rating >= 4.7);
    }
    
    return sortStores(filtered);
  }, [activeFilter, premiumOnly]);

  useEffect(() => {
    setVisibleStores(filteredPool.slice(0, ITEMS_PER_PAGE));
  }, [filteredPool]);

  const loadMore = useCallback(() => {
    if (loading) return;
    if (visibleStores.length >= filteredPool.length) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleStores(prev => {
        const nextBatch = filteredPool.slice(prev.length, prev.length + ITEMS_PER_PAGE);
        return [...prev, ...nextBatch];
      });
      setLoading(false);
    }, 600);
  }, [loading, visibleStores.length, filteredPool]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadMore]);

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { alert("Faça login para favoritar!"); return; }
    await toggleFavorite(id);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4 pb-6">
        
        {/* CARD PATROCINADOR MASTER FIXO */}
        {masterStore && (
           <div 
               onClick={() => onStoreClick && onStoreClick(masterStore)}
               className="relative w-full rounded-[24px] p-[3px] bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 shadow-xl shadow-amber-500/10 cursor-pointer group active:scale-[0.98] transition-all mb-2"
           >
               <div className="bg-white dark:bg-gray-900 rounded-[21px] p-5 relative overflow-hidden h-full">
                   {/* Background Glow */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                   <div className="flex gap-5 items-center">
                       {/* Larger Image for Master */}
                       <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex-shrink-0 overflow-hidden relative shadow-sm">
                            <img 
                               src={masterStore.logoUrl || masterStore.image || '/assets/default-logo.png'} 
                               alt={masterStore.name} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                           />
                       </div>
                       
                       <div className="flex-1 min-w-0 py-1">
                           <div className="flex items-center gap-2 mb-2">
                                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                                   <Crown className="w-3 h-3 fill-white" /> Patrocinador Master
                                </span>
                           </div>
                           <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight truncate mb-1">
                               {masterStore.name}
                           </h3>
                           <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3 font-medium">
                                {masterStore.description || masterStore.category}
                           </p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-800/50">
                                   <Star className="w-3.5 h-3.5 fill-current" />
                                   {masterStore.rating}
                                </div>
                                {(masterStore.cashback || 0) > 0 && (
                                   <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                       <Zap className="w-3.5 h-3.5 fill-current" />
                                       {masterStore.cashback}% Cashback
                                   </div>
                                )}
                            </div>
                       </div>
                   </div>
                    {/* Favorite Button */}
                    <button 
                       onClick={(e) => handleToggleFavorite(e, masterStore.id)} 
                       className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-100 dark:border-gray-700 ${isFavorite(masterStore.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                   >
                       <Heart className={`w-5 h-5 ${isFavorite(masterStore.id) ? 'fill-current' : ''}`} />
                   </button>
               </div>
           </div>
        )}

        {/* LISTA REGULAR */}
        {visibleStores.map((store, index) => {
            const isLast = index === visibleStores.length - 1;
            const isFavorited = isFavorite(store.id);
            const showSponsoredBadge = store.isSponsored || store.adType === AdType.PREMIUM;
            const storeImage = store.logoUrl || store.image || '/assets/default-logo.png';

            return (
                <div
                    key={store.id}
                    ref={isLast ? lastElementRef : null}
                    onClick={() => onStoreClick && onStoreClick(store)}
                    className={`rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-sm border ${showSponsoredBadge ? 'border-slate-100 bg-slate-50/10 dark:bg-white/5' : 'bg-white dark:bg-gray-800 border-transparent'}`}
                >
                    {showSponsoredBadge && (
                      <div className="absolute top-0 right-3 -translate-y-1/2 z-10">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-[#E6E8EC] text-slate-600 shadow-sm uppercase tracking-widest border border-slate-200">Patrocinado</span>
                      </div>
                    )}
                    <div className="w-20 h-20 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-inner">
                        <img 
                            src={storeImage} 
                            alt={store.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {store.cashback && (
                            <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-white text-[8px] font-black text-center py-0.5 uppercase tracking-tighter shadow-sm backdrop-blur-[2px]">
                                CUPOM
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                            {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{store.category} • {store.neighborhood}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-2">
                             <div className="flex items-center gap-0.5 text-yellow-600 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{store.rating}</span>
                             </div>
                             <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                             <span>{store.distance}</span>
                             {store.isOpenNow && <span className="text-emerald-500 font-bold">Aberto</span>}
                        </div>
                    </div>
                    <button onClick={(e) => handleToggleFavorite(e, store.id)} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFavorited ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                </div>
            );
        })}
      </div>
      
      {visibleStores.length < filteredPool.length && (
        <div className="w-full flex justify-center py-10">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-[#1E5BFF] animate-spin" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando mais lojas...</span>
            </div>
        </div>
      )}
    </div>
  );
};
