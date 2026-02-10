
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, Check, ChevronRight, SearchX, ShieldCheck, Tag, X, Mic, Bell, Plus } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../../contexts/NeighborhoodContext';
import { Store, Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNotificationClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (view: string, data?: any) => void;
  activeTab: string;
  userRole: "cliente" | "lojista" | null;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  onSelectCategory: (category: Category) => void;
  onOpenMoreCategories: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <MapPin className="w-5 h-5 text-[#1E5BFF]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none">Localização</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Filtrar conteúdo por bairro</p>
                    </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-2">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                    {NEIGHBORHOODS.map(hood => (
                        <button key={hood} onClick={() => setNeighborhood(hood)} className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${currentNeighborhood === hood ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                            <span>{hood}</span>
                            {currentNeighborhood === hood && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({
  user,
  searchTerm,
  onSearchChange,
  onNavigate,
  onNotificationClick,
  activeTab,
  stores = [],
  onStoreClick,
  isAdmin,
  viewMode,
  onOpenViewSwitcher,
  onSelectCategory,
  onOpenMoreCategories,
  userRole
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollY = scrollContainer.scrollTop;
      setIsCollapsed(scrollY > 40);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkNotifs = () => {
      const saved = localStorage.getItem('app_notifications');
      if (saved) {
        const notifs = JSON.parse(saved);
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      }
    };
    checkNotifs();
  }, []);

  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      onSearchChange(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [onSearchChange]);

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + (s.neighborhood || "")).includes(term));
    return { stores: matchedStores.slice(0, 15), categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const dynamicPlaceholder = currentNeighborhood === "Jacarepaguá (todos)" ? "O que busca em JPA?" : `O que busca em ${currentNeighborhood}?`;
  const topCategories = CATEGORIES.slice(0, 5);

  return (
    <>
        <div 
          ref={headerRef}
          className={`sticky top-0 z-40 w-full bg-[#1E5BFF] dark:bg-blue-950 shadow-md rounded-b-[1.5rem] transition-all duration-300 ease-in-out ${isCollapsed ? 'pb-2' : 'pb-6'}`}
        >
            <div className="w-full max-w-md mx-auto flex flex-col relative px-4">
                {/* LINHA 1: TOPBAR */}
                <div className={`flex items-center justify-between pt-5 pb-2 transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-20 opacity-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 shrink-0">
                            <MapPin className="w-5 h-5 text-[#1E5BFF]" fill="currentColor" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-black text-white leading-none tracking-tighter">Localizei JPA</h1>
                            <span className="text-[7px] text-white/60 font-black uppercase tracking-[0.2em] mt-0.5">Jacarepaguá</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={toggleSelector} className="p-2 bg-white/10 rounded-xl text-white active:scale-90 transition-transform">
                            <Plus size={20} strokeWidth={3} />
                        </button>

                        {isAdmin && (
                            <button onClick={onOpenViewSwitcher} className="bg-amber-400 text-slate-900 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <ShieldCheck size={12} />
                                <span className="text-[8px] font-bold uppercase">{viewMode}</span>
                            </button>
                        )}
                        
                        <button onClick={onNotificationClick} className="relative p-2 bg-white/10 rounded-xl text-white active:scale-90 transition-transform">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-[#1E5BFF] shadow-lg">
                                    <span className="text-[7px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* LINHA 2: BUSCA */}
                <div className={`transition-all duration-300 ${isCollapsed ? 'pt-4 pb-1' : 'pt-3 pb-3'}`}>
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={searchTerm} 
                          onChange={(e) => onSearchChange(e.target.value)} 
                          placeholder={dynamicPlaceholder} 
                          className="block w-full pl-10 pr-10 py-3 bg-white border-none rounded-xl text-sm font-semibold text-gray-900 focus:outline-none shadow-lg transition-all" 
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {searchTerm && (
                            <button onClick={() => onSearchChange('')} className="p-1 text-gray-400">
                              <X size={14} />
                            </button>
                          )}
                          <button onClick={startVoiceSearch} className={`p-1.5 rounded-lg ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                            <Mic size={16} />
                          </button>
                        </div>

                        {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden">
                                <div className="p-1 max-h-[60vh] overflow-y-auto no-scrollbar">
                                    {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                        <div className="flex flex-col">
                                            {searchResults.categories.map(cat => (
                                                <button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}>
                                                        <Tag size={14} />
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{cat.name}</p>
                                                    <ChevronRight className="ml-auto w-3 h-3 text-gray-300" />
                                                </button>
                                            ))}
                                            {searchResults.stores.map(store => (
                                                <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left">
                                                    <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                                                        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest truncate">{store.neighborhood}</p>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-gray-300" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 px-4 text-center">
                                            <SearchX className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">Nenhum resultado</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* LINHA 3: CATEGORIAS */}
                {activeTab === 'home' && (
                    <div className={`flex items-center gap-3 overflow-x-auto no-scrollbar transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100 pt-1'}`}>
                        {topCategories.map((cat) => (
                            <button 
                                key={cat.id} 
                                onClick={() => onSelectCategory(cat)} 
                                className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                            >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20 border border-white/10 shadow-sm">
                                    {React.cloneElement(cat.icon as any, { size: 20, className: "text-white", strokeWidth: 2.5 })}
                                </div>
                                <span className="text-[7px] font-black text-white uppercase tracking-tighter text-center truncate w-12">{cat.name}</span>
                            </button>
                        ))}
                        <button 
                            onClick={onOpenMoreCategories} 
                            className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-transform"
                        >
                            <div className="w-11 h-11 rounded-xl bg-white/10 border border-dashed border-white/20 flex items-center justify-center text-white/80">
                                <Plus size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-[7px] font-black text-white/80 uppercase tracking-tighter text-center w-12">+ Mais</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};
