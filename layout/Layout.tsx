
import React, { ReactNode, useEffect, useRef } from 'react';
import { BottomNav } from '../components/BottomNav';
import { RoleMode } from './types'; // FIX: Corrected import path for RoleMode

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
  hideNav?: boolean;
  // FIX: Added viewMode to pass down to BottomNav
  viewMode: RoleMode;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, hideNav = false, viewMode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when activeTab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Se for admin_panel, forçamos hideNav true internamente por segurança extra
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
          // FIX: Pass viewMode prop to BottomNav
          viewMode={viewMode}
        />
      )}
    </div>
  );
};