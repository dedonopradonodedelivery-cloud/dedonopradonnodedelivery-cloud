-- 1. Tabela para Eventos Orgânicos
CREATE TABLE IF NOT EXISTS public.store_organic_events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'store_view',
        'store_click_whatsapp',
        'store_click_call',
        'store_click_instagram',
        'store_click_directions',
        'store_click_share',
        'store_click_favorite',
        'store_click_promo',
        'store_click_product'
    )),
    store_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    neighborhood TEXT,
    source TEXT NOT NULL
);

COMMENT ON TABLE public.store_organic_events IS 'Registra eventos de interação orgânica dos usuários com as páginas de lojas.';

-- 2. Habilita Row Level Security
ALTER TABLE public.store_organic_events ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
-- Permite que qualquer cliente (anon) insira eventos, garantindo que a fonte seja 'organic'.
-- Isso é seguro pois o endpoint de insert não retorna dados sensíveis.
CREATE POLICY "Allow anon insert on organic events" 
ON public.store_organic_events FOR INSERT TO anon 
WITH CHECK (source = 'organic');

-- Permite que administradores leiam todos os eventos para análise.
CREATE POLICY "Admins can read all events" 
ON public.store_organic_events FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');
