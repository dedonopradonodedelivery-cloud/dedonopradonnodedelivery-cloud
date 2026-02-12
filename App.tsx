
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Header } from '@/components/Header';
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
import { NeighborhoodPostsView } from '@/components/NeighborhoodPostsView';
import { SavedPostsView } from '@/components/SavedPostsView';
import { AdminPanel } from '@/components/AdminPanel';
import { DesignerPanel } from '@/components/DesignerPanel';
import { MerchantLeadsView } from '@/components/MerchantLeadsView';
import { ServiceChatView } from '@/components/ServiceChatView';
import { CategoryView } from '@/pages/categories/CategoryView';
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
import { JotaAssistant } from '@/components/GeminiAssistant';
import { MapPin, X, Palette, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NeighborhoodProvider } from '@/contexts/NeighborhoodContext';
import { Category, Store, Job, RealEstateProperty, PlanType, Classified } from '@/types';
import { STORES } from '@/constants';
import { AboutView, SupportView, FavoritesView, UserActivityView, MyNeighborhoodsView, PrivacyView, AboutAppView } from '@/components/SimplePages';
import { MerchantPanel } from '@/components/MerchantPanel';
import { UserProfileFullView } from '@/components/UserProfileFullView';
import { EditProfileView } from '@/components/EditProfileView';
import { MoreCategoriesModal } from '@/components/MoreCategoriesModal';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante' | 'Designer';

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const { theme } = useTheme();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [splashStage, setSplashStage] = useState(splashWasShownInSession || isAuthReturn ? 4 : 0);
  
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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  
  // States do Jota
  const [isJotaOpen, setIsJotaOpen] = useState(false);
  const [jotaInitialQuery, setJotaInitialQuery] = useState<string | undefined>(undefined);
  
  const [activityType, setActivityType] = useState<string>('');
  const [initialModuleView, setInitialModuleView] = useState<'sales' | 'chat' | undefined>(undefined);

  const [activeServiceRequestId, setActiveServiceRequestId] = useState<string | null>(null);
  const [activeProfessionalId, setActiveProfessionalId] = useState<string | null>(null);
  const [chatRole, setChatRole] = useState<'resident' | 'merchant' | 'admin'>('resident');

  const [sloganText, setSloganText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullSlogan = 'Seu bairro, na sua mão.';

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isMerchantMode = userRole === 'lojista' || (isAdmin && viewMode === 'Lojista');

  const [isClaimFlowActive, setIsClaimFlowActive] = useState(false);
  const [storeToClaim, setStoreToClaim] = useState<Store | null>(null);

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
    if (view !== 'sponsor_info' && view !== 'notifications' && view !== 'patrocinador_master' && view !== 'real_estate_detail' && view !== 'job_detail' && view !== 'plan_selection' && view !== 'classified_detail' && view !== 'classified_search_results' && view !== 'user_activity' && view !== 'app_suggestion' && view !== 'designer_panel' && view !== 'store_connect' && view !== 'merchant_panel' && view !== 'coupon_landing') {
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
  }, [user, userRole, activeTab]);

  useEffect(() => {
    if (splashStage >= 4) {
      setIsTyping(false);
      return;
    }
    if (sloganText.length === fullSlogan.length) {
      setIsTyping(false);
      return;
    }
    const typingTimeout = setTimeout(() => {
      setSloganText(fullSlogan.slice(0, sloganText.length + 1));
    }, 100);
    return () => clearTimeout(typingTimeout);
  }, [sloganText, splashStage]);

  useEffect(() => {
    if (splashStage === 4) return;
    const timer = setTimeout(() => {
      setSplashStage(4);
      splashWasShownInSession = true;
    }, 4500);
    return () => clearTimeout(timer);
  }, [splashStage]);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    handleNavigate('category_detail');
  };

  const handleOpenJota = (query?: string) => {
      setJotaInitialQuery(query);
      setIsJotaOpen(true);
  };

  if (splashStage < 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1E5BFF] to-[#001D4A] flex flex-col items-center justify-between py-16 px-5 text-center animate-in fade-in duration-700 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[250px] h-[250px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex-1 flex flex-col items-center justify-center animate-logo-enter">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
            <MapPin className="w-16 h-16 text-[#1E5BFF] fill-[#1E5BFF]" />
          </div>
          
          <h1 className="text-4xl font-black text-white font-display tracking-tighter uppercase mb-4 drop-shadow-lg">
            Localizei JPA
          </h1>
          
          <div className="h-6 flex flex-col items-center">
            <p className="text-lg font-medium text-white/90 font-sans tracking-tight">
              {sloganText}{isTyping && <span className="animate-blink ml-0.5">|</span>}
            </p>
          </div>

          {!isTyping && (
             <div className="mt-8 animate-in fade-in duration-700">
                <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
             </div>
          )}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">
            Patrocinador Master
          </p>
          <p className="text-lg font-display font-bold text-white tracking-wide">
            Grupo Esquematiza
          </p>
        </div>
      </div>
    );
  }

  return (
    <NeighborhoodProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole}>
        {activeTab === 'home' && (
          <div className="bg-gradient-to-b from-[#1E5BFF] to-[#001D4A] min-h-full">
            <Header 
              onNotificationClick={() => handleNavigate('notifications')}
              user={user}
              onNavigate={handleNavigate}
              activeTab={activeTab}
              onOpenJota={handleOpenJota}
            />
            <HomeFeed 
              onNavigate={handleNavigate}
              onSelectCategory={handleSelectCategory}
              onStoreClick={(s) => { setSelectedStore(s); handleNavigate('store_detail'); }}
              onOpenJota={handleOpenJota}
              stores={STORES}
              user={user}
              userRole={userRole}
              searchTerm={globalSearch}
              onSearchChange={setGlobalSearch}
              onOpenMoreCategories={() => setIsMoreCategoriesOpen(true)}
            />
          </div>
        )}
        
        {activeTab === 'explore' && (
          <ExploreView 
            stores={STORES} 
            searchQuery={globalSearch}
            onStoreClick={(s) => { setSelectedStore(s); handleNavigate('store_detail'); }}
            onLocationClick={() => {}}
            onFilterClick={() => {}}
            onOpenPlans={() => handleNavigate('plan_selection')}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'category_detail' && selectedCategory && (
          <CategoryView 
            category={selectedCategory} 
            onBack={() => handleNavigate(previousTab)} 
            onStoreClick={(s) => { setSelectedStore(s); handleNavigate('store_detail'); }}
            stores={STORES}
            userRole={userRole}
            onAdvertiseInCategory={() => {}}
            onNavigate={handleNavigate}
            onSubcategoryClick={(subName) => { setSelectedSubcategoryName(subName); handleNavigate('subcategory_detail'); }}
          />
        )}

        {activeTab === 'subcategory_detail' && selectedSubcategoryName && selectedCategory && (
          <SubcategoryDetailView 
            subcategoryName={selectedSubcategoryName}
            categoryName={selectedCategory.name}
            onBack={() => handleNavigate('category_detail')}
            onStoreClick={(s) => { setSelectedStore(s); handleNavigate('store_detail'); }}
            stores={STORES}
            userRole={userRole}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'store_detail' && selectedStore && (
          <StoreDetailView 
            store={selectedStore} 
            onBack={() => handleNavigate(previousTab)} 
            onNavigate={handleNavigate}
            onClaim={() => { setStoreToClaim(selectedStore); setIsClaimFlowActive(true); }}
          />
        )}

        {activeTab === 'neighborhood_posts' && (
          <NeighborhoodPostsView 
            onBack={() => handleNavigate('home')}
            onStoreClick={(s) => { setSelectedStore(s); handleNavigate('store_detail'); }}
            user={user}
            onRequireLogin={() => setIsAuthOpen(true)}
            userRole={userRole}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'classifieds' && (
          <ClassifiedsView 
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
            user={user}
            onRequireLogin={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <MenuView 
            user={user}
            userRole={userRole}
            onAuthClick={() => setIsAuthOpen(true)}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
          />
        )}

        {activeTab === 'store_area' && (
          <StoreAreaView 
            onBack={() => handleNavigate('profile')}
            onNavigate={handleNavigate}
            user={user}
          />
        )}

        {activeTab === 'admin_panel' && isAdmin && (
          <AdminPanel 
            onLogout={signOut}
            viewMode={viewMode}
            onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)}
            onNavigateToApp={handleNavigate}
            onOpenMonitorChat={(id: string) => handleNavigate('service_chat', { requestId: id })}
            initialTab={adminInitialTab}
          />
        )}

        {activeTab === 'plan_selection' && (
          <PlanSelectionView 
            onBack={() => handleNavigate(previousTab)}
            onSuccess={() => handleNavigate('store_area')}
          />
        )}

        {activeTab === 'classified_detail' && selectedClassified && (
          <ClassifiedDetailView 
            item={selectedClassified} 
            onBack={() => handleNavigate(previousTab)} 
            onRequireLogin={() => setIsAuthOpen(true)}
            user={user}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsView 
            onBack={() => handleNavigate('classifieds')}
            onJobClick={(j) => { setSelectedJob(j); handleNavigate('job_detail'); }}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'job_detail' && selectedJob && (
          <JobDetailView 
            job={selectedJob} 
            onBack={() => handleNavigate(previousTab)} 
          />
        )}

        {activeTab === 'real_estate' && (
          <RealEstateView 
            onBack={() => handleNavigate('classifieds')}
            user={user}
            onRequireLogin={() => setIsAuthOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'real_estate_detail' && selectedProperty && (
          <RealEstateDetailView 
            property={selectedProperty} 
            onBack={() => handleNavigate(previousTab)} 
            onRequireLogin={() => setIsAuthOpen(true)}
            user={user}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView 
            onBack={() => handleNavigate(previousTab)}
            onNavigate={handleNavigate}
            userRole={userRole}
          />
        )}

        {activeTab === 'user_coupons' && (
          <UserCupomScreen 
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
            onStoreClick={(s) => { setSelectedStore(s); handleNavigate('store_detail'); }}
          />
        )}

        {activeTab === 'weekly_reward_page' && (
          <WeeklyRewardPage 
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'user_profile_full' && user && (
          <UserProfileFullView 
            onBack={() => handleNavigate('profile')}
            onEdit={() => handleNavigate('edit_profile_view')}
          />
        )}

        {activeTab === 'edit_profile_view' && user && (
          <EditProfileView 
            user={user}
            onBack={() => handleNavigate('user_profile_full')}
          />
        )}

        {activeTab === 'store_ads_module' && (
            <StoreAdsModule 
               onBack={() => handleNavigate('profile')}
               onNavigate={handleNavigate}
               user={user}
               initialView={initialModuleView}
            />
        )}

        {activeTab === 'merchant_coupons' && (
            <MerchantCouponsModule onBack={() => handleNavigate('profile')} />
        )}

        {activeTab === 'service_chat' && activeServiceRequestId && (
            <ServiceChatView 
                requestId={activeServiceRequestId} 
                professionalId={activeProfessionalId || ''}
                userRole={chatRole} 
                onBack={() => handleNavigate('home')} 
            />
        )}

        {activeTab === 'patrocinador_master' && (
            <PatrocinadorMasterScreen onBack={() => handleNavigate('home')} />
        )}

        {activeTab === 'services_landing' && (
            <ServicesLandingView onBack={() => handleNavigate('classifieds')} onNavigate={handleNavigate} user={user} onRequireLogin={() => setIsAuthOpen(true)} />
        )}

        {activeTab === 'service_messages_list' && (
            <ServiceMessagesListView 
                onBack={() => handleNavigate('home')}
                onOpenChat={(reqId, proId) => handleNavigate('service_chat', { requestId: reqId, professionalId: proId, role: 'resident' })}
            />
        )}
        
        {activeTab === 'coupon_landing' && (
            <CouponLandingView 
               onBack={() => handleNavigate('home')}
               onLogin={() => setIsAuthOpen(true)}
            />
        )}

        <MoreCategoriesModal 
          isOpen={isMoreCategoriesOpen}
          onClose={() => setIsMoreCategoriesOpen(false)}
          onSelectCategory={handleSelectCategory}
        />
      </Layout>

      <JotaAssistant 
        isOpen={isJotaOpen} 
        onClose={() => setIsJotaOpen(false)} 
        onNavigate={handleNavigate}
        initialMessage={jotaInitialQuery}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        user={user} 
      />

      {isRoleSwitcherOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-sm rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 text-center">Alternar Visão</h2>
            <div className="grid gap-3">
              {(['ADM', 'Usuário', 'Lojista', 'Designer'] as RoleMode[]).map(mode => (
                <button 
                  key={mode}
                  onClick={() => { setViewMode(mode); localStorage.setItem('admin_view_mode', mode); setIsRoleSwitcherOpen(false); }}
                  className={`py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${viewMode === mode ? 'bg-[#1E5BFF] text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button onClick={() => setIsRoleSwitcherOpen(false)} className="w-full mt-6 py-4 text-gray-400 font-bold uppercase text-[10px]">Cancelar</button>
          </div>
        </div>
      )}

      {isClaimFlowActive && storeToClaim && (
        <StoreClaimFlow 
          store={storeToClaim} 
          userId={user?.id || ''} 
          onBack={() => setIsClaimFlowActive(false)}
          onSuccess={() => { setIsClaimFlowActive(false); handleNavigate('store_area'); }}
          onNavigate={handleNavigate}
        />
      )}
    </NeighborhoodProvider>
  );
};

export default App;
