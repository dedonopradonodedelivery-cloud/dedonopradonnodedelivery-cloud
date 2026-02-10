
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Store, AdType } from '@/types';
import { STORES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
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
  
  // Controle de Autoplay e Interação Manual
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Controle de Swipe/Drag
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const minSwipeDistance = 50;

  // REGRA: No máximo 3 banners na Home
  const bannerCount = useMemo(() => {
    return isCategoryView ? 2 : 3;
  }, [isCategoryView]);

  const activeBanners = useMemo(() => {
    let pool = MOCK_BANNERS;
    if (isCategoryView) {
      pool = MOCK_BANNERS.filter(b => b.category === categoryName);
    } else {
      pool = MOCK_BANNERS.filter(b => b.neighborhood === 'Jacarepaguá (todos)' || b.neighborhood === currentNeighborhood);
    }
    return pool.slice(0, bannerCount);
  }, [currentNeighborhood, categoryName, subcategoryName, bannerCount, isCategoryView]);

  // Autoplay Logic - Aumentado para 8 segundos (Não rápida)
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  // Reset index on filter change
  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryName, subcategoryName, currentNeighborhood]);

  // Pause Autoplay on Interaction
  const resetAutoplayTimer = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    resetAutoplayTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    resetAutoplayTimer();
  };

  // Handlers de Toque (Mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    resetAutoplayTimer();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(distance) > minSwipeDistance) {
      setIsSwiping(true);
      if (distance > 0) {
        setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
      }
      setTimeout(() => setIsSwiping(false), 200);
    }
    resetAutoplayTimer();
  };

  // Handlers de Mouse (Desktop Drag)
  const onMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    resetAutoplayTimer();
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - e.clientX;
    
    if (Math.abs(distance) > minSwipeDistance) {
      setIsSwiping(true);
      if (distance > 0) {
        setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
      }
      setTimeout(() => setIsSwiping(false), 200);
    }
    touchStartX.current = null;
    resetAutoplayTimer();
  };

  const handleBannerClick = (banner: BannerData) => {
    if (isSwiping) return;

    const store = STORES.find(s => s.id === banner.storeId) || {
      id: banner.storeId,
      name: banner.title,
      category: banner.category,
      subcategory: banner.category,
      description: `O melhor de ${banner.category.toLowerCase()} na região de Jacarepaguá. ${banner.subtitle}`,
      adType: AdType.PREMIUM,
      rating: 4.9,
      distance: 'Perto de você',
      neighborhood: currentNeighborhood === 'Jacarepaguá (todos)' ? 'Freguesia' : currentNeighborhood,
      verified: true,
      isOpenNow: true,
      image: banner.image,
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(banner.title)}&background=random&color=fff`
    };

    onStoreClick(store as Store);
  };

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  return (
    <div className="px-5 pb-6 pt-2 bg-white dark:bg-gray-950">
      <div 
        className={`relative aspect-[16/12] w-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] group ${currentBanner.bgColor}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { touchStartX.current = null; }}
        onClick={() => handleBannerClick(currentBanner)}
      >
        <div className="w-full h-full relative select-none">
          <img 
            src={currentBanner.image} 
            alt={currentBanner.title} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none" 
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
          
          <div className="relative h-full flex flex-col justify-end p-8 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] border border-white/20">
                  {currentBanner.category}
               </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
              {currentBanner.title}
            </h2>
            <p className="text-[10px] font-bold text-white/90 max-w-[220px] leading-tight drop-shadow-sm mb-4">
              {currentBanner.subtitle}
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl w-fit shadow-lg">
               <span className="text-[9px] font-black uppercase tracking-widest">{currentBanner.cta}</span>
            </div>
          </div>
        </div>

        {activeBanners.length > 1 && (
          <>
            <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
            >
                <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20"
            >
                <ChevronRight size={20} strokeWidth={3} />
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {activeBanners.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-300 pointer-events-auto ${idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
