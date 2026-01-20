-- 1. Tabela para Banners Publicados
CREATE TABLE IF NOT EXISTS public.published_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target TEXT NOT NULL, -- ex: 'home', 'category:Comida', 'subcategory:Pizzarias'
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
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
