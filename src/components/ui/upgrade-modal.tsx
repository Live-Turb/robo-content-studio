import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Sparkles, TrendingUp, ArrowRight, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  currentUsage: {
    daily: string;
    monthly: string;
    characters: string;
  };
  remaining: {
    daily: number;
    monthly: number;
  };
  upgradeUrl: string | (() => Promise<string>);
  benefits: string[];
}

export const UpgradeModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  currentUsage,
  remaining,
  upgradeUrl,
  benefits,
}: UpgradeModalProps) => {
  const handleUpgrade = async () => {
    // Se upgradeUrl é uma função async, aguardar resultado
    const finalUrl = typeof upgradeUrl === 'function' ? await upgradeUrl() : upgradeUrl;
    window.open(finalUrl, '_blank');
    onClose();
  };

  const dailyProgress = remaining.daily <= 0 ? 100 : ((2 - remaining.daily) / 2) * 100;
  const monthlyProgress = remaining.monthly <= 0 ? 100 : ((15 - remaining.monthly) / 15) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Crown className="h-8 w-8 text-yellow-300" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-white mb-2">
                {title}
              </DialogTitle>
              <p className="text-purple-100 text-sm">{subtitle}</p>
            </DialogHeader>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Status de uso atual */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Seu Uso Atual
            </h4>
            
            <div className="space-y-4">
              {/* Uso diário */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">Prompts Hoje</span>
                  <Badge variant={remaining.daily <= 0 ? 'destructive' : 'secondary'} className="text-xs">
                    {currentUsage.daily}
                  </Badge>
                </div>
                <Progress value={dailyProgress} className="h-2" />
              </div>

              {/* Uso mensal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">Prompts Este Mês</span>
                  <Badge variant={remaining.monthly <= 0 ? 'destructive' : 'secondary'} className="text-xs">
                    {currentUsage.monthly}
                  </Badge>
                </div>
                <Progress value={monthlyProgress} className="h-2" />
              </div>

              {/* Personagens */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Personagens</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentUsage.characters}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Benefícios do Pro */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Com VEO3 Pro você ganha:
            </h4>
            
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preço especial */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
            <div className="text-2xl font-black text-gray-900 mb-1">
              <span className="text-lg text-gray-500 line-through mr-2">R$ 59,90</span>
              R$ 29,90
            </div>
            <div className="text-xs text-gray-600 mb-2">por mês • Primeira semana grátis</div>
            <Badge className="bg-green-100 text-green-800 text-xs">
              🔥 50% OFF por tempo limitado
            </Badge>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Crown className="h-5 w-5 mr-2" />
              Fazer Upgrade Agora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost" 
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Continuar com Plano Gratuito
            </Button>
          </div>

          {/* Garantia */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              ✅ Garantia de 7 dias • Cancele quando quiser
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 