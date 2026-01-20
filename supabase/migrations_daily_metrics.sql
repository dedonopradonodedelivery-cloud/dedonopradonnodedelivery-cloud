-- 1. Tabela de Agregação Diária
-- Esta tabela armazena os totais diários para evitar consultas pesadas nas tabelas de eventos.
CREATE TABLE IF NOT EXISTS public.metrics_daily (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    store_id TEXT NOT NULL,
    neighborhood TEXT,
    channel TEXT NOT NULL CHECK (channel IN ('organic', 'paid')),
    placement TEXT, -- ex: 'home', 'category', 'store_profile'
    banner_id TEXT, -- Apenas para o canal 'paid'
    impressions INTEGER DEFAULT 0, -- Impressões de anúncios
    views INTEGER DEFAULT 0,       -- Visualizações de perfil orgânico
    clicks INTEGER DEFAULT 0,      -- Cliques em anúncios
    leads INTEGER DEFAULT 0,       -- Cliques de contato orgânico (zap, call, etc.)
    
    -- Constraint para garantir uma única linha por combinação de métricas por dia. Essencial para o ON CONFLICT.
    CONSTRAINT unique_daily_metric UNIQUE (date, store_id, neighborhood, channel, placement, banner_id)
);

COMMENT ON TABLE public.metrics_daily IS 'Armazena métricas agregadas por dia para performance em dashboards.';
COMMENT ON COLUMN public.metrics_daily.leads IS 'Agrega cliques de contato orgânico (whatsapp, call, instagram, directions, share, favorite).';

-- Índices para acelerar consultas no futuro dashboard
CREATE INDEX IF NOT EXISTS idx_metrics_daily_store_date ON public.metrics_daily(store_id, date);
CREATE INDEX IF NOT EXISTS idx_metrics_daily_channel_date ON public.metrics_daily(channel, date);


-- 2. Habilita RLS (Row Level Security)
ALTER TABLE public.metrics_daily ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
-- Admins podem ler tudo. Ninguém pode inserir/atualizar diretamente, apenas a função do trigger.
DROP POLICY IF EXISTS "Admins can read all daily metrics" ON public.metrics_daily;
CREATE POLICY "Admins can read all daily metrics" 
ON public.metrics_daily FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'email' = 'dedonopradonodedelivery@gmail.com');

-- Lojistas poderão ler suas próprias métricas no futuro dashboard
DROP POLICY IF EXISTS "Merchants can read their own metrics" ON public.metrics_daily;
CREATE POLICY "Merchants can read their own metrics"
ON public.metrics_daily FOR SELECT
TO authenticated
USING (store_id IN (
  SELECT m.id::text FROM public.merchants m WHERE m.owner_id = auth.uid()
));


-- 4. Função de Agregação (Coração da Lógica)
-- Esta função é chamada por um trigger e faz o "upsert" (INSERT ou UPDATE) na tabela de métricas.
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
    -- Identifica de qual tabela de eventos o registro veio
    IF TG_TABLE_NAME = 'store_organic_events' THEN
        v_channel := 'organic';
        v_placement := 'store_profile'; -- Eventos orgânicos sempre acontecem no perfil da loja
        v_banner_id := NULL;

        IF NEW.event_type = 'store_view' THEN
            v_views_inc := 1;
        ELSE -- Considera todos os outros cliques (whatsapp, call, etc.) como 'leads'
            v_leads_inc := 1;
        END IF;

    ELSIF TG_TABLE_NAME = 'store_ad_events' THEN
        v_channel := 'paid';
        v_placement := NEW.placement;
        v_banner_id := NEW.banner_id;

        IF NEW.event_type = 'ad_impression' THEN
            v_impressions_inc := 1;
        ELSIF NEW.event_type = 'ad_click' THEN
            v_clicks_inc := 1;
        END IF;
    ELSE
        -- Ignora triggers de tabelas não esperadas
        RETURN NEW;
    END IF;

    -- Upsert: Insere uma nova linha para a combinação de métricas do dia. 
    -- Se a linha já existir (ON CONFLICT), atualiza os contadores.
    INSERT INTO public.metrics_daily (
        date, store_id, neighborhood, channel, placement, banner_id,
        impressions, views, clicks, leads
    )
    VALUES (
        CURRENT_DATE, NEW.store_id, NEW.neighborhood, v_channel, v_placement, v_banner_id,
        v_impressions_inc, v_views_inc, v_clicks_inc, v_leads_inc
    )
    ON CONFLICT (date, store_id, neighborhood, channel, placement, banner_id)
    DO UPDATE SET
        impressions = public.metrics_daily.impressions + v_impressions_inc,
        views = public.metrics_daily.views + v_views_inc,
        clicks = public.metrics_daily.clicks + v_clicks_inc,
        leads = public.metrics_daily.leads + v_leads_inc;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Triggers
-- Conectam as tabelas de eventos à função de agregação.
-- DROP ... IF EXISTS garante que a migração possa ser executada múltiplas vezes sem erros.

DROP TRIGGER IF EXISTS on_organic_event_insert_aggregate ON public.store_organic_events;
CREATE TRIGGER on_organic_event_insert_aggregate
AFTER INSERT ON public.store_organic_events
FOR EACH ROW EXECUTE FUNCTION public.increment_daily_metric();

DROP TRIGGER IF EXISTS on_ad_event_insert_aggregate ON public.store_ad_events;
CREATE TRIGGER on_ad_event_insert_aggregate
AFTER INSERT ON public.store_ad_events
FOR EACH ROW EXECUTE FUNCTION public.increment_daily_metric();
