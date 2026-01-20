-- 1. Tabela para Eventos de Anúncios (ADS)
CREATE TABLE IF NOT EXISTS public.store_ad_events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_type TEXT NOT NULL CHECK (event_type IN ('ad_impression', 'ad_click')),
    banner_id TEXT NOT NULL,
    store_id TEXT, -- Pode ser slug ou UUID do merchant
    placement TEXT, -- 'home', 'category', 'subcategory'
    category TEXT,
    subcategory TEXT,
    neighborhood TEXT,
    source TEXT NOT NULL
);

COMMENT ON TABLE public.store_ad_events IS 'Registra eventos de impressão e cliques em banners de anúncios.';

-- 2. Habilita Row Level Security
ALTER TABLE public.store_ad_events ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
-- Permite que qualquer cliente (anon) insira eventos, garantindo que a fonte seja 'paid'.
CREATE POLICY "Allow anon insert on paid ad events" 
ON public.store_ad_events FOR INSERT TO anon 
WITH CHECK (source = 'paid');

-- Permite que administradores leiam todos os eventos para análise.
CREATE POLICY "Admins can read all ad events" 
ON public.store_ad_events FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
