
import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Header } from './Header';
import { HomeFeed } from './HomeFeed';
import { ExploreView } from './ExploreView';
import { StoreDetailView } from './StoreDetailView';
import { CashbackView } from './CashbackView';
import { CashbackInfoView } from './CashbackInfoView';
import { RewardDetailsView } from './RewardDetailsView';
import { AuthModal } from './AuthModal';
import { MenuView } from './MenuView';
import { PatrocinadorMasterScreen } from './PatrocinadorMasterScreen';
import { CashbackScanScreen } from './CashbackScanScreen';
import { ScanConfirmationScreen } from './ScanConfirmationScreen';
import { CashbackPaymentScreen } from './CashbackPaymentScreen';
import { PrizeHistoryView } from './PrizeHistoryView';
import { FreguesiaConnectPublic } from './FreguesiaConnectPublic';
import { FreguesiaConnectDashboard } from './FreguesiaConnectDashboard';
import { FreguesiaConnectRestricted } from './FreguesiaConnectRestricted';
import { ServicesView } from './ServicesView';
import { SubcategoriesView } from './SubcategoriesView';
import { SpecialtiesView } from './SpecialtiesView';
import { ServiceSuccessView } from './ServiceSuccessView';
import { ServiceTermsView } from './ServiceTermsView';
import { QuoteRequestModal } from './QuoteRequestModal';
import { StoreAreaView } from './StoreAreaView';
import { MerchantQrScreen } from './MerchantQrScreen';
import { MapPin, Crown, Info, TriangleAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Category, Store, AdType, EditorialCollection } from '../types';
import { getStoreLogo } from '../utils/mockLogos';
import { CategoriaAlimentacao } from './CategoriaAlimentacao';
import { CategoryView } from './CategoryView';
import { EditorialListView } from './EditorialListView';
import { AuthCallbackPage } from './AuthCallbackPage'; 
import { SpinWheelAdminDashboard } from './SpinWheelAdminDashboard'; 
import { MerchantPayRoute } from './MerchantPayRoute'; 
import { MerchantPanel } from './MerchantPanel'; 
import { MerchantCashbackRequests } from './MerchantCashbackRequests'; 
import { StoreProfileEdit } from './StoreProfileEdit'; 
import { StoreFinanceModule } from './StoreFinanceModule'; 
import { StoreSupportModule } from './StoreSupportModule'; 
import { StoreCashbackModule } from './StoreCashbackModule'; 
import { StoreAdsModule } from './StoreAdsModule'; 
import { StoreHighlightsView } from './StoreHighlightsView'; 
import { SearchStores } from './SearchStores'; 
import { FavoritesView, AboutView, SupportView, InviteFriendView, SponsorInfoView } from './SimplePages'; 
import { EditProfileView } from './EditProfileView'; 
import { BusinessRegistrationFlow } from './BusinessRegistrationFlow'; 
import { CashbackLandingView } from './CashbackLandingView'; 
import { UserCashbackFlow } from './UserCashbackFlow'; 
import { MarketplaceView } from './MarketplaceView'; 
import { StoreCategoryView } from './StoreCategoryView'; 


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
    id: 'premium-test',
    name: 'Padaria Imperial',
    category: 'Alimentação',
    description: 'O melhor pão quentinho e café artesanal da Freguesia. Venha conferir!',
    logoUrl: getStoreLogo(8),
    rating: 4.9,
    reviewsCount: 450,
    distance: 'Freguesia • RJ',
    cashback: 10,
    adType: AdType.PREMIUM,
    subcategory: 'Padaria',
    address: 'Estrada dos Três Rios, 1000',
    phone: '(21) 98888-2222',
    verified: true,
  },
];

