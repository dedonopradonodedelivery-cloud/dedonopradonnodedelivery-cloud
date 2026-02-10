
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Store, AdType } from '@/types';
import { STORES } from '@/constants';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

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
  const minSwipeDistance = 50;

  const activeBanners = useMemo(() => {
    const serviceBanner: BannerData = {
      id: 'main-service-promo',
      type: 'service',
      title: 'Precisa de um profissional agora?',
      subtitle: 'Receba propostas de especialistas perto de você.',
      cta: 'Receber orçamentos',
      image: 'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800',
      bgColor: 'bg-gradient-to-br from-[#1248E0] via-[#1E5BFF] to-[#0A2E99]',
      neighborhood: 'Jacarepaguá (todos)'
    };

    if (isCategoryView) {
      return MOCK_COMMERCIAL_BANNERS.filter(b => b.category === categoryName).slice(0, 2);
    }

    return [serviceBanner, ...MOCK_COMMERCIAL_BANNERS.slice(0, 2)];
  }, [categoryName, isCategoryView]);

  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isPaused]);

  const resetAutoplayTimer = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000);
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
      if (distance > 0) setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
      else setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    }
  };

  const handleBannerClick = (banner: BannerData) => {
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
        neighborhood: 'Freguesia',
        verified: true,
        isOpenNow: true,
        image: banner.image,
        logoUrl: "/assets/default-logo.png"
      };
      onStoreClick(store as Store);
    }
  };

  if (activeBanners.length === 0) return null;
  const current = activeBanners[currentIndex];

  return (
    <div className="px-4 py-2 w-full overflow-hidden">
      <div 
        className={`relative aspect-[16/10] w-full rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] ${current.bgColor} shadow-lg border border-white/5`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => handleBannerClick(current)}
      >
        <img 
          src={current.image} 
          alt={current.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-end p-5 text-white z-10">
            {current.type === 'service' ? (
                <div className="space-y-2">
                    <div className="bg-white/15 backdrop-blur-xl px-2 py-0.5 rounded-lg border border-white/20 flex items-center gap-1 w-fit">
                        <ShieldCheck size={10} className="text-emerald-400" />
                        <span className="text-[7px] font-black text-white uppercase tracking-widest">Verificados</span>
                    </div>
                    <h2 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">
                      Precisa de um <br/> profissional agora?
                    </h2>
                    <div className="inline-flex items-center gap-1 bg-white text-[#1E5BFF] px-4 py-2 rounded-xl w-fit shadow-lg">
                        <span className="text-[9px] font-black uppercase tracking-widest">{current.cta}</span>
                        <ArrowRight size={14} strokeWidth={3} />
                    </div>
                </div>
            ) : (
                <div className="space-y-1">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/10 w-fit">
                      {current.category}
                    </span>
                    <h2 className="text-lg font-black uppercase tracking-tighter leading-none">{current.title}</h2>
                    <p className="text-[9px] font-bold text-white/90 leading-tight mb-2">{current.subtitle}</p>
                    <div className="inline-flex items-center bg-white text-gray-900 px-3 py-1.5 rounded-lg w-fit shadow-lg">
                        <span className="text-[8px] font-black uppercase tracking-widest">{current.cta}</span>
                    </div>
                </div>
            )}
        </div>

        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10">
            {activeBanners.map((_, idx) => (
              <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
