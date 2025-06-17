
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Character, Video } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Video as VideoIcon, TrendingUp, Sparkles, User, LogOut } from 'lucide-react';
import { CharacterCard } from './CharacterCard';
import { CreateCharacterDialog } from './CreateCharacterDialog';
import { VideoGenerator } from './VideoGenerator';

export default function Dashboard() {
  const { user, userProfile, signOut } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);

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
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      // Convert Supabase response to our Video type
      const typedVideos = data.map(video => ({
        ...video,
        duration_seconds: video.duration_seconds as number,
        content_type: video.content_type as 'trending' | 'horror' | 'comedy' | 'custom',
        status: video.status as 'draft' | 'published' | 'archived',
        blocks: Array.isArray(video.blocks) ? video.blocks : [],
        hashtags: video.hashtags || { tiktok: [], instagram: [], youtube: [] }
      }));
      
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

  const handleGenerateVideo = (character: Character) => {
    setSelectedCharacter(character);
    setShowVideoGenerator(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">VideoViral AI</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{userProfile?.email}</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {userProfile?.plan?.toUpperCase()}
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Characters Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Seus Personagens</h2>
            
            {canCreateMore && (
              <Button onClick={() => setShowCreateCharacter(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Personagem
              </Button>
            )}
          </div>

          {characters.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <User className="h-16 w-16 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600">Nenhum personagem ainda</h3>
                <p className="text-gray-500 max-w-md">
                  Crie seu primeiro personagem para começar a gerar vídeos virais com IA.
                  Cada personagem tem sua própria personalidade e estilo visual.
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
                  onGenerateVideo={() => handleGenerateVideo(character)}
                  videoCount={videos.filter(v => v.character_id === character.id).length}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Videos */}
        {videos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vídeos Recentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, 6).map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>
                      {video.duration_seconds}s • {video.content_type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{video.blocks.length} blocos</span>
                      <span>{video.total_views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateCharacterDialog
        open={showCreateCharacter}
        onOpenChange={setShowCreateCharacter}
        onCreateCharacter={handleCreateCharacter}
      />

      <VideoGenerator
        open={showVideoGenerator}
        onOpenChange={setShowVideoGenerator}
        character={selectedCharacter}
        onVideoGenerated={fetchVideos}
      />
    </div>
  );
}
