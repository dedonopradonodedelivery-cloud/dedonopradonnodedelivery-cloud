
import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Header } from './Header';
import { HomeFeed } from './HomeFeed';
import { ExploreView } from './ExploreView';
import { StoreDetailView } from './StoreDetailView';
import { AuthModal } from './AuthModal';
import { MenuView } from './MenuView';
import { PatrocinadorMasterScreen } from './PatrocinadorMasterScreen';
import { ServicesView } from './ServicesView';
import { SubcategoriesView } from './SubcategoriesView';
import { SpecialtiesView } from './SpecialtiesView';
import { ServiceSuccessView } from './ServiceSuccessView';
import { QuoteRequestModal } from './QuoteRequestModal';
import { StoreAreaView } from './StoreAreaView';
import { WeeklyPromoModule } from './WeeklyPromoModule';
import { JobsView } from './JobsView';
import { AdminPanel } from './AdminPanel'; 
import { UserWalletView } from './UserWalletView';
import { CashbackScanScreen } from './CashbackScanScreen';
import { CashbackPaymentScreen } from './CashbackPaymentScreen';
import { MerchantCashbackDashboard } from './MerchantCashbackDashboard';
import { MerchantQrScreen } from './MerchantQrScreen';
import { MerchantCashbackOnboarding } from './MerchantCashbackOnboarding';
import { CommunityFeedView } from './CommunityFeedView';
import { CategoryView } from './CategoryView';
import { StoreAdsModule } from './StoreAdsModule';
import { StoreProfileEdit } from './StoreProfileEdit';
import { useAuth } from '../contexts/AuthContext';
import { NeighborhoodProvider } from '../contexts/NeighborhoodContext';
import { STORES } from '../constants';
import { Category, Store } from '../types';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const App: React.FC = () => {
  const { user, userRole, loading: isAuthLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [scanData, setScanData] = useState<{ merchantId: string; storeId: string } | null>(null);
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Estado de Onboarding do Lojista (Persistido no LocalStorage)
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => 
    localStorage.getItem('onboarding_cashback_completed') === 'true'
  );

  // Sincronizar estado de onboarding se o perfil do usuário já trouxer essa info
  useEffect(() => {
    if (userRole === 'lojista' && user?.user_metadata?.onboarding_cashback_completed) {
      setOnboardingCompleted(true);
      localStorage.setItem('onboarding_cashback_completed', 'true');
    }
  }, [user, userRole]);

  // Gatilho de Login para áreas restritas
  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
    
    const restrictedTabs = ['scan_cashback', 'merchant_qr_display', 'wallet', 'pay_cashback', 'store_area', 'admin_panel'];
    
    if (restrictedTabs.includes(activeTab) && !user && !isAuthLoading) {
      setIsAuthOpen(true);
    }
  }, [activeTab, user, isAuthLoading]);

  const handleSelectStore = (store: Store) => { 
    setSelectedStore(store); 
    setActiveTab('store_detail'); 
  };

  const headerExclusionList = [
    'merchant_onboarding', 'merchant_qr_display', 'wallet', 'scan_cashback', 
    'pay_cashback', 'merchant_cashback_dashboard', 'store_area', 'profile', 
    'admin_panel'
  ];
  
  const hideBottomNav = [
    'merchant_onboarding', 'pay_cashback', 'scan_cashback', 
    'merchant_cashback_dashboard', 'admin_panel'
  ].includes(activeTab);

  const renderHome = () => (
    <HomeFeed 
      onNavigate={setActiveTab} 
      onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} 
      onSelectCollection={() => {}} 
      onStoreClick={handleSelectStore} 
      stores={STORES} 
      searchTerm={globalSearch} 
      user={user as any} 
      onRequireLogin={() => setIsAuthOpen(true)} 
    />
  );

  const renderContent = () => {
    // Caso de carregamento inicial do Auth
    if (isAuthLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
          <Loader2 className="w-10 h-10 text-[#1E5BFF] animate-spin mb-4" />
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sincronizando...</p>
        </div>
      );
    }

    // Proteção contra acesso deslogado em rotas sensíveis
    const restrictedTabs = ['scan_cashback', 'merchant_qr_display', 'wallet', 'pay_cashback', 'store_area', 'admin_panel'];
    if (restrictedTabs.includes(activeTab) && !user) {
      return renderHome();
    }

    switch (activeTab) {
      case 'home':
        return renderHome();

      case 'scan_cashback':
        return (
          <CashbackScanScreen 
            onBack={() => setActiveTab('home')} 
            onScanSuccess={(data) => { 
              setScanData({ merchantId: data.id, storeId: data.id }); 
              setActiveTab('pay_cashback'); 
            }} 
          />
        );

      case 'merchant_qr_display':
        // Fluxo específico do Lojista para o botão central "QR Code"
        if (userRole === 'lojista') {
          if (!onboardingCompleted) {
            return (
              <MerchantCashbackOnboarding 
                onBack={() => setActiveTab('home')} 
                onActivate={() => { 
                  setOnboardingCompleted(true); 
                  localStorage.setItem('onboarding_cashback_completed', 'true');
                  // Após ativar, o próprio componente pode redirecionar ou forçamos re-render
                  setActiveTab('merchant_qr_display'); 
                }} 
              />
            );
          }
          return <MerchantQrScreen onBack={() => setActiveTab('home')} user={user} />;
        }
        // Se por erro de navegação um cliente cair aqui, volta pra home
        return renderHome();

      case 'wallet':
        return <UserWalletView userId={user!.id} onBack={() => setActiveTab('profile')} onStoreClick={(id) => { const s = STORES.find(st => st.id === id); if(s) handleSelectStore(s); }} onScanClick={() => setActiveTab('scan_cashback')} />;

      case 'pay_cashback':
        if (!scanData) return renderHome();
        return <CashbackPaymentScreen user={user as any} merchantId={scanData.merchantId} storeId={scanData.storeId} onBack={() => setActiveTab('scan_cashback')} onComplete={() => setActiveTab('wallet')} />;

      case 'community_feed':
        return <CommunityFeedView user={user as any} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />;

      case 'profile':
        return <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />;

      case 'explore':
        return <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />;

      case 'category_detail':
        return selectedCategory ? <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={() => {}} /> : renderHome();

      case 'store_detail':
        return selectedStore ? <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} onPay={() => setActiveTab('scan_cashback')} /> : renderHome();

      case 'services':
        return <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />;

      case 'store_area':
        return <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} />;

      case 'admin_panel':
        if (user?.email !== ADMIN_EMAIL) return renderHome();
        return <AdminPanel user={user as any} onLogout={signOut} viewMode="ADM" onOpenViewSwitcher={() => {}} onNavigateToApp={() => setActiveTab('home')} />;

      default:
        return renderHome();
    }
  };

  return (
    <NeighborhoodProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center relative">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav}>
            {!headerExclusionList.includes(activeTab) && (
              <Header isDarkMode={false} toggleTheme={() => {}} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} />
            )}

            <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto h-full">
              {renderContent()}
            </main>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={() => setIsAuthOpen(false)} />
            {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => setActiveTab('home')} />}
        </Layout>
      </div>
    </NeighborhoodProvider>
  );
};

export default App;
