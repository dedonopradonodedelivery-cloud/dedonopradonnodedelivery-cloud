
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Store } from '../types';
import { STORES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { ChevronRight } from 'lucide-react';

interface BannerData {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  bgColor: string;
  neighborhood: string;
}

const MOCK_BANNERS: BannerData[] = [
  {
    id: 'b-fre-1',
    storeId: 'f-1',
    title: 'Bibi Lanches',
    subtitle: 'Almoço especial com suco natural hoje!',
    cta: 'Abrir cardápio',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-orange-600',
    neighborhood: 'Freguesia'
  },
  {
    id: 'b-fre-2',
    storeId: 'f-5',
    title: 'Pizzaria do Zé',
    subtitle: 'Bordas recheadas grátis nesta terça.',
    cta: 'Pedir agora',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-red-700',
    neighborhood: 'Freguesia'
  },
  {
    id: 'b-taq-1',
    storeId: 'f-2',
    title: 'Studio Hair Vip',
    subtitle: 'Nova coleção de cores para o verão.',
    cta: 'Agendar',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-purple-600',
    neighborhood: 'Taquara'
  },
  {
    id: 'b-taq-2',
    storeId: 'f-8',
    title: 'Academia FitBairro',
    subtitle: 'Matrícula grátis para novos alunos.',
    cta: 'Conhecer',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-blue-600',
    neighborhood: 'Taquara'
  },
  {
    id: 'b-pec-1',
    storeId: 'f-3',
    title: 'Pet Shop Alegria',
    subtitle: 'Banho e Tosa com 20% de desconto.',
    cta: 'Ver preços',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-emerald-600',
    neighborhood: 'Pechincha'
  }
];

interface HomeBannerCarouselProps {
  onStoreClick: (store: Store) => void;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({ onStoreClick }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef<number | null>(null);

  const filteredBanners = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return MOCK_BANNERS;
    }
    return MOCK_BANNERS.filter(b => b.neighborhood === currentNeighborhood);
  }, [currentNeighborhood]);

  // Autoplay and Progress logic
  useEffect(() => {
    if (filteredBanners.length <= 1) return;

    const duration = 4000; // 4 seconds per banner
    const interval = 100; // tick every 100ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % filteredBanners.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeIndex, filteredBanners.length]);

  // Handle manual swipe within the fixed space
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) { // Swipe threshold
      if (diff > 0) {
        // Next
        setActiveIndex((current) => (current + 1) % filteredBanners.length);
      } else {
        // Prev
        setActiveIndex((current) => (current - 1 + filteredBanners.length) % filteredBanners.length);
      }
      setProgress(0);
    }
    touchStart.current = null;
  };

  const handleBannerClick = (storeId: string) => {
    const store = STORES.find(s => s.id === storeId);
    if (store) onStoreClick(store);
  };

  if (filteredBanners.length === 0) return null;

  const currentBanner = filteredBanners[activeIndex];

  return (
    <section className="w-full py-4 px-5">
      <div 
        onClick={() => handleBannerClick(currentBanner.storeId)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full aspect-[16/8] rounded-[2.2rem] overflow-hidden shadow-xl active:scale-[0.98] transition-all cursor-pointer ${currentBanner.bgColor}`}
      >
        {/* Banner Content (Animate key change for smooth transition) */}
        <div key={currentBanner.id} className="absolute inset-0 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Image Layer */}
            <img 
                src={currentBanner.image} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Content Layer */}
            <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-lg border border-white/20 mb-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentBanner.title}</span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight mb-4 drop-shadow-md max-w-[85%]">
                    {currentBanner.subtitle}
                </h3>
                <div className="flex items-center gap-2 bg-white text-gray-900 w-fit px-5 py-2.5 rounded-xl shadow-lg mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">{currentBanner.cta}</span>
                    <ChevronRight size={14} strokeWidth={3} />
                </div>
            </div>
        </div>

        {/* INTEGRATED PROGRESS BAR (Stories Style) */}
        {filteredBanners.length > 1 && (
            <div className="absolute bottom-4 left-7 right-7 flex gap-1.5 z-20">
                {filteredBanners.map((_, idx) => (
                    <div 
                        key={idx} 
                        className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
                    >
                        <div 
                            className={`h-full bg-white transition-all ease-linear ${idx === activeIndex ? '' : 'hidden'}`}
                            style={{ width: idx === activeIndex ? `${progress}%` : '0%' }}
                        />
                        <div 
                            className={`h-full bg-white/60 ${idx < activeIndex ? 'block' : 'hidden'}`}
                        />
                    </div>
                ))}
            </div>
        )}
      </div>
    </section>
  );
};
