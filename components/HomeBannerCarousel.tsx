
import React, { useState, useMemo, useEffect } from 'react';
import { Store, AdType } from '../types';
import { STORES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { NeighborhoodBannersGrid } from './NeighborhoodBannersGrid';

interface BannerData {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  bgColor: string;
  neighborhood: string;
  category?: string;
  subcategory?: string;
}

const MOCK_BANNERS: BannerData[] = [
  // Banners Gerais / Home
  {
    id: 'b-fre-1',
    storeId: 'f-1',
    title: 'Bibi Lanches',
    subtitle: 'Almoço especial com suco natural hoje!',
    cta: 'Abrir cardápio',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-orange-600',
    neighborhood: 'Freguesia',
    category: 'Comida'
  },
  {
    id: 'b-fre-2',
    storeId: 'f-5',
    title: 'Pizzaria do Zé',
    subtitle: 'Bordas recheadas grátis nesta terça.',
    cta: 'Pedir agora',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-red-700',
    neighborhood: 'Freguesia',
    category: 'Comida',
    subcategory: 'Pizzarias'
  },
  {
    id: 'b-fre-3',
    storeId: 'f-4',
    title: 'Chaveiro Rápido JPA',
    subtitle: 'Atendimento rápido no bairro',
    cta: 'Falar agora',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-blue-600',
    neighborhood: 'Freguesia',
    category: 'Serviços'
  },
  // 4º BANNER ADICIONADO: Banners por Bairro
  {
    id: 'b-neighborhood-grid',
    storeId: 'internal',
    title: 'Banners por Bairro',
    subtitle: 'Jacarepaguá',
    cta: '',
    image: '',
    bgColor: 'bg-slate-900',
    neighborhood: 'Jacarepaguá (todos)'
  }
];

interface HomeBannerCarouselProps {
  onStoreClick: (store: Store) => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
  subcategoryName?: string;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({ onStoreClick, onNavigate, categoryName, subcategoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();
  const isCategoryView = !!categoryName;

  const bannerCount = useMemo(() => {
    return isCategoryView ? 2 : 4;
  }, [isCategoryView]);

  const activeBanners = useMemo(() => {
    const initialPool = currentNeighborhood === 'Jacarepaguá (todos)'
      ? MOCK_BANNERS
      : MOCK_BANNERS.filter(b => b.neighborhood === currentNeighborhood || b.id === 'b-neighborhood-grid');
    
    let filtered: BannerData[] = [];

    if (subcategoryName) {
      filtered = initialPool.filter(b => b.subcategory === subcategoryName);
    }
    
    if (filtered.length < bannerCount && categoryName) {
      const catBanners = initialPool.filter(b => b.category === categoryName && !filtered.find(f => f.id === b.id));
      filtered = [...filtered, ...catBanners];
    }

    if (filtered.length < bannerCount) {
      const generalBanners = initialPool.filter(b => b.id !== 'b-neighborhood-grid' && !filtered.find(f => f.id === b.id));
      const needed = bannerCount - filtered.length;
      filtered = [...filtered, ...generalBanners.slice(0, needed)];
    }

    return filtered.slice(0, bannerCount);
  }, [currentNeighborhood, categoryName, subcategoryName, bannerCount]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryName, subcategoryName, currentNeighborhood]);

  const handleBannerClick = (banner: BannerData) => {
    if (banner.id === 'b-neighborhood-grid') return;
    
    // Busca a loja real ou cria o mock placeholder
    const store = STORES.find(s => s.id === banner.storeId) || {
      id: banner.storeId,
      name: 'Loja Parceira',
      category: banner.category || 'Destaque',
      subcategory: banner.subcategory || 'Geral',
      description: 'Perfil em construção. Em breve você poderá conferir todos os detalhes, fotos e promoções deste estabelecimento incrível!',
      adType: AdType.PREMIUM,
      rating: 5.0,
      distance: 'Freguesia • RJ',
      verified: true,
      isOpenNow: true,
      image: banner.image,
      logoUrl: '/assets/default-logo.png'
    };

    onStoreClick(store as Store);
  };

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];
  return (
    <div className="px-5 mb-6 bg-white dark:bg-gray-950">
      <div 
        onClick={() => handleBannerClick(currentBanner)}
        className={`relative aspect-[16/12] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] group ${currentBanner.bgColor}`}
      >
        {currentBanner.id === 'b-neighborhood-grid' ? (
          <NeighborhoodBannersGrid onNavigate={onNavigate} />
        ) : (
          <div className="w-full h-full relative">
            <img 
              src={currentBanner.image} 
              alt={currentBanner.title} 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105 pointer-events-none" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            
            <div className="relative h-full flex flex-col justify-center p-8 text-white pointer-events-none">
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
                {currentBanner.title}
              </h2>
              <p className="text-xs font-bold text-white/90 max-w-[200px] leading-tight drop-shadow-sm">
                {currentBanner.subtitle}
              </p>
            </div>
          </div>
        )}

        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {activeBanners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 pointer-events-auto ${idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
