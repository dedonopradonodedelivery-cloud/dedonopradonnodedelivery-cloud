
import React from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

export enum AdType {
  ORGANIC = 'ORGANIC',
  LOCAL = 'LOCAL',   // R$ 1.90/dia
  PREMIUM = 'PREMIUM' // R$ 3.90/dia - Top of list
}

export interface StoreReview {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Store {
  id: string;
  name: string;
  username?: string; // Novo campo @ da loja
  category: string;
  subcategory: string;
  
  // Imagem principal agora é logoUrl
  logoUrl?: string; 
  image?: string; // Mantido apenas para compatibilidade legada se necessário, mas a UI priorizará logoUrl

  rating: number;
  distance: string; // Legacy distance string
  neighborhood?: string; // New field for filtering
  adType: AdType;
  description: string;
  cashback?: number; // Percentage
  isMarketplace?: boolean; // Determines if it appears in "Achadinhos"
  price_original?: number;
  price_current?: number;
  
  // Detailed fields
  address?: string;
  phone?: string;
  hours?: string;
  gallery?: string[];
  reviews?: StoreReview[];
  verified?: boolean;
  
  // New fields for detailed store list
  reviewsCount?: number;
  distanceKm?: number;
  isOpenNow?: boolean;
  closingTime?: string;
  isSponsored?: boolean;
  paymentMethods?: string[]; // Novos meios de pagamento aceitos
  
  // Community Block
  recentComments?: string[];
}

export type CommunityPostType = 'tip' | 'recommendation' | 'alert' | 'news' | 'promo';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userUsername?: string; // Novo campo @ do usuário
  userAvatar: string;
  authorRole: 'resident' | 'merchant'; // Novo campo para distinguir origem
  content: string;
  imageUrl?: string;
  imageUrls?: string[]; // Support for Carousel (Max 4)
  videoUrl?: string; // Suporte a vídeo curto
  relatedStoreId?: string; // ID da loja se houver
  relatedStoreName?: string; // Nome da loja para display rápido
  neighborhood?: string; // New field for filtering
  likes: number;
  comments: number;
  type: CommunityPostType;
  timestamp: string;
  isLiked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  illustrationUrl?: string; // URL para a ilustração estilo iFood (flat/colorida)
  image?: string; 
  color: string; // Nova propriedade para o sistema de cores
  slug: string;
}

export interface Story {
  id: string;
  name: string;
  image: string;
  isLive?: boolean;
  // Fix: Added isMarketplace property to Story interface to resolve TypeScript error in constants.tsx
  isMarketplace?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  image: string;
  followers: string;
  verified: boolean;
}

export interface ServiceLead {
  id: string;
  title: string; // e.g., "Pintura de Apartamento"
  category: string;
  urgency: 'Baixa' | 'Média' | 'Alta';
  priceToUnlock: number; // Fixed at R$ 3.90 for V1.0
  maskedName: string; // "João S."
  district: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface Transaction {
  id: string;
  storeName: string;
  date: string;
  amount: number;
  cashbackAmount: number;
  status: 'completed' | 'pending';
}

export interface LocalTransaction {
  id: string;
  type: 'bonus' | 'purchase';
  value: number;
  source: string; // 'spinwheel' or store name
  date: string; // ISO string
}

export interface LocalUserWallet {
  balance: number;
  transactions: LocalTransaction[];
}

export interface CashbackTransaction {
  id?: string;
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
  type: 'CLT' | 'PJ' | 'Freelancer' | 'Temporário';
  salary?: string;
  description: string;
  requirements: string[];
  schedule: string;
  contactWhatsapp: string;
  postedAt: string;
  isUrgent?: boolean;
  // Campos para Vaga Patrocinada
  isSponsored?: boolean;
  sponsoredUntil?: string; // ISO Date String (YYYY-MM-DD)
}

// --- MODERATION TYPES ---

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
  // Mock fields for Admin UI
  postThumbnail?: string;
  postContentSnippet?: string;
  authorUsername?: string;
}
