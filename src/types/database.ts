
export interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  daily_generations: number;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  name: string;
  visual_prompt: string;
  personality: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  character_id: string;
  title: string;
  duration_seconds: 8 | 16 | 24 | 32 | 40 | 48 | 56 | 60;
  blocks: VideoBlock[];
  hashtags: {
    tiktok: string[];
    instagram: string[];
    youtube: string[];
  };
  country_code: string;
  content_type: 'trending' | 'horror' | 'comedy' | 'custom';
  trending_topic?: string;
  total_views: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface VideoBlock {
  number: number;
  duration: string;
  scene: string;
  character: string;
  camera: string;
  setting: string;
  lighting: string;
  audio: string;
  transition?: string;
}

export interface Metrics {
  id: string;
  video_id: string;
  screenshot_url: string;
  platform: 'tiktok' | 'instagram' | 'youtube' | 'kwai';
  views: number;
  likes: number;
  shares: number;
  comments: number;
  retention_rate: number;
  ai_analysis: {
    strengths: string[];
    improvements: string[];
    patterns: string[];
  };
  improvements_applied: boolean;
  captured_at: string;
}

export interface PromptTemplate {
  id: string;
  user_id: string;
  name: string;
  template: string;
  variables: Record<string, any>;
  is_active: boolean;
  success_rate: number;
  created_at: string;
  updated_at: string;
}
