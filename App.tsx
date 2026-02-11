
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { HomeFeed } from '@/components/HomeFeed';
import { ExploreView } from '@/components/ExploreView';
import { StoreDetailView } from '@/components/StoreDetailView';
import { AuthModal } from '@/components/AuthModal';
import { MenuView } from '@/components/MenuView';
import { PatrocinadorMasterScreen } from '@/components/PatrocinadorMasterScreen';
import { ServicesView } from '@/components/ServicesView';
import { StoreAreaView } from '@/StoreAreaView';
import { ClassifiedsView } from '@/components/ClassifiedsView';
import { ClassifiedSearchResultsView } from '@/components/ClassifiedSearchResultsView';
import { RealEstateView } from '@/components/RealEstateView';
import { RealEstateWizard } from '@/components/RealEstateWizard';
import { RealEstateDetailView } from '@/components/RealEstateDetailView';
import { ClassifiedDetailView } from '@/components/ClassifiedDetailView';
import { JobsView } from '@/components/JobsView';
import { JobDetailView } from '@/components/JobDetailView';
import { JobWizard } from '@/components/JobWizard';
import { PlanSelectionView } from '@/components/PlanSelectionView';
import { AdoptionView } from '@/components/AdoptionView';
import { DonationsView } from '@/components/DonationsView';
import { DesapegaView } from '@/components/DesapegaView';
import { MerchantPerformanceDashboard } from '@/components/MerchantPerformanceDashboard';
import { AdminPanel } from '@/components/AdminPanel';
import { DesignerPanel } from '@/components/DesignerPanel';
import { MerchantLeadsView } from '@/components/MerchantLeadsView';
import { ServiceChatView } from '@/components/ServiceChatView';
import { CategoryView } from '@/components/CategoryView';
import { SubcategoryDetailView } from '@/components/SubcategoryDetailView';
import { SponsorInfoView } from '@/components/SponsorInfoView';
import { ServicesLandingView } from '@/components/ServicesLandingView';
import { CategoryBannerSalesView } from '@/components/CategoryBannerSalesView';
import { BannerSalesWizard } from '@/components/BannerSalesWizard'; 
import { StoreAdsModule } from '@/components/StoreAdsModule'; 
import { StoreSponsoredAds } from '@/components/StoreSponsoredAds'; 
import { WeeklyRewardPage } from '@/components/WeeklyRewardPage'; 
import { UserCupomScreen } from '@/components/UserCupomScreen'; 
import { UserStatementView } from '@/components/UserStatementView';
import { NotificationsView } from '@/components/NotificationsView';
import { StoreProfileEdit } from '@/components/StoreProfileEdit';
import { ServiceMessagesListView } from '@/components/ServiceMessagesListView';
import { MerchantReviewsModule } from '@/components/MerchantReviewsModule';
import { MerchantCouponsModule } from '@/components/MerchantCouponsModule';
import { MerchantPromotionsModule } from '@/components/MerchantPromotionsModule';
import { StoreFinanceModule } from '@/components/StoreFinanceModule';
import { StoreSupportModule } from '@/components/StoreSupportModule';
import { StoreConnectModule } from '@/components/StoreConnectModule';
import { StoreClaimFlow } from '@/components/StoreClaimFlow';
import { AppSuggestionView } from '@/components/AppSuggestionView';
import { CouponLandingView } from '@/components/CouponLandingView';
import { CategoriesPageView } from '@/components/CategoriesPageView';
import { HealthPreFilterView } from '@/components/HealthPreFilterView';
import { HealthSubSpecialtiesView } from '@/components/HealthSubSpecialtiesView';
// FIX: Added Crown to the lucide-react imports to resolve "Cannot find name 'Crown'" on line 290
import { MapPin, X, Palette, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NeighborhoodProvider } from '@/contexts/NeighborhoodContext';
import { Category, Store, Job, RealEstateProperty, PlanType, Classified } from '@/types';
import { STORES } from '@/constants';
import { AboutView, SupportView, FavoritesView, UserActivityView, MyNeighborhoodsView, PrivacyView, AboutAppView } from '@/components/SimplePages';
import { MerchantPanel } from '@/components/MerchantPanel';
import { UserProfileFullView } from '@/components/UserProfileFullView';
import { EditProfileView } from '@/components/EditProfileView';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante' | 'Designer';

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const { theme } = useTheme();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [isSplashVisible, setIsSplashVisible] = useState(!splashWasShownInSession && !isAuthReturn);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'Usuário');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [adminInitialTab, setAdminInitialTab] = useState<string | undefined>(undefined);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null);
  const [selectedClassified, setSelectedClassified] = useState<Classified | null>(null);
  const [classifiedSearchTerm, setClassifiedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [healthPreFilter, setHealthPreFilter] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [activityType, setActivityType] = useState<string>('');
  const [initialModuleView, setInitialModuleView] = useState<'sales' | 'chat' | undefined>(undefined);

  const [activeServiceRequestId, setActiveServiceRequestId] = useState<string | null>(null);
  const [activeProfessionalId, setActiveProfessionalId] = useState<string | null>(null);
  const [chatRole, setChatRole] = useState<'resident' | 'merchant' | 'admin'>('resident');

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isMerchantMode = userRole === 'lojista' || (isAdmin && viewMode === 'Lojista');

  const [isClaimFlowActive, setIsClaimFlowActive] = useState(false);
  const [storeToClaim, setStoreToClaim] = useState<Store | null>(null);

  useEffect(() => {
    if (!isSplashVisible) return;

    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true); 
    }, 5200);

    const removeTimeout = setTimeout(() => {
      setIsSplashVisible(false);
      splashWasShownInSession = true;
    }, 6000);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [isSplashVisible]);

  useEffect(() => {
    const handleUrlRouting = () => {
        const path = window.location.pathname;
        if (path === '/admin/aprovacoes' || path === '/admin/monetizacoes') {
            if (isAdmin) {
                setViewMode('ADM');
                localStorage.setItem('admin_view_mode', 'ADM');
                setAdminInitialTab(path === '/admin/aprovacoes' ? 'moderation' : 'monetization');
                setActiveTab('admin_panel');
            }
        }
    };
    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [isAdmin]);

  const handleNavigate = (view: string, data?: any) => {
    if (view !== 'sponsor_info' && view !== 'notifications' && view !== 'patrocinador_master' && view !== 'real_estate_detail' && view !== 'job_detail' && view !== 'plan_selection' && view !== 'classified_detail' && view !== 'classified_search_results' && view !== 'user_activity' && view !== 'app_suggestion' && view !== 'designer_panel' && view !== 'store_connect' && view !== 'merchant_panel' && view !== 'coupon_landing' && view !== 'all_categories' && view !== 'health_pre_filter' && !view.startsWith('health_')) {
      setPreviousTab(activeTab);
    }
    
    if (view === 'store_ads_module' && (data === 'chat' || data === 'sales')) {
       setInitialModuleView(data);
    } else {
       setInitialModuleView(undefined);
    }
    
    if (view === 'service_chat' && data?.requestId) {
        setActiveServiceRequestId(data.requestId);
        setActiveProfessionalId(data.professionalId || 'admin_auditoria');
        if (isAdmin) setChatRole('admin');
        else if (data.role) setChatRole(data.role);
        else if (isMerchantMode) setChatRole('merchant');
        else setChatRole('resident');
    }

    if (view === 'real_estate_detail' && data?.property) {
      setSelectedProperty(data.property);
    }

    if (view === 'job_detail' && data?.job) {
      setSelectedJob(data.job);
    }

    if (view === 'classified_detail' && data?.item) {
      setSelectedClassified(data.item);
    }

    if (view === 'classified_search_results' && data?.searchTerm) {
        setClassifiedSearchTerm(data.searchTerm);
    }

    if (view === 'user_activity' && data?.type) {
        setActivityType(data.type);
    }

    setActiveTab(view);
  };

  useEffect(() => {
    if (user && activeTab === 'coupon_landing') {
        if (userRole === 'lojista') {
            handleNavigate('merchant_coupons');
        } else {
            handleNavigate('user_coupons');
        }
    }
  }, [user, userRole]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); handleNavigate('store_detail'); };
  
  const handleSelectCategory = (category: Category) => {
    if (category.slug === 'all_categories') {
      handleNavigate('all_categories');
      return;
    }
    setSelectedCategory(category);
    if (category.id === 'cat-saude') {
        handleNavigate('health_pre_filter');
        return;
    }
    if (category.slug === 'real_estate' || category.slug === 'jobs' || category.slug === 'donations' || category.slug === 'desapega') {
        handleNavigate(category.slug);
    } else {
        handleNavigate('category_detail');
    }
  };

  const headerExclusionList = ['store_area', 'store_detail', 'profile', 'patrocinador_master', 'merchant_performance', 'classifieds', 'services', 'services_landing', 'merchant_leads', 'service_chat', 'admin_panel', 'category_detail', 'subcategory_detail', 'sponsor_info', 'real_estate', 'jobs', 'job_detail', 'job_wizard', 'adoption', 'donations', 'desapega', 'category_banner_sales', 'banner_sales_wizard', 'weekly_reward_page', 'user_coupons', 'notifications', 'store_profile', 'about', 'support', 'favorites', 'user_statement', 'service_messages_list', 'merchant_reviews', 'merchant_coupons', 'merchant_promotions', 'store_finance', 'store_support', 'real_estate_wizard', 'real_estate_detail', 'plan_selection', 'classified_detail', 'classified_search_results', 'user_activity', 'my_neighborhoods', 'privacy_policy', 'app_suggestion', 'designer_panel', 'store_connect', 'merchant_panel', 'store_ads_module', 'store_sponsored', 'about_app', 'coupon_landing', 'user_profile_full', 'edit_profile_view', 'all_categories', 'health_pre_filter', 'health_woman', 'health_man', 'health_pediatrics', 'health_geriatrics', 'explore'];

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <NeighborhoodProvider>
        <div className="min-h-screen bg-white dark:bg-gray-950 flex justify-center relative transition-colors duration-300">
          
          {isClaimFlowActive && storeToClaim && user && (
            <StoreClaimFlow 
              store={storeToClaim} 
              userId={user.id} 
              onBack={() => setIsClaimFlowActive(false)} 
              onSuccess={() => { setIsClaimFlowActive(false); handleNavigate('profile'); }}
              onNavigate={handleNavigate}
            />
          )}

          <div className={`w-full max-w-md h-[100dvh] transition-opacity duration-1000 ease-out ${!isSplashVisible || isFadingOut ? 'opacity-100' : 'opacity-0'}`}>
              <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={userRole as any} hideNav={false}>
                  {!headerExclusionList.includes(activeTab) && (
                    <Header onNotificationClick={() => handleNavigate('notifications')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={handleNavigate} activeTab={activeTab} userRole={userRole as any} stores={STORES} onStoreClick={handleSelectStore} isAdmin={isAdmin} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
                  )}
                  <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onSelectCategory={handleSelectCategory} onStoreClick={handleSelectStore} stores={STORES} user={user as any} userRole={userRole as any} />}
                    {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onNavigate={handleNavigate} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} />}
                    {activeTab === 'profile' && (isMerchantMode ? <StoreAreaView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} user={user as any} /> : <MenuView user={user as any} userRole={userRole as any} onAuthClick={() => setIsAuthOpen(true)} onNavigate={handleNavigate} onBack={() => handleNavigate('home')} />)}
                    {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={handleNavigate} onOpenMonitorChat={(id: string) => { setActiveServiceRequestId(id); setChatRole('admin'); handleNavigate('service_chat'); }} initialTab={adminInitialTab} />}
                    {/* ... other tabs mapping */}
                  </main>
                  <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} />
              </Layout>
          </div>

          {/* SPLASH SCREEN PREMIUM V5 */}
          {isSplashVisible && (
            <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-16 transition-opacity duration-800 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ background: 'linear-gradient(135deg, #1E5BFF 0%, #0039A6 50%, #020617 100%)' }}>
              
              {/* Partículas sutis */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="particle animate-float-particle" style={{ left: `${Math.random() * 100}%`, width: `${Math.random() * 4}px`, height: `${Math.random() * 4}px`, animationDelay: `${Math.random() * 5}s` }}></div>
                 ))}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
                  {/* Glow tecnológico atrás do logo */}
                  <div className="absolute w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] animate-pulse-glow pointer-events-none"></div>

                  {/* Logo Container */}
                  <div className="relative w-36 h-36 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-8 animate-logo-pop border border-white/20">
                    <MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" />
                  </div>
                  
                  {/* Nome do App */}
                  <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-2xl animate-reveal-up" style={{ animationDelay: '0.4s' }}>
                    Localizei <span className="text-blue-300">JPA</span>
                  </h1>
                  
                  {/* Slogan Premium */}
                  <div className="mt-4 overflow-hidden">
                    <p className="text-xl sm:text-2xl font-black font-display text-white/90 tracking-tighter uppercase opacity-0 animate-reveal-up" style={{ animationDelay: '1.2s' }}>
                      “Seu bairro, na sua mão.”
                    </p>
                    <div className="h-1.5 w-12 bg-blue-500 rounded-full mx-auto mt-3 opacity-0 animate-reveal-up" style={{ animationDelay: '1.4s' }}></div>
                  </div>
              </div>
              
              {/* Assinatura Institucional do Patrocinador Master */}
              <div className="text-center px-6 opacity-0 animate-fadeIn" style={{ animationDelay: '2.5s' }}>
                <div className="w-8 h-px bg-white/20 mb-3 mx-auto"></div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] leading-none">Patrocinador Master</p>
                <p className="text-sm font-display font-bold text-white/60 mt-1.5 tracking-widest flex items-center justify-center gap-2">
                   <Crown size={14} className="text-amber-500/50" /> Grupo Localizei
                </p>
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};
export default App;
