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
    return (data || []) as any[];
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

  if (error) {
    console.error("Database validation error:", error);
    throw new Error("Erro técnico na validação. Tente novamente.");
  }

  if (!data) {
    throw new Error("Código não reconhecido.");
  }

  if (!data.is_active) {
    throw new Error("Este estabelecimento não está aceitando transações no momento.");
  }

  return data;
};

/**
 * Registra uma intenção de transação no Ledger.
 */
export const initiateTransaction = async (params: {
    userId: string;
    storeId: string;
    merchantId: string;
    amountCents: number;
    type: 'earn' | 'use';
    purchaseTotalCents: number;
}) => {
    if (!supabase) return { id: 'mock-tx-id', status: 'pending' };

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
 * Busca o saldo efetivo de um usuário para uma loja específica.
 */
export const getEffectiveBalance = async (userId: string, storeId: string) => {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('store_credits')
    .select('balance_cents')
    .eq('user_id', userId)
    .eq('store_id', storeId)
    .maybeSingle();
  if (error) return 0;
  return data?.balance_cents || 0;
};

/**
 * Envia uma solicitação manual de reivindicação de loja.
 */
export const submitManualClaim = async (claimData: Partial<StoreClaimRequest>) => {
  if (supabase) {
    const { error } = await supabase.from('store_claims').insert({ ...claimData, status: 'pending' });
    if (error) throw error;
  }
  return true;
}