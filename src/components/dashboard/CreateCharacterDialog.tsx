import { useState } from 'react';
import { Character } from '@/types/database';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/ui/upgrade-modal';
import { Sparkles, User, Palette, Brain, Eye } from 'lucide-react';

interface CreateCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCharacter: (character: Partial<Character>) => void;
}

const VISUAL_PRESETS = [
  {
    id: 'robot',
    name: 'Robô Futurista',
    description: 'Robô humanóide com visual cyberpunk',
    prompt: 'metallic blue humanoid robot, 6 feet tall, LED eyes glowing cyan, wearing a black hoodie with "AI" logo, smooth mechanical movements, futuristic design'
  },
  {
    id: 'anime',
    name: 'Personagem Anime',
    description: 'Estilo anime moderno e expressivo',
    prompt: 'anime character, large expressive eyes, colorful hair, modern casual clothing, dynamic poses, vibrant colors, manga style'
  },
  {
    id: 'mascot',
    name: 'Mascote Cartoon',
    description: 'Personagem divertido estilo cartoon',
    prompt: 'friendly cartoon mascot, round cheerful face, bright colors, expressive features, playful design, Disney-Pixar style'
  }
];

const PERSONALITY_PRESETS = [
  {
    id: 'funny',
    name: 'Comediante',
    description: 'Humorístico e descontraído',
    personality: 'Personagem engraçado e carismático que adora fazer piadas e comentários divertidos. Sempre otimista e animado, usa humor para conectar com a audiência.'
  },
  {
    id: 'educational',
    name: 'Educador',
    description: 'Inteligente e informativo',
    personality: 'Personagem inteligente que adora ensinar e compartilhar conhecimento de forma clara e interessante. Paciente e sempre disposto a explicar conceitos complexos.'
  },
  {
    id: 'trendy',
    name: 'Influencer Trendy',
    description: 'Moderno e antenado',
    personality: 'Personagem moderno que está sempre por dentro das últimas tendências. Energético, jovem e conectado com a cultura digital atual.'
  }
];

const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: '🇧🇷 Português (Brasil)' },
  { value: 'en-US', label: '🇺🇸 English (USA)' },
  { value: 'es-ES', label: '🇪🇸 Español (España)' },
  { value: 'es-MX', label: '🇲🇽 Español (México)' },
  { value: 'fr-FR', label: '🇫🇷 Français (France)' },
];

