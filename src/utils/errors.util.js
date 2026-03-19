export class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message, details) {
    super(message || "No encontrado", 404, details);
  }
}

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message || "Error de validación", 400, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message, details) {
    super(message || "Error interno del servidor", 500, details);
  }
}
