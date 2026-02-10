
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

  // Itens da barra fixa - ESTRUTURA ATUALIZADA: Início, Explorar, Cupom, Classificados, Menu
  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explore', icon: Compass, label: 'Explorar' },
    { id: 'coupons_trigger', icon: Ticket, label: 'Cupom' }, 
    { id: 'classifieds', icon: Newspaper, label: 'Classificados' },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'coupons_trigger') {
      // Regra de Comportamento: Lojista valida, Cliente vê os seus
      if (userRole === 'lojista') {
        setActiveTab('merchant_coupons');
      } else {
        setActiveTab('user_coupons');
      }
    } else {
      setActiveTab(id);
    }
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
      const photoUrl = user.user_metadata?.avatar_url;

      return (
        <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 border-2 ${
          isActive 
            ? 'border-white scale-110 shadow-lg' 
            : 'border-white/20 opacity-70'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[11px] font-black ${
              isActive ? 'bg-white text-[#1E5BFF]' : 'bg-white/20 text-white'
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
            ? 'text-white opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]' 
            : 'text-white opacity-70'
        }`} 
        strokeWidth={isActive ? 2.5 : 2} 
      />
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-[#1E5BFF] z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.3)] border-t border-white/10">
      <div className="grid grid-cols-5 w-full h-full">
        {navItems.map((item) => {
          // Lógica de estado ativo considerando redirecionamentos
          const isCouponTab = (item.id === 'coupons_trigger' && (activeTab === 'user_coupons' || activeTab === 'merchant_coupons'));
          const isProfileTab = (item.id === 'profile' && ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view'].includes(activeTab));
          const isActive = activeTab === item.id || isCouponTab || isProfileTab;

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
                <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${
                  isActive 
                    ? 'text-white opacity-100 scale-105' 
                    : 'text-white opacity-70'
                }`}>
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
