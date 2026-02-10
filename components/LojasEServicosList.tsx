
import React, { useState, useMemo } from 'react';
import { Store, AdType } from '../types';
import { STORES } from '../constants';
import { Star, BadgeCheck, ChevronRight, Crown } from 'lucide-react';

const FALLBACK_STORE_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600', // Loja General
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600', // Restaurante
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600', // Beleza
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600', // Casa
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600', // Profissional
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600'  // Pet
];

const getFallbackStoreImage = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FALLBACK_STORE_IMAGES[Math.abs(hash) % FALLBACK_STORE_IMAGES.length];
};

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
  const storeImage = store.logoUrl || store.image || getFallbackStoreImage(store.id);

  return (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={storeImage} alt={store.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{store.name}</h4>
          {isSponsored && <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase">Ads</span>}
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
            SEÇÃO FIXA: PATROCINADOR MASTER (Hero Card)
           ============================================================ */}
        {masterStore && activeFilter === 'all' && !premiumOnly && (
           <div 
               onClick={handleMasterClick}
               className="relative w-full rounded-[2rem] p-[2px] bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.15)] cursor-pointer group active:scale-[0.98] transition-all mb-6 mt-4"
           >
               {/* Etiqueta Reposicionada (Flutuando na borda) */}
               <div className="absolute top-0 right-6 -translate-y-1/2 z-20">
                  <span className="bg-slate-900 text-amber-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/30 flex items-center gap-1.5 shadow-lg">
                     <Crown className="w-3 h-3 fill-amber-400" /> Patrocinador Master
                  </span>
               </div>

               <div className="bg-slate-900 dark:bg-slate-900 rounded-[1.9rem] p-5 relative overflow-hidden h-full">
                   {/* Efeito de brilho de fundo */}
                   <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                   <div className="flex gap-4 items-center relative z-10">
                       <div className="w-20 h-20 rounded-2xl bg-white flex-shrink-0 overflow-hidden relative shadow-xl border-2 border-slate-700">
                            <img 
                               src={masterStore.logoUrl || masterStore.image || getFallbackStoreImage(masterStore.id)} 
                               alt={masterStore.name} 
                               className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" 
                           />
                       </div>
                       <div className="flex-1 min-w-0 pt-1">
                           <h3 className="font-black text-lg text-white leading-tight truncate mb-1 tracking-tighter uppercase">{masterStore.name}</h3>
                           <p className="text-[10px] text-slate-400 line-clamp-2 mb-3 font-medium leading-relaxed">{masterStore.description}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                                   <Star className="w-3 h-3 fill-current" />
                                   {masterStore.rating?.toFixed(1)}
                                </div>
                                <div className="bg-slate-800 px-2 py-1 rounded-lg border border-white/5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Holdings</span>
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
