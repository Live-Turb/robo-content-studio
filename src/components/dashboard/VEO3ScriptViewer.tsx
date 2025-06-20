import { useState } from 'react';
import { Video } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Zap, Camera, Mic, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VEO3ScriptViewerProps {
  video: Video;
}

export function VEO3ScriptViewer({ video }: VEO3ScriptViewerProps) {
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
        description: "Prompt VEO3 copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
      });
    }
  };

  const extractVEO3Prompt = (scene: string) => {
    if (scene.startsWith('VEO3 PROMPT: ')) {
      return scene.replace('VEO3 PROMPT: ', '');
    }
    return scene;
  };

  const extractViralElements = (setting: string) => {
    if (setting.startsWith('VIRAL ELEMENTS: ')) {
      return setting.replace('VIRAL ELEMENTS: ', '').split(', ');
    }
    return [];
  };

  const downloadVEO3Script = () => {
    const script = [
      `=== VEO3 OPTIMIZED SCRIPT: "${video.title}" ===`,
      `Total Duration: ${video.duration_seconds} seconds (${video.blocks.length} blocks)`,
      `Content Type: ${video.content_type} | Country: ${video.country_code}`,
      `Trending Topic: ${video.trending_topic || 'N/A'}`,
      '',
      '=== VEO3 PROMPTS (Ready to use) ===',
      ''
    ];

    video.blocks.forEach((block) => {
      const veo3Prompt = extractVEO3Prompt(block.scene);
      const viralElements = extractViralElements(block.setting);
      
      script.push(`BLOCK ${block.number} (${block.duration})`);
      script.push('');
      script.push('🎬 VEO3 PROMPT:');
      script.push(veo3Prompt);
      script.push('');
      script.push('🎭 CHARACTER CONSISTENCY:');
      script.push(block.character);
      script.push('');
      script.push('📹 CAMERA WORK:');
      script.push(block.camera);
      script.push('');
      script.push('🎵 AUDIO DESCRIPTION:');
      script.push(block.audio);
      script.push('');
      if (viralElements.length > 0) {
        script.push('🔥 VIRAL ELEMENTS:');
        viralElements.forEach(element => script.push(`- ${element}`));
        script.push('');
      }
      script.push('---');
      script.push('');
    });

    script.push('=== HASHTAGS FOR EACH PLATFORM ===');
    script.push('');
    script.push(`TikTok: ${video.hashtags.tiktok.join(' ')}`);
    script.push(`Instagram: ${video.hashtags.instagram.join(' ')}`);
    script.push(`YouTube: ${video.hashtags.youtube.join(' ')}`);

    const content = script.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veo3-script-${video.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">VEO3 Optimized Script</h2>
          <Badge className="bg-purple-100 text-purple-800">Ready for VEO3</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={downloadVEO3Script} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download VEO3 Script
          </Button>
        </div>
      </div>

      {/* Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Script Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{video.blocks.length}</div>
              <div className="text-sm text-gray-600">VEO3 Blocks</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{video.duration_seconds}s</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">English</div>
              <div className="text-sm text-gray-600">Language</div>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">POV</div>
              <div className="text-sm text-gray-600">Viral Strategy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VEO3 Blocks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5" />
          VEO3 Prompts (8 seconds each)
        </h3>
        
        {video.blocks.map((block) => {
          const veo3Prompt = extractVEO3Prompt(block.scene);
          const viralElements = extractViralElements(block.setting);
          
          return (
            <Card key={block.number} className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-bold">
                      Block {block.number}
                    </span>
                    <span className="text-sm text-gray-600">({block.duration})</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(veo3Prompt, block.number)}
                    className="flex items-center gap-1"
                  >
                    {copiedBlock === block.number ? (
                      <span className="text-green-600 text-xs">✓ Copied</span>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-xs">Copy VEO3 Prompt</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* VEO3 Prompt - Main Content */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">VEO3 PROMPT</span>
                    <Badge variant="outline" className="text-xs">Ready to paste</Badge>
                  </div>
                  <p className="text-sm font-mono bg-white p-3 rounded border leading-relaxed">
                    {veo3Prompt}
                  </p>
                </div>

                {/* Audio Description */}
                <div className="bg-green-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-800">AUDIO DESCRIPTION</span>
                  </div>
                  <p className="text-sm text-green-700">{block.audio}</p>
                </div>

                {/* Viral Elements */}
                {viralElements.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">VIRAL ELEMENTS</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {viralElements.map((element, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-gray-700 mb-1">Character Consistency</div>
                    <p className="text-gray-600">{block.character}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-gray-700 mb-1">Camera Work</div>
                    <p className="text-gray-600">{block.camera}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle>Platform-Optimized Hashtags</CardTitle>
          <CardDescription>
            Copy and paste these hashtags for maximum reach on each platform
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
                Copy
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
                Copy
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
                Copy
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
  );
} 