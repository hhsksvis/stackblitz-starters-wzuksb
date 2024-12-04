import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUser, getChatHistory, deleteChatHistory } from '@/lib/db';

const historySchema = z.object({
  token: z.string().min(1),
  section: z.string().min(1),
  delete: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const { token, section, delete: deleteHistory } = historySchema.parse({
      token: searchParams.get('token'),
      section: searchParams.get('section'),
      delete: searchParams.get('delete'),
    });

    const user = await getUser(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (deleteHistory === 'true') {
      await deleteChatHistory(token, section);
      return NextResponse.json({
        message: `History for section ${section} deleted successfully`,
      });
    }

    const history = await getChatHistory(token, section);
    return NextResponse.json(history);
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