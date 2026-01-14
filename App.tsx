
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
import { MapPin, ShieldCheck } from 'lucide-react';
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

// Global para persistência entre ciclos de vida se necessário
let isFirstBootAttempted = false;

// Tabs that support horizontal swipe navigation (Main Bottom Bar Tabs)
const MAIN_TABS = ['home', 'explore', 'user_cupom', 'qrcode_scan', 'services', 'community_feed'];

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  
  // UX ENGINEER: Detecta se estamos voltando de um login com Google (OAuth)
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [splashStage, setSplashStage] = useState(isFirstBootAttempted || isAuthReturn ? 4 : 0);
  
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('localizei_theme_mode') as ThemeMode) || 'light');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  const [selectedServiceSub, setSelectedServiceSub] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  
  // Estado para controlar redirecionamento pós-login
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

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

  // --- BLOQUEIOS DE SEGURANÇA E PERMISSÕES ---
  useEffect(() => {
    // Regra 1: Usuário NÃO pode acessar validação
    if (userRole === 'cliente' && activeTab === 'qrcode_scan') {
        console.warn("Bloqueio: Cliente tentou acessar validação.");
        setActiveTab('home');
    }

    // Regra 2: Lojista NÃO pode gerar QR Code (Consumo)
    if (userRole === 'lojista' && activeTab === 'user_cupom') {
        console.warn("Bloqueio: Lojista tentou gerar cupom de consumo.");
        setActiveTab('home');
    }
  }, [activeTab, userRole]);

  // --- REDIRECIONAMENTO AUTOMÁTICO PÓS-LOGIN ---
  useEffect(() => {
    if (user && pendingRoute === 'cupom') {
        // Redireciona para a tela correta baseada no perfil
        if (userRole === 'lojista') {
            setActiveTab('qrcode_scan');
        } else {
            setActiveTab('user_cupom');
        }
        setPendingRoute(null); // Limpa o estado pendente
    }
  }, [user, userRole, pendingRoute]);
  
  // --- LÓGICA DO BOTÃO "CUPOM" ---
  const handleCupomClick = () => {
    if (!user) {
      // Regra 1: Bloqueio Total para Visitante
      // Armazena intenção e abre login imediatamente
      setPendingRoute('cupom');
      setIsAuthOpen(true);
    } else if (userRole === 'lojista') {
      // Lojista: Abrir Scanner para Validar
      setActiveTab('qrcode_scan');
    } else {
      // Usuário: Gerar QR Code/Token
      setActiveTab('user_cupom');
    }
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
    'user_cupom', 'cashback_landing', 'advertise_home_banner', 'user_coupons_history'
  ];

  const hideBottomNav = ['store_ads_module', 'store_detail', 'admin_moderation', 'advertise_home_banner'].includes(activeTab);

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
              userRole={userRole} 
              onCashbackClick={handleCupomClick}
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
                  stores={STORES}
                  onStoreClick={handleSelectStore}
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
                  <UserStatementView onBack={() => setActiveTab('profile')} onExploreStores={() => setActiveTab('explore')} balance={12.40} />
              )}
              {activeTab === 'user_coupons_history' && (
                  <UserCouponsHistoryView onBack={() => setActiveTab('profile')} />
              )}
              {activeTab === 'merchant_cashback_onboarding' && (
                  <MerchantCashbackOnboarding onBack={() => setActiveTab('home')} onActivate={() => setActiveTab('store_cashback_module')} />
              )}
              {activeTab === 'merchant_cashback_dashboard' && (
                  <MerchantCashbackDashboard onBack={() => setActiveTab('home')} onNavigate={setActiveTab} />
              )}
              {activeTab === 'store_cashback_module' && <StoreCashbackModule onBack={() => setActiveTab('home')} />}
              {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} />}
              
              {/* Rota Específica para Banner da Home - Volta para Home */}
              {activeTab === 'advertise_home_banner' && <StoreAdsModule onBack={() => setActiveTab('home')} />}

              {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'store_finance' && <StoreFinanceModule onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'weekly_promo' && <WeeklyPromoModule onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'merchant_jobs' && <MerchantJobsModule onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'jobs_list' && <JobsView onBack={() => setActiveTab('home')} />}
              
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
              {activeTab === 'store_area' && (userRole === 'lojista' ? <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />)}
              {activeTab === 'merchant_qr' && (userRole === 'lojista' ? <MerchantQrScreen user={user} onBack={() => setActiveTab('home')} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />)}
              {activeTab === 'admin_moderation' && <AdminModerationPanel onBack={() => setActiveTab('profile')} />}
              
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
              
              {/* NOVAS ROTAS DO CUPOM */}
              {activeTab === 'user_cupom' && <UserCupomScreen user={user as any} onBack={() => setActiveTab('home')} />}
              {activeTab === 'cashback_landing' && <CashbackLandingView onBack={() => setActiveTab('home')} onLogin={() => setIsAuthOpen(true)} />}

              {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
              {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
              {activeTab === 'reward_details' && <RewardDetailsView reward={selectedReward} onBack={() => setActiveTab('home')} onHome={() => setActiveTab('home')} />}
              {activeTab === 'prize_history' && user && <PrizeHistoryView userId={user.id} onBack={() => setActiveTab('home')} onGoToSpinWheel={() => setActiveTab('home')} />}
              </main>

              <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => {
                    setIsAuthOpen(false);
                    // Se cancelou login, remove intenção pendente
                    setPendingRoute(null);
                }} 
                user={user as any}
                // O redirecionamento real acontece via useEffect quando o user muda
                onLoginSuccess={() => { setIsAuthOpen(false); }}
              />
              {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => { setIsQuoteModalOpen(false); setActiveTab('service_success'); }} />}
          </Layout>

          {splashStage < 4 && (
            <div 
                className={`fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-500 ${splashStage === 3 ? 'animate-app-exit' : ''}`}
                style={{ backgroundColor: '#1E5BFF' }} 
            >
              <div 
                className={`flex flex-col items-center justify-center z-10 transition-all duration-700 
                ${splashStage === 0 ? 'animate-logo-enter' : 'opacity-100'} 
                ${splashStage >= 1 ? 'animate-logo-micro-move' : ''}`}
              >
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6">
                    <MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" />
                  </div>
                  <h1 className="text-5xl font-black font-display text-white tracking-tighter drop-shadow-md">
                    Localizei
                  </h1>
                  <span className="text-sm font-bold text-white/90 tracking-[0.5em] uppercase mt-1">
                    JPA
                  </span>
                  
                  <div className={`mt-12 flex flex-col items-center gap-2 transition-all duration-300
                    ${splashStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                     <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-medium animate-sponsor-label-fade" style={{ animationDelay: '0ms' }}>
                        Patrocinador Master
                     </p>
                     <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-full backdrop-blur-md border border-white/10 overflow-hidden min-h-[48px]">
                        <div className="animate-sponsor-icon-elastic" style={{ animationDelay: '100ms' }}>
                           <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex overflow-hidden relative">
                            <span 
                                className={`text-sm font-bold text-white tracking-wide whitespace-nowrap border-r-2 border-white pr-1 overflow-hidden w-0 
                                ${splashStage >= 2 ? 'animate-typewriter' : 'opacity-0'}`}
                                style={{ animationDelay: '400ms' }}
                            >
                                Grupo Esquematiza
                            </span>
                        </div>
                     </div>
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
