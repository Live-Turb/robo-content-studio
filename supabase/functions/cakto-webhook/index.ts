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

    // Tentar múltiplas formas de identificar o usuário
    let userData = null;
    let userError = null;

    // 1. Tentar buscar por session_id em payment_intents (mais seguro)
    const sessionIdFromParams = url.searchParams.get('session_id');
    
    if (sessionIdFromParams) {
      console.log('Tentando buscar usuário por session_id:', sessionIdFromParams);
      const intentResult = await supabase
        .from('payment_intents')
        .select('user_id, email, users(*)')
        .eq('session_id', sessionIdFromParams)
        .eq('status', 'pending')
        .single();
        
      if (intentResult.data) {
        userData = intentResult.data.users;
        
        // Marcar intenção como completada
        await supabase
          .from('payment_intents')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('session_id', sessionIdFromParams);
          
        console.log('Usuário identificado via session_id:', userData?.email);
      }
    }

    // 2. Tentar buscar por user_id se fornecido nos parâmetros da URL ou payload
    const userIdFromParams = url.searchParams.get('user_id');
    const userIdFromPayload = payload.customer_data?.document; // Caso a Cakto passe o user_id aqui
    
    if (!userData && userIdFromParams) {
      console.log('Tentando buscar usuário por user_id:', userIdFromParams);
      const result = await supabase
        .from('users')
        .select('*')
        .eq('id', userIdFromParams)
        .single();
      userData = result.data;
      userError = result.error;
    }

    // 3. Se não encontrou por user_id, tentar pelo email do pagamento
    if (!userData && payload.customer_email) {
      console.log('Tentando buscar usuário por email:', payload.customer_email);
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', payload.customer_email)
        .single();
      userData = result.data;
      userError = result.error;
    }

    // 4. Se ainda não encontrou, tentar por email nos custom fields (se a Cakto permitir)
    if (!userData && payload.customer_data?.email) {
      console.log('Tentando buscar usuário por customer_data.email:', payload.customer_data.email);
      const result = await supabase
        .from('users')
        .select('*')
        .eq('email', payload.customer_data.email)
        .single();
      userData = result.data;
      userError = result.error;
    }

    if (userError || !userData) {
      console.error('Erro ao buscar usuário em todas as tentativas:', { 
        userError, 
        payload_email: payload.customer_email,
        custom_email: payload.customer_data?.email,
        user_id_param: userIdFromParams,
        user_id_payload: userIdFromPayload
      });
      return new Response(
        JSON.stringify({ 
          error: 'User not found',
          debug_info: {
            tried_user_id: userIdFromParams,
            tried_email: payload.customer_email,
            tried_custom_email: payload.customer_data?.email
          }
        }),
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
      userEmail: userData.email,
      paymentEmail: payload.customer_email,
      oldPlan: userData.plan,
      newPlan: newPlan,
      paymentId: payload.payment_id,
      orderId: payload.order_id,
      amount: payload.amount,
      identificationMethod: userIdFromParams ? 'user_id' : 'email',
      webhookParams: {
        token,
        source,
        user_id: userIdFromParams
      }
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