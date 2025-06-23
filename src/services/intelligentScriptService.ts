import { TrendsService } from './trendsService';
import { VideoBlock } from '@/types/database';

interface ScriptGenerationParams {
  character: any;
  duration: number;
  contentType: string;
  country: string;
  customTopic?: string;
}

interface GeneratedScript {
  title: string;
  blocks: VideoBlock[];
  hashtags: {
    tiktok: string[];
    instagram: string[];
    youtube: string[];
  };
  trendingTopic: string;
  hookStrategy: string;
}

export class IntelligentScriptService {
  private trendsService: TrendsService;
  
  constructor() {
    this.trendsService = TrendsService.getInstance();
  }

  async generateIntelligentScript(params: ScriptGenerationParams): Promise<GeneratedScript> {
    console.log('🚀 Iniciando geração inteligente de roteiro...');
    
    // VALIDAÇÃO INICIAL
    if (params.contentType === 'custom' && !params.customTopic) {
      throw new Error('Tema personalizado é obrigatório quando contentType é "custom"');
    }
    
    let mainTrend: any;
    let trendingTopic: string;
    
    if (params.customTopic && params.contentType === 'custom') {
      // MODO CUSTOMIZADO: Usar tema personalizado + tendência relacionada
      console.log(`🎯 Modo customizado: ${params.customTopic}`);
      
      // Buscar tendências para enriquecer o tema customizado
      const trends = await this.trendsService.getCurrentTrends(params.country, 'trending');
      const relatedTrend = trends[0] || { keyword: 'viral', relatedQueries: [], hashtags: [] };
      
      // Criar tema híbrido: customTopic + elementos da tendência
      mainTrend = {
        keyword: params.customTopic,
        relatedQueries: [
          ...this.generateCustomQueries(params.customTopic),
          ...relatedTrend.relatedQueries.slice(0, 3)
        ],
        hashtags: [
          ...this.generateCustomHashtags(params.customTopic),
          ...relatedTrend.hashtags.slice(0, 3)
        ]
      };
      
      trendingTopic = params.customTopic;
      console.log(`📈 Tema customizado: ${trendingTopic} (enriquecido com ${relatedTrend.keyword})`);
      
      // VALIDAÇÃO: Verificar se o tema foi aplicado corretamente
      if (!trendingTopic.toLowerCase().includes(params.customTopic.toLowerCase())) {
        console.warn('⚠️ Aviso: Tema customizado pode não ter sido aplicado corretamente');
      }
    } else {
      // MODO TRENDING: Usar tendência real do Google Trends
      const trends = await this.trendsService.getCurrentTrends(params.country, params.contentType);
      mainTrend = trends[0] || { keyword: 'Tendência viral', relatedQueries: [], hashtags: [] };
      trendingTopic = mainTrend.keyword;
      console.log(`📈 Tendência principal: ${trendingTopic}`);
    }
    
    // FASE 2: Gerar hook envolvente
    const hookStrategy = this.generateHookStrategy(params.contentType, trendingTopic);
    
    // FASE 3: Criar estrutura narrativa
    const narrative = this.createNarrativeStructure(
      params.character,
      mainTrend,
      params.contentType,
      params.duration,
      hookStrategy
    );
    
    // FASE 4: Gerar blocos detalhados
    const blocks = this.generateDetailedBlocks(
      narrative,
      params.character,
      params.duration,
      mainTrend
    );
    
    // VALIDAÇÃO DOS BLOCOS
    this.validateBlocks(blocks, trendingTopic, params.customTopic);
    
    // FASE 5: Otimizar hashtags
    const hashtags = this.trendsService.generateOptimizedHashtags(
      trendingTopic,
      mainTrend.relatedQueries,
      params.country,
      params.contentType
    );
    
    // FASE 6: Criar título viral
    const title = this.generateViralTitle(
      params.character.name,
      trendingTopic,
      params.contentType
    );
    
    // VALIDAÇÃO FINAL
    const result = {
      title,
      blocks,
      hashtags,
      trendingTopic,
      hookStrategy
    };
    
    this.validateFinalResult(result, params);
    
    console.log('✅ Roteiro inteligente gerado com sucesso!');
    
    return result;
  }

