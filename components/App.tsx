
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

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

const App: React.FC = () => {
  const { user, userRole, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [scanData, setScanData] = useState<{ merchantId: string; storeId: string } | null>(null);
  const [inspectedUserId, setInspectedUserId] = useState<string | null>(null);
  const [inspectedStore, setInspectedStore] = useState<Store | null>(null);
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Regra de Onboarding (Persistente no Navegador)
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => 
    localStorage.getItem('onboarding_cashback_completed') === 'true'
  );

  // GATEKEEPER: Validação de Rotas e Segurança de Fluxo
  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
    
    // 1. Interceptação de Ferramentas do Lojista
    // Se o lojista tenta acessar Meu QR ou Dashboard sem ver o vídeo
    const merchantToolRoutes = ['merchant_qr_display', 'merchant_cashback_dashboard'];
    if (merchantToolRoutes.includes(activeTab) && userRole === 'lojista' && !onboardingCompleted) {
      setActiveTab('merchant_onboarding');
    }

    // 2. Proteção contra rotas inexistentes (Fallback de Sanidade)
    const validRoutes = [
      'home', 'community_feed', 'merchant_qr_display', 'scan_cashback', 'profile',
      'explore', 'wallet', 'pay_cashback', 'merchant_cashback_dashboard', 'merchant_onboarding',
      'store_detail', 'category_detail', 'services', 'service_subcategories', 'service_specialties',
      'admin_panel', 'store_area', 'patrocinador_master', 'jobs_list', 'store_ads_module', 'store_profile'
    ];
    
    if (!validRoutes.includes(activeTab)) {
      setActiveTab('home');
    }
  }, [activeTab, userRole, onboardingCompleted]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };

  const headerExclusionList = ['merchant_onboarding', 'merchant_qr_display', 'wallet', 'scan_cashback', 'pay_cashback', 'merchant_cashback_dashboard', 'store_area', 'profile', 'admin_panel'];
  const hideBottomNav = ['merchant_onboarding', 'pay_cashback', 'scan_cashback', 'merchant_cashback_dashboard', 'admin_panel'].includes(activeTab);

  return (
    <NeighborhoodProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center relative">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav}>
            {!headerExclusionList.includes(activeTab) && (
              <Header isDarkMode={false} toggleTheme={() => {}} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} />
            )}

            <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
              
              {/* HOME */}
              {activeTab === 'home' && <HomeFeed onNavigate={setActiveTab} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onSelectCollection={() => {}} onStoreClick={handleSelectStore} stores={STORES} searchTerm={globalSearch} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}

              {/* COMUNIDADE (Botão Fixo) */}
              {activeTab === 'community_feed' && <CommunityFeedView user={user as any} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />}

              {/* SCAN CLIENTE (Botão Fixo para Cliente) */}
              {activeTab === 'scan_cashback' && <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScanData({ merchantId: data.id, storeId: data.id }); setActiveTab('pay_cashback'); }} />}

              {/* QR LOJISTA (Botão Fixo para Lojista) */}
              {activeTab === 'merchant_qr_display' && user && <MerchantQrScreen onBack={() => setActiveTab('home')} user={user} />}

              {/* MENU/PERFIL (Botão Fixo) */}
              {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />}

              {/* ONBOARDING OBRIGATÓRIO PARA LOJISTA */}
              {activeTab === 'merchant_onboarding' && (
                <MerchantCashbackOnboarding 
                  onBack={() => setActiveTab('home')} 
                  onActivate={() => { 
                    setOnboardingCompleted(true); 
                    localStorage.setItem('onboarding_cashback_completed', 'true');
                    setActiveTab('merchant_qr_display'); 
                  }} 
                />
              )}

              {/* FLUXO DE PAGAMENTO */}
              {activeTab === 'pay_cashback' && scanData && <CashbackPaymentScreen user={user as any} merchantId={scanData.merchantId} storeId={scanData.storeId} onBack={() => setActiveTab('scan_cashback')} onComplete={() => setActiveTab('wallet')} />}

              {/* CARTEIRA / HISTÓRICO */}
              {activeTab === 'wallet' && (user || inspectedUserId) && (
                <UserWalletView 
                  userId={inspectedUserId || user?.id || ''} 
                  onBack={() => inspectedUserId ? (setInspectedUserId(null), setActiveTab('admin_panel')) : setActiveTab('profile')} 
                  onStoreClick={(id) => { const s = STORES.find(st => st.id === id); if(s) handleSelectStore(s); }} 
                  onScanClick={() => setActiveTab('scan_cashback')} 
                />
              )}

              {/* OUTRAS TELAS */}
              {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
              {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
              {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={() => {}} />}
              {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} onPay={() => setActiveTab('scan_cashback')} />}
              {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} />}
              {activeTab === 'merchant_cashback_dashboard' && <MerchantCashbackDashboard store={STORES[0]} onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} onNavigate={setActiveTab} />}
              {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode="ADM" onOpenViewSwitcher={() => {}} onNavigateToApp={() => setActiveTab('home')} />}
              {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
              {activeTab === 'jobs_list' && <JobsView onBack={() => setActiveTab('home')} />}

            </main>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={() => setIsAuthOpen(false)} />
            {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => setActiveTab('home')} />}
        </Layout>
      </div>
    </NeighborhoodProvider>
  );
};

export default App;
