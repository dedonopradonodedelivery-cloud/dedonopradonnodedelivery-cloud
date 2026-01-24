
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
  const scrollRef = useRef<HTMLDivElement>(null);
  // Fixed error in line 81: Cannot find namespace 'NodeJS'. Replaced NodeJS.Timeout with ReturnType<typeof setInterval>
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredBanners = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return MOCK_BANNERS;
    }
    return MOCK_BANNERS.filter(b => b.neighborhood === currentNeighborhood);
  }, [currentNeighborhood]);

  // Lógica de Autoplay e Barra de Progresso
  useEffect(() => {
    if (filteredBanners.length <= 1) return;

    const tickRate = 100; // atualiza a cada 100ms
    const totalDuration = 4000; // 4 segundos
    const step = (tickRate / totalDuration) * 100;

    autoplayRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIndex = (activeIndex + 1) % filteredBanners.length;
          scrollToIndex(nextIndex);
          return 0;
        }
        return prev + step;
      });
    }, tickRate);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [activeIndex, filteredBanners.length]);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
      setProgress(0);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    if (index !== activeIndex) {
      setActiveIndex(index);
      setProgress(0);
    }
  };

  const handleBannerClick = (storeId: string) => {
    const store = STORES.find(s => s.id === storeId);
    if (store) onStoreClick(store);
  };

  if (filteredBanners.length === 0) return null;

  return (
    <section className="w-full py-4 animate-in fade-in duration-700">
      <div className="relative group">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 gap-4"
        >
          {filteredBanners.map((banner, index) => (
            <div 
              key={banner.id}
              onClick={() => handleBannerClick(banner.storeId)}
              className={`relative flex-shrink-0 w-full aspect-[16/8] rounded-[2rem] overflow-hidden snap-center shadow-lg active:scale-[0.98] transition-all cursor-pointer ${banner.bgColor}`}
            >
              {/* Imagem de Fundo com Overlay */}
              <img src={banner.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              {/* Conteúdo do Banner */}
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-lg border border-white/20 mb-2">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{banner.title}</span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight mb-4 drop-shadow-md max-w-[80%]">
                  {banner.subtitle}
                </h3>
                <div className="flex items-center gap-2 bg-white text-gray-900 w-fit px-5 py-2.5 rounded-xl shadow-lg mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest">{banner.cta}</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>

              {/* BARRA DE PROGRESSÃO INTERNA (Segmentada) */}
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
          ))}
        </div>
      </div>
    </section>
  );
};
