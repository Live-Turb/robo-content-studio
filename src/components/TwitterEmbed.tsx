import { useEffect, useState } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
}

// Dados dos tweets para fallback
const tweetUrls: Record<string, string> = {
  "1924893528062140417": "https://twitter.com/GoogleDeepMind/status/1924893528062140417",
  "1925407398774366389": "https://twitter.com/JvShah124/status/1925407398774366389", 
  "1925218459052286320": "https://twitter.com/fakehistoryhunt/status/1925218459052286320",
  "1925718093528973587": "https://twitter.com/AllenWangzian/status/1925718093528973587",
  "1934269546258419883": "https://twitter.com/tkzwgrs/status/1934269546258419883",
  "1925505764648538125": "https://twitter.com/fabianstelzer/status/1925505764648538125"
};

declare global {
  interface Window {
    twttr: any;
  }
}

export const TwitterEmbed: React.FC<TwitterEmbedProps> = ({ tweetId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Carregar script do Twitter apenas uma vez
    if (window.twttr) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      // Processar todos os widgets na página
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
    };
    document.head.appendChild(script);
  }, []);

  const tweetUrl = tweetUrls[tweetId];

  return (
    <div 
      className={`
        group relative transition-all duration-300 ease-out
        hover:scale-105 hover:z-10
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
      
      {/* Container principal */}
      <div className="relative bg-white rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group-hover:border-purple-200">
        {/* Gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"></div>
        
        {/* Badge VEO3 */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
            🚀 VEO3
          </div>
        </div>
        
        {/* Container do Tweet */}
        <div className="relative p-3">
          <div className="twitter-embed-container">
            {/* Blockquote nativo do Twitter */}
            <blockquote 
              className="twitter-tweet" 
              data-theme="light" 
              data-conversation="none"
              data-cards="visible"
              data-lang="pt"
            >
              <p lang="en" dir="ltr">
                {!scriptLoaded && (
                  <span className="text-gray-600">Carregando tweet...</span>
                )}
              </p>
              <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
                {new Date().toLocaleDateString('pt-BR')}
              </a>
            </blockquote>

            {/* Fallback se não carregar */}
            {!tweetUrl && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-2">Tweet não encontrado</div>
                <a 
                  href={`https://twitter.com/i/status/${tweetId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm underline"
                >
                  Ver no Twitter
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Indicador de interatividade */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Efeito de sombra externa */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 -z-10 transition-all duration-300"></div>
    </div>
  );
}; 