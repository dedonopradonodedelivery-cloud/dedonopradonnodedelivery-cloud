import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
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
// Adicionando import do StoreAdsModule para corrigir erro de nome não encontrado
import { StoreAdsModule } from './components/StoreAdsModule';
import { AdminBannerModeration } from './components/AdminBannerModeration';
import { MapPin, ShieldCheck, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { NeighborhoodProvider } from './contexts/NeighborhoodContext';
import { Category, Store, EditorialCollection, ThemeMode } from './types';
import { CategoryView } from './components/CategoryView';
import { StoreProfileEdit } from './components/StoreProfileEdit';
import { CommunityFeedView } from './components/CommunityFeedView';
import { STORES } from './constants';
import { AdminModerationPanel } from './components/AdminModerationPanel';
import { 
  AboutView, 
  SupportView, 
  InviteFriendView, 
  FavoritesView 
} from './components/SimplePages';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

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
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'ADM');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('localizei_active_tab') || 'home');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedServiceMacro, setSelectedServiceMacro] = useState<{id: string, name: string} | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteCategory, setQuoteCategory] = useState('');
  const [adCategoryTarget, setAdCategoryTarget] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('localizei_active_tab', activeTab); }, [activeTab]);
  
  useEffect(() => {
    const restrictedTabs = ['scan_cashback', 'merchant_qr_display', 'wallet', 'pay_cashback', 'store_area', 'admin_panel', 'edit_profile'];
    
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
    const t1 = setTimeout(() => setSplashStage(3), 5000);
    const t2 = setTimeout(() => { setSplashStage(4); splashWasShownInSession = true; }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;
    localStorage.setItem('admin_view_mode', viewMode);
    switch (viewMode) {
      case 'ADM': setActiveTab('admin_panel'); break;
      case 'Lojista': setActiveTab('store_area'); break;
      default: if (activeTab === 'admin_panel' || activeTab === 'store_area') setActiveTab('home');
    }
  }, [viewMode, user]);

  const handleSelectStore = (store: Store) => { setSelectedStore(store); setActiveTab('store_detail'); };
  const headerExclusionList = ['store_area', 'editorial_list', 'store_profile', 'category_detail', 'store_detail', 'profile', 'patrocinador_master', 'service_subcategories', 'service_specialties', 'store_ads_module', 'about', 'support', 'favorites', 'community_feed', 'admin_panel', 'cashback_landing', 'admin_banner_moderation'];
  const hideBottomNav = ['store_ads_module