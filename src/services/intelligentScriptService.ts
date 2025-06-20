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
        `Personagem tropeça e derruba algo enquanto fala sobre ${trendKeyword}`,
        `Personagem finge não saber sobre ${trendKeyword} mas depois revela conhecimento profundo`,
        `Personagem começa fazendo algo totalmente diferente mas conecta com ${trendKeyword}`,
        `Personagem reage de forma exagerada ao descobrir ${trendKeyword}`,
        `Personagem faz uma previsão "errada" sobre ${trendKeyword} que depois se revela genial`
      ],
      comedy: [
        `Personagem tenta imitar ${trendKeyword} mas falha de forma hilária`,
        `Personagem confunde ${trendKeyword} com algo completamente diferente`,
        `Personagem faz uma piada ruim sobre ${trendKeyword} mas insiste que é engraçada`,
        `Personagem tenta ser sério sobre ${trendKeyword} mas situações cômicas acontecem`,
        `Personagem imita diferentes pessoas reagindo a ${trendKeyword}`
      ],
      horror: [
        `Personagem encontra algo perturbador relacionado a ${trendKeyword}`,
        `Personagem ouve ruídos estranhos enquanto pesquisa ${trendKeyword}`,
        `Personagem descobre uma verdade sombria sobre ${trendKeyword}`,
        `Personagem é perseguido por algo ligado a ${trendKeyword}`,
        `Personagem tem pesadelos envolvendo ${trendKeyword}`
      ]
    };
    
    const strategies = hookStrategies[contentType as keyof typeof hookStrategies] || hookStrategies.trending;
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  private createNarrativeStructure(character: any, trend: any, contentType: string, duration: number, hookStrategy: string) {
    const blockCount = Math.ceil(duration / 8);
    
    const narrativeTemplates = {
      trending: {
        setup: `${character.name} descobre a tendência "${trend.keyword}" de forma inesperada`,
        conflict: `Algo dá errado ou ${character.name} tem uma reação única à tendência`,
        resolution: `${character.name} domina a tendência e mostra como aproveitá-la`,
        cta: `Convida o público a participar da tendência`
      },
      comedy: {
        setup: `${character.name} tenta entender "${trend.keyword}" mas de forma hilária`,
        conflict: `Situações cômicas se acumulam enquanto ${character.name} explora o tema`,
        resolution: `${character.name} finalmente "entende" mas de forma ainda mais engraçada`,
        cta: `Desafia o público a tentar fazer melhor`
      },
      horror: {
        setup: `${character.name} investiga algo perturbador sobre "${trend.keyword}"`,
        conflict: `A situação se torna cada vez mais assustadora e misteriosa`,
        resolution: `${character.name} revela uma verdade chocante ou escapa por pouco`,
        cta: `Avisa o público sobre os perigos ou mistérios`
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
    const sceneTemplates = {
      'hook-setup': [
        `${narrative.hookStrategy}. A cena começa de forma inesperada para capturar atenção imediata.`,
        `Abertura impactante: personagem em situação inusitada relacionada a "${trend.keyword}".`,
        `Hook visual forte: algo quebra o padrão normal e prende o viewer nos primeiros 2 segundos.`
      ],
      'conflict': [
        `O conflito se intensifica. Personagem enfrenta desafio relacionado à tendência "${trend.keyword}".`,
        `Momento de tensão: as coisas não saem como esperado com "${trend.keyword}".`,
        `Complicação narrativa que mantém o público engajado e curioso.`
      ],
      'development': [
        `Desenvolvimento da história. Personagem explora mais profundamente "${trend.keyword}".`,
        `Revelações importantes sobre a tendência e como ela impacta o personagem.`,
        `Construção emocional que conecta o público com a jornada do personagem.`
      ],
      'resolution-cta': [
        `Resolução satisfatória. Personagem domina "${trend.keyword}" e convida participação.`,
        `Conclusão impactante com call-to-action claro para o público.`,
        `Final que incentiva engajamento e compartilhamento do conteúdo.`
      ]
    };
    
    const templates = sceneTemplates[paceElement as keyof typeof sceneTemplates] || sceneTemplates['hook-setup'];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateCharacterDirection(character: any, blockNumber: number, narrative: any, trend: any): string {
    // Detectar idioma do personagem
    const audioLanguage = character.personality.match(/Audio Language:\s*([a-z-A-Z]+)/)?.[1] || 'pt-BR';
    
    // Traduzir prompt do personagem para o idioma correto
    const characterPrompt = this.translateCharacterPrompt(character.visual_prompt, audioLanguage);
    
    const baseDirection = `${characterPrompt}. CONSISTÊNCIA VISUAL: Manter exatamente a mesma aparência em todos os blocos.`;
    
    const emotionalJourney = {
      1: 'Expressão de surpresa e curiosidade inicial',
      2: 'Demonstra envolvimento crescente e determinação', 
      3: 'Mostra confiança e domínio do assunto',
      4: 'Expressa entusiasmo e convida participação'
    };
    
    const emotion = emotionalJourney[blockNumber as keyof typeof emotionalJourney] || 'Mantém energia positiva e engajamento';
    
    return `${baseDirection} ${emotion}. Personagem deve ser carismático e autêntico ao abordar "${trend.keyword}".`;
  }

  private generateCameraWork(blockNumber: number, totalBlocks: number, paceElement: string): string {
    const cameraStyles = {
      'hook-setup': [
        'Close-up dramático no rosto, 35mm, movimento de push-in rápido para criar impacto imediato',
        'Plano médio com zoom súbito, handheld para energia, foco na reação inicial do personagem',
        'Ângulo holandês para criar tensão, movimento de câmera dinâmico para quebrar expectativas'
      ],
      'conflict': [
        'Plano americano com movimento de tracking lateral, 50mm, seguindo a ação do personagem',
        'Câmera na mão com cortes rápidos, múltiplos ângulos para intensificar o conflito',
        'Plano sequência com zoom-out revelando o contexto completo da situação'
      ],
      'development': [
        'Plano médio estável, 35mm, movimento suave de dolly para acompanhar o desenvolvimento',
        'Intercala close-ups e planos gerais, ritmo mais calmo para absorção de informações',
        'Câmera fixa com foco rack para destacar elementos importantes da tendência'
      ],
      'resolution-cta': [
        'Wide shot para mostrar resultado final, movimento de crane-up para impacto visual',
        'Close-up final no personagem, 85mm, estabilizado para criar conexão com o público',
        'Plano médio com movimento circular, destacando o call-to-action e engajamento'
      ]
    };
    
    const styles = cameraStyles[paceElement as keyof typeof cameraStyles] || cameraStyles['hook-setup'];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private generateSetting(blockNumber: number, narrative: any, trend: any): string {
    return `Ambiente vibrante e otimizado para TikTok, com iluminação profissional que destaca o personagem. Cenário relacionado a "${trend.keyword}" quando relevante, mantendo alta qualidade visual em todos os ${narrative.blockCount} blocos.`;
  }

  private generateLighting(blockNumber: number, totalBlocks: number, paceElement: string): string {
    const lightingMoods = {
      'hook-setup': 'Iluminação dramática com contraste alto, luz principal forte para criar impacto visual imediato',
      'conflict': 'Lighting dinâmico com mudanças sutis, sombras estratégicas para intensificar a tensão',
      'development': 'Iluminação equilibrada e profissional, três pontos clássicos para clareza visual',
      'resolution-cta': 'Luz brilhante e otimista, rim lighting para destacar o personagem e criar energia positiva'
    };
    
    return lightingMoods[paceElement as keyof typeof lightingMoods] || lightingMoods['hook-setup'];
  }

  private generateAudioDirection(character: any, blockNumber: number, narrative: any, trend: any): string {
    const audioLanguage = character.personality.match(/Audio Language:\s*([a-z-A-Z]+)/)?.[1] || 'pt-BR';
    const languageName = this.getLanguageName(audioLanguage);
    
    // Falas mais curtas e diretas para caber em 8 segundos
    const audioTemplates = {
      'pt-BR': {
        1: `"${character.name}: Gente! ${trend.keyword} está viral!" Voz em ${languageName} com energia alta. Som: música trending.`,
        2: `"${character.name}: Olha isso! Mudou tudo!" Voz em ${languageName} com suspense. Efeitos sonoros.`,
        3: `"${character.name}: A verdade sobre ${trend.keyword}!" Voz em ${languageName} confiante. Música intensificando.`,
        4: `"${character.name}: Tenta aí! Marca os amigos!" Voz em ${languageName} com call-to-action. Som final viral.`
      },
      'en-US': {
        1: `"${character.name}: Guys! ${trend.keyword} is trending!" Voice in ${languageName} with high energy. Sound: trending music.`,
        2: `"${character.name}: Look at this! Everything changed!" Voice in ${languageName} with suspense. Sound effects.`,
        3: `"${character.name}: The truth about ${trend.keyword}!" Voice in ${languageName} confident. Music intensifying.`,
        4: `"${character.name}: Try it! Tag your friends!" Voice in ${languageName} with call-to-action. Viral ending sound.`
      }
    };
    
    const templates = audioTemplates[audioLanguage as keyof typeof audioTemplates] || audioTemplates['pt-BR'];
    return templates[blockNumber as keyof typeof templates] || templates[1];
  }

  private generateTransition(blockNumber: number, totalBlocks: number): string {
    const transitions = [
      'Corte rápido com efeito de zoom, sincronizado com beat da música',
      'Transição de swipe com overlay de hashtag da tendência',
      'Freeze frame com texto overlay, seguido de jump cut dinâmico',
      'Efeito de glitch moderno com elementos visuais da tendência',
      'Speed ramp dramático com mudança de ângulo de câmera'
    ];
    
    return transitions[Math.floor(Math.random() * transitions.length)];
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
    if (targetLanguage === 'pt-BR') {
      // Se for português, traduzir prompt em inglês para português
      return visualPrompt
        .replace(/A Brazilian female influencer/g, 'Uma influenciadora brasileira')
        .replace(/years old/g, 'anos de idade')
        .replace(/with morena \(brown\) skin tone/g, 'com tom de pele moreno')
        .replace(/voluminous, well-defined curly hair/g, 'cabelo cacheado volumoso e bem definido')
        .replace(/natural products/g, 'produtos naturais')
        .replace(/Oval face with expressive brown eyes/g, 'Rosto oval com olhos castanhos expressivos')
        .replace(/long curved eyelashes/g, 'cílios longos e curvados')
        .replace(/proportional nose/g, 'nariz proporcional')
        .replace(/full, well-defined lips/g, 'lábios cheios e bem definidos')
        .replace(/well-applied but natural/g, 'bem aplicada mas natural')
        .replace(/earthy eyeshadows/g, 'sombras terrosas')
        .replace(/soft blush/g, 'blush suave')
        .replace(/neutral or vibrant lipsticks/g, 'batons neutros ou vibrantes')
        .replace(/complement her skin tone/g, 'complementam seu tom de pele')
        .replace(/Height 1\.70m/g, 'Altura 1,70m')
        .replace(/healthy, proportional body/g, 'corpo saudável e proporcional')
        .replace(/soft curves/g, 'curvas suaves')
        .replace(/neither too thin nor unrealistic/g, 'nem muito magra nem irrealista')
        .replace(/confident posture/g, 'postura confiante')
        .replace(/natural imperfections/g, 'imperfeições naturais')
        .replace(/occasional acne or cellulite/g, 'acne ocasional ou celulite')
        .replace(/comfortable yet stylish/g, 'confortável mas estiloso')
        .replace(/high-waisted jeans/g, 'calças jeans cintura alta')
        .replace(/light colorful blouses/g, 'blusas coloridas leves')
        .replace(/discrete accessories/g, 'acessórios discretos')
        .replace(/small earrings or simple necklaces/g, 'brincos pequenos ou colares simples')
        .replace(/authenticity and relatability/g, 'autenticidade e identificação')
        .replace(/Brazilian ethnic diversity/g, 'diversidade étnica brasileira')
        .replace(/real and approachable/g, 'real e acessível')
        .replace(/excessive glamour/g, 'glamour excessivo')
        .replace(/natural beauty/g, 'beleza natural')
        .replace(/traditional straight blonde standards/g, 'padrões tradicionais loiros e lisos')
        .replace(/multicultural Brazilian beauty/g, 'beleza brasileira multicultural')
        .replace(/realistic health representation/g, 'representação realista de saúde');
    }
    
    // Se for inglês ou outro idioma, manter original
    return visualPrompt;
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