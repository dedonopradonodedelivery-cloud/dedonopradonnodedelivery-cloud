
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAuthClick: () => void; // Kept for interface compatibility, but not used in UI
  user: any;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  userRole: "cliente" | "lojista" | null;
  onOpenMerchantQr?: () => void;
  customPlaceholder?: string;
  onSelectCategory?: (category: Category) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleTheme,
  searchTerm,
  onSearchChange,
  activeTab,
  customPlaceholder,
  onSelectCategory
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const isHome = activeTab === 'home';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Trigger collapse slightly after starting to scroll to avoid jitter
      setIsScrolled(currentScrollY > 20);
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      setIsScrolled(false);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleCategoriesScroll = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const percentage = scrollLeft / maxScroll;
        // Map 0-1 to 0-3 (4 dots) based on approximate pages
        const dotIndex = Math.min(Math.round(percentage * 3), 3);
        setActiveDot(dotIndex);
      }
    }
  };

  return (
    <div 
      className={`
        sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-500 ease-in-out shadow-sm
        ${isHome ? 'pb-0' : 'pb-0'}
      `}
    >
      <div className="max-w-md mx-auto flex flex-col">
        
        {/* Top Row: Search + Theme */}
        <div className={`flex items-center gap-3 px-5 transition-all duration-500 ease-in-out ${isScrolled && isHome ? 'py-2' : 'py-3'}`}>
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#2D6DF6] transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={customPlaceholder || "Buscar..."}
              className={`block w-full pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6DF6]/50 transition-all shadow-inner ${isScrolled && isHome ? 'py-2' : 'py-2.5'}`}
            />
          </div>

          <button 
            onClick={toggleTheme}
            className={`rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 border border-transparent dark:border-gray-700 ${isScrolled && isHome ? 'w-9 h-9' : 'w-10 h-10'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Categories Row (Collapsible) */}
        <div 
          className={`
            overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isHome ? (isScrolled ? 'max-h-16 opacity-100' : 'max-h-32 opacity-100') : 'max-h-0 opacity-0'}
          `}
        >
          <div className="relative">
            {/* Fade Effect on Right */}
            <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${isScrolled ? 'opacity-80' : 'opacity-100'}`} />
            
            <div 
              ref={categoriesRef}
              onScroll={handleCategoriesScroll}
              className={`flex items-center gap-3 overflow-x-auto no-scrollbar px-5 transition-all duration-500 ease-in-out ${isScrolled ? 'pb-3 pt-0' : 'pb-1 pt-1'}`}
            >
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  className={`
                    flex items-center justify-center rounded-2xl bg-[#EAF2FF] dark:bg-gray-800 border border-[#DBEAFE] dark:border-gray-700 shadow-sm hover:shadow-md active:scale-95 group snap-start cursor-pointer flex-shrink-0
                    transition-all duration-500 ease-in-out
                    ${isScrolled 
                      ? 'min-w-fit px-4 h-9 gap-0' 
                      : 'flex-col gap-1 min-w-[76px] w-[76px] h-[72px] p-2'}
                  `}
                >
                  <div 
                    className={`
                      flex items-center justify-center text-[#2D6DF6] dark:text-blue-400 transition-all duration-500 ease-in-out origin-bottom
                      ${isScrolled 
                        ? 'w-0 h-0 opacity-0 overflow-hidden -translate-y-2' 
                        : 'w-8 h-8 opacity-100 translate-y-0 group-hover:scale-110'}
                    `}
                  >
                    {/* Clone element to force color inheritance or styling if needed */}
                    {React.isValidElement(cat.icon) 
                      ? React.cloneElement(cat.icon as React.ReactElement<any>, { 
                          className: `transition-all duration-500 ${isScrolled ? 'w-0 h-0' : 'w-6 h-6'} text-[#2D6DF6] dark:text-blue-400`, 
                          strokeWidth: 2 
                        }) 
                      : cat.icon}
                  </div>
                  <span 
                    className={`
                      font-bold text-gray-600 dark:text-gray-300 text-center leading-tight whitespace-nowrap transition-all duration-500 ease-in-out
                      ${isScrolled ? 'text-xs' : 'text-[10px] line-clamp-1 w-full'}
                    `}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
              {/* Padding Element to ensure last item is fully visible/clickable with fade */}
              <div className="w-2 flex-shrink-0" />
            </div>
          </div>

          {/* Sutil Scroll Indicator Dots - Hide when scrolled to save space */}
          <div className={`flex justify-center gap-1.5 transition-all duration-500 ease-in-out overflow-hidden ${isScrolled ? 'h-0 opacity-0 pb-0' : 'h-3 opacity-100 pb-2 pt-1'}`}>
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeDot === i 
                    ? 'w-3 bg-[#2D6DF6] dark:bg-blue-400' 
                    : 'w-1 bg-gray-200 dark:bg-gray-700'
                }`} 
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
