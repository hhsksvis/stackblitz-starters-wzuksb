import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';
import { GENERATION_CONFIG, SAFETY_SETTINGS, MODEL_NAME } from './constants';
import { ChatMessage } from './types';

let genAI: GoogleGenerativeAI;
let hf: HfInference;

export function initAI() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  }
  if (!hf) {
    hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
}

export async function generateChatResponse(
  message: string,
  history: ChatMessage[],
  systemInstruction: string
) {
  initAI();
  
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });

  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role,
      parts: [msg.content],
    })),
    generationConfig: GENERATION_CONFIG,
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

export async function generateTitle(firstMessage: string): Promise<string> {
  initAI();
  
  const result = await hf.summarization({
    model: 'facebook/bart-large-cnn',
    inputs: firstMessage,
    parameters: {
      max_length: 30,
      min_length: 10,
      do_sample: false,
    },
  });

  return result.summary_text;
}