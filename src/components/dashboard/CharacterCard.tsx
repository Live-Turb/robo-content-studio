
import { Character } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Video, BarChart3, Edit } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  videoCount?: number;
  totalViews?: number;
  onGenerateVideo: (character: Character) => void;
  onViewAnalytics: (character: Character) => void;
  onEditCharacter: (character: Character) => void;
}

export function CharacterCard({ 
  character, 
  videoCount = 0, 
  totalViews = 0, 
  onGenerateVideo, 
  onViewAnalytics,
  onEditCharacter 
}: CharacterCardProps) {
  // Extract language from personality if available
  const getLanguage = (personality: string) => {
    const langMatch = personality.match(/Audio Language:\s*([a-z-A-Z]+)/);
    return langMatch ? langMatch[1] : 'pt-BR';
  };

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'pt-BR': '🇧🇷',
      'en-US': '🇺🇸',
      'es-ES': '🇪🇸',
      'es-MX': '🇲🇽',
      'fr-FR': '🇫🇷'
    };
    return flags[language] || '🌍';
  };

  const language = getLanguage(character.personality);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={character.avatar_url} alt={character.name} />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
              {character.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{character.name}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {getLanguageFlag(language)} {language}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {character.personality.split('|')[0].trim()}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{videoCount}</div>
            <div className="text-xs text-blue-700">Vídeos</div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {totalViews > 1000 ? `${(totalViews/1000).toFixed(1)}K` : totalViews}
            </div>
            <div className="text-xs text-green-700">Views</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => onGenerateVideo(character)}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Gerar Vídeo
          </Button>
          <Button 
            onClick={() => onEditCharacter(character)}
            variant="outline"
            size="sm"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          onClick={() => onViewAnalytics(character)}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics dos Vídeos
        </Button>
      </CardContent>
    </Card>
  );
}
