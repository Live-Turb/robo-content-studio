
import { Character } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Video, TrendingUp } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onGenerateVideo: () => void;
  videoCount: number;
}

export function CharacterCard({ character, onGenerateVideo, videoCount }: CharacterCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={character.avatar_url} alt={character.name} />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
              {getInitials(character.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-lg">{character.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {character.personality}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
            <Video className="h-4 w-4 text-blue-600 mb-1" />
            <span className="text-sm font-semibold text-blue-900">{videoCount}</span>
            <span className="text-xs text-blue-600">Vídeos</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600 mb-1" />
            <span className="text-sm font-semibold text-green-900">92%</span>
            <span className="text-xs text-green-600">Sucesso</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
            <Sparkles className="h-4 w-4 text-purple-600 mb-1" />
            <span className="text-sm font-semibold text-purple-900">8.4k</span>
            <span className="text-xs text-purple-600">Views</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {character.visual_prompt.split(' ').slice(0, 3).join(' ')}...
          </Badge>
        </div>

        <Button 
          onClick={onGenerateVideo} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Gerar Vídeo Viral
        </Button>
      </CardContent>
    </Card>
  );
}
