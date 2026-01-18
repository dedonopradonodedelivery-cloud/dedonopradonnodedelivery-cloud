
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { StoreDetailView } from './components/StoreDetailView';
import { AuthModal } from './components/AuthModal';
import { MenuView } from './components/MenuView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { StoreAreaView } from './components/StoreAreaView';
import { AdminPanel } from './components/AdminPanel'; 
import { MapPin, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Category, Store, EditorialCollection, ThemeMode } from './types';
import { CategoryView } from './components/CategoryView';
import { EditorialListView } from './components/EditorialListView';
import { StoreAdsModule } from './components/StoreAdsModule';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { CommunityFeedView } from './components/CommunityFeedView';
import { STORES } from './constants';
import { 
  AboutView, 
  SupportView, 
  FavoritesView 
} from './components/SimplePages';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';
const MAIN_TABS = ['home', 'community_feed', 'profile'];

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  // 0: Splash Visible, 3: Fade-out, 4: Gone
  const [splashStage, setSplashStage] = useState(splashWasShownInSession || isAuthReturn ? 4 : 0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'ADM');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<EditorialCollection | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (splashStage === 4) return;
    const t1 = setTimeout(() => setSplashStage(3), 5000);
    const t2 = setTimeout(() => { setSplashStage(4); splashWasShownInSession = true; }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    localStorage.setItem('admin_view_mode', viewMode);
    switch (viewMode) {
      case 'ADM': setActiveTab('admin_panel'); break;
      case 'Lojista': setActiveTab('store_area'); break;
      default: if (activeTab === 'admin_panel' || activeTab === 'store_area') setActiveTab('home');
    }
  }, [viewMode, user]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };
  const headerExclusionList = ['store_area', 'editorial_list', 'store_profile', 'category_detail', 'store_detail', 'profile', 'patrocinador_master', 'store_ads_module', 'about', 'support', 'favorites', 'community_feed', 'admin_panel'];
  const hideBottomNav = ['store_ads_module', 'store_detail', 'admin_panel'].includes(activeTab);

  const RoleSwitcherModal = () => {
    if (!isRoleSwitcherOpen) return null;
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setIsRoleSwitcherOpen(false)}>
            <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-8 px-2">
                    <h2 className="text-xl font-black text-white uppercase">Modo de Visualização</h2>
                    <button onClick={() => setIsRoleSwitcherOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                </div>
                <div className="space-y-3">
                    {(['ADM', 'Usuário', 'Lojista', 'Visitante'] as RoleMode[]).map((role) => (
                        <button key={role} onClick={() => { setViewMode(role); setIsRoleSwitcherOpen(false); }} className={`w-full p-5 rounded-[1.5rem] border text-left transition-all ${viewMode === role ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white'}`}>
                            <span className="font-black uppercase">{role}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <NeighborhoodProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center relative">
          <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav}>
              {!headerExclusionList.includes(activeTab) && (
                <Header isDarkMode={isDarkMode} toggleTheme={() => {}} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
              )}
              <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
                {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={() => setActiveTab('home')} />}
                {activeTab === 'home' && <HomeFeed onNavigate={setActiveTab} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onSelectCollection={(c) => { setSelectedCollection(c); setActiveTab('editorial_list'); }} onStoreClick={handleSelectStore} stores={STORES} searchTerm={globalSearch} user={user as any} onSpinWin={() => {}} onRequireLogin={() => setIsAuthOpen(true)} />}
                {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />}
                {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}
                {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={setAdCategoryTarget} />}
                {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
                {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} />}
                {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
                {activeTab === 'about' && <AboutView onBack={() => setActiveTab('profile')} />}
                {activeTab === 'support' && <SupportView onBack={() => setActiveTab('profile')} />}
                {activeTab === 'favorites' && <FavoritesView onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} user={user as any} />}
                {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} onNavigate={setActiveTab} categoryName={adCategoryTarget || undefined} />}
                {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
              </main>
              <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={() => setIsAuthOpen(false)} />
          </Layout>
          <RoleSwitcherModal />
          
          {splashStage < 4 && (
            <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-between py-20 transition-all duration-800 ${splashStage === 3 ? 'animate-app-exit' : ''}`} style={{ backgroundColor: '#1E5BFF' }}>
              <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-logo-enter">
                    <MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" />
                  </div>
                  <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-md animate-fade-in">
                    Localizei JPA
                  </h1>
                  <div className="mt-3 h-6 flex justify-center items-center overflow-hidden">
                    <div className="typing-container animate-typing typing-wrapper animate-cursor">
                        <p className="text-[15px] font-medium text-white/85 leading-none whitespace-nowrap">
                            Rede social do seu bairro.
                        </p>
                    </div>
                  </div>
              </div>
              <div className="flex flex-col items-center animate-fade-in-delayed opacity-0 pb-20">
                   <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.25em] mb-1.5">Patrocinador Master</p>
                   <p className="text-xl font-bold text-white tracking-tight">Grupo Esquematiza</p>
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};
export default App;
