import { NextRequest } from 'next/server';
import { getUser, getChatHistory, saveChatHistory } from '@/lib/db';
import { generateChatResponse, generateTitle } from '@/lib/ai';
import { getCurrentDate } from '@/lib/utils';
import { chatSchema } from '@/lib/api/validation';
import { successResponse, handleApiError } from '@/lib/api/responses';
import { rateLimit } from '@/lib/api/middleware';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(req);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const body = await req.json();
    const { message, token, section, useHistory } = chatSchema.parse(body);

    const user = await getUser(token);
    if (!user) {
      return handleApiError(new Error('Invalid token'));
    }

    let history = { history: [], title: null };
    if (useHistory && section) {
      history = await getChatHistory(token, section);
    }

    const systemInstruction = `Current date: ${getCurrentDate()}\nCurrent User: ${user.username}`;
    const response = await generateChatResponse(message, history.history, systemInstruction);

    if (useHistory && section) {
      history.history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      );

      if (!history.title && history.history.length === 2) {
        history.title = await generateTitle(message);
      }

      await saveChatHistory(token, section, history);
    }

    return successResponse({ response });
  } catch (error) {
    return handleApiError(error);
  }
}