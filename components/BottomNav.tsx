
import React from 'react';
import { Home, Compass, Users, User as UserIcon, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  isCenter?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'explore', icon: Compass, label: 'Explorar' },
    { id: 'jobs_list', icon: Briefcase, label: 'Empregos' },
    { id: 'community_feed', icon: Users, label: 'Comunidade', isCenter: true },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const NavButton: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => {
    const Icon = item.icon;

    if (item.isCenter) {
      return (
        <div className="relative w-16 flex justify-center -mt-8">
          <button
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center group outline-none"
            aria-label={item.label}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/40 border-4 border-white dark:border-gray-900 active:scale-90 transition-all duration-200`}>
              <Icon className="w-8 h-8 transition-colors text-white" strokeWidth={2.5} />
            </div>
            <span className={`text-[10px] font-black uppercase mt-2 tracking-tight whitespace-nowrap transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className="w-full h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none"
        aria-label={item.label}
      >
        <Icon className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`text-[10px] font-bold transition-colors capitalize ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] border-t border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-5 items-center w-full h-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id ||
            (item.id === 'profile' && ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites'].includes(activeTab));
          
          return (
            <div key={item.id} className="flex justify-center items-center h-full">
              <NavButton item={item} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
