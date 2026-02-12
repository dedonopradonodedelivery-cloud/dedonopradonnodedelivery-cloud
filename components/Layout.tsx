
import React, { ReactNode, useEffect, useRef } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'cliente' | 'lojista' | null;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, hideNav = false }) => {
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
      className="h-[100dvh] bg-gray-100 dark:bg-black font-sans w-full transition-colors duration-300 relative flex justify-center overflow-hidden"
    >
      <div className="w-full max-w-md bg-gradient-to-b from-[#1E5BFF] to-[#001D4A] shadow-2xl relative flex flex-col overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar w-full relative"
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
    </div>
  );
};
