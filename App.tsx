
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
import { MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { useConfig } from './contexts/ConfigContext';
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
import { 
  AboutView, 
  SupportView, 
  InviteFriendView, 
  FavoritesView, 
  SponsorInfoView 
} from './components/SimplePages';

let isFirstBootAttempted = false;

const MAIN_TABS = ['home', 'explore', 'qrcode_scan', 'services', 'community_feed'];

const FeatureUnavailable: React.FC<{ onBack: () => void; title: string }> = ({ onBack, title }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-900">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
      <AlertCircle className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title} indisponível</h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Esta funcionalidade foi desativada temporariamente.</p>
    <button onClick={onBack} className="bg-[#1E5BFF] text-white font-bold py-3 px-8 rounded-full">Voltar ao início</button>
  </div>
);

const AppContent: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const { features } = useConfig();
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
    const t1 = setTimeout(() => setSplashStage(1), 400);
    const t2 = setTimeout(() => setSplashStage(2), 1000);
    const t3 = setTimeout(() => setSplashStage(3), 3500);
    const t4 = setTimeout(() => {
        setSplashStage(4);
        isFirstBootAttempted = true;
    }, 4000);
    return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      let isDark = themeMode === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : themeMode === 'dark';
      setIsDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    applyTheme();
    localStorage.setItem('localizei_theme_mode', themeMode);
  }, [themeMode]);

  const handleCashbackClick = () => {
    if (!features.cashbackEnabled) { setActiveTab('cashback_unavailable'); return; }
    if (user) setActiveTab('qrcode_scan');
    else setIsAuthOpen(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, target: e.target };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !MAIN_TABS.includes(activeTab)) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStart.current.x - touchEndX;
    if (Math.abs(deltaX) < minSwipeDistance) return;
    const currentIndex = MAIN_TABS.indexOf(activeTab);
    if (deltaX > 0 && currentIndex < MAIN_TABS.length - 1) setActiveTab(MAIN_TABS[currentIndex + 1]);
    else if (deltaX < 0 && currentIndex > 0) setActiveTab(MAIN_TABS[currentIndex - 1]);
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
    'cashback_unavailable'
  ];

  const hideBottomNav = ['store_ads_module', 'store_detail', 'admin_moderation', 'cashback_unavailable'].includes(activeTab);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center transition-colors duration-300 relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onCashbackClick={handleCashbackClick} hideNav={hideBottomNav}>
          {!headerExclusionList.includes(activeTab) && (
          <Header isDarkMode={isDarkMode} toggleTheme={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole} onOpenMerchantQr={() => setActiveTab('merchant_qr')} />
          )}
          <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
          {activeTab === 'home' && (
              <HomeFeed onNavigate={setActiveTab} onSelectCategory={(cat) => { setSelectedCategory(cat); setActiveTab('category_detail'); }} onSelectCollection={(col) => { setSelectedCollection(col); setActiveTab('editorial_list'); }} onStoreClick={(store) => { setSelectedStore(store); setActiveTab('store_detail'); }} stores={STORES} searchTerm={globalSearch} user={user as any} userRole={userRole} onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }} onRequireLogin={() => setIsAuthOpen(true)} />
          )}
          {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
          {activeTab === 'cashback_unavailable' && <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />}
          {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}
          {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} currentTheme={themeMode} onThemeChange={setThemeMode} />}
          {activeTab === 'store_area' && (userRole === 'lojista' ? <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />)}
          {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => { setActiveTab('home'); setSelectedCategory(null); }} onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} stores={STORES} />}
          {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
          {activeTab === 'qrcode_scan' && (features.cashbackEnabled ? <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} /> : <FeatureUnavailable onBack={() => setActiveTab('home')} title="Cashback" />)}
          {activeTab === 'scan_confirmation' && scannedData && <ScanConfirmationScreen storeId={scannedData.storeId} onConfirm={() => setActiveTab('cashback_payment')} onCancel={() => setActiveTab('home')} />}
          {activeTab === 'cashback_payment' && scannedData && <CashbackPaymentScreen user={user as any} merchantId={scannedData.merchantId} storeId={scannedData.storeId} onBack={() => setActiveTab('home')} onComplete={() => setActiveTab('home')} />}
          {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
          {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
          {activeTab === 'about' && <AboutView onBack={() => setActiveTab('profile')} />}
          {activeTab === 'support' && <SupportView onBack={() => setActiveTab('profile')} />}
          {activeTab === 'invite_friend' && <InviteFriendView onBack={() => setActiveTab('profile')} />}
          {activeTab === 'favorites' && <FavoritesView user={user as any} onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} />}
          </main>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} />
          {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => { setIsQuoteModalOpen(false); setActiveTab('service_success'); }} />}
      </Layout>

      {splashStage < 4 && (
        <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-opacity duration-500 ${splashStage === 3 ? 'animate-app-exit' : ''}`} style={{ backgroundColor: '#1E5BFF' }}>
            <div className="flex flex-col items-center w-full">
                <div className={`w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 transition-all duration-700 ${splashStage >= 1 ? 'animate-logo-enter opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <div className="animate-logo-micro-move"><MapPin className="w-12 h-12 text-[#1E5BFF]" fill="#1E5BFF" /></div>
                </div>
                <div className="relative h-10 flex items-center justify-center w-full px-10">
                   <h1 className={`text-white text-3xl font-black font-display tracking-tight overflow-hidden whitespace-nowrap ${splashStage >= 2 ? 'animate-typewriter border-r-2 border-white' : 'w-0 opacity-0'}`}>
                     Localizei <span className="opacity-80">JPA</span>
                   </h1>
                </div>
                <div className={`mt-12 w-48 h-1 bg-white/20 rounded-full overflow-hidden transition-opacity duration-500 ${splashStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-full bg-white transition-all duration-[3000ms] ease-out" style={{ width: splashStage >= 2 ? '100%' : '0%' }}></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AppContent;
