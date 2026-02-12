
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ChevronDown, Check, ChevronRight, SearchX, ShieldCheck, Tag, Mic, Bell, Loader2, X, Plus, Menu, User, Heart, Wrench, PawPrint, Shirt, Scissors, CarFront, Sun } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';
import { Store, Category } from '@/types';
import { CATEGORIES } from '@/constants';
import { MoreCategoriesModal } from '@/components/MoreCategoriesModal';

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
  onSelectCategory: (category: Category) => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" onClick={toggleSelector}>
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
  onOpenViewSwitcher,
  userRole,
  onSelectCategory
}) => {
  const { currentNeighborhood, setNeighborhood, toggleSelector } = useNeighborhood();
  const [isListening, setIsListening] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isHome = activeTab === 'home';
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  
  const QUICK_CATEGORIES: { name: string, icon: React.ElementType, slug: string }[] = [
    { name: 'Saúde', icon: Heart, slug: 'saude' },
    { name: 'Serviços', icon: Wrench, slug: 'servicos' },
    { name: 'Pet', icon: PawPrint, slug: 'pets' },
    { name: 'Moda', icon: Shirt, slug: 'moda' },
    { name: 'Beleza', icon: Scissors, slug: 'beleza' },
    { name: 'Auto', icon: CarFront, slug: 'autos' },
  ];

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

  // Função auxiliar para remover plural simples (s no final)
  const rootWord = (str: string) => str.endsWith('s') ? str.slice(0, -1) : str;

  const searchResults = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term || (activeTab !== 'home' && activeTab !== 'explore')) return { stores: [], categories: [] };
    
    const rootTerm = rootWord(term);

    const matchedCategories = CATEGORIES.filter(cat => normalize(cat.name).includes(term));
    
    const matchedStores = stores.map(store => {
        let matchReason = '';
        const normName = normalize(store.name);
        const normCat = normalize(store.category);
        const normSub = normalize(store.subcategory);
        const normDesc = normalize(store.description);
        
        // Prioridade 1: Tags
        if (store.tags) {
            const matchedTag = store.tags.find(tag => {
                const normTag = normalize(tag);
                return normTag.includes(term) || rootWord(normTag).includes(rootTerm);
            });
            if (matchedTag) {
                matchReason = `Encontrado por: ${matchedTag}`;
                return { store, matchReason, priority: 1 };
            }
        }

        // Prioridade 2: Nome
        if (normName.includes(term)) {
            return { store, matchReason: '', priority: 2 };
        }

        // Prioridade 3: Categoria/Subcategoria
        if (normCat.includes(term) || normSub.includes(term)) {
            return { store, matchReason: '', priority: 3 };
        }

        // Prioridade 4: Descrição
        if (normDesc.includes(term)) {
            return { store, matchReason: '', priority: 4 };
        }

        return null;
    })
    .filter(Boolean)
    .sort((a, b) => (a!.priority - b!.priority))
    .slice(0, 15);

    return { stores: matchedStores, categories: matchedCategories.slice(0, 4) };
  }, [stores, searchTerm, activeTab]);

  const dynamicPlaceholder = useMemo(() => {
    if (currentNeighborhood === "Jacarepaguá (todos)") {
      return "O que você busca em JPA?";
    }
    return `O que você busca em ${currentNeighborhood}?`;
  }, [currentNeighborhood]);
  
  const greetingName = useMemo(() => {
    if (!user) {
        return "Visitante";
    }
    // Admin view mode has priority for display
    if (isAdmin && viewMode) {
        if (viewMode === 'Lojista') return "Lojista";
        if (viewMode === 'Visitante') return "Visitante";
        if (viewMode === 'ADM') return "Admin";
        if (viewMode === 'Designer') return "Designer";
        // Modo 'Usuário' do admin cai no default abaixo
    }

    if (userRole === 'lojista') {
        // For merchant, use the first word of the store name
        const storeName = user.user_metadata?.store_name;
        if (storeName) return storeName.split(' ')[0];
        return user.email?.split('@')[0] || "Lojista";
    }

    // For cliente/usuário
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(' ')[0]; // Just the first name
    return user.email?.split('@')[0] || "Morador";

  }, [user, userRole, isAdmin, viewMode]);

  return (
    <>
        {/* PARTE 1: TOPO (Scrollável) */}
        <div className={`w-full z-40 relative ${isHome ? 'bg-brand-blue' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md'}`}>
            <div className="max-w-md mx-auto flex items-center justify-between px-4 pt-4 pb-2">
                
                {/* Saudação à esquerda */}
                <div className="flex items-center">
                    <h2 className={`font-display text-2xl tracking-tighter truncate ${isHome ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                        <span className="font-medium opacity-80">Olá,</span> <span className="font-black">{greetingName}</span>
                    </h2>
                </div>

                {/* Ícones à direita */}
                <div className="flex items-center gap-2">
                    {/* Seletor de Bairro */}
                    <button 
                      onClick={toggleSelector} 
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
                        isHome 
                          ? 'bg-white/10 border border-white/20 text-white/90' 
                          : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <MapPin size={12} className={isHome ? 'text-white/70' : 'text-gray-400'}/>
                      <span className="truncate max-w-[100px]">{currentNeighborhood}</span>
                      <ChevronDown size={14} className={isHome ? 'text-white/70' : 'text-gray-400'}/>
                    </button>

                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase">{viewMode}</span>
                        </button>
                    )}
                    
                    {/* Botão de Notificações (Sino) */}
                    <button 
                        onClick={onNotificationClick}
                        className={`relative p-2.5 rounded-xl border transition-all active:scale-90 ${isHome ? 'bg-white/10 border-white/20 text-white/80 hover:text-white' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-[#1E5BFF]'}`}
                    >
                        <Bell size={20} className={unreadCount > 0 ? 'animate-wiggle' : ''} />
                        {unreadCount > 0 && (
                            <span className={`absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 shadow-lg animate-in zoom-in duration-300 ${isHome ? 'border-brand-blue' : 'border-white dark:border-gray-900'}`}>
                                <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* PARTE 2: BUSCA E CATEGORIAS (Sticky) */}
        <div className={`sticky top-0 z-50 w-full ${isHome ? 'bg-brand-blue' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'}`}>
            <div className="max-w-md mx-auto">
                {!isHome && (
                    <div className="flex items-center gap-3 px-4 pt-2 pb-3">
                        <div className="relative flex-1 group">
                            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                            <input 
                              type="text" 
                              value={searchTerm} 
                              onChange={(e) => onSearchChange(e.target.value)} 
                              placeholder={dynamicPlaceholder} 
                              className={`block w-full pl-10 pr-12 border-none rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 py-3 shadow-inner bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-500`}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {searchTerm && (
                                <button 
                                  onClick={() => onSearchChange('')}
                                  className={`p-1.5 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200`}
                                >
                                  <X size={16} />
                                </button>
                              )}
                              <button 
                                onClick={startVoiceSearch}
                                className={`p-2 rounded-xl transition-all ${
                                    isListening 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'text-gray-400 hover:text-[#1E5BFF] dark:hover:text-[#1E5BFF]'
                                }`}
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
                                                
                                                {searchResults.stores.map((item: any) => {
                                                    const store = item.store;
                                                    return (
                                                        <button key={store.id} onClick={() => { onStoreClick?.(store); onSearchChange(''); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl text-left group">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                                                <img src={store.logoUrl || store.image || "/assets/default-logo.png"} className="w-full h-full object-contain" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{store.name}</p>
                                                                <div className="flex flex-col">
                                                                    <p className="text-[9px] text-gray-400 font-medium truncate">{store.category} • {store.neighborhood}</p>
                                                                    {item.matchReason && (
                                                                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight mt-0.5 flex items-center gap-1">
                                                                            <Tag size={8} /> {item.matchReason}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E5BFF]" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="py-8 px-4 text-center">
                                                <SearchX className="w-6 h-6 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">Não encontramos lojas com esse termo no bairro.</p>
                                                <p className="text-xs text-gray-500 mt-1">Tente buscar por loja, categoria ou produto.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {isHome && (
                  <>
                    <div className="px-4 pb-3 pt-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex items-center justify-around text-white/90 text-[10px] font-bold border border-white/20">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} />
                          <span>{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</span>
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="flex items-center gap-1.5">
                          <Sun size={12} />
                          <span>28°C</span>
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                          <span>Trânsito Livre</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full overflow-x-auto no-scrollbar">
                      <div className="max-w-md mx-auto flex items-center gap-3 px-4 pb-4">
                        {QUICK_CATEGORIES.map(cat => {
                          const fullCat = CATEGORIES.find(c => c.slug === cat.slug);
                          if (!fullCat) return null;
                          return (
                            <button key={cat.slug} onClick={() => onSelectCategory(fullCat)} className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl w-16 h-16 flex-shrink-0 transition-all active:scale-95 bg-white/10 border border-white/20">
                              <cat.icon size={20} className="text-white" />
                              <span className="text-[10px] font-bold text-white tracking-tight">{cat.name}</span>
                            </button>
                          )
                        })}
                        <button onClick={() => setIsMoreCategoriesOpen(true)} className="flex flex-col items-center justify-center gap-1 p-2 rounded-2xl w-16 h-16 flex-shrink-0 transition-all active:scale-95 bg-white/5 border-2 border-dashed border-white/20">
                          <Plus size={20} className="text-white/70" />
                          <span className="text-[10px] font-bold text-white/70 tracking-tight">Mais</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
            </div>
        </div>

        <NeighborhoodSelectorModal />
        <MoreCategoriesModal 
            isOpen={isMoreCategoriesOpen}
            onClose={() => setIsMoreCategoriesOpen(false)}
            onSelectCategory={(category: Category) => {
                setIsMoreCategoriesOpen(false);
                onSelectCategory(category);
            }}
        />
        
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
