import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  token: z.string().min(1, 'Token is required'),
  section: z.string().optional(),
  useHistory: z.boolean().default(true),
});

export const usernameSchema = z.object({
  username: z.string().min(1).optional(),
  token: z.string().min(1).optional(),
}).refine(data => data.username || data.token, {
  message: "Either username or token must be provided"
});

export const historySchema = z.object({
  token: z.string().min(1, 'Token is required'),
  section: z.string().min(1, 'Section is required'),
  delete: z.string().optional(),
});

export const conversationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  section: z.string().min(1, 'Section is required'),
});