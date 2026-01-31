
import React, { useMemo, useState, useEffect } from 'react';
import { CategoryBannerSlot } from '../types';
import { categoryBannerService } from '../lib/categoryBannerService';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface CategoryBannerCarouselProps {
  categoriaSlug: string;
  onStoreClick: (merchantId: string) => void;
  onAdvertiseClick: () => void;
}

export const CategoryBannerCarousel: React.FC<CategoryBannerCarouselProps> = ({ 
  categoriaSlug, 
  onStoreClick,
  onAdvertiseClick
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normaliza o slug do bairro para bater com o banco de slots
  const bairroSlug = currentNeighborhood.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');

  const activeBanners = useMemo(() => {
    const slot1 = categoryBannerService.getSlot(bairroSlug, categoriaSlug, 1);
    const slot2 = categoryBannerService.getSlot(bairroSlug, categoriaSlug, 2);
    
    return [slot1, slot2].filter(s => s.status === 'sold');
  }, [bairroSlug, categoriaSlug]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    // Placeholder de incentivo a venda quando não há banners vendidos
    return (
      <div className="px-5 mb-6">
        <div 
          onClick={onAdvertiseClick}
          className="relative aspect-[16/8] w-full rounded-[2.5rem] bg-slate-900 flex flex-col items-center justify-center text-center p-8 cursor-pointer overflow-hidden shadow-xl border border-white/5 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h3 className="font-black text-xl text-white uppercase tracking-tighter leading-tight">Anuncie neste Bairro</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 mb-4">Destaque-se para todos da região</p>
            <div className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[8px] font-black text-white uppercase tracking-widest border border-white/10 transition-all">
                Garantir meu espaço
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = activeBanners[currentIndex];

  return (
    <div className="px-5 mb-6">
      <div 
        onClick={() => current.merchantId && onStoreClick(current.merchantId)}
        className="relative aspect-[16/8] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 active:brightness-90 active:scale-[0.99] bg-slate-900"
      >
        <img 
          src={current.image} 
          alt={current.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-end p-8 text-white">
          <span className="bg-[#1E5BFF] text-white text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest w-fit mb-2">Patrocinado</span>
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-md">
            {current.title}
          </h2>
          <p className="text-[10px] font-bold text-white/80 max-w-[220px] leading-tight drop-shadow-sm">
            {current.subtitle}
          </p>
        </div>

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
