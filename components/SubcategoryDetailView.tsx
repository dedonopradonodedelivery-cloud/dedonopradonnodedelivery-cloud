
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Star, BadgeCheck, ChevronRight, Award, Megaphone, Clock, Filter, Store as StoreIcon, Crown, AlertCircle, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Store, AdType } from '@/types';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { MasterSponsorBanner } from './MasterSponsorBanner';
import { supabase } from '@/lib/supabaseClient';

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

// --- Single Banner Renderer for Subcategories ---
const SubcategoryBanner: React.FC<{ config: any }> = ({ config }) => {
  const { template_id, headline, subheadline, product_image_url, background_color, text_color, title, subtitle } = config;

  if (template_id) {
     // Render Templates
     switch (template_id) {
      case 'oferta_relampago':
        return (
          <div className="w-full h-full bg-gradient-to-br from-rose-500 to-red-600 text-white p-6 flex items-center justify-between overflow-hidden relative shadow-lg">
            <div className="relative z-10">
              <span className="text-[10px] font-bold bg-yellow-300 text-red-700 px-2 py-1 rounded-full uppercase shadow-sm">{headline || 'OFERTA'}</span>
              <h3 className="text-2xl font-black mt-2 drop-shadow-md max-w-[200px] leading-tight">{subheadline}</h3>
            </div>
            <div className="relative z-10 w-24 h-24 rounded-full border-4 border-white/50 bg-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
              {product_image_url ? <img src={product_image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-gray-400" />}
            </div>
          </div>
        );
      case 'lancamento':
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 flex items-end justify-between overflow-hidden relative shadow-lg">
             <img src={product_image_url || 'https://via.placeholder.com/300'} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" />
             <div className="relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">{headline || 'LANÇAMENTO'}</span>
                <h3 className="text-xl font-bold mt-1 max-w-[220px] leading-tight">{subheadline}</h3>
             </div>
          </div>
        );
       case 'institucional':
        return (
          <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 text-slate-800 p-6 flex flex-col justify-center items-center text-center relative shadow-lg border border-gray-200">
             <h3 className="text-xl font-black leading-tight">{headline}</h3>
             <p className="text-xs mt-1 text-slate-500">{subheadline}</p>
          </div>
        );
      default: return null;
    }
  } else {
    // Render Custom Editor
    return (
        <div 
            className="w-full h-full relative shadow-lg p-6 flex flex-col justify-center"
            style={{ backgroundColor: background_color, color: text_color }}
        >
            <h3 className="font-black text-2xl leading-tight line-clamp-2">{title}</h3>
            <p className="opacity-80 mt-1 text-sm line-clamp-2">{subtitle}</p>
        </div>
    );
  }
};

export const SubcategoryDetailView: React.FC<SubcategoryDetailViewProps> = ({ subcategoryName, categoryName, onBack, onStoreClick, stores, userRole, onNavigate }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [activeFilter, setActiveFilter] = useState<'all' | 'top_rated' | 'open_now'>('all');
  const [activeBanner, setActiveBanner] = useState<any | null>(null);

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

  // Fetch 1 Fixed Banner for this Subcategory
  useEffect(() => {
    const fetchSubcategoryBanner = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('published_banners')
          .select('id, config, merchant_id')
          .eq('target', `subcategory:${subcategoryName.toLowerCase()}`) // Target específico da subcategoria
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1); // APENAS 1 BANNER FIXO

        if (error) throw error;
        if (data && data.length > 0) setActiveBanner(data[0]);
        else setActiveBanner(null);
      } catch (e) {
        console.error("Error fetching subcategory banner", e);
      }
    };
    fetchSubcategoryBanner();
  }, [subcategoryName]);

  const handleBannerClick = () => {
    if (activeBanner?.merchant_id) {
        const store = stores.find(s => s.id === activeBanner.merchant_id);
        if (store) onStoreClick(store);
    }
  };

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

      <div className="p-5 space-y-8">
        
        {/* BANNER COMERCIAL FIXO DA SUBCATEGORIA */}
        {activeBanner ? (
           <div 
             onClick={handleBannerClick}
             className="w-full aspect-[16/7] rounded-[2rem] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform shadow-xl relative group"
           >
              <SubcategoryBanner config={activeBanner.config} />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-gray-900 text-[7px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-sm">
                 Patrocinado
              </div>
           </div>
        ) : (
           /* Espaço de venda caso não tenha banner */
           <div 
             onClick={handleAnuncie}
             className="w-full aspect-[16/6] bg-slate-900 rounded-[2rem] flex flex-col items-center justify-center text-center p-6 cursor-pointer relative overflow-hidden shadow-lg border border-white/5"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 block">Espaço Premium</span>
                  <h3 className="text-lg font-bold text-white leading-tight">Destaque sua marca aqui</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Fale com moradores interessados em {subcategoryName}</p>
              </div>
           </div>
        )}

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
