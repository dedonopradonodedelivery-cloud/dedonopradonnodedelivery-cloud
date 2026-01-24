

import React from 'react';

// From original types.ts
export type ThemeMode = 'light' | 'dark' | 'auto';

export enum AdType {
  ORGANIC = 'ORGANIC',
  LOCAL = 'LOCAL',   
  PREMIUM = 'PREMIUM' 
}

export interface BusinessHour {
  open: boolean;
  start: string;
  end: string;
}

export interface StoreReview {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  merchant_response?: {
    text: string;
    responded_at: string;
  };
}

export interface Store {
  id: string;
  name: string; // Nome fantasia / exibido
  category: string;
  subcategory: string;
  logoUrl?: string; 
  image?: string; 
  logo_url?: string;
  banner_url?: string;
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
  recentReviews?: StoreReview[]; // Campo para avaliações estruturadas
  isMarketplace?: boolean;
  price_original?: number;
  price_current?: number;
  address?: string;
  phone?: string;
  hours?: string; // Mantido para compatibilidade legado
  instagram?: string;
  gallery?: string[];
  distanceKm?: number;
  closingTime?: string;

  // --- DADOS FISCAIS ---
  razao_social?: string;
  cnpj?: string;
  email_fiscal?: string;
  whatsapp_financeiro?: string;
  telefone_fixo_fiscal?: string;
  inscricao_municipal?: string;
  inscricao_estadual?: string;

  // --- DADOS PÚBLICOS ---
  nome_exibido?: string;
  whatsapp_publico?: string;
  telefone_fixo_publico?: string;
  email_publico?: string;
  
  // --- ENDEREÇO DETALHADO ---
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  is_delivery_only?: boolean;

  // --- NOVOS CAMPOS ESTRUTURADOS ---
  business_hours?: Record<string, BusinessHour>;
  payment_methods?: string[];
  payment_methods_others?: string;

  // --- PROPRIEDADE E REIVINDICAÇÃO ---
  claimed?: boolean;
  owner_user_id?: string;
}

export interface UserCoupon {
  id: string;
  userId: string;
  storeId: string;
  storeName: string;
  storeLogo?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  code: string;
  status: 'active' | 'used' | 'expired';
  redeemedAt: string; // Data de resgate (início da validade)
  expiresAt: string; // Data de expiração (7 dias após resgate)
  validatedAt?: string; // Data de uso na loja
}

export interface StoreClaimRequest {
  id: string;
  store_id: string;
  store_name: string;
  user_id: string;
  user_email: string;
  method: 'whatsapp' | 'email' | 'manual';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  // Campos para manual
  responsible_name?: string;
  cnpj?: string;
  contact_phone?: string;
  justification?: string;
  attachments?: string[]; // URLs de comprovantes
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

export interface TaxonomySuggestion {
  id: string;
  type: 'category' | 'subcategory';
  name: string;
  parentName?: string;
  justification?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  storeName: string;
  merchantId: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'taxonomy_approval' | 'taxonomy_rejection' | 'system' | 'job_push' | 'claim_approval' | 'claim_rejection' | 'new_review';
  read: boolean;
  createdAt: string;
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

// NOVO: Interface para Posts do Bairro
export interface BairroPost {
  id: string;
  storeId: string;
  storeName: string;
  storeLogoUrl?: string;
  imageUrl?: string; // Imagem do post
  content: string; // Texto do post
  createdAt: string; // Data de criação
}

// Interface para as configurações do editor de banners
export interface BannerDesign {
  title: string;
  titleFont: string;
  titleSize: string;
  subtitle: string;
  subtitleFont: string;
  subtitleSize: string;
  bgColor: string;
  textColor: string;
  align: 'left' | 'center' | 'right';
  animation: 'none' | 'slide' | 'pulse' | 'float';
  iconName: string | null;
  iconPos: 'left' | 'top' | 'right';
  iconSize: 'sm' | 'md' | 'lg';
  iconColorMode: 'text' | 'white' | 'black' | 'custom';
  logoDisplay: 'square' | 'round' | 'none';
  iconCustomColor?: string;
  imageUrl?: string; // Adicionado aqui para uso no BannerViewer
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
  cashback_value: number;
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

// Added to fix import error in StoreProfileEdit.tsx
export type TaxonomyType = 'category' | 'subcategory' | 'specialty';


export interface StoreAdsModuleProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  user: any; // Considerar usar um tipo User mais específico se disponível
  categoryName?: string;
  viewMode?: string;
  initialView?: 'sales' | 'chat';
}

export interface EditorData {
  template: string;
  palette: string;
  fontSize: string;
  fontFamily: string;
  title: string;
  subtitle: string;
}