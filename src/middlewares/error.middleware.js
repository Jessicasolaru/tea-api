import { AppError, InternalServerError } from "../utils/errors.util.js";
import { Logger } from "../utils/logger.util.js";

const logger = new Logger("ERROR");

export const errorHandler = (err, req, res, next) => {
  if (!(err instanceof AppError)) {
    err = new InternalServerError(
      err.message || "Error inesperado",
      "Contacta al equipo de desarrollo",
    );
  }

  logger.error(`${err.statusCode} - ${err.message}`);

  res.status(err.statusCode).json({
    message: err.message,
    statusCode: err.statusCode,
    error: err.details,
  });
};
