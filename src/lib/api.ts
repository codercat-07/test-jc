import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, ValidationError, DatabaseError, ConflictError } from './errors';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse<T>(data: T, meta?: PaginationMeta) {
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
}

export function errorResponse(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(error);
    return NextResponse.json(
      { success: false, error: validationError.message, code: validationError.code, details: error.issues },
      { status: validationError.statusCode }
    );
  }

  // Handle Prisma errors via duck typing to avoid importing PrismaClient explicitly here if possible,
  // or catch codes if Prisma is available in context.
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const prismaError = error as { code: string; message: string };
    if (prismaError.code === 'P2002') {
      const conflict = new ConflictError('A record with this value already exists.');
      return NextResponse.json(
        { success: false, error: conflict.message, code: conflict.code },
        { status: conflict.statusCode }
      );
    }
    if (prismaError.code === 'P2025') {
      const notFound = new NotFoundError('Record');
      return NextResponse.json(
        { success: false, error: notFound.message, code: notFound.code },
        { status: notFound.statusCode }
      );
    }
  }

  const dbError = new DatabaseError('An unexpected server error occurred.');
  return NextResponse.json(
    { success: false, error: dbError.message, code: dbError.code },
    { status: dbError.statusCode }
  );
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take, page, limit };
}
