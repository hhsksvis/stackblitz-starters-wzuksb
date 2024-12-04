import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUser, createUser, getUserByUsername } from '@/lib/db';
import { generateToken, validateUsername } from '@/lib/utils';

const usernameSchema = z.object({
  username: z.string().min(1).optional(),
  token: z.string().min(1).optional(),
}).refine(data => data.username || data.token, {
  message: "Either username or token must be provided"
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = usernameSchema.parse({
      username: searchParams.get('username'),
      token: searchParams.get('token'),
    });

    if (params.username) {
      if (!validateUsername(params.username)) {
        return NextResponse.json({ error: "Invalid username" }, { status: 400 });
      }

      const existingUser = await getUserByUsername(params.username);
      if (existingUser) {
        return NextResponse.json({ error: "Username already exists" }, { status: 400 });
      }

      const token = generateToken();
      await createUser(params.username, token);
      return NextResponse.json({ token, username: params.username });
    }

    if (params.token) {
      const user = await getUser(params.token);
      if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ username: user.username });
    }

    return NextResponse.json(
      { error: "Either 'username' or 'token' is required" },
      { status: 400 }
    );
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