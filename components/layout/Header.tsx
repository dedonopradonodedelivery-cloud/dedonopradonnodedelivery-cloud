
import React, { useMemo, useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Bell, ShieldCheck, Search } from 'lucide-react';
import { useNeighborhood } from '@/contexts/NeighborhoodContext';
import { Store, Category } from '@/types';
import { GeminiAssistant } from '@/components/GeminiAssistant';

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

const TucoMascot: React.FC = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)] overflow-visible">
    <defs>
      <linearGradient id="tuco_body_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="tuco_beak_grad" x1="0%" y1="0%" x2="100%" y2="20%">
        <stop offset="0%" stopColor="#FFD233" />
        <stop offset="45%" stopColor="#FF9F00" />
        <stop offset="100%" stopColor="#FF4D00" />
      </linearGradient>
      <linearGradient id="tuco_wing_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="tuco_back_wing_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
    </defs>
    
    <g transform="translate(15, 5) rotate(-2, 70, 100)">
        {/* Sombra de solo profissional */}
        <ellipse cx="65" cy="190" rx="22" ry="4" fill="black" opacity="0.15" />

        {/* Cauda */}
        <path d="M40 145L12 178L48 162Z" fill="#020617" />

        {/* SEGUNDA ASA (Back Wing) - Profundidade Flagship */}
        <path d="M35 70C20 70 10 90 10 115C10 130 20 145 35 145C45 145 50 130 50 115C50 90 45 70 35 70Z" fill="url(#tuco_back_wing_grad)" opacity="0.8" />

        {/* ASA PRINCIPAL (Front Wing) */}
        <path d="M105 85C125 85 145 110 145 140C145 160 125 175 105 175C90 175 85 160 85 140C85 110 90 85 105 85Z" fill="url(#tuco_wing_grad)" />

        {/* CORPO DOMINANTE BLACK */}
        <path d="M75 175C35 175 15 145 20 95C25 45 55 25 90 25C120 25 145 50 145 100C145 150 115 175 80 175Z" fill="url(#tuco_body_grad)" />
        
        {/* PEITO BRANCO INCLINADO (Dynamic Tilt) */}
        <path d="M88 162C72 162 64 148 64 108C64 68 76 48 94 48C102 48 110 58 114 78C118 98 114 144 104 156C100 160 94 162 88 162Z" fill="white" />

        {/* OLHOS HIPER-AMPLIADOS (Carisma 3.0) */}
        <circle cx="94" cy="82" r="18" fill="white" /> 
        <circle cx="99" cy="82" r="9.5" fill="#0F172A" /> 
        <circle cx="103" cy="77" r="3.5" fill="white" /> 
        
        {/* BICO ENCORPADO NA BASE (Identidade Forte) */}
        <path d="M115 60C155 48 220 70 230 100C235 125 185 150 155 145C135 140 115 115 106 88C104 78 108 60 115 60Z" fill="url(#tuco_beak_grad)" />
        
        {/* Patas robustas */}
        <path d="M65 175C65 188 63 194 55 194" stroke="#FF9F00" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M95 175C95 188 97 194 105 194" stroke="#FF9F00" strokeWidth="7" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  onNotificationClick, 
  user,
  activeTab,
  isAdmin,
  viewMode,
  onOpenViewSwitcher,
}) => {
  const { currentNeighborhood, toggleSelector } = useNeighborhood();
  const [unreadCount, setUnreadCount] = useState(0);
  const isHome = activeTab === 'home';
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

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

  const greetingName = useMemo(() => {
    if (!user) return "Visitante";
    if (isAdmin && viewMode === 'ADM') return "Admin";
    const fullName = user.user_metadata?.full_name;
    return fullName ? fullName.split(' ')[0] : (user.email?.split('@')[0] || "Morador");
  }, [user, isAdmin, viewMode]);

  return (
    <>
        <div className={`w-full z-10 relative transition-all duration-500 ${isHome ? 'bg-brand-blue pb-28' : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pb-6 z-40'}`}>
            <div className="max-w-md mx-auto px-6 pt-6 space-y-0.5">
                
                {/* Branding & Top Actions */}
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${isHome ? 'bg-white/10 border-white/20' : 'bg-blue-600 border-blue-50 shadow-md'}`}>
                            <MapPin size={18} className="text-white fill-white" />
                        </div>
                        <h1 className={`text-base font-black uppercase tracking-tighter leading-none ${isHome ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            Localizei <span className={isHome ? 'opacity-50' : 'text-blue-600'}>JPA</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {isAdmin && (
                            <button onClick={onOpenViewSwitcher} className={`p-1.5 rounded-lg border ${isHome ? 'bg-white/10 border-white/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                                <ShieldCheck size={16} />
                            </button>
                        )}

                        <button 
                            onClick={toggleSelector}
                            className={`flex items-center gap-1.5 px-2.5 h-8 rounded-lg transition-all active:scale-95 border ${
                                isHome 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-slate-700 dark:text-slate-200'
                            }`}
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[70px]">
                                {currentNeighborhood === "Jacarepaguá (todos)" ? "JPA" : currentNeighborhood}
                            </span>
                            <ChevronDown size={10} strokeWidth={3} className="opacity-40" />
                        </button>

                        <button 
                            onClick={onNotificationClick}
                            className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 border ${
                                isHome 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 text-gray-500'
                            }`}
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className={`absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center border border-brand-blue`}>
                                    <span className="text-[7px] font-black text-white">{unreadCount}</span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Banner Section */}
                {isHome && (
                    <div className="relative pt-1 animate-in fade-in slide-in-from-top-1 duration-700">
                        
                        {/* 
                           Mascote Tuco - REFINAMENTO FINAL FLAGSHIP:
                           - Bico com base encorpada.
                           - Olho carismático ampliado.
                           - Peito branco inclinado (Flow Pixar).
                           - Duas asas para profundidade.
                        */}
                        <div className="absolute top-[18px] right-2 w-32 h-32 z-20 pointer-events-none transform -scale-x-100">
                             <TucoMascot />
                        </div>

                        <button 
                            onClick={() => setIsAssistantOpen(true)}
                            className="w-full bg-white/10 backdrop-blur-2xl border border-white/15 rounded-[2.2rem] p-6 flex flex-col gap-5 transition-all active:scale-[0.99] shadow-2xl group text-left relative overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-[100px]"></div>
                            
                            <div className="flex flex-col relative z-10">
                                <h2 className="text-xl font-display text-white leading-tight">
                                    Olá, <span className="font-black">{greetingName}</span> 👋
                                </h2>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em] mt-1.5">
                                    Sua inteligência local
                                </p>
                            </div>

                            <div className="w-full bg-white/10 rounded-xl border border-white/10 py-3.5 px-4 flex items-center gap-2.5 group-hover:bg-white/15 transition-all shadow-inner relative z-10">
                                <Search size={16} className="text-white/40" />
                                <span className="text-white/40 text-sm font-medium tracking-tight">
                                    Como o Tuco pode te ajudar?
                                </span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>

        <GeminiAssistant 
          isExternalOpen={isAssistantOpen} 
          onClose={() => setIsAssistantOpen(false)} 
        />
    </>
  );
};
