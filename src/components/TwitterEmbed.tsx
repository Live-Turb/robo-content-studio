import { useEffect } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
  children: React.ReactNode;
}

declare global {
  interface Window {
    twttr: any;
  }
}

export const TwitterEmbed: React.FC<TwitterEmbedProps> = ({ tweetId, children }) => {
  useEffect(() => {
    // Carregar os widgets do Twitter quando o componente é montado
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [tweetId]);

  return (
    <div className="flex justify-center max-w-full">
      {children}
    </div>
  );
}; 