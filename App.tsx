
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
// FIX: Added missing CheckCircle2 import to resolve "Cannot find name 'CheckCircle2'" error
import { MapPin, X, Palette, Sparkles, ShieldCheck, User as UserIcon, Store as StoreIcon, Eye, CheckCircle2 } from 'lucide-react';
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

export type RoleMode = 'Administrador' | 'Usuário' | 'Lojista' | 'Visitante' | 'Designer';

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
    }, 5000);

    const removeTimeout = setTimeout(() => {
      setIsSplashVisible(false);
      splashWasShownInSession = true;
    }, 5800);

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
                setViewMode('Administrador');
                localStorage.setItem('admin_view_mode', 'Administrador');
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
  const handleSelectJob = (job: Job) => { handleNavigate('job_detail', { job }); };
  
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

  const handleHealthPreFilterChoice = (option: string) => {
      if (option === 'MULHER') handleNavigate('health_woman');
      else if (option === 'HOMEM') handleNavigate('health_man');
      else if (option === 'PEDIATRIA') handleNavigate('health_pediatrics');
      else if (option === 'GERIATRIA') handleNavigate('health_geriatrics');
      else {
          setHealthPreFilter(null);
          handleNavigate('category_detail');
      }
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

  const headerExclusionList = ['store_area', 'store_detail', 'profile', 'patrocinador_master', 'merchant_performance', 'classifieds', 'services', 'services_landing', 'merchant_leads', 'service_chat', 'admin_panel', 'category_detail', 'subcategory_detail', 'sponsor_info', 'real_estate', 'jobs', 'job_detail', 'job_wizard', 'adoption', 'donations', 'desapega', 'category_banner_sales', 'banner_sales_wizard', 'weekly_reward_page', 'user_coupons', 'notifications', 'store_profile', 'about', 'support', 'favorites', 'user_statement', 'service_messages_list', 'merchant_reviews', 'merchant_coupons', 'merchant_promotions', 'store_finance', 'store_support', 'real_estate_wizard', 'real_estate_detail', 'plan_selection', 'classified_detail', 'classified_search_results', 'user_activity', 'my_neighborhoods', 'privacy_policy', 'app_suggestion', 'designer_panel', 'store_connect', 'merchant_panel', 'store_ads_module', 'store_sponsored', 'about_app', 'coupon_landing', 'user_profile_full', 'edit_profile_view', 'all_categories', 'health_pre_filter', 'health_woman', 'health_man', 'health_pediatrics', 'health_geriatrics', 'explore'];
  
  const RoleSwitcherModal: React.FC = () => {
    if (!isRoleSwitcherOpen) return null;
    
    const roles: { id: RoleMode; label: string; icon: any; color: string }[] = [
        { id: 'Administrador', label: 'Administrador', icon: ShieldCheck, color: 'text-amber-500' },
        { id: 'Lojista', label: 'Lojista (Dashboard)', icon: StoreIcon, color: 'text-blue-500' },
        { id: 'Usuário', label: 'Usuário (Residente)', icon: UserIcon, color: 'text-emerald-500' },
        { id: 'Visitante', label: 'Visitante (Deslogado)', icon: Eye, color: 'text-gray-400' },
        { id: 'Designer', label: 'Designer (Jobs)', icon: Palette, color: 'text-indigo-400' }
    ];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setIsRoleSwitcherOpen(false)}>
            <div className="bg-[#111827] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-8 px-2">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Simulador de Acesso</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Troque sua visão do app</p>
                    </div>
                    <button onClick={() => setIsRoleSwitcherOpen(false)} className="p-2 bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-3">
                    {roles.map((role) => (
                        <button 
                          key={role.id} 
                          onClick={() => { 
                            setViewMode(role.id); 
                            localStorage.setItem('admin_view_mode', role.id); 
                            setIsRoleSwitcherOpen(false); 
                            if (role.id === 'Lojista') setActiveTab('profile'); 
                            else if (role.id === 'Administrador') setActiveTab('admin_panel'); 
                            else if (role.id === 'Designer') setActiveTab('designer_panel');
                            else setActiveTab('home'); 
                          }} 
                          className={`w-full p-5 rounded-[1.5rem] border text-left transition-all group flex items-center justify-between ${viewMode === role.id ? 'bg-white border-white text-black' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${viewMode === role.id ? 'bg-black/5 text-black' : `bg-white/5 ${role.color}`}`}>
                                    <role.icon size={20} strokeWidth={2.5} />
                                </div>
                                <span className="font-black uppercase text-sm tracking-tight">{role.label}</span>
                            </div>
                            {viewMode === role.id && <CheckCircle2 size={18} className="text-black" />}
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

          <div className={`w-full max-w-md h-[100dvh] transition-opacity duration-1000 ease-out ${!isSplashVisible || isFadingOut ? 'opacity-100' : 'opacity-0'}`}>
              <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={userRole as any} hideNav={false}>
                  {!headerExclusionList.includes(activeTab) && (
                    <Header isDarkMode={theme === 'dark'} toggleTheme={() => {}} onNotificationClick={() => handleNavigate('notifications')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={handleNavigate} activeTab={activeTab} userRole={userRole as any} stores={STORES} onStoreClick={handleSelectStore} isAdmin={isAdmin} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
                  )}
                  <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onSelectCategory={handleSelectCategory} onStoreClick={handleSelectStore} stores={STORES} user={user as any} userRole={userRole as any} />}
                    {activeTab === 'explore' && (
                        <ExploreView 
                            stores={STORES} 
                            searchQuery={globalSearch} 
                            onStoreClick={handleSelectStore} 
                            onNavigate={handleNavigate}
                            onLocationClick={() => {}}
                            onFilterClick={() => {}}
                            onOpenPlans={() => {}}
                        />
                    )}
                    
                    {activeTab === 'health_pre_filter' && (
                        <HealthPreFilterView 
                            onBack={() => handleNavigate('home')} 
                            onSelectOption={handleHealthPreFilterChoice}
                        />
                    )}

                    {activeTab === 'health_woman' && (
                        <HealthSubSpecialtiesView 
                            title="Saúde da Mulher"
                            subtitle="Cuidado Feminino"
                            themeColor="text-pink-500"
                            specialties={['Ginecologia', 'Obstetrícia', 'Mastologia', 'Endocrinologia feminina', 'Reprodução humana', 'Fertilidade feminina', 'Planejamento familiar', 'Saúde sexual feminina', 'Saúde íntima feminina', 'Climatério', 'Menopausa', 'Ginecologia oncológica', 'Ginecologia endócrina', 'Uroginecologia', 'Colposcopia', 'Patologia do trato genital inferior', 'Medicina fetal', 'Pré-natal de alto risco', 'Dor pélvica crônica']}
                            onBack={() => handleNavigate('health_pre_filter')}
                            onSelectStore={handleSelectStore}
                        />
                    )}

                    {activeTab === 'health_man' && (
                        <HealthSubSpecialtiesView 
                            title="Saúde do Homem"
                            subtitle="Cuidado Masculino"
                            themeColor="text-blue-500"
                            specialties={['Urologia', 'Andrologia', 'Endocrinologia masculina', 'Saúde sexual masculina', 'Fertilidade masculina', 'Saúde prostática', 'Distúrbios hormonais masculinos', 'Urologia oncológica', 'Urologia functional', 'Saúde do envelhecimento masculino', 'Infertilidade masculina', 'Disfunção erétil', 'Ejaculação precoce', 'Hipogonadismo']}
                            onBack={() => handleNavigate('health_pre_filter')}
                            onSelectStore={handleSelectStore}
                        />
                    )}

                    {activeTab === 'health_pediatrics' && (
                        <HealthSubSpecialtiesView 
                            title="Pediatria"
                            subtitle="Cuidado Infantil"
                            themeColor="text-teal-500"
                            specialties={['Pediatria geral', 'Neonatologia', 'Puericultura', 'Pediatria preventiva', 'Alergologia pediátrica', 'Endocrinologia pediátrica', 'Neuropediatria', 'Gastroenterologia pediátrica', 'Pneumologia pediátrica', 'Cardiologia pediátrica', 'Nefrologia pediátrica', 'Hematologia pediátrica', 'Oncologia pediátrica', 'Infectologia pediátrica', 'Reumatologia pediátrica', 'Genética médica pediátrica', 'Psiquiatria infantil', 'Ortopedia pediátrica', 'Cirurgia pediátrica']}
                            onBack={() => handleNavigate('health_pre_filter')}
                            onSelectStore={handleSelectStore}
                        />
                    )}

                    {activeTab === 'health_geriatrics' && (
                        <HealthSubSpecialtiesView 
                            title="Geriatria"
                            subtitle="Melhor Idade"
                            themeColor="text-amber-500"
                            specialties={['Geriatria', 'Clínica geriátrica', 'Gerontologia', 'Medicina do envelhecimento', 'Fisioterapia geriátrica', 'Fisioterapia domiciliar', 'Enfermagem domiciliar', 'Home care', 'Cuidados paliativos', 'Cuidados continuados', 'Psicologia geriátrica', 'Psiquiatria geriátrica', 'Terapia ocupacional geriátrica', 'Fonoaudiologia geriátrica', 'Nutrição geriátrica', 'Reabilitação geriátrica', 'Ortopedia geriátrica', 'Cardiologia geriátrica', 'Neurologia geriátrica', 'Avaliação multidisciplinar do idoso']}
                            onBack={() => handleNavigate('health_pre_filter')}
                            onSelectStore={handleSelectStore}
                        />
                    )}

                    {activeTab === 'all_categories' && (
                        <CategoriesPageView 
                            onBack={() => handleNavigate('home')} 
                            onSelectCategory={handleSelectCategory}
                        />
                    )}

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
                        initialSubcategory={healthPreFilter || undefined}
                        onBack={() => { 
                            setHealthPreFilter(null);
                            handleNavigate(selectedCategory.id === 'cat-saude' ? 'health_pre_filter' : 'home'); 
                        }} 
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
                        : <MenuView user={user as any} userRole={userRole as any} onAuthClick={() => setIsAuthOpen(true)} onNavigate={handleNavigate} onBack={() => handleNavigate('home')} />
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
                        <MerchantPromotionsModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'store_finance' && (
                        <StoreFinanceModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'store_support' && (
                        <StoreSupportModule onBack={() => handleNavigate('profile')} />
                    )}

                    {activeTab === 'store_connect' && (
                        <StoreConnectModule onBack={() => handleNavigate('profile')} />
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
                    {activeTab === 'adoption' && <AdoptionView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'donations' && <DonationsView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'desapega' && <DesapegaView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    
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
                  <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} />
              </Layout>
              <RoleSwitcherModal />
          </div>

          {/* SPLASH SCREEN PREMIUM REFINADA */}
          {isSplashVisible && (
            <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-16 transition-opacity duration-800 ease-in-out bg-splash-premium ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              
              {/* Micro-partículas e brilhos de fundo */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full blur-sm animate-subtle-glow" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full blur-sm animate-subtle-glow" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 bg-white rounded-full blur-sm animate-subtle-glow" style={{ animationDelay: '4s' }}></div>
                  <div className="absolute inset-0 bg-white/[0.02] animate-particle-drift"></div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
                  {/* Logo com animação premium (escala + fade) */}
                  <div className="relative w-32 h-32 bg-white rounded-[2.8rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-10 animate-logo-enter border border-white/20">
                    <MapPin className="w-16 h-16 text-[#1E5BFF] fill-[#1E5BFF]" />
                    <div className="absolute -inset-2 bg-white/20 rounded-[3rem] blur-xl opacity-0 animate-pulse"></div>
                  </div>
                  
                  {/* Título Principal Sincronizado */}
                  <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    Localizei JPA
                  </h1>
                  
                  {/* Slogan com Animação Premium Slide Up e Glow */}
                  <div className="mt-6 opacity-0 animate-slide-up-fade" style={{ animationDelay: '1.2s' }}>
                    <p className="text-xl font-bold text-white tracking-tight animate-text-shine">
                      Seu bairro, na sua mão.
                    </p>
                    <div className="w-12 h-1 bg-white/30 mx-auto mt-3 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-1/3 rounded-full animate-slow-shimmer"></div>
                    </div>
                  </div>
              </div>
              
              {/* Assinatura Institucional de Patrocinador Master */}
              <div className="relative z-10 text-center animate-fade-in opacity-0" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
                <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] mb-1">Patrocinador Master</p>
                <p className="text-base font-display font-extrabold text-white/90 tracking-wide">Grupo Esquematiza</p>
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};
export default App;
