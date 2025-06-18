import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Video, TrendingUp, ArrowLeft, Home } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error,
      });
    } else {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, firstName, lastName, whatsapp);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error,
      });
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error,
      });
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowResetPassword(false);
      setResetEmail('');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/10 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Início
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Hero Section */}
          <div className="text-center lg:text-left space-y-6 text-white">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold">Viral Prompt</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Crie Vídeos Virais em
              <span className="text-yellow-400"> 5 Minutos</span>
            </h2>
            
            <p className="text-xl text-blue-100">
              De 8 horas para 5 minutos. Nossa IA gera roteiros otimizados para viralização
              com personagens consistentes.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Video className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="font-semibold">1000+</div>
                  <div className="text-sm text-blue-200">Vídeos Gerados</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <div>
                  <div className="font-semibold">90%</div>
                  <div className="text-sm text-blue-200">Taxa de Sucesso</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <div>
                  <div className="font-semibold">5min</div>
                  <div className="text-sm text-blue-200">Tempo Médio</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Comece Agora</CardTitle>
              <CardDescription>
                Entre ou crie sua conta para começar a criar vídeos virais
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  {!showResetPassword ? (
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Senha</Label>
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            Esqueceu a senha?
                          </button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold">Recuperar Senha</h3>
                        <p className="text-sm text-gray-600">
                          Digite seu email para receber um link de recuperação
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setShowResetPassword(false);
                            setResetEmail('');
                          }}
                        >
                          Voltar ao Login
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="João"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Silva"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Criando..." : "Criar Conta Grátis"}
                    </Button>
                    
                    <p className="text-sm text-center text-gray-600">
                      Plano gratuito inclui 3 personagens e 5 vídeos por dia
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Link to home page */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Voltar à página inicial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
