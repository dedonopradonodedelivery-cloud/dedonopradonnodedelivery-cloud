
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
import { MapPin, ShieldCheck, Lock, LogIn, ChevronDown, Check, X, User as UserIcon, Store as StoreIcon, EyeOff } from 'lucide-react';
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

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  // 0: Logo fade-in, 1: Typewriter starts, 2: Animation running, 3: Fade-out, 4: Gone
  const [splashStage, setSplashStage] = useState(isFirstBootAttempted || isAuthReturn ? 4 : 0);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('localizei_theme_mode') as ThemeMode) || 'light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // VIEW MODE STATE (GLOBAL)
  const [viewMode, setViewMode] = useState<RoleMode>(() => {
    return (localStorage.getItem('admin_view_mode') as RoleMode) || 'ADM';
  });
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

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
    
    // 0s -> 0.5s: Fade in Logo
    // 0.5s -> 2.5s: Typewriter Sponsor
    // 4.0s -> 5.0s: App Fade Out
    
    const tStartTypewriter = setTimeout(() => setSplashStage(1), 500);
    const tStartFadeOut = setTimeout(() => setSplashStage(3), 4000);
    const tFinished = setTimeout(() => {
        setSplashStage(4);
        isFirstBootAttempted = true;
    }, 5000);

    return () => {
        clearTimeout(tStartTypewriter);
        clearTimeout(tStartFadeOut);
        clearTimeout(tFinished);
    };
  }, [splashStage]);

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

  // LOGICA DE REDIRECIONAMENTO AUTOMÁTICO POR VIEW MODE
  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;

    localStorage.setItem('admin_view_mode', viewMode);

    switch (viewMode) {
      case 'ADM':
        setActiveTab('admin_panel');
        break;
      case 'Usuário':
      case 'Visitante':
        if (activeTab === 'admin_panel' || activeTab === 'store_area') setActiveTab('home');
        break;
      case 'Lojista':
        setActiveTab('store_area');
        break;
    }
  }, [viewMode, user]);

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

  const handleCupomClick = () => {
    const isAdmin = user && user.email === ADMIN_EMAIL;
    const effectiveRole = isAdmin ? (viewMode === 'Lojista' ? 'lojista' : 'cliente') : userRole;
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

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isSimulatingVisitante = isAdmin && viewMode === 'Visitante';
  const effectiveUser = isSimulatingVisitante ? null : user;
  const effectiveRole = isAdmin ? (viewMode === 'Lojista' ? 'lojista' : 'cliente') : userRole;

  // ROLE SWITCHER MODAL COMPONENT (REUSABLE)
  const RoleSwitcherModal = () => {
    const roles: { id: RoleMode; label: string; desc: string; icon: any }[] = [
        { id: 'ADM', label: 'Administrador', desc: 'Acesso total e controle operacional.', icon: ShieldCheck },
        { id: 'Usuário', label: 'Usuário', desc: 'Simula visão do morador/cliente.', icon: UserIcon },
        { id: 'Lojista', label: 'Lojista', desc: 'Simula visão do dono de negócio.', icon: StoreIcon },
        { id: 'Visitante', label: 'Visitante', desc: 'Simula experiência externa/investidor.', icon: EyeOff },
    ];

    if (!isRoleSwitcherOpen) return null;

    return (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-6"
          onClick={() => setIsRoleSwitcherOpen(false)}
        >
            <div 
                className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-8 px-2">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white">Modo de Visualização</h2>
                        <p className="text-[10px] text-[#9CA3AF] font-black uppercase tracking-[0.2em] mt-1">Simular experiência de perfil</p>
                    </div>
                    <button onClick={() => setIsRoleSwitcherOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors -mt-2 -mr-2">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    {roles.map((role) => {
                        const isSelected = viewMode === role.id;
                        return (
                            <button
                                key={role.id}
                                onClick={() => {
                                    setViewMode(role.id);
                                    setIsRoleSwitcherOpen(false);
                                }}
                                className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all text-left relative overflow-hidden group
                                    ${isSelected 
                                        ? 'bg-white text-[#0F172A] border-white shadow-xl scale-[1.02]' 
                                        : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                                    ${isSelected ? 'bg-[#0F172A] text-white' : 'bg-white/5 text-[#9CA3AF] group-hover:text-white'}`}>
                                    <role.icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-[#0F172A]' : 'text-white'}`}>{role.label}</p>
                                    <p className={`text-[10px] font-medium leading-tight mt-0.5 ${isSelected ? 'text-[#0F172A]/60' : 'text-[#9CA3AF]'}`}>{role.desc}</p>
                                </div>
                                {isSelected && (
                                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Check size={14} strokeWidth={4} className="text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <NeighborhoodProvider>
        <div 
          className="min-h-screen bg-white dark:bg-gray-900 flex justify-center transition-colors duration-300 relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Layout 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              userRole={effectiveRole} 
              onCashbackClick={handleCupomClick}
              hideNav={hideBottomNav}
          >
              {!headerExclusionList.includes(activeTab) && (
              <Header
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  onAuthClick={() => setActiveTab('profile')} 
                  user={effectiveUser as any}
                  searchTerm={globalSearch}
                  onSearchChange={setGlobalSearch}
                  onNavigate={setActiveTab}
                  activeTab={activeTab}
                  userRole={effectiveRole}
                  onOpenMerchantQr={() => setActiveTab('merchant_qr')}
                  stores={STORES}
                  onStoreClick={handleSelectStore}
                  // ADMIN VIEW SWITCHER PROPS
                  isAdmin={isAdmin}
                  viewMode={viewMode}
                  onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)}
              />
              )}
              <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
              
              {activeTab === 'admin_panel' && (
                  <AdminPanel 
                    user={user as any} 
                    onNavigateToApp={() => {}} // Not used with current global flow
                    onLogout={signOut}
                    viewMode={viewMode}
                    onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)}
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
                  user={effectiveUser as any}
                  userRole={effectiveRole}
                  onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }}
                  onRequireLogin={() => setIsAuthOpen(true)}
                  />
              )}
              
              {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
              {activeTab === 'profile' && <MenuView user={effectiveUser as any} userRole={effectiveRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} currentTheme={themeMode} onThemeChange={setThemeMode} />}
              {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => { setActiveTab('home'); setSelectedCategory(null); }} onStoreClick={handleSelectStore} stores={STORES} userRole={effectiveRole} onAdvertiseInCategory={handleAdvertiseInCategory} />}
              {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
              {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
              {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={effectiveUser as any} onRequireLogin={() => setIsAuthOpen(true)} />}
              {activeTab === 'user_cupom' && <UserCupomScreen user={effectiveUser as any} onBack={() => setActiveTab('home')} />}
              {activeTab === 'qrcode_scan' && <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} />}
              {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={effectiveUser as any} />}
              </main>

              <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => {
                    setIsAuthOpen(false);
                    setPendingRoute(null);
                }} 
                user={effectiveUser as any}
                onLoginSuccess={() => { setIsAuthOpen(false); }}
              />
              {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => { setIsQuoteModalOpen(false); setActiveTab('service_success'); }} />}
          </Layout>

          {/* SHARED ROLE SWITCHER MODAL */}
          <RoleSwitcherModal />

          {splashStage < 4 && (
            <div 
              className={`fixed inset-0 z-[999] flex flex-col items-center justify-center transition-all duration-1000 ${splashStage === 3 ? 'animate-app-exit' : ''}`} 
              style={{ backgroundColor: '#1E5BFF' }} 
            >
              <div className="flex flex-col items-center justify-center z-10">
                  <div className={`relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6 animate-logo-enter ${splashStage >= 1 ? 'animate-logo-micro-move' : ''}`}>
                    <MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" />
                  </div>
                  <h1 className="text-5xl font-black font-display text-white tracking-tighter drop-shadow-md animate-fade-in">Localizei</h1>
                  <span className="text-sm font-bold text-white/90 tracking-[0.5em] uppercase mt-1 animate-fade-in">JPA</span>
                  
                  {/* Patrocinador com efeito de escrita */}
                  <div className="mt-12 flex flex-col items-center min-h-[60px]">
                      {splashStage >= 1 && (
                        <div className="flex flex-col items-center overflow-hidden">
                           <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 animate-fade-in">Patrocinador Master</p>
                           <div className="typewriter-container animate-typewriter">
                              <p className="text-lg font-medium text-white whitespace-nowrap">Grupo Esquematiza</p>
                           </div>
                        </div>
                      )}
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
