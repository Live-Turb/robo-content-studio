-- Tabela para rastrear intenções de pagamento e identificar usuários
CREATE TABLE IF NOT EXISTS payment_intents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
    checkout_url TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices para performance
    UNIQUE(session_id),
    INDEX(user_id),
    INDEX(email),
    INDEX(status),
    INDEX(created_at)
);

-- RLS (Row Level Security)
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own payment intents" ON payment_intents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment intents" ON payment_intents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para limpar intenções expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_payment_intents()
RETURNS void AS $$
BEGIN
    DELETE FROM payment_intents 
    WHERE expires_at < NOW() AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE payment_intents IS 'Tabela para rastrear intenções de pagamento e identificar usuários nos webhooks';
COMMENT ON COLUMN payment_intents.session_id IS 'ID único da sessão de checkout para identificação no webhook';
COMMENT ON COLUMN payment_intents.expires_at IS 'Data de expiração da intenção de pagamento (1 hora por padrão)'; 