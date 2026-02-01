
import React, { useMemo, useState, useEffect } from 'react';
import { categoryBannerService } from '../lib/categoryBannerService';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface CategoryBannerCarouselProps {
  categoriaSlug: string;
  onStoreClick: (merchantId: string) => void;
}

export const CategoryBannerCarousel: React.FC<CategoryBannerCarouselProps> = ({ 
  categoriaSlug, 
  onStoreClick
}) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normaliza o slug do bairro para bater com as chaves do banco de slots
  const bairroSlug = useMemo(() => 
    currentNeighborhood.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-'),
    [currentNeighborhood]
  );

  // Busca os 2 slots específicos da categoria + bairro atual
  const activeBanners = useMemo(() => {
    const slot1 = categoryBannerService.getSlot(bairroSlug, categoriaSlug, 1);
    const slot2 = categoryBannerService.getSlot(bairroSlug, categoriaSlug, 2);
    
    // Regra: Apenas slots 'sold' entram no carrossel de exibição
    return [slot1, slot2].filter(s => s.status === 'sold');
  }, [bairroSlug, categoriaSlug]);

  // Transição automática de 4 segundos conforme solicitado
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Resetar índice ao trocar de categoria ou bairro
  useEffect(() => {
    setCurrentIndex(0);
  }, [bairroSlug, categoriaSlug]);

  // Se não houver banners ativos para esta segmentação, o carrossel não é exibido
  if (activeBanners.length === 0) {
    return null;
  }

  const current = activeBanners[currentIndex];

  return (
    <div className="px-5 mb-6 animate-in fade-in duration-500">
      <div 
        onClick={() => current.merchantId && onStoreClick(current.merchantId)}
        className="relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 active:brightness-90 active:scale-[0.99] bg-slate-900 border border-white/5"
      >
        {/* Imagem do Banner do Lojista */}
        <img 
          src={current.image} 
          alt={current.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-70 transition-transform duration-700" 
        />
        
        {/* Overlay para contraste de texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Conteúdo do Anunciante */}
        <div className="relative h-full flex flex-col justify-end p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#1E5BFF] text-white text-[7px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] w-fit border border-white/10 shadow-sm">
              Patrocinado
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-md">
            {current.title}
          </h2>
          <p className="text-[10px] font-bold text-white/80 max-w-[220px] leading-tight drop-shadow-sm">
            {current.subtitle}
          </p>
        </div>

        {/* Indicadores Visuais (Dots) */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {activeBanners.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
