
-- 1. PERFIS E ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'cliente' CHECK (role IN ('admin', 'lojista', 'cliente')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LOJISTAS (MERCHANTS)
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    -- Identificador para QR Code (Oculta o ID real da tabela)
    secure_id UUID DEFAULT uuid_generate_v4() UNIQUE,
    -- Código para digitação manual (Curto e amigável)
    manual_code TEXT UNIQUE NOT NULL, 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONFIGURAÇÕES DE CASHBACK
CREATE TABLE IF NOT EXISTS public.merchant_cashback_settings (
    merchant_id UUID PRIMARY KEY REFERENCES public.merchants(id) ON DELETE CASCADE,
    cashback_percent NUMERIC(5,2) DEFAULT 5.0,
    validity_days INTEGER DEFAULT 30,
    min_purchase_cents INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSAÇÕES (O LIVRO RAZÃO / LEDGER)
CREATE TABLE IF NOT EXISTS public.cashback_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
    amount_cents INTEGER NOT NULL, -- Valor do cashback em si
    purchase_total_cents INTEGER,  -- Valor da compra original
    type TEXT CHECK (type IN ('credit', 'debit')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ
);

-- 5. SALDOS CONSOLIDADOS
CREATE TABLE IF NOT EXISTS public.cashback_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
    balance_cents INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, merchant_id)
);

-- 6. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_balances ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS DE ACESSO (RLS)

-- ADMIN: Acesso Total
CREATE POLICY "Admin All Access" ON public.profiles FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admin All Merchants" ON public.merchants FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admin All Transactions" ON public.cashback_transactions FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');

-- LOJISTA: Vê apenas sua própria loja e transações destinadas a ela
CREATE POLICY "Merchant See Self" ON public.merchants FOR SELECT TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "Merchant See Own Transactions" ON public.cashback_transactions FOR SELECT TO authenticated 
USING (merchant_id IN (SELECT id FROM public.merchants WHERE owner_id = auth.uid()));

-- USUÁRIO: Vê apenas seus próprios dados e saldos
CREATE POLICY "User See Self" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "User See Own Transactions" ON public.cashback_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "User See Own Balances" ON public.cashback_balances FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 8. AUTOMAÇÃO DE SALDO (TRIGGER)
CREATE OR REPLACE FUNCTION public.sync_cashback_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Só processa se a transação for aprovada agora
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

CREATE TRIGGER tr_sync_balance
AFTER UPDATE ON public.cashback_transactions
FOR EACH ROW EXECUTE FUNCTION public.sync_cashback_balance();
