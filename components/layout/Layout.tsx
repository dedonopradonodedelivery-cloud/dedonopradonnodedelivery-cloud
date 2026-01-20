import React, { ReactNode, useEffect, useRef } from 'react';
import { BottomNav } from '../BottomNav';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, hideNav = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const finalHideNav = hideNav || activeTab === 'admin_panel';

  return (
    <div
      className="h-[100dvh] bg-white dark:bg-gray-900 font-sans w-full transition-colors duration-300 relative flex flex-col overflow-hidden"
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar w-full"
        style={{
          paddingBottom: finalHideNav
            ? 'env(safe-area-inset-bottom)'
            : 'calc(100px + env(safe-area-inset-bottom))',
          overscrollBehaviorY: 'contain',
        }}
      >
        {children}
      </div>

      {!finalHideNav && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
        />
      )}
    </div>
  );
};
