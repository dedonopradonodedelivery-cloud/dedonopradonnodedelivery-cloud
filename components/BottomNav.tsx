
import React from 'react';
import { Home, User as UserIcon, Newspaper, MessageSquare, Ticket } from 'lucide-react';
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

  const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'neighborhood_posts', icon: MessageSquare, label: 'JPA Conversa' },
    { id: 'coupons_trigger', icon: Ticket, label: 'Cupom' }, 
    { id: 'classifieds', icon: Newspaper, label: 'Classificados' },
    { id: 'profile', icon: UserIcon, label: 'Menu' },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'coupons_trigger') {
      if (userRole === 'lojista') {
        setActiveTab('merchant_coupons');
      } else if (user) {
        setActiveTab('user_coupons');
      } else {
        setActiveTab('coupon_landing');
      }
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div 
        className="absolute bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-[1000] h-[80px] rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.1)] border-t border-gray-100 dark:border-gray-800 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5 w-full h-full">
        {navItems.map((item) => {
          const isCouponTab = (item.id === 'coupons_trigger' && ['user_coupons', 'merchant_coupons', 'coupon_landing'].includes(activeTab));
          const isProfileTab = (item.id === 'profile' && ['store_area', 'user_profile_full', 'edit_profile_view'].includes(activeTab));
          const isActive = activeTab === item.id || isCouponTab || isProfileTab;
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex justify-center items-center h-full">
               <button 
                onClick={() => handleTabClick(item.id)} 
                className="w-full h-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none" 
                aria-label={item.label}
              >
                <Icon 
                    className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400'}`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400'}`}>
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
