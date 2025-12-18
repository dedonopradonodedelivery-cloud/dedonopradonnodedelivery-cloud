
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StatusView } from './components/StatusView';
import { MarketplaceView } from './components/MarketplaceView';
import { CategoryView } from './components/CategoryView';
import { CategoriaAlimentacao } from './components/CategoriaAlimentacao';
import { SubcategoryStoreList } from './components/SubcategoryStoreList';
import { StoreDetailView } from './components/StoreDetailView';
import { StoreCategoryView } from './components/StoreCategoryView';
import { CashbackView } from './components/CashbackView';
import { CashbackLandingView } from './components/CashbackLandingView';
import { FreguesiaConnectPublic } from './components/FreguesiaConnectPublic';
import { FreguesiaConnectDashboard } from './components/FreguesiaConnectDashboard';
import { FreguesiaConnectRestricted } from './components/FreguesiaConnectRestricted';
import { RewardDetailsView } from './components/RewardDetailsView';
import { PrizeHistoryView } from './components/PrizeHistoryView';
import { AuthModal } from './components/AuthModal';
import { MerchantLeadModal } from './components/MerchantLeadModal';
import { QuickRegister } from './components/QuickRegister';
import { MenuView } from './components/MenuView';
import { ServicesView } from './components/ServicesView';
import { SubcategoriesView } from './components/SubcategoriesView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { StoreAreaView } from './components/StoreAreaView';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { ServiceSuccessView } from './components/ServiceSuccessView';
import { EditorialListView } from './components/EditorialListView';
import { SupportView, InviteFriendView, AboutView, FavoritesView, SponsorInfoView } from './components/SimplePages';
import { CashbackInfoView } from './components/CashbackInfoView';
import { EditProfileView } from './components/EditProfileView';
import { ServiceTermsView } from './components/ServiceTermsView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { BusinessRegistrationFlow } from './components/BusinessRegistrationFlow';
import { StoreCashbackModule } from './components/StoreCashbackModule';
import { StoreAdsModule } from './components/StoreAdsModule';
import { StoreConnectModule } from './components/StoreConnectModule';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { StoreFinanceModule } from './components/StoreFinanceModule';
import { StoreSupportModule } from './components/StoreSupportModule';
import { MerchantQrScreen } from './components/MerchantQrScreen';
import { CashbackScanScreen } from './components/CashbackScanScreen';
import { ScanConfirmationScreen } from './components/ScanConfirmationScreen';
import { CashbackPaymentScreen } from './components/CashbackPaymentScreen';
import { MerchantCashbackRequests } from './components/MerchantCashbackRequests';
import { MerchantPayRoute } from './components/MerchantPayRoute';
import { CashbackPayFromQrScreen } from './components/CashbackPayFromQrScreen';
import { MerchantPanel } from './components/MerchantPanel';
import { UserCashbackFlow } from './components/UserCashbackFlow';
import { MapPin, Crown } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { useAuth } from './contexts/AuthContext';
import { Category, Store, AdType, EditorialCollection } from './types';
import { getStoreLogo } from './utils/mockLogos';

// =============================
// MOCK DE LOJAS
// =============================
const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'Burger Freguesia',
    category: 'Alimentação',
    description: 'Hambúrgueres artesanais com sabor de bairro.',
    logoUrl: getStoreLogo(1),
    rating: 4.8,
    reviewsCount: 124,
    distance: 'Freguesia • RJ',
    cashback: 5,
    adType: AdType.ORGANIC,
    subcategory: 'Hamburgueria',
    address: 'Rua Tirol, 1245 - Freguesia',
    phone: '(21) 99999-1111',
    hours: 'Seg a Dom • 11h às 23h',
    verified: true,
  },
  {
    id: '2',
    name: 'Padaria do Vale',
    category: 'Alimentação',
    description: 'Pães fresquinhos e café da manhã completo.',
    logoUrl: getStoreLogo(2),
    rating: 4.6,
    reviewsCount: 87,
    distance: 'Freguesia • RJ',
    cashback: 3,
    adType: AdType.PREMIUM,
    subcategory: 'Padaria',
    address: 'Estrada dos Três Rios, 800 - Freguesia',
    phone: '(21) 98888-2222',
    hours: 'Todos os dias • 6h às 21h',
    verified: true,
  },
];

