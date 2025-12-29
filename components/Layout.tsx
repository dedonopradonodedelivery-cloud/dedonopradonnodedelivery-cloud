
import React, { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
  onCashbackClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onCashbackClick }) => {
  return (
    <div 
      className="h-[100dvh] bg-gray-50 dark:bg-gray-900 font-sans w-full max-w-md border-x border-gray-100 dark:border-gray-800 shadow-2xl transition-colors duration-300 relative flex flex-col overflow-hidden"
    >
        <div 
          className="flex-1 overflow-y-auto no-scrollbar" 
          style={{ 
            paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
            overscrollBehaviorY: 'contain' 
          }}
        >
            {children}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onCashbackClick={onCashbackClick} />
    </div>
  );
};