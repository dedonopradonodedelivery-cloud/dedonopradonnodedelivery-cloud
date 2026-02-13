
import React, { useMemo, useState, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Bell, ShieldCheck, Search, X } from 'lucide-react';
import { useNeighborhood, NEIGHBORHOODS } from '@/contexts/NeighborhoodContext';
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
        <ellipse cx="65" cy="190" rx="22" ry="4" fill="black" opacity="0.15" />
        <path d="M40 145L12 178L48 162Z" fill="#020617" />
        <path d="M35 70C20 70 10 90 10 115C10 130 20 145 35 145C45 145 50 130 50 115C50 90 45 70 35 70Z" fill="url(#tuco_back_wing_grad)" opacity="0.8" />
        <path d="M105 85C125 85 145 110 145 140C145 160 125 175 105 175C90 175 85 160 85 140C85 110 90 85 105 85Z" fill="url(#tuco_wing_grad)" />
        <path d="M75 175C35 175 15 145 20 95C25 45 55 25 90 25C120 25 145 50 145 100C145 150 115 175 80 175Z" fill="url(#tuco_body_grad)" />
        <path d="M88 162C72 162 64 148 64 108C64 68 76 48 94 48C102 48 110 58 114 78C118 98 114 144 104 156C100 160 94 162 88 162Z" fill="white" />
        <circle cx="94" cy="82" r="18" fill="white" /> 
        <circle cx="99" cy="82" r="9.5" fill="#0F172A" /> 
        <circle cx="103" cy="77" r="3.5" fill="white" /> 
        <path d="M115 60C155 48 220 70 230 100C235 125 185 