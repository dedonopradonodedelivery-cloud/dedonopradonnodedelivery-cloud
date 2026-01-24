

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

// Added missing interfaces from project root `types.ts` for consistency
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
  attachments?: string[];
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
