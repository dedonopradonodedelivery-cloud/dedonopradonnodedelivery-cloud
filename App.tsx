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
import { StoreConnectModule as StoreConnect } from '@/components/StoreConnectModule';
import { StoreClaimFlow } from '@/components/StoreClaimFlow';
import { AppSuggestionView } from '@/components/AppSuggestionView';
import { CouponLandingView } from '@/components/CouponLandingView';
import { CategoriesPageView } from '@/components/CategoriesPageView';
import { HealthPreFilterView } from '@/components/HealthPreFilterView';
import { HealthSubSpecialtiesView } from '@/components/HealthSubSpecialtiesView';
import { HealthSpecialtyDetailView } from '@/components/HealthSpecialtyDetailView';
import { SpecialtyHighlightsManager } from '@/components/SpecialtyHighlightsManager';
import { ServicesPreFilterView } from '@/components/ServicesPreFilterView';
import { ServicesSelectionView } from '@/components/ServicesSelectionView';
import { MapPin, X, Palette, Sparkles, ShieldCheck, User as UserIcon, Store as StoreIcon, Eye, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NeighborhoodProvider } from '@/contexts/NeighborhoodContext';
import { Category, Store, Job, RealEstateProperty, PlanType, Classified } from '@/types';
// FIX: Added CATEGORIES to the import from @/constants to fix "Cannot find name 'CATEGORIES'" errors on lines 315 and 323.
import { STORES, CATEGORIES } from '@/constants';
import { AboutView, SupportView, FavoritesView, UserActivityView, MyNeighborhoodsView, PrivacyView, AboutAppView } from '@/components/SimplePages';
import { MerchantPanel } from '@/components/MerchantPanel';
import { UserProfileFullView } from '@/components/UserProfileFullView';
import { EditProfileView } from '@/components/EditProfileView';

let splashWasShownInSession = false;
const ADMIN_EMAIL = 'dedonopradonodedelivery@gmail.com';

export type RoleMode = 'Administrador' | 'Usuário' | 'Lojista' | 'Visitante' | 'Designer';

// FIX: Added export keyword to make App available as a named export
export const App: React.FC = () => {
  const { user, userRole, loading: isAuthInitialLoading, signOut } = useAuth();
  const { theme } = useTheme();
  const isAuthReturn = window.location.hash.includes('access_token') || window.location.search.includes('code=');
  
  const [isSplashVisible, setIsSplashVisible] = useState(!splashWasShownInSession && !isAuthReturn);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const [viewMode, setViewMode] = useState<RoleMode>(() => (localStorage.getItem('admin_view_mode') as RoleMode) || 'Usuário');
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [selectedSpecialtyName, setSelectedSpecialtyName] = useState<string | null>(null);
  const [selectedHealthGroup, setSelectedHealthGroup] = useState<string | null>(null);
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string | null>(null);
  
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<RealEstateProperty | null>(null);
  const [selectedClassified, setSelectedClassified] = useState<Classified | null>(null);
  const [classifiedSearchTerm, setClassifiedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [activityType, setActivityType] = useState<string>('');
  const [initialModuleView, setInitialModuleView] = useState<'sales' | 'chat' | undefined>(undefined);

  const [adminInitialTab, setAdminInitialTab] = useState<string | undefined>(undefined);

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

  const handleNavigate = (view: string, data?: any) => {
    if (!['sponsor_info', 'notifications', 'patrocinador_master', 'real_estate_detail', 'job_detail', 'plan_selection', 'classified_detail', 'classified_search_results', 'user_activity', 'app_suggestion', 'designer_panel', 'store_connect', 'merchant_panel', 'coupon_landing', 'all_categories', 'health_pre_filter', 'health_specialty_detail', 'services_pre_filter', 'services_manual', 'services_specialized'].includes(view) && !view.startsWith('health_')) {
      setPreviousTab(activeTab);
    }
    
    if (view === 'health_specialty_detail' && data?.specialty) {
        setSelectedSpecialtyName(data.specialty);
    }

    if (view === 'store_ads_module' && (data === 'chat' || data === 'sales')) {
       setInitialModuleView(data);
    } else {
       setInitialModuleView(undefined);
    }

    if (view === 'admin_panel' && data) {
       setAdminInitialTab(data);
    } else {
       setAdminInitialTab(undefined);
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

  const handleSelectStore = (store: Store) =>