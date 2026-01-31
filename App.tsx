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
import { StoreAreaView } from '@/components/StoreAreaView';
import { ClassifiedsView } from '@/components/ClassifiedsView';
import { RealEstateView } from '@/components/RealEstateView';
import { JobsView } from '@/components/JobsView';
import { JobDetailView } from '@/components/JobDetailView';
import { MerchantPerformanceDashboard } from '@/components/MerchantPerformanceDashboard';
import { NeighborhoodPostsView } from '@/components/NeighborhoodPostsView';
import { SavedPostsView } from '@/components/SavedPostsView';
import { AdminPanel } from '@/components/AdminPanel';
import { MerchantLeadsView } from '@/components/MerchantLeadsView';
import { ServiceChatView } from '@/components/ServiceChatView';
import { CategoryView } from '@/components/CategoryView';
import { SubcategoryDetailView } from '@/components/SubcategoryDetailView';
import { SponsorInfoView } from '@/components/SponsorInfoView';
import { ServicesLandingView } from '@/components/ServicesLandingView';
import { CategoryBannerSalesView } from '@/components/CategoryBannerSalesView';
import { BannerSalesWizard } from '@/components/BannerSalesWizard'; 
import { WeeklyRewardPage } from '@/components/WeeklyRewardPage'; 
import { UserCupomScreen } from '@/components/UserCupomScreen'; 
import { NotificationsView } from '@/components/NotificationsView';
import { MapPin, X, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NeighborhoodProvider } from '@/contexts/NeighborhoodContext';
import { Category, Store, Job } from '@/types';
import { STORES, CATEGORIES, MOCK_JOBS } from '@/constants';

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
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [activeServiceRequestId, setActiveServiceRequestId] = useState<string | null>(null);
  const [chatRole, setChatRole] = useState<'resident' | 'merchant' | 'admin'>('resident');

  const [sloganText, setSloganText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullSlogan = 'Onde o bairro conversa 💬';

  const isMerchantMode = userRole === 'lojista' || (user?.email === ADMIN_EMAIL && viewMode === 'Lojista');

  const handleNavigate = (view: string, data?: any) => {
    if (view !== 'sponsor_info' && view !== 'notifications') {
      setPreviousTab(activeTab);
    }
    
    if (view === 'service_chat' && data?.requestId) {
        setActiveServiceRequestId(data.requestId);
        setChatRole('resident');
    }

    setActiveTab(view);
  };

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
    const fadeOutTimer = setTimeout(() => setSplashStage(3), 4500);
    const endSplashTimer = setTimeout(() => {
      splashStage === 3 && setSplashStage(4);
      splashWasShownInSession = true;
    }, 5000);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(endSplashTimer);
    };
  }, [splashStage]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); handleNavigate('store_detail'); };
  const handleSelectJob = (job: Job) => { setSelectedJob(job); handleNavigate('job_detail'); };
  
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    handleNavigate('category_detail');
  };

  const handleSelectSubcategory = (subName: string, parentCat: Category) => {
    setSelectedSubcategoryName(subName);
    setSelectedCategory(parentCat);
    handleNavigate('subcategory_detail');
  };

  const headerExclusionList = ['store_area', 'store_detail', 'profile', 'patrocinador_master', 'merchant_performance', 'neighborhood_posts', 'saved_posts', 'classifieds', 'services', 'services_landing', 'merchant_leads', 'service_chat', 'admin_panel', 'category_detail', 'subcategory_detail', 'sponsor_info', 'real_estate', 'jobs', 'job_detail', 'category_banner_sales', 'banner_sales_wizard', 'weekly_reward_page', 'user_coupons', 'notifications'];
  
  const hideBottomNav = false;

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
                        <button key={role} onClick={() => { setViewMode(role); localStorage.setItem('admin_view_mode', role); setIsRoleSwitcherOpen(false); if (role === 'Lojista') setActiveTab('profile'); else if (role === 'ADM') setActiveTab('admin_panel'); else setActiveTab('home'); }} className={`w-full p-5 rounded-[1.5rem] border text-left transition-all ${viewMode === role ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white'}`}>
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
          <div className={`w-full max-w-md h-[100dvh] transition-opacity duration-500 ease-out ${splashStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={userRole} hideNav={hideBottomNav}>
                  {!headerExclusionList.includes(activeTab) && (
                    <Header isDarkMode={theme === 'dark'} toggleTheme={() => {}} onNotificationClick={() => handleNavigate('notifications')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={handleNavigate} activeTab={activeTab} userRole={userRole as any} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
                  )}
                  <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onSelectCategory={handleSelectCategory} onStoreClick={handleSelectStore} stores={STORES} user={user as any} userRole={userRole} />}
                    {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={handleNavigate} />}
                    
                    {activeTab === 'services_landing' && <ServicesLandingView onBack={() => handleNavigate('home')} user={user} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'services' && <ServicesView onNavigate={(view) => handleNavigate(view)} onOpenChat={(id: string) => { setActiveServiceRequestId(id); setChatRole('resident'); handleNavigate('service_chat'); }} />}

                    {activeTab === 'weekly_reward_page' && (
                        <WeeklyRewardPage 
                            onBack={() => handleNavigate('home')} 
                            onNavigate={handleNavigate}
                        />
                    )}

                    {activeTab === 'user_coupons' && (
                        <UserCupomScreen 
                            onBack={() => handleNavigate('profile')} 
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
                        ? <StoreAreaView onBack={() => handleNavigate('home')} onNavigate={(view) => handleNavigate(view)} user={user as any} />
                        : <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={handleNavigate} onBack={() => handleNavigate('home')} />
                    )}
                    {activeTab === 'merchant_performance' && <MerchantPerformanceDashboard onBack={() => handleNavigate('profile')} onNavigate={handleNavigate} />}
                    {activeTab === 'merchant_leads' && <MerchantLeadsView onBack={() => handleNavigate('profile')} onOpenChat={(id: string) => { setActiveServiceRequestId(id); setChatRole('merchant'); handleNavigate('service_chat'); }} />}

                    {activeTab === 'service_chat' && activeServiceRequestId && (
                        <ServiceChatView requestId={activeServiceRequestId} userRole={chatRole} onBack={() => handleNavigate(isMerchantMode ? 'merchant_leads' : 'home')} />
                    )}

                    {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={handleNavigate} onOpenMonitorChat={(id: string) => { setActiveServiceRequestId(id); setChatRole('admin'); handleNavigate('service_chat'); }} />}
                    
                    {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => handleNavigate(previousTab)} />}
                    {activeTab === 'classifieds' && <ClassifiedsView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} user={user} onRequireLogin={() => setIsAuthOpen(true)} />}
                    {activeTab === 'real_estate' && <RealEstateView onBack={() => handleNavigate('classifieds')} user={user} onRequireLogin={() => setIsAuthOpen(true)} />}
                    {activeTab === 'jobs' && <JobsView onBack={() => handleNavigate('classifieds')} onJobClick={handleSelectJob} />}
                    {activeTab === 'job_detail' && selectedJob && <JobDetailView job={selectedJob} onBack={() => handleNavigate('jobs')} />}
                    {activeTab === 'neighborhood_posts' && <NeighborhoodPostsView onBack={() => handleNavigate('home')} onStoreClick={handleSelectStore} user={user} onRequireLogin={() => setIsAuthOpen(true)} userRole={userRole} />}
                    {activeTab === 'saved_posts' && <SavedPostsView onBack={() => handleNavigate('profile')} onStoreClick={handleSelectStore} onRequireLogin={() => setIsAuthOpen(true)} />}
                    {activeTab === 'sponsor_info' && <SponsorInfoView onBack={() => handleNavigate(previousTab)} />}
                    {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => handleNavigate(previousTab)} />}
                  </main>
                  <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} />
              </Layout>
              <RoleSwitcherModal />
          </div>

          {splashStage < 4 && (
            <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-16 transition-opacity duration-500 ease-out ${splashStage === 3 ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: '#1E5BFF' }}>
              <div className="flex flex-col items-center animate-fade-in text-center px-4">
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-logo-enter"><MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" /></div>
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