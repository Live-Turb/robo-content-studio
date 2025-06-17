
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, Star, Trash2, Edit, Copy } from 'lucide-react';

interface PromptTemplate {
  id: string;
  user_id: string;
  name: string;
  template: string;
  variables: Record<string, any>;
  is_active: boolean;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

interface TemplateManagerProps {
  onTemplateSelect?: (template: PromptTemplate) => void;
}

export function TemplateManager({ onTemplateSelect }: TemplateManagerProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    template: '',
    variables: {} as Record<string, any>
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_active', true)
      .order('success_rate', { ascending: false });

    if (!error && data) {
      // Safely convert Supabase data to our PromptTemplate type
      const typedTemplates = data.map(template => ({
        ...template,
        variables: template.variables && typeof template.variables === 'object' && !Array.isArray(template.variables)
          ? template.variables as Record<string, any>
          : {}
      }));
      setTemplates(typedTemplates);
    }
    setLoading(false);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.template) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Nome e template são obrigatórios.",
      });
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('prompt_templates')
          .update({
            name: formData.name,
            template: formData.template,
            variables: formData.variables,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;

        toast({
          title: "Template atualizado!",
          description: "Suas alterações foram salvas.",
        });
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('prompt_templates')
          .insert({
            user_id: user?.id,
            name: formData.name,
            template: formData.template,
            variables: formData.variables
          })
          .select()
          .single();

        if (error) throw error;

        const newTemplate = {
          ...data,
          variables: data.variables && typeof data.variables === 'object' && !Array.isArray(data.variables)
            ? data.variables as Record<string, any>
            : {}
        };

        setTemplates([newTemplate, ...templates]);

        toast({
          title: "Template criado!",
          description: "Novo template salvo com sucesso.",
        });
      }

      setShowCreateDialog(false);
      setEditingTemplate(null);
      setFormData({ name: '', template: '', variables: {} });
      fetchTemplates();

    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar template",
        description: "Tente novamente em alguns momentos.",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const { error } = await supabase
      .from('prompt_templates')
      .update({ is_active: false })
      .eq('id', templateId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir template",
        description: "Tente novamente.",
      });
      return;
    }

    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template excluído",
      description: "Template removido com sucesso.",
    });
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      template: template.template,
      variables: template.variables
    });
    setShowCreateDialog(true);
  };

  const duplicateTemplate = async (template: PromptTemplate) => {
    const { data, error } = await supabase
      .from('prompt_templates')
      .insert({
        user_id: user?.id,
        name: `${template.name} (Cópia)`,
        template: template.template,
        variables: template.variables
      })
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao duplicar template",
        description: "Tente novamente.",
      });
      return;
    }

    const newTemplate = {
      ...data,
      variables: data.variables && typeof data.variables === 'object' && !Array.isArray(data.variables)
        ? data.variables as Record<string, any>
        : {}
    };

    setTemplates([newTemplate, ...templates]);
    toast({
      title: "Template duplicado!",
      description: "Nova cópia criada com sucesso.",
    });
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates de Prompt</h2>
          <p className="text-gray-600">Gerencie seus templates personalizados para geração de roteiros</p>
        </div>
        
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <FileText className="h-16 w-16 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600">Nenhum template ainda</h3>
            <p className="text-gray-500 max-w-md">
              Crie templates personalizados para acelerar a geração de roteiros.
              Templates bem-sucedidos são reutilizados automaticamente.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Criado em {new Date(template.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  
                  <Badge className={getSuccessRateColor(template.success_rate)}>
                    <Star className="h-3 w-3 mr-1" />
                    {template.success_rate}%
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-500 uppercase">Template</Label>
                  <p className="text-sm mt-1 line-clamp-3 text-gray-700">
                    {template.template}
                  </p>
                </div>

                {Object.keys(template.variables).length > 0 && (
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Variáveis</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.keys(template.variables).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {onTemplateSelect && (
                    <Button 
                      size="sm" 
                      onClick={() => onTemplateSelect(template)}
                      className="flex-1"
                    >
                      Usar Template
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => duplicateTemplate(template)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        setShowCreateDialog(open);
        if (!open) {
          setEditingTemplate(null);
          setFormData({ name: '', template: '', variables: {} });
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
            </DialogTitle>
            <DialogDescription>
              Templates permitem reutilizar prompts eficazes para geração de roteiros
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Comédia Robótica, Horror Futurista..."
              />
            </div>

            <div>
              <Label htmlFor="template-content">Conteúdo do Template</Label>
              <Textarea
                id="template-content"
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                placeholder="Escreva seu template usando variáveis como {{character}}, {{topic}}, {{duration}}..."
                rows={8}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">💡 Dicas para Templates Eficazes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use variáveis como `character`, `topic`, `duration`</li>
                <li>• Inclua instruções específicas de câmera e iluminação</li>
                <li>• Defina transições entre blocos</li>
                <li>• Especifique tom e estilo da narrativa</li>
              </ul>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveTemplate}>
                {editingTemplate ? 'Atualizar' : 'Criar'} Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
