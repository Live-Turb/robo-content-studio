import { supabase } from '@/integrations/supabase/client';

interface TrendData {
  keyword: string;
  value: number;
  relatedQueries: string[];
  hashtags: string[];
}

interface CountryMapping {
  [key: string]: string;
}

const countryMappings: CountryMapping = {
  'BR': 'BR',
  'US': 'US', 
  'MX': 'MX',
  'AR': 'AR',
  'ES': 'ES',
  'FR': 'FR',
  'IT': 'IT',
  'DE': 'DE',
  'UK': 'GB',
  'CA': 'CA',
  'AU': 'AU'
};

const categoryMappings = {
  'trending': 0, // All categories
  'comedy': 20, // Humor
  'horror': 18, // TV & Film
  'custom': 0
};

export class TrendsService {
  private static instance: TrendsService;
  
  public static getInstance(): TrendsService {
    if (!TrendsService.instance) {
      TrendsService.instance = new TrendsService();
    }
    return TrendsService.instance;
  }

  // Busca tendências atuais baseadas no país e categoria
  async getCurrentTrends(country: string, contentType: string): Promise<TrendData[]> {
    try {
      const geoCode = countryMappings[country] || 'BR';
      const category = categoryMappings[contentType as keyof typeof categoryMappings] || 0;
      
      console.log(`🔍 Buscando tendências para ${country} (${geoCode}) - Categoria: ${contentType}`);
      
      // Busca tendências diárias (real-time)
      const dailyTrends = await this.getDailyTrends(geoCode);
      
      // Busca palavras-chave relacionadas se tivermos tendências
      if (dailyTrends.length > 0) {
        const enrichedTrends = await Promise.all(
          dailyTrends.slice(0, 3).map(async (trend) => {
            const relatedData = await this.getRelatedQueries(trend.keyword, geoCode, category);
            return {
              ...trend,
              relatedQueries: relatedData.queries,
              hashtags: relatedData.hashtags
            };
          })
        );
        
        return enrichedTrends;
      }
      
      // Fallback: busca por categoria específica
      return await this.getFallbackTrends(geoCode, category, contentType);
      
    } catch (error) {
      console.error('❌ Erro ao buscar tendências:', error);
      return await this.getFallbackTrends('BR', 0, contentType);
    }
  }

  // Busca tendências diárias via Supabase Edge Function
  private async getDailyTrends(geoCode: string): Promise<TrendData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('google-trends', {
        body: {
          action: 'dailyTrends',
          geo: geoCode,
          hl: geoCode === 'BR' ? 'pt-BR' : 'en-US'
        }
      });
      
      if (error) throw error;
      
      const trends: TrendData[] = [];
      
      if (data?.trends) {
        // Pega os top 5 trends
        for (let i = 0; i < Math.min(5, data.trends.length); i++) {
          const trend = data.trends[i];
          trends.push({
            keyword: trend.keyword || 'Tendência viral',
            value: trend.value || 100,
            relatedQueries: [],
            hashtags: []
          });
        }
      }
      
