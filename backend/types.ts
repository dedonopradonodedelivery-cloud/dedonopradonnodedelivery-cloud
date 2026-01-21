
export interface DbUser {
  id: string; // uuid
  name: string;
  email: string;
  created_at: string;
}

export interface DbMerchant {
  id: string; // uuid
  name: string;
  is_active: boolean;
  created_at: string;
}

export type SessionType = 'qr' | 'pin';

export interface DbMerchantSession {
  id: string; // uuid
  merchant_id: string;
  session_type: SessionType;
  pin_code?: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}
// FIX: Renamed cashback_value to amount_cents in DbCashbackTransaction to align with other transaction types
export interface DbCashbackTransaction {
  id: string; // uuid
  user_id: string;
  merchant_id: string;
  session_id?: string;
  purchase_value: number;
  amount_from_balance: number;
  amount_to_pay: number;
  amount_cents: number; // Changed from cashback_value
  status: string; // Assuming TransactionStatus type, but leaving as string for minimal change
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
}
