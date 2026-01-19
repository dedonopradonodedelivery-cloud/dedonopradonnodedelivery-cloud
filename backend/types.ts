
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
