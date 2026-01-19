
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
import { MerchantJobsModule } from './MerchantJobsModule';
import { AdminPanel } from './AdminPanel'; 
import { UserWalletView } from './UserWalletView';
import { CashbackScanScreen } from './CashbackScanScreen';
import { CashbackPaymentScreen } from './CashbackPaymentScreen';
import { MerchantCashbackDashboard } from './MerchantCashbackDashboard';
import { MapPin, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NeighborhoodProvider } from '../contexts/NeighborhoodContext';
import { Category, Store, EditorialCollection, ThemeMode } from '../types';
import { CategoryView } from './CategoryView';
import { StoreAdsModule } from './StoreAdsModule';
import { StoreProfileEdit } from './StoreProfileEdit';
import { CommunityFeedView } from './CommunityFeedView';
import { STORES } from '../constants';

const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [viewMode, setViewMode] = useState<RoleMode>('ADM');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);
  
  // Contextos de Inspeção Admin
  const [inspectedUserId, setInspectedUserId] = useState<string | null>(null);
  const [inspectedStore, setInspectedStore] = useState<Store | null>(null);
  const [scanData, setScanData] = useState<{ merchantId: string; storeId: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
  }, [activeTab]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };
  const headerExclusionList = ['wallet', 'scan_cashback', 'pay_cashback', 'merchant_cashback_dashboard', 'wallet', 'scan_cashback', 'pay_cashback', 'store_area', 'editorial_list', 'store_profile', 'category_detail', 'store_detail', 'profile', 'patrocinador_master', 'service_subcategories', 'service_specialties', 'store_ads_module', 'about', 'support', 'favorites', 'community_feed', 'admin_panel'];
  const hideBottomNav = ['pay_cashback', 'scan_cashback', 'merchant_cashback_dashboard', 'pay_cashback', 'scan_cashback', 'store_ads_module', 'store_detail', 'admin_panel'].includes(activeTab);

  return (
    <NeighborhoodProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center relative">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav}>
            {!headerExclusionList.includes(activeTab) && (
              <Header isDarkMode={false} toggleTheme={() => {}} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} viewMode={viewMode} onOpenViewSwitcher={() => {}} />
            )}
            <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
              
              {/* ADMIN PANEL */}
              {activeTab === 'admin_panel' && (
                <AdminPanel 
                    onBack={() => setActiveTab('home')}
                    onInspectMerchant={(merchant) => { 
                        // Transforma dados do DB em interface Store para compatibilidade
                        const mockStore: any = { id: merchant.id, name: merchant.name, category: merchant.category, logoUrl: merchant.logo_url };
                        setInspectedStore(mockStore); 
                        setActiveTab('merchant_cashback_dashboard'); 
                    }}
                    onInspectUser={(id) => { 
                        setInspectedUserId(id); 
                        setActiveTab('wallet'); 
                    }}
                />
              )}

              {activeTab === 'home' && <HomeFeed onNavigate={setActiveTab} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onSelectCollection={() => {}} onStoreClick={handleSelectStore} stores={STORES} searchTerm={globalSearch} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}
              {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
              
              {/* CARTEIRA / SALDO EXCLUSIVO (Com suporte a inspeção ADM) */}
              {activeTab === 'wallet' && (user || inspectedUserId) && (
                <UserWalletView 
                    userId={inspectedUserId || user?.id || ''} 
                    onBack={() => { 
                        if(inspectedUserId) { setInspectedUserId(null); setActiveTab('admin_panel'); } 
                        else setActiveTab('profile'); 
                    }} 
                    onStoreClick={(id) => { const s = STORES.find(st => st.id === id); if(s) handleSelectStore(s); }}
                    onScanClick={() => setActiveTab('scan_cashback')}
                />
              )}

              {activeTab === 'scan_cashback' && <CashbackScanScreen onBack={() => setActiveTab('wallet')} onScanSuccess={(data) => { setScanData(data); setActiveTab('pay_cashback'); }} />}
              {activeTab === 'pay_cashback' && scanData && <CashbackPaymentScreen user={user as any} merchantId={scanData.merchantId} storeId={scanData.storeId} onBack={() => setActiveTab('scan_cashback')} onComplete={() => setActiveTab('wallet')} />}
              
              {/* DASHBOARD LOJISTA (Com suporte a inspeção ADM) */}
              {activeTab === 'merchant_cashback_dashboard' && (STORES[0] || inspectedStore) && (
                <MerchantCashbackDashboard 
                    store={inspectedStore || STORES[0]} 
                    onBack={() => { 
                        if(inspectedStore) { setInspectedStore(null); setActiveTab('admin_panel'); } 
                        else setActiveTab('store_area'); 
                    }} 
                />
              )}

              {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />}
              {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />}
              {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
              {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={setAdCategoryTarget} />}
              {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} onPay={() => setActiveTab('scan_cashback')} />}
              {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} />}
            </main>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={() => setIsAuthOpen(false)} />
        </Layout>
      </div>
    </NeighborhoodProvider>
  );
};
export default App;
