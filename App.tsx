
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StoreDetailView } from './components/StoreDetailView';
import { CashbackView } from './components/CashbackView';
import { CashbackInfoView } from './components/CashbackInfoView';
import { CashbackLandingView } from './components/CashbackLandingView';
import { RewardDetailsView } from './components/RewardDetailsView';
import { AuthModal } from './components/AuthModal';
import { MenuView } from './components/MenuView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { CashbackScanScreen } from './components/CashbackScanScreen';
import { ScanConfirmationScreen } from './components/ScanConfirmationScreen';
import { CashbackPaymentScreen } from './components/CashbackPaymentScreen';
import { PrizeHistoryView } from './components/PrizeHistoryView';
import { FreguesiaConnectPublic } from './components/FreguesiaConnectPublic';
import { FreguesiaConnectDashboard } from './components/FreguesiaConnectDashboard';
import { FreguesiaConnectRestricted } from './components/FreguesiaConnectRestricted';
import { ServicesView } from './components/ServicesView';
import { SubcategoriesView } from './components/SubcategoriesView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { ServiceSuccessView } from './components/ServiceSuccessView';
import { ServiceTermsView } from './components/ServiceTermsView';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { StoreAreaView } from './components/StoreAreaView';
import { MerchantQrScreen } from './components/MerchantQrScreen';
import { WeeklyPromoModule } from './components/WeeklyPromoModule';
import { JobsView } from './components/JobsView';
import { MerchantJobsModule } from './components/MerchantJobsModule';
import { AdminPanel } from './components/AdminPanel'; 
import { MapPin, ShieldCheck, Lock, LogIn } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Category, Store, AdType, EditorialCollection, ThemeMode } from './types';
import { getStoreLogo } from './utils/mockLogos';
import { CategoryView } from './components/CategoryView';
import { EditorialListView } from './components/EditorialListView';
import { UserStatementView } from './components/UserStatementView';
import { MerchantCashbackDashboard } from './components/MerchantCashbackDashboard';
import { MerchantCashbackOnboarding } from './components/MerchantCashbackOnboarding';
import { StoreCashbackModule } from './components/StoreCashbackModule';
import { StoreAdsModule } from './components/StoreAdsModule';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { StoreFinanceModule } from './components/StoreFinanceModule';
import { CommunityFeedView } from './components/CommunityFeedView';
import { UserCupomScreen } from './components/UserCupomScreen';
import { STORES } from './constants';
import { AdminModerationPanel } from './components/AdminModerationPanel';
import { UserCouponsHistoryView } from './components/UserCouponsHistoryView';
import { 
  AboutView, 
  SupportView, 
  InviteFriendView, 
  FavoritesView, 
  SponsorInfoView 
} from './components/SimplePages';

