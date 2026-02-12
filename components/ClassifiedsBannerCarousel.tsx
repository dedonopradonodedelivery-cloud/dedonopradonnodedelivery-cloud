
import React, { useState, useMemo, useEffect } from 'react';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { MOCK_CLASSIFIEDS } from '@/constants';
import { Classified } from '@/types';

interface HighlightBanner {
  id: string;
  neighborhood: string;
  title: string;
  category: string;
  imageUrl: string;
  anuncioId: string;
  active: boolean;
}

const HIGHLIGHT_BANNERS: HighlightBanner[] = [
  // Freguesia
  { id: 'hb-fre-1', neighborhood: 'Freguesia', title: 'Sala Comercial Tirol', category: 'Imóveis Comerciais', anuncioId: 'cl-im-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600' },
  { id: 'hb-fre-2', neighborhood: 'Freguesia', title: 'Oportunidade de Emprego', category: 'Empregos', anuncioId: 'cl-emp-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1521737706145-31adb8220387?q=80&w=600' },
  // Taquara
  { id: 'hb-taq-1', neighborhood: 'Taquara', title: 'Instalação de Split', category: 'Orçamento de Serviços', anuncioId: 'cl-serv-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1596541324213-981a54a48576?q=80&w=600' },
  { id: 'hb-taq-2', neighborhood: 'Taquara', title: 'Galpão na Taquara', category: 'Imóveis Comerciais', anuncioId: 'cl-im-3', active: true, imageUrl: 'https://images.unsplash.com/photo-1587022205345-66b3e6486d3b?q=80&w=600' },
  // Pechincha
  { id: 'hb-pec-1', neighborhood: 'Pechincha', title: 'iPhone 11 Desapego', category: 'Desapega JPA', anuncioId: 'cl-des-3', active: true, imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0e12de?q=80&w=600' },
  { id: 'hb-pec-2', neighborhood: 'Pechincha', title: 'Doação de Roupas', category: 'Doações em geral', anuncioId: 'cl-doa-1', active: true, imageUrl: 'https://images.unsplash.com/photo-160533833-2413154b54e3?q=80&w=600' },
  // Anil
  { id: 'hb-ani-1', neighborhood: 'Anil', title: 'Mesa de Jantar', category: 'Desapega JPA', anuncioId: 'cl-des-4', active: true, imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=600' },
  { id: 'hb-ani-2', neighborhood: 'Anil', title: 'Doe Livros Infantis', category: 'Doações em geral', anuncioId: 'cl-doa-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600' },
  // Tanque
  { id: 'hb-tan-1', neighborhood: 'Tanque', title: 'Adoção de Cachorrinha', category: 'Adoção de pets', anuncioId: 'cl-ado-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=600' },
  { id: 'hb-tan-2', neighborhood: 'Tanque', title: 'Doação de Cestas', category: 'Doações em geral', anuncioId: 'cl-doa-5', active: true, imageUrl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=600' },
  // Curicica
  { id: 'hb-cur-1', neighborhood: 'Curicica', title: 'Montador de Móveis', category: 'Orçamento de Serviços', anuncioId: 'cl-serv-5', active: true, imageUrl: 'https://images.unsplash.com/photo-1600585152220-029e859e156b?q=80&w=600' },
  { id: 'hb-cur-2', neighborhood: 'Curicica', title: 'Motorista Categoria D', category: 'Empregos', anuncioId: 'cl-emp-4', active: true, imageUrl: 'https://images.unsplash.com/photo-1551803091-e373c2c606b2?q=80&w=600' },
  // Cidade de Deus
  { id: 'hb-cdd-1', neighborhood: 'Cidade de Deus', title: 'Apoio Alimentar', category: 'Doações em geral', anuncioId: 'cl-cdd-1', active: true, imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600' },
  { id: 'hb-cdd-2', neighborhood: 'Cidade de Deus', title: 'Vaga Limpeza', category: 'Empregos', anuncioId: 'cl-cdd-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=600' },
  // Gardênia Azul
  { id: 'hb-gar-1', neighborhood: 'Gardênia Azul', title: 'Aluguel Gardênia', category: 'Imóveis Comerciais', anuncioId: 'cl-gar-1', active: true, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600' },
  { id: 'hb-gar-2', neighborhood: 'Gardênia Azul', title: 'Fogão Semi-novo', category: 'Desapega JPA', anuncioId: 'cl-gar-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1584990344616-3b94b3c59230?q=80&w=600' },
  // Praça Seca
  { id: 'hb-prs-1', neighborhood: 'Praça Seca', title: 'Adoção Urgente', category: 'Adoção de pets', anuncioId: 'cl-prs-1', active: true, imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=600' },
  { id: 'hb-prs-2', neighborhood: 'Praça Seca', title: 'Manicure Express', category: 'Orçamento de Serviços', anuncioId: 'cl-prs-2', active: true, imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600' },
];

interface ClassifiedsBannerCarouselProps {
  onItemClick: (item: Classified) => void;
}

export const ClassifiedsBannerCarousel: React.FC<ClassifiedsBannerCarouselProps> = ({ onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentNeighborhood } = useNeighborhood();

  const activeBanners = useMemo(() => {
    // Filtra por bairro. Se for "Todos", mostra os da Freguesia como destaque padrão.
    const hoodKey = currentNeighborhood === "Jacarepaguá (todos)" ? "Freguesia" : currentNeighborhood;
    const banners = HIGHLIGHT_BANNERS.filter(b => b.neighborhood === hoodKey && b.active).slice(0, 2);
    
    // Fallback caso não encontre no bairro (mostra Freguesia)
    if (banners.length === 0) {
        return HIGHLIGHT_BANNERS.filter(b => b.neighborhood === 'Freguesia' && b.active).slice(0, 2);
    }
    return banners;
  }, [currentNeighborhood]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentNeighborhood]);

  const handleBannerClick = (banner: HighlightBanner) => {
    const item = MOCK_CLASSIFIEDS.find(c => c.id === banner.anuncioId);
    if (item) {
        onItemClick(item);
    } else {
        console.warn("Anúncio associado ao banner não encontrado:", banner.anuncioId);
    }
  };

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  return (
    <div className="mb-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">⭐ Destaques do bairro</span>
      </div>
      
      <div 
        onClick={() => handleBannerClick(current)}
        className={`relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer transition-all duration-300 active:scale-[0.99] bg-slate-900`}
      >
        <img 
          src={current.imageUrl} 
          alt={current.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
             <span className="bg-[#1E5BFF] text-white text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{current.category}</span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter leading-tight mb-1">
            {current.title}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-widest">Ver detalhes</span>
          </div>
        </div>

        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 right-6 flex gap-1.5">
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
