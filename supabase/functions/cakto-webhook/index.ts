import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CaktoWebhookPayload {
  event_type: string;
  payment_id: string;
  order_id: string;
  customer_email: string;
  amount: number;
  status: string;
  created_at: string;
  product_name?: string;
  customer_data?: {
    name?: string;
    email?: string;
    document?: string;
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extrair parâmetros da URL (token, etc)
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const source = url.searchParams.get('source') || 'cakto';
    
    // Verificar chave secreta do webhook
    const expectedSecret = '23530c94-03e1-46f4-a734-4785e0e9d882';
    const webhookSecret = req.headers.get('X-Webhook-Secret') || req.headers.get('x-webhook-secret');
    
    console.log('Webhook chamado com parâmetros:', { token, source, url: req.url, hasSecret: !!webhookSecret });
    // Verificar se é uma requisição POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse do body da requisição
    const payload: CaktoWebhookPayload = await req.json();
    
    // Validar chave secreta (opcional - dependendo de como a Cakto envia)
    if (webhookSecret && webhookSecret !== expectedSecret) {
      console.error('Chave secreta inválida:', { received: webhookSecret, expected: expectedSecret });
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('Webhook recebido da Cakto:', payload);

    // Verificar se é um evento de pagamento aprovado
    if (payload.event_type !== 'payment.approved' && payload.status !== 'approved') {
      console.log('Evento ignorado - não é pagamento aprovado:', payload.event_type, payload.status);
      return new Response(
        JSON.stringify({ message: 'Event ignored - not payment approved' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar usuário pelo email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', payload.customer_email)
      .single();

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Determinar o plano baseado no valor pago
    let newPlan = 'free';
    if (payload.amount >= 29.90) {
      newPlan = 'pro';
    }

    // Atualizar plano do usuário
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ 
        plan: newPlan,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.id)
      .select();

    if (updateError) {
      console.error('Erro ao atualizar plano do usuário:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update user plan' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log da atualização para auditoria
    console.log(`Plano atualizado com sucesso:`, {
      userId: userData.id,
      email: payload.customer_email,
      oldPlan: userData.plan,
      newPlan: newPlan,
      paymentId: payload.payment_id,
      amount: payload.amount
    });

    // Opcional: Registrar transação em uma tabela de pagamentos
    const { error: paymentLogError } = await supabase
      .from('payment_logs')
      .insert({
        user_id: userData.id,
        payment_id: payload.payment_id,
        order_id: payload.order_id,
        amount: payload.amount,
        status: payload.status,
        plan: newPlan,
        cakto_payload: payload,
        processed_at: new Date().toISOString()
      })
      .select();

    if (paymentLogError) {
      console.warn('Aviso: Erro ao registrar log de pagamento (não crítico):', paymentLogError);
    }

    // Resposta de sucesso
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment processed successfully',
        user_id: userData.id,
        new_plan: newPlan
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 