
import React, { useMemo, useState } from 'react';
import { Home, User as UserIcon, Newspaper, MessageSquare, Ticket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../AuthModal';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | 'admin' | null;
}

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  isMainAction?: boolean; 
  badge?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const hasActiveCoupons = useMemo(() => {
    if (!user || userRole !== 'cliente') return false;
    try {
      const saved = JSON.parse(localStorage.getItem('user_saved_coupons') || '[]');
      return saved.some((c: any) => c.status === 'available');
    } catch {
      return false;
    }
  }, [user, userRole, activeTab]);

  const navItems = useMemo(() => {
    return [
      { id: 'home', icon: Home, label: 'Início', isMainAction: false },
      { id: 'neighborhood_posts', icon: MessageSquare, label: 'JPA Conversa', isMainAction: true },
      { id: 'cupom_trigger', icon: Ticket, label: 'Cupom', isMainAction: true, badge: userRole !== 'lojista' ? hasActiveCoupons : false },
      { id: 'classifieds', icon: Newspaper, label: 'Classificados', isMainAction: true },
      { id: 'profile', icon: UserIcon, label: 'Menu', isMainAction: false },
    ];
  }, [userRole, hasActiveCoupons]);

  const handleTabClick = (item: NavItem) => {
    if (item.id === 'cupom_trigger') {
      if (!user) {
        setActiveTab('coupon_landing');
      } else {
        if (userRole === 'lojista') {
          setActiveTab('merchant_coupons');
        } else {
          setActiveTab('user_coupons');
        }
      }
    } else {
      setActiveTab(item.id);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
      const photoUrl = user.user_metadata?.avatar_url;

      return (
        <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-200 border-2 ${
          isActive 
            ? 'border-[#1E5BFF] shadow-lg scale-110' 
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          {photoUrl ? (
            <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-[10px] font-black ${
              isActive ? 'bg-[#1E5BFF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {userInitial}
            </div>
          )}
        </div>
      );
    }

    const Icon = item.icon;
    const iconSize = item.isMainAction ? 26 : 22;
    
    return (
      <div className={`relative flex items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-40'}`}>
         <Icon 
          size={iconSize}
          className={`text-[#1E5BFF] ${isActive ? 'drop-shadow-[0_0_8px_rgba(30,91,255,0.2)]' : ''}`} 
          strokeWidth={isActive ? 2.5 : 2} 
        />
        {item.badge && (
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-900 z-[1000] h-[85px] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 dark:border-gray-800 px-2 transition-all duration-500">
        <div className="grid w-full h-full grid-cols-5 items-center">
          {navItems.map((item) => {
            let isActive = false;
            
            if (item.id === 'cupom_trigger') {
               isActive = activeTab === 'merchant_coupons' || activeTab === 'user_coupons' || activeTab === 'coupon_landing';
            } else if (item.id === 'profile') {
               isActive = ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites', 'user_profile_full', 'edit_profile_view'].includes(activeTab);
            } else {
               isActive = activeTab === item.id;
            }

            return (
              <div key={item.id} className="flex justify-center h-full items-center px-1">
                 <button 
                  onClick={() => handleTabClick(item)} 
                  className="w-full h-full flex flex-col items-center justify-center outline-none group active:scale-95 transition-transform" 
                >
                  <div className={`
                    flex items-center justify-center transition-all duration-300 relative
                    ${item.isMainAction 
                      ? `h-14 w-14 rounded-full border-2 -translate-y-6 mb-[-24px] shadow-lg ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-[#1E5BFF] scale-110' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                        }`
                      : 'h-8 w-8 mb-1'
                    }
                  `}>
                    {renderIconOrAvatar(item, isActive)}
                  </div>
                  
                  <span className={`text-[8px] font-black uppercase tracking-tighter transition-all leading-none text-center px-0.5 mt-1 ${
                    isActive 
                      ? 'text-[#1E5BFF] opacity-100 scale-105 font-black' 
                      : 'text-gray-400 opacity-70 font-bold'
                  } ${item.isMainAction ? 'mt-2.5' : ''}`}>
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        user={null}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};
