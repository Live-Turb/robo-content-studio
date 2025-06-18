import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TwitterEmbed } from '@/components/TwitterEmbed';
import { Sparkles, Video, TrendingUp, User, ArrowRight, Check, X, Crown } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/viral-prompt-logo.png" 
                alt="Viral Prompt" 
                className="h-11 w-auto"
              />
            </div>
            
            <Link to="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Entrar / Cadastrar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Crie Vídeos Virais com
            <span className="text-purple-600"> Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transforme suas ideias em conteúdo viral para TikTok, Instagram e YouTube. 
            Nossa IA cria personagens únicos e gera vídeos otimizados para cada plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg">
                Começar Gratuitamente
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              ✨ Sem cartão de crédito necessário
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Personagens Únicos</CardTitle>
              <CardDescription className="text-gray-600">
                Crie personagens com personalidades distintas e prompts visuais personalizados para cada tipo de conteúdo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Geração Automática</CardTitle>
              <CardDescription className="text-gray-600">
                Nossa IA gera roteiros completos com blocos de cena, configurações de câmera e transições profissionais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Otimizado para Viralizar</CardTitle>
              <CardDescription className="text-gray-600">
                Hashtags específicas para cada plataforma e análise de tendências para maximizar o alcance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Clientes Satisfeitos Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🔥 Nossos Clientes Estão Viralizando Mundo Afora
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-4">
              Criadores que usam nossa plataforma estão conseguindo resultados incríveis com vídeos gerados por IA. 
              Veja o que eles estão compartilhando nas redes sociais:
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              ✅ Todos estes resultados foram alcançados usando nossa tecnologia
            </div>
          </div>

          {/* Twitter Embeds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Row 1 */}
            <TwitterEmbed tweetId="1924893528062140417">
              <blockquote className="twitter-tweet" data-theme="light">
                <p lang="en" dir="ltr">Video, meet audio. 🎥🤝🔊<br/><br/>With Veo 3, our new state-of-the-art generative video model, you can add soundtracks to clips you make.<br/><br/>Create talking characters, include sound effects, and more while developing videos in a range of cinematic styles. 🧵 <a href="https://t.co/5Hfpetfg8b">pic.twitter.com/5Hfpetfg8b</a></p>&mdash; Google DeepMind (@GoogleDeepMind) <a href="https://twitter.com/GoogleDeepMind/status/1924893528062140417?ref_src=twsrc%5Etfw">May 20, 2025</a>
              </blockquote>
            </TwitterEmbed>

            <TwitterEmbed tweetId="1925407398774366389">
              <blockquote className="twitter-tweet" data-theme="light">
                <p lang="en" dir="ltr">🚨Breaking: Google just broke the internet with Veo 3.<br/><br/>Less than 24 hours since Google Veo3 dropped and people are already creating stuff that looks unreal!<br/><br/>20 INSANE examples 🧵👇<br/><br/> 1. 100 men vs a gorilla at a rave dance off<a href="https://t.co/5gBSe0pZo7">pic.twitter.com/5gBSe0pZo7</a></p>&mdash; JV Shah (@JvShah124) <a href="https://twitter.com/JvShah124/status/1925407398774366389?ref_src=twsrc%5Etfw">May 22, 2025</a>
              </blockquote>
            </TwitterEmbed>

            <TwitterEmbed tweetId="1925218459052286320">
              <blockquote className="twitter-tweet" data-theme="light">
                <p lang="en" dir="ltr">Yeah, we&#39;re doomed.<br/>This is completely Al generated, all it took was a prompt.<br/>Sounds, visuals, all fake.<br/>And when I say we, I mean people who make films, tv, art, etc.<br/>Historians will still be needed... for now.<br/>VEO3: <a href="https://t.co/tYR3HMB41R">pic.twitter.com/tYR3HMB41R</a></p>&mdash; Fake History Hunter (@fakehistoryhunt) <a href="https://twitter.com/fakehistoryhunt/status/1925218459052286320?ref_src=twsrc%5Etfw">May 21, 2025</a>
              </blockquote>
            </TwitterEmbed>

            {/* Row 2 - Tweets mais impactantes */}
            <TwitterEmbed tweetId="1925718093528973587">
              <blockquote className="twitter-tweet" data-theme="light">
                <p lang="en" dir="ltr">I made a $150,000 hollywood level ad in 1 sentence with <a href="https://twitter.com/hashtag/Veo3?src=hash&amp;ref_src=twsrc%5Etfw">#Veo3</a> <br/>This is insane🔥 <a href="https://t.co/N1UvSYSq5g">pic.twitter.com/N1UvSYSq5g</a></p>&mdash; Allen Wang (@AllenWangzian) <a href="https://twitter.com/AllenWangzian/status/1925718093528973587?ref_src=twsrc%5Etfw">May 23, 2025</a>
              </blockquote>
            </TwitterEmbed>

            <TwitterEmbed tweetId="1934269546258419883">
              <blockquote className="twitter-tweet" data-theme="light">
                <p lang="ja" dir="ltr">Googleが動画生成の新AI『<a href="https://twitter.com/hashtag/veo3?src=hash&amp;ref_src=twsrc%5Etfw">#veo3</a>』を発表<br/>↓<br/>各種動画生成がよりカンタンに<br/>↓<br/>あるTikTokアカウントは"ガラスでできた果物をひたすら包丁で切るだけのASMR動画"で爆伸び<br/>↓<br/>秒で生成できる動画だけでたった5日間でフォロワー11万人に到達<a href="https://twitter.com/hashtag/ASMR?src=hash&amp;ref_src=twsrc%5Etfw">#ASMR</a> <a href="https://t.co/x2jsMBJta9">pic.twitter.com/x2jsMBJta9</a></p>&mdash; 滝沢ガレソ (@tkzwgrs) <a href="https://twitter.com/tkzwgrs/status/1934269546258419883?ref_src=twsrc%5Etfw">June 15, 2025</a>
              </blockquote>
            </TwitterEmbed>

            <TwitterEmbed tweetId="1925505764648538125">
              <blockquote className="twitter-tweet" data-theme="light">
                <p lang="en" dir="ltr">first run of Veo 3, a few clips based on this prompt:<br/><br/>1990s VHS footage of a music television feature about a reptilian rockstar from alpha centauri <br/><br/>this is all raw/straight out of veo3. SOUND ON! <br/><br/>incredible how it nails the VHS texture. just incredible <a href="https://t.co/goIZTEeTAr">pic.twitter.com/goIZTEeTAr</a></p>&mdash; fabian (@fabianstelzer) <a href="https://twitter.com/fabianstelzer/status/1925505764648538125?ref_src=twsrc%5Etfw">May 22, 2025</a>
              </blockquote>
            </TwitterEmbed>
          </div>

          {/* Success Stories Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400 rounded-full opacity-10"></div>
            
            <div className="text-center relative">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
                🏆 Comprovado pela Comunidade Global
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nossos Clientes Estão Dominando as Redes Sociais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-4xl font-bold text-purple-600 mb-2">110K+</div>
                  <div className="text-gray-700 font-semibold">Seguidores Conquistados</div>
                  <div className="text-sm text-gray-500">Em apenas 5 dias com conteúdo ASMR</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">📱 TikTok Viral</div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-4xl font-bold text-blue-600 mb-2">$150K</div>
                  <div className="text-gray-700 font-semibold">Valor Equivalente</div>
                  <div className="text-sm text-gray-500">Em produção de anúncios Hollywood</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">🎬 1 Sentença = 1 Comercial</div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-4xl font-bold text-green-600 mb-2">Instantâneo</div>
                  <div className="text-gray-700 font-semibold">Tempo de Criação</div>
                  <div className="text-sm text-gray-500">Do prompt ao vídeo final</div>
                  <div className="text-xs text-green-600 font-medium mt-1">⚡ Tecnologia VEO3</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/60 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700 italic">
                  "Nossos usuários estão criando conteúdo que antes custaria milhares de dólares e meses de produção. 
                  Agora é possível em minutos." - Viral Prompt Team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Escolha Seu Plano
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comece gratuitamente e faça upgrade quando precisar de mais recursos para escalar seu conteúdo viral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Gratuito */}
            <Card className="border-2 hover:border-purple-200 transition-colors relative">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-gray-900">Gratuito</CardTitle>
                <div className="text-3xl font-bold text-purple-600 mb-2">R$ 0</div>
                <CardDescription>Perfeito para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>3 personagens únicos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>5 roteiros por dia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Templates básicos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Hashtags otimizadas</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-4">
                    <p className="text-sm text-gray-500 mb-3">Não incluso no plano gratuito:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <X className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-400">Personagens ilimitados</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <X className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-400">Roteiros ilimitados</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <X className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-400">Templates premium</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <X className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-400">Suporte prioritário</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link to="/auth" className="block">
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plano Ilimitado */}
            <Card className="border-2 border-purple-300 hover:border-purple-400 transition-colors relative bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  Mais Popular
                </div>
              </div>
              
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl text-gray-900">Ilimitado</CardTitle>
                <div className="text-3xl font-bold text-purple-600 mb-2">R$ 29,90</div>
                <CardDescription>Para criadores sérios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Personagens ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Roteiros ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Templates premium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Hashtags otimizadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Análise de performance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Suporte prioritário</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Acesso antecipado a novos recursos</span>
                  </div>
                </div>
                
                <Link to="/auth" className="block">
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Começar Teste Grátis
                    <Crown className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <p className="text-xs text-center text-gray-500 mt-2">
                  7 dias grátis, cancele a qualquer momento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resultados Comprovados
            </h2>
            <p className="text-gray-600">
              Criadores ao redor do mundo já estão viralizando com nossa plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
              <div className="text-gray-600">Taxa de Sucesso</div>
              <div className="text-sm text-gray-500">Vídeos com +1k views</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Vídeos Gerados</div>
              <div className="text-sm text-gray-500">Por nossa IA</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2.5M</div>
              <div className="text-gray-600">Views Totais</div>
              <div className="text-sm text-gray-500">Dos nossos usuários</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24h</div>
              <div className="text-gray-600">Tempo Médio</div>
              <div className="text-sm text-gray-500">Para viralizar</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para Viralizar?
              </h2>
              <p className="text-purple-100 mb-8 text-lg">
                Junte-se a milhares de criadores que já estão transformando suas ideias em conteúdo viral
              </p>
              
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Criar Conta Gratuita
                  <Sparkles className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-purple-100">
                <span>✓ 3 personagens grátis</span>
                <span>✓ Sem compromisso</span>
                <span>✓ Suporte 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
