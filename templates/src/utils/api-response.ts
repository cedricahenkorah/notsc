import { Response } from 'express';

export type ApiResponse<T = undefined> = {
  status: 'success' | 'error';
  code: number;
  message?: string;
  data?: T;
};

export function successResponse<T>(
  res: Response,
  code: number,
  message?: string,
  data?: T
): void {
  const response: ApiResponse<T> = {
    status: 'success',
    code,
    message: message || 'success',
    data,
  };
  res.status(code).json(response);
}

export function errorResponse(
  res: Response,
  code: number,
  message: string
): void {
  const response: ApiResponse = { status: 'error', code, message };
  res.status(code).json(response);
}
