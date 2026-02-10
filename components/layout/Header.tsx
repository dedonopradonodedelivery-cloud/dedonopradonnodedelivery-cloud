
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, User as UserIcon, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, X, Mic, Bell, Plus, LayoutGrid } from 'lucide-react';
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
  isDarkMode,
  toggleTheme,
  userRole
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const checkNotifs = () => {
      const saved = localStorage.getItem('app_notifications');
      if (saved) {
        const notifs = JSON.parse(saved);
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      }
    };
    checkNotifs();
    const interval = setInterval(checkNotifs, 5000);
    return () => clearInterval(interval);
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

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    const matchedStores = stores.filter(s => normalize(s.name + s.category + (s.neighborhood || "")).includes(term));
    return { stores: matchedStores.slice(0, 15), categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const dynamicPlaceholder = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return "O que você busca em JPA?";
    }
    return `O que você busca em ${currentNeighborhood}?`;
  }, [currentNeighborhood]);

  const topCategories = useMemo(() => {
      // Retorna as 5 principais categorias para a faixa
      return CATEGORIES.slice(0, 5);
  }, []);

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-[#1E5BFF] dark:bg-blue-950 shadow-md rounded-b-[2.5rem] pb-6">
            <div className="max-w-md mx-auto flex flex-col relative">
                {/* LINHA 1: TOPBAR */}
                <div className="flex items-center justify-between px-5 pt-5 pb-2">
                    <button onClick={toggleSelector} className="flex items-center gap-2 active:scale-95 transition-transform">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 shadow-sm text-white">
                            <MapPin className="w-4 h-4" fill="currentColor" />
                        </div>
                        <div className="text-left flex flex-col">
                            <span className="text-[10px] text-white/60 font-black uppercase leading-none tracking-widest">Localização</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-black text-white leading-tight truncate max-w-[120px]">
                                    {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                            </div>
                        </div>
                    </button>

                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <button onClick={onOpenViewSwitcher} className="bg-amber-400 text-slate-900 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-bold uppercase">{viewMode}</span>
                            </button>
                        )}
                        
                        <button onClick={onNotificationClick} className="relative p-2.5 bg-white/10 rounded-2xl border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1E5BFF] shadow-lg animate-in zoom-in duration-300">
                                    <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </span>
                            )}
                        </button>

                        <button onClick={() => onNavigate('profile')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1 pl-3 rounded-full border border-white/10 shadow-sm active:scale-95 transition-all">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{user ? 'Perfil' : 'Entrar'}</span>
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#1E5BFF] overflow-hidden relative shadow-sm border border-white/20">
                                {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4" />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* LINHA 2: BUSCA */}
                <div className="px-5 pt-3 pb-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          value={searchTerm} 
                          onChange={(e) => onSearchChange(e.target.value)} 
                          placeholder={dynamicPlaceholder} 
                          className="block w-full pl-12 pr-12 bg-white border-none rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/20 py-4 shadow-xl transition-all" 
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
                            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                                    {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                        <div className="flex flex-col">
                                            {searchResults.categories.map(cat => (
                                                <button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group">
                                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                                                        <Tag size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                                </button>
                                            ))}
                                            {searchResults.stores.map(store => (
                                                <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left group">
                                                    <div className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 shadow-inner">
                                                        <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate mt-0.5">{store.category} • {store.neighborhood}</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF]" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 px-4 text-center">
                                            <SearchX className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Nenhum resultado</p>
                                            <p className="text-xs text-gray-400 mt-1">Tente buscar por termos genéricos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* LINHA 3: CATEGORIAS (HORIZONTAL STRIP) */}
                {activeTab === 'home' && (
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-5 pt-2">
                        {topCategories.map((cat) => (
                            <button 
                                key={cat.id} 
                                onClick={() => onSelectCategory(cat)} 
                                className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 border border-white/10 shadow-sm group-hover:bg-white/30 transition-colors">
                                    {React.cloneElement(cat.icon as any, { size: 24, className: "text-white", strokeWidth: 2.5 })}
                                </div>
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter text-center truncate w-14">{cat.name}</span>
                            </button>
                        ))}
                        <button 
                            onClick={onOpenMoreCategories} 
                            className="flex flex-col items-center gap-1.5 shrink-0 group active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-white/80 group-hover:bg-white/20 transition-colors">
                                <Plus size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-black text-white/80 uppercase tracking-tighter text-center w-14">+ Mais</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};
