import React, { useState, useMemo } from 'react';
import { ChevronLeft, Star, BadgeCheck, ChevronRight, Award, Megaphone, Clock, Filter, Store as StoreIcon, Crown, AlertCircle, ArrowRight } from 'lucide-react';
import { Store, AdType } from '@/types';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { HomeBannerCarousel } from './HomeBannerCarousel';
import { MasterSponsorBanner } from './MasterSponsorBanner';

// Added missing SubcategoryDetailViewProps interface
interface SubcategoryDetailViewProps {
  subcategoryName: string;
  categoryName: string;
  onBack: () => void;
  onStoreClick: (store: Store) => void;
  stores: Store[];
  userRole: 'cliente' | 'lojista' | null;
  onNavigate: (view: string) => void;
}

const StoreCard: React.FC<{ store: Store; onClick: () => void; isMaster?: boolean }> = ({ store, onClick, isMaster }) => {
  const isSponsored = store.isSponsored || store.adType === AdType.PREMIUM;
  
  return (
    <div onClick={onClick} className={`rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-all duration-300 shadow-sm border ${isSponsored ? 'border-slate-100 bg-slate-50/10 dark:bg-white/5' : 'bg-white dark:bg-gray-800 border-transparent'}`}>
      <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} alt={store.name} className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" />
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

export const SubcategoryDetailView: React.FC<SubcategoryDetailViewProps> = ({ subcategoryName, categoryName, onBack, onStoreClick, stores, userRole, onNavigate }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [activeFilter, setActiveFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');

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

  const handleAnuncie = () => {
    if (userRole === 'lojista') {
      onNavigate('store_ads_module');
    } else {
      alert("Acesso exclusivo para lojistas.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 animate-in slide-in-from-right duration-300">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5 h-16 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-none">{subcategoryName}</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
             {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <HomeBannerCarousel onStoreClick={onStoreClick} categoryName={categoryName} subcategoryName={subcategoryName} />
      </div>

      <div className="p-5 pt-0 space-y-8">
        
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

        {/* BANNER PATROCINADOR MASTER FINAL */}
        <section>
          <MasterSponsorBanner onClick={() => onNavigate('patrocinador_master')} label={subcategoryName} />
        </section>

        {/* CTA Comercial Final */}
        <section className="pt-10">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E5BFF]">
                    <Megaphone size={24} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Quer destacar seu negócio aqui?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">Apareça no topo da categoria {subcategoryName} e atraia mais clientes.</p>
                <button 
                    onClick={handleAnuncie}
                    className="w-full bg-[#1E5BFF] hover:bg-[#1749CC] text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    Anunciar nesta subcategoria <ArrowRight size={16} />
                </button>
            </div>
        </section>

      </div>
    </div>
  );
};