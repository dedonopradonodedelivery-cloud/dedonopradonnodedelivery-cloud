
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
import { StoreAreaView } from '@/components/StoreAreaView';
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
import { DonationsView } from '@/components/DonationsView';
import { DesapegaView } from '@/components/DesapegaView';
import { MerchantPerformanceDashboard } from '@/components/MerchantPerformanceDashboard';
import { NeighborhoodPostsView } from '@/components/NeighborhoodPostsView';
import { SavedPostsView } from '@/components/SavedPostsView';
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
import { JPAConnectSalesView } from '@/components/JPAConnectSalesView';
import { StoreClaimFlow } from '@/components/StoreClaimFlow';
import { AppSuggestionView } from '@/components/AppSuggestionView';
import { CouponLandingView } from '@/components/CouponLandingView';
import { MapPin, X, Palette, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NeighborhoodProvider } from '@/contexts/NeighborhoodContext';
import { Category, Store, Job, RealEstateProperty, PlanType, Classified } from '@/types';
import { STORES } from '@/constants';
import { AboutView, SupportView, FavoritesView, UserActivityView, MyNeighborhoodsView, PrivacyView, AboutAppView } from '@/components/SimplePages';
import { MerchantPanel } from '@/components/MerchantPanel';
import { UserProfileFullView } from '@/components/UserProfileFullView';
import { EditProfileView } from '@/components/EditProfileView';
import { useFeatures, FeatureKey } from '@/contexts/FeatureContext';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante' | 'Designer';

const FeatureUnavailableView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-6 text-[#1E5BFF]">
            <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">Acesso Restrito</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed mb-10">
            Esta funcionalidade não está disponível no momento.
        </p>
        <button onClick={onBack} className="w-full max-w-xs bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all">Voltar ao Início</button>
    </div>
);

