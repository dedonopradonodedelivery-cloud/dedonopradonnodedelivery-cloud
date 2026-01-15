
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Loader2, AlertCircle, BadgeCheck, Heart, Award, Eye, Rocket, Crown, Store as StoreIcon } from 'lucide-react';
import { Store, AdType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { User } from '@supabase/supabase-js';

interface LojasEServicosListProps {
  onStoreClick?: (store: Store) => void;
  onViewAll?: () => void;
  activeFilter?: 'all' | 'cashback' | 'top_rated' | 'open_now';
  user?: User | null;
  onNavigate?: (view: string) => void;
  premiumOnly?: boolean; 
}

const CATEGORIES_MOCK = ['Alimentação', 'Beleza', 'Serviços', 'Pets', 'Moda', 'Saúde', 'Autos', 'Mercado', 'Casa', 'Esportes'];
const NEIGHBORHOODS_MOCK = ['Freguesia', 'Taquara', 'Pechincha', 'Tanque', 'Anil', 'Curicica', 'Gardênia'];
const TAGS_MOCK = ['Verificado', 'Destaque', 'Promoção', null];

// Função para gerar dados fake robustos
const generateFakeStores = (count: number): Store[] => {
  return Array.from({ length: count }, (_, i) => {
    const catIndex = i % CATEGORIES_MOCK.length;
    const hoodIndex = i % NEIGHBORHOODS_MOCK.length;
    const tag = TAGS_MOCK[i % TAGS_MOCK.length];
    const isPremium = i % 12 === 0; 
    const isSponsored = i % 18 === 0; 
    const hasCashback = i % 4 === 0; 
    const isOpenNow = Math.random() > 0.3; 

    return {
      id: `fake-infinite-${i}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${CATEGORIES_MOCK[catIndex]} ${['da Vila', 'Express', 'Premium', 'do Bairro', 'Center', 'Point'][i % 6]}`,
      category: CATEGORIES_MOCK[catIndex],
      subcategory: 'Geral',
      logoUrl: '', 
      rating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
      reviewsCount: Math.floor(Math.random() * 300) + 5,
      description: 'O melhor atendimento da região, venha conferir nossas ofertas.',
      distance: `${(0.5 + Math.random() * 5.5).toFixed(1)} km`,
      neighborhood: NEIGHBORHOODS_MOCK[hoodIndex],
      adType: isPremium ? AdType.PREMIUM : AdType.ORGANIC,
      isSponsored: isSponsored || isPremium,
      verified: i % 3 === 0 || tag === 'Verificado',
      cashback: hasCashback ? (Math.floor(Math.random() * 12) + 3) : undefined,
      address: `Rua Principal, ${100 + i}`,
      isOpenNow: isOpenNow,
    };
  });
};

const MASTER_SPONSOR_STORE: Store = {
  id: 'master-sponsor-esquematiza',
  name: 'Grupo Esquematiza',
  category: 'Segurança & Facilities',
  subcategory: 'Patrocinador Master',
  logoUrl: '', 
  rating: 5.0,
  reviewsCount: 999,
  description: 'Segurança e serviços com excelência para empresas e condomínios.',
  distance: '0.2 km',
  neighborhood: 'Freguesia',
  adType: AdType.PREMIUM,
  isSponsored: true,
  verified: true,
  isOpenNow: true,
  cashback: 10,
};

const ITEMS_PER_PAGE = 12;
const TOTAL_MOCK_COUNT = 64;

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
  const [pool, setPool] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const { toggleFavorite, isFavorite } = useFavorites(user);

  // Inicializa o pool de dados
  useEffect(() => {
    const initialPool = generateFakeStores(TOTAL_MOCK_COUNT);
    setPool(initialPool);
    
    let filtered = [...initialPool];
    if (premiumOnly) {
      filtered = filtered.filter(s => s.adType === AdType.PREMIUM || s.isSponsored);
    }
    if (activeFilter === 'cashback') {
      filtered = filtered.filter(s => s.cashback && s.cashback > 0);
    } else if (activeFilter === 'open_now') {
      filtered = filtered.filter(s => s.isOpenNow);
    }
    
    const sorted = sortStores(filtered);
    setVisibleStores(sorted.slice(0, ITEMS_PER_PAGE));
  }, [activeFilter, premiumOnly]);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    
    setTimeout(() => {
      setVisibleStores(prev => {
        const nextBatchSize = ITEMS_PER_PAGE;
        const currentCount = prev.length;
        let moreItems: Store[] = [];
        
        if (currentCount + nextBatchSize > pool.length) {
            const extra = generateFakeStores(TOTAL_MOCK_COUNT).sort(() => Math.random() - 0.5);
            setPool(currentPool => [...currentPool, ...extra]);
            moreItems = extra.slice(0, nextBatchSize);
        } else {
            moreItems = pool.slice(currentCount, currentCount + nextBatchSize);
        }
        return [...prev, ...moreItems];
      });
      setLoading(false);
    }, 800);
  }, [loading, pool]);

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
        {activeFilter === 'all' && (
          <div
            onClick={() => onNavigate && onNavigate('patrocinador_master')}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 flex gap-4 cursor-pointer relative group transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-2 border-amber-500 mt-2 min-h-[140px]"
          >
            <div className="absolute top-0 right-4 -translate-y-1/2 z-10">
              <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-amber-500 text-slate-900 shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3 h-3" /> Patrocinador Master
              </span>
            </div>
            <div className="w-24 h-full flex-shrink-0 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <Crown className="w-10 h-10 text-amber-500" />
            </div>
            <div className="flex-1 flex flex-col justify-center min-w-0 pr-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">{MASTER_SPONSOR_STORE.name}</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{MASTER_SPONSOR_STORE.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/10 px-1.5 py-0.5 rounded text-yellow-700 font-bold text-[10px]">
                  <Star className="w-2.5 h-2.5 fill-current" /> {MASTER_SPONSOR_STORE.rating}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{MASTER_SPONSOR_STORE.neighborhood}</span>
              </div>
            </div>
          </div>
        )}
        
        {visibleStores.map((store, index) => {
            const isLast = index === visibleStores.length - 1;
            const isFavorited = isFavorite(store.id);
            const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;

            return (
                <div
                    key={store.id}
                    ref={isLast ? lastElementRef : null}
                    onClick={() => onStoreClick && onStoreClick(store)}
                    className={`rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-sm border ${isSponsored ? 'border-[#1E5BFF]/20 bg-blue-50/10 dark:bg-blue-900/5' : 'bg-white dark:bg-gray-800 border-transparent'}`}
                >
                    {isSponsored && (
                      <div className="absolute top-0 right-3 -translate-y-1/2 z-10">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-[#1E5BFF] text-white shadow-md uppercase tracking-widest">Ads</span>
                      </div>
                    )}
                    <div className="w-20 h-20 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <StoreIcon className="w-8 h-8 opacity-20" />
                        </div>
                        {store.cashback && (
                            <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-white text-[8px] font-black text-center py-0.5 uppercase">
                                {store.cashback}% Cashback
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
      <div className="w-full flex justify-center py-10">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#1E5BFF] animate-spin" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando mais lojas...</span>
        </div>
      </div>
    </div>
  );
};
