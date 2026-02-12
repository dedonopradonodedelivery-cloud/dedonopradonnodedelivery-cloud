
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ChevronDown, Check, Bell, X, Mic, Sun, Heart, Wrench, PawPrint, Shirt, Scissors, CarFront, Plus, ShieldCheck } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';
import { Store, Category } from '@/types';
import { CATEGORIES } from '@/constants';
import { MoreCategoriesModal } from './MoreCategoriesModal';

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
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-8"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-[1.25rem]">
                        <MapPin className="w-6 h-6 text-[#1E5BFF]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none uppercase tracking-tighter">Bairros</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Onde você está agora?</p>
                    </div>
                </div>
                <div className="max-h-[50vh] overflow-y-auto no-scrollbar space-y-2.5">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 opacity-50"></div>
                    {NEIGHBORHOODS.map(hood => (
                        <button key={hood} onClick={() => setNeighborhood(hood)} className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${currentNeighborhood === hood ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                            <span>{hood}</span>
                            {currentNeighborhood === hood && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                    ))}
                </div>
                <button onClick={toggleSelector} className="w-full mt-8 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors">Fechar</button>
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
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
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
    const interval = setInterval(checkNotifs, 5000);
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
      onSearchChange(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [onSearchChange]);

  const greetingName = useMemo(() => {
    if (!user) return "Visitante";
    if (isAdmin && viewMode) {
        if (viewMode === 'Lojista') return "Lojista";
        if (viewMode === 'Visitante') return "Visitante";
        if (viewMode === 'ADM') return "Admin";
        if (viewMode === 'Designer') return "Designer";
    }
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(' ')[0];
    return user.email?.split('@')[0] || "Morador";
  }, [user, userRole, isAdmin, viewMode]);

  return (
    <>
        <div className={`w-full z-40 relative ${isHome ? 'bg-brand-blue' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md'}`}>
            <div className="max-w-md mx-auto flex items-center justify-between px-5 pt-5 pb-2">
                
                <div className="flex-1 min-w-0">
                    <h2 className={`font-display text-2xl tracking-tighter truncate ${isHome ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                        <span className="font-medium opacity-70">Olá,</span> <span className="font-black">{greetingName}</span>
                    </h2>
                </div>

                {/* GRUPO DE AÇÕES PREMIUM (BAIRRO + SINO) */}
                <div className="flex items-center gap-2.5">
                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 uppercase">{viewMode}</span>
                        </button>
                    )}

                    <button 
                      onClick={toggleSelector} 
                      className={`flex items-center gap-2 h-11 px-4 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all active:scale-95 shadow-sm border ${
                        isHome 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <MapPin size={14} className={isHome ? 'text-white/60' : 'text-[#1E5BFF]'}/>
                      <span className="truncate max-w-[80px]">{currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood}</span>
                      <ChevronDown size={14} className="opacity-40" />
                    </button>
                    
                    <button 
                        onClick={onNotificationClick}
                        className={`relative w-11 h-11 flex items-center justify-center rounded-2xl border transition-all active:scale-90 shadow-sm ${
                          isHome 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 shadow-lg animate-in zoom-in duration-300 ${isHome ? 'border-brand-blue' : 'border-white dark:border-gray-900'}`}>
                                <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        <div className={`sticky top-0 z-50 w-full ${isHome ? 'bg-brand-blue' : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'}`}>
            <div className="max-w-md mx-auto">
                {!isHome && (
                    <div className="flex items-center gap-3 px-5 pt-2 pb-3">
                        <div className="relative flex-1 group">
                            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                            <input 
                              type="text" 
                              value={searchTerm} 
                              onChange={(e) => onSearchChange(e.target.value)} 
                              placeholder="O que você busca hoje?" 
                              className={`block w-full pl-10 pr-12 border-none rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/50 py-3.5 shadow-inner bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-500`}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {searchTerm && (
                                <button onClick={() => onSearchChange('')} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                  <X size={16} />
                                </button>
                              )}
                              <button onClick={startVoiceSearch} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-[#1E5BFF]'}`}>
                                <Mic size={18} strokeWidth={isListening ? 3 : 2} />
                              </button>
                            </div>
                        </div>
                    </div>
                )}

                {isHome && (
                  <>
                    <div className="px-5 pb-3 pt-2">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 flex items-center justify-around text-white/90 text-[10px] font-bold border border-white/20">
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
                      <div className="max-w-md mx-auto flex items-center gap-3 px-5 pb-5">
                        {QUICK_CATEGORIES.map(cat => {
                          const fullCat = CATEGORIES.find(c => c.slug === cat.slug);
                          if (!fullCat) return null;
                          return (
                            <button key={cat.slug} onClick={() => onSelectCategory(fullCat)} className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-[1.5rem] w-16 h-16 flex-shrink-0 transition-all active:scale-95 bg-white/10 border border-white/20">
                              <cat.icon size={20} className="text-white" />
                              <span className="text-[9px] font-black text-white uppercase tracking-tighter">{cat.name}</span>
                            </button>
                          )
                        })}
                        <button onClick={() => setIsMoreCategoriesOpen(true)} className="flex flex-col items-center justify-center gap-1 p-2 rounded-[1.5rem] w-16 h-16 flex-shrink-0 transition-all active:scale-95 bg-white/5 border-2 border-dashed border-white/20">
                          <Plus size={20} className="text-white/70" />
                          <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Mais</span>
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
    </>
  );
};
