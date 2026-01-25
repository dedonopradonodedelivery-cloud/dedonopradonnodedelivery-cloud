
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Star, Loader2, BadgeCheck, Heart, Crown, Store as StoreIcon } from 'lucide-react';
import { Store, AdType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { User } from '@supabase/supabase-js';
import { STORES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface LojasEServicosListProps {
  onStoreClick?: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'top_rated' | 'open_now' | 'cashback';
  user?: User | null;
  onNavigate?: (view: string) => void;
  premiumOnly?: boolean; 
}

const ITEMS_PER_PAGE = 12;
const MASTER_ID = 'grupo-esquematiza';

// Função para embaralhar array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const LojasEServicosList: React.FC<LojasEServicosListProps> = ({ onStoreClick, activeFilter = 'all', user = null, onNavigate, premiumOnly = false }) => {
  const [visibleStores, setVisibleStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const { currentNeighborhood } = useNeighborhood();
  
  const { toggleFavorite, isFavorite } = useFavorites(user);

  // Identifica o Patrocinador Master do Bairro atual
  const masterStore = useMemo(() => {
    // Busca o estabelecimento que é master (ID específico por enquanto para o MVP)
    const master = STORES.find(s => s.id === MASTER_ID);
    if (!master) return null;
    
    // Regra: Só exibe se o bairro bater ou se estiver em "Todos"
    const matchHood = currentNeighborhood === "Jacarepaguá (todos)" || master.neighborhood === currentNeighborhood;
    return matchHood ? master : null;
  }, [currentNeighborhood]);

  // Pool final de lojas filtradas (Removendo o master da lista comum para não duplicar)
  const filteredPool = useMemo(() => {
    let pool = STORES.filter(s => s.id !== MASTER_ID);

    // Filtro por Bairro
    if (currentNeighborhood !== "Jacarepaguá (todos)") {
        pool = pool.filter(s => s.neighborhood === currentNeighborhood);
    }

    // Filtros de UI
    if (premiumOnly) {
      pool = pool.filter(s => s.adType === AdType.PREMIUM || s.isSponsored);
    }
    if (activeFilter === 'open_now') {
      pool = pool.filter(s => s.isOpenNow);
    } else if (activeFilter === 'top_rated') {
      pool = pool.filter(s => (s.rating || 0) >= 4.7);
    } else if (activeFilter === 'cashback') {
      pool = pool.filter(s => s.cashback_active);
    }

    // Regra: 6 Primeiras Patrocinadas Aleatórias
    const sponsored = pool.filter(s => s.isSponsored || s.adType === AdType.PREMIUM);
    const organic = pool.filter(s => !s.isSponsored && s.adType !== AdType.PREMIUM);

    const shuffledSponsored = shuffleArray(sponsored);
    const top6 = shuffledSponsored.slice(0, 6);
    const remainingSponsored = shuffledSponsored.slice(6);
    
    const remainingPool = shuffleArray([...remainingSponsored, ...organic]);

    return [...top6, ...remainingPool];
  }, [activeFilter, premiumOnly, currentNeighborhood]);

  // Resetar ao trocar filtro ou bairro
  useEffect(() => {
    setPage(1);
    setVisibleStores(filteredPool.slice(0, ITEMS_PER_PAGE));
  }, [filteredPool]);

  // Função para carregar mais itens
  const loadMore = useCallback(() => {
    if (loading) return;
    if (visibleStores.length >= filteredPool.length) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleStores(prev => {
        const nextPage = page + 1;
        setPage(nextPage);
        const start = prev.length;
        const end = start + ITEMS_PER_PAGE;
        const nextBatch = filteredPool.slice(start, end);
        return [...prev, ...nextBatch];
      });
      setLoading(false);
    }, 800);
  }, [loading, visibleStores.length, filteredPool, page]);

  // Sentinel para detectar o final da lista
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, {
      rootMargin: '200px'
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
        
        {/* ============================================================
            CARD PATROCINADOR MASTER (PREMIUM / DESTACADO)
           ============================================================ */}
        {masterStore && activeFilter === 'all' && page === 1 && (
           <div 
               onClick={() => onStoreClick && onStoreClick(masterStore)}
               className="relative w-full rounded-[28px] p-[2.5px] bg-gradient-to-r from-[#1E5BFF] via-[#4D7CFF] to-[#1E5BFF] shadow-[0_10px_30px_rgba(30,91,255,0.2)] cursor-pointer group active:scale-[0.98] transition-all mb-4 animate-in fade-in slide-in-from-top-4 duration-700"
           >
               <div className="bg-white dark:bg-gray-900 rounded-[26px] p-6 relative overflow-hidden h-full">
                   {/* Efeito de brilho de fundo */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                   
                   <div className="flex gap-5 items-center">
                       <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex-shrink-0 overflow-hidden relative shadow-sm">
                            <img 
                               src={masterStore.logoUrl || masterStore.image || '/assets/default-logo.png'} 
                               alt={masterStore.name} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                           />
                       </div>
                       <div className="flex-1 min-w-0 py-1">
                           <div className="flex items-center gap-2 mb-2.5">
                                <span className="bg-[#1E5BFF] text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] shadow-sm flex items-center gap-1.5 border border-white/20">
                                   <Crown className="w-3 h-3 fill-white" /> Patrocinador Master
                                </span>
                           </div>
                           <h3 className="font-black text-2xl text-gray-900 dark:text-white leading-tight truncate mb-1 tracking-tighter">{masterStore.name}</h3>
                           <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-4 font-medium uppercase tracking-widest">{masterStore.subcategory}</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-xs font-bold text-[#1E5BFF] bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                                   <Star className="w-3.5 h-3.5 fill-current" />
                                   {masterStore.rating?.toFixed(1)}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{masterStore.neighborhood}</span>
                            </div>
                       </div>
                   </div>
                    <button 
                       onClick={(e) => handleToggleFavorite(e, masterStore.id)} 
                       className={`absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-100 dark:border-gray-700 ${isFavorite(masterStore.id) ? 'text-red-500' : 'text-gray-300'}`}
                   >
                       <Heart className={`w-5 h-5 ${isFavorite(masterStore.id) ? 'fill-current' : ''}`} />
                   </button>
               </div>
           </div>
        )}

        {/* ============================================================
            LISTA COMUM DE LOJAS
           ============================================================ */}
        {visibleStores.map((store, index) => {
            const isLast = index === visibleStores.length - 1;
            const isFavorited = isFavorite(store.id);
            const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
            const storeImage = store.logoUrl || store.image || '/assets/default-logo.png';

            return (
                <div
                    key={store.id}
                    ref={isLast ? lastElementRef : null}
                    onClick={() => onStoreClick && onStoreClick(store)}
                    className={`rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-sm border ${isSponsored ? 'border-slate-100 bg-slate-50/10 dark:bg-white/5' : 'bg-white dark:bg-gray-800 border-transparent'}`}
                >
                    {isSponsored && (
                      <div className="absolute top-0 right-3 -translate-y-1/2 z-10">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 shadow-sm uppercase tracking-widest border border-gray-200 dark:border-gray-600">Patrocinado</span>
                      </div>
                    )}
                    <div className="w-20 h-20 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-inner">
                        <img 
                            src={storeImage} 
                            alt={store.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                            {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#1E5BFF] shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{store.category} • {store.neighborhood || store.distance}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-2">
                             <div className="flex items-center gap-0.5 text-yellow-600 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{store.rating?.toFixed(1) || '4.5'}</span>
                             </div>
                             <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                             <span>{store.distance}</span>
                             {store.isOpenNow && <span className="text-emerald-500 font-bold ml-1">Aberto</span>}
                        </div>
                    </div>
                    <button onClick={(e) => handleToggleFavorite(e, store.id)} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFavorited ? 'text-red-500' : 'text-gray-300'}`}>
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                </div>
            );
        })}
      </div>
      
      {/* INDICADOR DE CARREGAMENTO */}
      {loading && (
        <div className="w-full flex justify-center py-6">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-6 py-2.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                <Loader2 className="w-4 h-4 text-[#1E5BFF] animate-spin" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando mais lojas...</span>
            </div>
        </div>
      )}

      {/* FIM DA LISTA */}
      {!loading && visibleStores.length >= filteredPool.length && visibleStores.length > 0 && (
        <div className="w-full text-center py-10 opacity-30 flex flex-col items-center gap-2">
            <StoreIcon size={24} className="text-gray-400" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Você explorou todas as lojas</p>
        </div>
      )}
    </div>
  );
};
