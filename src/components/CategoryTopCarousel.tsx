
import React, { useState, useEffect, useMemo } from 'react';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { CATEGORY_TOP_BANNERS, STORES } from '@/constants';
import { Store, AdType } from '@/types';

interface CategoryTopCarouselProps {
  categoriaSlug: string;
  onStoreClick: (store: Store) => void;
}

export const CategoryTopCarousel: React.FC<CategoryTopCarouselProps> = ({ categoriaSlug, onStoreClick }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = useMemo(() => {
    const categoryData = CATEGORY_TOP_BANNERS[categoriaSlug];
    if (!categoryData) return [];
    
    const hoodKey = currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood;
    const items = categoryData[hoodKey] || [];
    
    return items.slice(0, 2);
  }, [categoriaSlug, currentNeighborhood]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [categoriaSlug, currentNeighborhood]);

  if (banners.length === 0) return null;

  const handleBannerClick = (banner: { storeId: string; image: string }) => {
    const store = STORES.find(s => s.id === banner.storeId) || {
      id: banner.storeId,
      name: 'Loja Parceira',
      category: 'Destaque',
      description: 'Perfil em construção. Este estabelecimento em breve terá um perfil completo com fotos, cardápio e contatos!',
      adType: AdType.PREMIUM,
      rating: 5.0,
      distance: 'Freguesia • RJ',
      verified: true,
      isOpenNow: true,
      image: banner.image,
      logoUrl: '/assets/default-logo.png'
    };

    onStoreClick(store as Store);
  };

  return (
    <div className="w-full px-5 mb-6 animate-in fade-in duration-500">
      <div 
        className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 cursor-pointer group"
      >
        {banners.map((banner, index) => (
          <div
            key={`${banner.storeId}-${index}`}
            onClick={() => handleBannerClick(banner)}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
          >
            <img 
              src={banner.image} 
              alt="Publicidade de Categoria" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-white/10">
                Patrocinado
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        ))}

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
