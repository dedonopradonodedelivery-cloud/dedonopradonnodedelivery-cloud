
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StoreDetailView } from './components/StoreDetailView';
import { CashbackView } from './components/CashbackView';
import { CashbackInfoView } from './components/CashbackInfoView';
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
import { MapPin, Crown, X, Star } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
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
import { STORES } from './constants';
import { 
  AboutView, 
  SupportView, 
  InviteFriendView, 
  FavoritesView, 
  SponsorInfoView 
} from './components/SimplePages';

// Global para persistência entre ciclos de vida se necessário
let isFirstBootAttempted = false;

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  
  // UX ENGINEER: Detecta se estamos voltando de um login com Google (OAuth)
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(isFirstBootAttempted || isAuthReturn);
  const [splashProgress, setSplashProgress] = useState(isAuthReturn ? 100 : 0);
  
  // Theme Management - DEFAULT IS LIGHT
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('localizei_theme_mode') as ThemeMode) || 'light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados de Navegação - Persistência via LocalStorage garantida
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

  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
  }, [activeTab]);

  // Ciclo de vida do Splash (Cold Start Only)
  useEffect(() => {
    if (isFirstBootAttempted || isAuthReturn) return;

    setSplashProgress(100);
    const timer = setTimeout(() => {
      isFirstBootAttempted = true;
      setMinSplashTimeElapsed(true);
    }, 5200);

    return () => clearTimeout(timer);
  }, [isAuthReturn]);

  // Theme Logic
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

    // Listener for system changes if in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'auto') applyTheme();
    };
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Toggle Function (Legacy, now just cycles or sets specific)
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const handleCashbackClick = () => {
    if (user) setActiveTab('qrcode_scan');
    else setIsAuthOpen(true);
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

  const headerExclusionList = [
    'store_area', 'merchant_qr', 'editorial_list', 'store_profile', 'store_finance',
    'category_detail', 'food_category', 'store_detail', 'profile', 
    'patrocinador_master', 'prize_history', 'reward_details', 
    'freguesia_connect_public', 'freguesia_connect_dashboard', 'freguesia_connect_restricted',
    'service_subcategories', 'service_specialties', 'service_terms', 'service_success',
    'user_statement', 'merchant_cashback_dashboard', 'merchant_cashback_onboarding',
    'store_cashback_module', 'store_ads_module', 'about', 'support', 'invite_friend', 'favorites',
    'weekly_promo', 'jobs_list', 'merchant_jobs', 'community_feed' 
  ];

  // UX ENGINEER: Ocultamos a barra de navegação no fluxo de anúncios para evitar 
  // distrações e garantir que o botão de ação fique visível.
  const hideBottomNav = ['store_ads_module', 'profile', 'store_detail'].includes(activeTab);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center transition-colors duration-300 relative">
        
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={userRole} 
          onCashbackClick={handleCashbackClick}
          hideNav={hideBottomNav}
        >
          {/* Header is shown for main tabs except when excluded */}
          {!headerExclusionList.includes(activeTab) && (
            <Header
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onAuthClick={() => setActiveTab('profile')} // Agora abre o perfil/menu
              user={user}
              searchTerm={globalSearch}
              onSearchChange={setGlobalSearch}
              onNavigate={setActiveTab}
              activeTab={activeTab}
              userRole={userRole}
              onOpenMerchantQr={() => setActiveTab('merchant_qr')}
            />
          )}
          <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
            {activeTab === 'home' && (
              <HomeFeed
                onNavigate={setActiveTab}
                onSelectCategory={handleSelectCategory}
                onSelectCollection={handleSelectCollection}
                onStoreClick={handleSelectStore}
                stores={STORES}
                searchTerm={globalSearch}
                user={user as any}
                userRole={userRole}
                onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }}
                onRequireLogin={() => setIsAuthOpen(true)}
              />
            )}
            {activeTab === 'explore' && (
              <ExploreView 
                stores={STORES} 
                searchQuery={globalSearch} 
                onStoreClick={handleSelectStore} 
                onLocationClick={() => {}} 
                onFilterClick={() => {}} 
                onOpenPlans={() => {}}
                onNavigate={setActiveTab}
              />
            )}
            {activeTab === 'user_statement' && (
              <UserStatementView onBack={() => setActiveTab('home')} onExploreStores={() => setActiveTab('explore')} balance={12.40} />
            )}
            {activeTab === 'merchant_cashback_onboarding' && (
              <MerchantCashbackOnboarding onBack={() => setActiveTab('home')} onActivate={() => setActiveTab('store_cashback_module')} />
            )}
            {activeTab === 'merchant_cashback_dashboard' && (
              <MerchantCashbackDashboard onBack={() => setActiveTab('home')} onNavigate={setActiveTab} />
            )}
            {activeTab === 'store_cashback_module' && <StoreCashbackModule onBack={() => setActiveTab('home')} />}
            {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} />}
            {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
            {activeTab === 'store_finance' && <StoreFinanceModule onBack={() => setActiveTab('store_area')} />}
            {activeTab === 'weekly_promo' && <WeeklyPromoModule onBack={() => setActiveTab('store_area')} />}
            {activeTab === 'merchant_jobs' && <MerchantJobsModule onBack={() => setActiveTab('store_area')} />}
            {activeTab === 'jobs_list' && <JobsView onBack={() => setActiveTab('home')} />}
            
            {/* Community Feed now as a main tab */}
            {activeTab === 'community_feed' && (
                <CommunityFeedView 
                    onStoreClick={handleSelectStore} 
                    // No onBack needed for main tab navigation
                />
            )}

            {activeTab === 'about' && <AboutView onBack={() => setActiveTab('profile')} />}
            {activeTab === 'support' && <SupportView onBack={() => setActiveTab('profile')} />}
            {activeTab === 'invite_friend' && <InviteFriendView onBack={() => setActiveTab('profile')} />}
            {activeTab === 'favorites' && <FavoritesView user={user as any} onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} />}
            {activeTab === 'editorial_list' && selectedCollection && (
              <EditorialListView collection={selectedCollection} stores={STORES} onBack={() => { setActiveTab('home'); setSelectedCollection(null); }} onStoreClick={handleSelectStore} />
            )}
            {activeTab === 'services' && (
              <ServicesView onSelectMacro={(id, name) => {
                  setSelectedServiceMacro({id, name});
                  if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } 
                  else { setActiveTab('service_subcategories'); }
                }} 
                onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch}
              />
            )}
            {activeTab === 'store_area' && (userRole === 'lojista' ? <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />)}
            {activeTab === 'merchant_qr' && (userRole === 'lojista' ? <MerchantQrScreen user={user} onBack={() => setActiveTab('home')} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />)}
            
            {activeTab === 'category_detail' && selectedCategory && (
                <CategoryView 
                    category={selectedCategory} 
                    onBack={() => { setActiveTab('home'); setSelectedCategory(null); }} 
                    onStoreClick={handleSelectStore} 
                    stores={STORES} 
                />
            )}
            
            {activeTab === 'service_subcategories' && selectedServiceMacro && <SubcategoriesView macroId={selectedServiceMacro.id} macroName={selectedServiceMacro.name} onBack={() => setActiveTab('services')} onSelectSubcategory={(subName) => { setSelectedServiceSub(subName); setActiveTab('service_specialties'); }} />}
            {activeTab === 'service_specialties' && selectedServiceSub && <SpecialtiesView subcategoryName={selectedServiceSub} onBack={() => setActiveTab('service_subcategories')} onSelectSpecialty={(specialty) => { setQuoteCategory(`${selectedServiceSub} - ${specialty}`); setIsQuoteModalOpen(true); }} />}
            {activeTab === 'service_success' && <ServiceSuccessView onViewRequests={() => alert('Meus Pedidos')} onHome={() => setActiveTab('home')} />}
            {activeTab === 'service_terms' && <ServiceTermsView onBack={() => setActiveTab('services')} />}
            {activeTab === 'freguesia_connect_public' && <FreguesiaConnectPublic onBack={() => setActiveTab('home')} onLogin={() => setIsAuthOpen(true)} />}
            {activeTab === 'freguesia_connect_dashboard' && <FreguesiaConnectDashboard onBack={() => setActiveTab('home')} />}
            {activeTab === 'freguesia_connect_restricted' && <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />}
            {activeTab === 'qrcode_scan' && <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} />}
            {activeTab === 'scan_confirmation' && scannedData && <ScanConfirmationScreen storeId={scannedData.storeId} onConfirm={() => setActiveTab('cashback_payment')} onCancel={() => setActiveTab('home')} />}
            {activeTab === 'cashback_payment' && scannedData && <CashbackPaymentScreen user={user as any} merchantId={scannedData.merchantId} storeId={scannedData.storeId} onBack={() => setActiveTab('home')} onComplete={() => setActiveTab('home')} />}
            
            {/* MenuView now receives Theme Props */}
            {activeTab === 'profile' && 
                <MenuView 
                    user={user as any} 
                    userRole={userRole} 
                    onAuthClick={() => setIsAuthOpen(true)} 
                    onNavigate={setActiveTab} 
                    onBack={() => setActiveTab('home')}
                    currentTheme={themeMode}
                    onThemeChange={setThemeMode}
                />
            }
            
            {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
            {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
            {activeTab === 'reward_details' && <RewardDetailsView reward={selectedReward} onBack={() => setActiveTab('home')} onHome={() => setActiveTab('home')} />}
            {activeTab === 'prize_history' && user && <PrizeHistoryView userId={user.id} onBack={() => setActiveTab('home')} onGoToSpinWheel={() => setActiveTab('home')} />}
          </main>

          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} />
          {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => { setIsQuoteModalOpen(false); setActiveTab('service_success'); }} />}
        </Layout>

        {/* OVERLAY SPLASH */}
        {!minSplashTimeElapsed && (
          <div className="fixed inset-0 bg-[#1E5BFF] flex flex-col items-center justify-center text-white z-[999] overflow-hidden animate-out fade-out duration-700 fill-mode-forwards">
            <div className="relative flex flex-col items-center justify-center z-10">
              <div className="animate-float-slow">
                <div className="w-28 h-28 bg-white rounded-[2.8rem] flex items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.3)] mb-8 animate-pop-in">
                  <MapPin className="w-14 h-14 text-[#1E5BFF] fill-[#1E5BFF]" />
                </div>
              </div>
              <div className="text-center relative">
                <h1 className="text-6xl font-black font-display animate-slide-up tracking-tighter drop-shadow-2xl">Localizei</h1>
                <div className="flex items-center justify-center gap-3 mt-3 animate-tracking-expand opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
                  <div className="h-[1.5px] w-6 bg-white/40"></div>
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/80">Freguesia</span>
                  <div className="h-[1.5px] w-6 bg-white/40"></div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5">
              <div className="h-full bg-white shadow-[0_0_25px_rgba(255,255,255,1)] transition-all duration-[5000ms] ease-linear" style={{ width: `${splashProgress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