      console.log(`✅ Encontradas ${trends.length} tendências diárias via Supabase`);
      return trends;
      
    } catch (error) {
      console.error('❌ Erro ao buscar tendências diárias via Supabase:', error);
      return [];
    }
  }

  // Busca queries relacionadas via Supabase Edge Function
  private async getRelatedQueries(keyword: string, geoCode: string, category: number): Promise<{queries: string[], hashtags: string[]}> {
    try {
      const { data, error } = await supabase.functions.invoke('google-trends', {
        body: {
          action: 'relatedQueries',
          keyword: keyword,
          geo: geoCode,
          category: category,
          hl: geoCode === 'BR' ? 'pt-BR' : 'en-US'
        }
      });
      
      if (error) throw error;
      
      const queries: string[] = [];
      const hashtags: string[] = [];
      
      // Extrai queries relacionadas
      if (data?.queries) {
        queries.push(...data.queries.slice(0, 5));
      }
      
      // Gera hashtags baseadas no keyword e queries relacionadas
      hashtags.push(
        `#${keyword.replace(/\s+/g, '').toLowerCase()}`,
        `#viral`,
        `#trending`,
        `#${geoCode.toLowerCase()}`
      );
      
      // Adiciona hashtags das queries relacionadas
      queries.slice(0, 3).forEach(query => {
        const hashtag = `#${query.replace(/\s+/g, '').toLowerCase()}`;
        if (hashtag.length <= 20 && !hashtags.includes(hashtag)) {
          hashtags.push(hashtag);
        }
      });
      
      return { queries: queries.slice(0, 5), hashtags: hashtags.slice(0, 8) };
      
    } catch (error) {
      console.error('❌ Erro ao buscar queries relacionadas via Supabase:', error);
      return { 
        queries: ['tendência viral', 'assunto do momento'], 
        hashtags: [`#${keyword.replace(/\s+/g, '').toLowerCase()}`, '#viral', '#trending']
      };
    }
  }

  // Fallback com tendências pré-definidas por categoria
  private async getFallbackTrends(geoCode: string, category: number, contentType: string): Promise<TrendData[]> {
    const fallbackTrends = {
      'trending': [
        { keyword: 'IA e tecnologia', value: 85, base: 'inteligência artificial' },
        { keyword: 'Sustentabilidade', value: 78, base: 'meio ambiente' },
        { keyword: 'Crypto e NFTs', value: 72, base: 'criptomoedas' }
      ],
      'comedy': [
        { keyword: 'Memes virais', value: 90, base: 'memes' },
        { keyword: 'Stand-up comedy', value: 75, base: 'comédia' },
        { keyword: 'Pegadinhas', value: 68, base: 'pranks' }
      ],
      'horror': [
        { keyword: 'Filmes de terror 2024', value: 82, base: 'terror' },
        { keyword: 'Histórias assombradas', value: 76, base: 'assombração' },
        { keyword: 'Creepypasta', value: 71, base: 'creepy' }
      ]
    };
    
    const trends = fallbackTrends[contentType as keyof typeof fallbackTrends] || fallbackTrends.trending;
    
    return trends.map(trend => ({
      keyword: trend.keyword,
      value: trend.value,
      relatedQueries: ['viral', 'tendência', 'popular'],
      hashtags: [
        `#${trend.base}`,
        '#viral',
        '#trending',
        `#${geoCode.toLowerCase()}`,
        '#tiktok',
        '#fyp'
      ]
    }));
  }

  // Busca interesse por região via Supabase Edge Function
  async getInterestByRegion(keyword: string, geoCode: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('google-trends', {
        body: {
          action: 'interestByRegion',
          keyword: keyword,
          geo: geoCode,
          resolution: 'COUNTRY'
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar interesse por região via Supabase:', error);
      return null;
    }
  }

  // Gera hashtags otimizadas para diferentes plataformas
  generateOptimizedHashtags(keyword: string, relatedQueries: string[], country: string, contentType: string): {
    tiktok: string[];
    instagram: string[];
    youtube: string[];
  } {
    const baseHashtags = [
      `#${keyword.replace(/\s+/g, '').toLowerCase()}`,
      '#viral',
      '#fyp',
      '#trending'
    ];
    
    const countryHashtags = {
      'BR': ['#brasil', '#br', '#brazuca'],
      'US': ['#usa', '#america', '#us'],
      'MX': ['#mexico', '#mx', '#mexicano']
    };
    
    const contentHashtags = {
      'trending': ['#trend', '#viral', '#popular', '#momento'],
      'comedy': ['#funny', '#humor', '#risos', '#comédia'],
      'horror': ['#terror', '#scary', '#medo', '#assustador']
    };
    
    const platformSpecific = {
      tiktok: [...baseHashtags, '#tiktok', '#foryou', '#viralvideo'],
      instagram: [...baseHashtags, '#reels', '#explore', '#instagood'],
      youtube: [...baseHashtags, '#shorts', '#youtube', '#subscribe']
    };
    
    // Adiciona hashtags específicas do país
    const countryTags = countryHashtags[country as keyof typeof countryHashtags] || [];
    const contentTags = contentHashtags[contentType as keyof typeof contentHashtags] || [];
    
    return {
      tiktok: [...platformSpecific.tiktok, ...countryTags.slice(0, 2), ...contentTags.slice(0, 3)].slice(0, 12),
      instagram: [...platformSpecific.instagram, ...countryTags.slice(0, 2), ...contentTags.slice(0, 3)].slice(0, 15),
      youtube: [...platformSpecific.youtube, ...countryTags.slice(0, 2), ...contentTags.slice(0, 3)].slice(0, 10)
    };
  }
} 