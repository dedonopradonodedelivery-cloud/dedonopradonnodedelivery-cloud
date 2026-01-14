# Check Final de Consistência - Recurso Cupom Local

## 1. Coerência entre Regras de Negócio
1.  A regra de vigência mínima de 15 dias é consistente com a máquina de estados, impedindo transição prematura para `ENDED`.
2.  A restrição de unicidade de token (`user_id` + `campaign_id`) garante a idempotência lógica da emissão.
3.  A transição `PENDING_PAYMENT` -> `ACTIVE` respeita a exclusividade do Webhook como gatilho.

## 2. Coerência entre Cobrança e Período
4.  O cálculo de custo fixo semanal alinha-se com a vigência mínima, evitando fracionamento de cobrança inválido.
5.  A conciliação via Webhook (`amount_paid` vs. `campaign_cost`) impede ativação sem cobertura financeira integral.

## 3. Coerência entre QR Code e Validação
6.  O TTL de 300 segundos no payload do token é validado estritamente pelo servidor (UTC), mitigando clock skew do cliente.
7.  A validação atômica de `merchant_id` impede que tokens de uma campanha sejam consumidos em estabelecimento não autorizado.

## 4. Coerência entre Segurança e Permissões
8.  O RBAC separa estritamente as rotas de emissão (Consumidor) e validação (Lojista), prevenindo auto-validação.
9.  O Rate Limiting diferenciado por role protege contra DoS na geração e força bruta na validação.

## 5. Pontos Únicos de Falha
10. Dependência exclusiva do Webhook do Gateway para ativação (risco de latência ou perda de pacote).
11. Dependência do relógio do servidor (NTP) para validação de TTL.

## 6. Dependências Críticas
12. Banco de dados relacional com suporte a transações ACID para garantir a integridade do `REDEEM`.
13. Serviço de Cache (Redis) operacional para enforcement de Rate Limits em tempo real.

## 7. Confirmação de Escopo
14. O escopo está fechado, consistente e tecnicamente executável conforme as especificações de Baseline, Freeze e Handoff.