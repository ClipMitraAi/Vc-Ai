export type ModeId =
  | 'normal'
  | 'friend'
  | 'romantic'
  | 'emotional_support'
  | 'work'
  | 'study'
  | 'coding'
  | 'creative'
  | 'research'
  | 'voice'
  | 'focus'
  | 'custom';

export type LanguagePref = 'hinglish' | 'hindi' | 'english' | 'auto';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AssistantAction {
  switchMode?: ModeId;
  createReminder?: {
    title: string;
    datetime: string;
  };
  saveMemory?: {
    text: string;
    category?: MemoryItem['category'];
  };
  generateImage?: {
    prompt: string;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  };
  startFocusTimer?: {
    minutes: number;
  };
  detectedEmotion?: string;
  generatedImageUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  emotionTag?: string;
  groundings?: GroundingSource[];
  imagePreview?: string;
  audioUrl?: string;
  rating?: 'like' | 'dislike';
  action?: AssistantAction;
}

export interface ChatThread {
  id: string;
  title: string;
  mode: ModeId;
  messages: Message[];
  updatedAt: number;
  isPinned?: boolean;
}

export interface UserProfile {
  name: string;
  nickname: string;
  languagePreference: LanguagePref;
  relationshipVibe: string; // e.g. "Sweet & Romantic", "Best Friends", "Mentor & Student", "Professional Partner"
  style: string; // e.g. "Warm & Conversational", "Concise & Direct", "Poetic & Expressive"
  customPersona: string;
}

export interface MemoryItem {
  id: string;
  text: string;
  category: 'preference' | 'personal' | 'goal' | 'favorite';
  createdAt: number;
}

export interface ReminderItem {
  id: string;
  title: string;
  datetime: string;
  completed: boolean;
  notified?: boolean;
}

export interface ModeMeta {
  id: ModeId;
  title: string;
  hindiTitle: string;
  description: string;
  iconName: string;
  badgeColor: string;
  gradient: string;
  placeholder: string;
  quickStarters: string[];
}
