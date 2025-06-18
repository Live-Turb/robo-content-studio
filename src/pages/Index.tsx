import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Video, TrendingUp, User, ArrowRight } from 'lucide-react';

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
