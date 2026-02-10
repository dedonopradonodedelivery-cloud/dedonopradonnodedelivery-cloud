
import React, { useState, useMemo, useEffect } from 'react';
import { Store, AdType } from '../types';
import { STORES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface BannerData {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  bgColor: string;
  neighborhood: string;
  category: string;
  subcategory?: string;
}

const MOCK_BANNERS: BannerData[] = [
  {
    id: 'b-saude-1',
    storeId: 'fake-saude-banner',
    title: 'Clínica Bem Estar',
    subtitle: 'Cuidado completo para sua família com especialistas.',
    cta: 'Agendar Consulta',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-emerald-700',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Saúde'
  },
  {
    id: 'b-pet-1',
    storeId: 'fake-pet-banner',
    title: 'Amigão Pet Shop',
    subtitle: 'Banho, tosa e mimos para seu melhor amigo.',
    cta: 'Ver Serviços',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-amber-600',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Pets'
  },
  {
    id: 'b-moda-1',
    storeId: 'fake-moda-banner',
    title: 'Boutique Urbana',
    subtitle: 'As tendências da estação chegaram ao bairro.',
    cta: 'Conferir Lookbook',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d1?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-rose-700',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Moda'
  },
  {
    id: 'b-beleza-1',
    storeId: 'fake-beleza-banner',
    title: 'Espaço Glamour',
    subtitle: 'Realce sua beleza com quem entende do assunto.',
    cta: 'Ver Promoções',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-purple-800',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Beleza'
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
    if (isCategoryView) {
      const catPool = MOCK_BANNERS.filter(b => b.category === categoryName);
      if (catPool.length > 0) return catPool.slice(0, bannerCount);
    }
    const pool = MOCK_BANNERS.filter(b => b.neighborhood === 'Jacarepaguá (todos)' || b.neighborhood === currentNeighborhood);
    return pool.slice(0, bannerCount);
  }, [currentNeighborhood, categoryName, subcategoryName, bannerCount, isCategoryView]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleBannerClick = (banner: BannerData) => {
    const store = STORES.find(s => s.id === banner.storeId) || {
      id: banner.storeId,
      name: banner.title,
      category: banner.category,
      subcategory: banner.category,
      description: banner.subtitle,
      adType: AdType.PREMIUM,
      rating: 4.9,
      distance: 'Perto de você',
      neighborhood: currentNeighborhood === 'Jacarepaguá (todos)' ? 'Freguesia' : currentNeighborhood,
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
    <div className="px-4 mb-6 bg-white dark:bg-gray-950 w-full overflow-hidden">
      <div 
        onClick={() => handleBannerClick(currentBanner)}
        className={`relative aspect-[16/11] w-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] group ${currentBanner.bgColor}`}
      >
        <div className="w-full h-full relative">
          <img src={currentBanner.image} alt={currentBanner.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
          
          <div className="relative h-full flex flex-col justify-end p-6 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] border border-white/20">{currentBanner.category}</span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">{currentBanner.title}</h2>
            <p className="text-[10px] font-bold text-white/90 max-w-[200px] leading-tight drop-shadow-sm mb-4">{currentBanner.subtitle}</p>
            <div className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl w-fit"><span className="text-[9px] font-black uppercase tracking-widest">{currentBanner.cta}</span></div>
          </div>

          {/* BARRA DE PROGRESSO INTERNA AO BANNER */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/30 z-20">
            <div 
              key={currentIndex}
              className="h-full bg-white animate-progress"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
