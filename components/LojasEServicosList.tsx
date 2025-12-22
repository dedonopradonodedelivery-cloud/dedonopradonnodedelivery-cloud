

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Loader2, AlertCircle, BadgeCheck, Heart, Award, Eye, Rocket, Crown } from 'lucide-react';
import { Store, AdType } from '../types.ts';
import { useFavorites } from '../hooks/useFavorites.ts';
import { User } from '@supabase/supabase-js';

interface LojasEServicosListProps {
  onStoreClick?: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'cashback' | 'top_rated' | 'open_now';
  user?: User | null;
  onNavigate?: (view: string) => void;
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
      logoUrl: '/assets/default-logo.png',
      rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 500) + 10,
      description: 'O melhor atendimento da região.',
      distance: `${(Math.random() * 5).toFixed(1)}km`,
      adType: isPremium ? AdType.PREMIUM : AdType.ORGANIC,
      isSponsored: isSponsored || isPremium,
      verified: i % 2 === 0,
      cashback: hasCashback ? (Math.floor(Math.random() * 10) + 2) : undefined,
      address: 'Rua Exemplo, 123',
      isOpenNow: isOpenNow,
    };
  });
};

const MASTER_SPONSOR_STORE: Store = {
  id: 'master-sponsor-esquematiza',
  name: 'Grupo Esquematiza',
  category: 'Segurança & Facilities',
  subcategory: 'Patrocinador Master',
  logoUrl: '', // Rendered as an icon
  rating: 5.0,
  reviewsCount: 999,
  description: 'Segurança e serviços com excelência para empresas e condomínios.',
  distance: 'Freguesia • RJ',
  adType: AdType.PREMIUM,
  isSponsored: true,
  verified: true,
  isOpenNow: true,
  cashback: 10, // Example value
};

// ALGORITMO CRÍTICO: ORDENAÇÃO POR MONETIZAÇÃO
const sortStores = (stores: Store[]) => {
  return stores.sort((a, b) => {
    // 1. PRIORIDADE MÁXIMA: PREMIUM E PATROCINADOS (Obrigatório por contrato)
    const aSponsored = a.isSponsored || a.adType === AdType.PREMIUM;
    const bSponsored = b.isSponsored || b.adType === AdType.PREMIUM;
    if (aSponsored && !bSponsored) return -1;
    if (!aSponsored && bSponsored) return 1;

    // 2. PRIORIDADE SECUNDÁRIA: LOCAL ADS (Ocupam a segunda camada)
    const aLocal = a.adType === AdType.LOCAL;
    const bLocal = b.adType === AdType.LOCAL;
    if (aLocal && !bLocal) return -1;
    if (!aLocal && bLocal) return 1;

    // 3. PRIORIDADE TERCIÁRIA: ALTA REPUTAÇÃO + CASHBACK (Incentivo de uso)
    const aSmart = (a.rating >= 4.5 && (a.cashback || 0) > 0);
    const bSmart = (b.rating >= 4.5 && (b.cashback || 0) > 0);
    if (aSmart && !bSmart) return -1;
    if (!aSmart && bSmart) return 1;

    // 4. ORDEM ORGÂNICA POR AVALIAÇÃO
    return (b.rating || 0) - (a.rating || 0);
  });
};

const RAW_STORES = generateFakeStores();
const ALL_SORTED_STORES = sortStores([...RAW_STORES]);
const ITEMS_PER_PAGE = 12;

