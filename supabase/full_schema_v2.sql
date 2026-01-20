-- Localizei JPA - Consolidated Master Schema
-- This file is the single source of truth for the database schema.
-- Apply this to your Supabase project to ensure all tables and functions are created correctly.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE TABLES (Profiles, Merchants)
-- Profiles Table (Users & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'cliente' CHECK (role IN ('admin', 'lojista', 'cliente')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merchants Table (Stores)
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    logo_url TEXT,
    secure_id UUID DEFAULT uuid_generate_v4() UNIQUE,
    manual_code TEXT UNIQUE, 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    onboarding_cashback_completed BOOLEAN DEFAULT FALSE,
    onboarding_cashback_completed_at TIMESTAMPTZ
);
COMMENT ON COLUMN public.merchants.secure_id IS 'Secure UUID for QR codes, hiding the primary key.';
COMMENT ON COLUMN public.merchants.manual_code IS 'Short, human-readable code for manual entry.';
COMMENT ON COLUMN public.merchants.onboarding_cashback_completed IS 'Flag that indicates if the merchant completed the cashback tutorial video.';

-- 3. CASHBACK SYSTEM TABLES

-- Cashback Settings per Merchant
CREATE TABLE IF NOT EXISTS public.merchant_cashback_settings (
    merchant_id UUID PRIMARY KEY REFERENCES public.merchants(id) ON DELETE CASCADE,
    cashback_percent NUMERIC(5,2) DEFAULT 5.0,
    validity_days INTEGER DEFAULT 30,
    min_purchase_cents INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cashback_active BOOLEAN DEFAULT TRUE
);

-- Cashback Transactions (The Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.cashback_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
    amount_cents INTEGER NOT NULL,
    purchase_total_cents INTEGER,
    type TEXT CHECK (type IN ('credit', 'debit')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ
);

-- Consolidated Balances (Performance Cache)
CREATE TABLE IF NOT EXISTS public.cashback_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) NOT NULL,
    balance_cents INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, merchant_id)
);

-- 4. BANNER & ADS SYSTEM TABLES

-- Published Banners
CREATE TABLE IF NOT EXISTS public.published_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target TEXT NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    CONSTRAINT unique_merchant_target UNIQUE (merchant_id, target)
);
COMMENT ON TABLE public.published_banners IS 'Stores active banners created by merchants.';
COMMENT ON COLUMN public.published_banners.target IS 'Defines where the banner appears (e.g., home, category:comida).';

-- Banner Audit Log
CREATE TABLE IF NOT EXISTS public.banner_audit_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    actor_id UUID REFERENCES auth.users(id),
    actor_email TEXT,
    action TEXT NOT NULL,
    banner_id UUID REFERENCES public.published_banners(id) ON DELETE SET NULL,
    details JSONB
);
COMMENT ON TABLE public.banner_audit_log IS 'Records all actions related to banners for auditing.';

-- 5. ANALYTICS & METRICS TABLES

-- Organic Events
CREATE TABLE IF NOT EXISTS public.store_organic_events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_type TEXT NOT NULL,
    store_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    neighborhood TEXT,
    source TEXT NOT NULL
);
COMMENT ON TABLE public.store_organic_events IS 'Tracks organic user interactions with store profiles.';

-- Ad Events
CREATE TABLE IF NOT EXISTS public.store_ad_events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_type TEXT NOT NULL CHECK (event_type IN ('ad_impression', 'ad_click')),
    banner_id TEXT NOT NULL,
    store_id TEXT,
    placement TEXT,
    category TEXT,
    subcategory TEXT,
    neighborhood TEXT,
    source TEXT NOT NULL
);
COMMENT ON TABLE public.store_ad_events IS 'Tracks impressions and clicks on paid ad banners.';

