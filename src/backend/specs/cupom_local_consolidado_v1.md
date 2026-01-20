# Documento Consolidado - Recurso Cupom Local v1.0

## 1. Definição do Recurso
O sistema "Cupom Local" consiste em uma infraestrutura de backend para orquestração de campanhas promocionais do tipo pré-pago, gerenciando o ciclo de vida transacional desde a criação, passando pela ativação financeira via webhook, emissão de tokens criptográficos efêmeros e validação atômica server-side.

## 2. Regras de Negócio Finais
1.  **Ciclo de Vida:** A máquina de estados da campanha obedece estritamente ao fluxo: `PENDING_PAYMENT` (Criação) -> `ACTIVE` (Confirmação Financeira) -> `ENDED` (Término de Vigência ou Esgotamento).
2.  **Vigência Mínima:** A duração mínima de uma campanha ativa é de 15 dias corridos.
3.  **Unicidade:** É permitida a geração de apenas 1 (um) token ativo por par `user_id` + `campaign_id`.
4.  **Consumo:** A transição de estado do token de `GENERATED` para `REDEEMED` é irreversível e única.

## 3. Regras de Cobrança Finais
1.  **Modelo:** Taxa fixa semanal pré-paga, sem renovação automática.
2.  **Gatilho de Ativação:** A mudança de status para `ACTIVE` depende exclusivamente do recebimento de um payload de sucesso via Webhook seguro do Gateway de Pagamento.
3.  **Conciliação:** O sistema deve validar matematicamente se `amount_paid` (webhook) >= `campaign_cost` (banco de dados) antes da ativação.

## 4. Fluxo Técnico Resumido
1.  **Criação:** `POST /campaigns` registra a intenção e retorna payload para checkout externo.
2.  **Ativação:** `POST /webhooks/payment` recebe confirmação, valida assinatura e altera status da campanha.
3.  **Emissão:** `POST /tokens` (Consumidor) verifica elegibilidade e gera hash com TTL.
4.  **Validação:** `POST /validate` (Lojista) recebe hash, verifica integridade e efetiva o consumo no banco de dados.

## 5. Regras de QR Code e Validação
1.  **Payload:** O conteúdo do QR Code deve ser um hash SHA-256 ou UUIDv4 opaco, sem dados de negócio expostos.
2.  **TTL (Time-to-Live):** O token expira em exatos 300 segundos (5 minutos) após a geração.
3.  **Relógio Mestre:** A validação de expiração utiliza exclusivamente o horário do servidor (UTC/NTP).
4.  **Verificações Atômicas:**
    *   Existência do token.
    *   Correspondência entre `merchant_id` do token e do validador.
    *   Vigência (`expires_at` > `now`).
    *   Status atual (`GENERATED`).

## 6. Segurança e Permissões
1.  **RBAC:** Segregação estrita de endpoints. Apenas `role: consumer` gera tokens. Apenas `role: merchant` valida tokens.
2.  **Rate Limiting (Geração):** Limite de 3 requisições por minuto por `user_id`.
3.  **Rate Limiting (Validação):** Limite de 60 requisições por minuto por `merchant_id`.
4.  **Bloqueio:** IP/User banido temporariamente após 5 tentativas falhas consecutivas (Força Bruta).

## 7. Métricas e Monitoramento
1.  **Integridade Financeira:** Monitoramento contínuo de divergências entre pagamentos recebidos e campanhas ativas (Target: 0%).
2.  **Latência:** O endpoint de validação (`POST /validate`) deve responder em < 200ms (p95).
3.  **Disponibilidade:** SLA de 99.90% para a API de validação.

## 8. Casos de Erro Críticos
1.  **410 Gone:** Retornado quando o TTL do token expirou.
2.  **409 Conflict:** Retornado na tentativa de reutilizar um token já consumido (`REDEEMED`).
3.  **403 Forbidden:** Retornado se o `merchant_id` do validador não corresponder ao dono da campanha.
4.  **402 Payment Required:** Retornado se a campanha não estiver no status `ACTIVE`.

## 9. Proibições Explícitas
1.  Proibida implementação de validação offline.
2.  Proibida exposição de PII (Dados Pessoais) no payload do token ou resposta da validação.
3.  Proibida alteração manual de status de pagamento via API pública.
4.  Proibida criação de campanhas "Pós-pagas" ou "Gratuitas" nesta versão.

## 10. Declaração de Escopo Fechado
O desenvolvimento, homologação e operação do recurso "Cupom Local v1.0" limitam-se estritamente aos itens listados neste documento. Nenhuma funcionalidade adicional, interface de usuário ou integração externa não especificada será aceita.