export function CreateCharacterDialog({ open, onOpenChange, onCreateCharacter }: CreateCharacterDialogProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedVisual, setSelectedVisual] = useState('');
  const [customVisual, setCustomVisual] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [customPersonality, setCustomPersonality] = useState('');
  const [language, setLanguage] = useState('pt-BR');
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();
  const { canCreateCharacter, getUpgradeModalData } = useSubscription();

  const resetForm = () => {
    setStep(1);
    setName('');
    setSelectedVisual('');
    setCustomVisual('');
    setSelectedPersonality('');
    setCustomPersonality('');
    setLanguage('pt-BR');
  };

  const handleCreate = async () => {
    // Verificar se pode criar personagens
    if (!canCreateCharacter) {
      setShowUpgradeModal(true);
      return;
    }

    if (!name || (!selectedVisual && !customVisual) || (!selectedPersonality && !customPersonality)) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar o personagem.",
      });
      return;
    }

    const visualPrompt = selectedVisual 
      ? VISUAL_PRESETS.find(p => p.id === selectedVisual)?.prompt || ''
      : customVisual;

    const personality = selectedPersonality 
      ? PERSONALITY_PRESETS.find(p => p.id === selectedPersonality)?.personality || ''
      : customPersonality;

    if (name.length < 3 || name.length > 100) {
      toast({
        variant: 'destructive',
        title: 'Nome do Personagem Inválido',
        description: 'O nome deve ter entre 3 e 100 caracteres.',
      });
      return;
    }

    if (visualPrompt.length > 7000) {
      toast({
        variant: 'destructive',
        title: 'Descrição Visual Muito Longa',
        description: 'A descrição visual personalizada não pode ter mais de 7000 caracteres.',
      });
      return;
    }
    
    setLoading(true);

    // Add language to personality
    const personalityWithLanguage = `${personality} | Audio Language: ${language}`;

    try {
      await onCreateCharacter({
        name,
        visual_prompt: visualPrompt,
        personality: personalityWithLanguage,
      });

      toast({
        title: "Personagem criado!",
        description: `${name} foi criado com sucesso e está pronto para gerar vídeos virais.`,
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar personagem",
        description: (error as any)?.message || "Tente novamente em alguns momentos.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Criar Novo Personagem
          </DialogTitle>
          <DialogDescription>
            Crie um personagem único para seus vídeos virais em 4 passos simples
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step > stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Name and Language */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Nome e Idioma</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Como seu personagem se chama?</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Robô Max, Luna Tech, Professor Silva..."
                    className="text-lg"
                    maxLength={100}
                  />
                  <p className="text-sm text-right text-muted-foreground">
                    {name.length} / 100
                  </p>
                </div>

                <div>
                  <Label htmlFor="language">Idioma do Áudio</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Apenas o áudio será no idioma selecionado. O restante do prompt será em inglês.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!name}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Visual */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Aparência Visual</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {VISUAL_PRESETS.map((preset) => (
                  <Card 
                    key={preset.id}
                    className={`cursor-pointer transition-all ${
                      selectedVisual === preset.id 
                        ? 'ring-2 ring-purple-600 bg-purple-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedVisual(preset.id);
                      setCustomVisual('');
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{preset.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {preset.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-visual">Ou descreva sua própria aparência:</Label>
                <Textarea
                  id="custom-visual"
                  value={customVisual}
                  onChange={(e) => {
                    setCustomVisual(e.target.value);
                    setSelectedVisual('');
                  }}
                  placeholder="Descreva detalhadamente como seu personagem deve parecer..."
                  rows={3}
                  maxLength={7000}
                />
                <p className="text-sm text-right text-muted-foreground">
                  {customVisual.length} / 7000
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!selectedVisual && !customVisual}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Personality */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Personalidade</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PERSONALITY_PRESETS.map((preset) => (
                  <Card 
                    key={preset.id}
                    className={`cursor-pointer transition-all ${
                      selectedPersonality === preset.id 
                        ? 'ring-2 ring-purple-600 bg-purple-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedPersonality(preset.id);
                      setCustomPersonality('');
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{preset.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {preset.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-personality">Ou defina uma personalidade customizada:</Label>
                <Textarea
                  id="custom-personality"
                  value={customPersonality}
                  onChange={(e) => {
                    setCustomPersonality(e.target.value);
                    setSelectedPersonality('');
                  }}
                  placeholder="Descreva a personalidade, jeito de falar e características do seu personagem..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!selectedPersonality && !customPersonality}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Revisar e Criar</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Resumo do Personagem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs font-semibold text-gray-500">Nome</Label>
                      <p className="font-medium">{name}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500">Idioma do Áudio</Label>
                      <p>{LANGUAGE_OPTIONS.find(l => l.value === language)?.label}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500">Tipo Visual</Label>
                      <p>{selectedVisual ? VISUAL_PRESETS.find(v => v.id === selectedVisual)?.name : 'Personalizado'}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500">Personalidade</Label>
                      <p>{selectedPersonality ? PERSONALITY_PRESETS.find(p => p.id === selectedPersonality)?.name : 'Personalizada'}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm">Otimização TikTok</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>✅ Personagem consistente em todos os blocos</p>
                      <p>✅ Áudio em {LANGUAGE_OPTIONS.find(l => l.value === language)?.label.split(' ')[1]}</p>
                      <p>✅ Integração automática TikTok Shop</p>
                      <p>✅ Hashtags otimizadas por país</p>
                      <p>✅ Trending topics em tempo real</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleCreate} 
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Criando..." : "Criar Personagem"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Modal de Upgrade */}
      {getUpgradeModalData() && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          {...getUpgradeModalData()!}
        />
      )}
    </Dialog>
  );
}
