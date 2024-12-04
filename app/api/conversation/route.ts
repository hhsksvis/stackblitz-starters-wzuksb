import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUser, getChatHistory } from '@/lib/db';
import { formatChatHistory } from '@/lib/utils';

const conversationSchema = z.object({
  token: z.string().min(1),
  section: z.string().min(1),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { token, section } = conversationSchema.parse({
      token: searchParams.get('token'),
      section: searchParams.get('section'),
    });

    const user = await getUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const history = await getChatHistory(token, section);
    const conversation = formatChatHistory(history.history, user.username);

    return NextResponse.json({ conversation, title: history.title });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}