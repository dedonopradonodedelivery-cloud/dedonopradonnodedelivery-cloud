
-- Migração: Adiciona campos de onboarding de cashback
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS onboarding_cashback_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_cashback_completed_at TIMESTAMPTZ;

-- Adiciona campos de configuração na tabela de settings se não existirem
ALTER TABLE public.merchant_cashback_settings
ADD COLUMN IF NOT EXISTS cashback_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS cashback_percent NUMERIC(5,2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS validity_days INTEGER DEFAULT 30;

-- Comentários para documentação
COMMENT ON COLUMN public.merchants.onboarding_cashback_completed IS 'Flag que indica se o lojista assistiu ao vídeo de treinamento';
COMMENT ON COLUMN public.merchants.onboarding_cashback_completed_at IS 'Data e hora da conclusão do treinamento';
