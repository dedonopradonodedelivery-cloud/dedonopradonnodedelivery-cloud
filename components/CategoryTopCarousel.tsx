
import React, { useState, useEffect, useMemo } from 'react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { CATEGORY_TOP_BANNERS, STORES } from '../constants';
import { Store } from '../types';

interface CategoryTopCarouselProps {
  categoriaSlug: string;
  onStoreClick: (store: Store) => void;
}

export const CategoryTopCarousel: React.FC<CategoryTopCarouselProps> = ({ categoriaSlug, onStoreClick }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Busca os banners baseados na categoria e no bairro atual
  const banners = useMemo(() => {
    const categoryData = CATEGORY_TOP_BANNERS[categoriaSlug];
    if (!categoryData) return [];
    
    // Se o bairro for "Todos", pegamos os banners da Freguesia como fallback de destaque
    const hoodKey = currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood;
    const items = categoryData[hoodKey] || [];
    
    // Regra: Apenas renderiza se houver exatamente 2 banners
    return items.length >= 2 ? items.slice(0, 2) : [];
  }, [categoriaSlug, currentNeighborhood]);

  // Lógica de Autoplay a cada 4 segundos
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  // Resetar índice ao trocar de categoria ou bairro
  useEffect(() => {
    setCurrentIndex(0);
  }, [categoriaSlug, currentNeighborhood]);

  if (banners.length === 0) return null;

  const handleBannerClick = (storeId: string) => {
    const store = STORES.find(s => s.id === storeId);
    if (store) onStoreClick(store);
  };

  return (
    <div className="w-full px-5 mb-6 animate-in fade-in duration-500">
      <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
        {banners.map((banner, index) => (
          <div
            key={`${banner.storeId}-${index}`}
            onClick={() => handleBannerClick(banner.storeId)}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out cursor-pointer ${
              index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
          >
            <img 
              src={banner.image} 
              alt="Publicidade de Categoria" 
              className="w-full h-full object-cover"
            />
            {/* Overlay sutil para indicar patrocínio */}
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                Patrocinado
              </span>
            </div>
            {/* Efeito de brilho ao passar o mouse ou foco */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ))}

        {/* Indicadores (Dots) discretos */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
          {banners.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
