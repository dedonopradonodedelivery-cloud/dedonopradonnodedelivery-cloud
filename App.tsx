
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { HomeFeed } from '@/components/HomeFeed';
import { ExploreView } from '@/components/ExploreView';
import { CategoryView } from '@/pages/categories/CategoryView';
import { StoreDetailView } from '@/components/StoreDetailView';
import { MenuView } from '@/components/MenuView';
import { UserProfileFullView } from '@/components/UserProfileFullView';
import { EditProfileView } from '@/components/EditProfileView';
import { UserCupomScreen } from '@/components/UserCupomScreen';
import { CouponLandingView } from '@/components/CouponLandingView';
import { StoreAdsModule } from '@/components/StoreAdsModule';
import { AdminPanel } from '@/components/AdminPanel';
import { ServicesLandingView } from '@/components/ServicesLandingView';
import { ServiceMessagesListView } from '@/components/ServiceMessagesListView';
import { ServiceChatView } from '@/components/ServiceChatView';
import { ClassifiedsView } from '@/components/ClassifiedsView';
import { SupportView } from '@/components/SimplePages';
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
import { FashionMenView } from '@/components/FashionMenView'; // Import the new component
import { FashionKidsView } from '@/components/FashionKidsView';
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
  const [healthIntent, setHealthIntent] = useState<string | null>(null);
  const [serviceIntent, setServiceIntent] = useState<string | null>(null);
  const [petIntent, setPetIntent] = useState<string | null>(null);
  const [fashionIntent, setFashionIntent] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [viewMode, setViewMode] = useState<any>('Visitante');
  const [splashStage, setSplashStage] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    const timers = [
      setTimeout(() => setSplashStage(1), 500),
      setTimeout(() => setSplashStage(2), 2000),
      setTimeout(() => setSplashStage(3), 3000),
      setTimeout(() => setSplashStage(4), 3800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [authLoading]);

  const isAdmin = user?.email === 'dedonopradonodedelivery@gmail.com';

  const handleNavigate = (view: string) => {
    setActiveTab(view);
    window.scrollTo(0, 0);
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    handleNavigate('store_detail');
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    // REGRAS DE REFINAMENTO INTELIGENTE
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
    'admin_panel', 'services', 'service_chat', 
    'adoption', 'donations', 'desapega', 'real_estate', 'job_wizard', 
    'real_estate_wizard', 'about_app', 'privacy_policy', 'support',
    'health_selection', 'health_women', 'health_pediatrics', 'services_selection',
    'services_manual', 'services_specialized', 'pets_selection', 'pets_dogs', 
    'pets_cats', 'pets_others', 'fashion_selection', 'fashion_women', 'fashion_men', 'fashion_kids' // Added 'fashion_men'
  ];

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-950 flex justify-center relative transition-colors duration-300">
        <div className={`w-full max-w-md h-[100dvh] transition-opacity duration-700 ease-in-out ${splashStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
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
                  {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => handleNavigate('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={() => {}} onNavigate={handleNavigate} />}
                  {activeTab === 'health_selection' && (
                    <HealthSelectionView 
                      onBack={() => handleNavigate('home')} 
                      onSelect={(intent) => {
                        setHealthIntent(intent);
                        if (intent === 'Mulher') {
                            handleNavigate('health_women');
                        } else if (intent === 'Pediatria') {
                            handleNavigate('health_pediatrics');
                        } else {
                            handleNavigate('category_detail');
                        }
                      }} 
                    />
                  )}
                  {activeTab === 'fashion_selection' && (
                    <FashionSelectionView 
                      onBack={() => handleNavigate('home')}
                      onSelect={(intent) => {
                        setFashionIntent(intent);
                        if (intent === 'Feminino') {
                            handleNavigate('fashion_women');
                        } else if (intent === 'Masculino') { // Added navigation for Masculino
                            handleNavigate('fashion_men');
                        } else if (intent === 'Infantil') {
                            handleNavigate('fashion_kids');
                        } else {
                            handleNavigate('category_detail');
                        }
                      }}
                    />
                  )}
                  {activeTab === 'fashion_women' && (
                    <FashionWomenView 
                      onBack={() => handleNavigate('fashion_selection')}
                      onSelect={(category) => {
                        console.log('Selected fashion category:', category);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'fashion_men' && ( // New route for FashionMenView
                    <FashionMenView 
                      onBack={() => handleNavigate('fashion_selection')}
                      onSelect={(category) => {
                        console.log('Selected fashion category:', category);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'fashion_kids' && (
                    <FashionKidsView 
                      onBack={() => handleNavigate('fashion_selection')}
                      onSelect={(category) => {
                        console.log('Selected fashion category:', category);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'pets_selection' && (
                    <PetsSelectionView 
                      onBack={() => handleNavigate('home')}
                      onSelect={(intent) => {
                        setPetIntent(intent);
                        if (intent === 'Cães') {
                            handleNavigate('pets_dogs');
                        } else if (intent === 'Gatos') {
                            handleNavigate('pets_cats');
                        } else if (intent === 'Outros Pets') {
                            handleNavigate('pets_others');
                        } else {
                            handleNavigate('category_detail');
                        }
                      }}
                    />
                  )}
                  {activeTab === 'pets_dogs' && (
                    <PetsDogsView 
                      onBack={() => handleNavigate('pets_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected dog specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'pets_cats' && (
                    <PetsCatsView 
                      onBack={() => handleNavigate('pets_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected cat specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'pets_others' && (
                    <PetsOthersView 
                      onBack={() => handleNavigate('pets_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected others pet specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'services_selection' && (
                    <ServicesSelectionView 
                      onBack={() => handleNavigate('home')}
                      onSelect={(intent) => {
                        setServiceIntent(intent);
                        if (intent === 'Manuais') {
                            handleNavigate('services_manual');
                        } else if (intent === 'Especializados') {
                            handleNavigate('services_specialized');
                        } else {
                            handleNavigate('category_detail');
                        }
                      }}
                    />
                  )}
                  {activeTab === 'services_manual' && (
                    <ServicesManualView 
                      onBack={() => handleNavigate('services_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected manual specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'services_specialized' && (
                    <ServicesSpecializedView 
                      onBack={() => handleNavigate('services_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected specialized specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'health_women' && (
                    <HealthWomenView 
                      onBack={() => handleNavigate('health_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
                    />
                  )}
                  {activeTab === 'health_pediatrics' && (
                    <HealthPediatricsView 
                      onBack={() => handleNavigate('health_selection')}
                      onSelect={(specialty) => {
                        console.log('Selected pediatric specialty:', specialty);
                        handleNavigate('category_detail');
                      }}
                      onNavigate={handleNavigate} // Pass onNavigate for MasterSponsorBadge
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
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} user={user as any} />
      </div>
    </div>
  );
};

export default App;
