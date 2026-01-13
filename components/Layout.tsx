
import React, { ReactNode, useEffect, useRef } from 'react';
import { BottomNav } from './BottomNav';
import { UserRole } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: UserRole | null;
  onCashbackClick?: () => void;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onCashbackClick, hideNav = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when activeTab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div
      className="h-[100dvh] bg-gray-50 dark:bg-gray-900 font-sans w-full transition-colors duration-300 relative flex flex-col overflow-hidden"
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar w-full"
        style={{
          paddingBottom: hideNav
            ? 'env(safe-area-inset-bottom)'
            : 'calc(100px + env(safe-area-inset-bottom))',
          overscrollBehaviorY: 'contain',
        }}
      >
        {children}
      </div>

      {!hideNav && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
          onCashbackClick={onCashbackClick}
        />
      )}
    </div>
  );
};
