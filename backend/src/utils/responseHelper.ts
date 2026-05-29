import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

// Success response
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

// Error response
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: string[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};

// Paginated response
export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  total: number,
  page: number,
  limit: number
): Response => {
  const totalPages = Math.ceil(total / limit);
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
  return res.status(200).json(response);
};