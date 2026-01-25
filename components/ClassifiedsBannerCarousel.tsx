
import React, { useState, useMemo, useEffect } from 'react';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { STORES } from '../constants';
import { Store } from '../types';

interface BannerData {
  id: string;
  storeId?: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  neighborhood: string;
  placement: 'home' | 'category';
  category?: 'services' | 'real_estate' | 'jobs' | 'pets' | 'donations';
}

const MOCK_BANNERS: BannerData[] = [
  // Home Banners (4 por bairro)
  { id: 'ch-fre-1', neighborhood: 'Freguesia', placement: 'home', title: 'Sua Sala Comercial', subtitle: 'No coração da Freguesia', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600', bgColor: 'bg-blue-800' },
  { id: 'ch-fre-2', neighborhood: 'Freguesia', placement: 'home', title: 'Contrate Perto de Casa', subtitle: 'Vagas abertas na Freguesia', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600', bgColor: 'bg-emerald-800' },
  { id: 'ch-fre-3', neighborhood: 'Freguesia', placement: 'home', title: 'Adote um Amigo', subtitle: 'Animais esperando por um lar', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=600', bgColor: 'bg-amber-700' },
  { id: 'ch-fre-4', neighborhood: 'Freguesia', placement: 'home', title: 'Serviços Rápidos', subtitle: 'Resolva tudo sem sair do bairro', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600', bgColor: 'bg-slate-800' },
  { id: 'ch-taq-1', neighborhood: 'Taquara', placement: 'home', title: 'Imóveis na Taquara', subtitle: 'Oportunidades únicas de negócio', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600', bgColor: 'bg-blue-800' },
  { id: 'ch-taq-2', neighborhood: 'Taquara', placement: 'home', title: 'Empregos na Taquara', subtitle: 'Sua nova carreira começa aqui', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600', bgColor: 'bg-emerald-800' },
  { id: 'ch-taq-3', neighborhood: 'Taquara', placement: 'home', title: 'Adoção Responsável', subtitle: 'Encontre seu pet na Taquara', image: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?q=80&w=600', bgColor: 'bg-amber-700' },
  { id: 'ch-taq-4', neighborhood: 'Taquara', placement: 'home', title: 'Profissionais Locais', subtitle: 'Serviços de confiança na Taquara', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600', bgColor: 'bg-slate-800' },
  
  // Category Banners (3 por categoria por bairro)
  { id: 'cc-fre-re-1', neighborhood: 'Freguesia', placement: 'category', category: 'real_estate', title: 'Aluguel Facilitado', subtitle: 'As melhores salas comerciais', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600', bgColor: 'bg-purple-800' },
  { id: 'cc-fre-re-2', neighborhood: 'Freguesia', placement: 'category', category: 'real_estate', title: 'Venda seu Ponto', subtitle: 'Avaliação gratuita com nossos parceiros', image: 'https://images.unsplash.com/photo-1522881193457-33ae7c39524e?q=80&w=600', bgColor: 'bg-sky-800' },
  { id: 'cc-fre-re-3', neighborhood: 'Freguesia', placement: 'category', category: 'real_estate', title: 'Invista no Bairro', subtitle: 'Imóveis comerciais com alto potencial', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=600', bgColor: 'bg-teal-800' },
  { id: 'cc-fre-jobs-1', neighborhood: 'Freguesia', placement: 'category', category: 'jobs', title: 'Vagas Urgentes', subtitle: 'Início imediato na Freguesia', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600', bgColor: 'bg-red-800' },
];

const GENERAL_BANNERS: BannerData[] = [
    { id: 'c-gen-1', neighborhood: 'Jacarepaguá (todos)', placement: 'home', title: 'Anuncie nos Classificados', subtitle: 'Visibilidade para seu anúncio ou serviço', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600', bgColor: 'bg-indigo-600' },
    { id: 'c-gen-2', neighborhood: 'Jacarepaguá (todos)', placement: 'category', category: 'real_estate', title: 'Destaque seu Imóvel', subtitle: 'Venda ou alugue mais rápido', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600', bgColor: 'bg-purple-600' },
    { id: 'c-gen-3', neighborhood: 'Jacarepaguá (todos)', placement: 'category', category: 'jobs', title: 'Contrate Talentos Locais', subtitle: 'Anuncie sua vaga de emprego aqui', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600', bgColor: 'bg-emerald-600' },
];

interface ClassifiedsBannerCarouselProps {
  onStoreClick?: (store: Store) => void;
  categoryName?: 'services' | 'real_estate' | 'jobs' | 'pets' | 'donations';
}

export const ClassifiedsBannerCarousel: React.FC<ClassifiedsBannerCarouselProps> = ({ onStoreClick, categoryName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { currentNeighborhood } = useNeighborhood();
    const bannerCount = categoryName ? 3 : 4;

    const activeBanners = useMemo(() => {
        const placement = categoryName ? 'category' : 'home';
        
        let pool = MOCK_BANNERS.filter(b => 
            (b.neighborhood === currentNeighborhood || currentNeighborhood === 'Jacarepaguá (todos)') &&
            b.placement === placement &&
            (!categoryName || b.category === categoryName)
        );

        if (pool.length < bannerCount) {
            const generalPool = GENERAL_BANNERS.filter(b => 
                b.placement === placement && 
                (!categoryName || b.category === categoryName || !b.category)
            );
            const needed = bannerCount - pool.length;
            const uniqueGeneral = generalPool.filter(gb => !pool.some(p => p.id === gb.id));
            pool = [...pool, ...uniqueGeneral.slice(0, needed)];
        }

        return pool.slice(0, bannerCount);
    }, [currentNeighborhood, categoryName, bannerCount]);

    useEffect(() => {
        if (activeBanners.length <= 1) return;
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeBanners.length]);
    
    useEffect(() => {
      setCurrentIndex(0);
    }, [categoryName, currentNeighborhood]);

    if (activeBanners.length === 0) return null;

    const currentBanner = activeBanners[currentIndex];

    const handleBannerClick = () => {
        if (currentBanner.storeId && onStoreClick) {
            const store = STORES.find(s => s.id === currentBanner.storeId);
            if (store) onStoreClick(store);
        } else {
            console.log('Clicked generic banner:', currentBanner.id);
        }
    };

    return (
      <div className="mb-8">
        <div 
          onClick={handleBannerClick}
          className={`relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 active:brightness-90 active:scale-[0.99] group ${currentBanner.bgColor}`}
        >
          <img 
            src={currentBanner.image} 
            alt={currentBanner.title} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          <div className="relative h-full flex flex-col justify-end p-6 text-white">
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-md">
              {currentBanner.title}
            </h2>
            <p className="text-xs font-bold text-white/90 max-w-[240px] leading-tight drop-shadow-sm">
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
