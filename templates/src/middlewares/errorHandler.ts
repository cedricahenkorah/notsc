import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api-response';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  const response: ApiResponse = {
    status: 'error',
    code: statusCode,
    message,
  };

  res.status(statusCode).json(response);
};