const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const { theme } = useTheme();
  const { isFeatureActive } = useFeatures();
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
  
  const [activityType, setActivityType] = useState<string>('');
  const [initialModuleView, setInitialModuleView] = useState<'sales' | 'chat' | undefined>(undefined);

  const [activeServiceRequestId, setActiveServiceRequestId] = useState<string | null>(null);
  const [activeProfessionalId, setActiveProfessionalId] = useState<string | null>(null);
  const [chatRole, setChatRole] = useState<'resident' | 'merchant' | 'admin'>('resident');

  const [sloganText, setSloganText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullSlogan = 'Seu bairro, na sua mão.';

  const [isClaimFlowActive, setIsClaimFlowActive] = useState(false);
  const [storeToClaim, setStoreToClaim] = useState<Store | null>(null);

  // FIX: The 'isAdmin' variable was used before it was declared.
  // It has been moved here from the bottom of the component along with
  // 'isMerchantMode' which depends on it.
  const isAdmin = user?.email === ADMIN_EMAIL;
  const isMerchantMode = userRole === 'lojista' || (isAdmin && viewMode === 'Lojista');

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
    // MAPEAMENTO DE SEGURANÇA: Aba -> Feature Flag correspondente
    const routeMapping: Partial<Record<string, FeatureKey>> = {
        'home': 'home_tab',
        'explore': 'explore_guide',
        'classifieds': 'classifieds',
        'neighborhood_posts': 'community_feed',
        'coupon_landing': 'coupons',
        'user_coupons': 'coupons',
        'merchant_coupons': 'coupons',
        // Funcionalidades de Crescimento
        'store_sponsored': 'sponsored_ads',
        'store_ads_module': 'banner_highlights',
        'sponsor_info': 'master_sponsor',
        // Outros
        'merchant_reviews': 'customer_reviews',
        'merchant_leads': 'service_chat',
        'service_messages_list': 'service_chat'
    };

    const requiredFeature = routeMapping[view];
    
    // BLOQUEIO LOGÍCO: Se a aba estiver OFF no ADM, redireciona para Home
    if (requiredFeature && !isFeatureActive(requiredFeature) && !isAdmin) {
        console.warn(`Tentativa de acesso a recurso desativado: ${view}`);
        setActiveTab('home');
        return;
    }

    if (view !== 'sponsor_info' && view !== 'notifications' && view !== 'patrocinador_master' && view !== 'real_estate_detail' && view !== 'job_detail' && view !== 'plan_selection' && view !== 'classified_detail' && view !== 'classified_search_results' && view !== 'user_activity' && view !== 'app_suggestion' && view !== 'designer_panel' && view !== 'jpa_connect' && view !== 'merchant_panel' && view !== 'coupon_landing' && view !== 'feature_unavailable') {
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
    }, 96);
    return () => clearTimeout(typingTimeout);
  }, [sloganText, splashStage]);

  useEffect(() => {
    if (splashStage === 4) return;
    // Splash permanece visível por 5 segundos antes de iniciar o fade-out (stage 3)
    const fadeOutTimer = setTimeout(() => setSplashStage(3), 5000);
    // Completa a transição de fade-out e dissolve aos 5.6 segundos para ser suave
    const endSplashTimer = setTimeout(() => {
      setSplashStage(4);
      splashWasShownInSession = true;
    }, 5600);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(endSplashTimer);
    };
  }, [splashStage]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); handleNavigate('store_detail'); };
  const handleSelectJob = (job: Job) => { handleNavigate('job_detail', { job }); };
  
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    handleNavigate('category_detail');
  };

  const handleSelectSubcategory = (subName: string, parentCat: Category) => {
    setSelectedSubcategoryName(subName);
    setSelectedCategory(parentCat);
    handleNavigate('subcategory_detail');
  };

  const handleClaimStore = (store: Store) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setStoreToClaim(store);
    setIsClaimFlowActive(true);
  };

  const handleClaimSuccess = () => {
    setIsClaimFlowActive(false);
    handleNavigate('profile');
  };

  const handlePlanSuccess = (plan: PlanType) => {
      localStorage.setItem('merchant_plan', plan);
      handleNavigate('profile');
  };

  const headerExclusionList = ['store_area', 'store_detail', 'profile', 'patrocinador_master', 'merchant_performance', 'neighborhood_posts', 'saved_posts', 'classifieds', 'services', 'services_landing', 'merchant_leads', 'service_chat', 'admin_panel', 'category_detail', 'subcategory_detail', 'sponsor_info', 'real_estate', 'jobs', 'job_detail', 'job_wizard', 'donations', 'desapega', 'category_banner_sales', 'banner_sales_wizard', 'weekly_reward_page', 'user_coupons', 'notifications', 'store_profile', 'about', 'support', 'favorites', 'user_statement', 'service_messages_list', 'merchant_reviews', 'merchant_coupons', 'merchant_promotions', 'store_finance', 'store_support', 'real_estate_wizard', 'real_estate_detail', 'plan_selection', 'classified_detail', 'classified_search_results', 'user_activity', 'my_neighborhoods', 'privacy_policy', 'app_suggestion', 'designer_panel', 'jpa_connect', 'merchant_panel', 'store_ads_module', 'store_sponsored', 'about_app', 'coupon_landing', 'user_profile_full', 'edit_profile_view', 'feature_unavailable'];
  
  const RoleSwitcherModal: React.FC = () => {
    if (!isRoleSwitcherOpen) return null;
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setIsRoleSwitcherOpen(false)}>
            <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-8 px-2">
                    <h2 className="text-xl font-black text-white uppercase">Modo de Visualização</h2>
                    <button onClick={() => setIsRoleSwitcherOpen(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
                </div>
                <div className="space-y-3">
                    {(['ADM', 'Usuário', 'Lojista', 'Visitante', 'Designer'] as RoleMode[]).map((role) => (
                        <button 
                          key={role} 
                          onClick={() => { 
                            setViewMode(role); 
                            localStorage.setItem('admin_view_mode', role); 
                            setIsRoleSwitcherOpen(false); 
                            if (role === 'Lojista') setActiveTab('profile'); 
                            else if (role === 'ADM') setActiveTab('admin_panel'); 
                            else if (role === 'Designer') setActiveTab('designer_panel');
                            else setActiveTab('home'); 
                          }} 
                          className={`w-full p-5 rounded-[1.5rem] border text-left transition-all ${viewMode === role ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white'}`}
                        >
                            <div className="flex items-center justify-between"><span className="font-black uppercase">{role}</span>{role === 'Designer' && <Palette size={16} className="text-indigo-400" />}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <NeighborhoodProvider>
        <div className="min-h-screen bg-white dark:bg-gray-950 flex justify-center relative transition-colors duration-300">
          
          {isClaimFlowActive && storeToClaim && user && (
            <StoreClaimFlow 
              store={storeToClaim} 
              userId={user.id} 
              onBack={() => setIsClaimFlowActive(false)} 
              onSuccess={handleClaimSuccess}
              onNavigate={handleNavigate}
            />
          )}

          <div className={`w-full max-w-md h-[100dvh] transition-opacity duration-700 ease-in-out ${splashStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={userRole} hideNav={false}>
                  {!headerExclusionList.includes(activeTab) && (
                    <Header onNotificationClick={() => handleNavigate('notifications')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={handleNavigate} activeTab={activeTab} userRole={userRole as any} stores={STORES} onStoreClick={handleSelectStore} isAdmin={isAdmin} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onSelectCategory={handleSelectCategory} />
                  )}
                  <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onStoreClick={handleSelectStore} stores={STORES} user={user as any} userRole={userRole} />}
                    {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={handleNavigate} />}
                    {activeTab === 'feature_unavailable' && <FeatureUnavailableView onBack={() => handleNavigate('home')} />}
                    
                    {activeTab === 'services_landing' && <ServicesLandingView onBack={() => handleNavigate('home')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'services' && <ServicesView onNavigate={(view) => handleNavigate(view)} onOpenChat={(id: string) => { setActiveServiceRequestId(id); handleNavigate('service_messages_list'); }} />}

                    {activeTab === 'service_messages_list' && (
                        <ServiceMessagesListView 
                            onBack={() => handleNavigate('home')}
                            onOpenChat={(reqId, proId) => handleNavigate('service_chat', { requestId: reqId, professionalId: proId, role: 'resident' })}
                        />
                    )}

                    {activeTab === 'weekly_reward_page' && (
                        <WeeklyRewardPage 
                            onBack={() => handleNavigate('home')} 
                            onNavigate={handleNavigate}
                        />
                    )}
                    
                    {activeTab === 'coupon_landing' && (
                        <CouponLandingView 
                           onBack={() => handleNavigate('home')}
                           onLogin={() => setIsAuthOpen(true)}
                        />
                    )}

                    {activeTab === 'user_coupons' && (
                        <UserCupomScreen 
                            onBack={() => handleNavigate('profile')}
                            onNavigate={handleNavigate}
                            onStoreClick={handleSelectStore}
                        />
                    )}

                    {activeTab === 'user_statement' && (
                        <UserStatementView 
                            onBack={() => handleNavigate('profile')}
                            onExploreStores={() => handleNavigate('explore')}
                        />
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationsView 
                            onBack={() => handleNavigate('home')}
                            onNavigate={handleNavigate}
                            userRole={userRole as any}
                        />
                    )}

                    {activeTab === 'banner_sales_wizard' && (
                        <BannerSalesWizard 
                            user={user} 
                            onBack={() => handleNavigate('profile')} 
                            onNavigate={handleNavigate}
                        />
                    )}
                    
                    {activeTab === 'store_ads_module' && (
                        <StoreAdsModule 
                           onBack={() => handleNavigate('profile')}
                           onNavigate={handleNavigate}
                           categoryName={undefined}
                           user={user}
                           viewMode={viewMode}
                           initialView={initialModuleView}
                        />
                    )}
                    
                    {activeTab === 'store_sponsored' && (
                        <StoreSponsoredAds 
                           onBack={() => handleNavigate('profile')}
                           onNavigate={handleNavigate}
                        />
                    )}

                    {activeTab === 'category_banner_sales' && (
                        <CategoryBannerSalesView 
                            user={user} 
                            onBack={() => handleNavigate('profile')} 
                            onSuccess={() => handleNavigate('profile')}
                        />
                    )}

                    {activeTab === 'category_detail' && selectedCategory && (
                      <CategoryView 
                        category={selectedCategory} 
                        onBack={() => handleNavigate('home')} 
                        onStoreClick={handleSelectStore} 
                        stores={STORES} 
                        userRole={userRole as any} 
                        onAdvertiseInCategory={() => {}} 
                        onNavigate={handleNavigate}
                        onSubcategoryClick={(subName) => handleSelectSubcategory(subName, selectedCategory)}
                      />
                    )}

                    {activeTab === 'subcategory_detail' && selectedSubcategoryName && selectedCategory && (
                      <SubcategoryDetailView 
                        subcategoryName={selectedSubcategoryName}
                        categoryName={selectedCategory.name}
                        onBack={() => handleNavigate('category_detail')}
                        onStoreClick={handleSelectStore}
                        stores={STORES}
                        userRole={userRole as any}
                        onNavigate={handleNavigate}
                      />
                    )}
                    
                    {activeTab === 'profile' && (
                      isMerchantMode 
                        ? <StoreAreaView 
                            onBack={() => handleNavigate('home')} 
                            onNavigate={handleNavigate} 
                            user={user as any} 
                          />
                        : <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={handleNavigate} onBack={() => handleNavigate('home')} />
                    )}

                    {activeTab === 'user_profile_full' && (
                        <UserProfileFullView onBack={() => handleNavigate('profile')} onEdit={() => handleNavigate('edit_profile_view')} />
                    )}

                    {activeTab === 'edit_profile_view' && user && (
                        <EditProfileView user={user} onBack={() => handleNavigate('user_profile_full')} />
                    )}
                    
                    {activeTab === 'merchant_panel' && <MerchantPanel onBack={() => handleNavigate('profile')} />}

                    {activeTab === 'store_profile' && (
                      <StoreProfileEdit 
                        onBack={() => handleNavigate('profile')} 
                      />
                    )}

                    {activeTab === 'merchant_performance' && <MerchantPerformanceDashboard onBack={() => handleNavigate('profile')} onNavigate={handleNavigate} />}
                    {activeTab === 'merchant_leads' && <MerchantLeadsView isAdmin={isAdmin} onBack={() => handleNavigate('profile')} onOpenChat={(id: string) => { handleNavigate('service_chat', { requestId: id, role: 'merchant' }); }} />}
                    
                    {activeTab === 'merchant_reviews' && (
                        <MerchantReviewsModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'merchant_coupons' && (
                        <MerchantCouponsModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'merchant_promotions' && (
                        <MerchantPromotionsModule onBack={() => handleNavigate('profile')} onNavigate={handleNavigate} />
                    )}

                    {activeTab === 'store_finance' && (
                        <StoreFinanceModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'store_support' && (
                        <StoreSupportModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'jpa_connect' && (
                        <JPAConnectSalesView onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'service_chat' && activeServiceRequestId && (
                        <ServiceChatView 
                            requestId={activeServiceRequestId} 
                            professionalId={activeProfessionalId || ''}
                            userRole={chatRole} 
                            onBack={() => {
                                if (activeServiceRequestId.startsWith('DSG-') || activeServiceRequestId.startsWith('MASTER-')) {
                                    handleNavigate('home');
                                } else {
                                    handleNavigate(isMerchantMode ? 'merchant_leads' : 'service_messages_list');
                                }
                            }} 
                        />
                    )}

                    {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={handleNavigate} onOpenMonitorChat={(id: string) => { setActiveServiceRequestId(id); setChatRole('admin'); handleNavigate('service_chat'); }} initialTab={adminInitialTab} />}
                    
                    {activeTab === 'designer_panel' && user && (
                      <DesignerPanel user={user} onBack={() => handleNavigate('home')} />
                    )}
                    
                    {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => handleNavigate(previousTab)} onClaim={() => handleClaimStore(selectedStore)} onNavigate={handleNavigate} />}
                    {activeTab === 'classifieds' && <ClassifiedsView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} user={user} onRequireLogin={() => setIsAuthOpen(true)} />}
                    {activeTab === 'classified_search_results' && <ClassifiedSearchResultsView searchTerm={classifiedSearchTerm} onBack={() => handleNavigate('classifieds')} onNavigate={handleNavigate} />}
                    {activeTab === 'real_estate' && <RealEstateView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'real_estate_wizard' && <RealEstateWizard user={user} onBack={() => handleNavigate('real_estate')} onComplete={() => handleNavigate('real_estate')} onNavigate={handleNavigate} />}
                    {activeTab === 'real_estate_detail' && selectedProperty && <RealEstateDetailView property={selectedProperty} onBack={() => handleNavigate('real_estate')} user={user} onRequireLogin={() => setIsAuthOpen(true)} />}
                    {activeTab === 'classified_detail' && selectedClassified && <ClassifiedDetailView item={selectedClassified} onBack={() => handleNavigate(previousTab)} user={user} onRequireLogin={() => setIsAuthOpen(true)} />}
                    {activeTab === 'jobs' && <JobsView onBack={() => handleNavigate('classifieds')} onJobClick={handleSelectJob} onNavigate={handleNavigate} />}
                    {activeTab === 'job_wizard' && <JobWizard user={user} onBack={() => handleNavigate('jobs')} onComplete={() => handleNavigate('jobs')} />}
                    {activeTab === 'job_detail' && selectedJob && <JobDetailView job={selectedJob} onBack={() => handleNavigate('jobs')} />}
                    {activeTab === 'plan_selection' && <PlanSelectionView onBack={() => handleNavigate('profile')} onSuccess={handlePlanSuccess} />}
                    {activeTab === 'donations' && <DonationsView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'desapega' && <DesapegaView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'neighborhood_posts' && <NeighborhoodPostsView onBack={() => handleNavigate('home')} onStoreClick={handleSelectStore} user={user} onRequireLogin={() => setIsAuthOpen(true)} userRole={userRole} onNavigate={handleNavigate} />}
                    {activeTab === 'saved_posts' && <SavedPostsView onBack={() => handleNavigate('profile')} onStoreClick={handleSelectStore} onRequireLogin={() => setIsAuthOpen(true)} />}
                    
                    {activeTab === 'sponsor_info' && <SponsorInfoView onBack={() => handleNavigate('profile')} onNavigate={handleNavigate} />}
                    {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => handleNavigate('home')} />}
                    
                    {activeTab === 'user_activity' && <UserActivityView type={activityType} onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'my_neighborhoods' && <MyNeighborhoodsView onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'privacy_policy' && <PrivacyView onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'app_suggestion' && <AppSuggestionView user={user as any} onBack={() => handleNavigate('profile')} />}

                    {activeTab === 'about' && <AboutView onBack={() => handleNavigate(previousTab)} />}
                    {activeTab === 'support' && <SupportView onBack={() => handleNavigate(previousTab)} />}
                    {activeTab === 'favorites' && <FavoritesView onBack={() => handleNavigate(previousTab)} user={user} onNavigate={handleNavigate} />}
                    {activeTab === 'about_app' && <AboutAppView onBack={() => handleNavigate('profile')} />}
                  </main>
                  <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} customTitle={undefined} customSubtitle={undefined} />
              </Layout>
              <RoleSwitcherModal />
          </div>

          {splashStage < 4 && (
            <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-16 transition-opacity duration-700 ease-in-out ${splashStage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: '#1E5BFF' }}>
              <div className="flex flex-col items-center animate-logo-enter text-center px-4">
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8"><MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" /></div>
                  <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-md">
                    Localizei JPA
                  </h1>
                  <p className="text-lg font-medium text-white/90 mt-2 h-8 flex items-center justify-center font-sans">
                    {sloganText}
                    {isTyping && <span className="animate-blink ml-1">|</span>}
                  </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Patrocinador Master</p>
                <p className="text-lg font-display font-bold text-white mt-1 tracking-wide">Grupo Esquematiza</p>
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};
export default App;