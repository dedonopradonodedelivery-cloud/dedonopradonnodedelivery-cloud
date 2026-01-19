
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
