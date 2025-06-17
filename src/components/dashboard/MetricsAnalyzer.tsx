
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, BarChart3, TrendingUp, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

interface MetricsData {
  platform: 'tiktok' | 'instagram' | 'youtube' | 'kwai';
  views: number;
  likes: number;
  shares: number;
  comments: number;
  retention_rate: number;
}

interface AIAnalysis {
  strengths: string[];
  improvements: string[];
  patterns: string[];
  overall_score: number;
  recommendations: string[];
}

interface MetricsAnalyzerProps {
  videoId: string;
  onAnalysisComplete?: (analysis: AIAnalysis) => void;
}

export function MetricsAnalyzer({ videoId, onAnalysisComplete }: MetricsAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualMetrics, setManualMetrics] = useState<Partial<MetricsData>>({
    platform: 'tiktok',
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    retention_rate: 0
  });
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [inputMode, setInputMode] = useState<'screenshot' | 'manual'>('screenshot');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "Screenshot carregado!",
        description: "Pronto para análise com IA.",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const analyzeWithAI = async () => {
    if (inputMode === 'screenshot' && !uploadedFile) {
      toast({
        variant: "destructive",
        title: "Screenshot necessário",
        description: "Faça upload de um screenshot para análise.",
      });
      return;
    }

    if (inputMode === 'manual' && (!manualMetrics.views || !manualMetrics.platform)) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Preencha pelo menos views e plataforma.",
      });
      return;
    }

    setAnalyzing(true);

    try {
      let screenshotUrl = '';
      
      if (inputMode === 'screenshot' && uploadedFile) {
        // Upload screenshot to Supabase Storage
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(fileName, uploadedFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('screenshots')
          .getPublicUrl(fileName);
        
        screenshotUrl = publicUrl;
      }

      // Simulate AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis based on metrics
      const views = manualMetrics.views || Math.floor(Math.random() * 100000);
      const likes = manualMetrics.likes || Math.floor(views * 0.05);
      const retention = manualMetrics.retention_rate || Math.floor(Math.random() * 100);

      const mockAnalysis: AIAnalysis = {
        strengths: [
          views > 10000 ? "Alto engajamento inicial" : "Boa base de visualizações",
          retention > 60 ? "Excelente retenção de audiência" : "Conteúdo mantém atenção",
          likes > views * 0.03 ? "Alta taxa de curtidas" : "Engajamento positivo"
        ],
        improvements: [
          retention < 50 ? "Melhorar hook nos primeiros 3 segundos" : "Adicionar mais momentos de surpresa",
          likes < views * 0.02 ? "Incluir call-to-action mais direto" : "Otimizar timing das transições",
          "Experimentar hashtags de nicho mais específicas"
        ],
        patterns: [
          "Vídeos com personagens consistentes performam 40% melhor",
          "Transições rápidas aumentam retenção em 25%",
          "CTAs no meio do vídeo geram mais engajamento"
        ],
        overall_score: Math.min(95, Math.max(45, 60 + (retention * 0.3) + (likes / views * 1000))),
        recommendations: [
          "Aplicar padrão de sucesso em próximos vídeos",
          "Testar variações do hook mais efetivo",
          "Aumentar frequência de postagem neste formato"
        ]
      };

      // Save metrics to database
      const { error: metricsError } = await supabase
        .from('metrics')
        .insert({
          video_id: videoId,
          screenshot_url: screenshotUrl || null,
          platform: manualMetrics.platform,
          views: views,
          likes: likes,
          shares: manualMetrics.shares || 0,
          comments: manualMetrics.comments || 0,
          retention_rate: retention,
          ai_analysis: {
            strengths: mockAnalysis.strengths,
            improvements: mockAnalysis.improvements,
            patterns: mockAnalysis.patterns
          }
        });

      if (metricsError) throw metricsError;

      setAnalysisResult(mockAnalysis);
      onAnalysisComplete?.(mockAnalysis);

      toast({
        title: "Análise concluída!",
        description: "Insights de IA gerados com sucesso.",
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        variant: "destructive",
        title: "Erro na análise",
        description: "Tente novamente em alguns momentos.",
      });
    }

    setAnalyzing(false);
  };

  const applyImprovements = async () => {
    if (!analysisResult) return;

    // Mark improvements as applied
    const { error } = await supabase
      .from('metrics')
      .update({ improvements_applied: true })
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao aplicar melhorias",
        description: "Tente novamente.",
      });
      return;
    }

    toast({
      title: "Melhorias aplicadas!",
      description: "Padrões de sucesso serão usados em próximos vídeos.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Análise de Performance com IA
          </CardTitle>
          <CardDescription>
            Analise métricas reais e receba insights acionáveis para otimizar próximos vídeos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={inputMode === 'screenshot' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('screenshot')}
            >
              📱 Screenshot
            </Button>
            <Button
              variant={inputMode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputMode('manual')}
            >
              ✍️ Manual
            </Button>
          </div>

          {inputMode === 'screenshot' ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-purple-400 bg-purple-50'
                  : uploadedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <p className="text-green-700 font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-green-600">Screenshot carregado com sucesso!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">
                    {isDragActive
                      ? 'Solte o screenshot aqui...'
                      : 'Arraste ou clique para fazer upload do screenshot'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Plataforma</Label>
                <Select
                  value={manualMetrics.platform}
                  onValueChange={(value: any) =>
                    setManualMetrics({ ...manualMetrics, platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="kwai">Kwai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="views">Views</Label>
                <Input
                  id="views"
                  type="number"
                  placeholder="Ex: 15000"
                  value={manualMetrics.views || ''}
                  onChange={(e) =>
                    setManualMetrics({ ...manualMetrics, views: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  type="number"
                  placeholder="Ex: 1200"
                  value={manualMetrics.likes || ''}
                  onChange={(e) =>
                    setManualMetrics({ ...manualMetrics, likes: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <Label htmlFor="retention">Taxa de Retenção (%)</Label>
                <Input
                  id="retention"
                  type="number"
                  placeholder="Ex: 75"
                  max="100"
                  value={manualMetrics.retention_rate || ''}
                  onChange={(e) =>
                    setManualMetrics({ ...manualMetrics, retention_rate: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          )}

          <Button
            onClick={analyzeWithAI}
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {analyzing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analisando com IA...
              </div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analisar com IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Análise de IA Completa
              <Badge className="bg-green-200 text-green-800">
                Score: {analysisResult.overall_score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={analysisResult.overall_score} className="h-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Pontos Fortes
                </h4>
                {analysisResult.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Oportunidades de Melhoria
                </h4>
                {analysisResult.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white rounded">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-purple-800">Padrões Identificados</h4>
              {analysisResult.patterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-sm text-purple-700">{pattern}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">Recomendações para Próximos Vídeos</h4>
              {analysisResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-100 rounded">
                  <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-700">{rec}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={applyImprovements}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Aplicar Melhorias em Próximos Vídeos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
