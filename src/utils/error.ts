export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = "AppError",
  ) {
    super(message); // first line, always
    this.name = code;
  }
}
export class NotFoundError extends AppError {
  constructor(what = "Resource") {
    super(404, `${what} not found`, "NotFound");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, "Conflict");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(401, message, "Unauthorized");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do this") {
    super(403, message, "Forbidden");
  }
}
