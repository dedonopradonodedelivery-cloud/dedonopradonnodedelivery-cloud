
import React, { useState, useMemo, useEffect } from 'react';
import { Store, AdType } from '../types';
import { STORES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { Sparkles, Wrench, Check, ArrowRight } from 'lucide-react';

interface BannerData {
  id: string;
  storeId?: string;
  type?: 'store' | 'services';
  title: string;
  subtitle: string;
  cta: string;
  image?: string;
  bgColor: string;
  neighborhood: string;
  category: string;
}

const MOCK_BANNERS: BannerData[] = [
  {
    id: 'b-services-1',
    type: 'services',
    title: 'PRECISA DE UM PROFISSIONAL NO SEU BAIRRO?',
    subtitle: 'Especialistas verificados, orçamentos rápidos e atendimento perto de você.',
    cta: 'SOLICITAR ORÇAMENTO GRÁTIS',
    bgColor: 'bg-gradient-to-br from-[#020617] via-[#081431] to-[#1E5BFF]',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'SERVIÇOS VERIFICADOS'
  },
  {
    id: 'b-saude-1',
    type: 'store',
    storeId: 'fake-saude-banner',
    title: 'Clínica Bem Estar',
    subtitle: 'Cuidado completo para sua família com especialistas.',
    cta: 'Agendar Consulta',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-emerald-700',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Saúde'
  },
  {
    id: 'b-pet-1',
    type: 'store',
    storeId: 'fake-pet-banner',
    title: 'Amigão Pet Shop',
    subtitle: 'Banho, tosa e mimos para seu melhor amigo.',
    cta: 'Ver Serviços',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop',
    bgColor: 'bg-amber-600',
    neighborhood: 'Jacarepaguá (todos)',
    category: 'Pets'
  }
];

interface HomeBannerCarouselProps {
  onStoreClick: (store: Store) => void;
  onNavigate: (view: string) => void;
  categoryName?: string;
  subcategoryName?: string;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({ onStoreClick, onNavigate, categoryName, subcategoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();
  const isCategoryView = !!categoryName;

  const activeBanners = useMemo(() => {
    if (isCategoryView) {
      const catPool = MOCK_BANNERS.filter(b => b.category === categoryName);
      if (catPool.length > 0) return catPool.slice(0, 2);
    }
    const pool = MOCK_BANNERS.filter(b => b.neighborhood === 'Jacarepaguá (todos)' || b.neighborhood === currentNeighborhood);
    return pool;
  }, [currentNeighborhood, categoryName, isCategoryView]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleBannerClick = (banner: BannerData) => {
    if (banner.type === 'services') {
        onNavigate('services_landing');
        return;
    }

    if (banner.storeId) {
        const store = STORES.find(s => s.id === banner.storeId) || {
          id: banner.storeId,
          name: banner.title,
          category: banner.category,
          subcategory: banner.category,
          description: banner.subtitle,
          adType: AdType.PREMIUM,
          rating: 4.9,
          distance: 'Perto de você',
          neighborhood: currentNeighborhood === 'Jacarepaguá (todos)' ? 'Freguesia' : currentNeighborhood,
          verified: true,
          isOpenNow: true,
          image: banner.image,
          logoUrl: '/assets/default-logo.png'
        };
        onStoreClick(store as Store);
    }
  };

  if (activeBanners.length === 0) return null;
  const currentBanner = activeBanners[currentIndex];

  return (
    <div className="px-4 mb-6 bg-white dark:bg-gray-950 w-full overflow-hidden">
      <div 
        onClick={() => handleBannerClick(currentBanner)}
        className={`relative aspect-[16/11] w-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] group ${currentBanner.bgColor}`}
      >
        {currentBanner.type === 'services' ? (
          /* DESIGN: SERVIÇOS VERIFICADOS */
          <div className="w-full h-full relative flex flex-col p-8">
            {/* Textura Dot Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
            
            {/* Topo: Badge & Ícone Tool */}
            <div className="relative z-10 flex justify-between items-start">
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-xl">
                 <Sparkles size={14} className="text-blue-400" />
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{currentBanner.category}</span>
               </div>
               
               <div className="relative">
                 <div className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-[1.25rem] border border-white/10 flex items-center justify-center shadow-2xl">
                    <Wrench size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#020617] shadow-lg">
                      <Check size={12} className="text-white" strokeWidth={4} />
                    </div>
                 </div>
               </div>
            </div>

            {/* Centro: Título e Descrição */}
            <div className="flex-1 flex flex-col justify-center relative z-10 text-center items-center">
               <h2 className="text-2xl font-black text-white leading-[1.1] uppercase tracking-tighter max-w-[260px] mb-3 drop-shadow-md">
                 {currentBanner.title}
               </h2>
               <p className="text-[11px] text-blue-100/70 font-medium leading-relaxed max-w-[240px]">
                 {currentBanner.subtitle}
               </p>
            </div>

            {/* Base: Botão CTA */}
            <div className="relative z-10 flex justify-center mb-6">
               <div className="bg-white text-[#020617] font-black py-4 px-8 rounded-2xl shadow-2xl flex items-center gap-2 active:scale-95 transition-transform">
                 <span className="text-[11px] uppercase tracking-widest">{currentBanner.cta}</span>
                 <ArrowRight size={16} strokeWidth={3} />
               </div>
            </div>
          </div>
        ) : (
          /* DESIGN PADRÃO: LOJA */
          <div className="w-full h-full relative">
            {currentBanner.image && (
                <img src={currentBanner.image} alt={currentBanner.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
            
            <div className="relative h-full flex flex-col justify-end p-8 text-white pointer-events-none pb-12">
                <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] border border-white/20">{currentBanner.category}</span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">{currentBanner.title}</h2>
                <p className="text-[10px] font-bold text-white/90 max-w-[200px] leading-tight drop-shadow-sm mb-4">{currentBanner.subtitle}</p>
                <div className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl w-fit"><span className="text-[9px] font-black uppercase tracking-widest">{currentBanner.cta}</span></div>
            </div>
          </div>
        )}

        {/* BARRA DE PROGRESSO: TRAÇO E PONTOS (