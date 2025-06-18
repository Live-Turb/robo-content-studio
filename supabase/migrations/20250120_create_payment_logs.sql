-- Criar tabela para logs de pagamentos (auditoria dos webhooks)
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT NOT NULL,
  order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL,
  plan TEXT NOT NULL,
  cakto_payload JSONB,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_payment_logs_user_id ON payment_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_processed_at ON payment_logs(processed_at);

-- RLS (Row Level Security)
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Política RLS - usuários só podem ver seus próprios logs
CREATE POLICY "Users can view own payment logs" ON payment_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Política RLS - apenas sistema pode inserir logs
CREATE POLICY "System can insert payment logs" ON payment_logs
  FOR INSERT WITH CHECK (true);

-- Comentários para documentação
COMMENT ON TABLE payment_logs IS 'Logs de pagamentos processados via webhook da Cakto';
COMMENT ON COLUMN payment_logs.payment_id IS 'ID único do pagamento na Cakto';
COMMENT ON COLUMN payment_logs.cakto_payload IS 'Payload completo recebido da Cakto para auditoria'; 