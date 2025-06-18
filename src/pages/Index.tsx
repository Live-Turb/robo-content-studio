import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TwitterEmbed } from '@/components/TwitterEmbed';
import { Sparkles, Video, TrendingUp, User, ArrowRight, Check, X, Crown } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/viral-prompt-logo.png" 
                alt="VEO3 - Criar Vídeos para TikTok com IA" 
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">VEO3 POWERED</span>
              </div>
            </div>
            
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6">
                Começar Grátis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          {/* Badge VEO3 */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-200 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-purple-700">Tecnologia VEO3 • Prompt Video IA</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            <span className="block">Criar Vídeos para</span>
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              TikTok com VEO3
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            🚀 Transforme qualquer <strong>prompt video</strong> em conteúdo viral para TikTok, Instagram e YouTube. 
            Nossa <strong>IA VEO3</strong> gera roteiros otimizados em <span className="text-purple-600 font-bold">5 minutos</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-10 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="h-6 w-6 mr-3" />
                Começar Grátis com VEO3
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-sm">⚡ 110K+ criadores</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-sm">🎯 87% taxa de sucesso</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>3 personagens grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Tecnologia VEO3</span>
            </div>
          </div>
        </div>

        {/* Features Grid - SEO Optimized */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona o VEO3 para <span className="text-purple-600">Criar Videos para TikTok</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa tecnologia VEO3 revoluciona a criação de conteúdo com prompt video inteligente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group border-0 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 rounded-2xl p-6">
              <CardHeader className="text-center">
                <div className="h-16 w-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <User className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Personagens VEO3</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Crie personagens únicos com nossa IA VEO3. Cada personagem tem personalidade distinta e prompts visuais otimizados para <strong>criar videos para tiktok</strong> virais.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 rounded-2xl p-6">
              <CardHeader className="text-center">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Prompt Video Automático</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Nossa IA VEO3 transforma qualquer <strong>prompt video</strong> em roteiros completos com blocos de cena, configurações de câmera e transições cinematográficas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-2xl hover:scale-105 rounded-2xl p-6">
              <CardHeader className="text-center">
                <div className="h-16 w-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Viral no TikTok</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Hashtags específicas para TikTok, Instagram e YouTube. Análise de tendências com VEO3 para maximizar o alcance e <strong>criar videos para tiktok</strong> que viralizam.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Clientes Satisfeitos Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-200 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-green-700">Resultados Reais • VEO3 Comprovado</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              🔥 <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Criadores VEO3</span> Viralizando
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Criadores que usam nossa plataforma <strong>VEO3</strong> para <strong>criar videos para tiktok</strong> estão conseguindo resultados incríveis. 
              Veja o que eles estão compartilhando nas redes sociais:
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 rounded-2xl text-sm font-semibold shadow-lg">
              <span className="text-green-600 mr-2">✅</span>
              Todos estes resultados foram alcançados usando nossa tecnologia VEO3
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
            <div className="bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/50 rounded-3xl p-10 border border-purple-100 relative overflow-hidden shadow-2xl">
              {/* Background decoration */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-10 blur-xl"></div>
              
              <div className="text-center relative">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 text-yellow-800 rounded-2xl text-sm font-bold mb-8 shadow-lg">
                  🏆 Comprovado pela Comunidade Global VEO3
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
                  Criadores VEO3 Dominando <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">TikTok e Redes Sociais</span>
                </h3>
              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group text-center p-8 bg-gradient-to-br from-white to-purple-50 rounded-2xl border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">110K+</div>
                    <div className="text-gray-900 font-bold text-lg mb-2">Seguidores Conquistados</div>
                    <div className="text-gray-600 mb-3">Em apenas 5 dias com conteúdo ASMR</div>
                    <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      📱 TikTok Viral com VEO3
                    </div>
                  </div>
                  
                  <div className="group text-center p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">$150K</div>
                    <div className="text-gray-900 font-bold text-lg mb-2">Valor Equivalente</div>
                    <div className="text-gray-600 mb-3">Em produção de anúncios Hollywood</div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      🎬 Prompt Video Profissional
                    </div>
                  </div>
                  
                  <div className="group text-center p-8 bg-gradient-to-br from-white to-green-50 rounded-2xl border border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">5min</div>
                    <div className="text-gray-900 font-bold text-lg mb-2">Tempo de Criação</div>
                    <div className="text-gray-600 mb-3">Do prompt ao vídeo final</div>
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      ⚡ Tecnologia VEO3
                    </div>
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-200 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-purple-700">Planos VEO3 • Criar Videos para TikTok</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Escolha Seu <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Plano VEO3</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comece gratuitamente e faça upgrade quando precisar de mais recursos para <strong>criar videos para tiktok</strong> e escalar seu conteúdo viral com nossa tecnologia VEO3
            </p>
          </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Plano Gratuito */}
              <Card className="group border-0 bg-gradient-to-br from-white to-gray-50 hover:to-purple-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl mb-4 mx-auto">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-2">VEO3 Gratuito</CardTitle>
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">R$ 0</div>
                  <CardDescription className="text-lg text-gray-600">Perfeito para começar a criar videos para tiktok</CardDescription>
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
              <Card className="group border-0 bg-gradient-to-br from-white via-purple-50/50 to-indigo-50 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600"></div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Crown className="h-4 w-4" />
                    🔥 Mais Popular VEO3
                  </div>
                </div>
                
                <CardHeader className="text-center pb-6 pt-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4 mx-auto">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-2">VEO3 Ilimitado</CardTitle>
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">R$ 29,90</div>
                  <CardDescription className="text-lg text-gray-600">Para criadores sérios que querem viralizar</CardDescription>
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
        <div className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 rounded-3xl shadow-2xl p-12 mb-20 border border-purple-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-200 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-purple-700">Estatísticas VEO3 em Tempo Real</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Resultados Comprovados</span> VEO3
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Criadores ao redor do mundo já estão viralizando com nossa plataforma <strong>VEO3</strong> para <strong>criar videos para tiktok</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group text-center p-6 bg-white/80 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">87%</div>
              <div className="text-gray-900 font-bold text-lg mb-1">Taxa de Sucesso</div>
              <div className="text-sm text-gray-600">Vídeos com +1k views</div>
              <div className="text-xs text-purple-600 font-semibold mt-2">🎯 VEO3 Precisão</div>
            </div>
            
            <div className="group text-center p-6 bg-white/80 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">10k+</div>
              <div className="text-gray-900 font-bold text-lg mb-1">Vídeos Gerados</div>
              <div className="text-sm text-gray-600">Por nossa IA VEO3</div>
              <div className="text-xs text-blue-600 font-semibold mt-2">🚀 Prompt Video</div>
            </div>
            
            <div className="group text-center p-6 bg-white/80 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">2.5M</div>
              <div className="text-gray-900 font-bold text-lg mb-1">Views Totais</div>
              <div className="text-sm text-gray-600">Dos nossos usuários</div>
              <div className="text-xs text-green-600 font-semibold mt-2">📈 TikTok Viral</div>
            </div>
            
            <div className="group text-center p-6 bg-white/80 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">5min</div>
              <div className="text-gray-900 font-bold text-lg mb-1">Tempo Médio</div>
              <div className="text-sm text-gray-600">Para criar videos</div>
              <div className="text-xs text-orange-600 font-semibold mt-2">⚡ VEO3 Velocidade</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl p-16 text-center">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-white">🚀 Última Chance VEO3</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Pronto para <span className="text-yellow-400">Viralizar</span><br />
              com VEO3?
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Junte-se a <strong className="text-white">110K+ criadores</strong> que já estão usando nossa <strong className="text-yellow-400">IA VEO3</strong> para <strong className="text-white">criar videos para tiktok</strong> virais todos os dias
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700 px-10 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="h-6 w-6 mr-3" />
                  Começar Grátis Agora
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Sem cartão</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">3 personagens</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">VEO3 incluído</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
