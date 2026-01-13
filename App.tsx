
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
import { MapPin, ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
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
import { AdminModerationPanel } from './components/AdminModerationPanel';
import { AdminConfigPanel } from './components/AdminConfigPanel';
import { 
  AboutView, 
  SupportView, 
  InviteFriendView, 
  FavoritesView, 
  SponsorInfoView 
} from './components/SimplePages';

// Global para persistência entre ciclos de vida se necessário
let isFirstBootAttempted = false;

// Tabs that support horizontal swipe navigation (Main Bottom Bar Tabs)
const MAIN_TABS = ['home', 'explore', 'qrcode_scan', 'services', 'community_feed'];

const FeatureUnavailable: React.FC<{ onBack: () => void; title: string }> = ({ onBack, title }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900 animate-in fade-in duration-300">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
      <AlertCircle className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title} indisponível</h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xs font-medium">
      Esta funcionalidade foi desativada temporariamente. Tente novamente mais tarde.
    </p>
    <button onClick={onBack} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform">
      Voltar ao início
    </button>
  </div>
);

const AppContent: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const { features } = useConfig();
  
  // UX ENGINEER: Detecta se estamos voltando de um login com Google (OAuth)
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [splashStage, setSplashStage] = useState(isFirstBootAttempted || isAuthReturn ? 4 : 0);
  
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('localizei_theme_mode') as ThemeMode) || 'light');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'auto') applyTheme();
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const handleCashbackClick = () => {
    if (!features.cashbackEnabled) {
      setActiveTab('cashback_unavailable');
      return;
    }
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

  const isHorizontalScroll = (target: Element | null): boolean => {
    if (!target) return false;
    if (target.id === 'root') return false;
    const style = window.getComputedStyle(target);
    const overflowX = style.getPropertyValue('overflow-x');
    if ((overflowX === 'auto' || overflowX === 'scroll') && target.scrollWidth > target.clientWidth) {
      return true;
    }
    return isHorizontalScroll(target.parentElement);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, target: e.target };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    if (!MAIN_TABS.includes(activeTab)) return;
    if (['INPUT', 'TEXTAREA'].includes((document.activeElement as Element)?.tagName)) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStart.current.x - touchEndX;
    const deltaY = touchStart.current.y - touchEndY;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < minSwipeDistance) return;
    if (isHorizontalScroll(touchStart.current.target as Element)) return;
    const currentIndex = MAIN_TABS.indexOf(activeTab);
    if (deltaX > 0) {
      if (currentIndex < MAIN_TABS.length - 1) {
        const nextTab = MAIN_TABS[currentIndex + 1];
        if (nextTab === 'qrcode_scan') handleCashbackClick();
        else setActiveTab(nextTab);
      }
    } else {
      if (currentIndex > 0) {
        const prevTab = MAIN_TABS[currentIndex - 1];
        if (prevTab === 'qrcode_scan') handleCashbackClick();
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
    'weekly_promo', 'jobs_list', 'merchant_jobs', 'community_feed', 'admin_moderation', 'admin_config',
    'cashback_unavailable', 'jobs_unavailable', 'promo_unavailable', 'agency_unavailable'
  ];

  // A aba 'profile' (Menu) foi removida desta lista para garantir que a BottomBar continue visível
  const hideBottomNav = [
    'store_ads_module', 'store_detail', 'admin_moderation', 'admin_config',
    'cashback_unavailable', 'jobs_unavailable', 'promo_unavailable', 'agency_unavailable'
  ].includes(activeTab);

  return (
    <div 
      className="min-h-screen bg-white dark:bg-gray-900 flex justify-center transition-colors duration-300 relative"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={userRole} 
          onCashbackClick={handleCashbackClick}
          hideNav={hideBottomNav}
      >
          {!headerExclusionList.includes(activeTab) && (
          <Header
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onAuthClick={() => setActiveTab('profile')} 
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
          
          {/* GUARDS FOR FEATURE FLAGS */}
          {activeTab === 'cashback_unavailable' && <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />}
          {activeTab === 'jobs_unavailable' && <FeatureUnavailable onBack={() => setActiveTab('home')} title="Mural de Vagas" />}
          {activeTab === 'promo_unavailable' && <FeatureUnavailable onBack={() => setActiveTab('home')} title="Promoções" />}
          {activeTab === 'agency_unavailable' && <FeatureUnavailable onBack={() => setActiveTab('home')} title="Agência" />}

          {activeTab === 'user_statement' && (
              features.cashbackEnabled ? 
                <UserStatementView onBack={() => setActiveTab('profile')} onExploreStores={() => setActiveTab('explore')} balance={12.40} /> :
                <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />
          )}
          
          {activeTab === 'weekly_promo' && (
              features.couponsEnabled ? 
                <WeeklyPromoModule onBack={() => setActiveTab('store_area')} /> :
                <FeatureUnavailable onBack={() => setActiveTab('store_area')} title="Promoções" />
          )}

          {activeTab === 'jobs_list' && (
              features.jobsEnabled ? 
                <JobsView onBack={() => setActiveTab('home')} /> :
                <FeatureUnavailable onBack={() => setActiveTab('home')} title="Vagas" />
          )}

          {activeTab === 'merchant_jobs' && (
              features.jobsEnabled ? 
                <MerchantJobsModule onBack={() => setActiveTab('store_area')} /> :
                <FeatureUnavailable onBack={() => setActiveTab('store_area')} title="Vagas" />
          )}

          {activeTab === 'merchant_cashback_onboarding' && (
              features.cashbackEnabled ? 
                <MerchantCashbackOnboarding onBack={() => setActiveTab('home')} onActivate={() => setActiveTab('store_cashback_module')} /> :
                <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />
          )}
          
          {activeTab === 'merchant_cashback_dashboard' && (
               features.cashbackEnabled ? 
                <MerchantCashbackDashboard onBack={() => setActiveTab('home')} onNavigate={setActiveTab} /> :
                <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />
          )}
          
          {activeTab === 'store_cashback_module' && (
              features.cashbackEnabled ? 
                <StoreCashbackModule onBack={() => setActiveTab('home')} /> :
                <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />
          )}

          {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} />}
          {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
          {activeTab === 'store_finance' && <StoreFinanceModule onBack={() => setActiveTab('store_area')} />}
          
          {activeTab === 'community_feed' && (
              <CommunityFeedView 
                  onStoreClick={handleSelectStore} 
                  user={user as any}
                  onRequireLogin={() => setIsAuthOpen(true)}
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
          {activeTab === 'admin_moderation' && <AdminModerationPanel onBack={() => setActiveTab('profile')} />}
          
          {activeTab === 'admin_config' && (
              userRole === 'admin' ? 
                <AdminConfigPanel onBack={() => setActiveTab('profile')} /> : 
                <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acesso Restrito</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs text-sm font-medium">
                        Você não tem permissão para acessar as configurações remotas do sistema.
                    </p>
                    <button onClick={() => setActiveTab('home')} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform">Voltar ao início</button>
                </div>
          )}

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
          
          {activeTab === 'qrcode_scan' && (
              features.cashbackEnabled ? 
                <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} /> :
                <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />
          )}

          {activeTab === 'scan_confirmation' && scannedData && <ScanConfirmationScreen storeId={scannedData.storeId} onConfirm={() => setActiveTab('cashback_payment')} onCancel={() => setActiveTab('home')} />}
          {activeTab === 'cashback_payment' && scannedData && <CashbackPaymentScreen user={user as any} merchantId={scannedData.merchantId} storeId={scannedData.storeId} onBack={() => setActiveTab('home')} onComplete={() => setActiveTab('home')} />}
          
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

      {splashStage < 4 && (
        <div 
            className={`fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-500 ${splashStage === 3 ? 'animate-app-exit' : ''}`}
            style={{ backgroundColor: '#1E5BFF' }} 
        >
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NeighborhoodProvider>
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </NeighborhoodProvider>
  );
};

export default App;
