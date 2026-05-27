import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { sendError } from '../utils/responseHelper';

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

  console.error('Unexpected error:', err);
  sendError(res, 'Internal server error', 500);
};

export default errorHandler;
