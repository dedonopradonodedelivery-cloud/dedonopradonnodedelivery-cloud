
import React, { useState, useEffect, useMemo } from 'react';
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
import { MerchantJobsModule } from '@/components/MerchantJobsModule';
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
import { BeautySelectionView } from '@/components/BeautySelectionView';
import { BeautyWomenView } from '@/components/BeautyWomenView';
import { BeautyMenView } from '@/components/BeautyMenView';
import { AutosSelectionView } from '@/components/AutosSelectionView';
import { AutosCarrosView } from '@/components/AutosCarrosView';
import { AutosMotosView } from '@/components/AutosMotosView';
import { AutosBikesView } from '@/components/AutosBikesView';
import { AutosEletricosView } from '@/components/AutosEletricosView';
import { NotificationsView } from '@/components/NotificationsView';
import { ClassifiedsView } from '@/components/ClassifiedsView';
import { JobsView } from '@/components/JobsView';
import { RealEstateView } from '@/components/RealEstateView';
import { AdoptionView } from '@/components/AdoptionView';
import { DonationsView } from '@/components/DonationsView';
import { DesapegaView } from '@/components/DesapegaView';
import { TrocaTrocaView } from '@/components/TrocaTrocaView';
import { TrocaTrocaIntroView } from '@/components/TrocaTrocaIntroView';
import { TrocaTrocaSwipeView } from '@/components/TrocaTrocaSwipeView';
import { JobWizard } from '@/components/JobWizard';
import { RealEstateWizard } from '@/components/RealEstateWizard';
import { ClassifiedDetailView } from '@/components/ClassifiedDetailView';
import { JobDetailView } from '@/components/JobDetailView';
import { RealEstateDetailView } from '@/components/RealEstateDetailView';
import { ClassifiedSearchResultsView } from '@/components/ClassifiedSearchResultsView';
import { PlanSelectionView } from '@/components/PlanSelectionView';
import { STORES } from '@/constants';
import { Store, Category, AdType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { UserTradeItemsView } from '@/components/UserTradeItemsView';
import { JobsSwipeView } from '@/components/JobsSwipeView';
import { UserResumeView } from '@/components/UserResumeView';
import { RoleSwitcherModal } from '@/components/RoleSwitcherModal';
import { PatrocinadorMasterScreen } from '@/components/PatrocinadorMasterScreen';
import { InvestorPresentationView } from '@/components/InvestorPresentationView';

export const App: React.FC = () => {
  const { user: authUser, userRole: authRole, loading: authLoading, signOut } = useAuth();
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

  const [customHeaderTitle, setCustomHeaderTitle] = useState('');
  const [backView, setBackView] = useState('home');

  // Lógica de Admin Real
  const isRealAdmin = authUser?.email === 'dedonopradonodedelivery@gmail.com';

  // Lógica de Simulação de Perfil para Admin
  const simulatedRole = useMemo(() => {
    if (isRealAdmin) {
      if (viewMode === 'Lojista') return 'lojista';
      if (viewMode === 'ADM') return 'admin';
      if (viewMode === 'Usuário') return 'cliente';
      if (viewMode === 'Visitante') return null;
    }
    return authRole;
  }, [isRealAdmin, viewMode, authRole]);

  const simulatedUser = useMemo(() => {
    if (isRealAdmin && viewMode === 'Visitante') return null;
    return authUser;
  }, [isRealAdmin, viewMode, authUser]);

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        const splash = document.getElementById('app-splash');
        if (splash) {
          splash.style.opacity = '0';
          splash.style.transform = 'scale(1.05)';
          splash.style.visibility = 'hidden';
          setAppReady(true);
          document.body.style.overflow = 'auto';
          setTimeout(() => {
            splash.remove();
          }, 800);
        } else {
          setAppReady(true);
          document.body.style.overflow = 'auto';
        }
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const handleNavigate = (view: string, data?: any) => {
    if (data) setSelectedData(data);
    setActiveTab(view);
    window.scrollTo(0, 0);
  };

  const handleModeChange = (mode: string) => {
    setViewMode(mode);
    // Navegação contextual imediata ao trocar de modo para refletir a experiência
    if (mode === 'ADM') {
      setActiveTab('admin_panel');
    } else {
      setActiveTab('home');
    }
  };

  const handleSelectStore = (store: Store) => {
    const completedStore: Store = {
      id: store.id || `fallback-${Date.now()}`,
      name: store.name || 'Estabelecimento Local',
      category: store.category || 'Serviços',
      subcategory: store.subcategory || 'Especialidade Local',
      description: store.description || 'Este estabelecimento é um parceiro em destaque no nosso bairro. Qualidade e confiança verificada pela nossa comunidade.',
      rating: store.rating || 4.8,
      reviewsCount: store.reviewsCount || Math.floor(Math.random() * 200) + 40,
      distance: store.distance || 'Freguesia • RJ',
      adType: store.adType || AdType.PREMIUM,
      verified: store.verified !== undefined ? store.verified : true,
      isOpenNow: store.isOpenNow !== undefined ? store.isOpenNow : true,
      neighborhood: store.neighborhood || 'Freguesia',
      logoUrl: store.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(store.name || 'E')}&background=1E5BFF&color=fff`,
      image: store.image || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200',
      business_hours: store.business_hours || {
        segunda: { open: true, start: '09:00', end: '18:00' },
        terca: { open: true, start: '09:00', end: '18:00' },
        quarta: { open: true, start: '09:00', end: '18:00' },
        quinta: { open: true, start: '09:00', end: '18:00' },
        sexta: { open: true, start: '09:00', end: '18:00' },
        sabado: { open: true, start: '09:00', end: '14:00' },
        domingo: { open: false, start: '00:00', end: '00:00' },
      }
    };
    
    setSelectedStore(completedStore);
    handleNavigate('store_detail');
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setCustomHeaderTitle(category.name.toUpperCase());
    setBackView('home');

    const slugMap: Record<string, string> = {
        'saude': 'health_selection',
        'servicos': 'services_selection',
        'pets': 'pets_selection',
        'moda': 'fashion_selection',
        'beleza': 'beauty_selection',
        'autos': 'autos_selection'
    };

    const target = slugMap[category.slug] || 'category_detail';
    handleNavigate(target);
  };

  const handleSignOut = async () => {
    await signOut();
    handleNavigate('home');
  };

  const headerExclusionList = [
    'store_detail', 'user_coupons', 'coupon_landing', 
    'admin_panel', 'services', 'service_chat', 'notifications',
    'adoption', 'donations', 'desapega', 'real_estate', 'jobs', 'job_wizard', 
    'real_estate_wizard', 'about_app', 'privacy_policy', 'support',
    'health_women', 'health_pediatrics',
    'services_manual', 'services_specialized', 
    'pets_dogs', 'pets_cats', 'pets_others', 
    'fashion_women', 'fashion_men', 'fashion_kids',
    'beauty_women', 'beauty_men',
    'autos_carros', 'autos_motos', 'autos_bikes', 'autos_eletricos',
    'classified_detail', 'job_detail', 'real_estate_detail', 'classified_search_results', 'plan_selection',
    'troca_troca', 'troca_troca_intro', 'troca_troca_swipe', 'user_trade_items', 'user_resume', 'merchant_jobs',
    'patrocinador_master', 'investor_presentation'
  ];

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-brand-blue dark:bg-slate-950 flex justify-center relative transition-colors duration-300">
        <div className={`w-full max-w-md h-[100dvh] bg-white dark:bg-gray-900 transition-opacity duration-1000 ease-in-out ${appReady ? 'opacity-100' : 'opacity-0'}`}>
            {appReady && (
                <Layout activeTab={activeTab} setActiveTab={handleNavigate} userRole={simulatedRole} hideNav={false}>
                    {!headerExclusionList.includes(activeTab) && (
                    <Header 
                        onNotificationClick={() => handleNavigate('notifications')} 
                        user={simulatedUser} 
                        searchTerm={globalSearch} 
                        onSearchChange={setGlobalSearch} 
                        onNavigate={handleNavigate} 
                        activeTab={activeTab} 
                        userRole={simulatedRole} 
                        stores={STORES} 
                        onStoreClick={handleSelectStore} 
                        isAdmin={isRealAdmin} 
                        viewMode={viewMode} 
                        onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} 
                        onSelectCategory={handleSelectCategory} 
                        customTitle={customHeaderTitle}
                        onBack={() => handleNavigate(backView)}
                    />
                    )}
                    <main className="w-full mx-auto">
                    {activeTab === 'home' && <HomeFeed onNavigate={handleNavigate} onStoreClick={handleSelectStore} stores={STORES} user={simulatedUser} userRole={simulatedRole} onSelectCategory={handleSelectCategory} />}
                    {activeTab === 'explore' && <ExploreView stores={STORES} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'classifieds' && <ClassifiedsView onBack={() => handleNavigate('home')} user={simulatedUser} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'jobs' && <JobsView onBack={() => handleNavigate('home')} onJobClick={(job, compatibility) => handleNavigate('job_detail', { job, compatibility })} onNavigate={handleNavigate} />}
                    {activeTab === 'real_estate' && <RealEstateView onBack={() => handleNavigate('classifieds')} user={simulatedUser} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'adoption' && <AdoptionView onBack={() => handleNavigate('classifieds')} user={simulatedUser} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'donations' && <DonationsView onBack={() => handleNavigate('classifieds')} user={simulatedUser} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'desapega' && <DesapegaView onBack={() => handleNavigate('home')} user={simulatedUser} onRequireLogin={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} />}
                    {activeTab === 'troca_troca' && <TrocaTrocaView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />}
                    {activeTab === 'troca_troca_intro' && <TrocaTrocaIntroView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />}
                    {activeTab === 'troca_troca_swipe' && <TrocaTrocaSwipeView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />}
                    
                    {activeTab === 'job_wizard' && <JobWizard user={simulatedUser} onBack={() => handleNavigate('home')} onComplete={() => handleNavigate('home')} />}
                    {activeTab === 'real_estate_wizard' && <RealEstateWizard user={simulatedUser} onBack={() => handleNavigate('real_estate')} onComplete={() => handleNavigate('real_estate')} onNavigate={handleNavigate} />}
                    {activeTab === 'plan_selection' && <PlanSelectionView onBack={() => handleNavigate('home')} onSuccess={() => handleNavigate('home')} />}
                    
                    {activeTab === 'classified_detail' && selectedData?.item && <ClassifiedDetailView item={selectedData.item} onBack={() => handleNavigate('classifieds')} user={simulatedUser} onRequireLogin={() => setIsAuthModalOpen(true)} />}
                    {activeTab === 'job_detail' && selectedData?.job && <JobDetailView job={selectedData.job} compatibility={selectedData.compatibility} onBack={() => handleNavigate('jobs')} />}
                    {activeTab === 'real_estate_detail' && selectedData?.property && <RealEstateDetailView property={selectedData.property} onBack={() => handleNavigate('real_estate')} onRequireLogin={() => setIsAuthModalOpen(true)} user={simulatedUser} />}
                    {activeTab === 'classified_search_results' && selectedData?.searchTerm && <ClassifiedSearchResultsView searchTerm={selectedData.searchTerm} onBack={() => handleNavigate('classifieds')} onNavigate={handleNavigate} />}

                    {activeTab === 'notifications' && <NotificationsView onBack={() => handleNavigate('home')} onNavigate={handleNavigate} userRole={simulatedRole} />}
                    {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => handleNavigate(backView)} onStoreClick={handleSelectStore} stores={STORES} userRole={simulatedRole} onAdvertiseInCategory={() => {}} onNavigate={handleNavigate} />}
                    
                    {/* FLUXO SAÚDE */}
                    {activeTab === 'health_selection' && (
                        <HealthSelectionView 
                            onBack={() => handleNavigate('home')} 
                            onSelect={(intent) => {
                                if (intent === 'Mulher') { setCustomHeaderTitle('SAÚDE — MULHER'); setBackView('health_selection'); handleNavigate('health_women'); }
                                else if (intent === 'Pediatria') { setCustomHeaderTitle('SAÚDE — PEDIATRIA'); setBackView('health_selection'); handleNavigate('health_pediatrics'); }
                                else { setCustomHeaderTitle(intent.toUpperCase()); setBackView('health_selection'); handleNavigate('category_detail'); }
                            }} 
                            onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'health_women' && <HealthWomenView onBack={() => handleNavigate('health_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('health_women'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'health_pediatrics' && <HealthPediatricsView onBack={() => handleNavigate('health_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('health_pediatrics'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    
                    {/* FLUXO SERVIÇOS */}
                    {activeTab === 'services_selection' && (
                        <ServicesSelectionView 
                            onBack={() => handleNavigate('home')} 
                            onSelect={(intent) => {
                                if (intent === 'Manuais') { setCustomHeaderTitle('SERVIÇOS — MANUAIS'); setBackView('services_selection'); handleNavigate('services_manual'); }
                                else if (intent === 'Especializados') { setCustomHeaderTitle('SERVIÇOS — ESPECIALIZADOS'); setBackView('services_selection'); handleNavigate('services_specialized'); }
                                else { setCustomHeaderTitle(intent.toUpperCase()); setBackView('services_selection'); handleNavigate('category_detail'); }
                            }}
                            onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'services_manual' && <ServicesManualView onBack={() => handleNavigate('services_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('services_manual'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'services_specialized' && <ServicesSpecializedView onBack={() => handleNavigate('services_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('services_specialized'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    
                    {/* FLUXO PETS */}
                    {activeTab === 'pets_selection' && (
                        <PetsSelectionView 
                            onBack={() => handleNavigate('home')} 
                            onSelect={(intent) => {
                                if (intent === 'Cães') { setCustomHeaderTitle('PET — CÃES'); setBackView('pets_selection'); handleNavigate('pets_dogs'); }
                                else if (intent === 'Gatos') { setCustomHeaderTitle('PET — GATOS'); setBackView('pets_selection'); handleNavigate('pets_cats'); }
                                else if (intent === 'Outros Pets') { setCustomHeaderTitle('PET — OUTROS'); setBackView('pets_selection'); handleNavigate('pets_others'); }
                                else { setCustomHeaderTitle(intent.toUpperCase()); setBackView('pets_selection'); handleNavigate('category_detail'); }
                            }}
                            onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'pets_dogs' && <PetsDogsView onBack={() => handleNavigate('pets_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('pets_dogs'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'pets_cats' && <PetsCatsView onBack={() => handleNavigate('pets_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('pets_cats'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'pets_others' && <PetsOthersView onBack={() => handleNavigate('pets_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('pets_others'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}

                    {/* FLUXO MODA */}
                    {activeTab === 'fashion_selection' && (
                        <FashionSelectionView 
                            onBack={() => handleNavigate('home')}
                            onSelect={(intent) => {
                                if (intent === 'Feminino') { setCustomHeaderTitle('MODA — MULHER'); setBackView('fashion_selection'); handleNavigate('fashion_women'); }
                                else if (intent === 'Masculino') { setCustomHeaderTitle('MODA — HOMEM'); setBackView('fashion_selection'); handleNavigate('fashion_men'); }
                                else if (intent === 'Infantil') { setCustomHeaderTitle('MODA — KIDS'); setBackView('fashion_selection'); handleNavigate('fashion_kids'); }
                                else { setCustomHeaderTitle(intent.toUpperCase()); setBackView('fashion_selection'); handleNavigate('category_detail'); }
                            }}
                            onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'fashion_women' && <FashionWomenView onBack={() => handleNavigate('fashion_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('fashion_women'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'fashion_men' && <FashionMenView onBack={() => handleNavigate('fashion_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('fashion_men'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'fashion_kids' && <FashionKidsView onBack={() => handleNavigate('fashion_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('fashion_kids'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    
                    {/* FLUXO BELEZA */}
                    {activeTab === 'beauty_selection' && (
                        <BeautySelectionView
                            onBack={() => handleNavigate('home')}
                            onSelect={(intent) => {
                                if (intent === 'Mulher') { setCustomHeaderTitle('BELEZA — MULHER'); setBackView('beauty_selection'); handleNavigate('beauty_women'); }
                                else if (intent === 'Homem') { setCustomHeaderTitle('BELEZA — HOMEM'); setBackView('beauty_selection'); handleNavigate('beauty_men'); }
                                else { setCustomHeaderTitle(intent.toUpperCase()); setBackView('beauty_selection'); handleNavigate('category_detail'); }
                            }}
                            onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'beauty_women' && <BeautyWomenView onBack={() => handleNavigate('beauty_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('beauty_women'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'beauty_men' && <BeautyMenView onBack={() => handleNavigate('beauty_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('beauty_men'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    
                    {/* FLUXO AUTOS */}
                    {activeTab === 'autos_selection' && (
                        <AutosSelectionView
                            onBack={() => handleNavigate('home')}
                            onSelect={(intent) => {
                                if (intent === 'Carros') { setCustomHeaderTitle('AUTOS — CARROS'); setBackView('autos_selection'); handleNavigate('autos_carros'); }
                                else if (intent === 'Motos') { setCustomHeaderTitle('AUTOS — MOTOS'); setBackView('autos_selection'); handleNavigate('autos_motos'); }
                                else if (intent === 'Bikes') { setCustomHeaderTitle('AUTOS — BIKES'); setBackView('autos_selection'); handleNavigate('autos_bikes'); }
                                else if (intent === 'Elétricos') { setCustomHeaderTitle('AUTOS — ELÉTRICOS'); setBackView('autos_selection'); handleNavigate('autos_eletricos'); }
                                else { setCustomHeaderTitle(intent.toUpperCase()); setBackView('autos_selection'); handleNavigate('category_detail'); }
                            }}
                            onNavigate={handleNavigate}
                        />
                    )}
                    {activeTab === 'autos_carros' && <AutosCarrosView onBack={() => handleNavigate('autos_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('autos_carros'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'autos_motos' && <AutosMotosView onBack={() => handleNavigate('autos_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('autos_motos'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'autos_bikes' && <AutosBikesView onBack={() => handleNavigate('autos_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('autos_bikes'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}
                    {activeTab === 'autos_eletricos' && <AutosEletricosView onBack={() => handleNavigate('autos_selection')} onSelect={(spec) => { setCustomHeaderTitle(spec.toUpperCase()); setBackView('autos_eletricos'); handleNavigate('category_detail'); }} onStoreClick={handleSelectStore} onNavigate={handleNavigate} />}

                    {/* DEMAIS ROTAS */}
                    {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />}
                    {activeTab === 'profile' && <MenuView user={simulatedUser} userRole={simulatedRole} onAuthClick={() => setIsAuthModalOpen(true)} onNavigate={handleNavigate} onBack={() => handleNavigate('home')} />}
                    {activeTab === 'user_resume' && <UserResumeView user={simulatedUser} onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'user_trade_items' && <UserTradeItemsView user={simulatedUser} userRole={simulatedRole} onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'user_profile_full' && simulatedUser && <UserProfileFullView onBack={() => handleNavigate('profile')} onEdit={() => handleNavigate('edit_profile_view')} />}
                    {activeTab === 'edit_profile_view' && simulatedUser && <EditProfileView user={simulatedUser} onBack={() => handleNavigate('user_profile_full')} />}
                    {activeTab === 'user_coupons' && <UserCupomScreen onBack={() => handleNavigate('home')} onNavigate={handleNavigate} onStoreClick={handleSelectStore} />}
                    {activeTab === 'coupon_landing' && <CouponLandingView onBack={() => handleNavigate('home')} onLogin={() => setIsAuthModalOpen(true)} />}
                    {activeTab === 'admin_panel' && <AdminPanel onLogout={handleSignOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={handleNavigate} />}
                    {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => handleNavigate('home')} onNavigate={handleNavigate} user={simulatedUser} />}
                    {activeTab === 'merchant_reviews' && <MerchantReviewsModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'merchant_promotions' && <MerchantPromotionsModule onBack={() => handleNavigate('profile')} onNavigate={handleNavigate} />}
                    {activeTab === 'merchant_coupons' && <MerchantCouponsModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'merchant_jobs' && <MerchantJobsModule onBack={() => handleNavigate('profile')} user={simulatedUser} />}
                    {activeTab === 'store_finance' && <StoreFinanceModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'store_support' && <StoreSupportModule onBack={() => handleNavigate('profile')} />}
                    {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => handleNavigate('home')} />}
                    {activeTab === 'investor_presentation' && <InvestorPresentationView onBack={() => handleNavigate('admin_panel')} />}
                    </main>
                </Layout>
            )}
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} user={authUser} />
        <RoleSwitcherModal isOpen={isRoleSwitcherOpen} onClose={() => setIsRoleSwitcherOpen(false)} currentMode={viewMode} onModeChange={handleModeChange} />
      </div>
    </div>
  );
};

export default App;
