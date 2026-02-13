
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

const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded uppercase">Ads</span>}
        </div>
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
  
  // Encontrar Patrocinador Master (Mock: Grupo Esquematiza)
  const masterStore = useMemo(() => STORES.find(s => s.id === 'grupo-esquematiza'), []);

  const handleMasterClick = () => {
    if (onNavigate) onNavigate('patrocinador_master');
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
    // Remove master store from regular list to avoid duplication if it appears there
    return list.filter(s => s.id !== 'grupo-esquematiza');
  }, [activeFilter, premiumOnly]);

  const displayedStores = filteredStores.slice(0, page * 10);
  const hasMore = displayedStores.length < filteredStores.length;

  return (
    <div className="space-y-4">
        {/* ============================================================
            SEÇÃO FIXA: PATROCINADOR MASTER (Hero Card Premium)
            REFINAMENTO: Escala ajustada para ~15% maior que cards padrão.
           ============================================================ */}
        {masterStore && activeFilter === 'all' && !premiumOnly && (
           <div 
               onClick={handleMasterClick}
               className="relative w-full rounded-[2.5rem] p-[2px] bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 shadow-[0_15px_35px_rgba(245,158,11,0.12)] cursor-pointer group active:scale-[0.98] transition-all mb-8 mt-6"
           >
               {/* Etiqueta Flutuante — O PROTAGONISTA */}
               <div className="absolute top-0 right-8 -translate-y-1/2 z-20">
                  <span className="bg-slate-900 text-amber-400 text-[8px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest border-2 border-amber-400 flex items-center gap-2 shadow-2xl">
                     <Crown className="w-3 h-3 fill-amber-400" /> Patrocinador Master
                  </span>
               </div>

               {/* Background Integrated Styling */}
               <div className="bg-white dark:bg-gray-900 rounded-[2.4rem] p-5 relative overflow-hidden h-full">
                   {/* Brilho âmbar sutil de fundo */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>

                   <div className="flex gap-5 items-center relative z-10">
                       <div className="w-18 h-18 rounded-[1.5rem] bg-white flex-shrink-0 overflow-hidden relative shadow-xl border-2 border-gray-50 dark:border-gray-800">
                            <img 
                               src={masterStore.logoUrl || masterStore.image || '/assets/default-logo.png'} 
                               alt={masterStore.name} 
                               className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" 
                           />
                       </div>
                       <div className="flex-1 min-w-0">
                           <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight truncate mb-1 uppercase tracking-tighter">{masterStore.name}</h3>
                           <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 font-bold leading-relaxed">{masterStore.description}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 dark:bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-400/20">
                                   <Star className="w-3 h-3 fill-current" />
                                   {masterStore.rating?.toFixed(1)}
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-gray-100 dark:border-white/5">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Holdings</span>
                                </div>
                            </div>
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
        
        {displayedStores.length === 0 && (
            <div className="py-12 text-center">
                <p className="text-gray-400 text-sm">Nenhuma loja encontrada.</p>
            </div>
        )}
    </div>
  );
};
