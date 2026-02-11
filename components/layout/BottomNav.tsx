
import React from 'react';
import { Home, User as UserIcon, Newspaper, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  isMain?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Compass, label: 'Explorar', isMain: true },
    { id: 'classifieds', icon: Newspaper, label: 'Classificados', isMain: true },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    // Caso especial para o Menu se o usuário estiver logado
    if (item.id === 'profile' && user) {
      const photoUrl = user.user_metadata?.avatar_url;
      const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

      return (
        <div className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 border ${
          isActive 
            ? 'border-[#1E5BFF] scale-110 shadow-sm' 
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[9px] font-black ${
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
        size={item.isMain ? 24 : 22}
        className={`transition-all duration-300 ${
          isActive 
            ? 'text-[#1E5BFF] drop-shadow-[0_0_8px_rgba(30,91,255,0.3)]' 
            : 'text-gray-400 group-hover:text-gray-600'
        }`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/90 dark:bg-gray-950/95 backdrop-blur-xl z-[1000] h-[85px] rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] border-t border-gray-100 dark:border-gray-800">
      <div className="flex w-full h-full items-center justify-around px-2">
        {navItems.map((item) => {
          // Lógica de estado ativo incluindo subpáginas do perfil
          const isProfileTab = (item.id === 'profile' && ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view'].includes(activeTab));
          const isActive = activeTab === item.id || isProfileTab;

          return (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)} 
              className={`relative flex-1 flex flex-col items-center justify-center h-full outline-none group active:scale-95 transition-all`}
            >
              {/* Leve destaque visual de fundo para as abas centrais */}
              {item.isMain && (
                <div className={`absolute inset-0 m-2 rounded-2xl transition-all duration-500 ${
                    isActive ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-transparent'
                }`} />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="flex items-center justify-center h-7 w-7">
                  {renderIconOrAvatar(item, isActive)}
                </div>
                
                <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? 'text-[#1E5BFF] opacity-100 scale-105' 
                    : 'text-gray-400 opacity-70'
                }`}>
                  {item.label}
                </span>

                {/* Indicador de dot ativo sutil */}
                <div className={`w-1 h-1 rounded-full bg-[#1E5BFF] transition-all duration-300 mt-0.5 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
