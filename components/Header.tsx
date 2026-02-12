
import React, { useMemo } from 'react';
import { User as UserIcon, MapPin, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '../contexts/NeighborhoodContext';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAuthClick: () => void;
  user: any;
  onNavigate: (tab: string) => void;
  activeTab: string;
  userRole: "cliente" | "lojista" | null;
  onOpenMerchantQr?: () => void;
  customPlaceholder?: string;
  isAdmin?: boolean;
  viewMode?: string;
  onOpenViewSwitcher?: () => void;
}

const NeighborhoodSelectorModal: React.FC = () => {
    const { currentNeighborhood, setNeighborhood, isSelectorOpen, toggleSelector } = useNeighborhood();
    if (!isSelectorOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={toggleSelector}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 relative" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Escolha o Bairro</h3>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-2">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-between ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-[#1E5BFF]/10 text-[#1E5BFF]" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>
                        <span>Jacarepaguá (todos)</span>
                        {currentNeighborhood === "Jacarepaguá (todos)" && <Check className="w-4 h-4" />}
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
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
  onAuthClick, 
  user,
  onNavigate,
  activeTab,
  isAdmin,
  viewMode,
  onOpenViewSwitcher
}) => {
  const { currentNeighborhood, setNeighborhood, toggleSelector } = useNeighborhood();
  const showNeighborhoodFilter = ['home', 'explore', 'services', 'community_feed'].includes(activeTab);

  return (
    <>
        <div className="sticky top-0 z-40 w-full bg-gradient-to-b from-[#1E5BFF] to-[#001D4A] shadow-lg">
        <div className="flex flex-col relative">
            <div className="flex items-center justify-between px-5 pt-3 pb-4">
                <button onClick={toggleSelector} className="flex items-center gap-1.5 active:scale-95">
                    <div className="p-1.5 bg-white/10 rounded-full"><MapPin className="w-3.5 h-3.5 text-white" fill="currentColor" /></div>
                    <div className="text-left flex flex-col">
                        <span className="text-[10px] text-blue-200 font-bold uppercase leading-none">Local</span>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-white leading-tight truncate max-w-[120px]">{currentNeighborhood === "Jacarepaguá (todos)" ? "Jacarepaguá" : currentNeighborhood}</span>
                            <ChevronDown className="w-3 h-3 text-blue-300" />
                        </div>
                    </div>
                </button>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={onOpenViewSwitcher} className="bg-white/10 border border-amber-300/30 px-3 py-1.5 rounded-xl flex items-center gap-2 active:scale-95 shadow-sm">
                            <ShieldCheck size={14} className="text-amber-300" />
                            <span className="text-[10px] font-bold text-amber-200 uppercase">{viewMode}</span>
                        </button>
                    )}
                    <button onClick={onAuthClick} className="flex items-center gap-2 bg-white/10 p-1 pl-3 rounded-full border border-white/20 shadow-inner">
                        <span className="text-[10px] font-bold text-white/80">{user ? 'Perfil' : 'Entrar'}</span>
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1E5BFF] overflow-hidden relative shadow-sm">
                            {user?.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                    </button>
                </div>
            </div>
            {showNeighborhoodFilter && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-5 pb-3 pt-1">
                    <button onClick={() => setNeighborhood("Jacarepaguá (todos)")} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentNeighborhood === "Jacarepaguá (todos)" ? "bg-white text-[#1E5BFF] border-white" : "border-transparent bg-white/10 text-white/70 hover:bg-white/20"}`}>Todos</button>
                    {NEIGHBORHOODS.map(hood => (<button key={hood} onClick={() => setNeighborhood(hood)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${currentNeighborhood === hood ? "bg-white text-[#1E5BFF] border-white" : "border-transparent bg-white/10 text-white/70 hover:bg-white/20"}`}>{hood}</button>))}
                </div>
            )}
        </div>
        </div>
        <NeighborhoodSelectorModal />
    </>
  );
};
