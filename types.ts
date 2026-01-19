
import React from 'react';

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
  store_manual_code?: string; // Código fixo e amigável (ex: JPA-123)
  secure_id?: string; // UUID usado no QR Code
  // Propriedades extras para consistência
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
