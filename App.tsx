import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { HomeFeed } from '@/components/HomeFeed';
import { ExploreView } from '@/components/ExploreView';
import { CategoryView } from '@/components/CategoryView';
import { StoreDetailView } from '@/components/StoreDetailView';
import { MenuView } from '@/components/MenuView';
import { UserProfileFullView } from '@/components/UserProfileFullView';
import { EditProfileView } from '@/components/EditProfileView';
import { UserCupomScreen } from '@/components/UserCupomScreen';
import { CouponLandingView } from '@/components/CouponLandingView';
import { StoreAdsModule } from '@/components/StoreAdsModule';
import { AdminPanel } from '@/components/AdminPanel';
import { MerchantReviewsModule } from '@/components/MerchantReviewsModule';
import { MerchantPromotionsModule } from '@/components/MerchantPromotionsModule';
import { MerchantCouponsModule } from '@/components/MerchantCouponsModule';
import { StoreFinanceModule } from '@/components/StoreFinanceModule';
import { StoreSupportModule } from '@/components/StoreSupportModule';
import { AuthModal } from '@/components/AuthModal';
import { HealthSelectionView } from '@/components/HealthSelectionView';
import { HealthWomenView } from '@/components/HealthWomenView';
import { HealthPediatricsView } from '@/components/HealthPediatricsView';
import { ServicesSelectionView } from '@/components/ServicesSelectionView';
import { ServicesManualView } from '@/components/ServicesManualView';
import { ServicesSpecializedView } from '@/components/ServicesSpecializedView';
import { PetsSelectionView } from '@/components/PetsSelectionView';
import { PetsDogsView } from '@/components/PetsDogsView';
import { PetsCatsView } from '@/components/PetsCatsView';
import { PetsOthersView } from '@/components/PetsOthersView';
import { FashionSelectionView } from '@/components/FashionSelectionView';
import { FashionWomenView } from '@/components/FashionWomenView';
import { FashionMenView } from '@/components/FashionMenView';
import { FashionKidsView } from '@/components/FashionKidsView';
import { NotificationsView } from '@/components/NotificationsView';
import { ClassifiedsView } from '@/components/ClassifiedsView';
import { JobsView } from '@/components/JobsView';
import { RealEstateView } from '@/components/RealEstateView';
import { AdoptionView } from '@/components/AdoptionView';
import { DonationsView } from '@/components/DonationsView';
import { DesapegaView } from '@/components/DesapegaView';
import { JobWizard } from '@/components/JobWizard';
import { RealEstateWizard } from '@/components/RealEstateWizard';
import { ClassifiedDetailView } from '@/components/ClassifiedDetailView';
import { JobDetailView } from '@/components/JobDetailView';
import { RealEstateDetailView } from '@/components/RealEstateDetailView';
import { ClassifiedSearchResultsView } from '@/components/ClassifiedSearchResultsView';
import { PlanSelectionView } from '@/components/PlanSelectionView';
import { STORES } from '@/constants';
import { Store, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export const App: React.FC = () => {
  const { user, userRole, loading: authLoading, signOut } = useAuth();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('home');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [viewMode, setViewMode] = useState<any>('Visitante');
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        const splash = document.getElementById('app-splash');
        if (splash) {
          splash.style.opacity = '0';
          splash.style.visibility = 'hidden';
          setAppReady(true);
          document.body.style.overflow = 'auto';
          setTimeout(() => {
            splash.remove();
          }, 1000);
        } else {
          setAppReady(true);
          document.body.style.overflow = 'auto';
        }
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const isAdmin = user?.email === 'dedonopradonodedelivery@gmail.com';

  const handleNavigate = (view: string, data?: any) => {
    if (data) setSelectedData(data);
    setActiveTab(view);
    window.scrollTo(0, 0);
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    handleNavigate('store_detail');
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    if (category.slug === 'saude') {
        handleNavigate('health_selection');
    } else if (category.slug === 'servicos') {
        handleNavigate('services_selection');
    } else if (category.slug === 'pets') {
        handleNavigate('pets_selection');
    } else if (category.slug === 'moda') {
        handleNavigate('fashion_selection');
    } else {
        handleNavigate('category_detail');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    handleNavigate('home');
  };

  const headerExclusionList = [
    'store_detail', 'category_detail', 'user_coupons', 'coupon_landing', 
    'admin_panel', 'services', 'service_chat', 'notifications',
    'adoption', 'donations', 'desapega', 'real_estate', 'jobs', 'job_wizard', 
    'real_estate_wizard', 'about_app', 'privacy_policy', 'support',
    'health_selection', 'health_women', 'health_pediatrics', 'services_selection',
    'services_manual', 'services_specialized', 'pets_selection', 'pets_dogs', 
    'pets_cats', 'pets_others', 'fashion_selection', 'fashion_women', 'fashion_men', 'fashion_kids',
    'classified_detail', 'job_detail', 'real_estate_detail', 'classified_search_results', 'plan_selection'
  ];

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-brand-blue flex justify-center relative transition-colors duration-300">
        <div className={`w-full max-w-md h-[100dvh] transition-opacity duration-1000 ease-in-out ${appReady ? 'opacity-100' : 'opacity-0'}`}>
            {appReady && (
                <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={userRole} hideNav={false}>
                    {!headerExclusionList.includes(activeTab) && (
                    <Header 
                        onNotificationClick={() => handleNavigate('notifications')} 
                        user={user} 
                        searchTerm={globalSearch} 
                        onSearchChange={setGlobalSearch} 
                        onNavigate={handleNavigate} 
                        activeTab={activeTab} 
                        userRole={userRole as any} 
                        stores={STORES} 
                        onStoreClick={handleSelectStore} 
                        isAdmin={isAdmin} 
                        viewMode={viewMode} 
                        onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} 
                        onSelectCategory={handleSelectCategory} 
                    />
                    )}
                    <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onStoreClick={handleSelectStore} stores={STORES} user={user as any} userRole={userRole} onSelectCategory={handleSelectCategory} />}
                    {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={handleNavigate} />}
                    {activeTab === 'classifieds' && <ClassifiedsView onBack={() => handleNavigate('home')} user={user as any} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'jobs' && <JobsView onBack={() => handleNavigate('classifieds')} onJobClick={(job) => handleNavigate('job_detail', { job })} onNavigate={handleNavigate} />}
                    {activeTab === 'real_estate' && <RealEstateView onBack={() => handleNavigate('classifieds')} user={user as any} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'adoption' && <AdoptionView onBack={() => handleNavigate('classifieds')} user={user as any} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'donations' && <DonationsView onBack={() => handleNavigate('classifieds')} user={user as any} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'desapega' && <DesapegaView onBack={() => handleNavigate('classifieds')} user={user as any} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    
                    {activeTab === 'job_wizard' && <JobWizard user={user as any} onBack={() => handleNavigate('jobs')} onComplete={() => handleNavigate('jobs')} />}
                    {activeTab === 'real_estate_wizard' && <RealEstateWizard user={user as any} onBack={() => handleNavigate('real_estate')} onComplete={() => handleNavigate('real_estate')} onNavigate={handleNavigate} />}
                    {activeTab === 'plan_selection' && <PlanSelectionView onBack={() => handleNavigate('home')} onSuccess={() => handleNavigate('home')} />}
                    
                    {activeTab === 'classified_detail' && selectedData?.item && <ClassifiedDetailView item={selectedData.item} onBack={() => window.history.back()} user={user} onRequireLogin={() => setIsAuthModalOpen(true)} />}
                    {activeTab === 'job_detail' && selectedData?.job && <JobDetailView job={selectedData.job} onBack={() => handleNavigate('jobs')} />}
                    {activeTab === 'real_estate_detail' && selectedData?.property && <RealEstateDetailView property={selectedData.property} onBack={() => handleNavigate('real_estate')} onRequireLogin={() => setIsAuthModalOpen(true)} user={user} />}
                    {activeTab === 'classified_search_results' && selectedData?.searchTerm && <ClassifiedSearchResultsView searchTerm={selectedData.searchTerm} onBack={() => handleNavigate('classifieds')} onNavigate={handleNavigate} />}

                    {activeTab === 'notifications' && <NotificationsView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} userRole={userRole} />}
                    {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => handleNavigate('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={() => {}} onNavigate={handleNavigate} />}
                    {activeTab === 'health_selection' && (
                        <HealthSelectionView 
                        onBack={() => handleNavigate('home')} 
                        onSelect={(intent) => {
                            if (intent === 'Mulher') handleNavigate('health_women');
                            else if (intent === 'Pediatria') handleNavigate('health_pediatrics');
                            else handleNavigate('category_detail');
                        }} 
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'fashion_selection' && (
                        <FashionSelectionView 
                        onBack={() => handleNavigate('home')}
                        onSelect={(intent) => {
                            if (intent === 'Feminino') handleNavigate('fashion_women');
                            else if (intent === 'Masculino') handleNavigate('fashion_men');
                            else if (intent === 'Infantil') handleNavigate('fashion_kids');
                            else handleNavigate('category_detail');
                        }}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'fashion_women' && (
                        <FashionWomenView 
                        onBack={() => handleNavigate('fashion_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'fashion_men' && (
                        <FashionMenView 
                        onBack={() => handleNavigate('fashion_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'fashion_kids' && (
                        <FashionKidsView 
                        onBack={() => handleNavigate('fashion_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'pets_selection' && (
                        <PetsSelectionView 
                        onBack={() => handleNavigate('home')} 
                        onSelect={(intent) => {
                            if (intent === 'Cães') handleNavigate('pets_dogs');
                            else if (intent === 'Gatos') handleNavigate('pets_cats');
                            else if (intent === 'Outros Pets') handleNavigate('pets_others');
                            else handleNavigate('category_detail');
                        }}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'pets_dogs' && (
                        <PetsDogsView 
                        onBack={() => handleNavigate('pets_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'pets_cats' && (
                        <PetsCatsView 
                        onBack={() => handleNavigate('pets_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'pets_others' && (
                        <PetsOthersView 
                        onBack={() => handleNavigate('pets_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'services_selection' && (
                        <ServicesSelectionView 
                        onBack={() => handleNavigate('home')} 
                        onSelect={(intent) => {
                            if (intent === 'Manuais') handleNavigate('services_manual');
                            else if (intent === 'Especializados') handleNavigate('services_specialized');
                            else handleNavigate('category_detail');
                        }}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'services_manual' && (
                        <ServicesManualView 
                        onBack={() => handleNavigate('services_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'services_specialized' && (
                        <ServicesSpecializedView 
                        onBack={() => handleNavigate('services_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'health_women' && (
                        <HealthWomenView 
                        onBack={() => handleNavigate('health_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'health_pediatrics' && (
                        <HealthPediatricsView 
                        onBack={() => handleNavigate('health_selection')}
                        onSelect={() => handleNavigate('category_detail')}
                        onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />}
                    {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'user_profile_full' && user && <UserProfileFullView onBack={() => handleNavigate('profile')} onEdit={() => handleNavigate('edit_profile_view')} />}
                    {activeTab === 'edit_profile_view' && user && <EditProfileView user={user as any} onBack={() => handleNavigate('user_profile_full')} />}
                    {activeTab === 'user_coupons' && <UserCupomScreen onBack={() => handleNavigate('home')} onNavigate={handleNavigate} onStoreClick={handleSelectStore} />}
                    {activeTab === 'coupon_landing' && <CouponLandingView onBack={() => handleNavigate('home')} onLogin={() => setIsAuthModalOpen(true)} />}
                    {activeTab === 'admin_panel' && <AdminPanel onLogout={handleSignOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={handleNavigate} />}
                    {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => handleNavigate('home')} onNavigate={handleNavigate} user={user as any} />}
                    {activeTab === 'merchant_reviews' && <MerchantReviewsModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'merchant_promotions' && <MerchantPromotionsModule onBack={() => handleNavigate('profile')} onNavigate={handleNavigate} />}
                    {activeTab === 'merchant_coupons' && <MerchantCouponsModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'store_finance' && <StoreFinanceModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'store_support' && <StoreSupportModule onBack={() => handleNavigate('profile')} />}
                    </main>
                </Layout>
            )}
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} user={user as any} />
      </div>
    </div>
  );
};

export default App;