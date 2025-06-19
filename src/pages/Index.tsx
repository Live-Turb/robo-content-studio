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

        {/* Features Grid */}
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
                  Crie personagens únicos com nossa IA VEO3. Cada personagem tem personalidade distinta e prompts visuais otimizados para criar videos para tiktok virais.
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
                  Nossa IA VEO3 transforma qualquer prompt video em roteiros completos com blocos de cena, configurações de câmera e transições cinematográficas.
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
                  Hashtags específicas para TikTok, Instagram e YouTube. Análise de tendências com VEO3 para maximizar o alcance e criar videos para tiktok que viralizam.
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
              🔥 <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Comunidade VEO3</span> no Twitter
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Veja como a <strong>tecnologia VEO3</strong> está revolucionando a criação de conteúdo para <strong>TikTok</strong> pelo mundo. 
              Confira as reações reais dos criadores nas redes sociais com vídeos e avatares originais:
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 rounded-2xl text-sm font-semibold shadow-lg">
              <span className="text-green-600 mr-2">✅</span>
              Todos estes resultados foram alcançados usando nossa tecnologia VEO3
            </div>
          </div>

          {/* Twitter Embeds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Row 1 */}
            <TwitterEmbed tweetId="1924893528062140417" />
            <TwitterEmbed tweetId="1925407398774366389" />
            <TwitterEmbed tweetId="1925218459052286320" />

            {/* Row 2 - Tweets mais impactantes */}
            <TwitterEmbed tweetId="1925718093528973587" />
            <TwitterEmbed tweetId="1934269546258419883" />
            <TwitterEmbed tweetId="1925505764648538125" />
          </div>

                      {/* Success Stories Summary */}
            <div className="bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/50 rounded-3xl p-10 border border-purple-100 relative overflow-hidden shadow-2xl">
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
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-200 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-yellow-700">Planos VEO3 • Preços Especiais</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Escolha seu <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Plano VEO3</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Comece grátis com <strong>2 prompts por dia</strong> e escale para ilimitado com nossa <strong>tecnologia VEO3</strong> para criar vídeos virais no TikTok
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Plano Grátis */}
            <Card className="relative border border-gray-200 rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-slate-50/50"></div>
              <div className="relative p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-600 to-slate-600 rounded-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3">Plano Gratuito</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black text-gray-900">R$ 0</span>
                  </div>
                  <p className="text-gray-600 font-medium">Para sempre • Sem cartão</p>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">3 Personagens VEO3</p>
                      <p className="text-gray-600 text-sm">Crie até 3 personagens únicos com IA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">2 Prompts por dia</p>
                      <p className="text-gray-600 text-sm">Máximo 15 prompts por mês</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <X className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold">Bloqueio após limite</p>
                      <p className="text-gray-500 text-sm">Upgrade necessário para continuar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                      </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Hashtags TikTok Automáticas</p>
                      <p className="text-gray-600 text-sm">Tags otimizadas para alcance</p>
                      </div>
                      </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                      </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Suporte da Comunidade</p>
                      <p className="text-gray-600 text-sm">Acesso ao grupo Discord VEO3</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-800 hover:to-slate-800 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Começar Grátis Agora
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Plano Pro VEO3 - RECOMENDADO */}
            <Card className="relative border-2 border-purple-400 rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-indigo-50/80"></div>
              
              {/* Badge Recomendado */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full text-sm font-black flex items-center gap-2 shadow-lg">
                    <Crown className="h-4 w-4" />
                  RECOMENDADO
                  </div>
                </div>
                
              <div className="relative p-10 pt-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Video className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3">Pro VEO3</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">R$ 29,90</span>
                  </div>
                  <p className="text-gray-600 font-medium">por mês • Cancele quando quiser</p>
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold mt-3">
                    🔥 Economia de 50% no primeiro mês
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Personagens Ilimitados</p>
                      <p className="text-gray-600 text-sm">Crie quantos personagens quiser</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Prompts Ilimitados</p>
                      <p className="text-gray-600 text-sm">Sem limite diário ou mensal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Análise Viral Avançada</p>
                      <p className="text-gray-600 text-sm">IA que prevê potencial viral</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Templates Premium</p>
                      <p className="text-gray-600 text-sm">Bibliotecas exclusivas de conteúdo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">Suporte Prioritário</p>
                      <p className="text-gray-600 text-sm">Chat direto + consultoria mensal</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/auth">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                    <Crown className="h-5 w-5 mr-2" />
                    Começar Teste Grátis
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
            </div>
            
          {/* Garantia */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 rounded-2xl text-sm font-semibold shadow-lg">
              <span className="text-green-600 mr-2">✅</span>
              Garantia de 30 dias • Cancele quando quiser • Tecnologia VEO3 comprovada
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl p-16 text-center">
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