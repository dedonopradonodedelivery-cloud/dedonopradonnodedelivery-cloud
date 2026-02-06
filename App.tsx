import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { HappeningNowForm } from './components/HappeningNowForm';
import { STORES } from './constants';
import { Category, Store } from './types';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const { user, userRole } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (view: string, data?: any) => {
    setActiveTab(view);
  };

  const handleSelectCategory = (cat: Category) => {
    handleNavigate('explore', { category: cat });
  };

  const handleSelectStore = (store: Store) => {
    handleNavigate('store_detail', { store });
  };

  const headerExclusionList = ['happening_now_form', 'admin_panel'];

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <NeighborhoodProvider>
        <Layout 
          activeTab={activeTab} 
          setActiveTab={handleNavigate} 
          userRole={userRole}
          hideNav={activeTab === 'admin_panel'}
        >
          {!headerExclusionList.includes(activeTab) && (
            <Header 
              isDarkMode={theme === 'dark'}
              toggleTheme={() => {}}
              onAuthClick={() => setIsAuthModalOpen(true)}
              user={user}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNavigate={handleNavigate}
              activeTab={activeTab}
              userRole={userRole}
              stores={STORES}
              onStoreClick={handleSelectStore}
              onNotificationClick={() => {}}
            />
          )}
          <main className="w-full mx-auto">
            {activeTab === 'home' && (
              <HomeFeed 
                onNavigate={handleNavigate} 
                onSelectCategory={handleSelectCategory} 
                onStoreClick={handleSelectStore} 
                stores={STORES} 
                user={user as any} 
                userRole={userRole} 
              />
            )}
            {activeTab === 'happening_now_form' && (
              <HappeningNowForm onBack={() => handleNavigate('home')} userRole={userRole} />
            )}
          </main>
        </Layout>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          user={user} 
        />
      </NeighborhoodProvider>
    </div>
  );
};

export default App;
