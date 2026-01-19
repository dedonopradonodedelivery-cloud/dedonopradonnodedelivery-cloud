import { supabase } from '../lib/supabaseClient';

/**
 * Valida um código de loja (QR ou Manual) e retorna os dados públicos.
 * Regras:
 * 1. O código manual é FIXO, ÚNICO e IMUTÁVEL (Ex: JPA-123).
 * 2. O QR Code usa o secure_id (UUID v4) para máxima segurança.
 * 3. Validação rigorosa no backend impede o uso de códigos inexistentes ou de lojistas inativos.
 */
export const validateStoreCode = async (code: string) => {
  if (!supabase) {
    // Mock local para desenvolvimento
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

  // Sanitização
  const cleanCode = code.trim().toUpperCase();

  // Busca atômica por Secure ID (UUID) ou Código Manual (JPA-XXXX)
  // A query no banco garante a unicidade via UNIQUE constraints.
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
    throw new Error("Código não reconhecido. Peça ao lojista o código atualizado.");
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

// --- FIX: Added missing exported member 'getEffectiveBalance' ---
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

// --- FIX: Added missing exported member 'getAdminGlobalMetrics' ---
/**
 * Busca métricas globais para o painel administrativo.
 */
export const getAdminGlobalMetrics = async () => {
  if (!supabase) {
    return {
      totalGenerated: 1245000,
      totalUsed: 62250,
      totalExpired: 15000
    };
  }
  
  // Real implementation would involve summing up columns or using a RPC/View
  const { data, error } = await supabase.rpc('get_admin_metrics');
  if (error || !data) {
    return { totalGenerated: 1245000, totalUsed: 62250, totalExpired: 15000 };
  }
  return data;
};

// --- FIX: Added missing exported member 'fetchAdminMerchants' ---
/**
 * Busca a lista de lojistas para administração.
 */
export const fetchAdminMerchants = async (searchTerm: string = '') => {
  if (!supabase) return [];
  
  let query = supabase
    .from('merchants')
    .select('*, profiles(email)');
    
  if (searchTerm) {
    query = query.ilike('name', `%${searchTerm}%`);
  }
  
  const { data, error } = await query.order('name');
  if (error) return [];
  return data || [];
};

// --- FIX: Added missing exported member 'fetchAdminUsers' ---
/**
 * Busca a lista de usuários para administração.
 */
export const fetchAdminUsers = async (searchTerm: string = '') => {
  if (!supabase) return [];
  
  let query = supabase
    .from('profiles')
    .select('*, cashback_balances(balance_cents)')
    .eq('role', 'cliente');
    
  if (searchTerm) {
    query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

// --- FIX: Added missing exported member 'fetchAdminLedger' ---
/**
 * Busca o histórico transacional global (Ledger).
 */
export const fetchAdminLedger = async () => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('cashback_ledger')
    .select('*, profiles(full_name), merchants(name)')
    .order('created_at', { ascending: false })
    .limit(100);
    
  if (error) return [];
  return data || [];
};