import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionLimits {
  dailyPrompts: number;
  monthlyPrompts: number;
  charactersLimit: number;
  hasUnlimitedPrompts: boolean;
  hasPrioritySupport: boolean;
  hasAdvancedAnalysis: boolean;
  hasPremiumTemplates: boolean;
}

interface UsageStats {
  dailyPromptsUsed: number;
  monthlyPromptsUsed: number;
  charactersCreated: number;
  canCreatePrompt: boolean;
  canCreateCharacter: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<UsageStats>({
    dailyPromptsUsed: 0,
    monthlyPromptsUsed: 0,
    charactersCreated: 0,
    canCreatePrompt: false,
    canCreateCharacter: false,
  });

  // Definir limites baseados no plano
  const getLimits = (userPlan: string): SubscriptionLimits => {
    switch (userPlan) {
      case 'pro':
        return {
          dailyPrompts: -1, // Ilimitado
          monthlyPrompts: -1, // Ilimitado
          charactersLimit: -1, // Ilimitado
          hasUnlimitedPrompts: true,
          hasPrioritySupport: true,
          hasAdvancedAnalysis: true,
          hasPremiumTemplates: true,
        };
      case 'free':
      default:
        return {
          dailyPrompts: 2,
          monthlyPrompts: 15,
          charactersLimit: 3,
          hasUnlimitedPrompts: false,
          hasPrioritySupport: false,
          hasAdvancedAnalysis: false,
          hasPremiumTemplates: false,
        };
    }
  };

  const limits = getLimits(plan);

  // Buscar informações do usuário e plano
  const fetchUserPlan = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('plan, daily_generations')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar plano do usuário:', error);
        return;
      }

      setPlan(data?.plan || 'free');
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
    }
  };

  // Buscar estatísticas de uso
  const fetchUsageStats = async () => {
    if (!user) return;

    try {
      // Buscar prompts criados hoje
      const today = new Date().toISOString().split('T')[0];
      const { count: dailyPrompts } = await supabase
        .from('videos')
        .select('id', { count: 'exact' })
        .eq('character_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      // Buscar prompts criados este mês
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { count: monthlyPrompts } = await supabase
        .from('videos')
        .select('id', { count: 'exact' })
        .eq('character_id', user.id)
        .gte('created_at', startOfMonth);

      // Buscar personagens criados
      const { count: characters } = await supabase
        .from('characters')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_active', true);

      const dailyUsed = dailyPrompts || 0;
      const monthlyUsed = monthlyPrompts || 0;
      const charactersUsed = characters || 0;

      setUsage({
        dailyPromptsUsed: dailyUsed,
        monthlyPromptsUsed: monthlyUsed,
        charactersCreated: charactersUsed,
        canCreatePrompt: limits.hasUnlimitedPrompts || 
          (dailyUsed < limits.dailyPrompts && monthlyUsed < limits.monthlyPrompts),
        canCreateCharacter: limits.charactersLimit === -1 || charactersUsed < limits.charactersLimit,
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas de uso:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar se pode criar prompt
  const canCreatePrompt = () => {
    if (limits.hasUnlimitedPrompts) return true;
    return usage.dailyPromptsUsed < limits.dailyPrompts && 
           usage.monthlyPromptsUsed < limits.monthlyPrompts;
  };

  // Verificar se pode criar personagem
  const canCreateCharacter = () => {
    if (limits.charactersLimit === -1) return true;
    return usage.charactersCreated < limits.charactersLimit;
  };

  // Incrementar uso de prompt (chamar após criar um prompt)
  const incrementPromptUsage = () => {
    setUsage(prev => ({
      ...prev,
      dailyPromptsUsed: prev.dailyPromptsUsed + 1,
      monthlyPromptsUsed: prev.monthlyPromptsUsed + 1,
      canCreatePrompt: limits.hasUnlimitedPrompts || 
        (prev.dailyPromptsUsed + 1 < limits.dailyPrompts && 
         prev.monthlyPromptsUsed + 1 < limits.monthlyPrompts),
    }));
  };

  // Incrementar uso de personagem (chamar após criar um personagem)
  const incrementCharacterUsage = () => {
    setUsage(prev => ({
      ...prev,
      charactersCreated: prev.charactersCreated + 1,
      canCreateCharacter: limits.charactersLimit === -1 || 
        prev.charactersCreated + 1 < limits.charactersLimit,
    }));
  };

  // URL de upgrade (link da Cakto personalizado por usuário)
  const getUpgradeUrl = async () => {
    const baseUrl = 'https://pay.cakto.com.br/3enayhi_440790';
    
    // Se há um usuário logado, criar intenção de pagamento e personalizar URL
    if (user?.email) {
      try {
        // Gerar session_id único
        const sessionId = `payment_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Registrar intenção de pagamento
        const { error } = await supabase
          .from('payment_intents')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            email: user.email,
            amount: 29.90,
            checkout_url: baseUrl
          });

        if (error) {
          console.warn('Erro ao registrar intenção de pagamento:', error);
        }

        // Personalizar URL com todos os identificadores possíveis
        const params = new URLSearchParams({
          email: user.email,
          user_id: user.id,
          session_id: sessionId,
          return_url: `${window.location.origin}/dashboard?payment_success=true`
        });
        
        return `${baseUrl}?${params.toString()}`;
      } catch (error) {
        console.warn('Erro ao gerar URL personalizada:', error);
      }
    }
    
    return baseUrl;
  };

  // Dados para modal de upgrade
  const getUpgradeModalData = () => {
    if (plan === 'pro') return null;

    const remainingDaily = limits.dailyPrompts - usage.dailyPromptsUsed;
    const remainingMonthly = limits.monthlyPrompts - usage.monthlyPromptsUsed;

    return {
      title: 'Limite Atingido! 🚀',
      subtitle: 'Upgrade para continuar criando conteúdo viral',
      currentUsage: {
        daily: `${usage.dailyPromptsUsed}/${limits.dailyPrompts} prompts hoje`,
        monthly: `${usage.monthlyPromptsUsed}/${limits.monthlyPrompts} prompts este mês`,
        characters: `${usage.charactersCreated}/${limits.charactersLimit} personagens`,
      },
      remaining: {
        daily: remainingDaily,
        monthly: remainingMonthly,
      },
      upgradeUrl: getUpgradeUrl(),
      benefits: [
        '🔥 Prompts ilimitados por dia',
        '🎯 Personagens ilimitados',
        '⚡ Análise viral avançada',
        '💎 Templates premium',
        '🎧 Suporte prioritário',
      ],
    };
  };

  useEffect(() => {
    if (user) {
      fetchUserPlan();
    }
  }, [user]);

  useEffect(() => {
    if (user && plan) {
      fetchUsageStats();
    }
  }, [user, plan]);

  return {
    plan,
    limits,
    usage,
    loading,
    canCreatePrompt: canCreatePrompt(),
    canCreateCharacter: canCreateCharacter(),
    incrementPromptUsage,
    incrementCharacterUsage,
    getUpgradeUrl,
    getUpgradeModalData,
    refreshUsage: fetchUsageStats,
    refreshPlan: fetchUserPlan,
  };
}; 