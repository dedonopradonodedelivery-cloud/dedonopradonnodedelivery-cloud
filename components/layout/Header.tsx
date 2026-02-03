
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, Mic, Bell, Loader2, X, User as UserIcon } from 'lucide-react';
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
  onNavigate: (tab: string) => void;
  activeTab: string;
  userRole: 'cliente' | 'lojista' | 'admin' | null;
  stores?: Store[];
  onStoreClick?: (store: Store) => void;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
  onAuthClick?: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    
    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-5" 
            onClick={toggleSelector}
        >
            <div 
                className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-300 relative border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh]" 
                onClick={e => e.stopPropagation()}
            >
                {/* Cabeçalho do Modal */}
                <div className="flex flex-col items-center mb-6 shrink-0">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-[#1E5BFF] mb-3 shadow-sm">
                        <MapPin size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter text-center leading-none">
                        Escolha o Bairro
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-2 text-center">
                        Onde você quer explorar?
                    </p>
                </div>

                {/* Lista de Bairros */}
                <div className="overflow-y-auto no-scrollbar space-y-3 flex-1 px-1">
                    <button 
                        onClick={() => setNeighborhood("Jacarepaguá (todos)")} 
                        className={`w-full p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center relative group ${
                            currentNeighborhood === "Jacarepaguá (todos)" 
                            ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/30" 
                            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                        }`}
                    >
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && (
                            <div className="absolute right-4 bg-white/20 p-1 rounded-full">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                    
                    <div className="flex items-center gap-2 py-1 opacity-50">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bairros</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                    </div>

                    {NEIGHBORHOODS.map(hood => (
                        <button 
                            key={hood} 
                            onClick={() => setNeighborhood(hood)} 
                            className={`w-full p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center relative group ${
                                currentNeighborhood === hood 
                                ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/30" 
                                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                            }`}
                        >
                            <span>{hood}</span>
                            {currentNeighborhood === hood && (
                                <div className="absolute right-4 bg-white/20 p-1 rounded-full">
                                    <Check size={14} strokeWidth={3} />
                                </div>
                            )}
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
  onOpenViewSwitcher,
  onAuthClick
}) => {
  const { currentNeighborhood, setNeighborhood, toggleSelector } = useNeighborhood();
  const [isListening, setIsListening] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Monitorar notificações não lidas
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

  // Lógica de Pesquisa por Voz
  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta pesquisa por voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

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

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto flex flex-col relative">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <button onClick={toggleSelector} className="flex items-center gap-1.5 active:scale-95">
                    <div className="p-1.5 bg-[#1E5BFF]/10 rounded-full"><MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" fill="currentColor" /></div>
                    <div className="text-left flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">Local</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[120px]">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                </button>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase">{viewMode}</span>
                        </button>
                    )}
                    
                    <button onClick={onAuthClick} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 pl-3 rounded-full border border-gray-100 dark:border-gray-700 shadow-inner">
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{user ? 'Perfil' : 'Entrar'}</span>
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#1E5BFF] overflow-hidden relative shadow-sm">
                            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                    </button>

                    <button 
                        onClick={onNotificationClick}
                        className="relative p-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-[#1E5BFF] transition-all active:scale-90"
                    >
                        <Bell size={22} className={unreadCount > 0 ? 'animate-wiggle' : ''} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg animate-in zoom-in duration-300">
                                <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            </span>
                        )}
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3 px-4 pt-2 pb-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={(e) => onSearchChange(e.target.value)} 
                      placeholder={dynamicPlaceholder} 
                      className="block w-full pl-10 pr-12 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 py-3 shadow-inner" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {searchTerm && (
                        <button 
                          onClick={() => onSearchChange('')}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button 
                        onClick={startVoiceSearch}
                        className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-[#1E5BFF] dark:hover:text-[#1E5BFF]'}`}
                      >
                        <Mic size={18} strokeWidth={isListening ? 3 : 2} />
                      </button>
                    </div>

                    {searchTerm.trim().length > 0 && (activeTab === 'home' || activeTab === 'explore') && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-2 max-h-[60vh] overflow-y-auto no-scrollbar">
                                {(searchResults.stores.length > 0 || searchResults.categories.length > 0) ? (
                                    <div className="flex flex-col">
                                        {searchResults.categories.map(cat => (<button key={cat.id} onClick={() => { onNavigate('explore'); onSearchChange(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors text-left group"><div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}><Tag size={14} /></div><div className="flex-1"><p className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</p></div><ChevronRight className="w-4 h-4 text-gray-300" /></button>))}
                                        {searchResults.stores.map(store => (<button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left group"><div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0"><img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" /></div><div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p><p className="text-[9px] text-gray-400 font-medium truncate">{store.category} • {store.neighborhood}</p></div><ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF]" /></button>))}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 text-center">
                                        <SearchX className="w-6 h-6 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Nenhum resultado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
        <NeighborhoodSelectorModal />
        
        <style>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(8deg); }
            75% { transform: rotate(-8deg); }
          }
          .animate-wiggle {
            animation: wiggle 0.5s ease-in-out infinite alternate;
            animation-iteration-count: 2;
          }
        `}</style>
    </>
  );
};
