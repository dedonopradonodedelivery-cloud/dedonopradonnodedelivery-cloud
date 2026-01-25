
import React, { useState, useMemo, useEffect } from 'react';
import { Store } from '../types';
import { STORES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface BannerData {
  id: string;
  storeId: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  bgColor: string;
  neighborhood: string;
  category?: string;
  subcategory?: string;
}

const MOCK_BANNERS: BannerData[] = [
  // Banners Gerais / Home
  {
    id: 'b-fre-1',
    storeId: 'f-1',
    title: 'Bibi Lanches',
    subtitle: 'Almoço especial com suco natural hoje!',
    cta: 'Abrir cardápio',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-orange-600',
    neighborhood: 'Freguesia',
    category: 'Comida'
  },
  {
    id: 'b-fre-2',
    storeId: 'f-5',
    title: 'Pizzaria do Zé',
    subtitle: 'Bordas recheadas grátis nesta terça.',
    cta: 'Pedir agora',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-red-700',
    neighborhood: 'Freguesia',
    category: 'Comida',
    subcategory: 'Pizzarias'
  },
  {
    id: 'b-fre-3',
    storeId: 'f-4',
    title: 'Chaveiro Rápido JPA',
    subtitle: 'Atendimento rápido no bairro',
    cta: 'Falar agora',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-blue-600',
    neighborhood: 'Freguesia',
    category: 'Serviços'
  },
  // Banners Extras para preenchimento (Fallback)
  {
    id: 'b-gen-1',
    storeId: 'grupo-esquematiza',
    title: 'Segurança Total',
    subtitle: 'Proteja seu condomínio com quem entende.',
    cta: 'Saber mais',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    bgColor: 'bg-slate-900',
    neighborhood: 'Freguesia',
    category: 'Serviços'
  },
  {
    id: 'b-gen-2',
    storeId: 'f-8',
    title: 'Academia FitBairro',
    subtitle: 'Matrícula grátis para novos alunos!',
    cta: 'Ver planos',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
    bgColor: 'bg-emerald-700',
    neighborhood: 'Freguesia',
    category: 'Esportes'
  }
];

interface HomeBannerCarouselProps {
  onStoreClick: (store: Store) => void;
  categoryName?: string;
  subcategoryName?: string;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({ onStoreClick, categoryName, subcategoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();

  const bannerCount = subcategoryName ? 2 : 3;

  const activeBanners = useMemo(() => {
    // 1. Filtra banners que combinam com o bairro (ou todos)
    let pool = MOCK_BANNERS.filter(b => b.neighborhood === currentNeighborhood || currentNeighborhood === 'Jacarepaguá (todos)');
    
    let filtered: BannerData[] = [];

    // 2. Se for subcategoria, tenta pegar as específicas primeiro
    if (subcategoryName) {
      filtered = pool.filter(b => b.subcategory === subcategoryName);
    }
    
    // 3. Se não encheu ou se for apenas categoria, tenta categoria
    if (filtered.length < bannerCount && categoryName) {
      const catBanners = pool.filter(b => b.category === categoryName && !filtered.find(f => f.id === b.id));
      filtered = [...filtered, ...catBanners];
    }

    // 4. Fallback final: Se ainda não tem o número necessário, completa com banners gerais do bairro
    if (filtered.length < bannerCount) {
      const generalBanners = pool.filter(b => !filtered.find(f => f.id === b.id));
      const needed = bannerCount - filtered.length;
      filtered = [...filtered, ...generalBanners.slice(0, needed)];
    }

    // Retorna a quantidade correta de banners
    return filtered.slice(0, bannerCount);
  }, [currentNeighborhood, categoryName, subcategoryName, bannerCount]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Reset index ao mudar de categoria/subcategoria
  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryName, subcategoryName, currentNeighborhood]);

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
        className={`relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 active:brightness-90 active:scale-[0.99] group ${currentBanner.bgColor}`}
      >
        <img 
          src={currentBanner.image} 
          alt={currentBanner.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-center p-8 text-white">
          <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
            {currentBanner.title}
          </h2>
          <p className="text-xs font-bold text-white/90 max-w-[200px] leading-tight drop-shadow-sm">
            {currentBanner.subtitle}
          </p>
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
