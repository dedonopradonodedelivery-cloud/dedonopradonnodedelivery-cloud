
import React, { useState, useMemo } from 'react';
import { Store, AdType } from '@/types';
import { STORES } from '@/constants';
import { Star, BadgeCheck, ChevronRight, Crown } from 'lucide-react';
import { getStoreLogo } from '@/utils/mockLogos';

interface LojasEServicosListProps {
  onStoreClick: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'top_rated' | 'open_now';
  user?: any;
  onNavigate?: (view: string) => void;
  premiumOnly?: boolean;
}

export const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">{store.name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="flex items-center gap-1 font-bold text-[#1E5BFF]"><Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span className="truncate">{store.category}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {store.distance && <span className="text-[10px] text-gray-400 font-medium">{store.distance}</span>}
          {store.verified && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5"><BadgeCheck className="w-3 h-3" /> Verificado</span>}
        </div>
      </div>
      <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300"><ChevronRight className="w-4 h-4" /></div>
    </div>
  );
};

export const LojasEServicosList: React.FC<LojasEServicosListProps> = ({ 
  onStoreClick, 
  activeFilter = 'all', 
  premiumOnly = false,
  onNavigate 
}) => {
  const [page, setPage] = useState(1);
  
  // Encontrar Patrocinador Master (Mock: Atual Clube)
  const masterStore = useMemo(() => STORES.find(s => s.id === 'atual-clube'), []);

  const handleMasterClick = () => {
    if (masterStore) onStoreClick(masterStore);
  };

  const filteredStores = useMemo(() => {
    let list = STORES;
    if (premiumOnly) {
      list = list.filter(s => s.adType === AdType.PREMIUM || s.isSponsored);
    }
    if (activeFilter === 'top_rated') {
      list = list.filter(s => s.rating >= 4.5);
    }
    if (activeFilter === 'open_now') {
      list = list.filter(s => s.isOpenNow);
    }
    // Remove master store from regular list to avoid duplication
    return list.filter(s => s.id !== 'atual-clube');
  }, [activeFilter, premiumOnly]);

  const displayedStores = filteredStores.slice(0, page * 10);
  const hasMore = displayedStores.length < filteredStores.length;

  return (
    <div className="space-y-4">
        {masterStore && activeFilter === 'all' && !premiumOnly && (
           <div 
               onClick={handleMasterClick}
               className="relative w-full cursor-pointer group active:scale-[0.98] transition-all mb-6 mt-6"
           >
               <div className="absolute top-0 right-6 -translate-y-1/2 z-20">
                  <div className="bg-brand-orange text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                      <Crown className="w-4 h-4 text-white fill-white" />
                      <div className="flex flex-col items-center leading-none">
                          <span className="text-[7px] font-bold uppercase tracking-widest">Patrocinador</span>
                          <span className="text-xs font-black uppercase tracking-wider -mt-0.5">Master</span>
                      </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 pt-8 shadow-lg border border-gray-100 dark:border-gray-800">
                   <div className="flex gap-4 items-center">
                       <div className="w-16 h-16 rounded-full bg-brand-orange flex-shrink-0 flex items-center justify-center shadow-md">
                           <span className="text-white font-black text-3xl">AC</span>
                       </div>
                       <div className="flex-1 min-w-0">
                           <h3 className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tight">Atual Clube</h3>
                           <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-tight font-medium line-clamp-2">{masterStore?.description}</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-2 mt-4">
                       <div className="flex items-center gap-1 text-[10px] font-bold text-brand-orange bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-md">
                          <Star className="w-3 h-3 fill-current" />
                          {masterStore.rating?.toFixed(1)}
                       </div>
                       <div className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                           <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Proteção</span>
                       </div>
                   </div>
               </div>
           </div>
        )}

        {displayedStores.map(store => (
            <StoreCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
        ))}
        
        {hasMore && (
            <button 
                onClick={() => setPage(p => p + 1)}
                className="w-full py-4 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                Carregar mais
            </button>
        )}
    </div>
  );
};
