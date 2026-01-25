
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
    id: 'b-fre-4-serv',
    storeId: 'f-4',
    title: 'Eletricista 24h',
    subtitle: 'Emergências elétricas no seu bairro',
    cta: 'Ligar agora',
    image: 'https://images.unsplash.com/photo-1617521114992-124c63391620?q=80&w=600',
    bgColor: 'bg-yellow-600',
    neighborhood: 'Freguesia',
    category: 'Serviços'
  },
  {
    id: 'b-fre-5-serv',
    storeId: 'f-4',
    title: 'Encanador Profissional',
    subtitle: 'Vazamentos e reparos hidráulicos',
    cta: 'Chamar no Zap',
    image: 'https://images.unsplash.com/photo-1596454848234-b8162d185b9c?q=80&w=600',
    bgColor: 'bg-cyan-700',
    neighborhood: 'Freguesia',
    category: 'Serviços'
  },
  {
    id: 'b-fre-im-1',
    storeId: 'f-1',
    title: 'Sua Sala Comercial',
    subtitle: 'No coração da Freguesia',
    cta: 'Ver opções',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600',
    bgColor: 'bg-purple-800',
    neighborhood: 'Freguesia',
    category: 'Imóveis Comerciais'
  },
  {
    id: 'b-fre-im-2',
    storeId: 'f-1',
    title: 'Loja de Rua',
    subtitle: 'Ponto com alta visibilidade',
    cta: 'Saber Mais',
    image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=600',
    bgColor: 'bg-indigo-800',
    neighborhood: 'Freguesia',
    category: 'Imóveis Comerciais'
  },
  {
    id: 'b-fre-im-3',
    storeId: 'f-1',
    title: 'Galpão Logístico',
    subtitle: 'Ideal para seu estoque',
    cta: 'Consultar',
    image: 'https://images.unsplash.com/photo-1587022205345-66b3e6486d3b?q=80&w=600',
    bgColor: 'bg-gray-700',
    neighborhood: 'Freguesia',
    category: 'Imóveis Comerciais'
  },
  {
    id: 'b-fre-im-4',
    storeId: 'f-1',
    title: 'Andar Corporativo',
    subtitle: 'Espaço para sua equipe crescer',
    cta: 'Visitar',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
    bgColor: 'bg-teal-800',
    neighborhood: 'Freguesia',
    category: 'Imóveis Comerciais'
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
  const isCategoryView = !!categoryName;

  const bannerCount = useMemo(() => {
    if (categoryName === 'Serviços' || categoryName === 'Imóveis Comerciais') {
      return 4;
    }
    if (isCategoryView) {
      return 2;
    }
    return 3; // Home
  }, [categoryName, isCategoryView]);

  const activeBanners = useMemo(() => {
    // BUG FIX: Handle "Jacarepaguá (todos)" case correctly.
    const initialPool = currentNeighborhood === 'Jacarepaguá (todos)'
      ? MOCK_BANNERS
      : MOCK_BANNERS.filter(b => b.neighborhood === currentNeighborhood);
    
    let filtered: BannerData[] = [];

    if (subcategoryName) {
      filtered = initialPool.filter(b => b.subcategory === subcategoryName);
    }
    
    if (filtered.length < bannerCount && categoryName) {
      const catBanners = initialPool.filter(b => b.category === categoryName && !filtered.find(f => f.id === b.id));
      filtered = [...filtered, ...catBanners];
    }

    if (filtered.length < bannerCount) {
      const generalBanners = initialPool.filter(b => !filtered.find(f => f.id === b.id));
      const needed = bannerCount - filtered.length;
      filtered = [...filtered, ...generalBanners.slice(0, needed)];
    }

    return filtered.slice(0, bannerCount);
  }, [currentNeighborhood, categoryName, subcategoryName, bannerCount]);

  // DEBUGGING: Log banner state as requested.
  useEffect(() => {
    console.log('[HomeBannerCarousel DEBUG] Environment: Production');
    console.log(`[HomeBannerCarousel DEBUG] Current Neighborhood: ${currentNeighborhood}`);
    console.log(`[HomeBannerCarousel DEBUG] Category Filter: ${categoryName || 'N/A'}`);
    console.log(`[HomeBannerCarousel DEBUG] Active Banners Count: ${activeBanners.length}`);
    if (activeBanners.length > 0) {
        console.log('[HomeBannerCarousel DEBUG] Active Banners Data:', JSON.stringify(activeBanners.map(b => ({ id: b.id, title: b.title }))));
    } else {
        console.log('[HomeBannerCarousel DEBUG] No active banners found for the current filters.');
    }
  }, [activeBanners, currentNeighborhood, categoryName]);

  // Auto-scroll effect for Home view only
  useEffect(() => {
    if (isCategoryView || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isCategoryView, activeBanners.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryName, subcategoryName, currentNeighborhood]);

  const handleBannerClick = (banner: BannerData) => {
    const store = STORES.find(s => s.id === banner.storeId);
    if (store) onStoreClick(store);
  };

  // DEBUGGING: Render placeholder if no banners.
  if (activeBanners.length === 0) {
    return (
        <div className="px-5 mb-6">
            <div className="aspect-[16/10] w-full rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-center p-4 border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">[DEBUG] Carrossel de Banners</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Banners indisponíveis no momento.</p>
            </div>
        </div>
    );
  }

  // --- RENDER PARA CATEGORIAS (2 ou 4 BANNERS VISÍVEIS) ---
  if (isCategoryView) {
    return (
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 mb-6 snap-x flex-wrap">
        {activeBanners.map(banner => (
          <div 
            key={banner.id}
            onClick={() => handleBannerClick(banner)}
            className={`relative aspect-[4/5] w-[calc(50%-0.375rem)] snap-start flex-shrink-0 rounded-[1.5rem] overflow-hidden shadow-lg cursor-pointer transition-all duration-300 active:brightness-90 active:scale-[0.99] group ${banner.bgColor}`}
          >
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-4 text-white">
              <h2 className="text-sm font-black uppercase tracking-tighter leading-tight mb-1 drop-shadow-md">
                {banner.title}
              </h2>
              <p className="text-[10px] font-bold text-white/90 leading-tight drop-shadow-sm line-clamp-2">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- RENDER PARA HOME (BANNER ÚNICO) ---
  const currentBanner = activeBanners[currentIndex];
  return (
    <div className="px-5 mb-6">
      <div 
        onClick={() => handleBannerClick(currentBanner)}
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
