
import React from 'react';
import { Home, User, Newspaper } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: any;
  label: string;
  isCenter?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', isCenter: true },
    { id: 'profile', icon: User, label: 'Menu' },
  ];

  const NavButton: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => {
    const Icon = item.icon;

    if (item.isCenter) {
      return (
        <div className="relative w-16 flex justify-center -top-6">
          <button
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center group outline-none"
          >
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center 
              shadow-2xl shadow-black/40 border-[6px] border-[#1E5BFF] 
              active:scale-90 transition-all duration-200 
              ${isActive ? 'bg-[#1E5BFF]' : 'bg-white'}
            `}>
              <Icon 
                className={`w-7 h-7 transition-colors ${isActive ? 'text-white' : 'text-[#1E5BFF]'}`} 
                strokeWidth={2.5} 
              />
            </div>
            <span className="text-[10px] font-black uppercase text-white mt-1 tracking-tight whitespace-nowrap drop-shadow-sm">
              {item.label}
            </span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className="w-full h-[60px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none"
      >
        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
          <Icon 
            className={`w-5 h-5 transition-colors ${isActive ? 'text-white fill-white' : 'text-white/60'}`} 
            strokeWidth={isActive ? 0 : 2}
          />
        </div>
        <span className={`text-[9px] font-black uppercase transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-[#1E5BFF] z-50 h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.2)] border-t border-white/10">
      <div className="flex items-end justify-around w-full px-2 h-full pb-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <div key={item.id} className="flex-1 flex justify-center items-end h-full">
              <NavButton item={item} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
