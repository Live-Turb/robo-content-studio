import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Character, Video, VideoBlock } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Video as VideoIcon, TrendingUp, Sparkles, User, LogOut, BarChart3, FileText, Eye, Calendar } from 'lucide-react';
import { CharacterCard } from './CharacterCard';
import { CreateCharacterDialog } from './CreateCharacterDialog';
import { VideoGenerator } from './VideoGenerator';
import { VideoScriptViewer } from './VideoScriptViewer';
import { MetricsAnalyzer } from './MetricsAnalyzer';
import { TemplateManager } from './TemplateManager';
import { EditCharacterDialog } from './EditCharacterDialog';
import { UserSettingsDialog } from './UserSettingsDialog';
import { toast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [showMetricsAnalyzer, setShowMetricsAnalyzer] = useState(false);
  const [selectedVideoForMetrics, setSelectedVideoForMetrics] = useState<string | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('characters');

  useEffect(() => {
    if (user) {
      fetchCharacters();
      fetchVideos();
    }
  }, [user]);

  const fetchCharacters = async () => {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCharacters(data as Character[]);
    }
    setLoading(false);
  };

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        characters (name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Safely convert Supabase data to our Video type
      const typedVideos = data.map(video => {
        // Safely parse blocks
        let blocks: VideoBlock[] = [];
        if (Array.isArray(video.blocks)) {
          blocks = video.blocks.map((block: any) => {
            if (typeof block === 'object' && block.number && block.duration) {
              return {
                number: block.number,
                duration: block.duration,
                scene: block.scene || '',
                character: block.character || '',
                camera: block.camera || '',
                setting: block.setting || '',
                lighting: block.lighting || '',
                audio: block.audio || '',
                transition: block.transition
              } as VideoBlock;
            }
            return {
              number: 1,
              duration: '0s',
              scene: '',
              character: '',
              camera: '',
              setting: '',
              lighting: '',
              audio: ''
            } as VideoBlock;
          });
        }

        // Safely parse hashtags
        let hashtags = { tiktok: [], instagram: [], youtube: [] };
        if (video.hashtags && typeof video.hashtags === 'object' && !Array.isArray(video.hashtags)) {
          const hashtagsObj = video.hashtags as any;
          hashtags = {
            tiktok: Array.isArray(hashtagsObj.tiktok) ? hashtagsObj.tiktok : [],
            instagram: Array.isArray(hashtagsObj.instagram) ? hashtagsObj.instagram : [],
            youtube: Array.isArray(hashtagsObj.youtube) ? hashtagsObj.youtube : []
          };
        }

        return {
          ...video,
          duration_seconds: video.duration_seconds as number,
          content_type: video.content_type as 'trending' | 'horror' | 'comedy' | 'custom',
          status: video.status as 'draft' | 'published' | 'archived',
          blocks,
          hashtags
        };
      });
      
      setVideos(typedVideos as Video[]);
    }
  };

  const handleCreateCharacter = async (characterData: Partial<Character>) => {
    if (!characterData.name || !characterData.personality || !characterData.visual_prompt) {
      return;
    }

    const { data, error } = await supabase
      .from('characters')
      .insert([{
        name: characterData.name,
        personality: characterData.personality,
        visual_prompt: characterData.visual_prompt,
        avatar_url: characterData.avatar_url,
        user_id: user?.id
      }])
      .select()
      .single();

    if (!error && data) {
      setCharacters([data as Character, ...characters]);
      setShowCreateCharacter(false);
    }
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
  };

  const handleCharacterUpdated = () => {
    fetchCharacters();
    setEditingCharacter(null);
  };

  const handleGenerateVideo = (character: Character) => {
    setSelectedCharacter(character);
    setShowVideoGenerator(true);
  };

  const handleViewVideo = (video: Video) => {
    setSelectedVideo(video);
    setShowVideoViewer(true);
  };

  const handleAnalyzeMetrics = (videoId: string) => {
    setSelectedVideoForMetrics(videoId);
    setShowMetricsAnalyzer(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (!error) {
      setVideos(videos.filter(v => v.id !== videoId));
      setShowVideoViewer(false);
    }
  };

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

    if (diffInDays === 0) {
      if (diffInHours === 0) {
        if (diffInMinutes === 0) {
          return 'Agora mesmo';
        }
        return `Há ${diffInMinutes} min`;
      }
      return `Há ${diffInHours}h`;
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `Há ${diffInDays} dias`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const totalViews = videos.reduce((sum, video) => sum + video.total_views, 0);
  const canCreateMore = userProfile?.plan === 'free' ? characters.length < 3 : characters.length < 10;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/viral-prompt-logo.png" 
                alt="Viral Prompt" 
                className="h-11 w-auto"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Plano: <span className="font-semibold text-purple-600">
                  {userProfile?.plan === 'free' ? 'Gratuito' : 'Ilimitado'}
                </span>
              </div>
              
              {userProfile?.plan === 'free' && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={async () => {
                    // Usar a versão personalizada da URL se disponível
                    const baseUrl = 'https://pay.cakto.com.br/3enayhi_440790';
                    const params = new URLSearchParams({
                      email: user?.email || '',
                      user_id: user?.id || '',
                      return_url: `${window.location.origin}/dashboard?payment_success=true`
                    });
                    window.open(`${baseUrl}?${params.toString()}`, '_blank');
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Upgrade
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserSettings(true)}
                  className="p-2"
                >
                  <User className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personagens</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{characters.length}</div>
              <p className="text-xs text-muted-foreground">
                {userProfile?.plan === 'free' ? `${3 - characters.length} restantes` : 'Ilimitados'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vídeos Gerados</CardTitle>
              <VideoIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videos.length}</div>
              <p className="text-xs text-muted-foreground">
                {userProfile?.daily_generations || 0} hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Através dos seus vídeos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                Vídeos com +1k views
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="characters" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personagens
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <VideoIcon className="h-4 w-4" />
              Roteiros
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Seus Personagens</h2>
              
              {canCreateMore ? (
                <Button onClick={() => setShowCreateCharacter(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Personagem
                </Button>
              ) : (
                <Button 
                  onClick={async () => {
                    const baseUrl = 'https://pay.cakto.com.br/3enayhi_440790';
                    const params = new URLSearchParams({
                      email: user?.email || '',
                      user_id: user?.id || '',
                      return_url: `${window.location.origin}/dashboard?payment_success=true`
                    });
                    window.open(`${baseUrl}?${params.toString()}`, '_blank');
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade para Criar Mais
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : characters.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <User className="h-16 w-16 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-600">Nenhum personagem ainda</h3>
                  <p className="text-gray-500 max-w-md">
                    Crie seu primeiro personagem para começar a gerar vídeos virais com IA.
                  </p>
                  <Button onClick={() => setShowCreateCharacter(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Personagem
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    videoCount={videos.filter(v => v.character_id === character.id).length}
                    totalViews={videos
                      .filter(v => v.character_id === character.id)
                      .reduce((sum, v) => sum + v.total_views, 0)
                    }
                    onGenerateVideo={(char) => {
                      setSelectedCharacter(char);
                      setShowVideoGenerator(true);
                    }}
                    onViewAnalytics={(char) => {
                      setSelectedCharacter(char);
                      setActiveTab('analytics');
                    }}
                    onEditCharacter={handleEditCharacter}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Roteiros Criados</h2>
              <p className="text-gray-600">{videos.length} roteiros gerados</p>
            </div>

            {videos.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <VideoIcon className="h-16 w-16 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-600">Nenhum roteiro ainda</h3>
                  <p className="text-gray-500 max-w-md">
                    Gere seu primeiro roteiro viral usando um dos seus personagens.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewVideo(video)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {video.duration_seconds}s • {video.content_type} • {video.blocks.length} blocos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Data de criação */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{formatCreatedDate(video.created_at)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{video.total_views} views</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            video.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {video.status}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleViewVideo(video)}
                            className="flex-1"
                          >
                            Ver Roteiro
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAnalyzeMetrics(video.id)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {selectedVideoForMetrics ? (
              <MetricsAnalyzer
                videoId={selectedVideoForMetrics}
                onAnalysisComplete={() => {
                  setSelectedVideoForMetrics(null);
                  fetchVideos();
                }}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Analytics de Performance</h2>
                  <p className="text-gray-600">Analise o desempenho dos seus vídeos com IA</p>
                </div>

                {videos.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <BarChart3 className="h-16 w-16 text-gray-400" />
                      <h3 className="text-xl font-semibold text-gray-600">Nenhum vídeo para analisar</h3>
                      <p className="text-gray-500 max-w-md">
                        Gere alguns roteiros primeiro para poder analisar sua performance.
                      </p>
                      <Button onClick={() => setActiveTab('videos')} className="mt-4">
                        <VideoIcon className="h-4 w-4 mr-2" />
                        Ver Roteiros
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Como funciona o Analytics</h3>
                          <p className="text-gray-600">Clique em "Analisar" em qualquer vídeo abaixo para fazer upload de screenshots e obter insights de IA sobre performance.</p>
                        </div>
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videos.map((video) => (
                        <Card key={video.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                              <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                                {video.status}
                              </Badge>
                            </div>
                            <CardDescription>
                              {video.duration_seconds}s • {video.content_type} • {video.blocks.length} blocos
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {/* Data de criação */}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>{formatCreatedDate(video.created_at)}</span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{video.total_views.toLocaleString()} views</span>
                                <span className="text-green-600 font-medium">
                                  📊 Pronto para análise
                                </span>
                              </div>
                              
                              <Button
                                onClick={() => handleAnalyzeMetrics(video.id)}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analisar Performance
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplateManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <CreateCharacterDialog
        open={showCreateCharacter}
        onOpenChange={setShowCreateCharacter}
        onCreateCharacter={handleCreateCharacter}
      />

      <EditCharacterDialog
        open={!!editingCharacter}
        onOpenChange={(open) => !open && setEditingCharacter(null)}
        character={editingCharacter}
        onCharacterUpdated={handleCharacterUpdated}
      />

      <UserSettingsDialog
        open={showUserSettings}
        onOpenChange={setShowUserSettings}
      />

      <VideoGenerator
        open={showVideoGenerator}
        onOpenChange={setShowVideoGenerator}
        character={selectedCharacter}
        onVideoGenerated={() => {
          fetchVideos();
          setShowVideoGenerator(false);
        }}
      />

      {selectedVideo && (
        <VideoScriptViewer
          open={showVideoViewer}
          onOpenChange={setShowVideoViewer}
          video={selectedVideo}
          onDelete={handleDeleteVideo}
        />
      )}
    </div>
  );
}
