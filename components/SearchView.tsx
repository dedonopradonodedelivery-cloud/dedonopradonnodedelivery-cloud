
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  Store as StoreIcon, 
  Newspaper, 
  Tag, 
  SearchX, 
  Clock, 
  Utensils,
  Zap,
  Scissors,
  TrendingUp,
  X,
  Hammer,
  ShoppingBag,
  ArrowRight,
  Star,
  MapPin,
  LayoutGrid
} from 'lucide-react';
import { Store, Classified, Category } from '../types';
import { STORES, MOCK_CLASSIFIEDS, CATEGORIES } from '../constants';
import { useNeighborhood } from '../contexts/NeighborhoodContext';
import { useAuth } from '../contexts/AuthContext';

interface SearchViewProps {
  onStoreClick: (store: Store) => void;
  onClassifiedClick: (item: Classified) => void;
  onSelectCategory: (category: Category) => void;
}

const POPULAR_CHIPS = ['Pizza', 'Eletricista', 'Manicure', 'Pet Shop'];

const PRIMARY_INTENTS = [
  { 
    id: 'pro', 
    label: 'Preciso de um profissional', 
    sub: 'Eletricistas, encanadores e mais',
    icon: Hammer, 
    term: 'Profissional'
  },
  { 
    id: 'food', 
    label: 'Quero comer ou pedir comida', 
    sub: 'Restaurantes, lanches e delivery',
    icon: Utensils, 
    term: 'Alimentação'
  },
  { 
    id: 'shop', 
    label: 'Quero comprar algo', 
    sub: 'Lojas, mercados e farmácias',
    icon: ShoppingBag, 
    term: 'Loja'
  }
];

export const SearchView: React.FC<SearchViewProps> = ({ onStoreClick, onClassifiedClick, onSelectCategory }) => {
  const { currentNeighborhood } = useNeighborhood();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'stores' | 'classifieds'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

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
      const matchCat = normalize(c.category).includes(term);
      const matchNeighborhood = currentNeighborhood === 'Jacarepaguá (todos)' || c.neighborhood === currentNeighborhood;
      
      return (matchTitle || matchCat) && matchNeighborhood;
    });

    return { stores: filteredStores, classifieds: filteredClassifieds };
  }, [searchTerm, currentNeighborhood]);

  const isEmpty = searchTerm.length > 0 && results.stores.length === 0 && results.classifieds.length === 0;

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in fade-in duration-300">
      {/* Search Header - Preservado conforme solicitado */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-5 pt-10 pb-6 shrink-0">
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Buscar</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Jacarepaguá em um só lugar</p>
            </div>
            
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  ref={inputRef}
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="O que você procura?" 
                  className="w-full bg-gray-100 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-base font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner" 
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    <X size={18} />
                  </button>
                )}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tudo' },
                  { id: 'stores', label: 'Lojas & Serviços' },
                  { id: 'classifieds', label: 'Classificados' }
                ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveType(tab.id as any)}
                      className={`flex-shrink-0 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeType === tab.id 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5">
        
        {searchTerm.length === 0 ? (
            <div className="space-y-10 animate-in fade-in duration-500">
                
                {/* 2) Bloco: "O que você precisa agora?" - Novo Foco Principal */}
                <section className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest ml-1">O que você precisa agora?</h3>
                    <div className="space-y-3">
                        {PRIMARY_INTENTS.map((intent) => (
                            <button 
                                key={intent.id}
                                onClick={() => handleQuickSearch(intent.term)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[1.75rem] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shadow-inner">
                                        <intent.icon size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">{intent.label}</p>
                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{intent.sub}</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600" />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 4) Bloco: "Mais buscados" - Compacto e secundário */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1 text-gray-400">
                        <TrendingUp size={12} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Mais buscados</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_CHIPS.map((term) => (
                            <button 
                                key={term}
                                onClick={() => handleQuickSearch(term)}
                                className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:border-blue-500 transition-all"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 5) Categorias: Linha horizontal leve */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categorias</h3>
                        <button 
                            onClick={() => handleQuickSearch('')} 
                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                        >
                            Ver todas
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
                        {CATEGORIES.slice(0, 10).map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => onSelectCategory(cat)}
                                className="flex flex-col items-center gap-2 group active:scale-95 transition-all shrink-0"
                            >
                                <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 group-hover:text-blue-600 transition-colors shadow-sm">
                                    {React.cloneElement(cat.icon as any, { size: 20 })}
                                </div>
                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase text-center truncate w-14">
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-gray-200 dark:border-gray-800">
                    <SearchX size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">Nenhum resultado</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-[240px]">Não encontramos nada para "{searchTerm}" em {currentNeighborhood}.</p>
                <button onClick={() => setSearchTerm('')} className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest">Limpar busca</button>
            </div>
        ) : (
            <div className="space-y-10 animate-in fade-in duration-300">
                
                {/* RESULTADOS DE LOJAS */}
                {(activeType === 'all' || activeType === 'stores') && results.stores.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lojas & Serviços ({results.stores.length})</h2>
                        <div className="space-y-3">
                            {results.stores.map(store => (
                                <button 
                                    key={store.id}
                                    onClick={() => onStoreClick(store)}
                                    className="w-full flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all text-left group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600">{store.name}</h4>
                                            {store.verified && <Tag size={10} className="text-blue-500 fill-blue-50 dark:fill-gray-900" />}
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{store.category} • {store.neighborhood}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                                                <Star size={10} fill="currentColor" /> {store.rating.toFixed(1)}
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
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Classificados ({results.classifieds.length})</h2>
                        <div className="space-y-3">
                            {results.classifieds.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => onClassifiedClick(item)}
                                    className="w-full flex items-start gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all text-left"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0">
                                        <img src={item.imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mb-1.5">{item.title}</h4>
                                        <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                            <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500" /> {item.neighborhood}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} className="text-blue-500" /> {item.timestamp}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 mt-6" />
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
