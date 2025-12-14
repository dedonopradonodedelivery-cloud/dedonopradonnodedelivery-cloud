
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Loader2, AlertCircle, BadgeCheck, Heart, Coins, TrendingUp, Zap, Award, Eye, Rocket } from 'lucide-react';
import { Store, AdType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { User } from '@supabase/supabase-js';

interface LojasEServicosListProps {
  onStoreClick?: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'cashback' | 'top_rated' | 'open_now';
  user?: User | null;
}

const CATEGORIES_MOCK = ['Alimentação', 'Beleza', 'Serviços', 'Pets', 'Moda', 'Saúde'];
const SUBCATEGORIES_MOCK = ['Restaurante', 'Salão', 'Manutenção', 'Pet Shop', 'Roupas', 'Clínica'];

const generateFakeStores = (): Store[] => {
  return Array.from({ length: 64 }, (_, i) => {
    const catIndex = i % CATEGORIES_MOCK.length;
    const isPremium = i % 10 === 0; 
    const isSponsored = i % 15 === 0; 
    const hasCashback = i % 3 === 0 && !isPremium && !isSponsored; 
    const isOpenNow = Math.random() > 0.4; 

    return {
      id: `fake-infinite-${i}`,
      name: `Loja Comercial ${i + 1}`,
      category: CATEGORIES_MOCK[catIndex],
      subcategory: SUBCATEGORIES_MOCK[catIndex],
      logoUrl: '/assets/default-logo.png', // Usando logoUrl padrão
      rating: Number((3.8 + Math.random() * 1.2).toFixed(1)), // Ratings um pouco melhores para parecer aspiracional
      reviewsCount: Math.floor(Math.random() * 500) + 10,
      description: 'O melhor atendimento da região.',
      distance: `${(Math.random() * 5).toFixed(1)}km`,
      adType: isPremium ? AdType.PREMIUM : AdType.ORGANIC,
      isSponsored: isSponsored || isPremium,
      verified: i % 2 === 0, // Mais verificados
      cashback: hasCashback ? (Math.floor(Math.random() * 10) + 2) : undefined,
      address: 'Rua Exemplo, 123',
      isOpenNow: isOpenNow,
    };
  });
};

const sortStores = (stores: Store[]) => {
  return stores.sort((a, b) => {
    // 1. Sponsored / Premium (Paid Priority)
    const aSponsored = a.isSponsored || a.adType === AdType.PREMIUM;
    const bSponsored = b.isSponsored || b.adType === AdType.PREMIUM;

    if (aSponsored && !bSponsored) return -1;
    if (!aSponsored && bSponsored) return 1;

    // 2. Smart Recommendation: High Rating + Cashback (Simulates "Best Value")
    const aSmart = (a.rating >= 4.5 && (a.cashback || 0) > 0);
    const bSmart = (b.rating >= 4.5 && (b.cashback || 0) > 0);
    if (aSmart && !bSmart) return -1;
    if (!aSmart && bSmart) return 1;

    // 3. Cashback Availability
    const aHasCashback = !!a.cashback;
    const bHasCashback = !!b.cashback;

    if (aHasCashback && !bHasCashback) return -1;
    if (!aHasCashback && bHasCashback) return 1;

    // 4. Rating as Tie-breaker
    return (b.rating || 0) - (a.rating || 0);
  });
};

const RAW_STORES = generateFakeStores();
const ALL_SORTED_STORES = sortStores([...RAW_STORES]);
const ITEMS_PER_PAGE = 12;

const getStoreExtras = (index: number, store: Store) => {
  let badge = null;
  let activityBadge = null; // New live activity badge
  
  // Static Badges logic
  if (store.cashback && store.cashback > 8) {
     badge = { text: '💸 Cashback Alto', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' };
  } else if (store.rating >= 4.9) {
     badge = { text: '⭐ Favorita da Freguesia', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' };
  } else if ((store.reviewsCount || 0) > 300) {
     badge = { text: '🔥 Mais visitada', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' };
  } else if (store.isSponsored) {
     badge = { text: '💎 Destaque Premium', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
  } else if (index % 5 === 0) {
     badge = { text: '⚡ Responde rápido', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
  }

  // Live Activity Badges (Random logic for demo feeling)
  // Only show on ~20% of items to not clutter
  if (Math.random() > 0.8) {
      if (Math.random() > 0.5) {
          activityBadge = { text: '👀 3 pessoas vendo', icon: Eye, color: 'text-gray-500 bg-gray-100 dark:bg-gray-700' };
      } else {
          activityBadge = { text: '🚀 Em alta agora', icon: Rocket, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' };
      }
  }

  const copies = [
    "Muito elogiada pelos moradores",
    "Clientes voltam sempre",
    "Atendimento 5 estrelas",
    "Uma das mais recomendadas",
    "Sucesso absoluto no bairro",
    "Qualidade garantida"
  ];
  
  // Deterministic copy based on index
  const copy = copies[index % copies.length];

  return { badge, copy, activityBadge };
};

export const LojasEServicosList: React.FC<LojasEServicosListProps> = ({ onStoreClick, onViewAll, activeFilter = 'all', user = null }) => {
  const [visibleStores, setVisibleStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  
  const { toggleFavorite, isFavorite } = useFavorites(user);
  
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let data = [...ALL_SORTED_STORES];

    if (activeFilter === 'cashback') {
        data = data.filter(s => s.cashback && s.cashback > 0);
    } else if (activeFilter === 'top_rated') {
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeFilter === 'open_now') {
        data = data.filter(s => s.isOpenNow);
    }

    setFilteredStores(data);
    setVisibleStores(data.slice(0, ITEMS_PER_PAGE));
    setHasMore(data.length > ITEMS_PER_PAGE);
  }, [activeFilter]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(false);

    setTimeout(() => {
      try {
        setVisibleStores(prev => {
          const currentLength = prev.length;
          const nextSlice = filteredStores.slice(currentLength, currentLength + ITEMS_PER_PAGE);
          
          if (currentLength + nextSlice.length >= filteredStores.length) {
            setHasMore(false);
          }
          
          return [...prev, ...nextSlice];
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [loading, hasMore, filteredStores]);

  const lastStoreElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
        rootMargin: '100px' 
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
        alert("Faça login para favoritar lojas!");
        return;
    }
    await toggleFavorite(id);
  };

  return (
    <div className="flex flex-col w-full pb-4">
      
      <div className="flex justify-between items-end mb-4 px-1">
        <h3 className="text-base font-bold text-gray-800 dark:text-white leading-none flex items-center gap-2">
          <Award className="w-4 h-4 text-[#1E5BFF]" />
          Lojas & Serviços
        </h3>
        {onViewAll ? (
            <button 
                onClick={onViewAll}
                className="text-xs font-bold text-[#1E5BFF] hover:text-[#1749CC] transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full"
            >
                Ver tudo
            </button>
        ) : (
            <span className="text-[10px] text-gray-400 font-medium">
              {visibleStores.length} de {filteredStores.length}
            </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {visibleStores.map((store, index) => {
            const isLastElement = index === visibleStores.length - 1;
            const isFavorited = isFavorite(store.id);
            const { badge, copy, activityBadge } = getStoreExtras(index, store);
            
            return (
                <div
                    key={store.id}
                    ref={isLastElement ? lastStoreElementRef : null}
                    onClick={() => onStoreClick && onStoreClick(store)}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 border ${badge?.text === '💎 Destaque Premium' ? 'border-purple-100 dark:border-purple-900/50 shadow-md' : 'border-gray-100 dark:border-gray-700 shadow-sm'} hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]`}
                >
                    {/* Badge Positioned Top Right */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none flex flex-col items-end gap-1">
                        {badge && (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                                {badge.text}
                            </span>
                        )}
                        {/* Live Activity Badge */}
                        {activityBadge && (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${activityBadge.color}`}>
                                <activityBadge.icon className="w-2.5 h-2.5" />
                                {activityBadge.text}
                            </span>
                        )}
                    </div>

                    <div className="w-[88px] h-[88px] flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                        <img 
                            src={store.logoUrl || "/assets/default-logo.png"} 
                            alt={store.name} 
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                        />
                        {store.cashback && (
                            <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[9px] font-bold text-center py-0.5">
                                {store.cashback}% VOLTA
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                        <div className="flex flex-col gap-0.5 mb-1.5">
                             <div className="flex items-center gap-1.5 pr-16"> {/* Padding right to avoid overlap with badge */}
                               <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
                                  {store.name}
                               </h4>
                               {store.verified && (
                                 <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white shrink-0" aria-label="Verificado" />
                               )}
                             </div>
                             
                             {/* Emotional Micro-copy */}
                             <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 italic">
                                {copy}
                             </p>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-auto">
                             <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-400 font-bold border border-yellow-100 dark:border-yellow-800/30">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{store.rating}</span>
                             </div>
                             <span className="truncate max-w-[80px] font-medium">{store.category}</span>
                             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                             <span>{store.distance}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={(e) => handleToggleFavorite(e, store.id)}
                        className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${
                            isFavorited 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500' 
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-red-400'
                        }`}
                    >
                        <Heart 
                            className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-current' : ''}`} 
                        />
                    </button>
                </div>
            );
        })}
      </div>

      {loading && (
        <div className="w-full flex justify-center py-6">
            <div className="flex items-center gap-2 text-[#1E5BFF] bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-blue-100 dark:border-gray-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold">Buscando mais opções...</span>
            </div>
        </div>
      )}

      {error && (
        <div className="w-full flex justify-center py-4">
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold">Erro ao carregar.</span>
                <button onClick={() => { setHasMore(true); loadMore(); }} className="underline ml-1 font-bold">Tentar novamente</button>
            </div>
        </div>
      )}

      {!hasMore && !loading && (
        <div className="w-full text-center py-8">
            <p className="text-[11px] text-gray-400 dark:text-gray-600 font-medium bg-gray-50 dark:bg-gray-800/50 inline-block px-4 py-1.5 rounded-full">
                Você viu todas as lojas disponíveis ✨
            </p>
        </div>
      )}
    </div>
  );
};
