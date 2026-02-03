
import React, { useMemo } from 'react';
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
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

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
        setIsAuthModalOpen(true);
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
    const role = localStorage.getItem('localizei_user_role') || 'cliente';
    if (role === 'lojista') {
      setActiveTab('merchant_coupons');
    } else {
      setActiveTab('user_coupons');
    }
  };

  const renderIconOrAvatar = (item: NavItem, isActive: boolean) => {
    if (item.id === 'profile' && user) {
      const photoUrl = user.user_metadata?.avatar_url;
      const userInitial = user.email?.charAt(0).toUpperCase() || user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';

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
      <div className="relative">
        <Icon 
          className={`w-6 h-6 transition-all duration-200 ${isActive ? 'text-blue-600' : 'text-blue-500'}`} 
          strokeWidth={isActive ? 3 : 2.5} 
        />
        {item.badge && !isActive && (
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-950 z-[1000] h-[90px] rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-gray-100 dark:border-gray-800 px-2">
        <div className="grid w-full h-full grid-cols-5 items-center">
          {navItems.map((item) => {
            let isActive = false;
            if (item.id === 'cupom_trigger') {
               isActive = activeTab === 'merchant_coupons' || activeTab === 'user_coupons';
            } else if (item.id === 'profile') {
               isActive = ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'about', 'support', 'favorites'].includes(activeTab) || activeTab === 'profile';
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
                      ? `h-16 w-16 rounded-full border-[3px] -translate-y-8 mb-[-32px] shadow-xl ${
                          isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 shadow-blue-500/30 scale-105' 
                            : 'bg-white dark:bg-gray-800 border-blue-50 dark:border-gray-700 shadow-black/5'
                        }`
                      : 'h-8 w-8 mb-1'
                    }
                  `}>
                    {renderIconOrAvatar(item, isActive)}
                  </div>
                  
                  <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors leading-none text-center px-0.5 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  } ${item.isMainAction ? 'mt-3' : ''}`}>
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
