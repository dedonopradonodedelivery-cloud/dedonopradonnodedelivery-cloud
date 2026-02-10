
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { CategoryView } from './pages/categories/CategoryView';
import { StoreDetailView } from './components/StoreDetailView';
import { NeighborhoodPostsView } from './components/NeighborhoodPostsView';
import { ClassifiedsView } from './components/ClassifiedsView';
import { MenuView } from './components/MenuView';
import { AuthModal } from './components/AuthModal';
import { GeminiAssistant } from './components/GeminiAssistant';
import { HealthImmersiveView } from './components/HealthImmersiveView';
import { SplashScreen } from './components/layout/SplashScreen';
// Import STORES and CATEGORIES to resolve missing names errors
import { STORES, CATEGORIES } from './constants';
import { Store, Category } from './types';

const App: React.FC = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('splash');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [healthProfile, setHealthProfile] = useState<'Mulher' | 'Homem' | 'Pediatria' | 'Geriatria' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Lógica de Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500); // 2.5 segundos de tempo mínimo
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Só sai do splash se o tempo mínimo passou E o auth terminou de carregar
    if (minTimeElapsed && !authLoading && activeTab === 'splash') {
      setActiveTab('home');
    }
  }, [minTimeElapsed, authLoading, activeTab]);

  const handleNavigate = (view: string, data?: any) => {
    setActiveTab(view);
    if (view === 'store_detail' && data?.store) {
      setSelectedStore(data.store);
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab('category_detail');
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setActiveTab('store_detail');
  };

  const handleSelectSubcategory = (subName: string, category: Category) => {
      console.log('Subcategory selected:', subName, 'in', category.name);
  };

  // Se estiver no modo Splash, renderiza apenas a Splash Screen
  if (activeTab === 'splash') {
    return <SplashScreen />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={userRole as any}>
      <Header 
        isDarkMode={false}
        toggleTheme={() => {}} 
        onNotificationClick={() => handleNavigate('notifications')}
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        userRole={userRole as any}
        stores={STORES}
        onStoreClick={handleSelectStore}
        onSelectCategory={handleSelectCategory}
        onOpenMoreCategories={() => {}}
      />
      
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeFeed 
            onNavigate={handleNavigate}
            onSelectCategory={handleSelectCategory}
            onStoreClick={handleSelectStore}
            stores={STORES}
            user={user}
            userRole={userRole as any}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView 
            stores={STORES}
            searchQuery={searchTerm}
            onStoreClick={handleSelectStore}
            onLocationClick={() => {}}
            onFilterClick={() => {}}
            onOpenPlans={() => {}}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'category_detail' && selectedCategory && (
          <CategoryView 
            category={selectedCategory} 
            onBack={() => handleNavigate('home')} 
            onStoreClick={handleSelectStore} 
            stores={STORES} 
            userRole={userRole as any} 
            onAdvertiseInCategory={() => {}} 
            onNavigate={handleNavigate}
            onSubcategoryClick={(subName) => {
               if (selectedCategory.slug === 'saude') {
                  setHealthProfile(subName as any);
                  handleNavigate('health_immersive');
               } else {
                  handleSelectSubcategory(subName, selectedCategory);
               }
            }}
          />
        )}

        {activeTab === 'health_immersive' && healthProfile && (
            <HealthImmersiveView 
               group={healthProfile}
               onBack={() => handleNavigate('category_detail')}
            />
        )}

        {activeTab === 'store_detail' && selectedStore && (
          <StoreDetailView 
            store={selectedStore} 
            onBack={() => handleNavigate('home')} 
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'community_feed' && (
          <NeighborhoodPostsView 
            onBack={() => handleNavigate('home')}
            onStoreClick={handleSelectStore}
            user={user}
            onRequireLogin={() => setIsAuthModalOpen(true)}
            userRole={userRole as any}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'classifieds' && (
          <ClassifiedsView 
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
            user={user}
            onRequireLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <MenuView 
            user={user}
            userRole={userRole as any}
            onAuthClick={() => setIsAuthModalOpen(true)}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      <GeminiAssistant />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        user={user}
        onLoginSuccess={() => setIsAuthModalOpen(false)}
      />
    </Layout>
  );
};

export default App;
