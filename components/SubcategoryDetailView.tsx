
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Star, BadgeCheck, ChevronRight, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { Store, AdType } from '../types';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { MasterSponsorBadge } from './MasterSponsorBadge';

interface SubcategoryDetailViewProps {
  subcategoryName: string;
  categoryName: string;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  userRole: 'cliente' | 'lojista' | null;
  onNavigate: (view: string) => void;
}

const StoreCard: React.FC<{ store: Store; onClick: () => void }> = ({ store, onClick }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  
  return (
    <div onClick={onClick} className={`rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-sm border ${isSponsored ? 'border-slate-100 bg-slate-50/10 dark:bg-white/5' : 'bg-white dark:bg-gray-800 border-transparent'}`}>
      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-cover p-0 group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
            {store.verified && <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#1E5BFF] shrink-0" />}
          </div>
          {isSponsored && <span className="text-[8px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded uppercase tracking-tighter">PATROCINADO</span>}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
          <span className="flex items-center gap-1 font-bold text-[#1E5BFF]"><Star className="w-3 h-3 fill-current" /> {store.rating?.toFixed(1)}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <span className="truncate">{store.neighborhood}</span>
          {store.isOpenNow && <span className="text-emerald-500 font-bold ml-1">Aberto</span>}
        </div>
      </div>
      <div className="flex items-center pr-1"><ChevronRight className="w-4 h-4 text-gray-200" /></div>
    </div>
  );
};

const getSubcategoryBannerData = (subcategory: string, neighborhood: string) => {
    const seed = subcategory.length + neighborhood.length;
    
    const backgrounds = [
        'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600', 'bg-indigo-600'
    ];
    
    const images = [
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
        'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800',
        'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
        'https://images.unsplash.com/photo-1600585152220-029e859e156b?q=80&w=800',
    ];

    const ctas = [
        'Conhecer Agora', 'Ver Ofertas', 'Agendar Visita', 'Pedir Orçamento', 'Saiba Mais'
    ];
    
    const bg = backgrounds[seed % backgrounds.length];
    const img = images[seed % images.length];
    const cta = ctas[seed % ctas.length];
    
    return {
        title: `Destaque em ${subcategory}`,
        storeName: `${subcategory} Premium ${neighborhood}`,
        subtitle: `A melhor opção de ${subcategory.toLowerCase()} em ${neighborhood}.`,
        cta,
        bgColor: bg,
        image: img
    };
};

export const SubcategoryDetailView: React.FC<SubcategoryDetailViewProps> = ({ subcategoryName, categoryName, onBack, onStoreClick, stores, onNavigate }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [activeFilter, setActiveFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');

  const bannerData = useMemo(() => {
      const hood = currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood;
      return getSubcategoryBannerData(subcategoryName, hood);
  }, [subcategoryName, currentNeighborhood]);

  const pool = useMemo(() => {
    let list = stores.filter(s => s.subcategory === subcategoryName);
    if (currentNeighborhood !== "Jacarepaguá (todos)") {
      list = list.filter(s => s.neighborhood === currentNeighborhood);
    }
    return list;
  }, [subcategoryName, currentNeighborhood, stores]);

  const filteredList = useMemo(() => {
    let list = [...pool];
    if (activeFilter === 'top_rated') list = list.filter(s => (s.rating || 0) >= 4.7);
    if (activeFilter === 'open_now') list = list.filter(s => s.isOpenNow);

    const sponsored = list.filter(s => s.isSponsored || s.adType === AdType.PREMIUM);
    const organic = list.filter(s => !s.isSponsored && s.adType !== AdType.PREMIUM);
    
    return [...sponsored, ...organic];
  }, [pool, activeFilter]);

  const handleBannerClick = () => {
      const targetStore = pool[0] || {
          id: `banner-${subcategoryName}`,
          name: bannerData.storeName,
          category: categoryName,
          subcategory: subcategoryName,
          description: bannerData.subtitle,
          adType: AdType.PREMIUM,
          rating: 5.0,
          neighborhood: currentNeighborhood,
          verified: true,
          isOpenNow: true,
          image: bannerData.image,
          logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(bannerData.storeName)}&background=random&color=fff`
      };
      onStoreClick(targetStore as Store);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" strokeWidth={3} />
          </button>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none">{subcategoryName}</h1>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
               {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
            </p>
          </div>
        </div>
        <MasterSponsorBadge />
      </div>

      <div className="p-5 space-y-8">
        <div 
            onClick={handleBannerClick}
            className={`relative aspect-[16/12] w-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300 active:scale-[0.98] group ${bannerData.bgColor} shadow-xl shadow-black/10`}
        >
            <div className="w-full h-full relative">
                <img 
                    src={bannerData.image} 
                    alt={bannerData.title} 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105 pointer-events-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                
                <div className="relative h-full flex flex-col justify-end p-8 text-white pointer-events-none">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.15em] border border-white/20">
                            Destaque
                        </span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
                        {bannerData.storeName}
                    </h2>
                    <p className="text-[10px] font-bold text-white/90 max-w-[220px] leading-tight drop-shadow-sm mb-4">
                        {bannerData.subtitle}
                    </p>
                    <div className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-xl w-fit">
                        <span className="text-[9px] font-black uppercase tracking-widest">{bannerData.cta}</span>
                        <ArrowRight size={12} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>

        <section>
            <div className="flex items-center gap-2 mb-4 px-1">
                <Filter size={14} className="text-gray-400" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtrar Lista</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeFilter === 'all' ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
                >
                    Tudo
                </button>
                <button 
                  onClick={() => setActiveFilter('top_rated')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeFilter === 'top_rated' ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
                >
                    Top Avaliados
                </button>
                <button 
                  onClick={() => setActiveFilter('open_now')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeFilter === 'open_now' ? 'bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-100 dark:border-gray-700'}`}
                >
                    Aberto Agora
                </button>
            </div>
        </section>

        <section>
            <div className="flex flex-col gap-3">
                {filteredList.map(store => (
                    <StoreCard key={store.id} store={store} onClick={() => onStoreClick(store)} />
                ))}
            </div>
            
            {filteredList.length === 0 && (
                <div className="py-20 text-center opacity-30 flex flex-col items-center">
                    <AlertCircle size={48} className="mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">Nenhum resultado para os filtros selecionados</p>
                </div>
            )}
        </section>

        <section>
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label={subcategoryName} />
        </section>

      </div>
    </div>
  );
};