  private generateHookStrategy(contentType: string, trendKeyword: string): string {
    const hookStrategies = {
      trending: [
        `Character stumbles and drops something while talking about ${trendKeyword}`,
        `Character pretends not to know about ${trendKeyword} but then reveals deep knowledge`,
        `Character starts doing something completely different but connects it with ${trendKeyword}`,
        `Character reacts exaggeratedly to discovering ${trendKeyword}`,
        `Character makes a "wrong" prediction about ${trendKeyword} that later proves genius`
      ],
      comedy: [
        `Character tries to imitate ${trendKeyword} but fails hilariously`,
        `Character confuses ${trendKeyword} with something completely different`,
        `Character makes a bad joke about ${trendKeyword} but insists it's funny`,
        `Character tries to be serious about ${trendKeyword} but comedic situations happen`,
        `Character imitates different people reacting to ${trendKeyword}`
      ],
      horror: [
        `Character finds something disturbing related to ${trendKeyword}`,
        `Character hears strange noises while researching ${trendKeyword}`,
        `Character discovers a dark truth about ${trendKeyword}`,
        `Character is pursued by something linked to ${trendKeyword}`,
        `Character has nightmares involving ${trendKeyword}`
      ]
    };
    
    const strategies = hookStrategies[contentType as keyof typeof hookStrategies] || hookStrategies.trending;
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  private createNarrativeStructure(character: any, trend: any, contentType: string, duration: number, hookStrategy: string) {
    const blockCount = Math.ceil(duration / 8);
    
    const narrativeTemplates = {
      trending: {
        setup: `${character.name} discovers the trend "${trend.keyword}" unexpectedly`,
        conflict: `Something goes wrong or ${character.name} has a unique reaction to the trend`,
        resolution: `${character.name} masters the trend and shows how to take advantage of it`,
        cta: `Invites the audience to participate in the trend`
      },
      comedy: {
        setup: `${character.name} tries to understand "${trend.keyword}" but in a hilarious way`,
        conflict: `Comic situations accumulate while ${character.name} explores the topic`,
        resolution: `${character.name} finally "understands" but in an even funnier way`,
        cta: `Challenges the audience to try to do better`
      },
      horror: {
        setup: `${character.name} investigates something disturbing about "${trend.keyword}"`,
        conflict: `The situation becomes increasingly scary and mysterious`,
        resolution: `${character.name} reveals a shocking truth or barely escapes`,
        cta: `Warns the audience about dangers or mysteries`
      }
    };
    
    const template = narrativeTemplates[contentType as keyof typeof narrativeTemplates] || narrativeTemplates.trending;
    
    return {
      hookStrategy,
      blockCount,
      template,
      pacing: this.calculatePacing(duration, blockCount)
    };
  }

  private calculatePacing(duration: number, blockCount: number): string[] {
    const blockDuration = duration / blockCount;
    
    if (blockCount === 1) {
      return ['hook-conflict-resolution'];
    } else if (blockCount === 2) {
      return ['hook-setup', 'conflict-resolution'];
    } else if (blockCount === 3) {
      return ['hook-setup', 'conflict-development', 'resolution-cta'];
    } else {
      return ['hook-setup', 'conflict', 'development', 'resolution-cta'];
    }
  }

  private generateDetailedBlocks(narrative: any, character: any, duration: number, trend: any): VideoBlock[] {
    const blocks: VideoBlock[] = [];
    const blockDuration = Math.ceil(duration / narrative.blockCount);
    
    for (let i = 1; i <= narrative.blockCount; i++) {
      const timeRange = `${(i-1) * blockDuration}-${i * blockDuration}s`;
      const paceElement = narrative.pacing[Math.min(i-1, narrative.pacing.length-1)];
      
      blocks.push({
        number: i,
        duration: timeRange,
        scene: this.generateSceneDescription(i, narrative, trend, paceElement),
        character: this.generateCharacterDirection(character, i, narrative, trend),
        camera: this.generateCameraWork(i, narrative.blockCount, paceElement),
        setting: this.generateSetting(i, narrative, trend),
        lighting: this.generateLighting(i, narrative.blockCount, paceElement),
        audio: this.generateAudioDirection(character, i, narrative, trend),
        transition: i < narrative.blockCount ? this.generateTransition(i, narrative.blockCount) : undefined
      });
    }
    
    return blocks;
  }

  private generateSceneDescription(blockNumber: number, narrative: any, trend: any, paceElement: string): string {
    const continuousSceneTemplates = {
      'hook-setup': [
        `Opening scene: Character begins discussing ${trend.keyword} with genuine curiosity and excitement. Natural conversation starter that hooks viewers immediately.`,
        `Introduction moment: Character starts sharing their experience with ${trend.keyword} in an authentic, relatable way that draws audience attention.`,
        `Engaging opener: Character begins revealing something surprising about ${trend.keyword} with natural enthusiasm and energy.`
      ],
      'conflict': [
        `Continuation: Character develops their story about ${trend.keyword}, building anticipation and maintaining viewer engagement through authentic reaction.`,
        `Story development: Character shares more details about their ${trend.keyword} experience, keeping the narrative flowing naturally and emotionally.`,
        `Building tension: Character continues their revelation about ${trend.keyword}, escalating excitement and maintaining authentic conversation flow.`
      ],
      'development': [
        `Story progression: Character deepens their explanation about ${trend.keyword}, maintaining natural conversation rhythm and viewer connection.`,
        `Narrative expansion: Character provides more context about ${trend.keyword}, keeping dialogue authentic and emotionally engaging.`,
        `Content development: Character elaborates on their ${trend.keyword} discovery, sustaining natural conversation flow and audience interest.`
      ],
      'resolution-cta': [
        `Conclusion and invitation: Character wraps up their ${trend.keyword} story and naturally invites audience participation with authentic enthusiasm.`,
        `Final revelation and call-to-action: Character completes their ${trend.keyword} narrative and encourages viewer engagement in natural way.`,
        `Story conclusion with engagement: Character finishes sharing about ${trend.keyword} and motivates audience action through genuine excitement.`
      ]
    };
    
    const templates = continuousSceneTemplates[paceElement as keyof typeof continuousSceneTemplates] || continuousSceneTemplates['hook-setup'];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateCharacterDirection(character: any, blockNumber: number, narrative: any, trend: any): string {
    // Detectar idioma do personagem
    const audioLanguage = character.personality.match(/Audio Language:\s*([a-z-A-Z]+)/)?.[1] || 'pt-BR';
    
    // SEMPRE usar prompt em inglês para VEO3
    const characterPrompt = this.translateCharacterPrompt(character.visual_prompt, audioLanguage);
    
    const baseDirection = `${characterPrompt}. VISUAL CONSISTENCY: Maintain exactly the same appearance across all blocks.`;
    
    const emotionalJourney = {
      1: 'Expression of surprise and initial curiosity',
      2: 'Shows growing involvement and determination', 
      3: 'Shows confidence and mastery of the subject',
      4: 'Expresses enthusiasm and invites participation'
    };
    
    const emotion = emotionalJourney[blockNumber as keyof typeof emotionalJourney] || 'Maintains positive energy and engagement';
    
    return `${baseDirection} ${emotion}. Character should be charismatic and authentic when addressing "${trend.keyword}".`;
  }

  private generateCameraWork(blockNumber: number, totalBlocks: number, paceElement: string): string {
    const conversationalCameraStyles = {
      'hook-setup': [
        'Medium close-up, 35mm, character looks directly at camera with natural eye contact and engaging expression',
        'Frontal medium shot, 50mm, character positioned naturally as if speaking directly to viewer with authentic energy',
        'Comfortable close-up, 35mm, character maintains natural posture while delivering opening dialogue with genuine enthusiasm'
      ],
      'conflict': [
        'Slight angle change to medium shot, 35mm, character turns naturally toward new camera position continuing conversation flow',
        'Side angle medium close-up, 50mm, character repositions naturally as if switching conversation direction while maintaining engagement',
        'Three-quarter view, 35mm, character adjusts to new camera angle seamlessly, continuing dialogue with natural body language'
      ],
      'development': [
        'Return to frontal position, 35mm, character faces camera directly again as conversation develops naturally and authentically',
        'Medium shot from slightly higher angle, 50mm, character looks up naturally while continuing story progression with confidence',
        'Closer medium shot, 35mm, character leans in slightly toward camera creating intimacy while maintaining conversational flow'
      ],
      'resolution-cta': [
        'Final frontal close-up, 35mm, character makes direct eye contact for call-to-action with natural confidence and enthusiasm',
        'Engaging medium close-up, 50mm, character positioned for optimal viewer connection during final message and invitation',
        'Direct address position, 35mm, character faces camera straight-on for authentic final appeal and audience engagement'
      ]
    };
    
    const styles = conversationalCameraStyles[paceElement as keyof typeof conversationalCameraStyles] || conversationalCameraStyles['hook-setup'];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private generateSetting(blockNumber: number, narrative: any, trend: any): string {
    return `Vibrant TikTok-optimized environment with professional lighting that highlights the character. Setting related to "${trend.keyword}" when relevant, maintaining high visual quality across all ${narrative.blockCount} blocks.`;
  }

  private generateLighting(blockNumber: number, totalBlocks: number, paceElement: string): string {
    const lightingMoods = {
      'hook-setup': 'Dramatic lighting with high contrast, strong key light to create immediate visual impact',
      'conflict': 'Dynamic lighting with subtle changes, strategic shadows to intensify tension',
      'development': 'Balanced professional lighting, classic three-point setup for visual clarity',
      'resolution-cta': 'Bright optimistic light, rim lighting to highlight character and create positive energy'
    };
    
    return lightingMoods[paceElement as keyof typeof lightingMoods] || lightingMoods['hook-setup'];
  }

  private generateAudioDirection(character: any, blockNumber: number, narrative: any, trend: any): string {
    const audioLanguage = character.personality.match(/Audio Language:\s*([a-z-A-Z]+)/)?.[1] || 'pt-BR';
    const languageName = this.getLanguageName(audioLanguage);
    
    // NOVA ESTRUTURA: Diálogo contínuo e fluido entre blocos
    // Como se fosse uma conversa única com cortes de câmera
    const audioTemplates = {
      'pt-BR': {
        1: `"${character.name}: Gente, vocês viram que ${trend.keyword} está bombando? Eu testei e..." Voz em ${languageName} com energia crescente e curiosidade. Som de fundo: música trending suave.`,
        2: `"${character.name}: ...não acreditei no resultado! Olha só isso aqui, mudou completamente..." Voz em ${languageName} com empolgação e surpresa genuína. Música intensificando gradualmente.`,
        3: `"${character.name}: ...a forma como eu vejo ${trend.keyword}! Vocês precisam testar isso!" Voz em ${languageName} confiante e convida ação. Música no pico com call-to-action.`,
        4: `"${character.name}: Marca seus amigos que precisam ver isso! Link na bio!" Voz em ${languageName} energética com urgência. Som final de impacto.`
      },
      'en-US': {
        1: `"${character.name}: Guys, have you seen that ${trend.keyword} is trending? I tried it and..." Voice in ${languageName} with growing energy and curiosity. Background: soft trending music.`,
        2: `"${character.name}: ...I couldn't believe the results! Look at this, it completely changed..." Voice in ${languageName} with excitement and genuine surprise. Music gradually intensifying.`,
        3: `"${character.name}: ...the way I see ${trend.keyword}! You guys need to try this!" Voice in ${languageName} confident and inviting action. Music at peak with call-to-action.`,
        4: `"${character.name}: Tag your friends who need to see this! Link in bio!" Voice in ${languageName} energetic with urgency. Final impact sound.`
      }
    };
    
    const templates = audioTemplates[audioLanguage as keyof typeof audioTemplates] || audioTemplates['pt-BR'];
    return templates[blockNumber as keyof typeof templates] || templates[1];
  }

  private generateTransition(blockNumber: number, totalBlocks: number): string {
    // NOVA ABORDAGEM: Apenas cortes de câmera simples
    // Sem efeitos visuais que consomem tempo de fala
    const cameraTransitions = [
      'Cut to different camera angle - character continues speaking naturally',
      'Quick camera angle change - seamless dialogue continuation',
      'Camera repositioning - character maintains eye contact with new angle',
      'Simple cut - character looks toward new camera position',
      'Angle switch - natural conversation flow continues'
    ];
    
    return cameraTransitions[Math.floor(Math.random() * cameraTransitions.length)];
  }

  private generateViralTitle(characterName: string, trendKeyword: string, contentType: string): string {
    const titleTemplates = {
      trending: [
        `${characterName} e a Verdade Sobre ${trendKeyword} Que Ninguém Te Conta! 🔥`,
        `${characterName} Descobriu ${trendKeyword} e Isso Mudou Tudo! 😱`,
        `O Que ${characterName} Fez Com ${trendKeyword} Vai Te Surpreender! ⚡`,
        `${characterName}: ${trendKeyword} - A Tendência Que Está Bombando! 🚀`
      ],
      comedy: [
        `${characterName} Tentou ${trendKeyword} e Olha No Que Deu! 😂`,
        `${characterName}: Como NÃO Fazer ${trendKeyword} (Muito Engraçado!) 🤣`,
        `${characterName} e o Fail Épico Com ${trendKeyword}! 😭`,
        `${characterName} vs ${trendKeyword}: Quem Vence? (Spoiler: Ninguém!) 🤪`
      ],
      horror: [
        `${characterName} Descobriu o Lado Sombrio de ${trendKeyword}... 😰`,
        `${characterName}: O Que ${trendKeyword} Esconde Vai Te Assustar! 👻`,
        `${characterName} e o Mistério Por Trás de ${trendKeyword}! 🌙`,
        `${characterName}: ${trendKeyword} - A Verdade Que Te Dará Pesadelos! 💀`
      ]
    };
    
    const templates = titleTemplates[contentType as keyof typeof titleTemplates] || titleTemplates.trending;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private getLanguageName(code: string): string {
    const names: Record<string, string> = {
      'pt-BR': 'Português Brasileiro',
      'en-US': 'English',
      'es-ES': 'Español',
      'es-MX': 'Español Mexicano',
      'fr-FR': 'Français'
    };
    return names[code] || 'Português';
  }

  // Novo método: Gerar queries relacionadas para temas customizados
  private generateCustomQueries(customTopic: string): string[] {
    const topicWords = customTopic.toLowerCase().split(' ');
    const queries: string[] = [];
    
    // Queries baseadas no tema
    queries.push(
      `${customTopic} viral`,
      `${customTopic} tutorial`,
      `${customTopic} dicas`,
      `como fazer ${customTopic}`,
      `${customTopic} 2025`
    );
    
    // Queries baseadas em palavras-chave do tema
    topicWords.forEach(word => {
      if (word.length > 3) {
        queries.push(`${word} trending`, `${word} viral`);
      }
    });
    
    return queries.slice(0, 8);
  }

  // Novo método: Gerar hashtags para temas customizados
  private generateCustomHashtags(customTopic: string): string[] {
    const hashtags: string[] = [];
    const cleanTopic = customTopic.replace(/[^a-zA-Z0-9\s]/g, '');
    
    // Hashtag principal
    hashtags.push(`#${cleanTopic.replace(/\s+/g, '').toLowerCase()}`);
    
    // Hashtags por palavra
    const words = cleanTopic.split(' ');
    words.forEach(word => {
      if (word.length > 3) {
        hashtags.push(`#${word.toLowerCase()}`);
      }
    });
    
    // Hashtags genéricas relevantes
    hashtags.push('#tutorial', '#dicas', '#viral', '#fyp');
    
    return hashtags.slice(0, 8);
  }

  // Novo método: Traduzir prompt do personagem
  private translateCharacterPrompt(visualPrompt: string, targetLanguage: string): string {
    // SEMPRE retornar prompt em INGLÊS para VEO3, independente do idioma do áudio
    // O áudio será tratado separadamente no generateAudioDirection
    
    // Se o prompt já estiver em inglês, manter
    if (!this.hasPortugueseText(visualPrompt)) {
      return visualPrompt;
    }
    
    // Se estiver em português, traduzir para inglês
    return visualPrompt
      .replace(/Uma influenciadora brasileira/g, 'A Brazilian female influencer')
      .replace(/anos de idade/g, 'years old')
      .replace(/com tom de pele moreno/g, 'with brown skin tone')
      .replace(/cabelo cacheado volumoso e bem definido/g, 'voluminous, well-defined curly hair')
      .replace(/produtos naturais/g, 'natural products')
      .replace(/Rosto oval com olhos castanhos expressivos/g, 'Oval face with expressive brown eyes')
      .replace(/cílios longos e curvados/g, 'long curved eyelashes')
      .replace(/nariz proporcional/g, 'proportional nose')
      .replace(/lábios cheios e bem definidos/g, 'full, well-defined lips')
      .replace(/bem aplicada mas natural/g, 'well-applied but natural')
      .replace(/sombras terrosas/g, 'earthy eyeshadows')
      .replace(/blush suave/g, 'soft blush')
      .replace(/batons neutros ou vibrantes/g, 'neutral or vibrant lipsticks')
      .replace(/complementam seu tom de pele/g, 'complement her skin tone')
      .replace(/Altura 1,70m/g, 'Height 1.70m')
      .replace(/corpo saudável e proporcional/g, 'healthy, proportional body')
      .replace(/curvas suaves/g, 'soft curves')
      .replace(/nem muito magra nem irrealista/g, 'neither too thin nor unrealistic')
      .replace(/postura confiante/g, 'confident posture')
      .replace(/imperfeições naturais/g, 'natural imperfections')
      .replace(/acne ocasional ou celulite/g, 'occasional acne or cellulite')
      .replace(/confortável mas estiloso/g, 'comfortable yet stylish')
      .replace(/calças jeans cintura alta/g, 'high-waisted jeans')
      .replace(/blusas coloridas leves/g, 'light colorful blouses')
      .replace(/acessórios discretos/g, 'discrete accessories')
      .replace(/brincos pequenos ou colares simples/g, 'small earrings or simple necklaces')
      .replace(/autenticidade e identificação/g, 'authenticity and relatability')
      .replace(/diversidade étnica brasileira/g, 'Brazilian ethnic diversity')
      .replace(/real e acessível/g, 'real and approachable')
      .replace(/glamour excessivo/g, 'excessive glamour')
      .replace(/beleza natural/g, 'natural beauty')
      .replace(/padrões tradicionais loiros e lisos/g, 'traditional straight blonde standards')
      .replace(/beleza brasileira multicultural/g, 'multicultural Brazilian beauty')
      .replace(/representação realista de saúde/g, 'realistic health representation')
      .replace(/She has/g, 'She has')
      .replace(/Her makeup is/g, 'Her makeup is')
      .replace(/Her style is/g, 'Her style is')
      .replace(/She displays/g, 'She displays')
      .replace(/She embodies/g, 'She embodies')
      .replace(/The character should appear/g, 'The character should appear')
      .replace(/featuring/g, 'featuring')
      .replace(/while showing/g, 'while showing')
      .replace(/treated with/g, 'treated with')
      .replace(/and/g, 'and')
      .replace(/that/g, 'that')
      .replace(/with a/g, 'with a')
      .replace(/Focus on/g, 'Focus on')
      .replace(/representing/g, 'representing')
      .replace(/showcasing/g, 'showcasing')
      .replace(/avoiding/g, 'avoiding')
      .replace(/breaks away from/g, 'breaks away from');
  }

  // Método auxiliar para detectar texto em português
  private hasPortugueseText(text: string): boolean {
    // Detecta caracteres específicos do português e palavras comuns
    const portuguesePatterns = [
      /[ãõáéíóúâêîôûàèìòùç]/i, // Acentos portugueses
      /\b(uma|com|anos|idade|cabelo|rosto|altura|corpo|estilo|beleza)\b/i, // Palavras comuns em português
      /\b(brasileira|moreno|cacheado|definido|naturais|expressivos)\b/i // Palavras específicas
    ];
    
    return portuguesePatterns.some(pattern => pattern.test(text));
  }

  // Novo método: Validar blocos gerados
  private validateBlocks(blocks: VideoBlock[], trendingTopic: string, customTopic?: string): void {
    blocks.forEach((block, index) => {
      // Validar se o tema está presente no audio
      const audioLower = block.audio.toLowerCase();
      const topicLower = trendingTopic.toLowerCase();
      
      if (!audioLower.includes(topicLower) && customTopic) {
        console.warn(`⚠️ Bloco ${index + 1}: Tema "${trendingTopic}" não encontrado no áudio`);
      }
      
      // Validar duração da fala (aproximada)
      const speechText = block.audio.match(/"([^"]+)"/)?.[1] || '';
      const wordCount = speechText.split(' ').length;
      if (wordCount > 12) {
        console.warn(`⚠️ Bloco ${index + 1}: Fala muito longa (${wordCount} palavras) para 8 segundos`);
      }
      
      // Validar consistência de idioma
      const hasPortuguese = /[ãõáéíóúâêîôûàèìòùç]/i.test(block.character);
      const hasEnglish = /\b(with|and|the|of|in|a|an)\b/i.test(block.character);
      
      if (hasPortuguese && hasEnglish) {
        console.warn(`⚠️ Bloco ${index + 1}: Prompt multilíngue detectado - pode confundir VEO3`);
      }
    });
  }

  // Novo método: Validar resultado final
  private validateFinalResult(result: GeneratedScript, params: ScriptGenerationParams): void {
    // Validar se tema customizado foi usado
    if (params.customTopic && params.contentType === 'custom') {
      const titleHasTopic = result.title.toLowerCase().includes(params.customTopic.toLowerCase());
      const trendingTopicMatches = result.trendingTopic.toLowerCase() === params.customTopic.toLowerCase();
      
      if (!titleHasTopic && !trendingTopicMatches) {
        console.error('❌ ERRO CRÍTICO: Tema customizado não foi aplicado no resultado final!');
        console.error(`Esperado: ${params.customTopic}`);
        console.error(`Obtido: ${result.trendingTopic}`);
        throw new Error(`Tema customizado "${params.customTopic}" não foi aplicado corretamente`);
      }
    }
    
    // Validar número de blocos
    const expectedBlocks = Math.ceil(params.duration / 8);
    if (result.blocks.length !== expectedBlocks) {
      console.warn(`⚠️ Número de blocos incorreto: esperado ${expectedBlocks}, obtido ${result.blocks.length}`);
    }
    
    console.log('✅ Validação final passou - roteiro está correto');
  }
} 