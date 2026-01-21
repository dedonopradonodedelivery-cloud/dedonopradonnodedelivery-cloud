


import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StoreDetailView } from './components/StoreDetailView';
import { AuthModal } from './components/AuthModal';
import { MenuView } from './components/MenuView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { ServicesView } from './components/ServicesView';
import { SubcategoriesView } from './components/SubcategoriesView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { ServiceSuccessView } from './components/ServiceSuccessView';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { StoreAreaView } from './components/StoreAreaView';
import { WeeklyPromoModule } from './components/WeeklyPromoModule';
import { JobsView } from './components/JobsView';
import { MerchantJobsModule } from './components/MerchantJobsModule';
import { AdminPanel } from './components/AdminPanel';
import { CashbackLandingView } from './components/CashbackLandingView';
import { StoreAdsModule } from './components/StoreAdsModule';
import { BannerUploadView } from './components/BannerUploadView';
import { AdminBannerModeration } from './components/AdminBannerModeration';
import { MapPin, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Category, Store, RoleMode, BannerPlan, SponsoredPlan, BannerConfig, BannerOrder, BannerMessage } from './types';
import { CategoryView } from './components/CategoryView';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { CommunityFeedView } from './components/CommunityFeedView';
import { STORES, PROFESSIONAL_BANNER_PRICING } from './constants';
import { AboutView, SupportView, FavoritesView } from './components/SimplePages';
import { getAccountEntryRoute } from './lib/roleRoutes';
import { BannerConfigView } from './components/BannerConfigView';
import { BannerCheckoutView } from './components/BannerCheckoutView';
import { SponsoredAdsView } from './components/SponsoredAdsView';
import { SponsoredAdsCheckoutView } from './components/SponsoredAdsCheckoutView';
import { SponsoredAdsSuccessView } from './components/SponsoredAdsSuccessView';
import { BannerOrderTrackingView } from './components/BannerOrderTrackingView';
import { AdminBannerOrdersList } from './components/AdminBannerOrdersList';
import { AdminBannerOrderDetail } from './components/AdminBannerOrderDetail';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ApiKeyRequiredModal } from './components/ApiKeyRequiredModal';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

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
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  const [splashStage, setSplashStage] = useState(splashWasShownInSession || isAuthReturn ? 4 : 0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'Visitante');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  // FIX: Initialize selectedServiceMacro to null
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);
  const [bannerOrder, setBannerOrder] = useState<{ plan: BannerPlan | null; draft: any | null }>({ plan: null, draft: null });
  const [sponsoredPlan, setSponsoredPlan] = useState<SponsoredPlan | null>(null);
  
  // State for Professional Banner Flow
  const [bannerOrders, setBannerOrders] = useState<BannerOrder[]>([]);
  const [bannerMessages, setBannerMessages] = useState<BannerMessage[]>([]);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  
  // Admin State
  const [adminViewOrderId, setAdminViewOrderId] = useState<string | null>(null);

  // NEW: API Key Selection State
  const [isApiKeySelected, setIsApiKeySelected] = useState(true); // Assume true by default


  // NEW: Check for AI Studio API Key Selection
  useEffect(() => {
    // Only run if window.aistudio exists (i.e., in AI Studio environment)
    if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
      const checkKey = async () => {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
      };
      checkKey();
    }
  }, []);

  // NEW: Function to handle API Key Selection via AI Studio dialog
  const handleSelectApiKey = async () => {
    if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      // Assume selection was successful and proceed.
      // Race condition handled by not adding delay here.
      setIsApiKeySelected(true); 
    } else {
      alert("Recurso de seleção de chave de API não disponível neste ambiente.");
    }
  };
  
  // Set viewMode based on auth status. This prevents the login modal on startup for visitors.
  useEffect(() => {
    if (isAuthInitialLoading) return;

    const persistedMode = localStorage.getItem('admin_view_mode') as RoleMode;

    if (!user) {
        setViewMode('Visitante');
        return;
    }

    if (persistedMode) {
        if (persistedMode === 'ADM' && user.email !== ADMIN_EMAIL) {
            setViewMode('Visitante'); 
        } else if (persistedMode === 'Lojista' && userRole !== 'lojista' && user.email !== ADMIN_EMAIL) {
             setViewMode('Usuário');
        } else {
            setViewMode(persistedMode);
        }
    } else {
        if (user.email === ADMIN_EMAIL) setViewMode('ADM');
        else if (userRole === 'lojista') setViewMode('Lojista');
        else setViewMode('Usuário');
    }
  }, [isAuthInitialLoading, user, userRole]);


  // Effect to handle navigation redirects when viewMode changes.
  useEffect(() => {
    if (isAuthInitialLoading) return; 
    if (!viewMode) return;
    localStorage.setItem('admin_view_mode', viewMode);
    
    const merchantTabs = ['store_area', 'store_ads_module', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_professional_payment', 'banner_order_tracking'];

    switch (viewMode) {
      case 'ADM':
        if (user?.email === ADMIN_EMAIL) setActiveTab('admin_panel');
        break;
      case 'Lojista':
        if (user) {
            if (!merchantTabs.includes(activeTab)) {
               setActiveTab('store_area');
            }
        } else {
            setPendingTab('store_area');
            setActiveTab('home');
            setIsAuthOpen(true);
        }
        break;
      case 'Usuário':
        if (user) {
            if (['admin_panel', 'store_area'].includes(activeTab)) {
                setActiveTab('profile');
            }
        } else {
            setPendingTab('profile');
            setActiveTab('home');
            setIsAuthOpen(true);
        }
        break;
      case 'Visitante':
        if (['admin_panel', 'store_area', 'profile', 'wallet', 'favorites', ...merchantTabs].includes(activeTab)) {
            setActiveTab('home');
        }
        break;
    }
  }, [viewMode, isAuthInitialLoading, user]);

  // General auth guard for restricted tabs
  useEffect(() => {
    const restrictedTabs = ['scan_cashback', 'merchant_qr_display', 'wallet', 'pay_cashback', 'store_area', 'admin_panel', 'edit_profile', 'profile', 'favorites', 'store_ads_module', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_professional_payment', 'banner_order_tracking', 'admin_banner_orders_list', 'admin_banner_order_detail'];
    
    if (restrictedTabs.includes(activeTab)) {
      if (!isAuthInitialLoading && !user) {
        setPendingTab(activeTab);
        setActiveTab('home');
        setIsAuthOpen(true);
      }
    }

    if (activeTab === 'store_ads_module' && !bannerOrder.plan) {
        setActiveTab('banner_config');
    }
  }, [activeTab, user, isAuthInitialLoading, bannerOrder.plan]);

  // Route Protection
  useEffect(() => {
      if (isAuthInitialLoading) return;
      
      const merchantTabs = ['store_area', 'store_ads_module', 'weekly_promo', 'merchant_jobs', 'store_profile', 'store_support', 'banner_upload', 'banner_production', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_professional_payment', 'banner_order_tracking'];
      const adminTabs = ['admin_panel', 'admin_banner_moderation', 'admin_banner_orders_list', 'admin_banner_order_detail'];
      
      if (adminTabs.includes(activeTab) && (viewMode !== 'ADM' || user?.email !== ADMIN_EMAIL)) {
          setActiveTab('home');
      }
      
      if (merchantTabs.includes(activeTab) && viewMode !== 'Lojista') {
          setActiveTab(viewMode === 'Usuário' ? 'profile' : 'home');
      }

  }, [activeTab, viewMode, user, isAuthInitialLoading]);


  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };
  
  const handleAuthClick = () => {
    if (user) {
        const route = getAccountEntryRoute(viewMode);
        if (activeTab !== route) {
            setActiveTab(route);
        }
    } else {
        setPendingTab(getAccountEntryRoute(viewMode));
        setIsAuthOpen(true);
    }
  };
  
  const handleConfigureAndCreateBanner = (config: BannerConfig) => {
    // This creates the 'plan' for ad placements
    const syntheticPlan: BannerPlan = {
      id: config.duration === '1m' ? 'home_1m' : 'home_3m', 
      label: `${config.placement} - ${config.duration === '1m' ? '1 Mês' : '3 Meses'} - ${config.neighborhoods.length} bairro(s)`,
      priceCents: config.priceCents,
      placement: config.placement,
      durationMonths: config.duration === '1m' ? 1 : 3,
      benefit: 'Plano customizado com seleção de bairros.',
      isPromo: config.duration === '3m_promo',
      // FIX: Pass the neighborhoods array to the BannerPlan
      neighborhoods: config.neighborhoods,
    };
    setBannerOrder({ plan: syntheticPlan, draft: null });
    setActiveTab('store_ads_module'); // Go to ad creation/selection
  };

  const handleFinalizeBannerCreation = (draft: any) => {
      if (!bannerOrder.plan) {
        setActiveTab('banner_config'); // Should not happen if flow is correct
        return;
      }
      setBannerOrder(prev => ({ ...prev, draft }));
      // NEW: Always go to banner_checkout, which now handles both scenarios
      setActiveTab('banner_checkout'); 
  };

  const handlePaymentComplete = (paymentMethod: 'pix' | 'credit' | 'debit') => {
      if (!user || !bannerOrder.plan || !bannerOrder.draft) {
        console.error("Missing user, plan or draft for payment completion.");
        setActiveTab('store_area');
        return;
      }
      
      const isProfessionalService = bannerOrder.draft.type === 'professional_service';

      if (isProfessionalService) {
          const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
          const now = new Date().toISOString();
          
          const newOrder: BannerOrder = {
              id: newOrderId,
              merchantId: user.id,
              bannerType: 'professional',
              // Consolidate total price here: plan cost + professional service cost
              total: bannerOrder.plan.priceCents + PROFESSIONAL_BANNER_PRICING.promoCents,
              paymentMethod,
              paymentStatus: 'paid',
              createdAt: now,
              status: 'em_analise',
              lastViewedAt: now,
              onboardingStage: 'requested_assets',
              autoMessagesFlags: {
                welcomeSent: true,
                requestSent: true,
                assetsReceivedSent: false,
                thanksSent: false,
              }
          };

          const msg1: BannerMessage = {
              id: `msg-sys-1-${Date.now()}`,
              orderId: newOrderId,
              senderType: 'system',
              body: '✅ Pagamento confirmado! Seu plano de anúncio já está reservado e agora vamos criar seu banner profissional.',
              createdAt: now,
          };
          
          const msg2: BannerMessage = {
              id: `msg-sys-2-${Date.now() + 10}`,
              orderId: newOrderId,
              senderType: 'system',
              type: 'form_request',
              body: 'Para começar, precisamos de algumas informações. Por favor, preencha o formulário abaixo com seu logo e textos.',
              createdAt: new Date(Date.now() + 1000).toISOString(),
          };

          setBannerOrders(prev => [...prev, newOrder]);
          setBannerMessages(prev => [...prev, msg1, msg2]);
          setViewingOrderId(newOrderId);
          
          setBannerOrder({ plan: null, draft: null });
          setActiveTab('banner_order_tracking');
      } else {
          // Regular banner (template or custom editor)
          // Here you'd typically save the 'published_banner' to Supabase
          // For MVP, we'll just alert and clear the order
          alert("Banner enviado para análise e publicação!");
          setBannerOrder({ plan: null, draft: null });
          setActiveTab('store_area'); 
      }
  };
  
  const handleProceedToSponsoredPayment = (days: number, total: number) => {
    setSponsoredPlan({ days, total, pricePerDay: 0.99 });
    setActiveTab('sponsored_ads_checkout');
  };

  const handleConfirmSponsoredPayment = () => {
    setActiveTab('sponsored_ads_success');
  };
  
  const handleCompleteSponsoredFlow = () => {
    setSponsoredPlan(null);
    setActiveTab('store_area');
  };
  
  // NOTE: This function is no longer needed after merging professional payment into BannerCheckoutView
  // It is kept for reference or if the user wants to revert.
  const handleConfirmProfessionalPayment = (paymentMethod: 'pix' | 'credit' | 'debit') => {
    // This logic is now handled in handlePaymentComplete in BannerCheckoutView
    console.warn("handleConfirmProfessionalPayment called, but its logic should be in handlePaymentComplete.");
    // This part should not be reachable if the App.tsx is correctly refactored.
    // For now, it will just navigate as a fallback.
    setActiveTab('banner_checkout'); 
  };


  // Logic to update an order (used for automation transitions)
  const handleUpdateOrder = (orderId: string, updates: Partial<BannerOrder>) => {
    setBannerOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            const updatedOrder = { ...o, ...updates };

            // Automation 2.1: If assets were just received, send a system message
            if (updates.onboardingStage === 'assets_received' && !o.autoMessagesFlags.assetsReceivedSent) {
                const autoMsg: BannerMessage = {
                    id: `msg-sys-${Date.now()}-assets-ack`,
                    orderId: orderId,
                    senderType: 'system',
                    body: 'Recebemos seus arquivos! Nossa equipe de design já está trabalhando na sua arte. Em breve enviaremos um rascunho.',
                    createdAt: new Date().toISOString(),
                };
                setBannerMessages(prevMsgs => [...prevMsgs, autoMsg]);
                updatedOrder.autoMessagesFlags.assetsReceivedSent = true;
            }

            return updatedOrder;
        }
        return o;
    }));
  };

  const handleViewOrder = (orderId: string) => {
    const now = new Date().toISOString();
    // Update local state to mark as read
    setBannerOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, lastViewedAt: now } : order
    ));
    setViewingOrderId(orderId);
  };

  // Generic message sender (for basic chat)
  const handleSendMessage = (orderId: string, text: string, type: 'text' | 'assets_payload' = 'text', metadata?: any) => {
    const newMessage: BannerMessage = {
      id: `msg-m-${Date.now()}`,
      orderId,
      senderType: 'merchant',
      body: text,
      type,
      metadata,
      createdAt: new Date().toISOString(),
    };
    setBannerMessages(prev => [...prev, newMessage]);
  };
  
  // Admin handlers
  // FIX: Updated `onSendMessage` type definition to allow 'system'
  const handleAdminSendMessage = (orderId: string, text: string, type: 'text' | 'system' = 'text', metadata?: any) => {
    const newMessage: BannerMessage = {
      id: `msg-a-${Date.now()}`,
      orderId,
      senderType: type === 'system' ? 'system' : 'team',
      body: text,
      type, // Pass the type
      metadata,
      createdAt: new Date().toISOString(),
    };
    setBannerMessages(prev => [...prev, newMessage]);
  };

  const handleAdminViewOrder = (orderId: string) => {
      setAdminViewOrderId(orderId);
      setActiveTab('admin_banner_order_detail');
  };

  // Professional Banner Guardrail
  useEffect(() => {
    if (activeTab === 'banner_order_tracking') {
      if (!viewingOrderId) {
        setActiveTab('store_area');
        return;
      }
      const order = bannerOrders.find(o => o.id === viewingOrderId);
      // Removed the alert/navigation to banner_professional_payment since it's deprecated.
      // Now it will simply stay on order tracking if the order is not paid (shouldn't happen with current flow).
      if (!order || order.paymentStatus !== 'paid') {
        console.warn("Attempted to track unpaid professional banner order. This should not happen in current flow.");
        setActiveTab('store_area'); // Fallback to store area if an unpaid order is somehow accessed directly
      }
    }
  }, [activeTab, viewingOrderId, bannerOrders]);


  useEffect(() => {
    if (splashStage === 4) return;
    const t1 = setTimeout(() => setSplashStage(3), 5000);
    const t2 = setTimeout(() => { setSplashStage(4); splashWasShownInSession = true; }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };
  const headerExclusionList = ['store_area', 'editorial_list', 'store_profile', 'category_detail', 'store_detail', 'profile', 'patrocinador_master', 'service_subcategories', 'service_specialties', 'store_ads_module', 'about', 'support', 'favorites', 'community_feed', 'admin_panel', 'cashback_landing', 'admin_banner_moderation', 'banner_upload', 'banner_production', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_professional_payment', 'banner_order_tracking', 'admin_banner_orders_list', 'admin_banner_order_detail'];
  const hideBottomNav = ['store_ads_module', 'store_detail', 'admin_panel', 'cashback_landing', 'admin_banner_moderation', 'banner_upload', 'banner_production', 'banner_config', 'banner_checkout', 'sponsored_ads', 'sponsored_ads_checkout', 'sponsored_ads_success', 'banner_professional_payment', 'banner_order_tracking', 'admin_banner_orders_list', 'admin_banner_order_detail'].includes(activeTab);

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
                    {(['ADM', 'Usuário', 'Lojista', 'Visitante'] as RoleMode[]).map((role) => (
                        <button key={role} onClick={() => { setViewMode(role); setIsRoleSwitcherOpen(false); }} className={`w-full p-5 rounded-[1.5rem] border text-left transition-all ${viewMode === role ? 'bg-white text-black' : 'bg-white/5 border-white/5 text-white'}`}>
                            <span className="font-black uppercase">{role}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };
  
  if (splashStage < 4) {
    return (
      <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-between py-24 transition-all duration-800 ${splashStage === 3 ? 'animate-app-exit' : ''}`} style={{ backgroundColor: '#1E5BFF' }}>
        <div className="flex flex-col items-center animate-fade-in text-center px-4">
            <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 animate-logo-enter"><MapPin className="w-16 h-16 text-brand-blue fill-brand-blue" /></div>
            <h1 className="text-4xl font-black font-display text-white tracking-tighter drop-shadow-md">Localizei JPA</h1>
            <TypingText text="Onde o bairro conversa" duration={2000} />
        </div>
        <div className="flex flex-col items-center animate-fade-in opacity-0" style={{ animationDelay: '3000ms', animationFillMode: 'forwards' }}>
             <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.25em] mb-1.5">Patrocinador Master</p>
             <p className="text-xl font-bold text-white tracking-tight">Grupo Esquematiza</p>
        </div>
      </div>
    );
  }

  // After splash, if API key is not selected, show the modal.
  // The rest of the app is blocked until the key is selected.
  if (!isApiKeySelected) {
    return (
      <ApiKeyRequiredModal 
        onSelectApiKey={handleSelectApiKey} 
        onClose={() => setIsApiKeySelected(true)} // Allow closing, but GeminiAssistant will be hidden
      />
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <NeighborhoodProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center relative">
          <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} hideNav={hideBottomNav} viewMode={viewMode}>
              {!headerExclusionList.includes(activeTab) && (
                <Header isDarkMode={isDarkMode} toggleTheme={() => {}} onAuthClick={handleAuthClick} user={user} searchTerm={globalSearch} onSearchChange={setGlobalSearch} onNavigate={setActiveTab} activeTab={activeTab} userRole={userRole as 'cliente' | 'lojista' | null} stores={STORES} onStoreClick={handleSelectStore} isAdmin={user?.email === ADMIN_EMAIL} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} />
              )}
              <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
                {activeTab === 'cashback_landing' && <CashbackLandingView onBack={() => setActiveTab('home')} onLogin={() => { setPendingTab('scan_cashback'); setIsAuthOpen(true); }} />}
                {activeTab === 'admin_panel' && <AdminPanel user={user as any} onLogout={signOut} viewMode={viewMode} onOpenViewSwitcher={() => setIsRoleSwitcherOpen(true)} onNavigateToApp={setActiveTab} />}
                {activeTab === 'admin_banner_moderation' && user?.email === ADMIN_EMAIL && <AdminBannerModeration user={user as any} onBack={() => setActiveTab('admin_panel')} />}
                
                {/* Admin Banner Orders */}
                {activeTab === 'admin_banner_orders_list' && user?.email === ADMIN_EMAIL && (
                    <AdminBannerOrdersList orders={bannerOrders} messages={bannerMessages} onBack={() => setActiveTab('admin_panel')} onSelectOrder={handleAdminViewOrder} />
                )}
                {activeTab === 'admin_banner_order_detail' && user?.email === ADMIN_EMAIL && adminViewOrderId && (
                    <AdminBannerOrderDetail 
                      orderId={adminViewOrderId} 
                      orders={bannerOrders} 
                      messages={bannerMessages} 
                      onBack={() => setActiveTab('admin_banner_orders_list')} 
                      onSendMessage={handleAdminSendMessage} 
                      onUpdateOrder={handleUpdateOrder} // FIX: Pass onUpdateOrder
                    />
                )}

                {activeTab === 'home' && <HomeFeed onNavigate={setActiveTab} onSelectCategory={(c) => { setSelectedCategory(c); setActiveTab('category_detail'); }} onSelectCollection={() => {}} onStoreClick={handleSelectStore} stores={STORES} searchTerm={globalSearch} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} />}
                {activeTab === 'explore' && <ExploreView stores={STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} onNavigate={setActiveTab} />}
                {activeTab === 'profile' && <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} onBack={() => setActiveTab('home')} />}
                {activeTab === 'community_feed' && <CommunityFeedView onStoreClick={handleSelectStore} user={user as any} onRequireLogin={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />}
                {activeTab === 'services' && <ServicesView onSelectMacro={(id, name) => { setSelectedServiceMacro({id, name}); if (id === 'emergency') { setQuoteCategory(name); setIsQuoteModalOpen(true); } else { setActiveTab('service_subcategories'); } }} onOpenTerms={() => setActiveTab('service_terms')} onNavigate={setActiveTab} searchTerm={globalSearch} />}
                {activeTab === 'category_detail' && selectedCategory && <CategoryView category={selectedCategory} onBack={() => setActiveTab('home')} onStoreClick={handleSelectStore} stores={STORES} userRole={userRole} onAdvertiseInCategory={setAdCategoryTarget} onNavigate={setActiveTab} />}
                {activeTab === 'store_detail' && selectedStore && <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />}
                {activeTab === 'store_area' && <StoreAreaView onBack={() => setActiveTab('home')} onNavigate={setActiveTab} user={user as any} bannerOrders={bannerOrders} bannerMessages={bannerMessages} onViewOrder={handleViewOrder} />}
                {activeTab === 'patrocinador_master' && <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />}
                {activeTab === 'jobs_list' && <JobsView onBack={() => setActiveTab('home')} />}
                {activeTab === 'about' && <AboutView onBack={() => setActiveTab('profile')} />}
                {activeTab === 'support' && <SupportView onBack={() => setActiveTab('profile')} />}
                {activeTab === 'favorites' && <FavoritesView onBack={() => setActiveTab('profile')} onNavigate={setActiveTab} user={user as any} />}
                {activeTab === 'service_subcategories' && selectedServiceMacro && <SubcategoriesView macroId={selectedServiceMacro.id} macroName={selectedServiceMacro.name} onBack={() => setActiveTab('services')} onSelectSubcategory={(n) => { setQuoteCategory(n); setActiveTab('service_specialties'); }} />}
                {activeTab === 'service_specialties' && <SpecialtiesView subcategoryName={quoteCategory} onBack={() => setActiveTab('service_subcategories')} onSelectSpecialty={() => setIsQuoteModalOpen(true)} />}
                {activeTab === 'store_ads_module' && <StoreAdsModule onBack={() => setActiveTab(bannerOrder.plan ? 'banner_config' : 'store_area')} onNavigate={setActiveTab} categoryName={adCategoryTarget || undefined} user={user as any} plan={bannerOrder.plan} onFinalize={handleFinalizeBannerCreation} />}
                {activeTab === 'banner_upload' && <BannerUploadView onBack={() => setActiveTab('store_ads_module')} onGoHome={() => setActiveTab('home')} />}
                
                {activeTab === 'store_profile' && <StoreProfileEdit onBack={() => setActiveTab('store_area')} />}
                {activeTab === 'banner_config' && <BannerConfigView onBack={() => setActiveTab('store_area')} onConfigure={handleConfigureAndCreateBanner} />}
                {activeTab === 'banner_checkout' && bannerOrder.plan && bannerOrder.draft && (
                    <BannerCheckoutView 
                        plan={bannerOrder.plan}
                        draft={bannerOrder.draft}
                        onBack={() => setActiveTab('store_ads_module')}
                        onComplete={handlePaymentComplete}
                    />
                )}
                {/* Sponsored Ads Flow */}
                {activeTab === 'sponsored_ads' && <SponsoredAdsView onBack={() => setActiveTab('store_area')} onProceedToPayment={handleProceedToSponsoredPayment} />}
                {activeTab === 'sponsored_ads_checkout' && sponsoredPlan && (
                    <SponsoredAdsCheckoutView 
                        plan={sponsoredPlan} 
                        onBack={() => setActiveTab('sponsored_ads')}
                        onConfirmPayment={handleConfirmSponsoredPayment}
                    />
                )}
                {activeTab === 'sponsored_ads_success' && sponsoredPlan && (
                    <SponsoredAdsSuccessView 
                        plan={sponsoredPlan}
                        onComplete={handleCompleteSponsoredFlow}
                    />
                )}
                {/* NEW: Removed BannerProfessionalPaymentView as its functionality is merged into BannerCheckoutView */}
                {activeTab === 'banner_order_tracking' && viewingOrderId && (
                  <BannerOrderTrackingView
                    orderId={viewingOrderId}
                    orders={bannerOrders}
                    messages={bannerMessages}
                    onBack={() => { setViewingOrderId(null); setActiveTab('store_area'); }}
                    onSendMessage={handleSendMessage}
                    onViewOrder={handleViewOrder}
                    onUpdateOrder={handleUpdateOrder} // FIX: Pass onUpdateOrder
                  />
                )}
              </main>
              <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} onLoginSuccess={handleLoginSuccess} />
              {isQuoteModalOpen && <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} categoryName={quoteCategory} onSuccess={() => setActiveTab('service_success')} />}
          </Layout>
          <RoleSwitcherModal />
          {/* Only render GeminiAssistant if API key is selected */}
          {isApiKeySelected && <GeminiAssistant />}
        </div>
      </NeighborhoodProvider>
    </div>
  );
};
export default App;
