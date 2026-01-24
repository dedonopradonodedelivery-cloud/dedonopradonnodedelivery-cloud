
// All global types (like Store, BusinessHour, StoreReview, etc.) are now in the root types.ts.
// This file only contains types specifically for backend DB interaction or unique backend concepts.

// Import necessary global types from root types.ts if they are extended or used here.
import { StoreClaimRequest, AppNotification, BusinessHour, StoreReview } from '../../types'; // Adjust path as needed

export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type SessionType = 'qr' | 'pin';
export type MovementType = 'credit' | 'debit';

// DbUser contains minimal user data from profiles table relevant to DB ops
export interface DbUser {
  id: string; // uuid from auth.users
  full_name?: string; 
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'cliente' | 'lojista';
  created_at: string;
  updated_at?: string;
  fcmTokens?: string[]; // For push notifications
  lastJobPushAt?: string; // Cooldown for job notifications
  jobCategories?: string[]; // User's preferred job categories
}

// DbMerchant contains minimal merchant data from merchants table relevant to DB ops
export interface DbMerchant {
  id: string; // uuid, usually maps to auth.users.id for owner
  name: string; // Display name
  owner_id: string; // Foreign key to auth.users.id
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  secure_id?: string; // For QR codes (UUID)
  manual_code?: string; // For manual entry (short code)
  category?: string;
  subcategory?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  phone?: string;
  email_publico?: string;
  whatsapp_publico?: string;
  telefone_fixo_publico?: string;
  description?: string;
  cashback_percent?: number; 
  cashback_active?: boolean;
  cashback_validity_days?: number;
  onboarding_cashback_completed?: boolean;
  onboarding_cashback_completed_at?: string;
}

// DbMerchantSession for backend session management
export interface DbMerchantSession {
  id: string; // uuid
  merchant_id: string;
  session_type: SessionType;
  pin_code?: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

// DbCashbackTransaction for backend transaction logging
export interface DbCashbackTransaction {
  id: string; // uuid
  user_id: string;
  merchant_id: string;
  store_id: string; 
  session_id?: string;
  purchase_total_cents?: number; 
  amount_cents: number; 
  cashback_used_cents?: number; 
  cashback_to_earn_cents?: number; 
  amount_to_pay_now_cents?: number; 
  type: 'earn' | 'use';
  status: TransactionStatus;
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
  user_name?: string;
  customer_id?: string;
  customer_name?: string;
}

// DbWalletMovement for backend wallet movements
export interface DbWalletMovement {
  id: string; // uuid
  user_id: string;
  transaction_id?: string;
  type: MovementType;
  amount: number;
  description: string;
  created_at: string;
}

// Backend-specific type definition
export type TaxonomyType = 'category' | 'subcategory' | 'specialty';
