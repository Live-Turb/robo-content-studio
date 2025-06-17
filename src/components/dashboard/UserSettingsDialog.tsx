
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Settings, Save, RotateCcw } from 'lucide-react';

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_PROMPTS = {
  character_base: `[CHARACTER_NAME], a [CHARACTER_DESCRIPTION] character with [VISUAL_DETAILS]. The character has [PERSONALITY_TRAITS] and speaks in [AUDIO_LANGUAGE]. Always maintain consistent visual appearance across all blocks.`,
  
  scene_base: `Scene takes place in [SETTING_DESCRIPTION] with [LIGHTING_CONDITIONS]. The environment should be vibrant, TikTok-friendly with [SPECIFIC_ELEMENTS] that enhance the viral potential.`,
  
  camera_base: `Camera: [SHOT_TYPE], [LENS_TYPE], [MOVEMENT_STYLE]. Focus on [FOCUS_POINTS] to create engaging visual storytelling.`,
  
  audio_base: `Audio in [AUDIO_LANGUAGE]: "[CHARACTER_SPEECH]" with [SOUND_EFFECTS] and [BACKGROUND_MUSIC]. Include clear call-to-action for TikTok Shop integration.`,
  
  tiktok_integration: `Highlight [PRODUCT_NAME] naturally in the scene. End with clear CTA: "Get yours on TikTok Shop! Link in bio! 🛒✨". Include trending hashtags for [COUNTRY_CODE].`
};

export function UserSettingsDialog({ open, onOpenChange }: UserSettingsDialogProps) {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && open) {
      loadUserPrompts();
    }
  }, [user, open]);

  const loadUserPrompts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .eq('user_id', user?.id)
        .eq('name', 'base_prompts')
        .single();

      if (data && !error) {
        const savedPrompts = data.variables as Record<string, any>;
        setPrompts({ ...DEFAULT_PROMPTS, ...savedPrompts });
      }
    } catch (error) {
      console.log('Usando prompts padrão');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('prompt_templates')
        .upsert({
          user_id: user?.id,
          name: 'base_prompts',
          template: 'Base prompts for video generation',
          variables: prompts,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas!",
        description: "Seus prompts base foram atualizados.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Tente novamente em alguns momentos.",
      });
    }
    setSaving(false);
  };

  const handleReset = () => {
    setPrompts(DEFAULT_PROMPTS);
    toast({
      title: "Prompts restaurados",
      description: "Os prompts foram restaurados para os valores padrão.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Configurações do Usuário
          </DialogTitle>
          <DialogDescription>
            Personalize os prompts base usados na geração de vídeos
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="prompts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="prompts">Prompts Base</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="prompts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prompt de Personagem</CardTitle>
                    <CardDescription>Base para descrição dos personagens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={prompts.character_base}
                      onChange={(e) => setPrompts({...prompts, character_base: e.target.value})}
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prompt de Cena</CardTitle>
                    <CardDescription>Base para descrição das cenas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={prompts.scene_base}
                      onChange={(e) => setPrompts({...prompts, scene_base: e.target.value})}
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prompt de Câmera</CardTitle>
                    <CardDescription>Base para configuração da câmera</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={prompts.camera_base}
                      onChange={(e) => setPrompts({...prompts, camera_base: e.target.value})}
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prompt de Áudio</CardTitle>
                    <CardDescription>Base para configuração do áudio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={prompts.audio_base}
                      onChange={(e) => setPrompts({...prompts, audio_base: e.target.value})}
                      rows={4}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tiktok" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Integração TikTok Shop</CardTitle>
                  <CardDescription>
                    Configurações para integração automática com TikTok Shop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={prompts.tiktok_integration}
                    onChange={(e) => setPrompts({...prompts, tiktok_integration: e.target.value})}
                    rows={6}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar Padrão
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
