// -------------------------------------------------------------------------
// Base
// -------------------------------------------------------------------------

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// -------------------------------------------------------------------------
// 4xx Client Errors
// -------------------------------------------------------------------------

/** 400 — Request is malformed or contains invalid data */
export class BadRequestError extends AppError {
  constructor(message = "Bad request.") {
    super(message, "BAD_REQUEST", 400);
  }
}

/** 401 — No valid session or token present */
export class UnauthenticatedError extends AppError {
  constructor(message = "You must be logged in to access this resource.") {
    super(message, "UNAUTHENTICATED", 401);
  }
}

/** 403 — Authenticated but lacks permission */
export class UnauthorizedError extends AppError {
  constructor(message = "You don't have permission to perform this action.") {
    super(message, "UNAUTHORIZED", 403);
  }
}

/** 404 — Resource does not exist */
export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(message, "NOT_FOUND", 404);
  }
}

/** 409 — Resource already exists or state conflict */
export class ConflictError extends AppError {
  constructor(message = "A conflict occurred with the current state of the resource.") {
    super(message, "CONFLICT", 409);
  }
}

/** 422 — Request is well-formed but contains semantic errors */
export class ValidationError extends AppError {
  constructor(message = "Validation failed.") {
    super(message, "VALIDATION_ERROR", 422);
  }
}

/** 429 — Too many requests */
export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}

// -------------------------------------------------------------------------
// 5xx Server Errors
// -------------------------------------------------------------------------

/** 500 — Unexpected server-side failure */
export class InternalServerError extends AppError {
  constructor(message = "An unexpected error occurred. Please try again later.") {
    super(message, "INTERNAL_SERVER_ERROR", 500);
  }
}

/** 503 — Downstream service (DB, Redis, etc.) is unavailable */
export class ServiceUnavailableError extends AppError {
  constructor(message = "The service is temporarily unavailable. Please try again later.") {
    super(message, "SERVICE_UNAVAILABLE", 503);
  }
}

// -------------------------------------------------------------------------
// Type guard
// -------------------------------------------------------------------------

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// -------------------------------------------------------------------------
// Helper function to extract error message from error object
// -------------------------------------------------------------------------

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
