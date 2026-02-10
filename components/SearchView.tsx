
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, Star, ChevronRight, Store as StoreIcon, Newspaper, Tag, Package, SearchX, Clock, Map } from 'lucide-react';
import { Store, Classified } from '../types';
import { STORES, MOCK_CLASSIFIEDS } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';

interface SearchViewProps {
  onStoreClick: (store: Store) => void;
  onClassifiedClick: (item: Classified) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onStoreClick, onClassifiedClick }) => {
  const { currentNeighborhood } = useNeighborhood();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'stores' | 'classifieds'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const results = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term) return { stores: [], classifieds: [] };

    const filteredStores = STORES.filter(s => {
      const matchName = normalize(s.name).includes(term);
      const matchCat = normalize(s.category).includes(term);
      const matchSub = s.subcategory ? normalize(s.subcategory).includes(term) : false;
      const matchTags = s.tags?.some(tag => normalize(tag).includes(term));
      const matchNeighborhood = currentNeighborhood === 'Jacarepaguá (todos)' || s.neighborhood === currentNeighborhood;
      return (matchName || matchCat || matchSub || matchTags) && matchNeighborhood;
    });

    const filteredClassifieds = MOCK_CLASSIFIEDS.filter(c => {
      const matchTitle = normalize(c.title).includes(term);
      const matchDesc = normalize(c.description).includes(term);
      const matchCat = normalize(c.category).includes(term);
      const matchNeighborhood = currentNeighborhood === 'Jacarepaguá (todos)' || c.neighborhood === currentNeighborhood;
      return (matchTitle || matchDesc || matchCat) && matchNeighborhood;
    });

    return {
      stores: filteredStores,
      classifieds: filteredClassifieds
    };
  }, [searchTerm, currentNeighborhood]);

  const isEmpty = searchTerm.length > 0 && results.stores.length === 0 && results.classifieds.length === 0;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in fade-in duration-300">
      {/* Header com Busca Global no Topo */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-10 pb-6 shrink-0 shadow-sm">
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Buscar</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Busca Global no Bairro</p>
            </div>
            
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  ref={inputRef}
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Lojas, serviços, produtos, classificados..." 
                  className="w-full bg-gray-100 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-base font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner" 
                />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tudo', icon: Map },
                  { id: 'stores', label: 'Lojas & Serviços', icon: StoreIcon },
                  { id: 'classifieds', label: 'Classificados', icon: Newspaper }
                ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveType(tab.id as any)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        activeType === tab.id 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                          : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'
                      }`}
                    >
                        <tab.icon size={12} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-8">
        
        {searchTerm.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center opacity-40">
                <Search size={64} className="text-gray-300 mb-6" />
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">O que você busca em JPA?</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Digite acima para encontrar comércios, vagas de emprego, doações, desapegos e muito mais.</p>
            </div>
        ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-gray-200 dark:border-gray-800">
                    <SearchX size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">Nenhum resultado</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-[240px]">Não encontramos nada para "{searchTerm}" em {currentNeighborhood}.</p>
                <button onClick={() => setSearchTerm('')} className="mt-8 text-blue-600 font-black text-[10px] uppercase tracking-widest border-b border-blue-600 pb-1">Limpar Busca</button>
            </div>
        ) : (
            <div className="space-y-10">
                
                {/* RESULTADOS DE LOJAS */}
                {(activeType === 'all' || activeType === 'stores') && results.stores.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lojas & Serviços ({results.stores.length})</h2>
                        </div>
                        <div className="space-y-3">
                            {results.stores.map(store => (
                                <button 
                                    key={store.id}
                                    onClick={() => onStoreClick(store)}
                                    className="w-full flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-[1.75rem] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all text-left"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-50 dark:border-gray-700">
                                        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{store.name}</h4>
                                            {store.verified && <Tag size={10} className="text-blue-500 fill-blue-500" />}
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">{store.category} • {store.neighborhood}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                                                <Star size={10} fill="currentColor" />
                                                {store.rating.toFixed(1)}
                                            </div>
                                            {store.isOpenNow && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Aberto</span>}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* RESULTADOS DE CLASSIFICADOS */}
                {(activeType === 'all' || activeType === 'classifieds') && results.classifieds.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classificados ({results.classifieds.length})</h2>
                        </div>
                        <div className="space-y-3">
                            {results.classifieds.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => onClassifiedClick(item)}
                                    className="w-full flex items-start gap-4 bg-white dark:bg-gray-900 p-4 rounded-[1.75rem] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all text-left"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700">
                                        <img src={item.imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1.5">{item.title}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider">{item.category}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                            <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500" /> {item.neighborhood}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} className="text-blue-500" /> {item.timestamp}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center h-16 shrink-0">
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        )}

      </main>
    </div>
  );
};
