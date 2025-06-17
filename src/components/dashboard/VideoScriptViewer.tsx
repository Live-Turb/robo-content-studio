
import { useState } from 'react';
import { Video, VideoBlock } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Eye, Share, Download, Play, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoScriptViewerProps {
  video: Video;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
}

export function VideoScriptViewer({ video, open, onOpenChange, onEdit, onDelete }: VideoScriptViewerProps) {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, blockNumber?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (blockNumber) {
        setCopiedBlock(blockNumber);
        setTimeout(() => setCopiedBlock(null), 2000);
      }
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência.",
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
      `Tipo: ${video.content_type} | País: ${video.country_code}`,
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

  const downloadScript = () => {
    const content = formatFullScript(video);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roteiro-${video.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{video.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {video.duration_seconds}s • {video.blocks.length} blocos • {video.content_type}
                {video.trending_topic && ` • ${video.trending_topic}`}
              </DialogDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                {video.status}
              </Badge>
              {video.total_views > 0 && (
                <Badge variant="outline">
                  {video.total_views.toLocaleString()} views
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => copyToClipboard(formatFullScript(video))}
              variant="outline"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Roteiro Completo
            </Button>
            
            <Button onClick={downloadScript} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download .txt
            </Button>
            
            {onEdit && (
              <Button onClick={() => onEdit(video)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            
            {onDelete && (
              <Button 
                onClick={() => onDelete(video.id)} 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
          </div>

          {/* Video Overview */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle>Visão Geral do Roteiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{video.blocks.length}</div>
                  <div className="text-sm text-gray-600">Blocos</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{video.duration_seconds}s</div>
                  <div className="text-sm text-gray-600">Duração</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {video.hashtags.tiktok.length + video.hashtags.instagram.length + video.hashtags.youtube.length}
                  </div>
                  <div className="text-sm text-gray-600">Hashtags</div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{video.total_views}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Script Blocks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Roteiro Detalhado</h3>
            {video.blocks.map((block) => (
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
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cena</div>
                    <p className="text-sm">{block.scene}</p>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Personagem</div>
                    <p className="text-sm text-purple-700 font-medium">{block.character}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Câmera</div>
                      <p className="text-sm">{block.camera}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cenário</div>
                      <p className="text-sm">{block.setting}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Iluminação</div>
                    <p className="text-sm">{block.lighting}</p>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Áudio/Fala</div>
                    <p className="text-sm font-medium text-blue-700 bg-blue-50 p-2 rounded">{block.audio}</p>
                  </div>
                  
                  {block.transition && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Transição</div>
                      <p className="text-sm text-green-700">{block.transition}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle>Hashtags Otimizadas por Plataforma</CardTitle>
              <CardDescription>
                Hashtags geradas especificamente para maximizar alcance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-red-600">TikTok ({video.hashtags.tiktok.length} tags)</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(video.hashtags.tiktok.join(' '))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {video.hashtags.tiktok.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-pink-600">Instagram ({video.hashtags.instagram.length} tags)</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(video.hashtags.instagram.join(' '))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {video.hashtags.instagram.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-600">YouTube ({video.hashtags.youtube.length} tags)</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(video.hashtags.youtube.join(' '))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {video.hashtags.youtube.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