-- Daily Aggregated Metrics
CREATE TABLE IF NOT EXISTS public.metrics_daily (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    store_id TEXT NOT NULL,
    neighborhood TEXT,
    channel TEXT NOT NULL CHECK (channel IN ('organic', 'paid')),
    placement TEXT,
    banner_id TEXT,
    impressions INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    leads INTEGER DEFAULT 0,
    CONSTRAINT unique_daily_metric UNIQUE (date, store_id, neighborhood, channel, placement, banner_id)
);
COMMENT ON TABLE public.metrics_daily IS 'Stores daily aggregated metrics for dashboard performance.';
COMMENT ON COLUMN public.metrics_daily.leads IS 'Aggregates organic contact clicks (whatsapp, call, etc.).';


-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_metrics_daily_store_date ON public.metrics_daily(store_id, date);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_channel_date ON public.metrics_daily(channel, date);
CREATE INDEX IF NOT EXISTS idx_tx_merchant_pending ON public.cashback_transactions(merchant_id, status) WHERE status = 'pending';


-- 7. TRIGGERS & FUNCTIONS

-- Function to update cashback balance on transaction approval
CREATE OR REPLACE FUNCTION public.sync_cashback_balance()
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for cashback balance
DROP TRIGGER IF EXISTS tr_sync_balance ON public.cashback_transactions;
CREATE TRIGGER tr_sync_balance
AFTER UPDATE ON public.cashback_transactions
FOR EACH ROW EXECUTE FUNCTION public.sync_cashback_balance();

-- Function to aggregate daily metrics from events
CREATE OR REPLACE FUNCTION public.increment_daily_metric()
RETURNS TRIGGER AS $$
DECLARE
    v_channel TEXT;
    v_placement TEXT;
    v_banner_id TEXT;
    v_views_inc INTEGER := 0;
    v_impressions_inc INTEGER := 0;
    v_clicks_inc INTEGER := 0;
    v_leads_inc INTEGER := 0;
BEGIN
    IF TG_TABLE_NAME = 'store_organic_events' THEN
        v_channel := 'organic';
        v_placement := 'store_profile';
        v_banner_id := NULL;
        IF NEW.event_type = 'store_view' THEN v_views_inc := 1; ELSE v_leads_inc := 1; END IF;
    ELSIF TG_TABLE_NAME = 'store_ad_events' THEN
        v_channel := 'paid';
        v_placement := NEW.placement;
        v_banner_id := NEW.banner_id;
        IF NEW.event_type = 'ad_impression' THEN v_impressions_inc := 1; ELSIF NEW.event_type = 'ad_click' THEN v_clicks_inc := 1; END IF;
    ELSE
        RETURN NEW;
    END IF;

    INSERT INTO public.metrics_daily (date, store_id, neighborhood, channel, placement, banner_id, impressions, views, clicks, leads)
    VALUES (CURRENT_DATE, NEW.store_id, NEW.neighborhood, v_channel, v_placement, v_banner_id, v_impressions_inc, v_views_inc, v_clicks_inc, v_leads_inc)
    ON CONFLICT (date, store_id, neighborhood, channel, placement, banner_id)
    DO UPDATE SET
        impressions = public.metrics_daily.impressions + v_impressions_inc,
        views = public.metrics_daily.views + v_views_inc,
        clicks = public.metrics_daily.clicks + v_clicks_inc,
        leads = public.metrics_daily.leads + v_leads_inc;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for daily metrics
DROP TRIGGER IF EXISTS on_organic_event_insert_aggregate ON public.store_organic_events;
CREATE TRIGGER on_organic_event_insert_aggregate
AFTER INSERT ON public.store_organic_events
FOR EACH ROW EXECUTE FUNCTION public.increment_daily_metric();

DROP TRIGGER IF EXISTS on_ad_event_insert_aggregate ON public.store_ad_events;
CREATE TRIGGER on_ad_event_insert_aggregate
AFTER INSERT ON public.store_ad_events
FOR EACH ROW EXECUTE FUNCTION public.increment_daily_metric();


