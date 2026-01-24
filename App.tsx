
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
import { SubcategoriesView } from '@/components/SubcategoriesView';
import { SpecialtiesView } from '@/components/SpecialtiesView';
import { QuoteRequestModal } from '@/components/QuoteRequestModal';
import { StoreAreaView } from '@/components/StoreAreaView';
import { UserCupomScreen } from '@/components/UserCupomScreen';
import { UserCouponsHistoryView } from '@/components/UserCouponsHistoryView';
import { JobsView } from '@/components/JobsView';
import { MerchantPerformanceDashboard } from '@/components/MerchantPerformanceDashboard';
import { WeeklyRewardPage } from '@/components/WeeklyRewardPage';
import { NeighborhoodPostsView } from '@/components/NeighborhoodPostsView';
import { MapPin, ShieldCheck, X, Palette } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NeighborhoodProvider } from '@/contexts/NeighborhoodContext';
import { Category, Store } from '@/types';
import { CategoryView } from '@/components/CategoryView';
import { StoreProfileEdit } from '@/components/StoreProfileEdit';
import { CommunityFeedView } from '@/components/CommunityFeedView';
import { STORES } from '@/constants';
import { AboutView, SupportView, FavoritesView } from '@/components/SimplePages';
import { StoreClaimFlow } from '@/components/StoreClaimFlow';
import { MerchantReviewsModule } from '@/components/MerchantReviewsModule';
import { JPAConnectSalesView } from '@/components/JPAConnectSalesView';
import { StoreAdsModule } from '@/components/StoreAdsModule';
import { StoreAdsQuickLaunch } from '@/components/StoreAdsQuickLaunch';
import { AdminPanel } from '@/components/AdminPanel';
import { DesignerPanel } from '@/components/DesignerPanel';
import { AdminBannerModeration } from '@/components/AdminBannerModeration';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante' | 'Designer';

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
  const { theme } = useTheme();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  // Fixed typo: changed 'iAuthReturn' to 'isAuthReturn'
  const [splashStage, setSplashStage] = useState(splashWasShownInSession || isAuthReturn ? 4 : 0);
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'Usuário');
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
  const [initialStoreAdsView, setInitialStoreAdsView] = useState<'sales' | 'chat'>('sales');

  const isMerchantMode = userRole === 'lojista' || (user?.email === ADMIN_EMAIL && viewMode === 'Lojista');
  const isDesignerMode = user?.email === ADMIN_EMAIL && viewMode === 'Designer';

  const handleNavigate = (view: string, initialView?: 'sales' | 'chat') => {
    setInitialStoreAdsView(initialView || 'sales');
    setActiveTab(view);
  };
  
  useEffect(() => {
    const restrictedTabs = ['store_area', 'admin_panel', 'edit_profile', 'store_claim', 'merchant_reviews', 'designer_panel', 'user_coupons'];
    
    if (restrictedTabs.includes(activeTab)) {
      if (!isAuthInitialLoading && !user) {
        setPendingTab(activeTab);
        setActiveTab('home');
        setIsAuthOpen(true);
      }
    }
  }, [activeTab, user, isAuthInitialLoading]);

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  useEffect(() => {
    if (splashStage === 4) return;
    const t1 = setTimeout(() => setSplashStage(3), 2800);
    const t2 = setTimeout(() => { setSplashStage(4); splashWasShownInSession = true; }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };
  const headerExclusionList = ['store_area', 'editorial_list', 'store_profile', 'category_detail', 'store_detail', 'profile', 'patrocinador_master', 'service_subcategories', 'service_specialties', 'store_ads_module', 'store_ads_quick', 'merchant_performance', 'about', 'support', 'favorites', 'community_feed', 'admin_panel', 'admin_banner_moderation', 'store_claim', 'merchant_reviews', 'jpa_connect_sales', 'designer_panel', 'user_coupons', 'user_coupons_history', 'weekly_reward_page', 'neighborhood_posts'];
  
  const hideBottomNav = ['admin_panel', 'weekly_reward_page', 'neighborhood_posts'].includes(activeTab);

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
                            else if (role === 'Designer') setActiveTab('designer_panel');
                            else if (role === 'ADM') setActiveTab('admin_panel');
                            else setActiveTab('home');
                          }} 
                          className={`w-full p-5 rounded-[1.5rem] border text-left transition-all ${viewMode === role ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white'}`}
                        >
                            <div className="flex items-center justify-between">
                              <span className="font-black uppercase">{role}</span>
                              {role === 'Designer' && <Palette size={16} className="text-indigo-400" />}
                            </div>
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
        <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center relative transition-colors duration-300">
          <div className={`w-full max-w-md h-full transition-opacity duration-700 ease-out ${splashStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav}>
                  {!headerExclusionList.includes(activeTab) && (
                    <Header isDarkMode={theme === 'dark'} toggleTheme={() => {}} onAuthClick={() => setActiveTab('profile')} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole as any} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
                  )}
                  <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onStoreClick={handleSelectStore} stores={STORES} user={user as any} userRole={userRole} />}
                    {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
                    {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={setActiveTab} />}
                    {activeTab === 'designer_panel' && <DesignerPanel user={user as any} onBack={() => setActiveTab('home')} />}
                    {activeTab === 'admin_banner_moderation' && user?.email === ADMIN_EMAIL && <AdminBannerModeration user={user as any} onBack={() => setActiveTab('admin_panel')} />}
                    
                    {activeTab === 'profile' && (
                      isMerchantMode 
                        ? <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={handleNavigate} user={user as any} />
                        : <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />
                    )}

                    {activeTab === 'user_coupons' && <UserCupomScreen user={user as any} onBack={() => setActiveTab('profile')} onHistory={() => setActiveTab('user_coupons_history')} />}
                    {activeTab === 'user_coupons_history' && <UserCouponsHistoryView onBack={() => setActiveTab('user_coupons')} />}
                    {activeTab === 'weekly_reward_page' && <WeeklyRewardPage onBack={() => setActiveTab('home')} onNavigate={setActiveTab} />}
                    {activeTab === 'neighborhood_posts' && <NeighborhoodPostsView onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} />}

                    {activeTab === 'jpa_connect_sales' && <JPAConnectSalesView onBack={() => setActiveTab('profile')} />}
                    {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />}
                    {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
                    {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole as any} onAdvertiseInCategory={setAdCategoryTarget} onNavigate={handleNavigate} />}
                    {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} onClaim={() => setActiveTab('store_claim')} />}
                    
                    {activeTab === 'store_claim' && selectedStore && user && (
                        <StoreClaimFlow 
                          store={selectedStore} 
                          userId={user.id} 
                          onBack={() => setActiveTab('store_detail')} 
                          onSuccess={() => {
                            setSelectedStore({...selectedStore, claimed: true, owner_user_id: user.id});
                            setActiveTab('store_detail');
                          }} 
                        />
                    )}

                    {activeTab === 'merchant_reviews' && <MerchantReviewsModule onBack={() => setActiveTab('profile')} />}
                    {activeTab === 'merchant_performance' && <MerchantPerformanceDashboard onBack={() => setActiveTab('profile')} onNavigate={handleNavigate} />}
                    
                    {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('profile')} />}
                    {activeTab === 'jobs_list' && <JobsView onBack={() => setActiveTab('home')} />}
                    {activeTab === 'about' && <AboutView onBack={() => setActiveTab('profile')} />}
                    {activeTab === 'support' && <SupportView onBack={() => setActiveTab('profile')} />}
                    {activeTab === 'favorites' && <FavoritesView onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} user={user as any} />}
                    {activeTab === 'service_subcategories' && selectedServiceMacro && <SubcategoriesView macroId={selectedServiceMacro.id} macroName={selectedServiceMacro.name} onBack={() => setActiveTab('services')} onSelectSubcategory={(n) => { setQuoteCategory(n); setActiveTab('service_specialties'); }} />}
                    {activeTab === 'service_specialties' && <SpecialtiesView subcategoryName={quoteCategory} onBack={() => setActiveTab('service_subcategories')} onSelectSpecialty={() => setIsQuoteModalOpen(true)} />}
                    {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab(isDesignerMode ? 'designer_panel' : 'profile')} onNavigate={setActiveTab} categoryName={adCategoryTarget || undefined} user={user as any} viewMode={viewMode} initialView={initialStoreAdsView} />}
                    {activeTab === 'store_ads_quick' && <StoreAdsQuickLaunch onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} />}
                    {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('profile')} />}
                  </main>
                  <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={handleLoginSuccess} />
                  {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => setActiveTab('service_success')} />}
              </Layout>
              <RoleSwitcherModal />
          </div>

          {splashStage < 4 && (
            <div 
                className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between py-24 transition-opacity duration-500 ease-out ${splashStage === 3 ? 'opacity-0' : 'opacity-100'}`} 
                style={{ backgroundColor: '#1E5BFF' }}
            >
              <div className="flex flex-col items-center animate-fade-in text-center px-4">
                  <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-logo-enter"><MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" /></div>
                  <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-md">Localizei JPA</h1>
                  <TypingText text="Onde o bairro conversa" duration={2000} />
              </div>
              <div className="flex flex-col items-center animate-fade-in opacity-0" style={{ animationDelay: '2000ms', animationFillMode: 'forwards' }}>
                   <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.25em] mb-1.5">Patrocinador Master</p>
                   <p className="text-xl font-bold text-white tracking-tight">Grupo Esquematiza</p>
              </div>
            </div>
          )}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};
export default App;