const getStoreExtras = (index: number, store: Store) => {
  let badge = null;
  let activityBadge = null;
  
  if (store.cashback && store.cashback > 8) {
     badge = { text: '💸 Cashback Alto', color: 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300' };
  } else if (store.rating >= 4.9) {
     badge = { text: '⭐ Favorita da Freguesia', color: 'bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' };
  } else if ((store.reviewsCount || 0) > 300) {
     badge = { text: '🔥 Mais visitada', color: 'bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' };
  } else if (store.isSponsored) {
     badge = { text: '💎 Destaque Premium', color: 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' };
  } else if (index % 5 === 0) {
     badge = { text: '⚡ Responde rápido', color: 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' };
  }

  if (Math.random() > 0.8) {
      if (Math.random() > 0.5) {
          activityBadge = { text: '👀 3 pessoas vendo', icon: Eye, color: 'text-gray-500 bg-gray-50 dark:bg-gray-700' };
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
  const copy = copies[index % copies.length];
  return { badge, copy, activityBadge };
};

export const LojasEServicosList: React.FC<LojasEServicosListProps> = ({ onStoreClick, onViewAll, activeFilter = 'all', user = null, onNavigate }) => {
  const [visibleStores, setVisibleStores] = useState<Store[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites(user);

  const filteredStores = useMemo(() => {
    let list = [...ALL_SORTED_STORES];

    if (activeFilter === 'cashback') {
      list = list.filter(store => !!store.cashback && (store.cashback > 0));
    } else if (activeFilter === 'top_rated') {
      list = list.filter(store => (store.rating || 0) >= 4.5);
    } else if (activeFilter === 'open_now') {
      list = list.filter(store => store.isOpenNow);
    }
    // 'all' filter needs no additional filtering here as it's the base list

    return list;
  }, [activeFilter]);

  const loadMoreStores = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      const newStores = filteredStores.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
      setVisibleStores(prev => [...prev, ...newStores]);
      setPage(prev => prev + 1);
      setHasMore(newStores.length === ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 500); // Simulate network delay
  }, [loadingMore, hasMore, page, filteredStores]);

  useEffect(() => {
    // Reset list and pagination when filter changes
    setVisibleStores([]);
    setPage(0);
    setHasMore(true);
    loadMoreStores();
  }, [activeFilter, filteredStores]); // Depend on activeFilter and filteredStores

  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreStores();
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loadingMore, loadMoreStores]);

  return (
    <div className="flex flex-col gap-4">
      {visibleStores.length > 0 ? (
        visibleStores.map((store, index) => {
          const { badge, copy, activityBadge } = getStoreExtras(index, store);
          return (
            <div
              key={store.id}
              onClick={() => onStoreClick && onStoreClick(store)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 flex gap-4 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors relative overflow-hidden"
            >
              {/* Top Right Badges */}
              {badge && (
                <div className="absolute top-2 right-2 z-10">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
              )}
              {activityBadge && (
                <div className="absolute top-2 left-2 z-10">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 ${activityBadge.color}`}>
                    {React.cloneElement(activityBadge.icon, { className: 'w-3 h-3' })} {activityBadge.text}
                  </span>
                </div>
              )}

              {/* Store Content */}
              <div className="w-24 h-20 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
                <img
                  src={store.logoUrl || '/assets/default-logo.png'}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                {store.cashback && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 text-white text-[9px] font-bold text-center py-0.5 backdrop-blur-sm">
                    {store.cashback}% VOLTA
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight truncate">
                      {store.name}
                    </h3>
                    {store.verified && (
                      <BadgeCheck className="w-4 h-4 text-white fill-[#1E5BFF]" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {copy}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
                  <div className="flex items-center gap-0.5 text-[#1E5BFF] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{store.rating}</span>
                  </div>
                  <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                  <span className="truncate">{store.subcategory || store.category}</span>
                  <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                  <span>{store.distance}</span>
                </div>
              </div>

              {user && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(store.id); }}
                  className="absolute bottom-3 right-3 p-1 text-gray-400 hover:text-red-500 transition-colors active:scale-110"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(store.id) ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-400'}`} />
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Nenhum local encontrado.</p>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="mt-4 text-sm font-bold text-[#1E5BFF] hover:underline"
            >
              Ver todos os locais
            </button>
          )}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 text-[#1E5BFF] animate-spin" />
        </div>
      )}
      {!loadingMore && hasMore && <div ref={loaderRef} className="h-1" />}
    </div>
  );
};