-- 8. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_organic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics_daily ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent errors on re-run
DROP POLICY IF EXISTS "Admin All Access" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Merchants" ON public.merchants;
DROP POLICY IF EXISTS "Admin All Transactions" ON public.cashback_transactions;
DROP POLICY IF EXISTS "Admins have full access to banners" ON public.published_banners;
DROP POLICY IF EXISTS "Admins can read all audit logs" ON public.banner_audit_log;
DROP POLICY IF EXISTS "Admins can read all events" ON public.store_organic_events;
DROP POLICY IF EXISTS "Admins can read all ad events" ON public.store_ad_events;
DROP POLICY IF EXISTS "Admins can read all daily metrics" ON public.metrics_daily;
DROP POLICY IF EXISTS "User See Self" ON public.profiles;
DROP POLICY IF EXISTS "Merchant See Self" ON public.merchants;
DROP POLICY IF EXISTS "Merchant See Own Transactions" ON public.cashback_transactions;
DROP POLICY IF EXISTS "Merchants can manage their own banners" ON public.published_banners;
DROP POLICY IF EXISTS "User See Own Transactions" ON public.cashback_transactions;
DROP POLICY IF EXISTS "User See Own Balances" ON public.cashback_balances;
DROP POLICY IF EXISTS "Allow anon insert on organic events" ON public.store_organic_events;
DROP POLICY IF EXISTS "Allow anon insert on paid ad events" ON public.store_ad_events;
DROP POLICY IF EXISTS "Public can read active banners" ON public.published_banners;
DROP POLICY IF EXISTS "Merchants can see their own banner logs" ON public.banner_audit_log;
DROP POLICY IF EXISTS "Authenticated users can insert logs" ON public.banner_audit_log;
DROP POLICY IF EXISTS "Merchants can read their own metrics" ON public.metrics_daily;

-- Admin Policies (Full Access)
CREATE POLICY "Admin All Access" ON public.profiles FOR ALL USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admin All Merchants" ON public.merchants FOR ALL USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admin All Transactions" ON public.cashback_transactions FOR ALL USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins have full access to banners" ON public.published_banners FOR ALL USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins can read all audit logs" ON public.banner_audit_log FOR SELECT USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins can read all events" ON public.store_organic_events FOR SELECT USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins can read all ad events" ON public.store_ad_events FOR SELECT USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
CREATE POLICY "Admins can read all daily metrics" ON public.metrics_daily FOR SELECT USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');

-- User/Merchant Policies (Self-service)
CREATE POLICY "User See Self" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Merchant See Self" ON public.merchants FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Merchant See Own Transactions" ON public.cashback_transactions FOR SELECT USING (merchant_id IN (SELECT id FROM public.merchants WHERE owner_id = auth.uid()));
CREATE POLICY "Merchants can manage their own banners" ON public.published_banners FOR ALL USING (auth.uid() = merchant_id) WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "User See Own Transactions" ON public.cashback_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "User See Own Balances" ON public.cashback_balances FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Merchants can read their own metrics" ON public.metrics_daily FOR SELECT USING (store_id IN (SELECT m.id::text FROM public.merchants m WHERE m.owner_id = auth.uid()));

-- Public/Anon Policies (For events and public data)
CREATE POLICY "Allow anon insert on organic events" ON public.store_organic_events FOR INSERT TO anon WITH CHECK (source = 'organic');
CREATE POLICY "Allow anon insert on paid ad events" ON public.store_ad_events FOR INSERT TO anon WITH CHECK (source = 'paid');
CREATE POLICY "Public can read active banners" ON public.published_banners FOR SELECT USING (is_active = TRUE);

-- Authenticated Policies (General permissions for logged-in users)
CREATE POLICY "Authenticated users can insert logs" ON public.banner_audit_log FOR INSERT WITH CHECK (auth.role() = 'authenticated');
