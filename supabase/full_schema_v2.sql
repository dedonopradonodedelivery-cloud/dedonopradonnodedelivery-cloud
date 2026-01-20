-- This is a consolidated schema file.
-- It combines multiple migration files into a single source of truth.

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PERFIS (ESTENDIDA)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'cliente' CHECK (role IN ('admin', 'lojista', 'cliente')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE LOJISTAS
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    category TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONFIGURAÇÕES DE CASHBACK (VINCULADA AO LOJISTA)
CREATE TABLE IF NOT EXISTS public.merchant_cashback_settings (
    merchant_id UUID PRIMARY KEY REFERENCES public.merchants(id),
    cashback_percent NUMERIC(5,2) DEFAULT 5.0,
    validity_days INTEGER DEFAULT 30,
    allow_partial_use BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEDGER DE TRANSAÇÕES (IMUTÁVEL)
CREATE TABLE IF NOT EXISTS public.cashback_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
    amount_cents INTEGER NOT NULL, -- Valor do cashback movimentado
    purchase_total_cents INTEGER, -- Valor da NF
    type TEXT CHECK (type IN ('credit', 'debit', 'expiration')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ
);

-- 6. SALDOS CONSOLIDADOS (BALANCES)
CREATE TABLE IF NOT EXISTS public.cashback_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
    balance_cents INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, merchant_id)
);

-- 7. RLS (ROW LEVEL SECURITY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_balances ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS ADMIN (Acesso Total)
CREATE POLICY "Admins have total access" ON public.profiles FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins see all merchants" ON public.merchants FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins see all transactions" ON public.cashback_transactions FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins see all balances" ON public.cashback_balances FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');

-- POLÍTICAS LOJISTA
CREATE POLICY "Merchants see own data" ON public.merchants FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Merchants see own transactions" ON public.cashback_transactions FOR SELECT TO authenticated USING (merchant_id IN (SELECT id FROM public.merchants WHERE owner_id = auth.uid()));

-- POLÍTICAS USUÁRIO
CREATE POLICY "Users see own transactions" ON public.cashback_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users see own balances" ON public.cashback_balances FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 8. TRIGGER: ATUALIZA SALDO AUTOMATICAMENTE NA APROVAÇÃO
CREATE OR REPLACE FUNCTION update_balance_on_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'approved' AND OLD.status = 'pending') THEN
        INSERT INTO public.cashback_balances (user_id, merchant_id, balance_cents, updated_at)
        VALUES (
            NEW.user_id, 
            NEW.merchant_id, 
            CASE WHEN NEW.type = 'credit' THEN NEW.amount_cents ELSE -NEW.amount_cents END,
            NOW()
        )
        ON CONFLICT (user_id, merchant_id) DO UPDATE
        SET balance_cents = public.cashback_balances.balance_cents + (CASE WHEN NEW.type = 'credit' THEN NEW.amount_cents ELSE -NEW.amount_cents END),
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_balance
AFTER UPDATE ON public.cashback_transactions
FOR EACH ROW EXECUTE FUNCTION update_balance_on_approval();

-- === MERGED FROM supabase/migrations_banner_system.sql ===

-- 1. Tabela para Banners Publicados
CREATE TABLE IF NOT EXISTS public.published_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target TEXT NOT NULL, -- ex: 'home', 'category:Comida', 'subcategory:Pizzarias'
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    -- Garante que um lojista só pode ter um banner ativo por alvo
    CONSTRAINT unique_merchant_target UNIQUE (merchant_id, target)
);
COMMENT ON TABLE public.published_banners IS 'Armazena banners criados por lojistas que estão ativos no app.';
COMMENT ON COLUMN public.published_banners.target IS 'Define onde o banner será exibido.';

-- 2. Tabela de Log de Auditoria para Banners
CREATE TABLE IF NOT EXISTS public.banner_audit_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    actor_id UUID REFERENCES auth.users(id), -- Quem fez a ação (lojista ou admin)
    actor_email TEXT,
    action TEXT NOT NULL, -- 'created', 'updated', 'paused', 'deleted'
    banner_id UUID REFERENCES public.published_banners(id) ON DELETE SET NULL,
    details JSONB -- Detalhes da ação, como a config antiga/nova ou o motivo da pausa
);
COMMENT ON TABLE public.banner_audit_log IS 'Registra o histórico de todas as ações relacionadas a banners.';

-- 3. Habilitar RLS
ALTER TABLE public.published_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_audit_log ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acesso (RLS)

-- PUBLISHED_BANNERS
-- Leitura pública para banners ativos
CREATE POLICY "Public can read active banners" ON public.published_banners
    FOR SELECT USING (is_active = TRUE);

-- Lojistas podem gerenciar (CRUD) seus próprios banners
CREATE POLICY "Merchants can manage their own banners" ON public.published_banners
    FOR ALL USING (auth.uid() = merchant_id)
    WITH CHECK (auth.uid() = merchant_id);

-- Admins têm acesso total
CREATE POLICY "Admins have full access to banners" ON public.published_banners
    FOR ALL USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');

-- BANNER_AUDIT_LOG
-- Admins podem ler todo o histórico
CREATE POLICY "Admins can read all audit logs" ON public.banner_audit_log
    FOR SELECT USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
-- Lojistas podem ver logs relacionados aos seus banners (opcional, mas bom para transparência)
CREATE POLICY "Merchants can see their own banner logs" ON public.banner_audit_log
    FOR SELECT USING (banner_id IN (SELECT id FROM public.published_banners WHERE merchant_id = auth.uid()));

-- Inserções no log são permitidas para usuários autenticados (a lógica de quem pode fazer o que é no app)
CREATE POLICY "Authenticated users can insert logs" ON public.banner_audit_log
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
