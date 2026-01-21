
import React from 'react';

// From original types.ts
export type ThemeMode = 'light' | 'dark' | 'auto';

export enum AdType {
  ORGANIC = 'ORGANIC',
  LOCAL = 'LOCAL',   
  PREMIUM = 'PREMIUM' 
}

export interface Store {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  logoUrl?: string; 
  image?: string; 
  rating: number;
  distance: string;
  adType: AdType;
  description: string;
  verified?: boolean;
  reviewsCount?: number;
  isOpenNow?: boolean;
  cashback_percent?: number; 
  cashback_active?: boolean;
  cashback_validity_days?: number;
  store_manual_code?: string;
  secure_id?: string;
  onboarding_cashback_completed?: boolean;
  onboarding_cashback_completed_at?: string;
  neighborhood?: string;
  isSponsored?: boolean;
  recentComments?: string[];
  isMarketplace?: boolean;
  price_original?: number;
  price_current?: number;
  address?: string;
  phone?: string;
  hours?: string;
  instagram?: string;
  gallery?: string[];
  distanceKm?: number;
  closingTime?: string;
}

export interface StoreCredit {
  id: string;
  user_id: string;
  store_id: string;
  store_name: string;
  store_logo?: string;
  balance_cents: number; 
  expiring_soon_cents?: number; 
  updated_at: string;
}

export interface CashbackLedgerEntry {
  id: string;
  user_id: string;
  store_id: string;
  transaction_id: string; 
  amount_cents: number;
  type: 'credit' | 'debit'; 
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at?: string; 
}

export interface CashbackTransaction {
  id: string;
  user_id: string;
  user_name?: string;
  store_id: string;
  merchant_id: string;
  amount_cents: number; 
  purchase_total_cents?: number; 
  type: 'earn' | 'use';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  approved_at?: string;
  customer_id?: string;
  customer_name?: string;
  total_amount_cents?: number;
  cashback_used_cents?: number;
  cashback_to_earn_cents?: number;
  amount_to_pay_now_cents?: number;
  rejected_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  slug: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Story {
  id: string;
  name: string;
  image: string;
}

export interface EditorialCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  keywords: string[];
}

export interface Job {
  id: string;
  role: string;
  company: string;
  neighborhood: string;
  category: string;
  type: 'CLT' | 'PJ' | 'Freelancer';
  salary?: string;
  description: string;
  requirements: string[];
  schedule: string;
  contactWhatsapp: string;
  postedAt: string;
  isUrgent?: boolean;
  isSponsored?: boolean;
  sponsoredUntil?: string;
  isUrgentToday?: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  authorRole: 'resident' | 'merchant';
  content: string;
  type: 'recommendation' | 'alert' | 'event' | 'poll';
  communityId: string;
  neighborhood?: string;
  timestamp: string;
  likes: number;
  comments: number;
  imageUrl?: string;
}

export interface NeighborhoodCommunity {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
  membersCount: string;
  type?: 'official' | 'user';
}

export interface CommunitySuggestion {
  id: string;
  name: string;
  votes: number;
  status: 'pending' | 'approved' | 'rejected';
  creatorId: string;
  voterIds: string[];
}

export type ReportReason = 'spam' | 'offensive' | 'fraud' | 'wrong_neighborhood' | 'other';
export type ReportStatus = 'open' | 'resolved' | 'dismissed';
export type ReportPriority = 'high' | 'medium' | 'low';

export interface PostReport {
  id: string;
  postId: string;
  postAuthorId: string;
  authorUsername: string;
  reporterUserId: string;
  postNeighborhood: string;
  reporterNeighborhood: string;
  reason: ReportReason;
  status: ReportStatus;
  priority: ReportPriority;
  timestamp: string;
  postContentSnippet: string;
  postThumbnail: string;
}

// From src/backend/types.ts
export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type SessionType = 'qr' | 'pin';
export type MovementType = 'credit' | 'debit';

export interface DbUser {
  id: string; // uuid
  name: string;
  email: string;
  wallet_balance: number;
  created_at: string;
}

export interface DbMerchant {
  id: string; // uuid
  name: string;
  cashback_percent: number; // numeric(5,2)
  is_active: boolean;
  created_at: string;
}

export interface DbMerchantSession {
  id: string; // uuid
  merchant_id: string;
  session_type: SessionType;
  pin_code?: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export interface DbCashbackTransaction {
  id: string; // uuid
  user_id: string;
  merchant_id: string;
  session_id?: string;
  purchase_value: number;
  amount_from_balance: number;
  amount_to_pay: number;
  // FIX: Renamed cashback_value to amount_cents
  amount_cents: number;
  // FIX: Removed duplicate TransactionStatus as it's defined globally
  status: TransactionStatus;
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
}

export interface DbWalletMovement {
  id: string; // uuid
  user_id: string;
  transaction_id?: string;
  type: MovementType;
  amount: number;
  description: string;
  created_at: string;
}

// NEW: Centralized RoleMode type
export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';

// NEW: Centralized BannerItem type (moved from HomeFeed.tsx)
export interface BannerItem {
  id: string;
  title?: string;
  target?: string;
  tag?: string;
  bgColor?: string;
  Icon?: React.ElementType;
  isSpecial?: boolean;
  isUserBanner?: boolean;
  config?: any;
}

// NEW: Type for Banner Plans
export interface BannerPlan {
  id: 'home_3m' | 'cat_3m' | 'home_1m' | 'cat_1m' | 'custom';
  placement: 'Home' | 'Categorias' | 'Todos';
  durationMonths: 1 | 3;
  priceCents: number;
  label: string;
  installmentText?: string;
  isPromo?: boolean;
  isMostAdvantageous?: boolean;
  benefit: string;
  // FIX: Add neighborhoods to BannerPlan
  neighborhoods?: { id: string; name: string }[];
}

// NEW: Type for dynamic banner configuration
export interface BannerConfig {
  placement: 'Home' | 'Categorias' | 'Todos';
  duration: '1m' | '3m_promo';
  neighborhoods: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  priceCents: number;
}


// NEW: Type for Sponsored Ads by day
export interface SponsoredPlan {
  days: number;
  pricePerDay: number;
  total: number;
}

// NEW: Type for Professional Banner Orders
export interface BannerOrder {
  id: string;
  merchantId: string;
  bannerType: 'professional';
  total: number; // in cents
  paymentMethod: 'pix' | 'credit' | 'debit' | null;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  status: 'em_analise' | 'em_producao' | 'aprovado' | 'publicado';
  lastViewedAt?: string;
  // AUTOMATION FLAGS
  onboardingStage: 'none' | 'requested_assets' | 'assets_received' | 'in_production' | 'finalized';
  assetsSubmittedAt?: string;
  autoMessagesFlags: {
    welcomeSent: boolean;
    requestSent: boolean;
    assetsReceivedSent: boolean;
    thanksSent: boolean;
  };
}

// NEW: Type for Messages within an Order
export interface BannerMessage {
  id: string;
  orderId: string;
  senderType: 'merchant' | 'team' | 'system';
  body: string;
  createdAt: string;
  readAt?: string;
  // Rich types
  type?: 'text' | 'form_request' | 'assets_payload' | 'status' | 'thank_you' | 'system'; // Add 'system' type
  metadata?: any;
}
