
import React, { useState, useEffect, useMemo } from 'react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { CATEGORY_TOP_BANNERS } from '../constants';

interface CategoryTopCarouselProps {
  categoriaSlug: string;
  onNavigate: (view: string) => void;
}

export const CategoryTopCarousel: React.FC<CategoryTopCarouselProps> = ({ categoriaSlug, onNavigate }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Busca os banners baseados na categoria e no bairro atual
  const banners = useMemo(() => {
    const categoryData = CATEGORY_TOP_BANNERS[categoriaSlug];
    if (!categoryData) return [];
    
    // Se o bairro for "Todos", pegamos os banners da Freguesia como fallback de destaque
    const hoodKey = currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood;
    const items = categoryData[hoodKey] || [];
    
    // Regra: Apenas renderiza se houver pelo menos 1 banner
    return items.slice(0, 2);
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

  const handleBannerClick = () => {
    onNavigate('explore');
  };

  return (
    <div className="w-full px-5 mb-6 animate-in fade-in duration-500">
      <div 
        onClick={handleBannerClick}
        className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer group"
      >
        {banners.map((banner, index) => (
          <div
            key={`${banner.storeId}-${index}`}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
          >
            <img 
              src={banner.image} 
              alt="Publicidade de Categoria" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay sutil para indicar patrocínio */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                Patrocinado
              </span>
            </div>
            {/* Efeito de brilho ao passar o mouse ou foco */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        ))}

        {/* Indicadores (Dots) discretos - pointer-events-none para não bloquear o clique no banner */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-none">
          {banners.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 pointer-events-auto ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
