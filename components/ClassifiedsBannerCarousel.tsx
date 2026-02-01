import React, { useState, useMemo, useEffect } from 'react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { STORES } from '../constants';
import { Store } from '../types';

interface BannerData {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  neighborhood: string;
}

const MOCK_CLASSIFIEDS_BANNERS: BannerData[] = [
  {
    id: 'cb-1',
    storeId: 'f-1',
    title: 'Oportunidades Bibi',
    subtitle: 'Vagas abertas para atendente.',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600',
    bgColor: 'bg-indigo-900',
    neighborhood: 'Freguesia'
  },
  {
    id: 'cb-2',
    storeId: 'grupo-esquematiza',
    title: 'Imóveis Industriais',
    subtitle: 'Galpões prontos para sua empresa.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600',
    bgColor: 'bg-slate-800',
    neighborhood: 'Freguesia'
  }
];

interface ClassifiedsBannerCarouselProps {
  onStoreClick: (store: Store) => void;
}

export const ClassifiedsBannerCarousel: React.FC<ClassifiedsBannerCarouselProps> = ({ onStoreClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();

  const activeBanners = useMemo(() => {
    // Filtra por bairro. Se for "Todos", mostra os da Freguesia como destaque padrão.
    const hoodKey = currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood;
    return MOCK_CLASSIFIEDS_BANNERS.filter(b => b.neighborhood === hoodKey).slice(0, 2);
  }, [currentNeighborhood]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  return (
    <div className="mb-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">⭐ Destaques do bairro</span>
      </div>
      
      <div 
        onClick={() => {
          const store = STORES.find(s => s.id === current.storeId);
          if (store) onStoreClick(store);
        }}
        className={`relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer transition-all duration-300 active:scale-[0.99] ${current.bgColor}`}
      >
        <img 
          src={current.image} 
          alt={current.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-1">
            {current.title}
          </h2>
          <p className="text-[10px] font-bold text-white/80 max-w-[200px] leading-tight">
            {current.subtitle}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-widest">Ver detalhes</span>
          </div>
        </div>

        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 right-6 flex gap-1.5">
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