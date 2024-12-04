import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { config } from '../config';

interface RateLimitResult {
  success: boolean;
  response?: NextResponse;
}

export async function rateLimit(req: NextRequest): Promise<RateLimitResult> {
  const ip = req.ip ?? '127.0.0.1';
  const minute = Math.floor(Date.now() / 60000);
  
  const minuteKey = `ratelimit:${ip}:${minute}`;
  const hourKey = `ratelimit:${ip}:${Math.floor(minute / 60)}`;

  const [minuteCount, hourCount] = await Promise.all([
    kv.incr(minuteKey),
    kv.incr(hourKey),
  ]);

  await Promise.all([
    kv.expire(minuteKey, 60),
    kv.expire(hourKey, 3600),
  ]);

  if (minuteCount > config.rateLimits.messagesPerMinute) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests per minute' },
        { status: 429 }
      ),
    };
  }

  if (hourCount > config.rateLimits.messagesPerHour) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests per hour' },
        { status: 429 }
      ),
    };
  }

  return { success: true };
}