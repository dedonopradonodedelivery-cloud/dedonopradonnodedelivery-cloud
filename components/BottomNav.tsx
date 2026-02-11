
import React from 'react';
import { Home, User as UserIcon, Newspaper, Compass, Ticket } from 'lucide-react';
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

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();

  // Itens da barra fixa - ESTRUTURA: Início, Explorar, Classificados, Menu
  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Compass, label: 'Explorar' },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados' },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
      const photoUrl = user.user_metadata?.avatar_url;

      return (
        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 border-2 ${
          isActive 
            ? 'border-[#1E5BFF] scale-110 shadow-sm' 
            : 'border-gray-200 dark:border-gray-700 opacity-70'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[11px] font-black ${
              isActive ? 'bg-[#1E5BFF] text-white' : 'bg-gray-100 text-gray-400'
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
        className={`w-6 h-6 transition-all duration-300 ${
          isActive 
            ? 'text-[#1E5BFF] opacity-100 drop-shadow-[0_0_8px_rgba(30,91,255,0.2)]' 
            : 'text-gray-400 opacity-70'
        }`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl z-[1000] h-[80px] rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-4 w-full h-full">
        {navItems.map((item) => {
          // Lógica de estado ativo considerando redirecionamentos de perfil
          const isProfileTab = (item.id === 'profile' && ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view'].includes(activeTab));
          const isActive = activeTab === item.id || isProfileTab;

          return (
            <div key={item.id} className="flex justify-center items-center h-full">
               <button 
                onClick={() => handleTabClick(item.id)} 
                className="w-full h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none" 
                aria-label={item.label}
              >
                <div className="flex items-center justify-center h-8">
                  {renderIconOrAvatar(item, isActive)}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'text-[#1E5BFF] opacity-100 scale-105' 
                    : 'text-gray-400 opacity-70'
                }`}>
                  {item.label}
                </span>
                
                {/* Dot indicador de aba ativa */}
                <div className={`w-1 h-1 rounded-full bg-[#1E5BFF] transition-all duration-300 mt-0.5 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