const App: React.FC = () => {
  const { user, userRole, loading: isAuthLoading } = useAuth();
  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // 1. Inicia animação da barra de progresso imediatamente
    const animationFrame = requestAnimationFrame(() => {
      setSplashProgress(100);
    });

    // 2. Trava o splash por exatamente 5 segundos (Obrigatório)
    const timer = setTimeout(() => {
      setMinSplashTimeElapsed(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authContext, setAuthContext] = useState<'default' | 'merchant_lead_qr'>('default');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<EditorialCollection | null>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [scannedData, setScannedData] = useState<{ merchantId: string; storeId: string } | null>(null);

  // States for Services Flow
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [selectedServiceSub, setSelectedServiceSub] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const handleCashbackClick = () => {
    if (user) setActiveTab('qrcode_scan');
    else setIsAuthOpen(true);
  };

  // NEW: Check if the current path is for the OAuth callback
  const isOAuthCallback = window.location.pathname === '/auth/callback';

  // O app só é liberado se o carregamento do Supabase terminou E o tempo mínimo de 5s passou
  // E NÃO for a página de callback do OAuth
  const isAppReady = !isAuthLoading && minSplashTimeElapsed && !isOAuthCallback;

  // NEW: If it's the OAuth callback path, render the AuthCallbackPage immediately
  if (isOAuthCallback) {
    return <AuthCallbackPage />;
  }

  if (!isAppReady) {
    return (
      <div className="fixed inset-0 bg-[#1E5BFF] flex flex-col items-center justify-center text-white z-[999] overflow-hidden">
        {/* ELEMENTO CRÍTICO: LOGO PRINCIPAL */}
        <div className="relative flex flex-col items-center justify-center z-10">
          <div className="animate-float">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 animate-pop-in">
              <MapPin className="w-12 h-12 text-[#1E5BFF] fill-[#1E5BFF]" />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-black font-display animate-slide-up tracking-tighter drop-shadow-md">
              Localizei
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2 animate-tracking-expand opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
              <div className="h-[1px] w-4 bg-blue-300"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200">Freguesia</span>
              <div className="h-[1px] w-4 bg-blue-300"></div>
            </div>
          </div>
        </div>

        {/* ELEMENTO CRÍTICO DE MONETIZAÇÃO: PATROCINADOR MASTER NO SPLASH */}
        <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center px-10 z-10 opacity-0 [animation-delay:1200ms] [animation-fill-mode:forwards] animate-sponsor-spin-in">
          <p className="text-[8px] font-black text-blue-100 uppercase tracking-[0.4em] mb-4 text-center animate-soft-pulse">
            Patrocinador Master
          </p>
          <div className="animate-sponsor-float w-full max-w-[280px]">
            <div className="bg-white/10 backdrop-blur-2xl px-6 py-5 rounded-[2.5rem] border-2 border-white/30 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-sponsor-logo-pulse shrink-0">
                <Crown className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="flex flex-col text-left">
                <p className="font-black text-xl tracking-tight text-white leading-none">Grupo Esquematiza</p>
                <p className="text-[10px] font-bold text-blue-100 uppercase mt-1 tracking-wider">Segurança & Facilities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso Real de 5 Segundos */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
           <div 
             className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-[5000ms] ease-linear" 
             style={{ width: `${splashProgress}%` }} 
           />
        </div>
      </div>
    );
  }

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab(category.slug === 'food' ? 'food_category' : 'category_detail');
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
    'store_area', 'merchant_qr', 'editorial_list',
    'category_detail', 'food_category', 'store_detail', 'profile', 
    'patrocinador_master', 'prize_history', 'reward_details', 
    'freguesia_connect_public', 'freguesia_connect_dashboard', 'freguesia_connect_restricted',
    'service_subcategories', 'service_specialties', 'service_terms', 'service_success',
    'spin_wheel_admin_dashboard', 'edit_profile', 'merchant_panel', 'merchant_requests',
    'store_profile', 'store_finance', 'store_support', 'store_cashback_module', 'store_ads_module',
    'about', 'support', 'invite_friend', 'cashback_info', 'user_cashback_flow', 'merchant_pay_route',
    'business_registration_flow', 'marketplace_view', 'store_highlights_view', 'search_stores',
  ];

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center transition-colors duration-300 relative">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onCashbackClick={handleCashbackClick}>
          {!headerExclusionList.includes(activeTab) && (
            <Header
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onAuthClick={() => setIsAuthOpen(true)} 
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
                stores={MOCK_STORES}
                searchTerm={globalSearch}
                user={user as any}
                userRole={userRole}
                onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }}
                onRequireLogin={() => setIsAuthOpen(true)}
                merchantId={null} 
              />
            )}
            {activeTab === 'explore' && (
              <ExploreView 
                stores={MOCK_STORES} 
                searchQuery={globalSearch} 
                onStoreClick={handleSelectStore} 
                onLocationClick={() => {}} 
                onFilterClick={() => {}} 
                onOpenPlans={() => {}} 
                onViewMasterSponsor={() => setActiveTab('patrocinador_master')}
              />
            )}
            {activeTab === 'search_stores' && (
                <SearchStores onStoreClick={handleSelectStore} />
            )}
            {activeTab === 'editorial_list' && selectedCollection && (
              <EditorialListView
                collection={selectedCollection}
                stores={MOCK_STORES}
                onBack={() => { setActiveTab('home'); setSelectedCollection(null); }}
                onStoreClick={handleSelectStore}
              />
            )}
            {activeTab === 'services' && (
              <ServicesView 
                onSelectMacro={(id, name) => {
                  setSelectedServiceMacro({id, name});
                  if (id === 'emergency') {
                    setQuoteCategory(name);
                    setIsQuoteModalOpen(true);
                  } else {
                    setActiveTab('service_subcategories');
                  }
                }} 
                onOpenTerms={() => setActiveTab('service_terms')}
                onNavigate={setActiveTab}
                searchTerm={globalSearch}
              />
            )}
            {activeTab === 'store_area' && (
              userRole === 'lojista' ? (
                <StoreAreaView 
                  onBack={() => setActiveTab('home')} 
                  onNavigate={setActiveTab} 
                  user={user}
                />
              ) : (
                <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />
              )
            )}
            {activeTab === 'merchant_qr' && (
              userRole === 'lojista' ? (
                <MerchantQrScreen 
                  user={user} 
                  onBack={() => setActiveTab('home')} 
                />
              ) : (
                <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />
              )
            )}
             {activeTab === 'category_detail' && selectedCategory && (
              <CategoryView 
                  category={selectedCategory} 
                  onBack={() => { setActiveTab('home'); setSelectedCategory(null); }} 
                  onStoreClick={handleSelectStore}
                  stores={MOCK_STORES}
              />
            )}
            {activeTab === 'food_category' && selectedCategory && (
                <CategoriaAlimentacao 
                    onBack={() => { setActiveTab('home'); setSelectedCategory(null); }}
                    onSelectSubcategory={(sub) => {
                        // Navega para uma lista de lojas filtrada pela subcategoria
                        console.log("Subcategoria selecionada:", sub);
                    }}
                />
            )}
            {activeTab === 'service_subcategories' && selectedServiceMacro && (
              <SubcategoriesView 
                macroId={selectedServiceMacro.id}
                macroName={selectedServiceMacro.name}
                onBack={() => setActiveTab('services')}
                onSelectSubcategory={(subName) => {
                  setSelectedServiceSub(subName);
                  setActiveTab('service_specialties');
                }}
              />
            )}
            {activeTab === 'service_specialties' && selectedServiceSub && (
              <SpecialtiesView 
                subcategoryName={selectedServiceSub}
                onBack={() => setActiveTab('service_subcategories')}
                onSelectSpecialty={(specialty) => {
                  setQuoteCategory(`${selectedServiceSub} - ${specialty}`);
                  setIsQuoteModalOpen(true);
                }}
              />
            )}
            {activeTab === 'service_success' && (
              <ServiceSuccessView
                onViewRequests={() => alert('Navegar para Meus Pedidos')}
                onHome={() => setActiveTab('home')}
              />
            )}
            {activeTab === 'service_terms' && (
              <ServiceTermsView onBack={() => setActiveTab('services')} />
            )}
            {activeTab === 'freguesia_connect_public' && (
                <FreguesiaConnectPublic onBack={() => setActiveTab('home')} onLogin={() => setIsAuthOpen(true)} />
            )}
            {activeTab === 'freguesia_connect_dashboard' && (
                userRole === 'lojista' ? <FreguesiaConnectDashboard onBack={() => setActiveTab('home')} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'freguesia_connect_restricted' && (
                <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'qrcode_scan' && (
                <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} />
            )}
            {activeTab === 'scan_confirmation' && scannedData && (
                <ScanConfirmationScreen storeId={scannedData.storeId} onConfirm={() => setActiveTab('cashback_payment')} onCancel={() => setActiveTab('home')} />
            )}
            {activeTab === 'cashback_payment' && scannedData && (
              <CashbackPaymentScreen user={user as any} merchantId={scannedData.merchantId} storeId={scannedData.storeId} onBack={() => setActiveTab('home')} onComplete={() => setActiveTab('home')} />
            )}
            {activeTab === 'profile' && (
              <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />
            )}
            {activeTab === 'edit_profile' && user && (
              <EditProfileView user={user} onBack={() => setActiveTab('profile')} />
            )}
            {activeTab === 'patrocinador_master' && (
              <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'store_detail' && selectedStore && (
              <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'store_highlights_view' && selectedStore && (
              <StoreHighlightsView store={selectedStore} onBack={() => setActiveTab('store_detail')} />
            )}
            {activeTab === 'store_category_view' && selectedCategory && (
              <StoreCategoryView categoryName={selectedCategory.name} onBack={() => setActiveTab('store_detail')} />
            )}
            {activeTab === 'reward_details' && (
              <RewardDetailsView reward={selectedReward} onBack={() => setActiveTab('home')} onHome={() => setActiveTab('home')} />
            )}
            {activeTab === 'prize_history' && user && (
              <PrizeHistoryView userId={user.id} onBack={() => setActiveTab('home')} onGoToSpinWheel={() => setActiveTab('home')} />
            )}
            {activeTab === 'spin_wheel_admin_dashboard' && userRole === 'lojista' && (
              <SpinWheelAdminDashboard onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'merchant_panel' && userRole === 'lojista' && (
              <MerchantPanel onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'merchant_requests' && userRole === 'lojista' && user && (
              <MerchantCashbackRequests merchantId={user.id} onBack={() => setActiveTab('merchant_panel')} />
            )}
            {activeTab === 'store_profile' && userRole === 'lojista' && (
              <StoreProfileEdit onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'store_finance' && userRole === 'lojista' && (
              <StoreFinanceModule onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'store_support' && userRole === 'lojista' && (
              <StoreSupportModule onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'store_cashback_module' && userRole === 'lojista' && (
              <StoreCashbackModule onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'store_ads_module' && userRole === 'lojista' && (
              <StoreAdsModule onBack={() => setActiveTab('store_area')} />
            )}
            {activeTab === 'about' && (
              <AboutView onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'support' && (
              <SupportView onBack={() => setActiveTab('profile')} />
            )}
            {activeTab === 'invite_friend' && (
              <InviteFriendView onBack={() => setActiveTab('profile')} />
            )}
            {activeTab === 'cashback_info' && (
              <CashbackInfoView onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'user_cashback_flow' && user && (
              <UserCashbackFlow onBack={() => setActiveTab('profile')} />
            )}
            {activeTab === 'merchant_pay_route' && scannedData?.merchantId && user && (
              <MerchantPayRoute 
                merchantId={scannedData.merchantId} 
                user={user} 
                onLogin={() => setIsAuthOpen(true)} 
                onBack={() => setActiveTab('home')} 
                onComplete={() => setActiveTab('home')} 
              />
            )}
            {activeTab === 'business_registration_flow' && (
              <BusinessRegistrationFlow 
                onBack={() => setActiveTab('home')} 
                onComplete={() => setActiveTab('store_area')} 
              />
            )}
            {activeTab === 'marketplace_view' && (
              <MarketplaceView stores={MOCK_STORES} onBack={() => setActiveTab('home')} />
            )}

          </main>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} signupContext={authContext} />
          {isQuoteModalOpen && (
              <QuoteRequestModal 
                  isOpen={isQuoteModalOpen}
                  onClose={() => setIsQuoteModalOpen(false)}
                  categoryName={quoteCategory}
                  onSuccess={() => {
                      setIsQuoteModalOpen(false);
                      setActiveTab('service_success');
                  }}
              />
          )}
        </Layout>
      </div>
    </div>
  );
};

export default App;