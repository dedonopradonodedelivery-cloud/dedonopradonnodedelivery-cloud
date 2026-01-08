
import React, { useState, useEffect, useRef } from 'react';
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
import { WeeklyPromoModule } from './WeeklyPromoModule';
import { JobsView } from './JobsView';
import { MerchantJobsModule } from './MerchantJobsModule';
import { MapPin, Crown, X, Star, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NeighborhoodProvider } from '../contexts/NeighborhoodContext';
import { Category, Store, AdType, EditorialCollection, ThemeMode } from '../types';
import { getStoreLogo } from '../utils/mockLogos';
import { CategoryView } from './CategoryView';
import { EditorialListView } from './EditorialListView';
import { UserStatementView } from './UserStatementView';
import { MerchantCashbackDashboard } from './MerchantCashbackDashboard';
import { MerchantCashbackOnboarding } from './MerchantCashbackOnboarding';
import { StoreCashbackModule } from './StoreCashbackModule';
import { StoreAdsModule } from './StoreAdsModule';
import { StoreProfileEdit } from './StoreProfileEdit';
import { StoreFinanceModule } from './StoreFinanceModule';
import { CommunityFeedView } from './CommunityFeedView';
import { STORES } from '../constants';
import { AdminModerationPanel } from './AdminModerationPanel';
import { 
  AboutView, 
  SupportView, 
  InviteFriendView, 
  FavoritesView, 
  SponsorInfoView 
} from './SimplePages';

// Global para persistência entre ciclos de vida se necessário
let isFirstBootAttempted = false;

