
import { supabase } from '../lib/supabaseClient';

/**
 * Valida um código de loja (QR ou Manual) e retorna os dados públicos
 * @param code - Pode ser o Secure ID (UUID) ou o Manual Code (String)
 */
export const validateStoreCode = async (code: string) => {
  if (!supabase) return null;

  // Busca por secure_id (QR) ou manual_code (Digitação)
  // FIX: corrected the or filter syntax for secure_id and manual_code to follow Supabase conventions
  const { data, error } = await supabase
    .from('merchants')
    .select(`
      id, 
      name, 
      category, 
      merchant_cashback_settings (
        cashback_percent,
        validity_days
      )
    `)
    .or(`secure_id.eq.${code},manual_code.eq.${code}`)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw new Error("Loja não encontrada ou código inválido.");
  }

  return data;
};

/**
 * Registra uma intenção de cashback (Ledger Inicial)
 * FIX: renamed from requestCashbackTransaction to initiateTransaction and updated parameters to match expectations in components
 */
export const initiateTransaction = async (params: {
    userId: string;
    storeId: string;
    merchantId: string;
    amountCents: number;
    type: 'earn' | 'use';
    purchaseTotalCents: number;
}) => {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('cashback_transactions')
        .insert({
            user_id: params.userId,
            store_id: params.storeId,
            merchant_id: params.merchantId,
            purchase_total_cents: params.purchaseTotalCents,
            amount_cents: params.amountCents,
            type: params.type,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Serviços de ADMIN
 */
export const getAdminGlobalMetrics = async () => {
  if (!supabase) return { totalGenerated: 0, totalUsed: 0, totalExpired: 0 };
  const { data: credits } = await supabase.from('cashback_transactions').select('amount_cents').eq('type', 'credit').eq('status', 'approved');
  const { data: debits } = await supabase.from('cashback_transactions').select('amount_cents').eq('type', 'debit').eq('status', 'approved');
  const { data: expired } = await supabase.from('cashback_transactions').select('amount_cents').eq('status', 'expired');
  const sum = (arr: any[]) => (arr || []).reduce((a, b) => a + b.amount_cents, 0);
  return { totalGenerated: sum(credits || []), totalUsed: sum(debits || []), totalExpired: sum(expired || []) };
};

export const fetchAdminMerchants = async (search: string = '') => {
  if (!supabase) return [];
  let q = supabase.from('merchants').select('*, profiles(email)');
  if (search) q = q.ilike('name', `%${search}%`);
  const { data } = await q; return data || [];
};

export const fetchAdminUsers = async (search: string = '') => {
  if (!supabase) return [];
  let q = supabase.from('profiles').select('*, cashback_balances(balance_cents)').eq('role', 'cliente');
  if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  const { data } = await q; return data || [];
};

export const fetchAdminLedger = async () => {
  if (!supabase) return [];
  const { data } = await supabase.from('cashback_transactions').select('*, merchants(name), profiles(full_name)').order('created_at', { ascending: false });
  return data || [];
};

export const getEffectiveBalance = async (userId: string, storeId: string): Promise<number> => {
  if (!supabase) return 0;
  const { data } = await supabase.from('cashback_balances').select('balance_cents').eq('user_id', userId).eq('merchant_id', storeId).maybeSingle();
  return data?.balance_cents || 0;
};
