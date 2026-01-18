
import React from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

export enum AdType {
  ORGANIC = 'ORGANIC',
  LOCAL = 'LOCAL',   
  PREMIUM = 'PREMIUM' 
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StoreReview {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'cliente' | 'lojista';
  jobsAlertsEnabled?: boolean;
  jobCategories?: string[];
  jobTypes?: string[];
  jobRegions?: string[];
  fcmTokens?: string[];
  lastJobPushAt?: string; 
  hasSeenJobsVideo?: boolean;
}

export interface Store {
  id: string;
  name: string;
  username?: string;
  category: string;
  subcategory: string;
  logoUrl?: string; 
  image?: string; 
  rating: number;
  distance: string;
  neighborhood?: string;
  adType: AdType;
  description: string;
  address?: string;
  phone?: string;
  hours?: string;
  gallery?: string[];
  reviews?: StoreReview[];
  verified?: boolean;
  reviewsCount?: number;
  distanceKm?: number;
  isOpenNow?: boolean;
  closingTime?: string;
  isSponsored?: boolean;
  paymentMethods?: string[];
  recentComments?: string[];
  cashback?: number;
}

export type CommunityPostType = 'tip' | 'recommendation' | 'alert' | 'news' | 'promo';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userUsername?: string;
  userAvatar: string;
  authorRole: 'resident' | 'merchant';
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  videoUrl?: string;
  relatedStoreId?: string;
  relatedStoreName?: string;
  neighborhood?: string;
  likes: number;
  comments: number;
  type: CommunityPostType;
  timestamp: string;
  isLiked?: boolean;
  communityId: string;
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
  voterIds: string[]; // Array para garantir voto único
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  illustrationUrl?: string;
  image?: string; 
  color: string;
  slug: string;
}

export interface EditorialCollection {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  keywords: string[];
}

export interface Story {
  id: string;
  name: string;
  image: string;
  isLive?: boolean;
}

export interface Job {
  id: string;
  role: string;
  company: string;
  neighborhood: string;
  category: string; 
  type: 'CLT' | 'PJ' | 'Freelancer' | 'Temporário' | 'Estágio';
  salary?: string;
  description: string;
  requirements: string[];
  schedule: string;
  contactWhatsapp: string;
  postedAt: string;
  isUrgent?: boolean;
  isUrgentToday?: boolean; 
  isSponsored?: boolean;
  sponsoredUntil?: string;
}

export type ReportReason = 'spam' | 'offensive' | 'fraud' | 'wrong_neighborhood' | 'other';
export type ReportStatus = 'open' | 'in_review' | 'resolved' | 'dismissed';
export type ReportPriority = 'high' | 'medium' | 'low';

export interface PostReport {
  id: string;
  postId: string;
  postAuthorId: string;
  reporterUserId: string;
  postNeighborhood: string;
  reporterNeighborhood: string;
  reason: ReportReason;
  status: ReportStatus;
  priority: ReportPriority;
  timestamp: string;
  postThumbnail?: string;
  postContentSnippet?: string;
  authorUsername?: string;
}

export interface CashbackTransaction {
  id: string;
  merchant_id: string;
  store_id: string;
  customer_id: string;
  total_amount_cents: number;
  cashback_used_cents: number;
  cashback_to_earn_cents: number;
  amount_to_pay_now_cents: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  approved_at?: string;
  rejected_at?: string;
}
