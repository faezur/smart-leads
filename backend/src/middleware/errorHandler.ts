import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { sendError } from '../utils/responseHelper';

interface MongoDuplicateKeyError extends Error {
  code?: number;
}

const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // MongoDB duplicate key error
  if ((err as MongoDuplicateKeyError).code === 11000) {
    sendError(res, 'Email already exists', 400);
    return;
  }

  console.error('Unexpected error:', err);
  sendError(res, 'Internal server error', 500);
};

export default errorHandler;
