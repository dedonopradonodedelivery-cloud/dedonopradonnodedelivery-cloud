
import React, { useMemo, useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Bell, ShieldCheck, Search, X, ChevronLeft, Sun, Zap } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';
import { Store, Category } from '@/types';
import { GeminiAssistant } from '@/components/GeminiAssistant';
import { MasterSponsorBadge } from '@/components/MasterSponsorBadge';

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
        <div 
            className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-6" 
            onClick={toggleSelector}
        >
            <div 
                className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative" 
                onClick={e => e.stopPropagation()}
            >
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
                    <button 
                        onClick={() => setNeighborhood("Jacarepaguá (todos)")} 
                        className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20" : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
                    >
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 opacity-50"></div>
                    {NEIGHBORHOODS.map(hood => (
                        <button 
                            key={hood} 
                            onClick={() => setNeighborhood(hood)} 
                            className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${currentNeighborhood === hood ? "bg-[#1E5BFF] text-white shadow-lg shadow-blue-500/20" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
                        >
                            <span>{hood}</span>
                            {currentNeighborhood === hood && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={toggleSelector} 
                    className="w-full mt-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    Fechar
                </button>
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
  onBack
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const blueTabs = [
    'home', 
    'health_selection', 
    'services_selection', 
    'pets_selection', 
    'fashion_selection', 
    'beauty_selection', 
    'autos_selection',
    'category_detail'
  ];

  const isBlueHeader = blueTabs.includes(activeTab);
  const isHome = activeTab === 'home';

  const viewTitles: Record<string, string> = {
    'health_selection': 'Saúde',
    'services_selection': 'Serviços',
    'pets_selection': 'Pet',
    'fashion_selection': 'Moda',
    'beauty_selection': 'Beleza',
    'autos_selection': 'Autos',
    'category_detail': 'Bairro'
  };

  const displayTitle = (customTitle || viewTitles[activeTab] || 'Localizei ').toUpperCase();

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

  const greetingName = useMemo(() => {
    if (viewMode === 'Visitante') return "Visitante";
    if (viewMode === 'ADM') return "Admin";
    if (viewMode === 'Lojista') return "Parceiro";
    if (viewMode === 'Usuário') return user?.user_metadata?.full_name?.split(' ')[0] || "Morador";
    
    if (!user) return "Visitante";
    const fullName = user.user_metadata?.full_name;
    return fullName ? fullName.split(' ')[0] : (user.email?.split('@')[0] || "Morador");
  }, [user, viewMode]);

  return (
    <>
        <div className={`w-full transition-all duration-500 relative ${isBlueHeader ? 'bg-brand-blue pb-8 z-30' : 'bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 pb-6 z-50'}`}>
            <div className="max-w-md mx-auto px-6 pt-5 flex flex-col items-start">
                
                {/* 1. TOP ROW: LOGO | LOCAL | SINO */}
                <div className="flex items-center justify-between w-full py-2 relative z-50 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {!isHome ? (
                            <button 
                                onClick={() => onBack && onBack()}
                                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white active:scale-90 transition-all shrink-0 cursor-pointer"
                            >
                                <ChevronLeft size={20} strokeWidth={3} />
                            </button>
                        ) : (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 ${isBlueHeader ? 'bg-white/10 border-white/20' : 'bg-blue-600 border-blue-50 shadow-md'}`}>
                                <MapPin size={20} className="text-white fill-white" />
                            </div>
                        )}
                        <h1 className={`text-lg font-black uppercase tracking-tighter leading-none truncate ${isBlueHeader ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {isHome ? 'Localizei ' : displayTitle} 
                            <span className={isBlueHeader ? 'opacity-50' : 'text-blue-600'}>{isHome ? 'JPA' : ''}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {isHome && (
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleSelector();
                                }}
                                className="flex items-center gap-1 transition-all active:scale-95 cursor-pointer text-white/80"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] truncate max-w-[100px]">
                                    {currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}
                                </span>
                                <ChevronDown size={10} strokeWidth={3} className="opacity-40" />
                            </button>
                        )}

                        <button 
                            onClick={onNotificationClick}
                            className="relative flex items-center justify-center transition-all active:scale-90 cursor-pointer text-white/80"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6501] rounded-full flex items-center justify-center border border-brand-blue shadow-lg">
                                    <span className="text-[6px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </span>
                            )}
                        </button>

                        {isAdmin && (
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onOpenViewSwitcher) onOpenViewSwitcher();
                                }}
                                className="p-1 transition-all active:scale-90 cursor-pointer text-amber-400/50"
                            >
                                <ShieldCheck size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {isHome && (
                    <div className="w-full animate-in fade-in slide-in-from-top-1 duration-700">
                        {/* 2. BARRA DE BUSCA (AÇÃO PRINCIPAL) */}
                        <div className="w-full">
                            <button 
                                onClick={() => setIsAssistantOpen(true)}
                                className="w-full bg-white/10 rounded-[1.25rem] border border-white/15 py-3.5 px-5 flex items-center gap-3 hover:bg-white/20 transition-all shadow-inner cursor-pointer"
                            >
                                <Search size={16} className="text-white/40" />
                                <span className="text-white/40 text-sm font-medium tracking-tight">
                                    O que você busca hoje?
                                </span>
                            </button>
                        </div>

                        {/* 3. BLOCO GREETING IA (EXTENSÃO DA BUSCA) */}
                        <div className="mt-6">
                            <h2 className="text-[18px] font-semibold text-white leading-none">
                                Olá, {greetingName} 👋
                            </h2>
                            <p className="text-[12px] font-medium text-white/85 tracking-tight mt-[2px]">
                                Eu sou Tuco, sua IA de Jacarepaguá!
                            </p>
                        </div>

                        {/* 4. LINHA INFORMATIVA (CONTEXTO DO BAIRRO) */}
                        <div className="mt-[10px] flex items-center gap-4 text-white/60">
                            <div className="flex items-center gap-1.5">
                                <Sun size={12} className="text-amber-400" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">28°C Sol</span>
                            </div>
                            <div className="w-px h-2 bg-white/10"></div>
                            <div className="flex items-center gap-1.5">
                                <Zap size={12} className="text-blue-400" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Trânsito Livre</span>
                            </div>
                            <div className="w-px h-2 bg-white/10"></div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider">Normal</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <NeighborhoodSelectorModal />

        <GeminiAssistant 
          isExternalOpen={isAssistantOpen} 
          onClose={() => setIsAssistantOpen(false)} 
        />
    </>
  );
};