const App: React.FC = () => {
  const { user, userRole, loading: isAuthLoading } = useAuth();
  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Timer de 5 segundos (5000ms) para o Splash
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashTimeElapsed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Auth States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authContext, setAuthContext] = useState<'default' | 'merchant_lead_qr'>('default');
  const [isMerchantLeadModalOpen, setIsMerchantLeadModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<EditorialCollection | null>(null);
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{ id: string; name: string } | null>(null);
  const [selectedServiceSubcategory, setSelectedServiceSubcategory] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategoryName, setQuoteCategoryName] = useState('');
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [scannedData, setScannedData] = useState<{ merchantId: string; storeId: string } | null>(null);
  const [deepLinkMerchantId, setDeepLinkMerchantId] = useState<string | null>(null);
  const [qrMerchantId, setQrMerchantId] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [sponsorOrigin, setSponsorOrigin] = useState<string | null>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleOpenAuth = (context: 'default' | 'merchant_lead_qr' = 'default') => {
    setAuthContext(context);
    setIsAuthOpen(true);
  };

  const handleHeaderProfileClick = () => {
    if (user) setActiveTab('profile');
    else handleOpenAuth('default');
  };

  const handleCashbackClick = () => {
    if (user) setActiveTab('qrcode_scan');
    else handleOpenAuth('default');
  };

  const isServiceTab = activeTab === 'services';
  const currentSearchTerm = isServiceTab ? serviceSearch : globalSearch;
  const handleSearchChange = (val: string) => {
    if (isServiceTab) setServiceSearch(val);
    else setGlobalSearch(val);
  };

  const searchPlaceholder = isServiceTab
    ? 'Buscar serviços, categorias ou especialidades...'
    : 'Buscar lojas, produtos, serviços...';

  useEffect(() => {
    if (user && isAuthOpen) setIsAuthOpen(false);
    if (!user && !isAuthLoading) {
        const protectedTabs = ['store_area', 'favorites', 'edit_profile', 'merchant_panel', 'qrcode_scan', 'scan_confirmation', 'cashback_payment'];
        if (protectedTabs.includes(activeTab)) setActiveTab('home');
    }
  }, [user, userRole, isAuthLoading, isAuthOpen, activeTab]);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    if (category.slug === 'food') setActiveTab('food_category');
    else setActiveTab('category_detail');
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setActiveTab('store_detail');
  };

  // DETERMINA SE O SPLASH DEVE ESTAR VISÍVEL
  // Regra: Enquanto o Auth estiver carregando OU o tempo de 5s não tiver passado
  const isAppReady = !isAuthLoading && minSplashTimeElapsed;

  if (!isAppReady) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#2D6DF6] to-[#1B54D9] flex flex-col items-center justify-center text-white z-[999]">
        <div className="relative flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4 animate-pop-in">
            <MapPin className="w-8 h-8 text-[#2D6DF6] fill-[#2D6DF6]" />
          </div>
          <div className="text-4xl font-bold font-display animate-slide-up [animation-fill-mode:forwards]">
            Localizei
          </div>
          <div className="text-xs font-light uppercase mt-2 animate-tracking-expand opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
            Freguesia
          </div>
        </div>
        <div className="mt-16 text-center animate-fade-in opacity-0 [animation-delay:1500ms] [animation-fill-mode:forwards]">
          <p className="text-[9px] opacity-70 uppercase tracking-wider mb-1">
            Patrocinador Master
          </p>
          <div className="bg-white/10 backdrop-blur-sm px-5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
            <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 drop-shadow-md" />
            <p className="font-bold text-base tracking-wide text-white drop-shadow-sm">
              Grupo Esquematiza
            </p>
          </div>
        </div>
        {/* Loader discreto indicando progresso dos 5s */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
           <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/40 transition-all duration-[5000ms] ease-linear"
                style={{ width: minSplashTimeElapsed ? '100%' : '0%' }}
              />
           </div>
        </div>
      </div>
    );
  }

  // List of tabs where the main header should be hidden
  const hideHeader = [
    'category_detail', 'food_category', 'subcategory_store_list', 'verified_stores', 'store_detail', 'store_category', 'cashback', 'cashback_landing', 'cashback_info', 'profile', 'store_area', 'store_cashback_module', 'store_ads_module', 'store_connect', 'store_profile', 'store_finance', 'store_support', 'service_subcategories', 'service_specialties', 'service_success', 'service_terms', 'editorial_list', 'freguesia_connect_public', 'freguesia_connect_dashboard', 'freguesia_connect_restricted', 'reward_details', 'prize_history', 'support', 'invite_friend', 'about', 'favorites', 'become_sponsor', 'edit_profile', 'patrocinador_master', 'business_registration', 'merchant_qr', 'qrcode_scan', 'scan_confirmation', 'cashback_payment', 'merchant_requests', 'merchant_pay_route', 'cashback_pay_qr', 'merchant_panel', 'user_cashback_flow',
  ].includes(activeTab);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center transition-colors duration-300 relative">
        <Layout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userRole={userRole} 
            onCashbackClick={handleCashbackClick} 
        >
          {!hideHeader && (
            <Header
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onAuthClick={handleHeaderProfileClick}
              user={user}
              searchTerm={currentSearchTerm}
              onSearchChange={handleSearchChange}
              onNavigate={setActiveTab}
              activeTab={activeTab}
              userRole={userRole}
              onOpenMerchantQr={() => setActiveTab('merchant_qr')}
              customPlaceholder={searchPlaceholder}
              onSelectCategory={handleSelectCategory}
            />
          )}

          <main className="animate-in fade-in duration-500">
            {activeTab === 'home' && (
              <HomeFeed
                onNavigate={(view) => {
                  if (view === 'patrocinador_master') setSponsorOrigin('home');
                  setActiveTab(view);
                }}
                onSelectCategory={handleSelectCategory}
                onSelectCollection={setSelectedCollection}
                onStoreClick={handleSelectStore}
                stores={MOCK_STORES}
                searchTerm={globalSearch}
                user={user as any}
                userRole={userRole}
                onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }}
                onRequireLogin={() => handleOpenAuth('default')}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreView
                stores={MOCK_STORES}
                searchQuery={globalSearch}
                onStoreClick={handleSelectStore}
                onLocationClick={() => {}}
                onFilterClick={() => {}}
                onOpenPlans={() => setActiveTab('become_sponsor')}
                onViewAllVerified={() => setActiveTab('verified_stores')}
              />
            )}

            {activeTab === 'qrcode_scan' && (
                <CashbackScanScreen 
                    onBack={() => setActiveTab('home')} 
                    onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} 
                />
            )}

            {activeTab === 'scan_confirmation' && scannedData && (
                <ScanConfirmationScreen 
                    storeId={scannedData.storeId}
                    onConfirm={() => setActiveTab('cashback_payment')}
                    onCancel={() => setActiveTab('home')}
                />
            )}

            {activeTab === 'cashback_payment' && scannedData && (
              <CashbackPaymentScreen
                user={user as any}
                merchantId={scannedData.merchantId}
                storeId={scannedData.storeId}
                onBack={() => setActiveTab('home')}
                onComplete={(tx) => { setLastTransaction(tx); setActiveTab('cashback'); }}
              />
            )}

            {activeTab === 'profile' && (
              <MenuView
                user={user as any}
                userRole={userRole}
                onAuthClick={() => handleOpenAuth('default')}
                onNavigate={setActiveTab}
              />
            )}
            
            {activeTab === 'cashback_info' && (
              <CashbackInfoView
                user={user as any}
                userRole={userRole}
                onBack={() => setActiveTab('home')}
                onLogin={() => handleOpenAuth('default')}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'patrocinador_master' && (
              <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'store_detail' && selectedStore && (
              <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'reward_details' && (
              <RewardDetailsView reward={selectedReward} onBack={() => setActiveTab('home')} onHome={() => setActiveTab('home')} />
            )}

            {/* Renderizar outros componentes conforme necessário */}
          </main>

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            user={user as any}
            signupContext={authContext}
          />
        </Layout>
      </div>
    </div>
  );
};

export default App;
