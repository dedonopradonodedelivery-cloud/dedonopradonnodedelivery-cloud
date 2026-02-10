
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  Store as StoreIcon, 
  Newspaper, 
  Tag, 
  SearchX, 
  Clock, 
  LayoutGrid, 
  History,
  Utensils,
  Zap,
  Scissors,
  Key,
  TrendingUp,
  X,
  Hammer,
  ShoppingBag,
  PlusCircle,
  ArrowRight
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

const POPULAR_SEARCHES = [
  { term: 'Restaurante', icon: Utensils },
  { term: 'Eletricista', icon: Zap },
  { term: 'Salão de Beleza', icon: Scissors },
  { term: 'Aluguel', icon: Key },
];

const INTENT_ACTIONS = [
  { 
    id: 'pro', 
    label: 'Preciso de um profissional', 
    icon: Hammer, 
    action: 'Profissional',
    type: 'stores'
  },
  { 
    id: 'food', 
    label: 'Quero pedir comida', 
    icon: Utensils, 
    action: 'Alimentação',
    type: 'stores'
  },
  { 
    id: 'shop', 
    label: 'Quero comprar algo', 
    icon: ShoppingBag, 
    action: 'Loja',
    type: 'stores'
  },
  { 
    id: 'classified', 
    label: 'Quero anunciar ou procurar algo', 
    icon: PlusCircle, 
    action: '',
    type: 'classifieds'
  },
];

export const SearchView: React.FC<SearchViewProps> = ({ onStoreClick, onClassifiedClick, onSelectCategory }) => {
  const { currentNeighborhood } = useNeighborhood();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'stores' | 'classifieds'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches_jpa');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveSearch = (term: string) => {
    if (!term.trim() || recentSearches.includes(term)) return;
    const updated = [term, ...recentSearches.slice(0, 4)];
    setRecentSearches(updated);
    localStorage.setItem('recent_searches_jpa', JSON.stringify(updated));
  };

  const removeRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(t => t !== term);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches_jpa', JSON.stringify(updated));
  };

  const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const results = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term) return { stores: [], classifieds: [] };

    const filteredStores = STORES.filter(s => {
      const matchName = normalize(s.name).includes(term);
      const matchCat = normalize(s.category).includes(term);
      const matchSub = s.subcategory ? normalize(s.subcategory).includes(term) : false;
      const matchTags = s.tags?.some(tag => normalize(tag).includes(term));
      const matchDesc = s.description ? normalize(s.description).includes(term) : false;
      const matchNeighborhood = currentNeighborhood === 'Jacarepaguá (todos)' || s.neighborhood === currentNeighborhood;
      
      return (matchName || matchCat || matchSub || matchTags || matchDesc) && matchNeighborhood;
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

  const handleSearchClick = (term: string, type: 'all' | 'stores' | 'classifieds' = 'all') => {
    setSearchTerm(term);
    setActiveType(type);
    if (term) saveSearch(term);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans flex flex-col pb-32 animate-in fade-in duration-300">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-5 pt-10 pb-6 shrink-0 shadow-sm">
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Buscar</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Busca global no bairro</p>
            </div>
            
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  ref={inputRef}
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => searchTerm && saveSearch(searchTerm)}
                  placeholder="Lojas, serviços, produtos, classificados..." 
                  className="w-full bg-gray-100 dark:bg-gray-800 border-none py-4 pl-12 pr-4 rounded-2xl text-base font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner" 
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tudo', icon: LayoutGrid },
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

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-12">
        
        {searchTerm.length === 0 ? (
            <div className="space-y-12 animate-in fade-in duration-500 pb-10">
                {/* 4) Histórico de buscas */}
                {user && recentSearches.length > 0 && (
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <History size={12} /> Buscas recentes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <button 
                          key={i}
                          onClick={() => handleSearchClick(term)}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-blue-500 transition-all shadow-sm"
                        >
                          {term}
                          <X size={12} className="text-gray-400 hover:text-red-500" onClick={(e) => removeRecent(e, term)} />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* 2) Bloco: "O que as pessoas mais buscam" - Refined */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <TrendingUp size={12} /> O que as pessoas mais buscam
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {POPULAR_SEARCHES.map((item, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSearchClick(item.term)}
                                className="bg-white dark:bg-gray-900 px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3 active:scale-95 transition-all text-left"
                            >
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 shrink-0">
                                    <item.icon size={16} />
                                </div>
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">
                                    {item.term}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 4) Novo Bloco: "O que você quer fazer agora?" */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">O que você quer fazer agora?</h3>
                    <div className="space-y-2.5">
                        {INTENT_ACTIONS.map((intent) => (
                            <button 
                                key={intent.id}
                                onClick={() => handleSearchClick(intent.action, intent.type as any)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-blue-500 shadow-inner">
                                        <intent.icon size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{intent.label}</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3) Bloco: "Categorias populares no bairro" - Refined */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categorias populares</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {CATEGORIES.slice(0, 12).map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => onSelectCategory(cat)}
                                className="flex flex-col items-center gap-2.5 active:scale-95 transition-all group"
                            >
                                <div className="w-full aspect-square rounded-[1.5rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600">
                                    {React.cloneElement(cat.icon as any, { size: 22, strokeWidth: 2.5 })}
                                </div>
                                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase text-center leading-tight truncate w-full px-0.5">
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-gray-200 dark:border-gray-800">
                    <SearchX size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">Nenhum resultado encontrado</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-[240px]">Não encontramos nada para "{searchTerm}" em {currentNeighborhood}.</p>
                
                <div className="mt-10 w-full space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tente buscar por:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['Pizzaria', 'Manicure', 'Pet Shop', 'Mecânico'].map(suggestion => (
                            <button 
                                key={suggestion}
                                onClick={() => handleSearchClick(suggestion)}
                                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold text-blue-600"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="space-y-10 animate-in fade-in duration-300">
                
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
                                    className="w-full flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-[1.75rem] border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all text-left group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-50 dark:border-gray-700">
                                        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-blue-600">{store.name}</h4>
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
