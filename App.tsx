
import React, { useState, useEffect, useMemo } from 'react';
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
import { AdminPanel } from './components/AdminPanel';
import { CashbackLandingView } from './components/CashbackLandingView';
import { StoreAdsModule } from './components/StoreAdsModule';
import { BannerUploadView } from './components/BannerUploadView';
import { AdminBannerModeration } from './components/AdminBannerModeration';
import { SupportChatView } from './components/SupportChatView';
import { AdminSupportView } from './components/AdminSupportView';
import { MapPin, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Category, Store, RoleMode, BannerPlan, SponsoredPlan, BannerConfig, BannerOrder, BannerMessage } from './types';
import { CategoryView } from './components/CategoryView';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { CommunityFeedView } from './components/CommunityFeedView';
import { STORES, PROFESSIONAL_BANNER_PRICING } from './constants';
import { AboutView, SupportView, FavoritesView } from './components/SimplePages';
import { getAccountEntryRoute } from './lib/roleRoutes';
import { BannerConfigView } from './components/BannerConfigView';
import { BannerCheckoutView } from './components/BannerCheckoutView';
import { SponsoredAdsView } from './components/SponsoredAdsView';
import { SponsoredAdsCheckoutView } from './components/SponsoredAdsCheckoutView';
import { SponsoredAdsSuccessView } from './components/SponsoredAdsSuccessView';
import { BannerOrderTrackingView } from './components/BannerOrderTrackingView';
import { AdminBannerOrdersList } from './components/AdminBannerOrdersList';
import { AdminBannerOrderDetail } from './components/AdminBannerOrderDetail';
import { GeminiAssistant } from './components/GeminiAssistant';

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
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'Visitante');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);
  const [bannerOrder, setBannerOrder] = useState<{ plan: BannerPlan | null; draft: any | null }>({ plan: null, draft: null });
  const [sponsoredPlan, setSponsoredPlan] = useState<SponsoredPlan | null>(null);
  
  const [bannerOrders, setBannerOrders] = useState<BannerOrder[]>([]);
  const [bannerMessages, setBannerMessages] = useState<BannerMessage[]>([]);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [adminViewOrderId, setAdminViewOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthInitialLoading) return;
    if (!user) {
        setViewMode('Visitante');
        return;
    }
    const persistedMode = localStorage.getItem('admin_view_mode') as RoleMode;
    if (persistedMode) {
        if (persistedMode === 'ADM' && user.email !== ADMIN_EMAIL) setViewMode('Visitante');
        else setViewMode(persistedMode);
    } else {
        if (user.email === ADMIN_EMAIL) setViewMode('ADM');
        else if (userRole === 'lojista') setViewMode('Lojista');
        else setViewMode('Usuário');
    }
  }, [isAuthInitialLoading, user, userRole]);

  useEffect(() => {
    if (isAuthInitialLoading) return;
    if (!viewMode) return;
    localStorage.setItem('admin_view_mode', viewMode);
    const merchantTabs = ['store_area', 'store_ads_module', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_order_tracking'];
    if (viewMode === 'ADM' && user?.email === ADMIN_EMAIL) setActiveTab('admin_panel');
    else if (viewMode === 'Lojista' && user && !merchantTabs.includes(activeTab)) setActiveTab('store_area');
    else if (viewMode === 'Usuário' && user && ['admin_panel', 'store_area'].includes(activeTab)) setActiveTab('profile');
    else if (viewMode === 'Visitante' && ['admin_panel', 'store_area', 'profile', 'wallet', 'favorites'].includes(activeTab)) setActiveTab('home');
  }, [viewMode, isAuthInitialLoading, user]);

  const handleAuthClick = () => {
    if (user) setActiveTab(getAccountEntryRoute(viewMode));
    else setIsAuthOpen(true);
  };

  const handleConfigureAndCreateBanner = (config: BannerConfig) => {
    const syntheticPlan: BannerPlan = {
      id: config.duration === '1m' ? 'home_1m' : 'home_3m', 
      label: `${config.placement} - ${config.duration === '1m' ? '1 Mês' : '3 Meses'}`,
      priceCents: config.priceCents,
      placement: config.placement,
      durationMonths: config.duration === '1m' ? 1 : 3,
      benefit: 'Plano customizado.',
      neighborhoods: config.neighborhoods,
    };
    setBannerOrder({ plan: syntheticPlan, draft: null });
    setActiveTab('store_ads_module');
  };

  const handleFinalizeBannerCreation = (draft: any) => {
      setBannerOrder(prev => ({ ...prev, draft }));
      setActiveTab('banner_checkout'); 
  };

  const handlePaymentComplete = (paymentMethod: 'pix' | 'credit' | 'debit') => {
      if (!user || !bannerOrder.plan || !bannerOrder.draft) return;
      if (bannerOrder.draft.type === 'professional_service') {
          const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
          const now = new Date().toISOString();
          const newOrder: BannerOrder = {
              id: newOrderId,
              merchantId: user.id,
              bannerType: 'professional',
              total: bannerOrder.plan.priceCents + PROFESSIONAL_BANNER_PRICING.promoCents,
              paymentMethod,
              paymentStatus: 'paid',
              createdAt: now,
              status: 'em_analise',
              onboardingStage: 'requested_assets',
              autoMessagesFlags: { welcomeSent: true, requestSent: true, assetsReceivedSent: false, thanksSent: false }
          };
          setBannerOrders(prev => [...prev, newOrder]);
          setViewingOrderId(newOrderId);
          setBannerOrder({ plan: null, draft: null });
          setActiveTab('banner_order_tracking');
      } else {
          alert("Banner publicado!");
          setBannerOrder({ plan: null, draft: null });
          setActiveTab('store_area'); 
      }
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<BannerOrder>) => {
    setBannerOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
  };

  const handleSendMessage = (orderId: string, text: string, type: 'text' | 'assets_payload' = 'text', metadata?: any) => {
    const newMessage: BannerMessage = { id: `msg-${Date.now()}`, orderId, senderType: 'merchant', body: text, type, metadata, createdAt: new Date().toISOString() };
    setBannerMessages(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    if (splashStage === 4) return;
    const t = setTimeout(() => setSplashStage(4), 5000);
    return () => clearTimeout(t);
  }, [splashStage]);

  if (splashStage < 4) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#1E5BFF]">
        <MapPin className="w-16 h-16 text-white fill-white animate-bounce" />
        <h1 className="text-4xl font-black text-white mt-4">Localizei JPA</h1>
        <TypingText text="Onde o bairro conversa" duration={2000} />
      </div>
    );
  }

  return (
    <NeighborhoodProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} viewMode={viewMode}>
          <Header isDarkMode={false} toggleTheme={() => {}} onAuthClick={handleAuthClick} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole as any} stores={STORES} onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} />
          <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
            {activeTab === 'home' && <HomeFeed onNavigate={setActiveTab} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onSelectCollection={() => {}} onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} stores={STORES} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}
            {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} onLocationClick={() => {}} onFilterClick={() => {}} onProceedToPayment={() => {}} onNavigate={setActiveTab} />}
            {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={handleAuthClick} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />}
            {activeTab === 'support' && <SupportChatView user={user} onBack={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'profile')} />}
            {activeTab === 'admin_support' && user?.email === ADMIN_EMAIL && <AdminSupportView onBack={() => setActiveTab('admin_panel')} />}
            {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={setActiveTab} />}
            {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={(s) => { setSelectedStore(s); setActiveTab('store_detail'); }} stores={STORES} userRole={userRole} onAdvertiseInCategory={setAdCategoryTarget} onNavigate={setActiveTab} />}
            {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
            {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} bannerOrders={bannerOrders} bannerMessages={bannerMessages} onViewOrder={setViewingOrderId} />}
            {activeTab === 'banner_config' && <BannerConfigView onBack={() => setActiveTab('store_area')} onConfigure={handleConfigureAndCreateBanner} />}
            {activeTab === 'store_ads_module' && bannerOrder.plan && <StoreAdsModule onBack={() => setActiveTab('banner_config')} onNavigate={setActiveTab} user={user as any} plan={bannerOrder.plan} onFinalize={handleFinalizeBannerCreation} />}
            {activeTab === 'banner_checkout' && bannerOrder.plan && bannerOrder.draft && <BannerCheckoutView plan={bannerOrder.plan} draft={bannerOrder.draft} onBack={() => setActiveTab('store_ads_module')} onComplete={handlePaymentComplete} />}
            {activeTab === 'banner_order_tracking' && viewingOrderId && <BannerOrderTrackingView orderId={viewingOrderId} orders={bannerOrders} messages={bannerMessages} onBack={() => setActiveTab('store_area')} onSendMessage={handleSendMessage} onViewOrder={() => {}} onUpdateOrder={handleUpdateOrder} />}
          </main>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={() => setIsAuthOpen(false)} />
          <GeminiAssistant />
      </Layout>
      {isRoleSwitcherOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsRoleSwitcherOpen(false)}>
            <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] p-8" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-black text-white mb-8">Modo de Visualização</h2>
                <div className="space-y-3">
                    {(['ADM', 'Usuário', 'Lojista', 'Visitante'] as RoleMode[]).map(role => (
                        <button key={role} onClick={() => { setViewMode(role); setIsRoleSwitcherOpen(false); }} className={`w-full p-5 rounded-[1.5rem] border text-left ${viewMode === role ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white'}`}>
                            <span className="font-black">{role}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </NeighborhoodProvider>
  );
};
export default App;
