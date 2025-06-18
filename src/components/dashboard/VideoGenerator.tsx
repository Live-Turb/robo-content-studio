import { useState } from 'react';
import { Character, Video, VideoBlock } from '@/types/database';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/ui/upgrade-modal';
import { Sparkles, Video as VideoIcon, Clock, Globe, Zap, Copy, CheckCircle } from 'lucide-react';

interface VideoGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: Character | null;
  onVideoGenerated: () => void;
}

const DURATION_OPTIONS = [
  { value: 8, label: '8s - Ultra Rápido' },
  { value: 16, label: '16s - Rápido' },
  { value: 24, label: '24s - Padrão' },
  { value: 32, label: '32s - Médio' },
  { value: 40, label: '40s - Longo' },
  { value: 60, label: '1min - Máximo' },
];

const CONTENT_TYPES = [
  { 
    value: 'trending', 
    label: 'Trending Now', 
    description: 'IA busca tendências atuais',
    icon: '⚡',
    recommended: true
  },
  { 
    value: 'comedy', 
    label: 'Comédia', 
    description: 'Conteúdo engraçado e viral',
    icon: '😂'
  },
  { 
    value: 'horror', 
    label: 'Terror/Suspense', 
    description: 'Histórias assustadoras',
    icon: '😱'
  },
  { 
    value: 'custom', 
    label: 'Tema Personalizado', 
    description: 'Defina seu próprio tema',
    icon: '🎯'
  },
];

