
import React, { useState, useMemo, useEffect } from 'react';
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
    id: 'b-fre-3',
    storeId: 'f-4',
    title: 'Chaveiro Rápido JPA',
    subtitle: 'Atendimento rápido no bairro',
    cta: 'Falar agora',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop',
    // Added missing bgColor and neighborhood properties to fix type errors
    bgColor: 'bg-blue-600',
    neighborhood: 'Freguesia'
  }
];

// Added named export to fix "Module has no exported member" error in HomeFeed.tsx
export const HomeBannerCarousel: React.FC<{ onStoreClick: (store: Store) => void }> = ({ onStoreClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();

  const activeBanners = useMemo(() => {
    return MOCK_BANNERS.filter(b => b.neighborhood === currentNeighborhood || currentNeighborhood === 'Jacarepaguá (todos)');
  }, [currentNeighborhood]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handleBannerClick = () => {
    const store = STORES.find(s => s.id === currentBanner.storeId);
    if (store) onStoreClick(store);
  };

  return (
    <div className="px-5 mb-6">
      <div 
        onClick={handleBannerClick}
        className={`relative aspect-[16/8] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer group transition-all duration-500 ${currentBanner.bgColor}`}
      >
        <img 
          src={currentBanner.image} 
          alt={currentBanner.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-center p-8 text-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
            {currentBanner.title}
          </h2>
          <p className="text-xs font-bold text-white/90 max-w-[180px] leading-tight mb-6">
            {currentBanner.subtitle}
          </p>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2 w-fit flex items-center gap-2 group-hover:bg-white/30 transition-all">
            <span className="text-[9px] font-black uppercase tracking-widest">{currentBanner.cta}</span>
            <ChevronRight size={14} strokeWidth={3} />
          </div>
        </div>

        {/* Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {activeBanners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