let isFirstBootAttempted = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';
const MAIN_TABS = ['home', 'explore', 'user_cupom', 'qrcode_scan', 'services', 'community_feed'];

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  const [splashStage, setSplashStage] = useState(isFirstBootAttempted || isAuthReturn ? 4 : 0);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('localizei_theme_mode') as ThemeMode) || 'light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'auto') return isDarkMode ? 'light' : 'dark';
      return prev === 'dark' ? 'light' : 'dark';
    });
  };

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<EditorialCollection | null>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [scannedData, setScannedData] = useState<{ merchantId: string; storeId: string } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [selectedServiceSub, setSelectedServiceSub] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);

  const touchStart = useRef<{ x: number, y: number, target: EventTarget | null } | null>(null);
  const minSwipeDistance = 60;

  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (splashStage === 4) return;
    const t1 = setTimeout(() => setSplashStage(1), 1200);
    const t2 = setTimeout(() => setSplashStage(2), 1500);
    const t3 = setTimeout(() => setSplashStage(3), 4600);
    const t4 = setTimeout(() => {
        setSplashStage(4);
        isFirstBootAttempted = true;
    }, 5000);
    return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (themeMode === 'auto') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = themeMode === 'dark';
      }
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    applyTheme();
    localStorage.setItem('localizei_theme_mode', themeMode);
  }, [themeMode]);

  // REDIRECIONAMENTO ADM (Respeita o View Mode)
  useEffect(() => {
    const isAdmin = user && user.email === ADMIN_EMAIL;
    const viewMode = localStorage.getItem('admin_view_mode') || 'ADM';

    // Se é ADM e está no modo ADM, garante que o painel é o destino inicial
    if (isAdmin && viewMode === 'ADM' && activeTab === 'home') {
       setActiveTab('admin_panel');
    }
  }, [user]);

  const handleAdminNavigate = (requestedRole?: string) => {
    if (requestedRole && requestedRole !== 'ADM') {
        setActiveTab('home');
    } else {
        setActiveTab('admin_panel');
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab('category_detail'); 
  };
  
  const handleSelectCollection = (collection: EditorialCollection) => {
    setSelectedCollection(collection);
    setActiveTab('editorial_list');
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setActiveTab('store_detail');
  };

  const handleAdvertiseInCategory = (categoryName: string) => {
    setAdCategoryTarget(categoryName);
    setActiveTab('store_ads_module');
  };

  const handleAdsBack = () => {
    setAdCategoryTarget(null);
    if (activeTab === 'store_ads_module' && selectedCategory) {
        setActiveTab('category_detail');
    } else {
        setActiveTab('store_area'); 
    }
  };

  const handleCupomClick = () => {
    const viewMode = localStorage.getItem('admin_view_mode') || 'ADM';
    const isAdmin = user && user.email === ADMIN_EMAIL;
    
    // Simulação do role baseada no modo de visualização
    const effectiveRole = isAdmin ? (viewMode.toLowerCase() === 'lojista' ? 'lojista' : 'cliente') : userRole;
    const isVisitante = (isAdmin && viewMode === 'Visitante') || (!user);

    if (isVisitante) {
      setPendingRoute('cupom');
      setIsAuthOpen(true);
    } else if (effectiveRole === 'lojista') {
      setActiveTab('qrcode_scan');
    } else {
      setActiveTab('user_cupom');
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, target: e.target };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    if (!MAIN_TABS.includes(activeTab)) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStart.current.x - touchEndX;
    const deltaY = touchStart.current.y - touchEndY;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < minSwipeDistance) return;
    const currentIndex = MAIN_TABS.indexOf(activeTab);
    if (deltaX > 0) {
      if (currentIndex < MAIN_TABS.length - 1) {
        const nextTab = MAIN_TABS[currentIndex + 1];
        if (nextTab === 'user_cupom' || nextTab === 'qrcode_scan') handleCupomClick();
        else setActiveTab(nextTab);
      }
    } else {
      if (currentIndex > 0) {
        const prevTab = MAIN_TABS[currentIndex - 1];
        if (prevTab === 'user_cupom' || prevTab === 'qrcode_scan') handleCupomClick();
        else setActiveTab(prevTab);
      }
    }
  };

  const headerExclusionList = [
    'store_area', 'merchant_qr', 'editorial_list', 'store_profile', 'store_finance',
    'category_detail', 'food_category', 'store_detail', 'profile', 
    'patrocinador_master', 'prize_history', 'reward_details', 
    'freguesia_connect_public', 'freguesia_connect_dashboard', 'freguesia_connect_restricted',
    'service_subcategories', 'service_specialties', 'service_terms', 'service_success',
    'user_statement', 'merchant_cashback_dashboard', 'merchant_cashback_onboarding',
    'store_cashback_module', 'store_ads_module', 'about', 'support', 'invite_friend', 'favorites',
    'weekly_promo', 'jobs_list', 'merchant_jobs', 'community_feed', 'admin_moderation',
    'user_cupom', 'cashback_landing', 'advertise_home_banner', 'user_coupons_history',
    'admin_panel'
  ];

  const hideBottomNav = ['store_ads_module', 'store_detail', 'admin_moderation', 'advertise_home_banner', 'admin_panel'].includes(activeTab);

  // Helper para detectar se o ADM está simulando
  const isAdminSimulating = user?.email === ADMIN_EMAIL && localStorage.getItem('admin_view_mode') !== 'ADM';

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <NeighborhoodProvider>
        <div 
          className="min-h-screen bg-white dark:bg-gray-900 flex justify-center transition-colors duration-300 relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Botão Flutuante de Retorno ao ADM (Global) */}
          {isAdminSimulating && (
            <button 
              onClick={() => {
                localStorage.setItem('admin_view_mode', 'ADM');
                setActiveTab('admin_panel');
              }}
              className="fixed top-20 right-4 z-[99] bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-95 border-2 border-white/20"
            >
              <ShieldCheck size={14} /> Voltar ao ADM
            </button>
          )}

          <Layout 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              userRole={isAdminSimulating ? (localStorage.getItem('admin_view_mode')?.toLowerCase() as any) : userRole} 
              onCashbackClick={handleCupomClick}
              hideNav={hideBottomNav}
          >
              {!headerExclusionList.includes(activeTab) && (
              <Header
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  onAuthClick={() => setActiveTab('profile')} 
                  user={isAdminSimulating && localStorage.getItem('admin_view_mode') === 'Visitante' ? null : user}
                  searchTerm={globalSearch}
                  onSearchChange={setGlobalSearch}
                  onNavigate={setActiveTab}
                  activeTab={activeTab}
                  userRole={isAdminSimulating ? (localStorage.getItem('admin_view_mode')?.toLowerCase() as any) : userRole}
                  onOpenMerchantQr={() => setActiveTab('merchant_qr')}
                  stores={STORES}
                  onStoreClick={handleSelectStore}
              />
              )}
              <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
              
              {activeTab === 'admin_panel' && (
                  <AdminPanel 
                    user={user as any} 
                    onNavigateToApp={handleAdminNavigate}
                    onLogout={signOut}
                  />
              )}

              {activeTab === 'home' && (
                  <HomeFeed
                  onNavigate={setActiveTab}
                  onSelectCategory={handleSelectCategory}
                  onSelectCollection={handleSelectCollection}
                  onStoreClick={handleSelectStore}
                  stores={STORES}
                  searchTerm={globalSearch}
                  user={isAdminSimulating && localStorage.getItem('admin_view_mode') === 'Visitante' ? null : (user as any)}
                  userRole={isAdminSimulating ? (localStorage.getItem('admin_view_mode')?.toLowerCase() as any) : userRole}
                  onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }}
                  onRequireLogin={() => setIsAuthOpen(true)}
                  />
              )}
              
              {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
              {activeTab === 'profile' && <MenuView user={isAdminSimulating && localStorage.getItem('admin_view_mode') === 'Visitante' ? null : (user as any)} userRole={isAdminSimulating ? (localStorage.getItem('admin_view_mode')?.toLowerCase() as any) : userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} currentTheme={themeMode} onThemeChange={setThemeMode} />}
              {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => { setActiveTab('home'); setSelectedCategory(null); }} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={handleAdvertiseInCategory} />}
              {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
              {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
              {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={isAdminSimulating && localStorage.getItem('admin_view_mode') === 'Visitante' ? null : (user as any)} onRequireLogin={() => setIsAuthOpen(true)} />}
              {activeTab === 'user_cupom' && <UserCupomScreen user={user as any} onBack={() => setActiveTab('home')} />}
              {activeTab === 'qrcode_scan' && <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} />}
              {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} />}
              </main>

              <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => {
                    setIsAuthOpen(false);
                    setPendingRoute(null);
                }} 
                user={user as any}
                onLoginSuccess={() => { setIsAuthOpen(false); }}
              />
              {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => { setIsQuoteModalOpen(false); setActiveTab('service_success'); }} />}
          </Layout>

          {splashStage < 4 && (
            <div className={`fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-500 ${splashStage === 3 ? 'animate-app-exit' : ''}`} style={{ backgroundColor: '#1E5BFF' }} >
              <div className={`flex flex-col items-center justify-center z-10 transition-all duration-700 ${splashStage === 0 ? 'animate-logo-enter' : 'opacity-100'} ${splashStage >= 1 ? 'animate-logo-micro-move' : ''}`} >
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6">
                    <MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" />
                  </div>
                  <h1 className="text-5xl font-black font-display text-white tracking-tighter drop-shadow-md">Localizei</h1>
                  <span className="text-sm font-bold text-white/90 tracking-[0.5em] uppercase mt-1">JPA</span>
                  <div className={`mt-12 flex flex-col items-center gap-2 transition-all duration-300 ${splashStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                     <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-medium animate-sponsor-label-fade" style={{ animationDelay: '0ms' }}>Patrocinador Master</p>
                     <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/10 overflow-hidden min-h-[48px]">
                        <div className="animate-sponsor-icon-elastic" style={{ animationDelay: '100ms' }}>
                           <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex overflow-hidden relative">
                            <span className={`text-sm font-bold text-white tracking-wide whitespace-nowrap border-r-2 border-white pr-1 overflow-hidden w-0 ${splashStage >= 2 ? 'animate-typewriter' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>Grupo Esquematiza</span>
                        </div>
                     </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};

export default App;
