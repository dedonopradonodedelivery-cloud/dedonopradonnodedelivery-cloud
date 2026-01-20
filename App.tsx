import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StoreDetailView } from './components/StoreDetailView';
import { AuthModal } from './components/AuthModal';
import { MenuView } from './components/MenuView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { ServicesView } from './components/ServicesView';
import { SubcategoriesView } from './components/SubcategoriesView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { ServiceSuccessView } from './components/ServiceSuccessView';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { StoreAreaView } from './components/StoreAreaView';
import { WeeklyPromoModule } from './components/WeeklyPromoModule';
import { JobsView } from './components/JobsView';
import { MerchantJobsModule } from './components/MerchantJobsModule';
import { AdminPanel } from './components/AdminPanel';
import { CashbackLandingView } from './components/CashbackLandingView';
import { StoreAdsModule } from './components/StoreAdsModule';
import { BannerUploadView } from './components/BannerUploadView';
import { BannerProductionView } from './components/BannerProductionView';
import { AdminBannerModeration } from './components/AdminBannerModeration';
import { MapPin, ShieldCheck, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Category, Store, RoleMode } from './types';
import { CategoryView } from './components/CategoryView';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { CommunityFeedView } from './components/CommunityFeedView';
import { STORES } from './constants';
import { AdminModerationPanel } from './components/AdminModerationPanel';
import { AboutView, SupportView, FavoritesView } from './components/SimplePages';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const TypingText: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const charDelay = duration / text.length;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, charDelay);
    return () => clearInterval(interval);
  }, [text, duration]);
  return <p className="text-[15px] font-medium text-white/90 mt-2 text-center whitespace-nowrap overflow-hidden">{displayedText}</p>;
};

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  const [splashStage, setSplashStage] = useState(splashWasShownInSession || isAuthReturn ? 4 : 0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'Visitante');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('localizei_active_tab', activeTab); }, [activeTab]);
  
  // Set default viewMode after auth is resolved, but only if no mode was persisted.
  useEffect(() => {
    if (isAuthInitialLoading) return;

    const persistedMode = localStorage.getItem('admin_view_mode') as RoleMode;
    if (!persistedMode) {
        if (user?.email === ADMIN_EMAIL) setViewMode('ADM');
        else if (userRole === 'lojista') setViewMode('Lojista');
        else if (userRole === 'cliente') setViewMode('Usuário');
        else setViewMode('Visitante');
    } else {
        // Validate persisted mode against actual user role
        if (persistedMode === 'ADM' && user?.email !== ADMIN_EMAIL) {
            setViewMode('Visitante'); // Demote if not an admin
        }
    }
  }, [isAuthInitialLoading, user, userRole]);


  // Effect to handle navigation redirects when viewMode changes.
  useEffect(() => {
    if (!viewMode) return;
    localStorage.setItem('admin_view_mode', viewMode);
    
    switch (viewMode) {
      case 'ADM':
        if (user?.email === ADMIN_EMAIL) setActiveTab('admin_panel');
        break;
      case 'Lojista':
        if (user) {
            setActiveTab('store_area');
        } else {
            setPendingTab('store_area');
            setActiveTab('home');
            setIsAuthOpen(true);
        }
        break;
      case 'Usuário':
        if (user) {
            if (['admin_panel', 'store_area'].includes(activeTab)) {
                setActiveTab('profile');
            }
        } else {
            setPendingTab('profile');
            setActiveTab('home');
            setIsAuthOpen(true);
        }
        break;
      case 'Visitante':
        if (['admin_panel', 'store_area', 'profile', 'wallet', 'favorites'].includes(activeTab)) {
            setActiveTab('home');
        }
        break;
    }
  }, [viewMode]);

  // General auth guard for restricted tabs
  useEffect(() => {
    const restrictedTabs = ['scan_cashback', 'merchant_qr_display', 'wallet', 'pay_cashback', 'store_area', 'admin_panel', 'edit_profile', 'profile', 'favorites'];
    
    if (restrictedTabs.includes(activeTab)) {
      if (!isAuthInitialLoading && !user) {
        setPendingTab(activeTab);
        setActiveTab('home');
        setIsAuthOpen(true);
      }
    }
  }, [activeTab, user, isAuthInitialLoading]);

  // Route Protection: Ensures the active tab is compatible with the current viewMode.
  useEffect(() => {
      if (isAuthInitialLoading) return;
      
      const merchantTabs = ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'banner_upload', 'banner_production'];
      
      // Admin panel protection
      if (activeTab === 'admin_panel' && (viewMode !== 'ADM' || user?.email !== ADMIN_EMAIL)) {
          setActiveTab('home');
      }
      
      // Merchant panel protection
      if (merchantTabs.includes(activeTab) && viewMode !== 'Lojista') {
          setActiveTab(viewMode === 'Usuário' ? 'profile' : 'home');
      }

  }, [activeTab, viewMode, user, isAuthInitialLoading]);


  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };


  useEffect(() => {
    if (splashStage === 4) return;
    const t1 = setTimeout(() => setSplashStage(3), 5000);
    const t2 = setTimeout(() => { setSplashStage(4); splashWasShownInSession = true; }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };
  const headerExclusionList = ['store_area', 'editorial_list', 'store_profile', 'category_detail', 'store_detail', 'profile', 'patrocinador_master', 'service_subcategories', 'service_specialties', 'store_ads_module', 'about', 'support', 'favorites', 'community_feed', 'admin_panel', 'cashback_landing', 'admin_banner_moderation', 'banner_upload', 'banner_production'];
  const hideBottomNav = ['store_ads_module', 'store_detail', 'admin_panel', 'cashback_landing', 'admin_banner_moderation', 'banner_upload', 'banner_production'].includes(activeTab);

  const RoleSwitcherModal: React.FC = () => {
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
          <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav} viewMode={viewMode}>
              {!headerExclusionList.includes(activeTab) && (
                <Header isDarkMode={isDarkMode} toggleTheme={() => {}} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole as 'cliente' | 'lojista' | null} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
              )}
              <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
                {activeTab === 'cashback_landing' && <CashbackLandingView onBack={() => setActiveTab('home')} onLogin={() => { setPendingTab('scan_cashback'); setIsAuthOpen(true); }} />}
                {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={setActiveTab} />}
                {activeTab === 'admin_banner_moderation' && user?.email === ADMIN_EMAIL && <AdminBannerModeration user={user as any} onBack={() => setActiveTab('admin_panel')} />}
                {activeTab === 'home' && <HomeFeed onNavigate={setActiveTab} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onSelectCollection={() => {}} onStoreClick={handleSelectStore} stores={STORES} searchTerm={globalSearch} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}
                {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
                {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />}
                {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />}
                {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
                {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={setAdCategoryTarget} onNavigate={setActiveTab} />}
                {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
                {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} />}
                {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
                {activeTab === 'jobs_list' && <JobsView onBack={() => setActiveTab('home')} />}
                {activeTab === 'about' && <AboutView onBack={() => setActiveTab('profile')} />}
                {activeTab === 'support' && <SupportView onBack={() => setActiveTab('profile')} />}
                {activeTab === 'favorites' && <FavoritesView onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} user={user as any} />}
                {activeTab === 'service_subcategories' && selectedServiceMacro && <SubcategoriesView macroId={selectedServiceMacro.id} macroName={selectedServiceMacro.name} onBack={() => setActiveTab('services')} onSelectSubcategory={(n) => { setQuoteCategory(n); setActiveTab('service_specialties'); }} />}
                {activeTab === 'service_specialties' && <SpecialtiesView subcategoryName={quoteCategory} onBack={() => setActiveTab('service_subcategories')} onSelectSpecialty={() => setIsQuoteModalOpen(true)} />}
                {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} onNavigate={setActiveTab} categoryName={adCategoryTarget || undefined} user={user as any} />}
                {activeTab === 'banner_upload' && <BannerUploadView onBack={() => setActiveTab('store_ads_module')} />}
                {activeTab === 'banner_production' && <BannerProductionView onBack={() => setActiveTab('store_ads_module')} />}
                {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
              </main>
              <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={handleLoginSuccess} />
              {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => setActiveTab('service_success')} />}
          </Layout>
          <RoleSwitcherModal />
          {splashStage < 4 && (
            <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-between py-24 transition-all duration-800 ${splashStage === 3 ? 'animate-app-exit' : ''}`} style={{ backgroundColor: '#1E5BFF' }}>
              <div className="flex flex-col items-center animate-fade-in text-center px-4">
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-logo-enter"><MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" /></div>
                  <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-md">Localizei JPA</h1>
                  <TypingText text="Onde o bairro conversa" duration={2000} />
              </div>
              <div className="flex flex-col items-center animate-fade-in opacity-0" style={{ animationDelay: '3000ms', animationFillMode: 'forwards' }}>
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