export function VideoGenerator({ open, onOpenChange, character, onVideoGenerated }: VideoGeneratorProps) {
  const [duration, setDuration] = useState<number>(24);
  const [contentType, setContentType] = useState<string>('trending');
  const [customTopic, setCustomTopic] = useState('');
  const [country, setCountry] = useState('BR');
  const [loading, setLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<Video | null>(null);
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();
  const { canCreatePrompt, incrementPromptUsage, getUpgradeModalData } = useSubscription();

  const generateVideo = async () => {
    if (!character) return;

    // Verificar se pode criar prompts
    if (!canCreatePrompt) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);

    try {
      // Extract language from character
      const audioLanguage = character.personality.match(/Audio Language:\s*([a-z-A-Z]+)/)?.[1] || 'pt-BR';
      const getLanguageName = (code: string) => {
        const names: Record<string, string> = {
          'pt-BR': 'Brazilian Portuguese',
          'en-US': 'English',
          'es-ES': 'Spanish',
          'es-MX': 'Mexican Spanish',
          'fr-FR': 'French'
        };
        return names[code] || 'Portuguese';
      };

      // Generate optimized blocks with new template
      const blockCount = Math.ceil(duration / 8);
      const blocks: VideoBlock[] = [];

      // Get trending topic or custom topic
      const topicContext = contentType === 'trending' 
        ? 'current viral TikTok trend with dancing and product showcase'
        : contentType === 'comedy'
        ? 'funny viral moment with product integration'
        : contentType === 'horror'
        ? 'suspenseful moment with unexpected product reveal'
        : customTopic;

      for (let i = 1; i <= blockCount; i++) {
        const blockDuration = i === blockCount ? duration - (i - 1) * 8 : 8;
        const timeRange = `${(i - 1) * 8}-${(i - 1) * 8 + blockDuration}s`;
        
        // Enhanced scene descriptions with TikTok optimization
        const sceneDescriptions = [
          `${character.name} is in a vibrant urban setting with neon-lit graffiti walls and puddles reflecting colorful lights. The character ${i === 1 ? 'confidently points at camera and starts a viral dance challenge' : i === 2 ? 'performs an exaggerated dance move that causes a comedic accident with their outfit' : 'strikes a dramatic pose while showcasing the featured product'}. The scene focuses on ${i === 1 ? 'establishing the character and trend' : i === 2 ? 'peak comedy and product visibility' : 'clear call-to-action and product highlight'}.`,
          
          `In a modern tech-savvy environment with holographic displays and cyberpunk aesthetics, ${character.name} ${i === 1 ? 'discovers a trending product and reacts with exaggerated surprise' : i === 2 ? 'tries to use the product in an unexpectedly funny way' : 'successfully uses the product and celebrates with a signature move'}. The lighting emphasizes ${i === 1 ? 'curiosity and discovery' : i === 2 ? 'comedy and mishaps' : 'success and satisfaction'}.`,
          
          `${character.name} is in a vibrant shopping district with TikTok Shop-style displays everywhere. The character ${i === 1 ? 'browses products while performing trending moves' : i === 2 ? 'accidentally creates a viral moment while testing a product' : 'confidently recommends the product with a direct sales pitch'}. The scene includes ${i === 1 ? 'multiple product options and decision-making' : i === 2 ? 'product demonstration gone funny' : 'clear product benefits and purchase incentive'}.`
        ];

        // Camera specifications for each block
        const cameraSpecs = [
          `${i === 1 ? 'Medium shot' : i === 2 ? 'Wide shot' : 'Close-up'}, 35mm lens, ${i % 2 === 0 ? 'handheld style for dynamic energy' : 'smooth tracking for professional look'}, focus on ${i === 1 ? 'character introduction and trend setup' : i === 2 ? 'action and product interaction' : 'product details and call-to-action'}`,
          
          `${i === 1 ? 'Dutch angle medium shot' : i === 2 ? 'Split screen showing character and product' : 'Extreme close-up on product'}, 24mm lens, ${i === 1 ? 'slow push-in for drama' : i === 2 ? 'quick cuts for comedy timing' : 'steady focus for clarity'}, emphasizing ${i === 1 ? 'character personality' : i === 2 ? 'product features' : 'purchase urgency'}`
        ];

        // Lighting specifications optimized for TikTok
        const lightingSpecs = [
          `${i === 1 ? 'Neon backlighting with purple and blue tones' : i === 2 ? 'Strobe effects synchronized with music' : 'Soft key lighting highlighting the product'}, ${i % 2 === 0 ? 'high contrast for drama' : 'warm tones for approachability'}, ensuring ${i === 1 ? 'mysterious and trendy atmosphere' : i === 2 ? 'energetic and fun vibe' : 'clear product visibility'}`,
          
          `${i === 1 ? 'Rim lighting creating character silhouette' : i === 2 ? 'Color-changing LED effects' : 'Product spotlight with background bokeh'}, cinematographic quality with ${i === 1 ? 'moody undertones' : i === 2 ? 'vibrant saturation' : 'commercial-grade clarity'}`
        ];

        // Audio with specified language and TikTok optimization
        const audioLines = [
          `Voice in ${getLanguageName(audioLanguage)}: "${character.name}: ${i === 1 ? 'Descobri a tendência viral do momento!' : i === 2 ? 'Olha só o que aconteceu quando tentei!' : 'Pega o seu no TikTok Shop! Link na bio! 🛒✨'}" with ${i === 1 ? 'trending Brazilian funk remix' : i === 2 ? 'comedic sound effects and music continuation' : 'upbeat conclusion with purchase incentive sounds'}`,
          
          `Audio in ${getLanguageName(audioLanguage)}: "${character.name}: ${i === 1 ? 'This trend is about to blow up!' : i === 2 ? 'Wait, this is not how it was supposed to work!' : 'Get yours now on TikTok Shop! Don\'t wait! 🔥'}" with ${i === 1 ? 'viral TikTok sound trending in ' + country : i === 2 ? 'glitch effects and unexpected sounds' : 'call-to-action music with urgency'}`
        ];

        // Transitions optimized for TikTok retention
        const transitions = [
          i < blockCount ? `${i === 1 ? 'Quick zoom with glitch effect' : 'Speed ramp to freeze frame'}` : 'Freeze on product with pulsing CTA text',
          i < blockCount ? `${i === 1 ? 'Swipe transition with trend hashtag overlay' : 'Jump cut with sound sync'}` : 'End screen with TikTok Shop button animation'
        ];

        blocks.push({
          number: i,
          duration: timeRange,
          scene: sceneDescriptions[Math.min(i - 1, 2)],
          character: `${character.visual_prompt}. IMPORTANT: Maintain exact same visual specifications across all blocks for consistency. The character should be immediately recognizable in every frame.`,
          camera: cameraSpecs[Math.min(Math.floor(Math.random() * 2), 1)],
          setting: `Vibrant, TikTok-optimized environment with excellent lighting for mobile viewing. Setting should enhance the product and maintain visual interest throughout the ${blockDuration}-second block.`,
          lighting: lightingSpecs[Math.min(Math.floor(Math.random() * 2), 1)],
          audio: audioLines[audioLanguage === 'pt-BR' ? 0 : 1],
          transition: i < blockCount ? transitions[Math.min(Math.floor(Math.random() * 2), 1)] : transitions[2]
        });
      }

      // Enhanced hashtags with country and trend optimization
      const getOptimizedHashtags = (contentType: string, country: string, audioLanguage: string) => {
        const baseHashtags = {
          tiktok: ['#FYP', '#ForYou', '#Viral', '#TikTokShop'],
          instagram: ['#Reels', '#Viral', '#InstagramReels', '#ViralReels', '#ContentCreator', '#TikTokShop'],
          youtube: ['#Shorts', '#ViralContent', '#TikTokShop']
        };

        // Add country-specific hashtags
        if (country === 'BR') {
          baseHashtags.tiktok.push('#Brasil', '#TikTokBrasil', '#ViralBR');
          baseHashtags.instagram.push('#Brasil', '#ReelsBrasil', '#BrasilTrending');
          baseHashtags.youtube.push('#Brasil', '#BrazilShorts');
        }

        // Add content-type specific hashtags
        if (contentType === 'trending') {
          baseHashtags.tiktok.push('#Trending', '#TrendingNow', '#ViralTrend');
          baseHashtags.instagram.push('#Trending', '#TrendingReels', '#ViralTrend');
          baseHashtags.youtube.push('#Trending', '#TrendingShorts');
        } else if (contentType === 'comedy') {
          baseHashtags.tiktok.push('#Comedy', '#Funny', '#LOL', '#Humor');
          baseHashtags.instagram.push('#Comedy', '#Funny', '#InstaComedy', '#Humor');
          baseHashtags.youtube.push('#Comedy', '#Funny', '#FunnyShorts');
        } else if (contentType === 'horror') {
          baseHashtags.tiktok.push('#Horror', '#Scary', '#Suspense', '#Terror');
          baseHashtags.instagram.push('#Horror', '#Scary', '#HorrorReels', '#Suspense');
          baseHashtags.youtube.push('#Horror', '#Scary', '#HorrorShorts');
        }

        // Add character-specific hashtags
        baseHashtags.tiktok.push(`#${character.name.replace(/\s+/g, '')}`);
        baseHashtags.instagram.push(`#${character.name.replace(/\s+/g, '')}`, '#AIContent', '#DigitalCreator');
        baseHashtags.youtube.push(`#${character.name.replace(/\s+/g, '')}`, '#AIContent');

        return baseHashtags;
      };

      const hashtags = getOptimizedHashtags(contentType, country, audioLanguage);

      // Enhanced title generation
      const titleTemplates = {
        trending: `${character.name} e a Tendência Viral que Está Bombando 🔥`,
        comedy: `${character.name}: Comédia Viral que Vai Te Fazer Rir 😂`,
        horror: `${character.name}: História de Arrepiar que Viralizou 😱`,
        custom: `${character.name}: ${customTopic} 🎯`
      };

      const title = titleTemplates[contentType as keyof typeof titleTemplates] || titleTemplates.custom;

      // Convert blocks and hashtags to Json for Supabase
      const blocksAsJson = JSON.parse(JSON.stringify(blocks));
      const hashtagsAsJson = JSON.parse(JSON.stringify(hashtags));

      // Save to database
      const { data: video, error } = await supabase
        .from('videos')
        .insert({
          character_id: character.id,
          title,
          duration_seconds: duration,
          blocks: blocksAsJson,
          hashtags: hashtagsAsJson,
          country_code: country,
          content_type: contentType as 'trending' | 'horror' | 'comedy' | 'custom',
          trending_topic: contentType === 'custom' ? customTopic : null,
        })
        .select()
        .single();

      if (error) throw error;

      if (video) {
        // Convert back to our Video type
        const typedVideo: Video = {
          ...video,
          duration_seconds: video.duration_seconds as number,
          content_type: video.content_type as 'trending' | 'horror' | 'comedy' | 'custom',
          status: video.status as 'draft' | 'published' | 'archived',
          blocks: blocks,
          hashtags: hashtags
        };
        
        setGeneratedVideo(typedVideo);
        
        // Incrementar uso de prompt
        incrementPromptUsage();
        
        onVideoGenerated();

        toast({
          title: "Roteiro viral gerado!",
          description: `Seu vídeo de ${duration}s está pronto para viralizar.`,
        });
      }

    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar vídeo",
        description: "Tente novamente em alguns momentos.",
      });
    }

    setLoading(false);
  };

  const copyToClipboard = async (text: string, blockNumber?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (blockNumber) {
        setCopiedBlock(blockNumber);
        setTimeout(() => setCopiedBlock(null), 2000);
      }
      toast({
        title: "Copiado!",
        description: "Prompt copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
      });
    }
  };

  const formatFullScript = (video: Video) => {
    const script = [
      `=== ROTEIRO VIRAL: "${video.title}" ===`,
      `Duração Total: ${video.duration_seconds} segundos (${video.blocks.length} blocos)`,
      '',
    ];

    video.blocks.forEach((block) => {
      script.push(`BLOCO ${block.number} (${block.duration})`);
      script.push(`Scene: ${block.scene}`);
      script.push(`Character: ${block.character}`);
      script.push(`Camera: ${block.camera}`);
      script.push(`Setting: ${block.setting}`);
      script.push(`Lighting: ${block.lighting}`);
      script.push(`Audio: ${block.audio}`);
      if (block.transition) script.push(`Transition: ${block.transition}`);
      script.push('');
    });

    script.push('=== HASHTAGS OTIMIZADAS ===');
    script.push('');
    script.push(`TikTok: ${video.hashtags.tiktok.join(' ')}`);
    script.push(`Instagram: ${video.hashtags.instagram.join(' ')}`);
    script.push(`YouTube: ${video.hashtags.youtube.join(' ')}`);

    return script.join('\n');
  };

  const resetForm = () => {
    setDuration(24);
    setContentType('trending');
    setCustomTopic('');
    setGeneratedVideo(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  if (!character) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Gerar Vídeo Viral - {character.name}
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros para gerar um roteiro otimizado para viralização
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedVideo ? (
            // Generation Form
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Configuration */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Duração do Vídeo</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {DURATION_OPTIONS.map((option) => (
                        <Button
                          key={option.value}
                          variant={duration === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDuration(option.value)}
                          className={duration === option.value ? "bg-purple-600" : ""}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <VideoIcon className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg">Tipo de Conteúdo</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {CONTENT_TYPES.map((type) => (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all ${
                          contentType === type.value
                            ? 'ring-2 ring-purple-600 bg-purple-50'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setContentType(type.value)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{type.icon}</span>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {type.label}
                                  {type.recommended && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      Recomendado
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">{type.description}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {contentType === 'custom' && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-topic">Tema Personalizado</Label>
                        <Input
                          id="custom-topic"
                          value={customTopic}
                          onChange={(e) => setCustomTopic(e.target.value)}
                          placeholder="Ex: Robôs aprendendo a dançar, Futuro da IA..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-lg">País/Regional</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BR">🇧🇷 Brasil</SelectItem>
                        <SelectItem value="US">🇺🇸 Estados Unidos</SelectItem>
                        <SelectItem value="ES">🇪🇸 Espanha</SelectItem>
                        <SelectItem value="MX">🇲🇽 México</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Preview do Vídeo
                    </CardTitle>
                    <CardDescription>
                      Como seu vídeo será estruturado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-700">{character.name[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium">{character.name}</div>
                          <div className="text-sm text-gray-600">Protagonista</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Estrutura:</div>
                        {Array.from({ length: Math.ceil(duration / 8) }, (_, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-white rounded">
                            <div className="w-6 h-6 bg-blue-100 rounded text-xs flex items-center justify-center text-blue-700 font-bold">
                              {i + 1}
                            </div>
                            <div className="text-sm">
                              Bloco {i + 1} ({i * 8}-{Math.min((i + 1) * 8, duration)}s)
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800 mb-1">💡 Dica Pro:</div>
                        <div className="text-sm text-yellow-700">
                          Vídeos de {duration}s têm {duration <= 24 ? 'alta' : duration <= 40 ? 'boa' : 'média'} taxa de retenção
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={generateVideo}
                  disabled={loading || (contentType === 'custom' && !customTopic)}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Gerando Roteiro Viral...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Gerar Roteiro Viral
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Generated Video Display
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Roteiro Viral Gerado!
                </h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(formatFullScript(generatedVideo))}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Tudo
                  </Button>
                  <Button onClick={() => setGeneratedVideo(null)}>
                    Gerar Novo
                  </Button>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-xl">{generatedVideo.title}</CardTitle>
                  <CardDescription>
                    {generatedVideo.duration_seconds}s • {generatedVideo.blocks.length} blocos • {generatedVideo.content_type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{generatedVideo.blocks.length}</div>
                      <div className="text-sm text-gray-600">Blocos</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{generatedVideo.duration_seconds}s</div>
                      <div className="text-sm text-gray-600">Duração</div>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {generatedVideo.hashtags.tiktok.length + generatedVideo.hashtags.instagram.length + generatedVideo.hashtags.youtube.length}
                      </div>
                      <div className="text-sm text-gray-600">Hashtags</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Blocks */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Roteiro Detalhado:</h4>
                {generatedVideo.blocks.map((block) => (
                  <Card key={block.number} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Bloco {block.number} ({block.duration})
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(
                            `BLOCO ${block.number} (${block.duration})\nScene: ${block.scene}\nCharacter: ${block.character}\nCamera: ${block.camera}\nSetting: ${block.setting}\nLighting: ${block.lighting}\nAudio: ${block.audio}${block.transition ? `\nTransition: ${block.transition}` : ''}`,
                            block.number
                          )}
                        >
                          {copiedBlock === block.number ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cena</Label>
                        <p className="text-sm mt-1">{block.scene}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Personagem</Label>
                        <p className="text-sm mt-1">{block.character}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Câmera</Label>
                          <p className="text-sm mt-1">{block.camera}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cenário</Label>
                          <p className="text-sm mt-1">{block.setting}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Iluminação</Label>
                        <p className="text-sm mt-1">{block.lighting}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Áudio/Fala</Label>
                        <p className="text-sm mt-1 font-medium text-blue-700">{block.audio}</p>
                      </div>
                      {block.transition && (
                        <div>
                          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Transição</Label>
                          <p className="text-sm mt-1">{block.transition}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle>Hashtags Otimizadas</CardTitle>
                  <CardDescription>
                    Hashtags geradas especificamente para maximizar o alcance em cada plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold text-red-600 mb-2 block">TikTok ({generatedVideo.hashtags.tiktok.length} tags)</Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedVideo.hashtags.tiktok.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => copyToClipboard(generatedVideo.hashtags.tiktok.join(' '))}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar TikTok
                    </Button>
                  </div>

                  <div>
                    <Label className="font-semibold text-pink-600 mb-2 block">Instagram ({generatedVideo.hashtags.instagram.length} tags)</Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedVideo.hashtags.instagram.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => copyToClipboard(generatedVideo.hashtags.instagram.join(' '))}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar Instagram
                    </Button>
                  </div>

                  <div>
                    <Label className="font-semibold text-blue-600 mb-2 block">YouTube ({generatedVideo.hashtags.youtube.length} tags)</Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedVideo.hashtags.youtube.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => copyToClipboard(generatedVideo.hashtags.youtube.join(' '))}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar YouTube
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
