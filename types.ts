
import React from 'react';

export type RoleMode = 'ADM' | 'Usuário' | 'Lojista' | 'Visitante';
export type ThemeMode = 'light' | 'dark' | 'auto';

export enum AdType {
  ORGANIC = 'ORGANIC',
  LOCAL = 'LOCAL',
  PREMIUM = 'PREMIUM'
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  rating: number;
  distance: string;
  adType: AdType;
  description: string;
  logoUrl?: string;
  image?: string;
  reviewsCount?: number;
  neighborhood?: string;
  isSponsored?: boolean;
  verified?: boolean;
  isOpenNow?: boolean;
  cashback_percent?: number;
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
  cashback_active?: boolean;
  cashback_validity_days?: number;
  store_manual_code?: string;
  secure_id?: string;
  onboarding_cashback_completed?: boolean;
  onboarding_cashback_completed_at?: string;
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
  type: 'official' | 'user';
}

export interface BannerPlan {
  id: string;
  placement: string;
  durationMonths: number;
  priceCents: number;
  label: string;
  installmentText?: string;
  isMostAdvantageous?: boolean;
  isPromo?: boolean;
  benefit: string;
  neighborhoods?: { id: string; name: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

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

export interface SupportFAQ {
  id: string;
  profile: 'user' | 'merchant';
  question: string;
  answer: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  profile_type: 'user' | 'merchant';
  status: 'faq' | 'waiting' | 'active' | 'resolved';
  created_at: string;
  last_message?: string;
  unread_count: number;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_type: 'bot' | 'user' | 'admin' | 'system' | 'team';
  text: string;
  created_at: string;
}

export interface BannerOrder {
  id: string;
  merchantId: string;
  bannerType: 'professional';
  total: number;
  paymentMethod: 'pix' | 'credit' | 'debit' | null;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  status: 'em_analise' | 'em_producao' | 'aprovado' | 'publicado';
  lastViewedAt?: string;
  onboardingStage: 'none' | 'requested_assets' | 'assets_received' | 'in_production' | 'finalized';
  assetsSubmittedAt?: string;
  autoMessagesFlags: {
    welcomeSent: boolean;
    requestSent: boolean;
    assetsReceivedSent: boolean;
    thanksSent: boolean;
  };
}

export interface BannerMessage {
  id: string;
  orderId: string;
  senderType: 'merchant' | 'team' | 'system';
  body: string;
  createdAt: string;
  readAt?: string;
  type?: 'text' | 'form_request' | 'assets_payload' | 'status' | 'thank_you' | 'system';
  metadata?: any;
}

export interface SponsoredPlan {
  days: number;
  pricePerDay: number;
  total: number;
}

export interface BannerConfig {
  placement: 'Home' | 'Categorias' | 'Todos';
  duration: '1m' | '3m_promo';
  neighborhoods: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  priceCents: number;
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

export interface CommunitySuggestion {
  id: string;
  name: string;
  votes: number;
  status: 'pending' | 'approved' | 'rejected';
  creatorId: string;
  voterIds: string[];
}

export interface CashbackTransaction {
  id: string;
  merchant_id: string;
  store_id: string;
  user_id: string;
  total_amount_cents: number;
  cashback_used_cents: number;
  cashback_to_earn_cents: number;
  amount_to_pay_now_cents: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  created_at: string;
  approved_at?: string;
  amount_cents: number;
  type: 'earn' | 'use';
  customer_name?: string;
  rejected_at?: string;
}

export interface DbMerchantSession {
  id: string;
  merchant_id: string;
  session_type: 'qr' | 'pin';
  pin_code?: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
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
