import React from 'react';
import { Home, User as UserIcon, Newspaper, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'neighborhood_posts', icon: MessageSquare, label: 'JPA Conversa' },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados' },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
      const photoUrl = user.user_metadata?.avatar_url;

      return (
        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 border-2 ${
          isActive 
            ? 'border-blue-600 scale-110 shadow-lg shadow-blue-500/20' 
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[11px] font-black ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {userInitial}
            </div>
          )}
        </div>
      );
    }

    const Icon = item.icon;
    return (
      <Icon 
        className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] border-t border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-4 w-full h-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'profile' && ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites'].includes(activeTab));
          const Icon = item.icon;

          if (item.id === 'classifieds' || item.id === 'neighborhood_posts') {
            return (
              <div key={item.id} className="relative flex justify-center">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className="absolute -top-7 flex flex-col items-center gap-1.5 group outline-none"
                  aria-label={item.label}
                >
                  <div className={`w-[68px] h-[68px] rounded-full flex items-center justify-center shadow-2xl border-4 transition-all duration-300 ${isActive ? 'bg-blue-600 border-white' : 'bg-white border-blue-100'}`}>
                    <Icon className={`w-8 h-8 transition-colors ${isActive ? 'text-white' : 'text-blue-600'}`} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[11px] font-black uppercase transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{item.label}</span>
                </button>
              </div>
            );
          }

          return (
            <div key={item.id} className="flex justify-center items-center h-full">
               <button onClick={() => setActiveTab(item.id)} className="w-full h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none" aria-label={item.label}>
                <div className="flex items-center justify-center h-8">
                  {renderIconOrAvatar(item, isActive)}
                </div>
                <span className={`text-[10px] font-bold transition-colors capitalize ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};