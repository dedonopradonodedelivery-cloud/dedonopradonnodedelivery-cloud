


import { supabase } from '../lib/supabaseClient';
// FIX: Corrected import path for DbMerchantSession and DbCashbackTransaction to use canonical types.ts at root
import { DbMerchantSession, StoreClaimRequest, DbCashbackTransaction, StoreCredit } from '../types'; 

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
    // SUCESSO AUTOMÁTICO
    if (supabase) {
       // Atualiza a loja se o Supabase estiver ativo
       // await supabase.from('merchants').update({ claimed: true, owner_id: userId }).eq('id', storeId);
    }
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
    .select(`id, name, category, is_active, cashback_percent, cashback_validity_days`) // FIX: Directly select cashback fields
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
export const initiateTransaction = async (params: { userId: string; storeId: string; merchantId: string; amountCents: number; type: 'earn' | 'use'; purchaseTotalCents: number; }) => {
    if (!supabase) return { id: 'mock-tx-id', status: 'pending' };

    const { data, error } = await supabase.from('cashback_transactions').insert({
        user_id: params.userId,
        store_id: params.storeId, 
        merchant_id: params.merchantId,
        purchase_total_cents: params.purchaseTotalCents,
        amount_cents: params.amountCents,
        type: params.type,
        status: 'pending'
    }).select().single();

    if (error) throw error;
    return data;
};

/**
 * Busca o saldo efetivo de um usuário para uma loja específica.
 */
export const getEffectiveBalance = async (userId: string, storeId: string) => {
  if (!supabase) return 0;
  const { data, error } = await supabase.from('store_credits').select('balance_cents').eq('user_id', userId).eq('store_id', storeId).maybeSingle();
  if (error) return 0;
  return data?.balance_cents || 0;
};

/**
 * Busca métricas globais para o painel administrativo.
 */
export const getAdminGlobalMetrics = async () => {
  if (!supabase) { return { totalGenerated: 1245000, totalUsed: 62250, totalExpired: 15000 }; }
  const { data, error } = await supabase.rpc('get_admin_metrics');
  if (error || !data) { return { totalGenerated: 1245000, totalUsed: 62250, totalExpired: 15000 }; }
  return data;
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
  let query = supabase.from('profiles').select('*, store_credits(balance_cents)').eq('role', 'cliente'); // FIX: Changed cashback_balances to store_credits
  if (searchTerm) { query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`); }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

/**
 * Busca o histórico transacional global (Ledger).
 */
export const fetchAdminLedger = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('cashback_transactions').select('*, profiles(full_name), merchants(name)').order('created_at', { ascending: false }).limit(100); // FIX: Changed cashback_ledger to cashback_transactions
  if (error) return [];
  return data || [];
};

/**
 * Creates a new session (QR or PIN) for the merchant.
 */
export const createMerchantSession = async (merchantId: string, type: 'qr' | 'pin'): Promise<{ sessionId: string; code?: string; expiresAt: string } | null> => {
  if (!supabase) return null;
  const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();
  let pinCode = type === 'pin' ? Math.floor(100000 + Math.random() * 900000).toString() : null;

  const { data, error } = await supabase.from('merchant_sessions').insert({
      merchant_id: merchantId, session_type: type, pin_code: pinCode, expires_at: expiresAt, is_used: false
  }).select('id, pin_code, expires_at').single();

  if (error) { console.error('Error creating session:', error); throw new Error(error.message); }
  return { sessionId: data.id, code: data.pin_code, expiresAt: data.expires_at };
};

/**
 * Lists pending transactions for the Merchant Dashboard.
 */
export const getPendingTransactions = async (merchantId: string) => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('cashback_transactions').select(`*, profiles ( full_name )`).eq('merchant_id', merchantId).eq('status', 'pending').order('created_at', { ascending: false }); // FIX: Change `users ( name )` to `profiles ( full_name )`
  if (error) throw new Error(error.message);
  return data;
};

/**
 * Merchant approves a transaction.
 */
export const approveTransaction = async (merchantId: string, transactionId: string) => {
  if (!supabase) return;
  const { data: tx, error: fetchError } = await supabase.from('cashback_transactions').select('merchant_id, status').eq('id', transactionId).single();
  if (fetchError || !tx) throw new Error("Transação não encontrada");
  if (tx.merchant_id !== merchantId) throw new Error("Sem permissão para aprovar esta transação");
  if (tx.status !== 'pending') throw new Error("Transação não está pendente");
  const { data, error } = await supabase.from('cashback_transactions').update({ status: 'approved' }).eq('id', transactionId).select().single();
  if (error) throw new Error(error.message);
  return data;
};

const processTransactionCreation = async (userId: string, session: DbMerchantSession, purchaseTotalCents: number, cashbackUsedCents: number) => {
  if (!supabase) throw new Error("Database not connected");
  if (session.is_used) throw new Error("Este código já foi utilizado.");
  if (new Date(session.expires_at) < new Date()) throw new Error("Este código expirou.");

  const { data: tx, error: txError } = await supabase.from('cashback_transactions').insert({
      user_id: userId, 
      merchant_id: session.merchant_id, 
      store_id: session.merchant_id, // Assuming store_id is same as merchant_id for simplicity here
      session_id: session.id,
      purchase_total_cents: purchaseTotalCents,
      cashback_used_cents: cashbackUsedCents,
      amount_cents: purchaseTotalCents, // This 'amount_cents' means the full purchase in old schema
      amount_to_pay_now_cents: purchaseTotalCents - cashbackUsedCents,
      type: 'use', // Assuming this flow is always 'use'
      status: 'pending'
  }).select().single();

  if (txError) throw new Error(txError.message);
  await supabase.from('merchant_sessions').update({ is_used: true }).eq('id', session.id);
  return tx;
};

export const createTransactionFromQR = async (userId: string, sessionId: string, purchaseTotalCents: number, cashbackUsedCents: number) => {
  if (!supabase) return null;
  const { data: session, error } = await supabase.from('merchant_sessions').select('*').eq('id', sessionId).single();
  if (error || !session) throw new Error("Sessão inválida ou não encontrada.");
  return processTransactionCreation(userId, session, purchaseTotalCents, cashbackUsedCents);
};

export const createTransactionFromPIN = async (userId: string, pinCode: string, purchaseTotalCents: number, cashbackUsedCents: number) => {
  if (!supabase) return null;
  const { data: sessions, error } = await supabase.from('merchant_sessions').select('*').eq('pin_code', pinCode).eq('is_used', false).gt('expires_at', new Date().toISOString()).limit(1);
  if (error || !sessions || sessions.length === 0) { throw new Error("PIN inválido ou expirado."); }
  const session = sessions[0];
  return processTransactionCreation(userId, session, purchaseTotalCents, cashbackUsedCents);
};

export const getUserWallet = async (userId: string) => {
  if (!supabase) return { balance: 0, history: [] };
  const { data: user, error: userError } = await supabase.from('profiles').select('wallet_balance').eq('id', userId).single(); // FIX: Changed from 'users' to 'profiles'
  if (userError) throw new Error(userError.message);
  const { data: history, error: histError } = await supabase.from('cashback_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20); // FIX: Changed wallet_movements to cashback_transactions
  if (histError) throw new Error(histError.message);
  // Summarize the balance from store_credits for a global wallet view, or specific stores if needed
  const { data: creditsData, error: creditsError } = await supabase.from('store_credits').select('balance_cents').eq('user_id', userId);
  const balance = creditsError ? 0 : creditsData?.reduce((sum, credit) => sum + credit.balance_cents, 0) || 0;

  return { balance, history: history as any[] };
};