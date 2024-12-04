import { format } from 'date-fns';
import { ChatMessage } from './types';

export function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(10)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getCurrentDate(): string {
  return format(new Date(), 'EEEE, MMMM d, yyyy');
}

export function formatChatHistory(history: ChatMessage[], username: string): string {
  if (history.length === 0) {
    return "No history found for this section.";
  }

  return history
    .map(msg => {
      const sender = msg.role === 'user' ? username : 'PlaygroundAI';
      return `${sender}: ${msg.content}\n`;
    })
    .join('\n');
}

export function validateUsername(username: string): boolean {
  const lowercased = username.toLowerCase();
  return !lowercased.includes('tlodev') && !lowercased.includes('tlo');
}