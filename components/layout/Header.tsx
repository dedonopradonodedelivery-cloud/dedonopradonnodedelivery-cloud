
import React, { useMemo, useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Bell, ShieldCheck, Search, X, ChevronLeft, Sun, Zap, Mic, Cloud, CloudRain, Thermometer } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';
import { Store, Category } from '@/types';
import { GeminiAssistant } from '@/components/GeminiAssistant';
import { LOKA_MASCOT_BASE64 } from '@/constants';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

const NEIGHBORHOOD_CONTEXT_DATA: Record<string, { traffic: string, temp: string, status: string }> = {
    "Freguesia": { traffic: "Trânsito Livre", temp: "28°C Sol", status: "Normal" },
    "Taquara": { traffic: "Fluxo Intenso", temp: "29°C Sol", status: "Alerta" },
    "Pechincha": { traffic: "Trânsito Livre", temp: "28°C Nublado", status: "Normal" },
    "Tanque": { traffic: "Trânsito Lento", temp: "27°C Sol", status: "Normal" },
    "Anil": { traffic: "Trânsito Livre", temp: "28°C Sol", status: "Normal" },
    "Curicica": { traffic: "Fluxo Normal", temp: "29°C Sol", status: "Normal" },
    "Jacarepaguá (todos)": { traffic: "Vários Pontos", temp: "28°C Rio", status: "Normal" }
};

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
  customTitle?: string;
  onBack?: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8"></div>
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
                <button onClick={toggleSelector} className="w-full mt-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 transition-colors">Fechar</button>
            </div>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick, 
  user,
  activeTab,
  isAdmin,
  viewMode,
  onOpenViewSwitcher,
  onNavigate,
  customTitle,
  onBack,
  userRole
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const greetingName = useMemo(() => {
    if (!user) return "Visitante";
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(' ')[0];
    return user.email?.split('@')[0] || "Morador";
  }, [user]);

  const contextData = NEIGHBORHOOD_CONTEXT_DATA[currentNeighborhood] || NEIGHBORHOOD_CONTEXT_DATA["Jacarepaguá (todos)"];
  const isHome = activeTab === 'home';
  const blueTabs = ['home', 'health_selection', 'services_selection', 'pets_selection', 'fashion_selection', 'beauty_selection', 'autos_selection', 'category_detail'];
  const isBlueHeader = blueTabs.includes(activeTab);

  useEffect(() => {
    const checkNotifs = () => {
      let saved = localStorage.getItem('app_notifications');
      if (!saved) return;
      const notifs = JSON.parse(saved);
      setUnreadCount(notifs.filter((n: any) => !n.read).length);
    };
    checkNotifs();
    const interval = setInterval(checkNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsListening(true);
    setTimeout(() => { setIsListening(false); setIsAssistantOpen(true); }, 600);
  };

  return (
    <>
        <div className={`w-full transition-all duration-500 relative ${isBlueHeader ? 'bg-brand-blue pb-8 z-30' : 'bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 pb-6 z-50'}`}>
            <div className="max-w-md mx-auto px-6 pt-5 flex flex-col items-start">
                
                {/* 1. TOPO: Ações e Logo */}
                <div className="flex items-center justify-between w-full py-2 relative z-50">
                    <div className="flex items-center gap-3 min-w-0">
                        {!isHome ? (
                            <>
                                <button onClick={() => onBack && onBack()} className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white active:scale-90 transition-all shrink-0">
                                    <ChevronLeft size={20} strokeWidth={3} />
                                </button>
                                <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none animate-in slide-in-from-left duration-500 py-1 truncate">
                                    {customTitle || "CATEGORIA"}
                                </h1>
                            </>
                        ) : (
                            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none truncate">LOCALIZEI <span className="opacity-50">JPA</span></h1>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {isHome ? (
                            <>
                                <button onClick={toggleSelector} className="flex items-center gap-1.5 transition-all active:scale-95 text-white/90 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] truncate max-w-[90px]">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</span>
                                    <ChevronDown size={10} strokeWidth={3} className="opacity-60" />
                                </button>
                                <button onClick={onNotificationClick} className="relative flex items-center justify-center transition-all active:scale-90 text-white/80">
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF6501] rounded-full flex items-center justify-center border-2 border-brand-blue shadow-lg">
                                            <span className="text-[7px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                        </span>
                                    )}
                                </button>
                            </>
                        ) : (
                            <MasterSponsorBadge onClick={() => onNavigate('patrocinador_master')} />
                        )}

                        {isAdmin && (
                            <button onClick={onOpenViewSwitcher} className="p-1 text-amber-400/50 active:scale-90 transition-all"><ShieldCheck size={18} /></button>
                        )}
                    </div>
                </div>

                {/* 2. CONTEÚDO DINÂMICO (APENAS PARA HOME QUANDO isHome É TRUE) */}
                {isHome && (
                    <div className="w-full mt-6">
                        <div className="animate-in fade-in slide-in-from-top-1 duration-700">
                             <p className="text-[12px] font-medium text-white/85 tracking-tight mb-2 ml-1 leading-none">Olá, {greetingName}</p>
                             <div className="w-full relative mb-4">
                                <button onClick={() => setIsAssistantOpen(true)} className="w-full bg-white/10 rounded-[1.25rem] border border-white/15 py-3.5 pl-5 pr-14 flex items-center gap-3 hover:bg-white/20 transition-all shadow-inner">
                                    <Search size={16} className="text-white/40" /><span className="text-white/40 text-sm font-medium tracking-tight truncate">Diga o que você quer para a LOKA te ajudar</span>
                                </button>
                                <button onClick={handleVoiceSearch} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${isListening ? 'text-red-400 scale-125' : 'text-white/30 hover:text-white/60'}`}><Mic size={20} className={isListening ? 'animate-pulse' : ''} /></button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <NeighborhoodSelectorModal />
        <GeminiAssistant isExternalOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </>
  );
};
