
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, Search, ImageIcon, Star, BadgeCheck, ChevronRight, X, AlertCircle } from 'lucide-react';
import { SUBCATEGORIES } from '../constants';
import { Store, AdType } from '../types';

interface BannerAd {
  id: string;
  image: string;
  title: string;
  link?: string;
  merchantName?: string;
}

const HighlightBanner: React.FC<{ banner: BannerAd; onClick: (id: string) => void; }> = ({ banner, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      onClick={() => onClick(banner.id)}
      className="snap-center flex-shrink-0 w-full h-[180px] rounded-[20px] shadow-lg shadow-black/5 overflow-hidden relative group cursor-pointer"
    >
      {imageError ? (
        <div className="w-full h-full bg-[#F2F2F2] dark:bg-gray-700 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
      ) : (
        <img 
          src={banner.image} 
          alt={banner.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
          onError={() => setImageError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4">
        <p className="text-white font-bold text-lg drop-shadow-md">{banner.title}</p>
      </div>
      {banner.merchantName && (
        <div className="absolute top-3 right-3">
          <div className="bg-[#EAF0FF]/90 text-[#1E5BFF] text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm border border-white/20 uppercase tracking-widest">
            Patrocinado
          </div>
        </div>
      )}
    </div>
  );
};

const SponsoredCarousel: React.FC<{ 
  banners: BannerAd[]; 
  onView?: (id: string) => void; 
  onClick?: (id: string) => void;
}> = ({ banners, onView = (id: string) => {}, onClick = (id: string) => {} }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % banners.length;
            if (scrollRef.current) {
                const scrollWidth = scrollRef.current.scrollWidth;
                const childrenCount = banners.length;
                if (childrenCount > 0) {
                    const targetScroll = (scrollWidth / childrenCount) * nextSlide;
                    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, banners.length]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            if (clientWidth > 0) {
              const index = Math.round(scrollLeft / clientWidth);
              if (index !== currentSlide) {
                  setCurrentSlide(index);
                  onView(banners[index].id);
              }
            }
        }
    };
    
    return (
        <div className="relative">
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar"
            >
                {banners.map((banner) => (
                    <HighlightBanner key={banner.id} banner={banner} onClick={onClick} />
                ))}
            </div>
            
            <div className="flex justify-center items-center gap-1.5 mt-4">
                {banners.map((_, index) => (
                    <div 
                        key={index} 
                        className={`h-1 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'w-6 bg-[#1E5BFF]' : 'w-2 bg-gray-300 dark:bg-gray-700'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

const SubcategoryCard: React.FC<{ icon: React.ReactNode; name: string; onClick: () => void; }> = ({ icon, name, onClick }) => (
    <button 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm px-2 py-4 flex flex-col items-center justify-center cursor-pointer active:scale-95 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 group h-[100px] min-w-[100px]">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 text-[#1E5BFF]"})}
        </div>
        <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 text-center leading-tight uppercase tracking-tighter">{name}</p>
    </button>
);

const HIGHLIGHTS_DATA: BannerAd[] = [
  {
    id: 'ad-1',
    title: 'Ofertas em Restaurantes',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    merchantName: 'Restaurante Saboroso',
  },
  {
    id: 'ad-2',
    title: 'Padarias da Freguesia',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    merchantName: 'Pão Dourado',
  },
  {
    id: 'ad-3',
    title: 'Os melhores Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
  },
];

interface CategoriaAlimentacaoProps {
  onBack: () => void;
  onSelectSubcategory: (subcategoryName: string) => void;
}

export const CategoriaAlimentacao: React.FC<CategoriaAlimentacaoProps> = ({ onBack, onSelectSubcategory }) => {
    const subcategories = SUBCATEGORIES['Alimentação'] || SUBCATEGORIES['Comida'] || [];
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-24">
      <header className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto h-16 bg-white dark:bg-gray-900 shadow-sm z-20 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 transition-all">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
        </button>
        
        {isSearchOpen ? (
            <div className="flex-1 mx-2 relative animate-in fade-in zoom-in-95 duration-200">
                <input 
                    type="text" 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar em Alimentação..."
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-primary-500 shadow-inner dark:text-white"
                />
            </div>
        ) : (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white font-display">Alimentação</h1>
        )}

        <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isSearchOpen ? <X className="w-6 h-6 text-gray-800 dark:text-gray-200" /> : <Search className="w-6 h-6 text-gray-800 dark:text-gray-200" />}
        </button>
      </header>

      <main className="pt-20 px-5 space-y-8">
        {!isSearchOpen && (
            <section>
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">Destaques da Freguesia</h2>
              <SponsoredCarousel banners={HIGHLIGHTS_DATA} />
            </section>
        )}

        {!isSearchOpen && (
            <section>
              <div className="flex flex-col mb-4 px-1">
                <h2 className="text-lg font-black text-gray-900 dark:text-white leading-none">O que você deseja hoje?</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Categorias de Alimentação</p>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
                {subcategories.slice(0, 8).map((sub, i) => (
                    <SubcategoryCard 
                      key={i} 
                      icon={sub.icon}
                      name={sub.name}
                      onClick={() => onSelectSubcategory(sub.name)}
                    />
                ))}
              </div>
            </section>
        )}

        {isSearchOpen && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Digite para buscar</h3>
                <p className="text-xs text-gray-500 mt-1">Busque por pratos, nomes de restaurantes ou especialidades.</p>
            </div>
        )}
      </main>
    </div>
  );
};
