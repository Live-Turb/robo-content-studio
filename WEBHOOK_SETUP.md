# 🚀 Configuração do Webhook Cakto para VEO3

## 📋 Resumo da Integração

Esta integração permite que pagamentos processados pela Cakto automaticamente atualizem os planos dos usuários na plataforma VEO3.

### 🔗 Links Importantes:
- **Checkout Cakto**: https://pay.cakto.com.br/3enayhi_440790
- **Webhook URL**: https://viralprompt.superapps.ai/functions/v1/cakto-webhook?token=veo3_webhook_2024&source=cakto&event=payment
- **Site da plataforma**: https://viralprompt.superapps.ai

## 🛠️ Passos para Configuração

### 1. Deploy da Edge Function

```bash
# Na pasta robo-content-studio/
supabase functions deploy cakto-webhook
```

### 2. Configurar Variáveis de Ambiente

No dashboard do Supabase, configure:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### 3. Executar Migração da Tabela

```bash
# Aplicar migração para tabela de logs
supabase db push
```

### 4. Configuração na Cakto

Acesse o painel da Cakto e configure:

**URL do Webhook:**
```
https://viralprompt.superapps.ai/functions/v1/cakto-webhook?token=veo3_webhook_2024&source=cakto&event=payment
```

**Eventos para Monitorar:**
- ✅ `payment.approved`
- ✅ `payment.completed`

**Método HTTP:** `POST`

**Headers (opcional):**
```json
{
  "Content-Type": "application/json",
  "User-Agent": "Cakto-Webhook/1.0"
}
```

**Parâmetros da URL:**
- `token=veo3_webhook_2024` - Token de segurança para identificar requisições válidas
- `source=cakto` - Identificar origem do webhook
- `event=payment` - Tipo de evento sendo processado

## 📊 Estrutura do Payload da Cakto

Exemplo do payload que a Cakto enviará:

```json
{
  "event_type": "payment.approved",
  "payment_id": "pay_123456789",
  "order_id": "order_987654321",
  "customer_email": "cliente@exemplo.com",
  "amount": 29.90,
  "status": "approved",
  "created_at": "2024-01-20T10:30:00Z",
  "product_name": "VEO3 Pro Plan",
  "customer_data": {
    "name": "João Silva",
    "email": "cliente@exemplo.com",
    "document": "123.456.789-00"
  }
}
```

## 🎯 Lógica de Planos

| Valor Pago | Plano Atribuído |
|------------|-----------------|
| < R$ 29,90 | `free` |
| ≥ R$ 29,90 | `pro` |

## 🔍 Monitoramento e Logs

### Ver logs da Edge Function:
```bash
supabase functions logs cakto-webhook
```

### Verificar logs de pagamentos:
```sql
SELECT * FROM payment_logs 
ORDER BY processed_at DESC 
LIMIT 10;
```

### Verificar atualizações de planos:
```sql
SELECT 
  u.email,
  u.plan,
  u.updated_at,
  p.amount,
  p.payment_id
FROM users u
LEFT JOIN payment_logs p ON u.id = p.user_id
WHERE u.plan = 'pro'
ORDER BY u.updated_at DESC;
```

## 🧪 Teste do Webhook

### Teste Local (desenvolvimento):
```bash
# Terminal 1 - Iniciar Edge Functions localmente
supabase functions serve cakto-webhook

# Terminal 2 - Teste com curl
curl -X POST http://localhost:54321/functions/v1/cakto-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "payment.approved",
    "payment_id": "test_123",
    "order_id": "order_test",
    "customer_email": "teste@exemplo.com",
    "amount": 29.90,
    "status": "approved",
    "created_at": "2024-01-20T10:30:00Z"
  }'
```

### Teste em Produção:
```bash
curl -X POST "https://viralprompt.superapps.ai/functions/v1/cakto-webhook?token=veo3_webhook_2024&source=cakto&event=payment" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "payment.approved",
    "payment_id": "prod_test_123",
    "order_id": "order_prod_test",
    "customer_email": "seu-email@exemplo.com",
    "amount": 29.90,
    "status": "approved",
    "created_at": "2024-01-20T10:30:00Z"
  }'
```

## 🔒 Segurança

### Headers de Autenticação (recomendado):
Se a Cakto suportar headers customizados, configure:
```json
{
  "Authorization": "Bearer seu_token_secreto",
  "X-Webhook-Source": "cakto"
}
```

### Validação de IP (opcional):
Adicione validação dos IPs da Cakto na Edge Function se necessário.

## 📈 Limitações Implementadas

### Plano Gratuito:
- ✅ 2 prompts por dia
- ✅ Máximo 15 prompts por mês
- ✅ 3 personagens máximo
- ❌ Bloqueio após atingir limites

### Plano Pro (R$ 29,90):
- ✅ Prompts ilimitados
- ✅ Personagens ilimitados
- ✅ Análise viral avançada
- ✅ Templates premium
- ✅ Suporte prioritário

## 🚨 Troubleshooting

### Webhook não está funcionando:
1. Verificar logs da Edge Function
2. Confirmar URL está correta na Cakto
3. Testar com curl manualmente
4. Verificar se usuário existe no banco

### Plano não atualiza:
1. Verificar se email do pagamento coincide com usuário
2. Confirmar valor está ≥ R$ 29,90
3. Verificar logs da tabela `payment_logs`

### Erro 404:
- Confirmar que a Edge Function foi deployada
- Verificar URL está correta: `/functions/v1/cakto-webhook`

## 📞 Suporte

Para problemas técnicos:
1. Verificar logs do Supabase
2. Consultar documentação da Cakto
3. Testar webhook manualmente

---

## ✅ Checklist de Configuração

- [ ] Edge Function deployada
- [ ] Migração da tabela executada
- [ ] URL configurada na Cakto
- [ ] Eventos monitorados configurados
- [ ] Teste manual realizado
- [ ] Monitoramento configurado
- [ ] Hook de subscription implementado na aplicação

🎉 **Integração completa e funcional!** 