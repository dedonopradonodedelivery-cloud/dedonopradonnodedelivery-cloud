import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { StatusView } from './components/StatusView';
import { MarketplaceView } from './components/MarketplaceView';
import { CategoryView } from './components/CategoryView';
import { CategoriaAlimentacao } from './components/CategoriaAlimentacao';
import { SubcategoryStoreList } from './components/SubcategoryStoreList';
import { StoreDetailView } from './components/StoreDetailView';
import { StoreCategoryView } from './components/StoreCategoryView';
import { CashbackView } from './components/CashbackView';
import { CashbackLandingView } from './components/CashbackLandingView';
import { FreguesiaConnectPublic } from './components/FreguesiaConnectPublic';
import { FreguesiaConnectDashboard } from './components/FreguesiaConnectDashboard';
import { FreguesiaConnectRestricted } from './components/FreguesiaConnectRestricted';
import { RewardDetailsView } from './components/RewardDetailsView';
import { PrizeHistoryView } from './components/PrizeHistoryView';
import { AuthModal } from './components/AuthModal';
import { MerchantLeadModal } from './components/MerchantLeadModal';
import { QuickRegister } from './components/QuickRegister';
import { MenuView } from './components/MenuView';
import { ServicesView } from './components/ServicesView';
import { SubcategoriesView } from './components/SubcategoriesView';
import { SpecialtiesView } from './components/SpecialtiesView';
import { StoreAreaView } from './components/StoreAreaView';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { ServiceSuccessView } from './components/ServiceSuccessView';
import { EditorialListView, EditorialCollection } from './components/EditorialListView';
import {
  SupportView,
  InviteFriendView,
  AboutView,
  FavoritesView,
  SponsorInfoView,
} from './components/SimplePages';
import { CashbackInfoView } from './components/CashbackInfoView';
import { EditProfileView } from './components/EditProfileView';
import { ServiceTermsView } from './components/ServiceTermsView';
import { PatrocinadorMasterScreen } from './components/PatrocinadorMasterScreen';
import { BusinessRegistrationFlow } from './components/BusinessRegistrationFlow';
import { StoreCashbackModule } from './components/StoreCashbackModule';
import { StoreAdsModule } from './components/StoreAdsModule';
import { StoreConnectModule } from './components/StoreConnectModule';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { StoreFinanceModule } from './components/StoreFinanceModule';
import { StoreSupportModule } from './components/StoreSupportModule';
import { MerchantQrScreen } from './components/MerchantQrScreen';
import { CashbackScanScreen } from './components/CashbackScanScreen';
import { CashbackPaymentScreen } from './components/CashbackPaymentScreen';
import { MerchantCashbackRequests } from './components/MerchantCashbackRequests';
import { MerchantPayRoute } from './components/MerchantPayRoute';
import { CashbackPayFromQrScreen } from './components/CashbackPayFromQrScreen';
import { MerchantPanel } from './components/MerchantPanel';
import { UserCashbackFlow } from './components/UserCashbackFlow';
import { MapPin, Crown } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Category, Store, AdType } from './types';
import { getStoreLogo } from './utils/mockLogos';

/* ===========================
   MOCK STORES
=========================== */
const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'Burger Freguesia',
    category: 'Alimentação',
    description: 'Hambúrgueres artesanais.',
    logoUrl: getStoreLogo(1),
    rating: 4.8,
    reviewsCount: 124,
    distance: 'Freguesia • RJ',
    cashback: 5,
    adType: AdType.ORGANIC,
    subcategory: 'Hamburgueria',
    address: 'Rua Tirol, 1245',
    phone: '(21) 99999-1111',
    hours: '11h às 23h',
    verified: true,
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authContext, setAuthContext] = useState<'default' | 'merchant_lead_qr'>('default');

  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'cliente' | 'lojista' | null>(null);

  /* ===========================
     ROUTE → TAB (URL SUPPORT)
  =========================== */
  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/painel-parceiro') {
      setActiveTab('store_area');
      return;
    }

    if (path === '/painel-lojista') {
      setActiveTab('store_area');
      return;
    }
  }, []);

  /* ===========================
     AUTH INIT (ANTI-SPLASH TRAVA)
  =========================== */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          setUserRole(profile?.role === 'lojista' ? 'lojista' : 'cliente');
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setUserRole(profile?.role === 'lojista' ? 'lojista' : 'cliente');

          if (profile?.role === 'lojista') {
            setActiveTab('store_area');
          }
        } else {
          setUser(null);
          setUserRole(null);
          setActiveTab('home');
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  /* ===========================
     SPLASH
  =========================== */
  if (isLoading || isAuthLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#2D6DF6] to-[#1B54D9] flex flex-col items-center justify-center text-white z-50">
        <MapPin className="w-12 h-12 mb-4" />
        <div className="text-3xl font-bold">Localizei</div>
        <div className="text-xs uppercase tracking-widest">Freguesia</div>
        <div className="mt-10 flex items-center gap-2">
          <Crown className="text-yellow-300" />
          Grupo Esquematiza
        </div>
      </div>
    );
  }

  /* ===========================
     APP
  =========================== */
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole}>
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          onAuthClick={() => setIsAuthOpen(true)}
          user={user}
          activeTab={activeTab}
          userRole={userRole}
          onNavigate={setActiveTab}
        />

        {activeTab === 'home' && <HomeFeed stores={MOCK_STORES} />}
        {activeTab === 'store_area' && <StoreAreaView user={user} onNavigate={setActiveTab} />}

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          user={user}
          signupContext={authContext}
        />

        <MerchantLeadModal
          isOpen={false}
          onClose={() => {}}
        />
      </Layout>
    </div>
  );
};

export default App;
