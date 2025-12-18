
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StoreDetailView } from './components/StoreDetailView';
import { CashbackView } from './components/CashbackView';
import { CashbackInfoView } from './components/CashbackInfoView';
import { RewardDetailsView } from './components/RewardDetailsView';
import { AuthModal } from './components/AuthModal';
import { MenuView } from './components/MenuView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { CashbackScanScreen } from './components/CashbackScanScreen';
import { ScanConfirmationScreen } from './components/ScanConfirmationScreen';
import { CashbackPaymentScreen } from './components/CashbackPaymentScreen';
import { MapPin, Crown, ShieldCheck } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { Category, Store, AdType, EditorialCollection } from './types';
import { getStoreLogo } from './utils/mockLogos';

const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'Burger Freguesia',
    category: 'Alimentação',
    description: 'Hambúrgueres artesanais com sabor de bairro.',
    logoUrl: getStoreLogo(1),
    rating: 4.8,
    reviewsCount: 124,
    distance: 'Freguesia • RJ',
    cashback: 5,
    adType: AdType.ORGANIC,
    subcategory: 'Hamburgueria',
    address: 'Rua Tirol, 1245 - Freguesia',
    phone: '(21) 99999-1111',
    hours: 'Seg a Dom • 11h às 23h',
    verified: true,
  },
];

const App: React.FC = () => {
  const { user, userRole, loading: isAuthLoading } = useAuth();
  const [minSplashTimeElapsed, setMinSplashTimeElapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Garante que o splash dure exatamente o tempo da animação (5s)
    const timer = setTimeout(() => {
      setMinSplashTimeElapsed(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authContext, setAuthContext] = useState<'default' | 'merchant_lead_qr'>('default');
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<EditorialCollection | null>(null);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [scannedData, setScannedData] = useState<{ merchantId: string; storeId: string } | null>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const handleCashbackClick = () => {
    if (user) setActiveTab('qrcode_scan');
    else setIsAuthOpen(true);
  };

  const isAppReady = !isAuthLoading && minSplashTimeElapsed;

  if (!isAppReady) {
    return (
      <div className="fixed inset-0 bg-[#1E5BFF] flex flex-col items-center justify-center text-white z-[999] overflow-hidden">
        {/* Background Animated Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E5BFF] via-[#1E5BFF] to-[#0F359E]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] animate-glow-pulse"></div>

        <div className="relative flex flex-col items-center justify-center z-10">
          <div className="animate-float">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] mb-6 animate-pop-in">
              <MapPin className="w-12 h-12 text-[#1E5BFF] fill-[#1E5BFF]" />
            </div>
          </div>
          
          <div className="animate-soft-pulse text-center">
            <h1 className="text-5xl font-black font-display animate-slide-up tracking-tighter drop-shadow-md">
              Localizei
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2 animate-tracking-expand opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
              <div className="h-[1px] w-4 bg-blue-300"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200">Freguesia</span>
              <div className="h-[1px] w-4 bg-blue-300"></div>
            </div>
          </div>
        </div>

        {/* Sponsor Block */}
        <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center px-10 z-10">
          <div className="animate-sponsor-reveal opacity-0 [animation-delay:1800ms] [animation-fill-mode:forwards] w-full max-w-[280px]">
            <p className="text-[8px] font-black text-blue-300/60 uppercase tracking-[0.4em] mb-4 text-center animate-soft-pulse">
              Patrocinador Master
            </p>
            <div className="animate-sponsor-float">
              <div className="bg-white/10 backdrop-blur-2xl px-6 py-4 rounded-[2rem] border border-white/20 flex items-center gap-4 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-sponsor-logo-pulse">
                  <Crown className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="flex flex-col text-left">
                  <p className="font-black text-lg tracking-tight text-white leading-none">Grupo Esquematiza</p>
                  <p className="text-[9px] font-bold text-blue-200 uppercase mt-1">Segurança & Facilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
           <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-[5000ms] ease-linear" style={{ width: minSplashTimeElapsed ? '100%' : '0%' }} />
        </div>
      </div>
    );
  }

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setActiveTab(category.slug === 'food' ? 'food_category' : 'category_detail');
  };

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setActiveTab('store_detail');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center transition-colors duration-300 relative">
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onCashbackClick={handleCashbackClick}>
          {!['category_detail', 'food_category', 'store_detail', 'profile', 'patrocinador_master'].includes(activeTab) && (
            <Header
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onAuthClick={() => setActiveTab('profile')}
              user={user}
              searchTerm={globalSearch}
              onSearchChange={setGlobalSearch}
              onNavigate={setActiveTab}
              activeTab={activeTab}
              userRole={userRole}
              onSelectCategory={handleSelectCategory}
            />
          )}
          <main className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
            {activeTab === 'home' && (
              <HomeFeed
                onNavigate={setActiveTab}
                onSelectCategory={handleSelectCategory}
                onSelectCollection={setSelectedCollection}
                onStoreClick={handleSelectStore}
                stores={MOCK_STORES}
                searchTerm={globalSearch}
                user={user as any}
                userRole={userRole}
                onSpinWin={(reward) => { setSelectedReward(reward); setActiveTab('reward_details'); }}
                onRequireLogin={() => setIsAuthOpen(true)}
              />
            )}
            {activeTab === 'explore' && (
              <ExploreView stores={MOCK_STORES} searchQuery={globalSearch} onStoreClick={handleSelectStore} onLocationClick={() => {}} onFilterClick={() => {}} onOpenPlans={() => {}} />
            )}
            {activeTab === 'qrcode_scan' && (
                <CashbackScanScreen onBack={() => setActiveTab('home')} onScanSuccess={(data) => { setScannedData(data); setActiveTab('scan_confirmation'); }} />
            )}
            {activeTab === 'scan_confirmation' && scannedData && (
                <ScanConfirmationScreen storeId={scannedData.storeId} onConfirm={() => setActiveTab('cashback_payment')} onCancel={() => setActiveTab('home')} />
            )}
            {activeTab === 'cashback_payment' && scannedData && (
              <CashbackPaymentScreen user={user as any} merchantId={scannedData.merchantId} storeId={scannedData.storeId} onBack={() => setActiveTab('home')} onComplete={() => setActiveTab('home')} />
            )}
            {activeTab === 'profile' && (
              <MenuView user={user as any} userRole={userRole} onAuthClick={() => setIsAuthOpen(true)} onNavigate={setActiveTab} />
            )}
            {activeTab === 'patrocinador_master' && (
              <PatrocinadorMasterScreen onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'store_detail' && selectedStore && (
              <StoreDetailView store={selectedStore} onBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'reward_details' && (
              <RewardDetailsView reward={selectedReward} onBack={() => setActiveTab('home')} onHome={() => setActiveTab('home')} />
            )}
          </main>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user as any} signupContext={authContext} />
        </Layout>
      </div>
    </div>
  );
};

export default App;
