
import React, { useState, useMemo } from 'react';
import { Store, AdType } from '@/types';
import { STORES } from '@/constants';
import { Star, BadgeCheck, ChevronRight } from 'lucide-react';

interface LojasEServicosListProps {
  onStoreClick: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'top_rated' | 'open_now';
  user?: any;
  premiumOnly?: boolean;
}

export const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
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
}) => {
  const [page, setPage] = useState(1);
  
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
