

import { supabase } from '../lib/supabaseClient';
import { StoreClaimRequest } from '../types';

/**
 * Valida um código de loja (QR ou Manual) e retorna os dados públicos.
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
 * Simula o envio de um código OTP para o método escolhido.
 */
export const sendClaimOTP = async (storeId: string, method: 'whatsapp' | 'email') => {
  // Em produção, aqui chamaria o backend para disparar WhatsApp/Email
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(`[CLAIM OTP] Código enviado para a loja ${storeId} via ${method}`);
  // Salva um código fixo no localStorage para fins de demonstração (JPA2024)
  localStorage.setItem(`claim_otp_${storeId}`, "123456");
  return true;
};

/**
 * Valida o código OTP inserido pelo usuário.
 */
export const validateClaimOTP = async (storeId: string, userId: string, code: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const savedCode = localStorage.getItem(`claim_otp_${storeId}`);
  
  if (code === savedCode || code === "123456") {
    return true;
  }
  
  throw new Error("Código incorreto ou expirado.");
};

/**
 * Submete uma solicitação manual de reivindicação.
 */
export const submitManualClaim = async (claimData: Partial<StoreClaimRequest>) => {
  if (supabase) {
    const { error } = await supabase.from('store_claims').insert({
        ...claimData,
        status: 'pending',
        created_at: new Date().toISOString()
    });
    if (error) throw error;
  } else {
    // Simulação Local
    const saved = localStorage.getItem('manual_claims_jpa') || '[]';
    const claims = JSON.parse(saved);
    claims.push({
        ...claimData,
        id: `claim-${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString()
    });
    localStorage.setItem('manual_claims_jpa', JSON.stringify(claims));
  }
  return true;
};

/**
 * Busca métricas globais para o painel administrativo.
 */
export const getAdminGlobalMetrics = async () => {
  // Placeholder metrics as cashback-specific ones were removed
  return { totalStores: 50, activeUsers: 1200, pendingClaims: 5 };
};

/**
 * Busca a lista de lojistas para administração.
 */
export const fetchAdminMerchants = async (searchTerm: string = '') => {
  if (!supabase) return [];
  let query = supabase.from('merchants').select('*, profiles(email)');
  if (searchTerm) { query = query.ilike('name', `%${searchTerm}%`); }
  const { data, error } = await query.order('name');
  if (error) return [];
  return data || [];
};

/**
 * Busca a lista de usuários para administração.
 */
export const fetchAdminUsers = async (searchTerm: string = '') => {
  if (!supabase) return [];
  let query = supabase.from('profiles').select('*').eq('role', 'cliente');
  if (searchTerm) { query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`); }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

/**
 * Busca o histórico transacional global (Ledger).
 */
export const fetchAdminLedger = async () => {
  return []; // Placeholder as cashback ledger was removed
};
