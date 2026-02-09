import { supabase } from '../lib/supabaseClient';
import { StoreClaimRequest, DbUser, DbMerchant } from '../types';

/**
 * Busca a lista de lojistas para administração.
 */
export const fetchAdminMerchants = async (searchTerm: string = ''): Promise<DbMerchant[]> => {
  if (!supabase) return [];
  try {
    let query = supabase.from('merchants').select('*, profiles(email)');
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    const { data, error } = await query.order('name');
    if (error) throw error;
    return (data || []) as DbMerchant[];
  } catch (err) {
    console.error("fetchAdminMerchants error:", err);
    return [];
  }
};

/**
 * Busca a lista de usuários para administração.
 */
export const fetchAdminUsers = async (searchTerm: string = ''): Promise<DbUser[]> => {
  if (!supabase) return [];
  try {
    let query = supabase.from('profiles').select('*').eq('role', 'cliente');
    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as DbUser[];
  } catch (err) {
    console.error("fetchAdminUsers error:", err);
    return [];
  }
};

/**
 * Valida um código de loja (QR ou Manual) e retorna os dados públicos.
 */
export const validateStoreCode = async (code: string) => {
  if (!supabase) {
    if (code.toUpperCase().startsWith('JPA-') || code.length > 20) {
      return {
        id: 'lojista-demo-id',
        name: 'Estabelecimento Parceiro (Demo)',
        category: 'Geral',
        merchant_cashback_settings: {
          cashback_percent: 5,
          validity_days: 30
        }
      };
    }
    throw new Error("Código inválido.");
  }
  const cleanCode = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from('merchants')
    .select(`
      id, 
      name, 
      category, 
      is_active,
      merchant_cashback_settings (
        cashback_percent,
        validity_days
      )
    `)
    .or(`secure_id.eq.${code},manual_code.eq.${cleanCode}`)
    .maybeSingle();
  if (error) throw new Error("Erro técnico na validação.");
  if (!data) throw new Error("Código não reconhecido.");
  return data;
};

export const initiateTransaction = async (params: any) => {
    if (!supabase) return { id: 'mock-tx-id', status: 'pending' };
    const { data, error } = await supabase
        .from('cashback_transactions')
        .insert(params)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getEffectiveBalance = async (userId: string, storeId: string) => {
  if (!supabase) return 0;
  const { data } = await supabase
    .from('store_credits')
    .select('balance_cents')
    .eq('user_id', userId)
    .eq('store_id', storeId)
    .maybeSingle();
  return data?.balance_cents || 0;
};

export const submitManualClaim = async (claimData: Partial<StoreClaimRequest>) => {
  if (supabase) {
    const { error } = await supabase.from('store_claims').insert({ ...claimData, status: 'pending' });
    if (error) throw error;
  }
  return true;
};