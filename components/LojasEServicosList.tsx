
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Loader2, AlertCircle, BadgeCheck, Heart, Award, Eye, Rocket, Crown } from 'lucide-react';
import { Store, AdType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
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
    
    // RE-APLICA ORDENAÇÃO DE MONETIZAÇÃO MESMO COM FILTROS (Critico)
    const finalData = sortStores(data);

    setFilteredStores(finalData);
    setVisibleStores(finalData.slice(0, ITEMS_PER_PAGE));
    setHasMore(finalData.length > ITEMS_PER_PAGE);
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
          if (currentLength + nextSlice.length >= filteredStores.length) setHasMore(false);
          return [...prev, ...nextSlice];
        });
      } catch (err) { setError(true); } finally { setLoading(false); }
    }, 800);
  }, [loading, hasMore, filteredStores]);

  const lastStoreElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    }, { rootMargin: '100px' });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const handleToggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { alert("Faça login para favoritar lojas!"); return; }
    await toggleFavorite(id);
  };

  const isMasterSponsorFavorite = isFavorite(MASTER_SPONSOR_STORE.id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4 pb-6">
        
        {/* Card do Patrocinador Master - Fixo no topo */}
        <div
          key={MASTER_SPONSOR_STORE.id}
          onClick={() => onNavigate && onNavigate('patrocinador_master')}
          className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99] border-2 border-amber-400/50 dark:border-amber-500/30 shadow-amber-500/10 mt-2"
        >
          <div className="absolute top-0 right-4 -translate-y-1/2 z-10 pointer-events-none">
            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Patrocinador Master
            </span>
          </div>
          <div className="w-[88px] h-[88px] flex-shrink-0 relative rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
            <Crown className="w-10 h-10 text-amber-400" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
            <div className="flex flex-col gap-0.5 mb-1.5">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{MASTER_SPONSOR_STORE.name}</h4>
                <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white shrink-0" />
              </div>
              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 italic">{MASTER_SPONSOR_STORE.description}</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-auto">
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-400 font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{MASTER_SPONSOR_STORE.rating}</span>
              </div>
              <span className="truncate max-w-[80px] font-medium">{MASTER_SPONSOR_STORE.category}</span>
            </div>
          </div>
          <button onClick={(e) => handleToggleFavorite(e, MASTER_SPONSOR_STORE.id)} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${isMasterSponsorFavorite ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-red-400'}`}>
            <Heart className={`w-4 h-4 transition-colors ${isMasterSponsorFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Lista de Lojas normais */}
        {visibleStores.map((store, index) => {
            const isLastElement = index === visibleStores.length - 1;
            const isFavorited = isFavorite(store.id);
            const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
            const { badge, copy, activityBadge } = getStoreExtras(index, store);
            return (
                <div
                    key={store.id}
                    ref={isLastElement ? lastStoreElementRef : null}
                    onClick={() => onStoreClick && onStoreClick(store)}
                    className={`bg-white dark:bg-gray-800 rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99] border-2 ${isSponsored ? 'border-[#1E5BFF]/20 dark:border-[#1E5BFF]/10 mt-2' : 'border-transparent mt-2'}`}
                >
                    {(isSponsored || badge) && (
                      <div className="absolute top-0 right-4 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-end gap-1">
                          {isSponsored && (
                              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-[#1E5BFF] text-white shadow-xl shadow-blue-500/40 uppercase tracking-wider">
                                  Patrocinado
                              </span>
                          )}
                          {badge && !isSponsored && (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                                  {badge.text}
                              </span>
                          )}
                      </div>
                    )}

                    <div className="w-[88px] h-[88px] flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700">
                        <img src={store.logoUrl || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain p-1" loading="lazy" />
                        {store.cashback && (
                            <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[9px] font-bold text-center py-0.5">
                                {store.cashback}% VOLTA
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
                        <div className="flex flex-col gap-0.5 mb-1.5">
                             <div className="flex items-center gap-1.5">
                               <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">{store.name}</h4>
                               {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#1E5BFF] fill-white shrink-0" />}
                             </div>
                             <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 italic">{copy}</p>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-auto">
                             <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-400 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{store.rating}</span>
                             </div>
                             <span className="truncate max-w-[80px] font-medium">{store.category}</span>
                             <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                             <span>{store.distance}</span>
                        </div>
                    </div>
                    
                    <button onClick={(e) => handleToggleFavorite(e, store.id)} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${isFavorited ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-red-400'}`}>
                        <Heart className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                </div>
            );
        })}
      </div>

      {loading && (
        <div className="w-full flex justify-center py-6">
            <div className="flex items-center gap-2 text-[#1E5BFF] bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-blue-50 dark:border-gray-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-bold">Buscando mais opções...</span>
            </div>
        </div>
      )}

      {!hasMore && !loading && (
        <div className="w-full text-center py-8">
            <p className="text-[11px] text-gray-400 dark:text-gray-600 font-medium bg-gray-50 dark:bg-gray-800/50 inline-block px-4 py-1.5 rounded-full">Você viu todas as lojas disponíveis ✨</p>
        </div>
      )}
    </div>
  );
};