// Tabs that support horizontal swipe navigation (Main Bottom Bar Tabs)
const MAIN_TABS = ['home', 'explore', 'qrcode_scan', 'services', 'community_feed', 'store_area'];

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  
  // UX ENGINEER: Detecta se estamos voltando de um login com Google (OAuth)
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(isFirstBootAttempted || isAuthReturn);
  const [splashProgress, setSplashProgress] = useState(isAuthReturn ? 100 : 0);
  const [showSponsor, setShowSponsor] = useState(false);
  
  // Theme Management - DEFAULT IS LIGHT
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('localizei_theme_mode') as ThemeMode) || 'light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados de Navegação - Persistência via LocalStorage garantida
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

  // --- SWIPE LOGIC STATE ---
  const touchStart = useRef<{ x: number, y: number, target: EventTarget | null } | null>(null);
  const minSwipeDistance = 60; // Increased slightly to avoid accidental swipes

  useEffect(() => {
    localStorage.setItem('localizei_active_tab', activeTab);
  }, [activeTab]);

  // --- LÓGICA DE DIRECIONAMENTO DO LOJISTA ---
  useEffect(() => {
    // Se o usuário for lojista e estiver na Home padrão ou acabou de logar,
    // redireciona para o Painel do Parceiro (store_area)
    if (userRole === 'lojista' && activeTab === 'home') {
      setActiveTab('store_area');
    }
  }, [userRole, activeTab]);

  // Ciclo de vida do Splash (Cold Start Only)
  useEffect(() => {
    if (isFirstBootAttempted || isAuthReturn) return;

    // Sequência de animação da Splash
    const sponsorTimer = setTimeout(() => {
      setShowSponsor(true);
    }, 1000);

    const finishTimer = setTimeout(() => {
      setSplashProgress(100);
      isFirstBootAttempted = true;
      setTimeout(() => setMinSplashTimeElapsed(true), 300);
    }, 3500);

    const progressInterval = setInterval(() => {
      setSplashProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 1;
      });
    }, 30);

    return () => {
      clearTimeout(sponsorTimer);
      clearTimeout(finishTimer);
      clearInterval(progressInterval);
    };
  }, [isAuthReturn]);

  // Theme Logic
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

  // --- CUSTOM NAVIGATION HANDLER ---
  const handleTabChange = (tabId: string) => {
    if (tabId === 'home' && userRole === 'lojista') {
      setActiveTab('store_area');
    } else {
      setActiveTab(tabId);
    }
  };

  // --- SWIPE HANDLERS ---
  const isHorizontalScroll = (target: Element | null): boolean => {
    if (!target) return false;
    // Don't traverse up past the app root
    if (target.id === 'root') return false;

    const style = window.getComputedStyle(target);
    const overflowX = style.getPropertyValue('overflow-x');
    
    // Check if element handles horizontal scroll AND has content overflowing
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

    // 1. Check if we are on a main tab
    if (!MAIN_TABS.includes(activeTab)) return;

    // 2. Check if user is typing (keyboard open usually focuses input)
    if (['INPUT', 'TEXTAREA'].includes((document.activeElement as Element)?.tagName)) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStart.current.x - touchEndX;
    const deltaY = touchStart.current.y - touchEndY;

    // 3. Check for horizontal intent (ignore vertical scrolls)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // 4. Check for minimum distance
    if (Math.abs(deltaX) < minSwipeDistance) return;

    // 5. CRITICAL: Check if user touched a carousel or scrollable area
    if (isHorizontalScroll(touchStart.current.target as Element)) {
      // User is scrolling a carousel, do not switch tabs
      return;
    }

    // Determine current logical index
    // For merchants, store_area IS logically the 'home' tab (index 0)
    let effectiveTabs = ['home', 'explore', 'qrcode_scan', 'services', 'community_feed'];
    if (userRole === 'lojista') {
        effectiveTabs[0] = 'store_area';
    }

    const currentIndex = effectiveTabs.indexOf(activeTab);
    if (currentIndex === -1) return; // Not on a swipable main tab
    
    if (deltaX > 0) {
      // Swiped Left -> Go to Next Tab
      if (currentIndex < effectiveTabs.length - 1) {
        const nextTab = effectiveTabs[currentIndex + 1];
        if (nextTab === 'qrcode_scan') {
            handleCashbackClick();
        } else {
            setActiveTab(nextTab);
        }
      }
    } else {
      // Swiped Right -> Go to Prev Tab
      if (currentIndex > 0) {
        const prevTab = effectiveTabs[currentIndex - 1];
        if (prevTab === 'qrcode_scan') {
            handleCashbackClick();
        } else {
            setActiveTab(prevTab);
        }
      }
    }
  };

  const headerExclusionList = [
    'explore', 'store_area', 'merchant_qr', 'editorial_list', 'store_profile', 'store_finance',
    'category_detail', 'food_category', 'store_detail', 'profile', 
    'patrocinador_master', 'prize_history', 'reward_details', 
    'freguesia_connect_public', 'freguesia_connect_dashboard', 'freguesia_connect_restricted',
    'service_subcategories', 'service_specialties', 'service_terms', 'service_success',
    'user_statement', 'merchant_cashback_dashboard', 'merchant_cashback_onboarding',
    'store_cashback_module', 'store_ads_module', 'about', 'support', 'invite_friend', 'favorites',
    'weekly_promo', 'jobs_list', 'merchant_jobs', 'community_feed', 'admin_moderation' 
  ];

  const hideBottomNav = ['store_ads_module', 'profile', 'store_detail', 'admin_moderation'].includes(activeTab);

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
              setActiveTab={handleTabChange} 
              userRole={userRole} 
              onCashbackClick={handleCashbackClick}
              hideNav={hideBottomNav}
          >
              {/* Header is shown for main tabs except when excluded */}
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
              {activeTab === 'user_statement' && (
                  <UserStatementView onBack={() => setActiveTab('home')} onExploreStores={() => setActiveTab('explore')} balance={12.40} />
              )}
              {activeTab === 'merchant_cashback_onboarding' && (
                  <MerchantCashbackOnboarding onBack={() => setActiveTab('store_area')} onActivate={() => setActiveTab('store_cashback_module')} />
              )}
              {activeTab === 'merchant_cashback_dashboard' && (
                  <MerchantCashbackDashboard onBack={() => setActiveTab('store_area')} onNavigate={setActiveTab} />
              )}
              {activeTab === 'store_cashback_module' && <StoreCashbackModule onBack={() => setActiveTab('store_area')} />}
              {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab('store_area')} />}
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
              
              {/* STORE AREA AS HOME FOR MERCHANTS */}
              {activeTab === 'store_area' && (
                  userRole === 'lojista' 
                  ? <StoreAreaView onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} user={user as any} /> 
                  : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />
              )}
              
              {activeTab === 'merchant_qr' && (userRole === 'lojista' ? <MerchantQrScreen user={user} onBack={() => setActiveTab('store_area')} /> : <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />)}
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
              {activeTab === 'freguesia_connect_public' && <FreguesiaConnectPublic onBack={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')} onLogin={() => setIsAuthOpen(true)} />}
              {activeTab === 'freguesia_connect_dashboard' && <FreguesiaConnectDashboard onBack={() => setActiveTab('home')} />}
              {activeTab === 'freguesia_connect_restricted' && <FreguesiaConnectRestricted onBack={() => setActiveTab('home')} />}
              {activeTab === 'qrcode_scan' && <CashbackScanScreen onBack={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} />}
              {activeTab === 'scan_confirmation' && scannedData && <ScanConfirmationScreen storeId={scannedData.storeId} onConfirm={() => setActiveTab('cashback_payment')} onCancel={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')} />}
              {activeTab === 'cashback_payment' && scannedData && <CashbackPaymentScreen user={user as any} merchantId={scannedData.merchantId} storeId={scannedData.storeId} onBack={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')} onComplete={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')} />}
              
              {activeTab === 'profile' && 
                  <MenuView 
                      user={user as any} 
                      userRole={userRole} 
                      onAuthClick={() => setIsAuthOpen(true)} 
                      onNavigate={setActiveTab} 
                      onBack={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')}
                      currentTheme={themeMode}
                      onThemeChange={setThemeMode}
                  />
              }
              
              {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab(userRole === 'lojista' ? 'store_area' : 'home')} />}
              {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
              {activeTab === 'reward_details' && <RewardDetailsView reward={selectedReward} onBack={() => setActiveTab('home')} onHome={() => setActiveTab('home')} />}
              {activeTab === 'prize_history' && user && <PrizeHistoryView userId={user.id} onBack={() => setActiveTab('home')} onGoToSpinWheel={() => setActiveTab('home')} />}
              </main>

              <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} />
              {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => { setIsQuoteModalOpen(false); setActiveTab('service_success'); }} />}
          </Layout>

          {/* OVERLAY SPLASH - PREMIUM */}
          {!minSplashTimeElapsed && (
            <div className="fixed inset-0 bg-[#1E5BFF] flex flex-col items-center justify-between text-white z-[999] overflow-hidden animate-out fade-out duration-700 fill-mode-forwards pb-10">
              <div className={`flex flex-col items-center justify-center flex-1 transition-transform duration-1000 ${showSponsor ? '-translate-y-8 scale-90' : 'translate-y-0'}`}>
                <div className="animate-float-slow">
                  <div className="w-28 h-28 bg-white rounded-[2.8rem] flex items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.3)] mb-8 animate-pop-in">
                    <MapPin className="w-14 h-14 text-[#1E5BFF] fill-[#1E5BFF]" />
                  </div>
                </div>
                <div className="text-center relative">
                  <h1 className="text-6xl font-black font-display animate-slide-up tracking-tighter drop-shadow-2xl">Localizei</h1>
                  <div className="flex items-center justify-center gap-3 mt-3 animate-tracking-expand opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
                    <div className="h-[1.5px] w-6 bg-white/40"></div>
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/80">JPA</span>
                    <div className="h-[1.5px] w-6 bg-white/40"></div>
                  </div>
                </div>
              </div>

              <div className={`flex flex-col items-center transition-all duration-1000 ease-out ${showSponsor ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/60 mb-3">
                      Patrocinador Master
                  </p>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                      <Shield className="w-8 h-8 text-white fill-white" />
                      <div className="flex flex-col items-start">
                          <span className="text-2xl font-black font-display tracking-tight text-shimmer leading-none">
                              Grupo Esquematiza
                          </span>
                      </div>
                  </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5">
                <div className="h-full bg-white shadow-[0_0_25px_rgba(255,255,255,1)] transition-all duration-[100ms] ease-linear" style={{ width: `${splashProgress}%` }} />
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};

export default App;
