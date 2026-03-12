export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

import { ZodError } from 'zod';
export class ValidationError extends AppError {
  public errors: any;
  constructor(error: ZodError) {
    super('Validation failed', 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
    this.errors = error.issues;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict detected') {
    super(message, 'CONFLICT_ERROR', 409);
    this.name = 'ConflictError';
  }
}
