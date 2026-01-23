
import React from 'react';
import { Home, Users, User, QrCode, Wallet } from 'lucide-react';
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
    { id: 'community_feed', icon: Users, label: 'Comunidade' },
  ];

  if (userRole !== 'admin') {
    const isMerchant = user && userRole === 'lojista';
    let centerId: string;
    
    if (!user) {
      centerId = 'cashback_landing';
    } else if (isMerchant) {
      centerId = 'merchant_qr_display';
    } else {
      centerId = 'scan_cashback';
    }

    const centerLabel = isMerchant ? 'QR Code' : 'Cashback';
    const centerIcon = isMerchant ? QrCode : Wallet;

    navItems.push({ 
      id: centerId, 
      icon: centerIcon, 
      label: centerLabel, 
      isCenter: true 
    });
  }

  navItems.push({ id: 'profile', icon: User, label: 'Menu' });

  const NavButton: React.FC<{ item: NavItem; isActive: boolean }> = ({ item, isActive }) => {
    const Icon = item.icon;

    if (item.isCenter) {
      return (
        <div className="relative w-16 flex justify-center -mt-10">
          <button
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center group outline-none"
          >
            <div className={`
              w-16 h-16 rounded-[2rem] flex items-center justify-center 
              shadow-2xl shadow-blue-600/40 border-[4px] border-white dark:border-gray-950 
              active:scale-90 transition-all duration-300 transform-gpu
              ${isActive ? 'bg-white' : 'bg-[#1E5BFF]'}
            `}>
              <Icon 
                className={`w-7 h-7 transition-colors ${isActive ? 'text-[#1E5BFF]' : 'text-white'}`} 
                strokeWidth={3} 
              />
            </div>
            <span className={`text-[9px] font-black uppercase mt-2 tracking-tight transition-colors ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400 dark:text-gray-500'}`}>
              {item.label}
            </span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className="w-full h-full flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform outline-none"
      >
        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-transparent'}`}>
          <Icon 
            className={`w-5 h-5 transition-colors ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400 dark:text-gray-600'}`} 
            strokeWidth={isActive ? 3 : 2}
          />
        </div>
        <span className={`text-[9px] font-black uppercase transition-colors ${isActive ? 'text-[#1E5BFF]' : 'text-gray-400 dark:text-gray-600'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white dark:bg-gray-950 z-50 h-[80px] rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 dark:border-gray-900 transition-all duration-500">
      <div className="flex items-center justify-around w-full h-full px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || 
                          (item.id === 'scan_cashback' && activeTab === 'pay_cashback') ||
                          (item.id === 'merchant_qr_display' && activeTab === 'merchant_onboarding') ||
                          (item.id === 'cashback_landing' && (activeTab === 'scan_cashback' || activeTab === 'pay_cashback'));
          
          return (
            <div key={item.id} className="flex-1 flex justify-center items-center h-full">
              <NavButton item={item} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
