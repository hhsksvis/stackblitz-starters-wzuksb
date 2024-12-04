export interface User {
  username: string;
  token: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatHistory {
  history: ChatMessage[];
  title: string | null;
}

export interface GenerationConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  responseMimeType: string;
}

export interface SafetySetting {
  category: string;
  threshold: string;
}