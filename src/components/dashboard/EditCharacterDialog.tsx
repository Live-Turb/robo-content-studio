import { useState, useEffect } from 'react';
import { Character } from '@/types/database';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Save, X } from 'lucide-react';

interface EditCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: Character | null;
  onCharacterUpdated: () => void;
}

const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: '🇧🇷 Português (Brasil)' },
  { value: 'en-US', label: '🇺🇸 English (USA)' },
  { value: 'es-ES', label: '🇪🇸 Español (España)' },
  { value: 'es-MX', label: '🇲🇽 Español (México)' },
  { value: 'fr-FR', label: '🇫🇷 Français (France)' },
];

export function EditCharacterDialog({ open, onOpenChange, character, onCharacterUpdated }: EditCharacterDialogProps) {
  const [name, setName] = useState('');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [personality, setPersonality] = useState('');
  const [language, setLanguage] = useState('pt-BR');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (character) {
      setName(character.name);
      setVisualPrompt(character.visual_prompt);

      // Extract personality and language
      const personalityString = character.personality || '';
      const langMatch = personalityString.match(/\| Audio Language:\s*([a-zA-Z-]+)/);
      
      if (langMatch && langMatch[1]) {
        setLanguage(langMatch[1]);
        // Remove the language part from the personality string for editing
        setPersonality(personalityString.replace(langMatch[0], '').trim());
      } else {
        setPersonality(personalityString);
        setLanguage('pt-BR'); // Default language
      }
    }
  }, [character]);

  const handleSave = async () => {
    if (!character || !name || !visualPrompt || !personality) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
      });
      return;
    }

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
        description: 'A descrição visual não pode ter mais de 7000 caracteres.',
      });
      return;
    }

    setLoading(true);

    try {
      // Re-combine personality and language for storage
      const updatedPersonality = `${personality.trim()} | Audio Language: ${language}`;

      const { error } = await supabase
        .from('characters')
        .update({
          name,
          visual_prompt: visualPrompt,
          personality: updatedPersonality,
        })
        .eq('id', character.id);

      if (error) throw error;

      toast({
        title: "Personagem atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });

      onCharacterUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: (error as any)?.message || "Tente novamente em alguns momentos.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!character) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Editar Personagem - {character.name}
          </DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias no seu personagem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nome do Personagem</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do personagem"
              maxLength={100}
            />
            <p className="text-sm text-right text-muted-foreground mt-1">
              {name.length} / 100
            </p>
          </div>

          <div>
            <Label htmlFor="edit-language">Idioma do Áudio</Label>
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
          </div>

          <div>
            <Label htmlFor="edit-visual">Descrição Visual (em Inglês)</Label>
            <Textarea
              id="edit-visual"
              value={visualPrompt}
              onChange={(e) => setVisualPrompt(e.target.value)}
              placeholder="Descrição detalhada da aparência do personagem em inglês..."
              rows={4}
              maxLength={7000}
            />
            <p className="text-sm text-right text-muted-foreground mt-1">
              {visualPrompt.length} / 7000
            </p>
          </div>

          <div>
            <Label htmlFor="edit-personality">Personalidade</Label>
            <Textarea
              id="edit-personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Descreva a personalidade e características comportamentais..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
