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
  'trending': 'all',
  'comedy': 'entertainment',
  'horror': 'entertainment',
  'sports': 'sports',
  'custom': 'all'
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
      const category = categoryMappings[contentType as keyof typeof categoryMappings] || 'all';
      
      console.log(`🔍 Buscando tendências para ${country} (${geoCode}) - Categoria: ${contentType}`);
      
      // Busca tendências via Edge Function
      const trendsData = await this.fetchTrendsFromEdgeFunction(geoCode, category);
      
      if (trendsData && trendsData.length > 0) {
        console.log(`✅ Encontradas ${trendsData.length} tendências via Edge Function`);
        return trendsData;
      }
      
      // Fallback: busca por categoria específica
      console.log('⚠️ Usando fallback trends');
      return await this.getFallbackTrends(geoCode, category, contentType);
      
    } catch (error) {
      console.error('❌ Erro ao buscar tendências:', error);
      return await this.getFallbackTrends('BR', 'all', contentType);
    }
  }

  // Busca tendências via Edge Function existente
  private async fetchTrendsFromEdgeFunction(geoCode: string, category: string): Promise<TrendData[]> {
    try {
      console.log('📡 Chamando Edge Function google-trends...');
      
      const { data, error } = await supabase.functions.invoke('google-trends', {
        body: {
          category: category,
          country: geoCode,
          period: 'now 1-d',
          limit: 10
        }
      });
      
      if (error) {
        console.error('❌ Erro na Edge Function:', error);
        throw error;
      }
      
      if (!data?.success || !data?.data?.trends) {
        console.error('❌ Resposta inválida da Edge Function:', data);
        throw new Error('Resposta inválida da Edge Function');
      }
      
      // Converter formato da Edge Function para nosso formato
      const trends: TrendData[] = data.data.trends.map((trend: any) => ({
        keyword: trend.title || 'Tendência viral',
        value: this.parseTrafficValue(trend.formattedTraffic || '100'),
        relatedQueries: trend.relatedQueries || [],
        hashtags: this.generateHashtags(trend.title, trend.relatedQueries || [])
      }));
      
      console.log(`✅ ${trends.length} tendências processadas da Edge Function`);
      return trends;
      
    } catch (error) {
      console.error('❌ Erro ao buscar tendências via Edge Function:', error);
      throw error;
    }
  }

  // Converte texto de tráfego em número
  private parseTrafficValue(formattedTraffic: string): number {
    const match = formattedTraffic.match(/(\d+)([KM]?)/);
    if (!match) return 100;
    
    const num = parseInt(match[1]);
    const multiplier = match[2];
    
    if (multiplier === 'M') return num * 1000000;
    if (multiplier === 'K') return num * 1000;
    return num;
  }

  // Gera hashtags baseadas no título e queries relacionadas
  private generateHashtags(title: string, relatedQueries: string[]): string[] {
    const hashtags: string[] = [];
    
    // Hashtag principal baseada no título
    const mainHashtag = `#${title.replace(/\s+/g, '').toLowerCase()}`;
    hashtags.push(mainHashtag);
    
    // Hashtags das queries relacionadas (primeiras 3)
    relatedQueries.slice(0, 3).forEach(query => {
      const hashtag = `#${query.replace(/\s+/g, '').toLowerCase()}`;
      if (hashtag.length <= 20 && !hashtags.includes(hashtag)) {
        hashtags.push(hashtag);
      }
    });
    
    // Hashtags padrão
    hashtags.push('#viral', '#trending', '#fyp', '#tiktok');
    
    return hashtags.slice(0, 8);
  }

  // Fallback com tendências pré-definidas por categoria
  private async getFallbackTrends(geoCode: string, category: string, contentType: string): Promise<TrendData[]> {
    const fallbackTrends = {
      'trending': [
        { keyword: 'IA e tecnologia', value: 85, base: 'inteligencia artificial' },
        { keyword: 'Sustentabilidade', value: 78, base: 'meio ambiente' },
        { keyword: 'Crypto e NFTs', value: 72, base: 'criptomoedas' }
      ],
      'comedy': [
        { keyword: 'Memes virais', value: 90, base: 'memes' },
        { keyword: 'Stand-up comedy', value: 75, base: 'comedia' },
        { keyword: 'Pegadinhas', value: 68, base: 'pranks' }
      ],
      'horror': [
        { keyword: 'Filmes de terror 2024', value: 82, base: 'terror' },
        { keyword: 'Histórias assombradas', value: 76, base: 'assombracao' },
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
      'comedy': ['#funny', '#humor', '#risos', '#comedia'],
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