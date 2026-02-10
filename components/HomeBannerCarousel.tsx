
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Store, AdType } from '@/types';
import { STORES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { ChevronLeft, ChevronRight, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

interface BannerData {
  id: string;
  storeId?: string;
  type: 'service' | 'commercial';
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  bgColor: string;
  neighborhood: string;
  category?: string;
}

const MOCK_COMMERCIAL_BANNERS: BannerData[] = [
  {
    id: 'b-saude-1',
    storeId: 'fake-saude-banner',
    type: 'commercial',
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
    type: 'commercial',
    title: 'Amigão Pet Shop',
    subtitle: 'Banho, tosa e mimos para seu melhor amigo.',
    cta: 'Ver Serviços',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-amber-600',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Pets'
  }
];

interface HomeBannerCarouselProps {
  onStoreClick: (store: Store) => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({ onStoreClick, onNavigate, categoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();
  const isCategoryView = !!categoryName;
  
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const minSwipeDistance = 50;

  const activeBanners = useMemo(() => {
    // 1. Criar o banner de serviço (Sempre o primeiro na Home)
    const serviceBanner: BannerData = {
      id: 'main-service-promo',
      type: 'service',
      title: 'Precisa de um profissional agora?',
      subtitle: 'Receba propostas de especialistas perto de você em Jacarepaguá.',
      cta: 'Receber orçamentos',
      image: 'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800',
      bgColor: 'bg-gradient-to-br from-[#1248E0] via-[#1E5BFF] to-[#0A2E99]',
      neighborhood: 'Jacarepaguá (todos)'
    };

    if (isCategoryView) {
      // Em vista de categoria, filtramos apenas os comerciais correspondentes
      return MOCK_COMMERCIAL_BANNERS.filter(b => b.category === categoryName).slice(0, 2);
    }

    // Na Home: Banner de Serviço + 2 Comerciais (Total 3)
    return [serviceBanner, ...MOCK_COMMERCIAL_BANNERS.slice(0, 2)];
  }, [categoryName, isCategoryView]);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryName, currentNeighborhood]);

  const resetAutoplayTimer = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    resetAutoplayTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    resetAutoplayTimer();
  };

  const handleBannerClick = (banner: BannerData) => {
    if (isSwiping) return;

    if (banner.type === 'service') {
      onNavigate('services_landing');
      return;
    }

    if (banner.storeId) {
      const store = STORES.find(s => s.id === banner.storeId) || {
        id: banner.storeId,
        name: banner.title,
        category: banner.category || 'Destaque',
        subcategory: banner.category || 'Destaque',
        description: banner.subtitle,
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
    }
  };

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
      if (distance > 0) setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
      else setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
      setTimeout(() => setIsSwiping(false), 200);
    }
    resetAutoplayTimer();
  };

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  return (
    <div className="px-5 pb-8 pt-2 bg-white dark:bg-gray-950">
      <div 
        className={`relative aspect-[16/12] w-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] group ${current.bgColor} shadow-xl border border-white/5`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => handleBannerClick(current)}
      >
        <div className="w-full h-full relative select-none">
          <img 
            src={current.image} 
            alt={current.title} 
            className={`absolute inset-0 w-full h-full object-cover mix-blend-overlay transition-transform duration-700 group-hover:scale-105 pointer-events-none ${current.type === 'service' ? 'opacity-40 grayscale-[0.5]' : 'opacity-60'}`} 
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className={`relative h-full flex flex-col ${current.type === 'service' ? 'justify-start pt-20' : 'justify-end'} p-8 text-white pointer-events-none z-10`}>
            {current.type === 'service' ? (
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl">
                      <Wrench size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="bg-white/15 backdrop-blur-xl px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-400" />
                        <span className="text-[8px] font-black text-white uppercase tracking-[0.12em]">Especialistas Verificados</span>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter max-w-[240px] drop-shadow-lg">
                      Precisa de um <br/> profissional agora?
                    </h2>
                    <p className="text-xs text-blue-50 font-medium leading-relaxed opacity-80 max-w-[240px]">
                      Receba propostas de especialistas perto de você.
                    </p>
                 </div>
                 <div className="inline-flex items-center gap-2 bg-white text-[#1E5BFF] px-6 py-3 rounded-2xl w-fit shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest">{current.cta}</span>
                    <ArrowRight size={16} strokeWidth={3} />
                 </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                   <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] border border-white/20">
                      {current.category}
                   </span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
                  {current.title}
                </h2>
                <p className="text-[10px] font-bold text-white/90 max-w-[220px] leading-tight drop-shadow-sm mb-4">
                  {current.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl w-fit shadow-lg">
                   <span className="text-[9px] font-black uppercase tracking-widest">{current.cta}</span>
                </div>
              </>
            )}
          </div>
        </div>

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
