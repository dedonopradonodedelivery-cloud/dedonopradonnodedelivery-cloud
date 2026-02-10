
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, Mic, Bell, Loader2, X, Plus, Menu } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../../contexts/NeighborhoodContext';
import { Store, Category } from '../../types';
import { CATEGORIES } from '../../constants';

interface HeaderProps {
  onNotificationClick: () => void;
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (view: string, data?: any) => void;
  activeTab: string;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  userRole?: string | null;
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
  onNotificationClick, 
  user,
  searchTerm,
  onSearchChange,
  onNavigate,
  activeTab,
  stores = [],
  onStoreClick,
  isAdmin,
  viewMode,
  onOpenViewSwitcher
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [isListening, setIsListening] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const checkNotifs = () => {
      const saved = localStorage.getItem('app_notifications');
      if (saved) {
        const notifs = JSON.parse(saved);
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      }
    };
    checkNotifs();
    window.addEventListener('storage', checkNotifs);
    const interval = setInterval(checkNotifs, 3000);
    return () => {
      window.removeEventListener('storage', checkNotifs);
      clearInterval(interval);
    };
  }, []);

  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta pesquisa por voz.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [onSearchChange]);

  const normalize = (text: any) => (String(text || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const rootWord = (str: string) => str.endsWith('s') ? str.slice(0, -1) : str;

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const rootTerm = rootWord(term);
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.map(store => {
        const normName = normalize(store.name);
        const normCat = normalize(store.category);
        const normSub = normalize(store.subcategory);
        const normDesc = normalize(store.description);
        if (store.tags) {
            const matchedTag = store.tags.find(tag => {
                const normTag = normalize(tag);
                return normTag.includes(term) || rootWord(normTag).includes(rootTerm);
            });
            if (matchedTag) return { store, matchReason: `Encontrado por: ${matchedTag}`, priority: 1 };
        }
        if (normName.includes(term)) return { store, matchReason: '', priority: 2 };
        if (normCat.includes(term) || normSub.includes(term)) return { store, matchReason: '', priority: 3 };
        if (normDesc.includes(term)) return { store, matchReason: '', priority: 4 };
        return null;
    })
    .filter(Boolean)
    .sort((a, b) => (a!.priority - b!.priority))
    .slice(0, 15);
    return { stores: matchedStores, categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const dynamicPlaceholder = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") return "O que você busca em JPA?";
    return `O que você busca em ${currentNeighborhood}?`;
  }, [currentNeighborhood]);

  return (
    <>
        {/* CAMADA 1 — BRANDING (FIXO NO TOPO) */}
        <div className="fixed top-0 left-0 right-0 z-[10] bg-[#1E5BFF] dark:bg-blue-950 max-w-md mx-auto">
            <div className="h-[60px] flex items-center px-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-sm">
                         <MapPin size={18} fill="currentColor" />
                    </div>
                    <span className="font-display font-black text-lg text-white tracking-tight">
                        Localizei JPA
                    </span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-amber-400 text-slate-900 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                            <ShieldCheck size={14} className="text-slate-900" />
                            <span className="text-[10px] font-bold uppercase">{viewMode}</span>
                        </button>
                    )}
                    
                    <button onClick={toggleSelector} className="relative p-2.5 bg-white/10 dark:bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
                        <Plus size={22} />
                        {currentNeighborhood !== "Jacarepaguá (todos)" && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border border-[#1E5BFF]"></span>
                        )}
                    </button>

                    <button onClick={onNotificationClick} className="relative p-2.5 bg-white/10 dark:bg-white/5 rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
                        <Bell size={22} className={unreadCount > 0 ? 'animate-wiggle' : ''} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1E5BFF] shadow-lg animate-in zoom-in duration-300">
                                <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* CAMADA 1.5 — BARRA DE BUSCA (STICKY QUE SOBREPOE O BRANDING) */}
        <div className="sticky top-0 z-[30] w-full max-w-md mx-auto mt-[60px]">
            <div className="bg-[#1E5BFF] dark:bg-blue-950 px-5 py-1">
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => onSearchChange(e.target.value)} 
                      placeholder={dynamicPlaceholder} 
                      className="block w-full pl-10 pr-12 bg-white border-none rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/20 py-4 shadow-xl transition-all duration-300" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {searchTerm && (
                        <button onClick={() => onSearchChange('')} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={16} />
                        </button>
                      )}
                      <button onClick={startVoiceSearch} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-50 text-white animate-pulse' : 'text-gray-400 hover:text-[#1E5BFF]'}`}>
                        <Mic size={18} strokeWidth={isListening ? 3 : 2} />
                      </button>
                    </div>

                    {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                                {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                    <div className="flex flex-col">
                                        {searchResults.categories.map(cat => (<button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group"><div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}><Tag size={14} /></div><div className="flex-1"><p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>))}
                                        {searchResults.stores.map((item: any) => {
                                            const store = item.store;
                                            return (
                                                <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left group">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0"><img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                        <div className="flex flex-col">
                                                            <p className="text-[9px] text-gray-400 font-medium truncate">{store.category} • {store.neighborhood}</p>
                                                            {item.matchReason && (
                                                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-0.5 flex items-center gap-1"><Tag size={8} /> {item.matchReason}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF]" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 text-center"><SearchX className="w-6 h-6 text-gray-300 mx-auto mb-3" /><p className="text-sm font-bold text-gray-900 dark:text-white">Não encontramos nada com esse termo.</p><p className="text-xs text-gray-500 mt-1">Tente buscar por categoria ou produto.</p></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <NeighborhoodSelectorModal />
    </>
  );
};
