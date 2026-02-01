
import React from 'react';

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
  name: string;
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
  neighborhood?: string;
  is_delivery_only?: boolean;
  claimed?: boolean;
  owner_user_id?: string;
  payment_methods?: string[];
  business_hours?: Record<string, BusinessHour>;
  address?: string;
  isSponsored?: boolean;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  whatsapp_publico?: string;
  telefone_fixo_publico?: string;
  instagram?: string;
  isMarketplace?: boolean;
  price_original?: number;
  price_current?: number;
  distanceKm?: number;
  phone?: string;
  hours?: string;
  cashback_percent?: number;
  cashback_active?: boolean;
  cashback_validity_days?: number;
  store_manual_code?: string;
  secure_id?: string;
  onboarding_cashback_completed?: boolean;
  onboarding_cashback_completed_at?: string;
  recentComments?: string[];
  gallery?: string[];
  closingTime?: string;
  estado?: string;
  nome_exibido?: string;
  razao_social?: string;
  cnpj?: string;
  email_fiscal?: string;
  whatsapp_financeiro?: string;
  telefone_fixo_fiscal?: string;
  inscricao_municipal?: string;
  inscricao_estadual?: string;
  email_publico?: string;
}

export type SlotStatus = 'available' | 'reserved' | 'sold';

export interface CategoryBannerSlot {
  uniqueKey: string; 
  bairroSlug: string;
  categoriaSlug: string;
  slotNumber: 1 | 2;
  status: SlotStatus;
  merchantId?: string;
  merchantName?: string;
  expiresAt?: string; 
  image?: string;
  title?: string;
  subtitle?: string;
}

export interface RealEstateProperty {
  id: string;
  type: 'Residencial' | 'Comercial';
  title: string;
  description: string;
  image: string;
  neighborhood: string;
  price: number;
  transaction: 'aluguel' | 'venda';
  area: number; 
  postedAt: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  propertyTypeRes?: 'Casa' | 'Apartamento' | 'Kitnet/Studio' | 'Cobertura';
  condoFee?: number;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  propertyTypeCom?: 'Sala comercial' | 'Loja' | 'Galpão' | 'Andar/Conjunto' | 'Terreno comercial';
  hasBathroom?: boolean;
  highCeiling?: boolean;
  loadingAccess?: boolean;
}

export type ServiceUrgency = 'Para hoje' | 'Amanhã' | 'Até 3 dias' | 'Não tenho pressa' | 'Hoje' | 'Essa semana' | 'Sem pressa';

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  serviceType: string;
  description: string;
  neighborhood: string;
  urgency: ServiceUrgency;
  images: string[];
  status: 'open' | 'closed';
  createdAt: string;
  winnerId?: string; // ID do lojista que fechou o negócio
}

export interface ServiceLead {
  id: string;
  requestId: string;
  merchantId: string;
  merchantName: string;
  merchantLogo?: string;
  status: 'new' | 'unlocked' | 'chatting' | 'finished' | 'lost' | 'pending_payment' | 'paid';
  unlockedAt?: string;
  purchasedAt?: string;
}

export interface ServiceMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: 'resident' | 'merchant';
  text: string;
  timestamp: string;
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

export interface Job {
  id: string;
  role: string;
  company: string;
  neighborhood: string;
  category: string;
  type: 'CLT' | 'PJ' | 'Freelancer' | 'Temporário' | 'Estágio' | 'Aprendiz' | 'Diarista' | 'Meio período' | 'Outros';
  salary?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  postedAt: string;
  isUrgentToday?: boolean;
  schedule?: string;
  contactWhatsapp?: string;
  isSponsored?: boolean;
  sponsoredUntil?: string;
  isUrgent?: boolean;
  logoUrl?: string;
  candidacy_method?: 'cv' | 'whatsapp';
  modality?: 'Presencial' | 'Híbrido' | 'Remoto';
  experience?: string;
  schedule_type?: 'Integral' | 'Meio período' | 'Escala';
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
  imageUrls?: string[];
  imageUrl?: string;
  videoUrl?: string;
  theme?: 'utilidade' | 'seguranca' | 'lazer' | 'dicas' | 'geral';
  showOnStoreProfile?: boolean;
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

export interface Classified {
  id: string;
  title: string;
  advertiser: string;
  category: string;
  neighborhood: string;
  description: string;
  timestamp: string;
  contactWhatsapp: string;
  typeLabel: string;
  price?: string;
  imageUrl?: string;
  jobDetails?: Job;
}

export type TaxonomyType = 'category' | 'subcategory' | 'specialty';

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

export interface TaxonomySuggestion {
  id: string;
  type: TaxonomyType;
  name: string;
  parentName?: string;
  justification?: string;
  status: 'pending' | 'approved' | 'rejected';
  storeName: string;
  createdAt: string;
  merchantId: string;
  rejectionReason?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'chat' | 'design' | 'coupon' | 'payment' | 'ad' | 'system';
  referenceId?: string;
  read: boolean;
  createdAt: string;
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
  responsible_name?: string;
  cnpj?: string;
  contact_phone?: string;
  justification?: string;
}

export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type SessionType = 'qr' | 'pin';
export type MovementType = 'credit' | 'debit';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  wallet_balance: number;
  created_at: string;
}

export interface DbMerchant {
  id: string;
  name: string;
  cashback_percent: number;
  is_active: boolean;
  created_at: string;
}

export interface DbMerchantSession {
  id: string;
  merchant_id: string;
  session_type: SessionType;
  pin_code?: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export interface DbCashbackTransaction {
  id: string;
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
  id: string;
  user_id: string;
  transaction_id?: string;
  type: MovementType;
  amount: number;
  description: string;
  created_at: string;
}
