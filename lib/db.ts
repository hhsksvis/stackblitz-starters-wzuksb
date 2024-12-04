import { kv } from '@vercel/kv';
import { User, ChatHistory } from './types';

export async function getUser(token: string): Promise<User | null> {
  return kv.hget('users', token);
}

export async function createUser(username: string, token: string): Promise<void> {
  await kv.hset('users', { [token]: { username, token } });
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const users = await kv.hgetall('users');
  return Object.values(users).find((user: any) => user.username === username) || null;
}

export async function getChatHistory(token: string, section: string): Promise<ChatHistory> {
  const key = `chat:${token}:${section}`;
  const history = await kv.get<ChatHistory>(key);
  return history || { history: [], title: null };
}

export async function saveChatHistory(token: string, section: string, history: ChatHistory): Promise<void> {
  const key = `chat:${token}:${section}`;
  await kv.set(key, history);
}

export async function deleteChatHistory(token: string, section: string): Promise<void> {
  const key = `chat:${token}:${section}`;
  await kv.del(key);
}