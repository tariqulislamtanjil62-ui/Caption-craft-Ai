export type AppLanguage = 'english' | 'bangla' | 'bilingual';

export type AppPlatform = 
  | 'instagram'
  | 'facebook' 
  | 'tiktok' 
  | 'youtube' 
  | 'pinterest' 
  | 'linkedin' 
  | 'twitter' 
  | 'general';

export type AppTone = 
  | 'aesthetic' 
  | 'funny' 
  | 'romantic' 
  | 'professional' 
  | 'motivational';

export type AiProvider = 'gemini' | 'openai';

export type AppTheme = 'dark' | 'light';

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
  base64?: string;
  textContent?: string;
}

export interface CaptionOption {
  id: string;
  style: string;
  text: string;
  hashtags: string[];
  callToAction: string;
  seoTags?: string[];
  pinTitle?: string;
  videoHook?: string;
  isFavorite?: boolean;
  createdAt?: string;
  platform?: AppPlatform;
  language?: AppLanguage;
  tone?: AppTone;
  topic?: string;
  groundedWithSearch?: boolean;
}

export interface DailyQuota {
  usedToday: number;
  maxFree: number;
}

export interface TrendingTopic {
  id: string;
  category: 'Bangladesh' | 'Global' | 'Tech' | 'Fashion' | 'Lifestyle';
  title: string;
  platform: AppPlatform;
  suggestedTone: AppTone;
  tags: string[];
}
