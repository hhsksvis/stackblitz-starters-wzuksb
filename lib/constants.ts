import { GenerationConfig, SafetySetting } from './types';

export const GENERATION_CONFIG: GenerationConfig = {
  temperature: 1.15,
  topP: 0.95,
  topK: 55,
  maxOutputTokens: 2000000,
  responseMimeType: "text/plain",
};

export const SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

export const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
export const MODEL_NAME = "gemini-1.5-pro-exp-0801";