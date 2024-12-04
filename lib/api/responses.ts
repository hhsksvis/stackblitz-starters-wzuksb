import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiResponse } from '../types';

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

export function errorResponse(
  message: string,
  status: number = 500,
  errors?: any
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return errorResponse('Validation error', 400, error.errors);
  }

  if (error instanceof Error) {
    return errorResponse(error.message);
  }

  return errorResponse('An unexpected error occurred');
}