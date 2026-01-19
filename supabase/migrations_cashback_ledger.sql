
-- 1. Tabela Principal de Transações (Fluxo de Aprovação)
CREATE TABLE IF NOT EXISTS cashback_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    store_id TEXT NOT NULL,
    merchant_id UUID REFERENCES auth.users(id),
    amount_cents INTEGER NOT NULL,
    purchase_total_cents INTEGER,
    type TEXT CHECK (type IN ('earn', 'use')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ
);

-- 2. Tabela de Ledger (Razão Imutável)
-- Esta tabela armazena a verdade absoluta sobre os créditos.
CREATE TABLE IF NOT EXISTS cashback_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    store_id TEXT NOT NULL,
    transaction_id UUID REFERENCES cashback_transactions(id),
    amount_cents INTEGER NOT NULL,
    type TEXT CHECK (type IN ('credit', 'debit')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ -- Obrigatório para créditos
);

-- 3. Tabela de Saldos Consolidados (Cache para Performance)
CREATE TABLE IF NOT EXISTS store_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    store_id TEXT NOT NULL,
    balance_cents INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, store_id)
);

-- 4. Função para marcar créditos expirados (Rodar via Cron ou Trigger de Leitura)
CREATE OR REPLACE FUNCTION handle_cashback_expiration()
RETURNS void AS $$
BEGIN
    UPDATE cashback_ledger
    SET status = 'expired'
    WHERE type = 'credit'
      AND status = 'active'
      AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 5. Índices para performance nas regras de exclusividade
CREATE INDEX idx_ledger_user_store ON cashback_ledger(user_id, store_id, status, expires_at);
CREATE INDEX idx_tx_merchant_pending ON cashback_transactions(merchant_id, status) WHERE status = 'pending';
